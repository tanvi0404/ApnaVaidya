import React from 'react';
import { 
  Salad, 
  Clock, 
  Flame, 
  ChevronRight, 
  Sparkles, 
  Target,
  ArrowRight,
  Info
} from 'lucide-react';
import { PROFILE_MEAL_PLANS, RECIPES_DATA } from '../../data/nutritionData';
import { fetchNutritionPlanBackend } from '../../services/apiClient';

export default function MealPlanner({ activeProfile, onSelectRecipe }) {
  const localPlan = PROFILE_MEAL_PLANS[activeProfile.id] || PROFILE_MEAL_PLANS['user-arjun'];
  const [plan, setPlan] = React.useState(localPlan);

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    fetchNutritionPlanBackend({
      profileId: activeProfile.id,
      hba1c: activeProfile.id === 'user-rajesh' ? 7.4 : 5.8,
      ldl: 146.0
    }).then(res => {
      if (isMounted && res) {
        setPlan(prev => ({
          ...prev,
          targetCalories: res.dailyCalories || prev.targetCalories,
          goal: res.primaryFocus || prev.goal,
          macros: {
            protein: `${res.proteinGrams || 95}g (${Math.round((res.proteinGrams * 4 / res.dailyCalories) * 100)}%)`,
            carbs: `${res.carbGrams || 215}g (${Math.round((res.carbGrams * 4 / res.dailyCalories) * 100)}%)`,
            fats: `${res.fatGrams || 58}g (${Math.round((res.fatGrams * 9 / res.dailyCalories) * 100)}%)`,
            fiber: prev.macros.fiber || '35g (High soluble)'
          }
        }));
      }
    }).catch(err => console.warn('Nutrition client fallback:', err));

    return () => { isMounted = false; };
  }, [activeProfile.id]);

  return (
    <div className="card-white p-6 space-y-6">
      
      {/* Header & Daily Target Overview */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-green text-xs font-bold">
              <Sparkles className="w-3 h-3 text-brand-pink-500" /> AI CLINICAL NUTRITION PLAN
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Personalized for {activeProfile.name}</span>
          </div>
          
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display mt-1">
            Daily Meal Schedule & Macro Targets
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Goal: <strong className="text-brand-green-800">{plan.goal}</strong>
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-brand-green-700">
            {plan.targetCalories} <span className="text-xs text-slate-500 font-semibold">kcal / day</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Energy Balance Target</span>
        </div>
      </div>

      {/* Macronutrient Distribution Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <div className="text-[10px] text-emerald-800 font-bold uppercase">Daily Protein</div>
          <div className="text-base font-extrabold text-emerald-950 mt-0.5">{plan.macros.protein}</div>
          <div className="text-[10px] text-emerald-700 mt-1">Lean tissue maintenance</div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Complex Carbs</div>
          <div className="text-base font-extrabold text-slate-800 mt-0.5">{plan.macros.carbs}</div>
          <div className="text-[10px] text-slate-500 mt-1">Low-glycemic slow release</div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Healthy Fats</div>
          <div className="text-base font-extrabold text-slate-800 mt-0.5">{plan.macros.fats}</div>
          <div className="text-[10px] text-slate-500 mt-1">Omega-3 & Monounsaturated</div>
        </div>

        <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl">
          <div className="text-[10px] text-teal-800 font-bold uppercase">Dietary Fiber</div>
          <div className="text-base font-extrabold text-teal-950 mt-0.5">{plan.macros.fiber}</div>
          <div className="text-[10px] text-teal-700 mt-1">Lipid & glycemic binding</div>
        </div>
      </div>

      {/* Meal Breakdown Timeline */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Structured Daily Meal Timeline
        </div>

        <div className="space-y-3">
          {plan.schedule.map((meal, idx) => {
            const matchedRecipe = RECIPES_DATA.find(r => r.id === meal.recipeId);

            return (
              <div
                key={idx}
                onClick={() => matchedRecipe && onSelectRecipe(matchedRecipe)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-green-400 hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex items-start gap-3 min-w-[240px] flex-1">
                  <div className="p-2.5 bg-brand-green-50 text-brand-green-700 group-hover:bg-brand-green-600 group-hover:text-white rounded-xl transition-colors mt-0.5">
                    <Salad className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-brand-green-800">
                        {meal.mealType}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                        {meal.calories} kcal • {meal.protein} protein
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-green-900 mt-0.5 transition-colors">
                      {meal.name}
                    </h4>

                    <p className="text-xs text-slate-500 mt-0.5">
                      💡 {meal.notes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-green-700 group-hover:underline">
                    View Recipe & Macros
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-green-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Nutrition Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Educational Guidance Note:</span> ApnaVaidya meal plans are general wellness recommendations customized to your profile parameters. Individuals with kidney disease (low protein needs) or insulin therapy should always verify portions with their clinical dietitian.
        </div>
      </div>

    </div>
  );
}
