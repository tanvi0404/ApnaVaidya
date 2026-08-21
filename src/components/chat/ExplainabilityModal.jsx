import React from 'react';
import { X, Sparkles, BookOpenCheck, ShieldCheck, Database, FileText, UserCheck } from 'lucide-react';

export default function ExplainabilityModal({ explainability, ragSources = [], isOpen, onClose }) {
  if (!isOpen || !explainability) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-brand-green-50 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-green-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display">
                AI Explainability & Traceability Layer
              </h3>
              <p className="text-xs text-slate-500">
                Transparent breakdown of exact health data and medical literature used
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Item 1: Profile Context */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>User Profile Grounding</span>
            </div>
            <p className="text-slate-800 font-semibold text-xs sm:text-sm">
              {explainability.profileContextUsed}
            </p>
          </div>

          {/* Item 2: Report Context */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Diagnostic Report Context</span>
            </div>
            <p className="text-slate-800 font-semibold text-xs sm:text-sm">
              {explainability.reportContextUsed}
            </p>
          </div>

          {/* Item 3: RAG Medical Chunks Retrieved */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[10px]">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>RAG Knowledge Base Evidence Chunk</span>
            </div>

            {ragSources.map((rag, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rag.title}</span>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                    {rag.evidenceLevel}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {rag.summary}
                </p>
                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  Source: <strong>{rag.source}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Item 4: Safety Rule */}
          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-slate-900">Safety Guardrail:</span>
            </div>
            <span className="font-bold text-rose-800">{explainability.safetyRuleApplied}</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
