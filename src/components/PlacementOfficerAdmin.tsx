import React, { useState } from 'react';
import { Institution, JobDrive, Application } from '../types/placement';
import { createJobDrive, updateApplicationStatus, sendAutomatedNotification } from '../services/placementService';
import { 
  Building2, 
  PlusCircle, 
  Send, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Briefcase 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlacementOfficerAdminProps {
  institution: Institution;
  jobDrives: JobDrive[];
  applications: Application[];
  onRefreshData: () => void;
}

export const PlacementOfficerAdmin: React.FC<PlacementOfficerAdminProps> = ({
  institution,
  jobDrives,
  applications,
  onRefreshData
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCtc, setNewCtc] = useState('');
  const [newCategory, setNewCategory] = useState<'Super Dream' | 'Dream' | 'Core'>('Super Dream');
  const [newCgpa, setNewCgpa] = useState(7.5);
  const [newDeadlineDays, setNewDeadlineDays] = useState(3);
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Status update state
  const [targetAppId, setTargetAppId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Application['status']>('Technical Interview');

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole || !newCtc) return;

    setSubmitting(true);
    try {
      const deadlineDate = new Date(Date.now() + newDeadlineDays * 24 * 3600 * 1000).toISOString();
      await createJobDrive({
        institutionId: institution.id,
        companyName: newCompany,
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
        role: newRole,
        ctc: newCtc,
        location: 'Bengaluru / Hyderabad',
        jobType: 'Full-time',
        category: newCategory,
        eligibilityCgpa: newCgpa,
        eligibleBranches: ['Computer Science', 'Information Tech', 'Electronics & Comm'],
        batch: '2025',
        deadline: deadlineDate,
        driveDate: new Date(Date.now() + (newDeadlineDays + 4) * 24 * 3600 * 1000).toISOString().split('T')[0],
        description: newDesc || `Campus placement drive for ${newRole} at ${newCompany}.`,
        skillsRequired: ['Data Structures', 'System Design', 'Algorithms', 'Web Development'],
        rounds: [
          { roundNumber: 1, name: 'Online Coding Assessment', type: 'Online Aptitude', scheduledDate: 'Upcoming' },
          { roundNumber: 2, name: 'Technical Interview', type: 'Technical Round 1', scheduledDate: 'Upcoming' },
          { roundNumber: 3, name: 'HR & Cultural Round', type: 'HR Round', scheduledDate: 'Upcoming' }
        ],
        status: 'Open',
        applicantCount: 0
      });

      // Dispatch global broadcast notification
      await sendAutomatedNotification({
        institutionId: institution.id,
        recipientEmail: 'dharineesh1701@gmail.com',
        recipientName: 'Student Candidate',
        subject: `New Campus Recruitment Drive: ${newCompany} (${newCtc})`,
        type: 'NEW_DRIVE',
        companyName: newCompany,
        previewText: `New drive posted by TPO for ${newRole} with package ${newCtc}.`,
        bodyHtml: `
          <p>Dear Student,</p>
          <p>A new recruitment drive has been activated on the ${institution.code} Placement Portal:</p>
          <ul>
            <li><strong>Company:</strong> ${newCompany}</li>
            <li><strong>Position:</strong> ${newRole}</li>
            <li><strong>CTC Offered:</strong> ${newCtc}</li>
            <li><strong>Eligibility Cutoff:</strong> Min CGPA ${newCgpa}</li>
          </ul>
          <p>Applications close in ${newDeadlineDays} days. Log in to your portal and submit before deadline.</p>
          <p>Best regards,<br/>Training & Placement Cell</p>
        `
      });

      setShowCreateModal(false);
      setNewCompany('');
      setNewRole('');
      setNewCtc('');
      onRefreshData();

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateApplicantStatus = async (app: Application, status: Application['status']) => {
    await updateApplicationStatus(
      app.id,
      status,
      app.studentEmail,
      app.studentName,
      app.companyName,
      app.role,
      institution.id
    );
    onRefreshData();
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 font-semibold text-xs border border-purple-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Training & Placement Officer (TPO) Console
          </div>
          <h2 className="text-2xl font-black text-white">{institution.name} - Placement Cell</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Post new recruitment drives, dispatch automated deadline push alerts, and update applicant progression stages across interview rounds.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          Publish New Job Drive
        </button>
      </div>

      {/* Quick Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Active Campus Drives</p>
          <p className="text-2xl font-black text-white mt-1">{jobDrives.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Managed under {institution.code}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Total Student Applications</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">{applications.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Pending & active candidates</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase font-semibold">Offers Extended</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {applications.filter(a => a.status === 'Offer Extended').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Final selections confirmed</p>
        </div>
      </div>

      {/* Applicant Round Progression & Status Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Candidate Pipeline & Stage Updates (Triggers Automated Emails)
        </h3>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Company & Role</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Advance Recruitment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-800/30">
                    <td className="p-3">
                      <p className="font-bold text-white">{app.studentName}</p>
                      <p className="text-[11px] text-slate-400">{app.studentEmail} • {app.studentRoll}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-200">{app.companyName}</p>
                      <p className="text-[11px] text-indigo-400">{app.role}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleUpdateApplicantStatus(app, 'Shortlisted for Test')}
                          className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/20 transition"
                        >
                          Shortlist Test
                        </button>
                        <button
                          onClick={() => handleUpdateApplicantStatus(app, 'Technical Interview')}
                          className="px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/20 transition"
                        >
                          Tech Round
                        </button>
                        <button
                          onClick={() => handleUpdateApplicantStatus(app, 'Offer Extended')}
                          className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition"
                        >
                          🎉 Extend Offer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            No applicant records yet. Applications submitted by students will appear here for stage advancement.
          </p>
        )}
      </div>

      {/* Publish New Drive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateDrive} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Post Campus Job Drive ({institution.code})</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                placeholder="e.g. Cloud Support Engineer / SDE"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Package (CTC)</label>
                <input
                  type="text"
                  required
                  value={newCtc}
                  onChange={e => setNewCtc(e.target.value)}
                  placeholder="e.g. ₹28.5 LPA"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Min CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCgpa}
                  onChange={e => setNewCgpa(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="Super Dream">Super Dream (&gt;20 LPA)</option>
                  <option value="Dream">Dream (10-20 LPA)</option>
                  <option value="Core">Core Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Application Deadline</label>
                <select
                  value={newDeadlineDays}
                  onChange={e => setNewDeadlineDays(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value={1}>1 Day (Urgent)</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>1 Week</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Role Summary / Requirements</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Key responsibilities and qualifications required..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-indigo-600/30"
              >
                {submitting ? 'Publishing...' : 'Publish & Broadcast Alert'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
