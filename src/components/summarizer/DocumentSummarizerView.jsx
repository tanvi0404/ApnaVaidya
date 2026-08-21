import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Pill, 
  AlertCircle, 
  Building2, 
  Calendar,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { DOCUMENT_SUMMARIES_PRESETS } from '../../data/advancedData';

export default function DocumentSummarizerView({ activeProfile }) {
  const [selectedPresetId, setSelectedPresetId] = useState(DOCUMENT_SUMMARIES_PRESETS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeDoc = DOCUMENT_SUMMARIES_PRESETS.find(d => d.id === selectedPresetId) || DOCUMENT_SUMMARIES_PRESETS[0];

  const handleSelectSample = (id) => {
    setIsProcessing(true);
    setSelectedPresetId(id);
    setTimeout(() => setIsProcessing(false), 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-brand-green-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5" /> CLINICAL DOCUMENT SUMMARIZER
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Prescription & Discharge Document Summarizer
            </h2>
          </div>

          <button
            onClick={() => alert('Simulated document upload: Please choose a preset below to see instant AI extraction.')}
            className="btn-primary-green text-xs"
          >
            <UploadCloud className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DOCUMENT_SUMMARIES_PRESETS.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelectSample(doc.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedPresetId === doc.id
                ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-brand-green-300'
            }`}
          >
            {doc.title}
          </button>
        ))}
      </div>

      {/* Main Extracted Summary Card */}
      <div className="card-white p-6 sm:p-8 space-y-6">
        
        {/* Document Meta Header */}
        <div className="border-b border-slate-200/80 pb-4 flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="badge-neutral text-xs font-bold mb-1 block w-fit">
              Hospital Document Extraction
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
              {activeDoc.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {activeDoc.hospital}
              </span>
              <span>•</span>
              <span>Timeline: {activeDoc.admissionDate} → {activeDoc.dischargeDate}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">Primary Clinical Diagnosis</span>
            <strong className="text-slate-900 font-extrabold text-sm">{activeDoc.primaryDiagnosis}</strong>
          </div>
        </div>

        {/* Key Findings Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-green-600" />
            Extracted Clinical Findings
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeDoc.aiStructuredSummary.keyFindings.map((finding, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">Key Detail #{idx + 1}</span>
                {finding}
              </div>
            ))}
          </div>
        </div>

        {/* Prescribed Medications Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-rose-500" />
            Prescribed Medications & Dosages
          </h4>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {activeDoc.aiStructuredSummary.dischargeMedications.map((med, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">{med.drug}</strong>
                    <span className="text-slate-500 text-[11px]">{med.dose}</span>
                  </div>
                </div>
                <span className="badge-green text-xs font-bold">
                  Duration: {med.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Discharge Instructions */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            Care & Recovery Directives
          </h4>
          <ul className="space-y-1 text-xs text-emerald-950">
            {activeDoc.aiStructuredSummary.dischargeInstructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
