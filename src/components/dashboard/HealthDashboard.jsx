import React from 'react';
import LifestyleCategoryCards from './LifestyleCategoryCards';
import TrendChart from './TrendChart';
import HydrationTracker from './HydrationTracker';
import PreventiveCareAlerts from './PreventiveCareAlerts';
import { TRENDS_DATA } from '../../data/trendsData';
import { 
  FileText, 
  UploadCloud, 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  Heart,
  TrendingUp,
  Pill,
  Clock
} from 'lucide-react';

export default function HealthDashboard({
  activeProfile,
  reports,
  onSelectTab,
  onOpenUpload,
  onOpenEmergency
}) {
  const profileTrends = TRENDS_DATA[activeProfile.id]?.biomarkers || TRENDS_DATA['user-arjun'].biomarkers;
  const recentReports = reports.filter(r => r.profileId === activeProfile.id).slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Category-Based Lifestyle Summaries */}
      <LifestyleCategoryCards
        activeProfile={activeProfile}
        onSelectTab={onSelectTab}
      />

      {/* Main Interactive Longitudinal Trend Visualization (Key Feature) */}
      <TrendChart
        biomarkers={profileTrends}
      />

      {/* Two-Column Grid: Daily Hydration/Habits + Preventive Care Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Tracker */}
        <HydrationTracker
          targetLiters={3.0}
          currentLiters={2.25}
        />

        {/* Preventive Care Alerts */}
        <PreventiveCareAlerts
          activeProfile={activeProfile}
          onNavigateToDoctors={() => onSelectTab('doctors')}
        />
      </div>

      {/* Recent Medical Reports Row & Quick Upload CTA */}
      <div className="card-white p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <FileText className="w-3.5 h-3.5 text-brand-green-600" /> RECENT LAB INVESTIGATIONS
              </span>
              <span className="text-xs text-slate-500">Structured Vault</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
              Latest Analyzed Lab Reports
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('reports')}
              className="btn-outline-white text-xs"
            >
              <span>View All Reports ({reports.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenUpload}
              className="btn-primary-green text-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New</span>
            </button>
          </div>
        </div>

        {/* Reports Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {recentReports.map((report) => {
            const params = report.parameters || [];
            const abnormalCount = params.filter(p => p.status !== 'NORMAL').length;
            const summaryText = report?.summary?.keyFindings?.[0] || report?.overallSummary || 'Diagnostic blood biomarkers evaluated.';
            const reportDate = report.testDate || report.date || 'Recent';
            
            return (
              <div
                key={report.id}
                onClick={() => onSelectTab('reports')}
                className="p-4 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 border border-slate-200 hover:border-brand-green-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {report.category || 'Clinical Lab'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      abnormalCount > 0
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {abnormalCount > 0 ? `${abnormalCount} Outside Range` : 'All Normal'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-green-900 transition-colors line-clamp-1">
                    {report.title}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {summaryText}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{reportDate}</span>
                  <span className="font-bold text-brand-green-700 group-hover:underline flex items-center gap-0.5">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
