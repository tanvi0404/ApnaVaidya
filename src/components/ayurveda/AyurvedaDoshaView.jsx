import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Wind, 
  Droplets, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  BookOpen, 
  Activity, 
  ChevronRight, 
  Utensils, 
  Clock, 
  Leaf, 
  RotateCcw
} from 'lucide-react';
import { 
  PRAKRITI_QUESTIONS, 
  DOSHA_PROFILES, 
  HERB_DRUG_INTERACTIONS, 
  AGNI_THERAPEUTICS 
} from '../../data/ayurvedaData';
import { calculatePrakritiBackend } from '../../services/apiClient';

export default function AyurvedaDoshaView({ activeProfile }) {
  const [activeSubTab, setActiveSubTab] = useState('prakriti'); // 'prakriti' | 'herbs' | 'agni'
  
  // Prakriti Assessment State
  const [answers, setAnswers] = useState({
    q1: 'VATA',
    q2: 'PITTA',
    q3: 'VATA',
    q4: 'PITTA',
    q5: 'VATA'
  });

  const handleSelectOption = (qId, dosha) => {
    const updated = { ...answers, [qId]: dosha };
    setAnswers(updated);

    const vCount = Object.values(updated).filter(d => d === 'VATA').length;
    const pCount = Object.values(updated).filter(d => d === 'PITTA').length;
    const kCount = Object.values(updated).filter(d => d === 'KAPHA').length;
    calculatePrakritiBackend({ vataCount: vCount, pittaCount: pCount, kaphaCount: kCount });
  };

  // Calculate percentages
  const totalAnswers = Object.keys(answers).length;
  const vataCount = Object.values(answers).filter(d => d === 'VATA').length;
  const pittaCount = Object.values(answers).filter(d => d === 'PITTA').length;
  const kaphaCount = Object.values(answers).filter(d => d === 'KAPHA').length;

  const vataPct = Math.round((vataCount / totalAnswers) * 100);
  const pittaPct = Math.round((pittaCount / totalAnswers) * 100);
  const kaphaPct = Math.round((kaphaCount / totalAnswers) * 100);

  let dominantDosha = 'VATA';
  if (pittaPct > vataPct && pittaPct >= kaphaPct) dominantDosha = 'PITTA';
  else if (kaphaPct > vataPct && kaphaPct >= pittaPct) dominantDosha = 'KAPHA';

  const dominantProfile = DOSHA_PROFILES[dominantDosha];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> AYURVEDIC PRAKRITI & HERB-DRUG SAFETY
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Constitutional Dosha & Botanical Integration
            </h2>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('prakriti')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSubTab === 'prakriti'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prakriti Diagnostic
            </button>
            <button
              onClick={() => setActiveSubTab('herbs')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSubTab === 'herbs'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Herb-Drug Safety Matrix
            </button>
            <button
              onClick={() => setActiveSubTab('agni')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeSubTab === 'agni'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agni (Digestive Fire)
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'prakriti' ? (
        /* Prakriti Diagnostic Sub-View */
        <div className="space-y-6">
          
          {/* Top Tri-Dosha Score Banner */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl border-emerald-900">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                  Constitutional Bio-Energetic Matrix
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  Dominant Constitution: {dominantProfile.name}
                </h3>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Prakriti Grounded
              </span>
            </div>

            {/* Tri-Dosha Percentages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-300">
                  <Wind className="w-4 h-4" /> Vata (Air + Ether)
                </div>
                <div className="text-3xl font-black font-display text-white mt-1">{vataPct}%</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: `${vataPct}%` }} />
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300">
                  <Flame className="w-4 h-4" /> Pitta (Fire + Water)
                </div>
                <div className="text-3xl font-black font-display text-white mt-1">{pittaPct}%</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pittaPct}%` }} />
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Droplets className="w-4 h-4" /> Kapha (Earth + Water)
                </div>
                <div className="text-3xl font-black font-display text-white mt-1">{kaphaPct}%</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${kaphaPct}%` }} />
                </div>
              </div>
            </div>

            {/* Dominant Guidance */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
              <strong className="text-emerald-300 text-sm block">🌿 Clinical Dinacharya & Dietary Protocol:</strong>
              <p className="text-slate-200 leading-relaxed">
                <strong>Dietary Focus:</strong> {dominantProfile.dietaryFocus}
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>Lifestyle Advice:</strong> {dominantProfile.lifestyleTip}
              </p>
            </div>
          </div>

          {/* 5-Question Interactive Diagnostic Questionnaire */}
          <div className="card-white p-6 sm:p-8 space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Prakriti Constitutional Diagnostic Questionnaire
              </h3>
              <p className="text-xs text-slate-500">
                Select the options that best represent your natural lifelong physiological traits.
              </p>
            </div>

            <div className="space-y-5">
              {PRAKRITI_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-xl bg-brand-green-100 text-brand-green-800 font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">{q.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === opt.dosha;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, opt.dosha)}
                          className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all border ${
                            isSelected
                              ? 'bg-brand-green-50 text-brand-green-950 border-brand-green-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="badge-neutral text-[10px] uppercase font-bold">{opt.dosha}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-600" />}
                          </div>
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : activeSubTab === 'herbs' ? (
        /* Herb-Drug Safety Matrix Sub-View */
        <div className="space-y-6">
          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Ayurvedic Herb-Pharmaceutical Drug Safety Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-based botanical and allopathic pharmaceutical compatibility, metabolic clearance, and spacing rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HERB_DRUG_INTERACTIONS.map((item) => (
                <div key={item.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{item.herbName}</h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.safetyLevel === 'SAFE_SYNERGISTIC' || item.safetyLevel === 'SAFE_COGNITIVE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.safetyLevel === 'MODERATE_MONITOR'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {item.safetyLevel.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-bold block">
                      Linked Allopathic Category: {item.linkedAllopathicClass}
                    </span>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.clinicalMechanism}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium">
                    <strong className="text-emerald-900 block mb-0.5">Clinical Protocol:</strong>
                    {item.clinicalAdvice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Agni / Digestive Fire Strength Calibrator */
        <div className="space-y-6">
          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                Agni (Digestive Fire) Functional Calibrator & Kitchen Spice Therapeutics
              </h3>
              <p className="text-xs text-slate-500">
                Targeted herbal decoctions and functional kitchen spices to balance irregular, hyperacidic, or sluggish digestive capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AGNI_THERAPEUTICS.map((agni, idx) => (
                <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 flex flex-col justify-between hover:border-amber-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <h4 className="text-sm font-extrabold text-slate-900">{agni.type}</h4>
                    </div>
                    <p className="text-xs font-bold text-amber-900">
                      🍵 {agni.solution}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Method:</strong> {agni.recipe}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950">
                    <strong>Clinical Benefit:</strong> {agni.benefit}
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
