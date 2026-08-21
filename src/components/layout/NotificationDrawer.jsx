import React from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  FileText, 
  Pill, 
  Calendar, 
  AlertCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'report_ready':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'med_reminder':
        return <Pill className="w-4 h-4 text-rose-500" />;
      case 'preventive_alert':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'doctor_share':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-green-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-brand-green-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-green-100 text-brand-green-700 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Health Notifications</h3>
                <p className="text-xs text-slate-500">Live health alerts, reminders & updates</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Row */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {notifications.filter(n => n.unread).length} unread updates
            </span>
            <button
              onClick={onMarkAllAsRead}
              className="text-brand-green-700 hover:text-brand-green-800 font-bold flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification(notif)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                    notif.unread
                      ? 'bg-white border-brand-green-200 shadow-xs hover:border-brand-green-400'
                      : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 bg-slate-100 group-hover:bg-brand-green-50 rounded-xl mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-brand-pink-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-400">
                      <span>{notif.timestamp}</span>
                      <span className="font-semibold text-brand-green-700 group-hover:underline flex items-center gap-0.5">
                        View details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Safety Reminder */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-[11px] text-slate-500 text-center">
            Notifications are synchronized with your active family profile.
          </div>

        </div>
      </div>
    </div>
  );
}
