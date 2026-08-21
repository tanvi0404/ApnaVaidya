import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Sparkles, 
  Heart, 
  Info, 
  Droplet, 
  Activity, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { WOMENS_HEALTH_DATA } from '../../data/wellnessData';

export default function WomensHealthView({ activeProfile }) {
  const [data, setData] = useState(WOMENS_HEALTH_DATA);
  const [loggedSymptoms, setLoggedSymptoms] = useState(['Mild Cramps', 'Bloating']);

  const toggleSymptom = (sym) => {
    setLoggedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/50 to-pink-50/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" /> WOMEN'S HEALTH & HORMONAL WELLNESS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Menstrual Cycle & Hormone Tracking
            </h2>
          </div>

          <span className="badge-green text-xs font-bold">
            Regular 28-Day Rhythm
          </span>
        </div>
      </div>

      {/* Cycle Status & Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Phase Card */}
        <div className="card-white p-6 bg-gradient-to-br from-rose-500 to-brand-pink-600 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-100 font-extrabold block">
              Current Cycle Phase
            </span>
            <h3 className="text-2xl font-extrabold font-display mt-1">
              {data.currentPhase}
            </h3>
            <p className="text-xs text-rose-100 mt-2 leading-relaxed">
              {data.phaseDescription}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-rose-100">
            <span>Next Period Due:</span>
            <strong className="text-white text-sm">{data.nextPeriodDate}</strong>
          </div>
        </div>

        {/* Fertile Window & Ovulation */}
        <div className="card-white p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-pink-500" />
            Ovulation & Fertile Forecast
          </h4>

          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
            <span className="text-[10px] text-rose-800 font-bold uppercase block">Predicted Fertile Window</span>
            <div className="text-base font-extrabold text-rose-950 mt-0.5">{data.fertileWindow}</div>
            <span className="text-[11px] text-rose-700 mt-0.5 block">Estimated Peak Ovulation: <strong>{data.ovulationDay}</strong></span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Cycle Metrics Baseline</span>
            <div className="text-slate-600">Average Length: <strong>{data.cycleLength} Days</strong></div>
            <div className="text-slate-600">Period Duration: <strong>{data.periodDuration} Days</strong></div>
          </div>
        </div>

        {/* Daily Symptom Logging */}
        <div className="card-white p-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Daily PMS & Body Symptoms
          </h4>

          <div className="grid grid-cols-2 gap-1.5">
            {['Mild Cramps', 'Bloating', 'Headache', 'Backache', 'Mood Shift', 'Energetic', 'Fatigue', 'Acne'].map(sym => (
              <button
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                  loggedSymptoms.includes(sym)
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {loggedSymptoms.includes(sym) ? '✓ ' : ''}{sym}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-1 text-center">
            {loggedSymptoms.length} symptoms logged for today.
          </p>
        </div>

      </div>

      {/* Hormone Panel Correlation (Clinical Intersect) */}
      <div className="card-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-display">
              Endocrine & Hormone Biomarker Correlation
            </h3>
            <p className="text-xs text-slate-500">
              Integrates lab report findings (Thyroid, Prolactin, Androgen ratio) with cycle health.
            </p>
          </div>
          <span className="badge-green text-xs">All Normal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {data.hormonePanels.map((panel, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{panel.name}</span>
                <span className="badge-green text-[10px]">{panel.status}</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">{panel.value}</div>
              <p className="text-[11px] text-slate-500 pt-0.5">{panel.notes}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
