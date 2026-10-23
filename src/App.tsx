import React, { useState, useEffect } from 'react';
import { 
  Institution, 
  JobDrive, 
  Application, 
  EmailNotification, 
  StudentProfile 
} from './types/placement';
import { INITIAL_INSTITUTIONS } from './data/mockData';
import { 
  initializeDatabase, 
  fetchInstitutions, 
  fetchJobDrivesByInstitution, 
  submitApplication, 
  fetchStudentApplications, 
  fetchStudentNotifications, 
  sendAutomatedNotification 
} from './services/placementService';
import { Navbar } from './components/Navbar';
import { JobDrivesDashboard } from './components/JobDrivesDashboard';
import { AIMockInterviewCoach } from './components/AIMockInterviewCoach';
import { AptitudePracticeQuiz } from './components/AptitudePracticeQuiz';
import { ResumeReviewer } from './components/ResumeReviewer';
import { StudentApplicationsTracker } from './components/StudentApplicationsTracker';
import { NotificationsInbox } from './components/NotificationsInbox';
import { PlacementOfficerAdmin } from './components/PlacementOfficerAdmin';

export default function App() {
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>(INITIAL_INSTITUTIONS[0]);
  const [currentTab, setCurrentTab] = useState<string>('drives');
  
  // Student Profile state (Defaulting to user's registered context)
  const [student, setStudent] = useState<StudentProfile>({
    name: 'Dharineesh R',
    email: 'dharineesh1701@gmail.com',
    rollNumber: '21CS084',
    institutionId: INITIAL_INSTITUTIONS[0].id,
    branch: 'Computer Science',
    batch: '2025',
    cgpa: 8.85,
    phone: '+91 98765 43210',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Algorithms', 'System Design'],
    resumeText: ''
  });

  const [jobDrives, setJobDrives] = useState<JobDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [mockPrepRole, setMockPrepRole] = useState<{ role: string; company: string }>({
    role: 'Software Development Engineer',
    company: 'Google'
  });

  // Initialize Firebase Firestore and seed data on initial mount
  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      const insts = await fetchInstitutions();
      if (insts && insts.length > 0) {
        setInstitutions(insts);
        setSelectedInstitution(insts[0]);
      }
    };
    init();
  }, []);

  // Reload drives and user data whenever the institution switches
  const loadTenantData = async (instId: string) => {
    const drives = await fetchJobDrivesByInstitution(instId);
    setJobDrives(drives);

    const apps = await fetchStudentApplications(student.email, instId);
    setApplications(apps);

    const notifs = await fetchStudentNotifications(student.email, instId);
    setNotifications(notifs);
  };

  useEffect(() => {
    loadTenantData(selectedInstitution.id);
  }, [selectedInstitution, student.email]);

  // Handle student applying to a job drive
  const handleApplyDrive = async (drive: JobDrive) => {
    const newApp = await submitApplication({
      institutionId: selectedInstitution.id,
      driveId: drive.id,
      companyName: drive.companyName,
      role: drive.role,
      ctc: drive.ctc,
      studentName: student.name,
      studentEmail: student.email,
      studentRoll: student.rollNumber,
      branch: student.branch,
      cgpa: student.cgpa,
      currentRound: 'Online Coding Challenge',
      status: 'Applied'
    });

    setApplications(prev => [newApp, ...prev]);

    // Refresh notifications to show confirmation email immediately
    const notifs = await fetchStudentNotifications(student.email, selectedInstitution.id);
    setNotifications(notifs);
  };

  // Launch mock interview with prefilled role/company from a job drive
  const handleOpenMockForRole = (role: string, company: string) => {
    setMockPrepRole({ role, company });
    setCurrentTab('interview');
  };

  // Mark notification as read
  const handleMarkAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  // Send a test deadline email alert
  const handleSendTestNotification = async () => {
    const targetDrive = jobDrives[0] || { companyName: 'Google', role: 'Software Engineer', ctc: '₹44.5 LPA' };
    const notif = await sendAutomatedNotification({
      institutionId: selectedInstitution.id,
      recipientEmail: student.email,
      recipientName: student.name,
      subject: `🚨 Urgent: 24 Hours Left to Apply for ${targetDrive.companyName}`,
      type: 'DEADLINE_ALERT',
      companyName: targetDrive.companyName,
      previewText: `Application deadline is closing within 24 hours for ${targetDrive.role}.`,
      bodyHtml: `
        <p>Dear ${student.name},</p>
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 12px 0;">
          <h4 style="margin: 0; color: #991b1b;">⚠️ Application Deadline Alert</h4>
          <p style="margin: 4px 0 0 0; color: #b91c1c;">The application window for <strong>${targetDrive.companyName} (${targetDrive.role})</strong> closes tomorrow at 11:59 PM.</p>
        </div>
        <p>Eligible candidates who have not yet submitted their applications will not be permitted into Round 1 of the Online Assessment.</p>
        <p>Ensure your resume is reviewed using the portal's AI ATS engine before final submission.</p>
        <br/>
        <p>Best regards,<br/><strong>Central Placement Office</strong><br/>${selectedInstitution.name}</p>
      `
    });

    setNotifications(prev => [notif, ...prev]);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Navigation with Multi-Tenant Institution Selector */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        institutions={institutions}
        selectedInstitution={selectedInstitution}
        onSelectInstitution={(inst) => setSelectedInstitution(inst)}
        student={student}
        onUpdateStudent={setStudent}
        unreadNotifsCount={unreadNotifsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'drives' && (
          <JobDrivesDashboard
            institution={selectedInstitution}
            jobDrives={jobDrives}
            student={student}
            appliedDriveIds={applications.map(a => a.driveId)}
            onApply={handleApplyDrive}
            onOpenMockInterviewForRole={handleOpenMockForRole}
          />
        )}

        {currentTab === 'interview' && (
          <AIMockInterviewCoach
            institution={selectedInstitution}
            student={student}
            initialRole={mockPrepRole.role}
            initialCompany={mockPrepRole.company}
          />
        )}

        {currentTab === 'aptitude' && (
          <AptitudePracticeQuiz
            institution={selectedInstitution}
            student={student}
          />
        )}

        {currentTab === 'resume' && (
          <ResumeReviewer
            institution={selectedInstitution}
            student={student}
          />
        )}

        {currentTab === 'applications' && (
          <StudentApplicationsTracker
            institution={selectedInstitution}
            student={student}
            applications={applications}
            onOpenMockCoach={handleOpenMockForRole}
            onOpenAptitude={() => setCurrentTab('aptitude')}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsInbox
            institution={selectedInstitution}
            student={student}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onSendTestNotification={handleSendTestNotification}
          />
        )}

        {currentTab === 'admin' && (
          <PlacementOfficerAdmin
            institution={selectedInstitution}
            jobDrives={jobDrives}
            applications={applications}
            onRefreshData={() => loadTenantData(selectedInstitution.id)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Placement AI - Multi-Tenant Campus Career Portal & Preparation Suite</p>
          <div className="flex items-center gap-4">
            <span>Tenant: <strong className="text-slate-300">{selectedInstitution.name}</strong></span>
            <span>Firestore: <strong className="text-emerald-400">Connected</strong></span>
            <span>Gemini 2.5: <strong className="text-indigo-400">Active</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
