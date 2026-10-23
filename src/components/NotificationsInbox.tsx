import React, { useState } from 'react';
import { EmailNotification, Institution, StudentProfile } from '../types/placement';
import { 
  Mail, 
  MailOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Send, 
  Bell, 
  Check 
} from 'lucide-react';

interface NotificationsInboxProps {
  institution: Institution;
  student: StudentProfile;
  notifications: EmailNotification[];
  onMarkAsRead: (notifId: string) => void;
  onSendTestNotification: () => void;
}

export const NotificationsInbox: React.FC<NotificationsInboxProps> = ({
  institution,
  student,
  notifications,
  onMarkAsRead,
  onSendTestNotification
}) => {
  const [selectedNotif, setSelectedNotif] = useState<EmailNotification | null>(
    notifications.length > 0 ? notifications[0] : null
  );

  const getTypeBadge = (type: EmailNotification['type']) => {
    switch (type) {
      case 'DEADLINE_ALERT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'OFFER_LETTER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'STATUS_UPDATE':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'NEW_DRIVE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold text-xs border border-indigo-500/20 mb-2">
            <Bell className="w-3.5 h-3.5" />
            Automated Placement Email Dispatcher
          </div>
          <h2 className="text-2xl font-black text-white">Application Deadlines & Status Alerts</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Simulated and persisted email system for {student.email}. Triggers automatic notifications whenever new drives post, application deadlines approach, or interview statuses change.
          </p>
        </div>

        <button
          onClick={onSendTestNotification}
          className="px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" />
          Dispatch Test Deadline Alert
        </button>
      </div>

      {/* Two-Column Email Client */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 max-h-[600px] overflow-y-auto">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Incoming Messages</span>
            <span className="text-xs text-slate-500">{notifications.length} Total</span>
          </div>

          {notifications.map((notif) => {
            const isSelected = selectedNotif?.id === notif.id;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  setSelectedNotif(notif);
                  if (!notif.read) onMarkAsRead(notif.id);
                }}
                className={`p-3.5 rounded-xl cursor-pointer transition border text-left ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeBadge(notif.type)}`}>
                    {notif.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className={`text-xs font-bold truncate mt-1 ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                  {notif.subject}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {notif.previewText}
                </p>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No notifications yet. Apply for a job drive or click "Dispatch Test Deadline Alert" above!
            </div>
          )}
        </div>

        {/* Selected Email Reader */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[450px]">
          {selectedNotif ? (
            <div className="space-y-5">
              {/* Email Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getTypeBadge(selectedNotif.type)}`}>
                    {selectedNotif.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedNotif.sentAt).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{selectedNotif.subject}</h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <div>
                    <p><strong>From:</strong> Office of Career Services & Placement Cell &lt;placements@{institution.id}.ac.in&gt;</p>
                    <p><strong>To:</strong> {student.name} &lt;{student.email}&gt;</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Email Verified & Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/60 text-slate-200 text-sm leading-relaxed space-y-4">
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedNotif.bodyHtml }} 
                  className="space-y-3 prose prose-invert max-w-none text-slate-300"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
              <Mail className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
              <p className="text-sm">Select an email notification on the left to read full content</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Automated daemon polling every 60 seconds</span>
            <span>Institution: {institution.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
