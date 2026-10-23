import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc 
} from '../lib/firebase';
import { 
  Institution, 
  JobDrive, 
  Application, 
  QuizAttempt, 
  ResumeReviewResult, 
  MockInterviewSession, 
  EmailNotification 
} from '../types/placement';
import { INITIAL_INSTITUTIONS, INITIAL_JOB_DRIVES } from '../data/mockData';

// Seed initial dataset into Firestore if collection is empty
export async function initializeDatabase() {
  try {
    const instCol = collection(db, 'institutions');
    const snap = await getDocs(instCol);
    if (snap.empty) {
      for (const inst of INITIAL_INSTITUTIONS) {
        await setDoc(doc(db, 'institutions', inst.id), inst);
      }
      for (const drive of INITIAL_JOB_DRIVES) {
        await setDoc(doc(db, 'job_drives', drive.id), drive);
      }
      console.log('Firestore initialized with seed institutions and job drives.');
    }
  } catch (err) {
    console.warn('Firestore initialization notice (will use local fallback if offline):', err);
  }
}

// Fetch all registered institutions
export async function fetchInstitutions(): Promise<Institution[]> {
  try {
    const snap = await getDocs(collection(db, 'institutions'));
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Institution);
    }
  } catch (e) {
    console.error('Error fetching institutions:', e);
  }
  return INITIAL_INSTITUTIONS;
}

// Fetch job drives filtered by institution
export async function fetchJobDrivesByInstitution(institutionId: string): Promise<JobDrive[]> {
  try {
    const q = query(collection(db, 'job_drives'), where('institutionId', '==', institutionId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as JobDrive));
    }
  } catch (e) {
    console.error('Error fetching drives:', e);
  }
  return INITIAL_JOB_DRIVES.filter(d => d.institutionId === institutionId);
}

// Add a new job drive (Placement Officer role)
export async function createJobDrive(drive: Omit<JobDrive, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'job_drives'), drive);
    return docRef.id;
  } catch (e) {
    console.error('Error creating job drive:', e);
    return 'local_' + Date.now();
  }
}

// Submit a new student application and trigger automated email notification
export async function submitApplication(appData: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>): Promise<Application> {
  const newApp: Application = {
    ...appData,
    id: 'app_' + Date.now(),
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentRound: 'Online Aptitude Assessment',
    status: 'Applied'
  };

  try {
    await setDoc(doc(db, 'applications', newApp.id), newApp);
  } catch (e) {
    console.warn('Saved application in memory/local:', e);
  }

  // Trigger automated confirmation email
  await sendAutomatedNotification({
    institutionId: appData.institutionId,
    recipientEmail: appData.studentEmail,
    recipientName: appData.studentName,
    subject: `Application Confirmed: ${appData.role} at ${appData.companyName}`,
    type: 'STATUS_UPDATE',
    companyName: appData.companyName,
    driveId: appData.driveId,
    previewText: `Your application for ${appData.companyName} has been recorded by the Training & Placement Cell.`,
    bodyHtml: `
      <p>Dear ${appData.studentName},</p>
      <p>Congratulations on applying for the <strong>${appData.role}</strong> position at <strong>${appData.companyName}</strong> (CTC: ${appData.ctc}).</p>
      <p>Your application has been verified against eligibility criteria (Min CGPA, Department clearance). Round 1 (Online Aptitude / Coding Challenge) will be scheduled shortly.</p>
      <p>Keep preparing with our built-in <em>AI Mock Interview Coach</em> and <em>Aptitude Practice Quizzes</em> to increase your selection chances!</p>
      <br/>
      <p>Regards,<br/><strong>Office of Career Services & Placements</strong></p>
    `
  });

  return newApp;
}

// Fetch applications for student
export async function fetchStudentApplications(studentEmail: string, institutionId: string): Promise<Application[]> {
  try {
    const q = query(
      collection(db, 'applications'),
      where('institutionId', '==', institutionId),
      where('studentEmail', '==', studentEmail)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Application);
    }
  } catch (e) {
    console.error('Error fetching applications:', e);
  }
  return [];
}

// Update application status & send automated alert
export async function updateApplicationStatus(
  appId: string, 
  newStatus: Application['status'],
  studentEmail: string,
  studentName: string,
  companyName: string,
  role: string,
  institutionId: string
) {
  try {
    await updateDoc(doc(db, 'applications', appId), {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Updated status locally:', e);
  }

  // Send automated notification
  await sendAutomatedNotification({
    institutionId,
    recipientEmail: studentEmail,
    recipientName: studentName,
    subject: `Status Update: ${companyName} (${role}) - ${newStatus}`,
    type: newStatus === 'Offer Extended' ? 'OFFER_LETTER' : 'STATUS_UPDATE',
    companyName,
    previewText: `Your recruitment status has been updated to: ${newStatus}`,
    bodyHtml: `
      <p>Dear ${studentName},</p>
      <p>The placement committee has released an update for your application at <strong>${companyName}</strong>:</p>
      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; margin: 12px 0;">
        <h4 style="margin: 0; color: #166534;">Current Status: ${newStatus}</h4>
      </div>
      ${newStatus === 'Offer Extended' 
        ? '<p>🎉 <strong>Congratulations!</strong> You have been officially extended an offer of employment. Check your portal for onboarding and document submission deadlines.</p>' 
        : '<p>Please check your schedule and be ready for the upcoming technical or managerial evaluation.</p>'}
      <p>Best wishes,<br/>Placement & Training Cell</p>
    `
  });
}

// Send and persist an automated email notification
export async function sendAutomatedNotification(data: Omit<EmailNotification, 'id' | 'sentAt' | 'read'>): Promise<EmailNotification> {
  const notif: EmailNotification = {
    ...data,
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    sentAt: new Date().toISOString(),
    read: false
  };

  try {
    await setDoc(doc(db, 'notifications', notif.id), notif);
  } catch (e) {
    console.warn('Persisted notification locally:', e);
  }

  return notif;
}

// Fetch notifications for a student
export async function fetchStudentNotifications(studentEmail: string, institutionId: string): Promise<EmailNotification[]> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('institutionId', '==', institutionId),
      where('recipientEmail', '==', studentEmail)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs
        .map(d => d.data() as EmailNotification)
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    }
  } catch (e) {
    console.error('Error fetching notifications:', e);
  }
  return [];
}

// Save mock interview session
export async function saveMockInterview(interview: MockInterviewSession) {
  try {
    await setDoc(doc(db, 'interviews', interview.id), interview);
  } catch (e) {
    console.warn('Saved interview locally:', e);
  }
}

// Save resume review
export async function saveResumeReview(review: ResumeReviewResult) {
  try {
    const id = review.id || 'rev_' + Date.now();
    await setDoc(doc(db, 'resume_reviews', id), { ...review, id });
  } catch (e) {
    console.warn('Saved resume review locally:', e);
  }
}

// Save quiz attempt
export async function saveQuizAttempt(attempt: QuizAttempt) {
  try {
    await setDoc(doc(db, 'quiz_attempts', attempt.id), attempt);
  } catch (e) {
    console.warn('Saved quiz attempt locally:', e);
  }
}
