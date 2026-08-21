import React, { useEffect } from 'react';
import { 
  Printer, 
  X, 
  FileCheck, 
  Dna, 
  Syringe, 
  Heart,
  Calendar,
  Building2
} from 'lucide-react';
import { MEDICATIONS_DATA } from '../../data/medicationsData';
import { VACCINATION_RECORDS, FAMILY_HEREDITARY_HISTORY } from '../../data/vaultData';
import { CALCULATE_ASCVD_RISK, CALCULATE_IDRS_SCORE } from '../../data/riskCalculatorsData';

export default function FullHealthDossierModal({ isOpen, onClose, activeProfile, reports = [] }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safeReports = Array.isArray(reports) ? reports : [];
  const profileMeds = MEDICATIONS_DATA[activeProfile?.id] || MEDICATIONS_DATA['user-arjun'] || [];
  const profileVaccines = VACCINATION_RECORDS[activeProfile?.id] || VACCINATION_RECORDS['user-arjun'] || [];
  
  // Calculate ASCVD & IDRS
  const ascvd = CALCULATE_ASCVD_RISK(activeProfile?.age || 32, activeProfile?.gender || 'Male', 228, 52, 124, false, activeProfile?.id === 'user-rajesh');
  const idrs = CALCULATE_IDRS_SCORE(activeProfile?.age || 32, 84, 'Moderate Exercise / Regular Walking', 'One Parent Diabetic');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-h-none print:shadow-none print:border-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        
        {/* Sticky Top Header Action Bar (Always Visible & Clickable) */}
        <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-3xl shadow-xs print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="badge-green text-xs font-bold">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> COMPREHENSIVE CLINICAL HEALTH DOSSIER
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">{activeProfile?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary-green text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" /> 
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all flex items-center gap-1 text-xs font-bold"
              title="Close Dossier (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-8 font-sans text-slate-900 print:overflow-visible print:p-0">
          
          {/* Cover Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm">
                  AV
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight font-display text-slate-900">
                  Apna<span className="text-emerald-600">Vaidya</span> Comprehensive Health Dossier
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • Certified Electronic Health Record
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="badge-neutral font-bold block mb-1">Confidential Medical Record</span>
              <span className="text-slate-500 font-mono text-[11px]">Record ID: AV-{activeProfile?.id?.toUpperCase() || 'PATIENT'}-2026</span>
            </div>
          </div>

          {/* Section 1: Patient Demographics & Baseline Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Patient Name</span>
              <strong className="text-sm font-extrabold text-slate-900">{activeProfile?.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Age & Biological Sex</span>
              <strong className="text-slate-800">{activeProfile?.age} Years • {activeProfile?.gender}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Blood Group & Weight</span>
              <strong className="text-slate-800">{activeProfile?.bloodGroup} • {activeProfile?.weight} (BMI {activeProfile?.bmi})</strong>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Documented Allergies</span>
              <strong className="text-rose-700 font-bold">{activeProfile?.allergies?.join(', ') || 'No Known Drug Allergies'}</strong>
            </div>
          </div>

          {/* Section 2: Active Chronic Conditions & Goals */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              1. Documented Clinical Conditions & Care Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-500 font-bold block mb-1">Diagnosed Chronic Conditions:</span>
                <div className="font-semibold text-slate-800">
                  {activeProfile?.conditions?.length ? activeProfile.conditions.join(' • ') : 'Healthy Baseline (Preventive Wellness)'}
                </div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-500 font-bold block mb-1">Active Health Goals:</span>
                <div className="font-semibold text-emerald-800">
                  {activeProfile?.goals?.join(' • ') || 'Longevity & Health Maintenance'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Diagnostic Lab Biomarkers Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              2. Recent Laboratory Biomarkers & Reference Status
            </h3>
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5">Biomarker Test</th>
                  <th className="p-2.5">Observed Value</th>
                  <th className="p-2.5">Clinical Reference</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {safeReports[0]?.parameters?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                    <td className="p-2.5 font-extrabold text-slate-900">{p.value} {p.unit}</td>
                    <td className="p-2.5 text-slate-500">{p.minNormal} - {p.maxNormal} {p.unit}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        p.status === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                        p.status === 'LOW' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Current Medication Schedule */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              3. Current Prescribed Pharmacotherapy Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {profileMeds.map((med) => (
                <div key={med.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between">
                  <div>
                    <strong className="text-slate-900 block text-xs">{med.name} ({med.dosage})</strong>
                    <span className="text-slate-500 text-[11px] block">{med.genericName}</span>
                    <span className="text-slate-600 text-[11px] block mt-1">🕒 {med.timing || med.timeSlot} • {med.foodInstruction || med.mealTiming}</span>
                  </div>
                  <span className="badge-green text-[10px] font-bold">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Cardiovascular & Metabolic Risk Projections */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              4. Algorithmic Clinical Risk Indices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">10-Year ASCVD Risk (ACC/AHA)</span>
                <div className="text-2xl font-extrabold text-emerald-950 mt-1">{ascvd.riskPercent}%</div>
                <p className="text-[11px] text-emerald-900 mt-1">{ascvd.recommendation}</p>
              </div>

              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-rose-800 block">Indian Diabetes Risk Score (IDRS)</span>
                <div className="text-2xl font-extrabold text-rose-950 mt-1">{idrs.score} / 100</div>
                <p className="text-[11px] text-rose-900 mt-1">{idrs.advice}</p>
              </div>
            </div>
          </div>

          {/* Section 6: Vaccination & Family Hereditary Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5 text-emerald-600" /> Immunization Ledger
              </h4>
              <ul className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {profileVaccines.map((v) => (
                  <li key={v.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-800 font-semibold">{v.name}</span>
                    <span className="text-slate-500 font-bold">{v.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-rose-500" /> Documented Hereditary Risk
              </h4>
              <ul className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {FAMILY_HEREDITARY_HISTORY.map((h, idx) => (
                  <li key={idx} className="text-[11px] flex items-center justify-between">
                    <span className="text-slate-800 font-semibold">{h.condition} ({h.relation})</span>
                    <span className="text-rose-700 font-bold">{h.riskLevel}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clinician Signature Section */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="italic text-[11px] max-w-sm">
                This document is an AI-compiled personal health record summary intended for clinical coordination with licensed healthcare professionals.
              </p>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-slate-400 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Reviewing Physician Signature / Stamp</span>
            </div>
          </div>

        </div>

        {/* Sticky Bottom Footer Bar for Convenient Closure */}
        <div className="sticky bottom-0 bg-slate-50/95 border-t border-slate-200 px-6 py-3 flex items-center justify-between rounded-b-3xl print:hidden shrink-0">
          <span className="text-xs text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> or click outside to dismiss
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-outline-white text-xs py-1.5 px-4 font-bold"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary-green text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
