import React, { useState } from 'react';
import WorkoutPlanner from './WorkoutPlanner';
import ExerciseLibrary from './ExerciseLibrary';
import ExerciseDetailModal from './ExerciseDetailModal';
import { Dumbbell, Activity, Sparkles, Heart } from 'lucide-react';

export default function ExerciseView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('routine'); // 'routine' | 'library'
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Dumbbell className="w-3.5 h-3.5 text-teal-600" /> CLINICAL EXERCISE & MOVEMENT
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.lifestyle.activity}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Personalized Movement & Fitness Guidance
            </h2>
          </div>

          {/* Sub-tabs toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('routine')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'routine'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Routine
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'library'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Movement Library
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'routine' ? (
        <WorkoutPlanner
          activeProfile={activeProfile}
          onSelectExercise={setSelectedExercise}
        />
      ) : (
        <ExerciseLibrary
          onSelectExercise={setSelectedExercise}
        />
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

    </div>
  );
}
