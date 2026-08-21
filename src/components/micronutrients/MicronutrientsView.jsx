import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Play, 
  Pause, 
  RotateCcw, 
  Leaf, 
  Egg, 
  Apple, 
  ShieldCheck, 
  ChevronRight,
  Droplets,
  Zap,
  Timer
} from 'lucide-react';
import { MICRONUTRIENTS_DATA, SUNLIGHT_GUIDELINES } from '../../data/micronutrientsData';

export default function MicronutrientsView({ activeProfile }) {
  const [selectedDiet, setSelectedDiet] = useState('vegetarian'); // 'vegetarian' | 'vegan' | 'nonVeg'
  const [selectedNutrient, setSelectedNutrient] = useState(MICRONUTRIENTS_DATA[0]);
  
  // Sunlight Timer States (18 mins = 1080 seconds)
  const initialSeconds = 18 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setTimerRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsRemaining(initialSeconds);
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((initialSeconds - secondsRemaining) / initialSeconds) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-amber-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-amber text-xs font-bold">
                <Sun className="w-3.5 h-3.5 text-amber-600" /> MICRONUTRIENT & VITAMIN DEFICIENCY ENGINE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Vitamin & Micronutrient Optimization
            </h2>
          </div>

          {/* Diet Selector Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            {[
              { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
              { id: 'vegan', label: 'Vegan', icon: Apple },
              { id: 'nonVeg', label: 'Non-Veg', icon: Egg }
            ].map(diet => {
              const Icon = diet.icon;
              return (
                <button
                  key={diet.id}
                  onClick={() => setSelectedDiet(diet.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    selectedDiet === diet.id
                      ? 'bg-brand-green-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{diet.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sunlight Exposure & Natural Vitamin D Synthesis Timer Widget */}
      <div className="card-white p-6 sm:p-7 bg-gradient-to-br from-amber-500/10 via-white to-emerald-50/20 border-amber-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Left: Sunlight Science */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                <Sun className="w-5 h-5 animate-spin [animation-duration:12s]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Daily Morning Sun & Dermal Vitamin D3 Synthesizer
                </h3>
                <span className="text-xs text-amber-800 font-bold">
                  Recommended Time: {SUNLIGHT_GUIDELINES.optimalTimeWindow} ({SUNLIGHT_GUIDELINES.uvIndexTarget})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {SUNLIGHT_GUIDELINES.mechanism}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {SUNLIGHT_GUIDELINES.bestPractices.map((tip, idx) => (
                <div key={idx} className="p-2.5 bg-white/90 rounded-xl border border-amber-200/70 flex items-start gap-2 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive 18-min Stopwatch Timer */}
          <div className="p-5 bg-white rounded-3xl border border-amber-300 shadow-md text-center space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Sun Exposure Session
            </span>

            <div className="text-4xl sm:text-5xl font-black font-display text-amber-600 tracking-tight">
              {formatTimer(secondsRemaining)}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={toggleTimer}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerRunning ? 'Pause' : 'Start Sun Session'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Micronutrients Status Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-green-600" />
          Nutritional Biomarker Status & Biological Roles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MICRONUTRIENTS_DATA.map((nut) => {
            const isDeficient = nut.status === 'DEFICIENT';
            const isBorderline = nut.status === 'BORDERLINE_LOW';
            const isSelected = selectedNutrient.id === nut.id;

            return (
              <div
                key={nut.id}
                onClick={() => setSelectedNutrient(nut)}
                className={`card-white p-5 cursor-pointer transition-all space-y-3 border-2 ${
                  isSelected
                    ? 'border-brand-green-500 shadow-md bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {nut.category}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full ${
                    isDeficient
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                      : isBorderline
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isDeficient ? '▲ Deficient' : isBorderline ? '▼ Borderline' : '✓ Optimal'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{nut.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black ${
                      isDeficient ? 'text-rose-600' : isBorderline ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                      {nut.currentValue}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{nut.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Optimal: {nut.minOptimal} - {nut.maxOptimal} {nut.unit}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {nut.physiologicalRole}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Micronutrient Deep Dive & Dietary Fix Matrix */}
      <div className="card-white p-6 sm:p-8 space-y-6 border-l-4 border-l-brand-green-600">
        
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                Clinical Dietary Reversal Guide
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-semibold">{selectedNutrient.category}</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
              {selectedNutrient.name} Optimization Protocol
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {selectedNutrient.physiologicalRole}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-right">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Current Level</span>
            <strong className="text-base font-extrabold text-slate-900">
              {selectedNutrient.currentValue} {selectedNutrient.unit}
            </strong>
          </div>
        </div>

        {/* Symptoms & Clinical Supplement Protocol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Correlated Symptoms */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Correlated Deficiency Symptoms to Monitor
            </h4>
            <ul className="space-y-1 text-xs text-slate-700">
              {selectedNutrient.correlatedSymptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Supplement Protocol */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Evidence-Based Supplementation Protocol
            </h4>
            <p className="leading-relaxed font-medium">
              {selectedNutrient.supplementProtocol}
            </p>
          </div>

        </div>

        {/* Dietary Fix Matrix (Tailored to Vegetarian/Vegan/Non-Veg Toggle) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-brand-green-600" />
              Top Bioavailable Food Sources ({selectedDiet.toUpperCase()})
            </h4>
            <span className="text-[11px] text-slate-400">High intestinal bioavailability</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedNutrient.dietarySources[selectedDiet]?.map((food, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs text-xs font-bold text-slate-800 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  {idx + 1}
                </div>
                <span>{food}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
