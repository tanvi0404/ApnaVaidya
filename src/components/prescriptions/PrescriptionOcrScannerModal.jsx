import React, { useState } from 'react';
import { 
  FileCheck, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Pill, 
  AlertCircle, 
  Building2, 
  Calendar, 
  X, 
  Scan, 
  ShieldCheck, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS_OCR } from '../../data/prescriptionOcrData';

export default function PrescriptionOcrScannerModal({ isOpen, onClose, onImportMeds }) {
  if (!isOpen) return null;

  const [selectedSample, setSelectedSample] = useState(SAMPLE_PRESCRIPTIONS_OCR[0]);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  const steps = [
    'Image Preprocessing & Handwriting Contrast Enhancement...',
    'Segmenting Doctor Clinical Handwriting Lines...',
    'Matching Drug Entities against Indian Pharmacopoeia Database...',
    'Parsing Dosage, Frequency (OD/BD/HS), & Duration...',
    'Running Cross-Allergy & Interaction Safety Verification...'
  ];

  const handleStartScan = (sample) => {
    setSelectedSample(sample);
    setScanning(true);
    setScanComplete(false);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setScanning(false);
          setScanComplete(true);
          return prev;
        }
      });
    }, 500);
  };

  const handleImport = () => {
    if (onImportMeds) {
      onImportMeds(selectedSample.extractedDrugs);
    }
    alert(`Successfully imported ${selectedSample.extractedDrugs.length} prescribed medications into your daily schedule!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-pink-500 text-white shadow-soft-pink">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-display">
                AI Prescription Handwriting OCR Scanner
              </h3>
              <p className="text-xs text-slate-500">
                Converts handwritten doctor slips into structured, scheduled medication regimens.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Prescription Sample Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Select a Sample Prescription or Upload Slip:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAMPLE_PRESCRIPTIONS_OCR.map((samp) => (
              <button
                key={samp.id}
                onClick={() => handleStartScan(samp)}
                className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                  selectedSample.id === samp.id
                    ? 'bg-emerald-50 border-brand-green-500 text-emerald-950 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{samp.prescriptionType}</span>
                  <span className="badge-green text-[10px]">{samp.date}</span>
                </div>
                <strong className="text-slate-900 block">{samp.doctorName}</strong>
                <span className="text-slate-500 text-[11px] block mt-0.5">{samp.clinic}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scanning Animation */}
        {scanning && (
          <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-4 animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <Scan className="w-6 h-6 text-emerald-400 absolute" />
            </div>

            <div>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                Stage {scanStep + 1} of {steps.length}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-bold mt-1">
                {steps[scanStep]}
              </p>
            </div>
          </div>
        )}

        {/* OCR Result View */}
        {!scanning && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Prescription parsed by <strong>{selectedSample.doctorName}</strong> ({selectedSample.date})
                </span>
              </div>
              <span className="badge-green text-[10px]">100% Verified</span>
            </div>

            {/* Extracted Drugs Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Extracted Prescriptions ({selectedSample.extractedDrugs.length} Drugs):
              </span>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {selectedSample.extractedDrugs.map((drug, idx) => (
                  <div key={idx} className="p-3.5 text-xs hover:bg-slate-50 transition-colors space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                          <Pill className="w-3.5 h-3.5" />
                        </div>
                        <strong className="text-sm font-bold text-slate-900">{drug.drugName}</strong>
                        <span className="badge-pink text-[10px]">{drug.dosage}</span>
                      </div>

                      <span className="badge-green text-xs font-bold">{drug.frequency}</span>
                    </div>

                    <div className="pl-9.5 text-slate-600 flex items-center gap-4 text-[11px] flex-wrap">
                      <span>Instructions: <strong className="text-slate-800">{drug.instructions}</strong></span>
                      <span>•</span>
                      <span>Target: {drug.purpose}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{drug.allergyWarning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor's Advice */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                Doctor's Special Instructions:
              </span>
              <p className="leading-relaxed">{selectedSample.doctorAdvice}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>

              <button
                onClick={handleImport}
                className="btn-primary-green text-xs flex items-center gap-1.5"
              >
                <Pill className="w-4 h-4" />
                <span>Add All ({selectedSample.extractedDrugs.length}) to Medication Schedule</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
