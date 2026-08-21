import React, { useState } from 'react';
import MealPlanner from './MealPlanner';
import RecipeLibrary from './RecipeLibrary';
import RecipeModal from './RecipeModal';
import { Sparkles, Utensils, Apple, Heart } from 'lucide-react';

export default function NutritionView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'recipes'
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Nutrition Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-rose-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Apple className="w-3.5 h-3.5 text-brand-pink-500" /> PERSONALIZED NUTRITION & RECIPES
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.dietPreference}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Clinical Nutrition & Indian Wellness Kitchen
            </h2>
          </div>

          {/* Sub-tabs toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'plan'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Meal Plan
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'recipes'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Health Recipe Index
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'plan' ? (
        <MealPlanner
          activeProfile={activeProfile}
          onSelectRecipe={setSelectedRecipe}
        />
      ) : (
        <RecipeLibrary
          onSelectRecipe={setSelectedRecipe}
        />
      )}

      {/* Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

    </div>
  );
}
