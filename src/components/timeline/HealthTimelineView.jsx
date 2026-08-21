import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Stethoscope, 
  Pill, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { HEALTH_TIMELINE_EVENTS } from '../../data/advancedData';

export default function HealthTimelineView({ activeProfile, onSelectTab }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const profileEvents = HEALTH_TIMELINE_EVENTS[activeProfile.id] || HEALTH_TIMELINE_EVENTS['user-arjun'];

  const filteredEvents = profileEvents.filter(ev => {
    if (filterCategory === 'ALL') return true;
    return ev.category === filterCategory;
  });

  const getEventIcon = (iconType) => {
    switch (iconType) {
      case 'lab':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-teal-600" />;
      case 'med':
        return <Pill className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-green-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" /> LONGITUDINAL HEALTH TIMELINE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Chronological Health Journey & Milestones
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            {['ALL', 'Lab Test', 'Doctor Visit', 'Medication'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterCategory === cat
                    ? 'bg-brand-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Milestones' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Timeline Stream */}
      <div className="card-white p-6 sm:p-8 relative space-y-8">
        
        {/* Continuous Vertical Green Spine */}
        <div className="absolute top-8 bottom-8 left-9 sm:left-11 w-0.5 bg-gradient-to-b from-brand-green-500 via-teal-400 to-slate-200" />

        {filteredEvents.map((ev, idx) => (
          <div key={ev.id} className="relative flex items-start gap-4 sm:gap-6 group">
            
            {/* Timeline Node Icon Circle */}
            <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border-2 border-brand-green-500 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-green-50 transition-all">
              {getEventIcon(ev.iconType)}
            </div>

            {/* Event Card Container */}
            <div 
              onClick={() => setSelectedEvent(ev)}
              className="flex-1 p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-200 hover:border-brand-green-300 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-brand-green-800 bg-brand-green-50 px-2 py-0.5 rounded-lg border border-brand-green-200">
                      {ev.date}
                    </span>
                    <span className="badge-neutral text-[10px]">{ev.category}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1.5 group-hover:text-brand-green-900 transition-colors">
                    {ev.title}
                  </h3>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  ev.badgeColor === 'rose'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : ev.badgeColor === 'amber'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {ev.statusTag}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {ev.summary}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="italic">{ev.details}</span>
                <span className="font-bold text-brand-green-700 group-hover:underline flex items-center gap-0.5 ml-2 flex-shrink-0">
                  Inspect <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
