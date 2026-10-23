import React, { useState } from 'react';
import { Institution, StudentProfile } from '../types/placement';
import { 
  Building2, 
  ChevronDown, 
  MapPin, 
  GraduationCap, 
  Mail, 
  User, 
  Award,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  institutions: Institution[];
  selectedInstitution: Institution;
  onSelectInstitution: (inst: Institution) => void;
  student: StudentProfile;
  onUpdateStudent: (student: StudentProfile) => void;
  unreadNotifsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  institutions,
  selectedInstitution,
  onSelectInstitution,
  student,
  unreadNotifsCount
}) => {
  const [showInstDropdown, setShowInstDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const tabs = [
    { id: 'drives', label: 'Job Drives', badge: null },
    { id: 'interview', label: 'AI Mock Interview', badge: 'Gemini' },
    { id: 'aptitude', label: 'Aptitude Practice', badge: 'Timer' },
    { id: 'resume', label: 'Resume Reviewer', badge: 'ATS AI' },
    { id: 'applications', label: 'My Applications', badge: null },
    { id: 'notifications', label: 'Inbox & Alerts', badge: unreadNotifsCount > 0 ? unreadNotifsCount : null },
    { id: 'admin', label: 'TPO Portal', badge: 'Officer' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Banner with Multi-Tenant Institution Selector & Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Placement Season 2025-26 Live
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedInstitution.location}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              Dean / TPO: <strong className="text-slate-200 ml-1">{selectedInstitution.deanPlacement}</strong>
            </span>
          </div>

          {/* Institution Switcher Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowInstDropdown(!showInstDropdown)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-750 rounded-lg text-slate-200 border border-slate-700 transition hover:border-indigo-500/50"
              title="Switch Campus / University Portal"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">{selectedInstitution.code}</span>
              <span className="text-slate-400 hidden sm:inline">- {selectedInstitution.name.split(',')[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showInstDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showInstDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 p-2">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Multi-Tenant Campus Switcher</p>
                  <p className="text-[11px] text-slate-500">Each campus manages isolated recruitment drives & rules</p>
                </div>
                <div className="space-y-1 mt-1">
                  {institutions.map(inst => (
                    <button
                      key={inst.id}
                      onClick={() => {
                        onSelectInstitution(inst);
                        setShowInstDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition flex items-start gap-3 ${
                        inst.id === selectedInstitution.id
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${inst.accentBg} text-white shrink-0`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate">{inst.name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 ml-2">
                            {inst.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{inst.tagline}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                          <span>Avg: <strong className="text-emerald-400">{inst.averagePackage}</strong></span>
                          <span>Max: <strong className="text-amber-400">{inst.highestPackage}</strong></span>
                          <span>Placement: <strong>{inst.placementRate}%</strong></span>
                        </div>
                      </div>
                      {inst.id === selectedInstitution.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="flex items-center justify-between py-3.5">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('drives')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Placement AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Career Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Campus Placement & Prep Suite
              </p>
            </div>
          </div>

          {/* Student Profile Quick View */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-200">{student.name}</p>
              <p className="text-xs text-slate-400">{student.branch} • CGPA {student.cgpa}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center ring-2 ring-indigo-500/30">
              {student.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
