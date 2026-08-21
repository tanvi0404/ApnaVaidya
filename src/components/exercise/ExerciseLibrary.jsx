import React, { useState } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  ChevronRight, 
  Search, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { EXERCISES_DATA } from '../../data/exerciseData';

export default function ExerciseLibrary({ onSelectExercise }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Aerobic Cardio', 'Lower Body Strength', 'Upper Body Strength', 'Yoga & Mobility', 'Core Stability'];

  const filteredExercises = EXERCISES_DATA.filter(ex => {
    const matchesCategory = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
            Cardiometabolic & Clinical Movement Library
          </h3>
          <p className="text-xs text-slate-500">
            Form-focused bodyweight, cardio, and yoga exercises with condition-specific safety cautions.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exercises, muscles, form..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50 hover:border-teal-300'
            }`}
          >
            {cat === 'ALL' ? 'All Movements' : cat}
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => onSelectExercise(ex)}
            className="card-white p-5 hover:border-teal-400 hover:shadow-soft-green transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="badge-green text-[10px] font-bold">
                  {ex.category}
                </span>
                <span className="badge-neutral text-[10px]">
                  {ex.difficulty}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                {ex.title}
              </h4>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {ex.description}
              </p>

              {/* Muscle pills */}
              <div className="flex items-center gap-1 flex-wrap my-3">
                {ex.targetMuscles.slice(0, 2).map((m, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {m}
                  </span>
                ))}
                {ex.targetMuscles.length > 2 && (
                  <span className="text-[10px] text-slate-400">+{ex.targetMuscles.length - 2} more</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {ex.duration}
              </span>
              <span className="font-bold text-teal-700 group-hover:underline flex items-center gap-0.5">
                Form Guide & Timer <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
