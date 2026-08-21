import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  UserCheck, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Tag,
  BookOpenCheck
} from 'lucide-react';
import { VERIFIED_FEED_ARTICLES } from '../../data/advancedData';

export default function VerifiedFeedView({ activeProfile }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" /> CLINICAL EVIDENCE & DOCTOR-REVIEWED FEED
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Personalized Medical Content & Evidence Feed
            </h2>
          </div>

          <span className="badge-pink text-xs font-bold">
            Tailored to Your Diagnostic Biomarkers
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VERIFIED_FEED_ARTICLES.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="card-white p-6 hover:border-brand-green-400 hover:shadow-soft-green transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="badge-green text-[10px] font-bold">
                  {art.category}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" /> {art.readTime}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-green-900 transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap my-3">
                {art.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] truncate max-w-[140px]">{art.author}</span>
              <span className="font-bold text-brand-green-700 group-hover:underline flex items-center gap-0.5 flex-shrink-0">
                Read Article <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex-1">
                <span className="badge-green text-xs font-bold mb-2 inline-block">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  {selectedArticle.title}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Reviewed by: <strong>{selectedArticle.author}</strong> • {selectedArticle.readTime}
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedArticle.summary}
            </p>

            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Key Clinical Takeaways
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                {selectedArticle.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Citation: <strong>{selectedArticle.citation}</strong></span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedArticle(null)}
                className="btn-primary-green text-xs"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
