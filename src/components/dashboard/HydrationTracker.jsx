import React, { useState } from 'react';
import { Droplet, Plus, Minus, Check, Sparkles, Flame } from 'lucide-react';

export default function HydrationTracker({ targetLiters = 3.0, currentLiters = 2.25 }) {
  const [glasses, setGlasses] = useState(Math.round(currentLiters * 4)); // 1 glass = 250ml (0.25L)
  const totalGlassesTarget = Math.round(targetLiters * 4); // 12 glasses for 3L

  const handleAddGlass = () => {
    if (glasses < 16) setGlasses(g => g + 1);
  };

  const handleRemoveGlass = () => {
    if (glasses > 0) setGlasses(g => g - 1);
  };

  const currentTotalLiters = (glasses * 0.25).toFixed(2);
  const percentage = Math.min(100, Math.round((glasses / totalGlassesTarget) * 100));

  return (
    <div className="card-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm font-display">Daily Hydration Log</h4>
            <p className="text-xs text-slate-500">250ml per glass</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-extrabold text-emerald-700">{currentTotalLiters} L</span>
          <span className="text-xs text-slate-400"> / {targetLiters} L</span>
        </div>
      </div>

      {/* Progress Gauge */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Daily Hydration Goal</span>
          <span className="text-emerald-700 font-extrabold">{percentage}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 via-emerald-500 to-brand-green-600 rounded-full transition-all duration-300 shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Interactive Glasses Icons Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-1">
        {Array.from({ length: totalGlassesTarget }).map((_, idx) => {
          const isFilled = idx < glasses;
          return (
            <button
              key={idx}
              onClick={() => setGlasses(idx + 1)}
              className={`h-9 rounded-xl border flex items-center justify-center transition-all ${
                isFilled
                  ? 'bg-gradient-to-t from-emerald-500 to-teal-400 border-emerald-500 text-white shadow-xs scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-emerald-300 hover:text-emerald-500'
              }`}
              title={`Glass ${idx + 1} (250ml)`}
            >
              <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-current' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-medium">
          {glasses >= totalGlassesTarget ? '🎉 Daily Goal Reached!' : `${totalGlassesTarget - glasses} more glasses to target`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRemoveGlass}
            disabled={glasses === 0}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40"
            title="Subtract 1 glass"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAddGlass}
            className="p-1.5 px-3 rounded-lg bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold flex items-center gap-1 shadow-xs"
            title="Add 1 glass (+250ml)"
          >
            <Plus className="w-3.5 h-3.5" /> <span>+250 ml</span>
          </button>
        </div>
      </div>
    </div>
  );
}
