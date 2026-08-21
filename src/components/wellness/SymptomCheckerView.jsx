import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Stethoscope, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { COMMON_SYMPTOMS_LIST, SYMPTOM_EVALUATIONS } from '../../data/symptomsData';
import { triageSymptomsBackend } from '../../services/apiClient';

export default function SymptomCheckerView({ activeProfile, onOpenEmergency, onNavigateToDoctors }) {
  const [selectedSymptomId, setSelectedSymptomId] = useState('sym-fatigue');
  const [severity, setSeverity] = useState(4); // 1-10 scale
  const [duration, setDuration] = useState('1-2 Weeks');
  const [hasRedFlags, setHasRedFlags] = useState(false);
  const [backendTriage, setBackendTriage] = useState(null);

  const evaluation = SYMPTOM_EVALUATIONS[selectedSymptomId] || SYMPTOM_EVALUATIONS['sym-fatigue'];

  // Sync with Java Backend Triage Engine
  React.useEffect(() => {
    let isMounted = true;
    const symObj = COMMON_SYMPTOMS_LIST.find(s => s.id === selectedSymptomId);
    const symLabel = symObj ? symObj.label : 'fatigue';
    triageSymptomsBackend([symLabel], 7).then(res => {
      if (isMounted && res) {
        setBackendTriage(res);
      }
    }).catch(err => console.warn('Symptoms triage fallback:', err));

    return () => { isMounted = false; };
  }, [selectedSymptomId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/40 to-brand-green-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-rose-600" /> EDUCATIONAL SYMPTOM TRIAGE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Interactive Symptom Evaluator
            </h2>
          </div>

          <button
            onClick={onOpenEmergency}
            className="btn-secondary-pink text-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Emergency Check
          </button>
        </div>
      </div>

      {/* Main Evaluator Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Symptom Selector & Severity Controls */}
        <div className="card-white p-6 space-y-5 lg:col-span-1">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-slate-500 mb-2.5">
              1. Select Primary Symptom
            </h3>
            
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {COMMON_SYMPTOMS_LIST.map((sym) => (
                <button
                  key={sym.id}
                  onClick={() => setSelectedSymptomId(sym.id)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between border ${
                    selectedSymptomId === sym.id
                      ? 'bg-brand-green-50 text-brand-green-900 border-brand-green-300 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{sym.label}</span>
                  {selectedSymptomId === sym.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Slider */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>2. Discomfort Level</span>
              <span className={`px-2 py-0.5 rounded-md font-extrabold ${
                severity > 7 ? 'bg-rose-500 text-white' : severity > 4 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {severity} / 10
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-brand-green-600 cursor-pointer"
            />
            
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Mild (1-3)</span>
              <span>Moderate (4-6)</span>
              <span>Severe (7-10)</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              3. Onset & Duration
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {['< 24 Hours', '1-3 Days', '1-2 Weeks', '> 1 Month'].map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`p-2 rounded-xl text-center font-bold border transition-all ${
                    duration === d
                      ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Red Flag Warning Toggle */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-start gap-2 text-xs text-rose-900 bg-rose-50 p-3 rounded-2xl border border-rose-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRedFlags}
                onChange={e => setHasRedFlags(e.target.checked)}
                className="mt-0.5 text-rose-600 focus:ring-rose-500 rounded"
              />
              <span className="font-semibold leading-tight">
                Check if experiencing fainting, chest pressure, or breathing difficulty.
              </span>
            </label>
          </div>
        </div>

        {/* Right Col: AI Educational Triage Output */}
        <div className="card-white p-6 space-y-5 lg:col-span-2 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Triage Urgency Level Header */}
            {hasRedFlags || severity >= 8 ? (
              <div className="p-4 rounded-2xl bg-rose-600 text-white flex items-center justify-between gap-3 shadow-md animate-pulse">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-7 h-7" />
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider block">Urgency Status:</span>
                    <strong className="text-base font-display">Immediate Emergency Care Recommended</strong>
                  </div>
                </div>
                <button
                  onClick={onOpenEmergency}
                  className="px-3.5 py-1.5 bg-white text-rose-700 font-extrabold text-xs rounded-xl shadow-sm hover:bg-rose-50 transition-colors"
                >
                  Call 108 / 112
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">Assessment:</span>
                    <strong className="text-sm font-display">{evaluation.urgencyLabel}</strong>
                  </div>
                </div>
                <span className="badge-green text-xs font-bold">Non-Emergency</span>
              </div>
            )}

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                {evaluation.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {evaluation.summary}
              </p>
            </div>

            {/* Diagnostic Lab Correlations */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-green-600" />
                Correlated Diagnostic Panels to Review
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {evaluation.potentialCorrelations.map((corr, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{corr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-Care & Hydration Tips */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Recommended Daily Self-Care Measures
              </h4>
              <ul className="space-y-1 text-xs text-emerald-950">
                {evaluation.homeCareTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
            <span className="text-slate-400 italic">
              Always seek clinician evaluation for persistent or worsening symptoms.
            </span>
            
            <button
              onClick={onNavigateToDoctors}
              className="btn-primary-green text-xs"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Prepare Doctor Consultation</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
