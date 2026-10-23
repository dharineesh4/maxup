import React, { useState } from 'react';
import { JobDrive, Institution, StudentProfile } from '../types/placement';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  Award, 
  Sparkles,
  ExternalLink,
  Users,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JobDrivesDashboardProps {
  institution: Institution;
  jobDrives: JobDrive[];
  student: StudentProfile;
  appliedDriveIds: string[];
  onApply: (drive: JobDrive) => void;
  onOpenMockInterviewForRole: (role: string, company: string) => void;
}

export const JobDrivesDashboard: React.FC<JobDrivesDashboardProps> = ({
  institution,
  jobDrives,
  student,
  appliedDriveIds,
  onApply,
  onOpenMockInterviewForRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Super Dream' | 'Dream' | 'Core'>('All');
  const [selectedDrive, setSelectedDrive] = useState<JobDrive | null>(null);

  // Filter drives
  const filteredDrives = jobDrives.filter(drive => {
    const matchesSearch = 
      drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || drive.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getRemainingTime = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hrs remaining`;
    const days = Math.floor(hours / 24);
    return `${days} days remaining`;
  };

  const isEligible = (drive: JobDrive) => {
    const meetsCgpa = student.cgpa >= drive.eligibilityCgpa;
    const meetsBranch = drive.eligibleBranches.some(b => 
      b.toLowerCase().includes(student.branch.toLowerCase()) || 
      student.branch.toLowerCase().includes(b.toLowerCase())
    );
    return meetsCgpa && meetsBranch;
  };

  const handleApplyClick = (drive: JobDrive) => {
    onApply(drive);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Institution Hero Header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${institution.accentBg} p-6 sm:p-8 text-white shadow-xl`}>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{institution.name} ({institution.code})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Campus Placement & Career Drives
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
            Official recruitment drives for batch of 2025. Apply directly, check round progression, and test your readiness with our Gemini AI Mock Coach.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div>
              <p className="text-[11px] text-white/70">Highest Package</p>
              <p className="text-lg font-bold text-amber-300">{institution.highestPackage}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/70">Average Package</p>
              <p className="text-lg font-bold text-emerald-300">{institution.averagePackage}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/70">Placement Rate</p>
              <p className="text-lg font-bold text-white">{institution.placementRate}%</p>
            </div>
            <div>
              <p className="text-[11px] text-white/70">Active Drives</p>
              <p className="text-lg font-bold text-cyan-300">{jobDrives.length} Openings</p>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search company, role or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Super Dream', 'Dream', 'Core'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrives.map(drive => {
          const applied = appliedDriveIds.includes(drive.id);
          const eligible = isEligible(drive);

          return (
            <div
              key={drive.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-indigo-500/5 group"
            >
              <div>
                {/* Header: Company & Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={drive.companyLogo} 
                      alt={drive.companyName} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 p-0.5 bg-white/5"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                        {drive.companyName}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {drive.location}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    drive.category === 'Super Dream'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : drive.category === 'Dream'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {drive.category}
                  </span>
                </div>

                {/* Role & CTC */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{drive.role}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-extrabold text-emerald-400">{drive.ctc}</span>
                    {drive.stipend && (
                      <span className="text-xs text-slate-400">({drive.stipend})</span>
                    )}
                  </div>
                </div>

                {/* Eligibility Pill */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="text-slate-400">Eligibility:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${
                    eligible 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    Min CGPA {drive.eligibilityCgpa}
                  </span>
                </div>

                {/* Required Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {drive.skillsRequired.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {skill}
                    </span>
                  ))}
                  {drive.skillsRequired.length > 3 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                      +{drive.skillsRequired.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {getRemainingTime(drive.deadline)}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {drive.applicantCount} applied
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenMockInterviewForRole(drive.role, drive.companyName)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-indigo-300 border border-slate-700 transition"
                    title="Practice mock interview with Gemini AI tuned for this role"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI Mock Prep
                  </button>

                  {applied ? (
                    <button
                      disabled
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold cursor-default"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(drive)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition shadow-md ${
                        eligible
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Apply Now
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedDrive(drive)}
                  className="w-full text-center text-[11px] text-slate-400 hover:text-slate-200 pt-1"
                >
                  View Rounds & Selection Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drive Details Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6 text-slate-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img src={selectedDrive.companyLogo} alt={selectedDrive.companyName} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedDrive.companyName}</h3>
                  <p className="text-sm text-indigo-400">{selectedDrive.role}</p>
                  <p className="text-xs text-slate-400">{selectedDrive.location} • {selectedDrive.jobType}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDrive(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Compensation & Package</h4>
              <p className="text-2xl font-black text-emerald-400">{selectedDrive.ctc}</p>
              {selectedDrive.stipend && <p className="text-xs text-slate-400 mt-0.5">Internship Stipend: {selectedDrive.stipend}</p>}
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Job Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedDrive.description}</p>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-3">Interview & Selection Rounds</h4>
              <div className="space-y-3">
                {selectedDrive.rounds.map((round) => (
                  <div key={round.roundNumber} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                        {round.roundNumber}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{round.name}</p>
                        <p className="text-xs text-slate-400">{round.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">
                      {round.scheduledDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">Eligible Academic Branches</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDrive.eligibleBranches.map((br, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {br}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedDrive(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300"
              >
                Close
              </button>
              {!appliedDriveIds.includes(selectedDrive.id) && (
                <button
                  onClick={() => {
                    handleApplyClick(selectedDrive);
                    setSelectedDrive(null);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  Confirm Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
