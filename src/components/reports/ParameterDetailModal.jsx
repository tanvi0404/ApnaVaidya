import React from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  Salad, 
  MessageSquareHeart, 
  BookOpenCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function ParameterDetailModal({ parameter, isOpen, onClose, onAskAi }) {
  if (!isOpen || !parameter) return null;

  const isHigh = parameter.status === 'HIGH';
  const isLow = parameter.status === 'LOW';
  const isNormal = parameter.status === 'NORMAL';

  // Calculate position percentage for visual range bar
  const rangeSpan = (parameter.maxNormal - parameter.minNormal) || 1;
  const paddingSpan = rangeSpan * 0.5;
  const minAxis = Math.max(0, parameter.minNormal - paddingSpan);
  const maxAxis = parameter.maxNormal + paddingSpan;
  const totalAxisSpan = maxAxis - minAxis || 1;
  
  const valuePosPercent = Math.min(100, Math.max(0, ((parameter.value - minAxis) / totalAxisSpan) * 100));
  const normalStartPercent = Math.max(0, ((parameter.minNormal - minAxis) / totalAxisSpan) * 100);
  const normalEndPercent = Math.min(100, ((parameter.maxNormal - minAxis) / totalAxisSpan) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200"
        role="dialog"
      >
        {/* Header */}
        <div className={`p-6 rounded-t-3xl border-b flex items-start justify-between ${
          isHigh 
            ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200' 
            : isLow
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
        }`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {parameter.category || 'Lab Parameter'}
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                isHigh 
                  ? 'bg-rose-600 text-white' 
                  : isLow
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {parameter.status}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              {parameter.name}
            </h2>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {parameter.value}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {parameter.unit}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                (Standard Reference: {parameter.minNormal} - {parameter.maxNormal} {parameter.unit})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white/80 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Visual Range Indicator Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span>Visual Clinical Range Placement</span>
              <span className={isNormal ? 'text-emerald-700' : 'text-rose-600 font-extrabold'}>
                {isNormal ? 'Within Healthy Limits' : 'Outside Reference Range'}
              </span>
            </div>

            {/* Custom Multi-Zone Range Bar */}
            <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden my-3 border border-slate-300">
              {/* Normal Zone */}
              <div 
                className="absolute top-0 bottom-0 bg-emerald-400/80 border-x border-emerald-600/40"
                style={{
                  left: `${normalStartPercent}%`,
                  width: `${normalEndPercent - normalStartPercent}%`
                }}
                title="Normal Range Zone"
              />

              {/* User Value Pin Marker */}
              <div 
                className="absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full shadow-md z-10 transition-all duration-500 flex items-center justify-center"
                style={{
                  left: `${valuePosPercent}%`,
                  backgroundColor: isHigh ? '#E11D48' : isLow ? '#D97706' : '#059669'
                }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
              <span>Min: {parameter.minNormal} {parameter.unit}</span>
              <span className="text-emerald-800 font-bold">Standard Target: {parameter.minNormal} - {parameter.maxNormal}</span>
              <span>Max: {parameter.maxNormal} {parameter.unit}</span>
            </div>
          </div>

          {/* Plain Language Explanation (Core USP) */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>What this means in plain language</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              {parameter.plainExplanation}
            </p>
          </div>

          {/* Clinical Meaning */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Medical Function</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {parameter.clinicalMeaning}
            </p>
          </div>

          {/* Lifestyle & Nutrition Guidance */}
          <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <Salad className="w-4 h-4 text-rose-600" />
              <span>Lifestyle & Nutrition Suggestions</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
              {parameter.lifestyleTip}
            </p>
          </div>

          {/* Doctor Discussion Question */}
          <div className="p-4 bg-white border-2 border-dashed border-emerald-300 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <MessageSquareHeart className="w-4 h-4 text-emerald-600" />
              <span>Recommended Question for Your Doctor</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 italic">
              "{parameter.doctorQuestion}"
            </p>
          </div>

          {/* Traceable RAG Citation */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100/70 p-3 rounded-xl">
            <div className="flex items-center gap-1.5">
              <BookOpenCheck className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-medium">Medical Reference Source:</span>
            </div>
            <span className="font-semibold text-slate-700">{parameter.sourceCitation}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close Details
          </button>

          <button
            onClick={() => {
              onClose();
              onAskAi(parameter);
            }}
            className="btn-primary-green text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Chikitsak AI About {parameter.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
