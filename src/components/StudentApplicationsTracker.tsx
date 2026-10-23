import React, { useState } from 'react';
import { Application, Institution, StudentProfile } from '../types/placement';
import { 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  Briefcase, 
  Award, 
  ArrowUpRight 
} from 'lucide-react';

interface StudentApplicationsTrackerProps {
  institution: Institution;
  student: StudentProfile;
  applications: Application[];
  onOpenMockCoach: (role: string, company: string) => void;
  onOpenAptitude: () => void;
}

export const StudentApplicationsTracker: React.FC<StudentApplicationsTrackerProps> = ({
  institution,
  student,
  applications,
  onOpenMockCoach,
  onOpenAptitude
}) => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Offer Extended':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Technical Interview':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Test Cleared':
      case 'Shortlisted for Test':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-xs border border-indigo-500/20 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Recruitment Funnel & Round Progression
          </div>
          <h2 className="text-2xl font-black text-white">My Active Placement Applications</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Track round clearance, automated status updates, online test schedules, and offer letters issued across companies for {institution.code}.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <div>
            <p className="text-[11px] text-slate-400">Total Applied</p>
            <p className="text-xl font-bold text-white">{applications.length}</p>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <p className="text-[11px] text-slate-400">Interviews Active</p>
            <p className="text-xl font-bold text-purple-400">
              {applications.filter(a => a.status === 'Technical Interview' || a.status === 'Shortlisted for Test').length}
            </p>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <p className="text-[11px] text-slate-400">Offers</p>
            <p className="text-xl font-bold text-emerald-400">
              {applications.filter(a => a.status === 'Offer Extended').length}
            </p>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-lg text-white">
                  {app.companyName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{app.companyName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-400 font-medium">{app.role}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Package: <strong className="text-emerald-400">{app.ctc}</strong> • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => onOpenMockCoach(app.role, app.companyName)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Award className="w-3.5 h-3.5" />
                  Mock Coach
                </button>
                <button
                  onClick={onOpenAptitude}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Test Practice
                </button>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse through active campus drives on the "Job Drives" tab and apply with one click to trigger eligibility check and automated email tracking.
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedApp.companyName}</h3>
                <p className="text-xs text-indigo-400">{selectedApp.role}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-slate-400">Current Recruitment Stage:</span>
                <p className="text-sm font-bold text-emerald-400">{selectedApp.status}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800/40 rounded-xl">
                  <span className="text-slate-400">Package (CTC):</span>
                  <p className="font-bold text-white mt-0.5">{selectedApp.ctc}</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl">
                  <span className="text-slate-400">Candidate Roll No:</span>
                  <p className="font-bold text-white mt-0.5">{selectedApp.studentRoll}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl">
                <span className="text-slate-400">Last Status Update:</span>
                <p className="text-slate-200 mt-0.5">{new Date(selectedApp.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
