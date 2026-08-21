import React from 'react';
import { 
  X, 
  Clock, 
  Flame, 
  Salad, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Users, 
  Utensils,
  BookOpen
} from 'lucide-react';

export default function RecipeModal({ recipe, isOpen, onClose }) {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
      >
        {/* Header with Green/Pink Gradient */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-rose-50 flex items-start justify-between rounded-t-3xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="badge-green text-xs font-bold">{recipe.category}</span>
              <span className="badge-neutral text-xs">{recipe.cuisine}</span>
              <span className="badge-pink text-xs">{recipe.calories} kcal / serving</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              {recipe.title}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {recipe.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white transition-all ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Prep Time</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">{recipe.prepTime}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Cook Time</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">{recipe.cookTime}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Yield</div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">{recipe.servings} Servings</div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <div className="text-[11px] text-emerald-700 font-bold uppercase">Calories</div>
              <div className="text-sm font-extrabold text-emerald-900 mt-0.5">{recipe.calories} kcal</div>
            </div>
          </div>

          {/* Macronutrients Gauge Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Macronutrient Profile (Per Serving)
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Protein</span>
                <span className="text-sm font-extrabold text-emerald-700">{recipe.macros.protein}</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Carbohydrates</span>
                <span className="text-sm font-extrabold text-slate-800">{recipe.macros.carbs}</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Fats</span>
                <span className="text-sm font-extrabold text-slate-800">{recipe.macros.fats}</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Fiber</span>
                <span className="text-sm font-extrabold text-teal-700">{recipe.macros.fiber}</span>
              </div>
            </div>
          </div>

          {/* Health Benefits (AI Clinical Highlights) */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Cardiometabolic Health Benefits</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950">
              {recipe.healthBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Two-Column: Ingredients & Preparation Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-slate-600" /> Ingredients ({recipe.ingredients.length})
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green-500 mt-1.5 flex-shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-600" /> Step-by-Step Preparation
              </h4>
              <div className="space-y-2.5">
                {recipe.instructions.map((step, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
                    <span className="w-5 h-5 rounded-lg bg-brand-green-100 text-brand-green-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            {recipe.tags.map((tag, idx) => (
              <span key={idx} className="badge-neutral text-[10px]">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Close Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
