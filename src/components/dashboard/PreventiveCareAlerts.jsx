import React from 'react';
import { AlertCircle, Calendar, ChevronRight, Stethoscope, Sparkles } from 'lucide-react';
import { PREVENTIVE_CARE_ALERTS } from '../../data/trendsData';
import { getDynamicPreventiveAlerts } from '../../utils/dynamicHealthEngine';

export default function PreventiveCareAlerts({ activeProfile, onNavigateToDoctors }) {
  const profileAlerts = PREVENTIVE_CARE_ALERTS.filter(a => a.profileId === activeProfile?.id);
  const dynamicAlerts = getDynamicPreventiveAlerts(activeProfile);
  const displayedAlerts = profileAlerts.length > 0 ? profileAlerts : dynamicAlerts;

  return (
    <div className="card-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm font-display">
              Preventive Care & Health Screening
            </h4>
            <p className="text-xs text-slate-500">
              Age, gender & medical history based proactive guidelines
            </p>
          </div>
        </div>

        <span className="badge-amber text-xs">
          {displayedAlerts.length} Actionable
        </span>
      </div>

      <div className="space-y-3">
        {displayedAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 via-white to-white border border-amber-200/80 flex items-start justify-between gap-3 flex-wrap"
          >
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  {alert.dueDate}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {alert.description}
              </p>
              <div className="mt-2 text-xs font-medium text-amber-900 bg-amber-100/60 px-2.5 py-1 rounded-lg inline-block">
                💡 {alert.recommendation}
              </div>
            </div>

            <button
              onClick={onNavigateToDoctors}
              className="btn-outline-white text-xs whitespace-nowrap self-center"
            >
              <Stethoscope className="w-3.5 h-3.5 text-brand-green-600" />
              <span>Schedule Prep</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
