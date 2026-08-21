import React, { useState } from 'react';
import { 
  Salad, 
  Clock, 
  Flame, 
  ChevronRight, 
  Sparkles, 
  Filter,
  Search
} from 'lucide-react';
import { RECIPES_DATA } from '../../data/nutritionData';

export default function RecipeLibrary({ onSelectRecipe }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'High Protein', 'Diabetic-Friendly', 'Heart Healthy'];

  const filteredRecipes = RECIPES_DATA.filter(recipe => {
    const matchesCategory = selectedCategory === 'ALL' || recipe.category === selectedCategory || recipe.tags.includes(selectedCategory);
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
            Cardiometabolic & Indian Health Recipe Index
          </h3>
          <p className="text-xs text-slate-500">
            Nutrient-calculated recipes designed for glycemic control, heart health & muscle tone.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[200px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ingredients, recipes, tags..."
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
                ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50 hover:border-brand-green-300'
            }`}
          >
            {cat === 'ALL' ? 'All Recipes' : cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe)}
            className="card-white p-5 hover:border-brand-green-400 hover:shadow-soft-green transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="badge-green text-[10px] font-bold">
                  {recipe.category}
                </span>
                <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {recipe.calories} kcal
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-green-900 transition-colors">
                {recipe.title}
              </h4>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>

              {/* Macro Pills */}
              <div className="grid grid-cols-3 gap-1.5 my-3 text-center text-[10px] font-bold">
                <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                  P: {recipe.macros.protein}
                </div>
                <div className="p-1.5 bg-slate-50 text-slate-700 rounded-lg">
                  C: {recipe.macros.carbs}
                </div>
                <div className="p-1.5 bg-teal-50 text-teal-800 rounded-lg">
                  Fib: {recipe.macros.fiber}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {recipe.prepTime} prep
              </span>
              <span className="font-bold text-brand-green-700 group-hover:underline flex items-center gap-0.5">
                View Recipe <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
