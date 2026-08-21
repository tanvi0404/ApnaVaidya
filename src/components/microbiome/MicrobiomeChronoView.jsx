import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Utensils, 
  Activity, 
  Zap, 
  Info, 
  Layers, 
  ChevronRight,
  Sun,
  Moon,
  Timer
} from 'lucide-react';
import { 
  GUT_MICROBIOME_PROFILE, 
  INDIAN_PREBIOTIC_FERMENTED_FOODS, 
  CIRCADIAN_CHRONO_SCHEDULE 
} from '../../data/microbiomeData';
import { fetchMicrobiomeProfileBackend } from '../../services/apiClient';

export default function MicrobiomeChronoView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('microbiome'); // 'microbiome' | 'chrono'
  const [fastingTimerRunning, setFastingTimerRunning] = useState(false);
  const [fastingSeconds, setFastingSeconds] = useState(13 * 3600); // 13 hours in seconds
  const [gutProfile, setGutProfile] = useState(GUT_MICROBIOME_PROFILE);

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    fetchMicrobiomeProfileBackend(activeProfile.id).then(res => {
      if (isMounted && res) {
        setGutProfile(prev => ({
          ...prev,
          gutScore: res.gutScore || prev.gutScore,
          diversityStatus: res.diversityStatus || prev.diversityStatus,
          shortChainFattyAcids: {
            butyrate: `${res.butyratePercent || 82}% (Optimal Colonocyte Fuel)`,
            acetate: `${res.acetatePercent || 76}% (Lipid Metabolism)`,
            propionate: `${res.propionatePercent || 68}% (Hepatic Glucose Control)`
          }
        }));
      }
    }).catch(err => console.warn('Microbiome client fallback:', err));

    return () => { isMounted = false; };
  }, [activeProfile.id]);

  const formatHoursMins = (secs) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> GUT MICROBIOME & CHRONO-NUTRITION
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Gut-Brain Axis & Circadian Meal Timing Engine
            </h2>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('microbiome')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'microbiome'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gut Microbiome & SCFA
            </button>
            <button
              onClick={() => setActiveTab('chrono')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'chrono'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chrono-Nutrition & Fasting Clock
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'microbiome' ? (
        /* Gut Microbiome & SCFA View */
        <div className="space-y-6">
          
          {/* Top Score Banner */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl border-emerald-900">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                  Gut Flora Diversity & Integrity Index
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  Microbiome Health & SCFA Balance
                </h3>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {GUT_MICROBIOME_PROFILE.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gut Diversity Score</span>
                <div className="text-5xl font-black font-display text-emerald-400 mt-1">
                  {GUT_MICROBIOME_PROFILE.overallGutScore}
                  <span className="text-xl text-slate-400 font-medium">/100</span>
                </div>
                <span className="text-[11px] text-emerald-300 font-bold block mt-1">
                  {GUT_MICROBIOME_PROFILE.floraDiversityIndex}
                </span>
              </div>

              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">F/B Ratio</span>
                <div className="text-3xl font-black font-display text-teal-300 mt-1">
                  {GUT_MICROBIOME_PROFILE.firmicutesBacteroidetesRatio}
                </div>
                <span className="text-[11px] text-teal-200 block mt-1">
                  Optimal Metabolic Calorie Harvest
                </span>
              </div>

              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Gut-Brain Vagus Tone</span>
                <p className="text-slate-200 leading-snug">
                  {GUT_MICROBIOME_PROFILE.vagusNerveTone}. Over 90% of peripheral serotonin is synthesized by healthy colonic flora.
                </p>
              </div>
            </div>
          </div>

          {/* Short-Chain Fatty Acid (SCFA) Production Gauges */}
          <div className="card-white p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Short-Chain Fatty Acid (SCFA) Production Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {GUT_MICROBIOME_PROFILE.scfaMeters.map((scfa, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{scfa.name.split(' ')[0]}</span>
                    <span className="text-xs font-black text-emerald-700">{scfa.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${scfa.level}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Target: {scfa.target} • {scfa.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Keystone Probiotic Microbes */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Keystone Bacterial Species Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GUT_MICROBIOME_PROFILE.keystoneSpecies.map((spec, idx) => (
                <div key={idx} className="card-white p-5 space-y-3 border-l-4 border-l-emerald-600 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 italic">{spec.name}</h4>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {spec.level}
                      </span>
                    </div>
                    <span className="badge-neutral text-[10px]">{spec.role}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {spec.clinicalImpact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Indian Prebiotic & Fermented Foods Master Index */}
          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-600" />
                Indian Prebiotic & Fermented Foods Master Index
              </h3>
              <p className="text-xs text-slate-500">
                Traditional, highly bioavailable foods that restore beneficial gut microbes and optimize digestion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INDIAN_PREBIOTIC_FERMENTED_FOODS.map((food) => (
                <div key={food.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2 flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900">{food.name}</h4>
                      <span className="badge-green text-[10px]">{food.category}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 italic block">
                      Strains: {food.strains}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {food.clinicalBenefits}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
                    <strong className="text-emerald-900 block mb-0.5">💡 Serving Tip:</strong>
                    {food.servingTip}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Chrono-Nutrition & Circadian Fasting Clock View */
        <div className="space-y-6">
          
          {/* Circadian Fasting Countdown Clock */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl border-emerald-900">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                  Circadian Digestive Rest
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  13-Hour Overnight Metabolic Fasting Clock
                </h3>
              </div>

              <span className="badge-green text-xs font-bold">
                MMC & Autophagy Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center space-y-2">
                <Timer className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-4xl font-black font-display text-emerald-300">
                  {formatHoursMins(fastingSeconds)}
                </div>
                <span className="text-xs text-slate-300 block">
                  Next Feeding Window Opens: <strong>8:30 AM Tomorrow</strong>
                </span>
                <button
                  onClick={() => setFastingTimerRunning(!fastingTimerRunning)}
                  className={`mt-2 py-2 px-6 rounded-2xl text-xs font-extrabold transition-all ${
                    fastingTimerRunning
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'btn-primary-green'
                  }`}
                >
                  {fastingTimerRunning ? 'Pause Fasting Timer' : 'Start Overnight Fast'}
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <strong className="text-white text-sm block">🧬 Why Circadian Fasting Matters:</strong>
                <p className="leading-relaxed">
                  Aligning meals with the natural day-night cycle allows insulin sensitivity to reset and triggers the <strong>Migrating Motor Complex (MMC)</strong> to sweep the small intestine, preventing small intestinal bacterial overgrowth (SIBO).
                </p>
              </div>
            </div>
          </div>

          {/* 4 Circadian Meal Windows Schedule */}
          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Daily Chrono-Nutrition Circadian Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Aligning meal compositions with peak enzymatic secretion and peripheral insulin receptor sensitivity.
              </p>
            </div>

            <div className="space-y-4">
              {CIRCADIAN_CHRONO_SCHEDULE.map((window, idx) => (
                <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-brand-green-100 text-brand-green-800 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">{window.mealName}</h4>
                    </div>

                    <span className="badge-neutral text-xs font-bold">
                      {window.timeWindow}
                    </span>
                  </div>

                  <div className="text-xs text-emerald-800 font-bold">
                    ⚡ Metabolic State: {window.metabolicState}
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    <strong>Recommended Strategy:</strong> {window.recommendedFocus}
                  </p>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <strong>Clinical Rationale:</strong> {window.clinicalRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
