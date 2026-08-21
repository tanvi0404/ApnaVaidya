import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Salad, 
  Zap, 
  Info, 
  Scale,
  Flame,
  Activity
} from 'lucide-react';
import { CLINICAL_CONVERTERS, INDIAN_GLYCEMIC_FOODS } from '../../data/convertersData';

export default function ClinicalConvertersView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('units'); // 'units' | 'glycemic'
  const [selectedConverterId, setSelectedConverterId] = useState(CLINICAL_CONVERTERS[0].id);
  const [inputValue, setInputValue] = useState(CLINICAL_CONVERTERS[0].defaultVal);
  const [inputDirection, setInputDirection] = useState('convToSi'); // 'convToSi' | 'siToConv'
  
  const [searchQuery, setSearchQuery] = useState('');
  const [giFilter, setGiFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'

  const currentConverter = CLINICAL_CONVERTERS.find(c => c.id === selectedConverterId) || CLINICAL_CONVERTERS[0];

  // Calculated Output
  let calculatedOutput = 0;
  if (inputDirection === 'convToSi') {
    calculatedOutput = currentConverter.convToSi(Number(inputValue) || 0);
  } else {
    calculatedOutput = currentConverter.siToConv(Number(inputValue) || 0);
  }

  // Filtered Food Matrix
  const filteredFoods = INDIAN_GLYCEMIC_FOODS.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGi = giFilter === 'ALL' || food.giCategory === giFilter;
    return matchesSearch && matchesGi;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Scale className="w-3.5 h-3.5" /> CLINICAL CONVERSION & GLYCEMIC METRIC ENGINE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Lab Value Unit Converter & Food Glycemic Index Matrix
            </h2>
          </div>

          {/* Sub-tab Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('units')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'units'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lab Unit Converter (SI ↔ Conventional)
            </button>
            <button
              onClick={() => setActiveTab('glycemic')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'glycemic'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Indian Food Glycemic Index (GI & GL)
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'units' ? (
        /* Clinical Unit Converter View */
        <div className="space-y-6">
          
          {/* Biomarker Selector Tabs */}
          <div className="card-white p-5 space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Select Biomarker Test to Convert:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {CLINICAL_CONVERTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedConverterId(c.id);
                    setInputValue(c.defaultVal);
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                    selectedConverterId === c.id
                      ? 'bg-brand-green-600 text-white font-extrabold shadow-soft-green border-brand-green-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <strong className="block truncate">{c.name.split('/')[0].trim()}</strong>
                  <span className={`text-[10px] block mt-0.5 ${
                    selectedConverterId === c.id ? 'text-emerald-100' : 'text-slate-400'
                  }`}>
                    {c.conventionalUnit.split(' ')[0]} ↔ {c.siUnit.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Two-Way Converter Card */}
          <div className="card-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  {currentConverter.name} Conversion
                </h3>
                <p className="text-xs text-slate-500">
                  {currentConverter.notes}
                </p>
              </div>

              {/* Swap Direction Toggle */}
              <button
                onClick={() => {
                  setInputDirection(inputDirection === 'convToSi' ? 'siToConv' : 'convToSi');
                  setInputValue(calculatedOutput);
                }}
                className="btn-secondary-green text-xs flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Units
              </button>
            </div>

            {/* Converter Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Input Side */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {inputDirection === 'convToSi' ? currentConverter.conventionalUnit : currentConverter.siUnit}
                  </span>
                  <span className="badge-neutral text-[10px]">Input</span>
                </div>

                <input
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="w-full text-3xl sm:text-4xl font-black font-display text-slate-900 bg-white p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-brand-green-500"
                />

                <div className="text-[11px] text-slate-500 pt-1">
                  Reference Range: <strong>{inputDirection === 'convToSi' ? currentConverter.normalConventional : currentConverter.normalSi}</strong>
                </div>
              </div>

              {/* Output Result Side */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    {inputDirection === 'convToSi' ? currentConverter.siUnit : currentConverter.conventionalUnit}
                  </span>
                  <span className="badge-green text-[10px]">Calculated Output</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black font-display text-emerald-950 bg-white p-3 rounded-2xl border border-emerald-200">
                  {calculatedOutput}
                </div>

                <div className="text-[11px] text-emerald-800 pt-1">
                  Reference Range: <strong>{inputDirection === 'convToSi' ? currentConverter.normalSi : currentConverter.normalConventional}</strong>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Indian Food Glycemic Index & Load Matrix View */
        <div className="card-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Salad className="w-4 h-4 text-brand-green-600" />
                Indian Food Glycemic Index (GI) & Glycemic Load (GL) Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Helps diabetic and prediabetic individuals understand postprandial glucose impact per portion.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search moong, ragi, rice..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                />
              </div>

              {/* GI Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setGiFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      giFilter === cat
                        ? 'bg-brand-green-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Foods Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Food Name & Portion</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Glycemic Index (GI)</th>
                  <th className="p-3">Glycemic Load (GL)</th>
                  <th className="p-3">Clinical Meal Impact Tip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <strong className="text-slate-900 font-bold block">{food.name}</strong>
                      <span className="text-[11px] text-slate-400">Serving: {food.servingSize}</span>
                    </td>
                    <td className="p-3 text-slate-600">{food.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        food.giCategory === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800'
                          : food.giCategory === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        GI {food.gi} ({food.giCategory})
                      </span>
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 font-extrabold">{food.gl}</strong>
                      <span className="text-[10px] text-slate-400 block">{food.glCategory} Load</span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs">
                      {food.impactTip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
