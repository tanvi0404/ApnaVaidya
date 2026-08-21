import React, { useState, useEffect } from 'react';
import { 
  X, 
  Dumbbell, 
  Clock, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function ExerciseDetailModal({ exercise, isOpen, onClose }) {
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !exercise) return null;

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 flex items-start justify-between rounded-t-3xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge-green text-xs font-bold">{exercise.category}</span>
              <span className="badge-neutral text-xs">{exercise.difficulty}</span>
              <span className="badge-pink text-xs">{exercise.caloriesBurned}</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              {exercise.title}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {exercise.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white transition-all ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Duration</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">{exercise.duration}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Difficulty</div>
              <div className="text-sm font-extrabold text-emerald-800 mt-0.5">{exercise.difficulty}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Equipment</div>
              <div className="text-xs font-bold text-slate-700 mt-1 line-clamp-1">{exercise.equipment}</div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <div className="text-[11px] text-rose-700 font-bold uppercase">Est. Burn</div>
              <div className="text-sm font-extrabold text-rose-900 mt-0.5">{exercise.caloriesBurned}</div>
            </div>
          </div>

          {/* Interactive Set / Form Timer */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Set Interval Timer</span>
              <div className="text-3xl font-extrabold font-display text-emerald-400 mt-0.5">
                00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Target Muscle Groups */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Target Muscle Groups & Physiology
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {exercise.targetMuscles.map((muscle, idx) => (
                <span key={idx} className="badge-green text-xs">
                  ✓ {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Form Guidance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Form & Execution Instructions
            </h4>
            <div className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Safety Considerations (Vital Clinical Guardrail) */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Medical Safety Considerations & Precautions</span>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-950">
              {exercise.safetyPrecautions.map((safe, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{safe}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
