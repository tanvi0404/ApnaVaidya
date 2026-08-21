import React, { useState } from 'react';
import { 
  Moon, 
  Smile, 
  Frown, 
  Meh, 
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Sun, 
  Heart 
} from 'lucide-react';
import { SLEEP_LOGS_DATA } from '../../data/wellnessData';

export default function SleepWellnessView({ activeProfile }) {
  const [selectedMood, setSelectedMood] = useState('Calm & Focused');
  const [sleepHours, setSleepHours] = useState(7.5);
  const [stressLevel, setStressLevel] = useState(3); // 1-10

  const moods = [
    { label: 'Energetic & Joyful', emoji: '🌟', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { label: 'Calm & Focused', emoji: '🌿', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    { label: 'Mildly Stressed', emoji: '⚡', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Fatigued / Exhausted', emoji: '😴', color: 'bg-rose-50 text-rose-800 border-rose-200' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-indigo-50/30 to-brand-pink-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <Moon className="w-3.5 h-3.5" /> SLEEP & MENTAL WELLNESS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Circadian Rhythm & Daily Mind-Body Check-In
            </h2>
          </div>

          <span className="badge-green text-xs font-bold">
            Optimal REM & Deep Sleep Ratio
          </span>
        </div>
      </div>

      {/* Daily Check-In Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mood Check-In */}
        <div className="card-white p-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-brand-green-600" />
            1. Daily Mood & Mental Energy
          </h4>

          <div className="space-y-2">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setSelectedMood(m.label)}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                  selectedMood === m.label
                    ? `${m.color} shadow-xs font-extrabold`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{m.emoji} {m.label}</span>
                {selectedMood === m.label && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Duration Slider */}
        <div className="card-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              2. Last Night Sleep Duration
            </h4>
            <span className="text-base font-extrabold text-brand-green-700">{sleepHours} Hours</span>
          </div>

          <input
            type="range"
            min="4"
            max="11"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="w-full accent-brand-green-600 cursor-pointer"
          />

          <div className="grid grid-cols-3 text-[10px] text-center text-slate-400 font-semibold">
            <span>&lt; 6h (Deficit)</span>
            <span className="text-emerald-700 font-bold">7-8.5h (Optimal)</span>
            <span>&gt; 9h (Excess)</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            Estimated Deep Sleep: <strong>{(sleepHours * 0.22).toFixed(1)} hrs</strong> (22% of cycle)
          </div>
        </div>

        {/* Stress Level Gauge */}
        <div className="card-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-500" />
              3. Stress & Work Tension
            </h4>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
              stressLevel > 6 ? 'bg-rose-500 text-white' : stressLevel > 3 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {stressLevel} / 10
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            className="w-full accent-brand-pink-500 cursor-pointer"
          />

          <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl text-xs text-rose-950">
            {stressLevel <= 3 ? '🌱 Calm baseline. Parasympathetic recovery is active.' : '⚡ Mild cortisol surge. Practice 4-7-8 relaxing breaths.'}
          </div>
        </div>

      </div>

      {/* 7-Day Sleep Trend Bars */}
      <div className="card-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base font-display">
            7-Day Sleep Duration & Recovery Score
          </h3>
          <span className="text-xs text-slate-500">Average: 7.4 hrs / night</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2 text-center">
          {SLEEP_LOGS_DATA.map((log, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="h-32 bg-slate-100 rounded-2xl p-1 flex flex-col justify-end">
                <div 
                  className="bg-gradient-to-t from-teal-600 to-brand-green-500 rounded-xl w-full transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ height: `${(log.duration / 10) * 100}%` }}
                >
                  {log.duration}h
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 block">{log.day}</span>
              <span className="text-[10px] text-slate-400">{log.quality}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
