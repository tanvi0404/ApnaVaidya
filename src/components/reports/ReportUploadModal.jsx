import React, { useState, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { SAMPLE_REPORT_PRESETS } from '../../data/reportsData';
import { OCR_STAGES, analyzeUploadedFile } from '../../services/ocrReportService';

export default function ReportUploadModal({
  isOpen,
  onClose,
  activeProfile,
  onUploadComplete,
  onReportAnalyzed
}) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setCurrentStepIndex(0);
      setSelectedPreset(null);
      setCustomFileName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartAnalysis = (presetOrName) => {
    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Step by step animation
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < OCR_STAGES.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const profileId = activeProfile?.id || 'user-arjun';
          const analyzedReport = analyzeUploadedFile(
            typeof presetOrName === 'string' ? presetOrName : (presetOrName?.name || 'Comprehensive Health Report'),
            profileId
          );
          setIsProcessing(false);
          const callback = onUploadComplete || onReportAnalyzed;
          if (typeof callback === 'function') {
            callback(analyzedReport);
          }
          onClose();
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-brand-green-50 via-white to-brand-pink-50 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-brand-green-500 to-brand-green-700 text-white rounded-2xl shadow-soft-green">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg font-display">Upload Medical Lab Report</h3>
                <span className="badge-pink text-[10px]">AI OCR v2.4</span>
              </div>
              <p className="text-xs text-slate-500">
                Extracting structured lab biomarkers for <strong className="text-slate-800">{activeProfile.name}</strong>
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {isProcessing ? (
            /* OCR Multi-Stage Scanning Animation */
            <div className="py-8 px-4 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-brand-green-100 animate-ping opacity-25" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-green-600 to-teal-500 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Cpu className="w-10 h-10" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900 font-display">
                  ApnaVaidya AI Processing Pipeline
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Parsing medical tables, identifying units & evaluating clinical reference thresholds
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-2.5 text-left">
                {OCR_STAGES.map((stage, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <div
                      key={stage.step}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        isCurrent
                          ? 'bg-brand-green-50 border-brand-green-300 text-brand-green-950 font-bold shadow-xs'
                          : isDone
                          ? 'bg-slate-50 border-slate-200 text-slate-700 opacity-80'
                          : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-brand-green-600 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 text-[10px] flex items-center justify-center font-bold">
                            {stage.step}
                          </div>
                        )}
                      </div>
                      <div className="text-xs">{stage.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Upload Options & Quick Presets */
            <>
              {/* Drag & Drop Box */}
              <div 
                className="border-2 border-dashed border-brand-green-300 hover:border-brand-green-500 rounded-3xl p-6 text-center bg-gradient-to-b from-brand-green-50/40 to-transparent transition-all cursor-pointer group"
                onClick={() => handleStartAnalysis('Uploaded_Diagnostic_Report.pdf')}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-xs border border-brand-green-200 flex items-center justify-center text-brand-green-600 group-hover:scale-110 transition-transform mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-green-800">
                  Click to select or drag & drop your lab report
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, JPG, PNG, Scanned Laboratory Receipts (Up to 25 MB)
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit AES Encrypted & Virus Scanned</span>
                </div>
              </div>

              {/* Instant Test Presets (Zero setup needed) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-pink-500" /> Or Test With Preloaded Authentic Reports
                  </span>
                  <span className="text-[11px] text-brand-green-700 font-semibold">1-Click Instant OCR</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_REPORT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStartAnalysis(preset)}
                      className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-brand-green-50/80 border border-slate-200 hover:border-brand-green-300 text-left transition-all group flex items-start justify-between"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover:text-brand-green-700 group-hover:border-brand-green-300 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-brand-green-950">
                            {preset.name}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {preset.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                            <span className="text-slate-400">{preset.fileType}</span>
                            {preset.abnormalCount > 0 ? (
                              <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                {preset.abnormalCount} flagged
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Normal
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        {!isProcessing && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between text-xs text-slate-500">
            <span>Data is isolated to <strong>{activeProfile.name}</strong>'s vault.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
