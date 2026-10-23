export interface Institution {
  id: string;
  name: string;
  code: string;
  badge: string;
  location: string;
  deanPlacement: string;
  contactEmail: string;
  logoUrl?: string;
  accentColor: string;
  accentBg: string;
  tagline: string;
  studentCount: number;
  placementRate: number;
  highestPackage: string;
  averagePackage: string;
}

export interface JobDrive {
  id: string;
  institutionId: string; // multi-tenant scoping
  companyName: string;
  companyLogo: string;
  role: string;
  ctc: string; // e.g. "18.5 LPA"
  stipend?: string; // e.g. "80,000 / month"
  location: string;
  jobType: 'Full-time' | 'Internship' | 'Intern + FTE';
  category: 'Dream' | 'Super Dream' | 'Core' | 'Mass Recruit';
  eligibilityCgpa: number;
  eligibleBranches: string[];
  batch: string; // "2025" or "2026"
  deadline: string; // ISO date string
  driveDate: string; // Date of test/interview
  description: string;
  skillsRequired: string[];
  rounds: {
    roundNumber: number;
    name: string;
    type: 'Online Aptitude' | 'Technical Round 1' | 'System Design' | 'HR Round' | 'Group Discussion';
    scheduledDate: string;
  }[];
  status: 'Open' | 'Closing Soon' | 'In Progress' | 'Completed';
  applicantCount: number;
  hiredCount?: number;
}

export interface Application {
  id: string;
  institutionId: string;
  driveId: string;
  companyName: string;
  role: string;
  ctc: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  branch: string;
  cgpa: number;
  appliedAt: string;
  currentRound: string;
  status: 'Applied' | 'Shortlisted for Test' | 'Test Cleared' | 'Technical Interview' | 'Offer Extended' | 'Rejected';
  updatedAt: string;
  notes?: string;
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal' | 'Core CS & Data Structures';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  id: string;
  studentEmail: string;
  studentName: string;
  institutionId: string;
  category: string;
  score: number;
  total: number;
  percentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  breakdown: {
    questionText: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
}

export interface ResumeReviewResult {
  id?: string;
  studentEmail: string;
  studentName: string;
  institutionId: string;
  targetRole: string;
  targetCompany?: string;
  atsScore: number;
  summaryVerdict: string;
  strengths: string[];
  criticalFixes: string[];
  missingKeywords: string[];
  bulletPointImprovements: {
    original: string;
    improved: string;
    impact: string;
  }[];
  reviewedAt: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  feedback?: {
    strengths: string;
    improvements: string;
    scoreOutOfTen: number;
  };
}

export interface MockInterviewSession {
  id: string;
  studentEmail: string;
  studentName: string;
  institutionId: string;
  role: string;
  companyType: string;
  difficulty: 'Standard' | 'Challenging' | 'FAANG Tier';
  transcript: InterviewMessage[];
  overallScore?: number;
  finalFeedback?: {
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
    executiveSummary: string;
    actionableAdvice: string[];
  };
  status: 'in-progress' | 'completed';
  startedAt: string;
  completedAt?: string;
}

export interface EmailNotification {
  id: string;
  institutionId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'DEADLINE_ALERT' | 'STATUS_UPDATE' | 'NEW_DRIVE' | 'INTERVIEW_CALL' | 'OFFER_LETTER';
  previewText: string;
  bodyHtml: string;
  sentAt: string;
  read: boolean;
  driveId?: string;
  companyName?: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  rollNumber: string;
  institutionId: string;
  branch: string;
  batch: string;
  cgpa: number;
  phone: string;
  skills: string[];
  resumeText: string;
}
