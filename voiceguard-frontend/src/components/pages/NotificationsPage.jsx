import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCheck, 
  Filter, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const NotificationsPage = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    viewCallDetails 
  } = useVoiceGuard();

  const [filterSeverity, setFilterSeverity] = useState('ALL'); // ALL | HIGH | MODERATE | LOW

  const filtered = notifications.filter((n) => {
    if (filterSeverity === 'HIGH') return n.severity === 'HIGH';
    if (filterSeverity === 'MODERATE') return n.severity === 'MODERATE';
    if (filterSeverity === 'LOW') return n.severity === 'LOW';
    return true;
  });

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.callId) {
      viewCallDetails(notif.callId);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            Security Feed
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Notifications & Threat Alerts
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time notifications for intercepted voice threats and completed call analyses
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterSeverity === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Alerts ({notifications.length})
        </button>

        <button
          onClick={() => setFilterSeverity('HIGH')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterSeverity === 'HIGH'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
          }`}
        >
          🔴 High Spoof Risk ({notifications.filter(n => n.severity === 'HIGH').length})
        </button>

        <button
          onClick={() => setFilterSeverity('MODERATE')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterSeverity === 'MODERATE'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          🟠 Moderate Risk ({notifications.filter(n => n.severity === 'MODERATE').length})
        </button>

        <button
          onClick={() => setFilterSeverity('LOW')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterSeverity === 'LOW'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          🟢 Call Completed ({notifications.filter(n => n.severity === 'LOW').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs font-mono space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p>No notifications in this filter category.</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const isHigh = notif.severity === 'HIGH';
            const isModerate = notif.severity === 'MODERATE';

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !notif.isRead
                    ? isHigh
                      ? 'bg-red-50/70 border-red-200 shadow-sm'
                      : 'bg-blue-50/60 border-blue-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isHigh
                        ? 'bg-red-100 text-red-600'
                        : isModerate
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {isHigh ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : isModerate ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-extrabold font-mono text-slate-900">
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                      {notif.timestamp} {notif.callId && '• Click to view forensic call report'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {notif.callId && (
                    <span className="text-[11px] font-mono font-bold text-blue-600 flex items-center gap-0.5">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
