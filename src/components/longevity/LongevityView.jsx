import React, { useState } from 'react';
import { 
  Dna, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Flame, 
  Heart, 
  Zap, 
  TrendingDown, 
  Activity, 
  Award,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { 
  CALCULATE_LONGEVITY_METRICS, 
  PREVENTIVE_SCREENING_SCHEDULE, 
  LONGEVITY_STACK_PROTOCOLS 
} from '../../data/longevityData';
import { calculateLongevityBackend } from '../../services/apiClient';

export default function LongevityView({ activeProfile }) {
  const [screenings, setScreenings] = useState(PREVENTIVE_SCREENING_SCHEDULE);
  const [activeTab, setActiveTab] = useState('healthspan'); // 'healthspan' | 'screening' | 'protocols'

  const localMetrics = CALCULATE_LONGEVITY_METRICS(activeProfile);
  const [longevityData, setLongevityData] = useState(localMetrics);

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    const freshMetrics = CALCULATE_LONGEVITY_METRICS(activeProfile);
    setLongevityData(freshMetrics);

    calculateLongevityBackend({
      chronologicalAge: activeProfile.age || 35,
      systolicBp: 124,
      totalChol: 228,
      hdlChol: 52,
      hba1c: activeProfile.id === 'user-rajesh' ? 7.4 : 5.4,
      fastingGlucose: activeProfile.id === 'user-rajesh' ? 132 : 92,
      restingHr: 68,
      weeklyExerciseMins: 150,
      sleepHours: 7.5,
      smoker: false
    }).then(res => {
      if (isMounted && res) {
        setLongevityData(prev => ({
          ...prev,
          compositeScore: res.compositeScore || prev.compositeScore,
          agingVelocity: `${res.agingVelocity || 0.85}x (Decelerated)`,
          biologicalAge: res.estimatedBiologicalAge || prev.biologicalAge,
          healthspanTier: res.statusTier || prev.healthspanTier
        }));
      }
    }).catch(err => console.warn('Longevity client fallback:', err));

    return () => { isMounted = false; };
  }, [activeProfile.id, activeProfile.age]);

  const toggleScreeningStatus = (id) => {
    setScreenings(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'COMPLETED' ? 'DUE_SOON' : 'COMPLETED';
        return { 
          ...s, 
          status: nextStatus,
          lastDoneDate: nextStatus === 'COMPLETED' ? 'Just marked complete' : s.lastDoneDate
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Dna className="w-3.5 h-3.5 text-emerald-600" /> LONGEVITY & PREVENTIVE HEALTHSPAN BLUEPRINT
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Biological Healthspan & Preventive Screening Engine
            </h2>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('healthspan')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'healthspan'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Longevity Index & Pillars
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'screening'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preventive Screening Chronometer
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'protocols'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Longevity Stacks
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'healthspan' && (
        /* Healthspan Index & Pillar Breakdown */
        <div className="space-y-6">
          
          {/* Top Score Banner */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl border-emerald-900">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                  Composite Biological Longevity Index
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  Healthspan Optimization Score
                </h3>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {longevityData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              {/* Score Display */}
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Longevity Score</span>
                <div className="text-5xl font-black font-display text-emerald-400 mt-1">
                  {longevityData.compositeScore}
                  <span className="text-xl text-slate-400 font-medium">/100</span>
                </div>
                <span className="text-[11px] text-emerald-300 font-bold block mt-1">Top 15% for Biological Age</span>
              </div>

              {/* Aging Velocity */}
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Aging Velocity</span>
                <div className="text-4xl font-black font-display text-teal-300 mt-1">
                  {longevityData.agingVelocity}x
                </div>
                <span className="text-[11px] text-teal-200 block mt-1">
                  Biological yrs accrued per calendar year
                </span>
              </div>

              {/* High-Impact Opportunity */}
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Top Longevity Opportunity</span>
                <p className="text-slate-200 leading-snug">
                  Resolving <strong>Vitamin D3 deficiency</strong> and increasing <strong>soluble dietary fiber</strong> can boost longevity score to <strong>91/100</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Clinical Longevity Pillars */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              5 Clinical Healthspan Pillars Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {longevityData.pillars.map((pillar, idx) => (
                <div key={idx} className="card-white p-5 space-y-3 border-l-4 border-l-emerald-600 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900">{pillar.name}</h4>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {pillar.score}/100
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1">
                      <strong className="text-slate-700">Clinical Target:</strong> {pillar.target}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    {pillar.currentStatus}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'screening' && (
        /* Preventive Screening Chronometer */
        <div className="card-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Preventive Screening & Chronic Disease Early Detection Chronometer
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-based screening timeline tailored to active age, biological sex, and clinical risk biomarkers.
              </p>
            </div>

            <span className="badge-green text-xs font-bold">
              ICMR & USPSTF Aligned
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {screenings.map((screen) => {
              const isCompleted = screen.status === 'COMPLETED';
              const isDueSoon = screen.status === 'DUE_SOON';

              return (
                <div key={screen.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleScreeningStatus(screen.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-slate-300 text-transparent hover:border-emerald-500'
                        }`}
                      >
                        ✓
                      </button>
                      <h4 className="text-sm font-extrabold text-slate-900">{screen.title}</h4>
                      <span className="badge-neutral text-[10px]">{screen.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isDueSoon
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isCompleted ? '✓ Completed' : isDueSoon ? '⏳ Due Soon' : 'Recommended'}
                      </span>
                    </div>
                  </div>

                  <div className="pl-8.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Frequency</span>
                      <strong className="text-slate-800">{screen.recommendedFrequency}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Performed</span>
                      <strong className="text-slate-800">{screen.lastDoneDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Due Date</span>
                      <strong className="text-emerald-700">{screen.nextDueDate}</strong>
                    </div>
                  </div>

                  <div className="pl-8.5 text-xs text-slate-500 pt-1">
                    <strong>Clinical Rationale:</strong> {screen.clinicalRationale} ({screen.guidelineSource})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'protocols' && (
        /* Evidence-Based Longevity Protocols */
        <div className="card-white p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-green-600" />
              Evidence-Based Biological Longevity Stacks
            </h3>
            <p className="text-xs text-slate-500">
              High-leverage lifestyle interventions proven to expand healthy healthspan and mitochondrial vitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LONGEVITY_STACK_PROTOCOLS.map((protocol) => (
              <div key={protocol.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 flex flex-col justify-between hover:border-brand-green-300 transition-all">
                <div className="space-y-2">
                  <span className="badge-green text-[10px] font-bold">
                    {protocol.pillar}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {protocol.name}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {protocol.instruction}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                  <strong className="text-emerald-900 block mb-0.5">🧬 Healthspan Mechanism:</strong>
                  {protocol.longevityBenefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
