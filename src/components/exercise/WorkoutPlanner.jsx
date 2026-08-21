import React, { useState } from 'react';
import { 
  Dumbbell, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Flame, 
  Calendar, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { PROFILE_WORKOUT_ROUTINES, EXERCISES_DATA } from '../../data/exerciseData';
import { getDynamicExercisePlan } from '../../utils/dynamicHealthEngine';
import { fetchExerciseRoutineBackend } from '../../services/apiClient';

export default function WorkoutPlanner({ activeProfile, onSelectExercise }) {
  const dynamicPlan = getDynamicExercisePlan(activeProfile);
  const baseRoutine = PROFILE_WORKOUT_ROUTINES[activeProfile?.id] || PROFILE_WORKOUT_ROUTINES['user-arjun'];

  const localRoutine = {
    ...baseRoutine,
    weeklyCommitment: `${dynamicPlan.weeklyTargetMins} mins / week`,
    primaryGoal: `Cardio Zone (${dynamicPlan.cardioZone}) • Fat Burn (${dynamicPlan.fatBurnZone})`
  };

  const [routine, setRoutine] = useState(localRoutine);
  const [scheduleState, setScheduleState] = useState(localRoutine.weeklySchedule);

  React.useEffect(() => {
    setRoutine(localRoutine);
    setScheduleState(localRoutine.weeklySchedule);
  }, [activeProfile?.id, activeProfile?.age]);

  const toggleDayCompletion = (idx, e) => {
    e.stopPropagation();
    setScheduleState(prev => prev.map((day, i) => i === idx ? { ...day, completed: !day.completed } : day));
  };

  const completedCount = scheduleState.filter(d => d.completed).length;

  return (
    <div className="card-white p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-green text-xs font-bold">
              <Sparkles className="w-3 h-3 text-brand-green-600" /> AI CLINICAL WORKOUT ROUTINE
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{routine.weeklyCommitment}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display mt-1">
            {routine.title}
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Target Focus: <strong className="text-teal-800">{routine.primaryGoal}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-teal-700">
            {completedCount} / 7 <span className="text-xs text-slate-500 font-medium">Days</span>
          </span>
          <span className="text-[11px] text-slate-400 block font-medium">Weekly Adherence</span>
        </div>
      </div>

      {/* 7-Day Schedule Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          7-Day Weekly Movement Schedule
        </div>

        <div className="space-y-2.5">
          {scheduleState.map((day, idx) => {
            const isRest = day.focus.includes('Rest') || day.duration === '—';
            
            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isRest) {
                    const matchedEx = EXERCISES_DATA.find(e => day.exercise.toLowerCase().includes(e.title.toLowerCase().substring(0, 5))) || EXERCISES_DATA[0];
                    onSelectExercise(matchedEx);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 flex-wrap ${
                  isRest
                    ? 'bg-slate-50/70 border-slate-200 text-slate-500'
                    : day.completed
                    ? 'bg-teal-50/50 border-teal-200 text-slate-800 cursor-pointer hover:shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 cursor-pointer hover:border-teal-400 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-[200px] flex-1">
                  <button
                    onClick={(e) => toggleDayCompletion(idx, e)}
                    className="p-1 text-teal-600 hover:scale-110 transition-transform"
                    title={day.completed ? 'Mark as Incomplete' : 'Mark as Done'}
                  >
                    {day.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-teal-600 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{day.day}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        isRest ? 'bg-slate-200 text-slate-600' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {day.focus}
                      </span>
                      {day.duration !== '—' && (
                        <span className="text-[10px] text-slate-400 font-medium">{day.duration}</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 mt-1 font-medium">
                      {day.exercise}
                    </p>
                  </div>
                </div>

                {!isRest && (
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                    <span>Exercise Form Guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
