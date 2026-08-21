import React, { useState } from 'react';
import DoctorDirectory from './DoctorDirectory';
import DoctorVisitSummary from './DoctorVisitSummary';
import { Stethoscope, FileSpreadsheet, Sparkles } from 'lucide-react';

export default function DoctorsView({ activeProfile, reports = [] }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'directory'

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-brand-green-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Stethoscope className="w-3.5 h-3.5 text-brand-green-600" /> DOCTOR CONSULTATIONS & VISIT PREP
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Physician Consultation Prep & Specialist Network
            </h2>
          </div>

          {/* Sub-tabs toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'summary'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor Visit Summary (PDF)
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'directory'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find Doctors
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'summary' ? (
        <DoctorVisitSummary
          activeProfile={activeProfile}
          reports={reports}
        />
      ) : (
        <DoctorDirectory
          onGenerateSummary={() => setActiveTab('summary')}
        />
      )}

    </div>
  );
}
