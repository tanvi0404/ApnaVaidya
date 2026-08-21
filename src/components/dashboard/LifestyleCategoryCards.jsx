import React from 'react';
import { 
  Salad, 
  Dumbbell, 
  Moon, 
  HeartPulse, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LifestyleCategoryCards({ activeProfile, onSelectTab }) {
  const { lifestyle, dietPreference, conditions, goals } = activeProfile;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-green-600" />
          Category-Based Lifestyle Summaries
        </h4>
        <span className="text-[11px] text-slate-400">Scientifically Grounded • No Misleading 1-100 Score</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Nutrition */}
        <div 
          onClick={() => onSelectTab('nutrition')}
          className="card-white p-5 hover:border-brand-green-400 hover:shadow-soft-green transition-all cursor-pointer group border-t-4 border-t-emerald-500"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Salad className="w-5 h-5" />
            </div>
            <span className="badge-green text-xs font-bold">
              {lifestyle.nutrition.includes('Needs') ? 'Needs Attention' : 'Good'}
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nutrition Profile</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 group-hover:text-brand-green-800 transition-colors">
              {dietPreference}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Tailored low glycemic index recipes & high fiber balance.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-green-700 font-bold">
            <span>View Meal Plans</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Physical Activity */}
        <div 
          onClick={() => onSelectTab('exercise')}
          className="card-white p-5 hover:border-teal-400 hover:shadow-soft-green transition-all cursor-pointer group border-t-4 border-t-teal-500"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="badge-green text-xs font-bold">Active</span>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Movement & Cardio</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 group-hover:text-teal-800 transition-colors">
              {lifestyle.activity}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Aerobic conditioning & light strength training routine.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-bold">
            <span>View Exercise Plan</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Sleep & Wellness */}
        <div 
          onClick={() => onSelectTab('wellness')}
          className="card-white p-5 hover:border-brand-pink-400 hover:shadow-soft-pink transition-all cursor-pointer group border-t-4 border-t-brand-pink-500"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-rose-100 text-rose-800 rounded-xl">
              <Moon className="w-5 h-5" />
            </div>
            <span className="badge-pink text-xs font-bold">Optimal</span>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sleep & Rest</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 group-hover:text-rose-800 transition-colors">
              {lifestyle.sleep}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Consistent sleep latency & restorative REM cycle duration.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-700 font-bold">
            <span>Sleep & Mood Log</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Clinical Vitals Baseline */}
        <div 
          onClick={() => onSelectTab('reports')}
          className="card-white p-5 hover:border-emerald-400 hover:shadow-soft-green transition-all cursor-pointer group border-t-4 border-t-emerald-600"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="badge-green text-xs font-bold">Stable</span>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vitals Baseline</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 group-hover:text-emerald-800 transition-colors">
              BMI: {activeProfile.bmi} • {activeProfile.bloodGroup}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {conditions.length > 0 ? conditions.join(', ') : 'No chronic conditions recorded'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
            <span>View Lab Vitals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
}
