import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Pill, 
  MessageSquareHeart, 
  User, 
  Activity,
  CheckCircle2,
  Calendar,
  Share2
} from 'lucide-react';
import { PATIENT_CONCERNS_SEED } from '../../data/doctorsData';
import { MEDICATIONS_DATA } from '../../data/medicationsData';

export default function DoctorVisitSummary({ activeProfile, reports = [] }) {
  const [patientConcerns, setPatientConcerns] = useState(
    PATIENT_CONCERNS_SEED[activeProfile.id] || PATIENT_CONCERNS_SEED['user-arjun']
  );
  const [newConcernInput, setNewConcernInput] = useState('');
  
  const profileMeds = MEDICATIONS_DATA[activeProfile.id] || [];
  const profileReports = reports.filter(r => r.profileId === activeProfile.id);

  // Extract all out-of-range parameters across recent reports
  const abnormalParameters = [];
  profileReports.forEach(rep => {
    rep.parameters.forEach(param => {
      if (param.status !== 'NORMAL' && !abnormalParameters.some(p => p.name === param.name)) {
        abnormalParameters.push({
          ...param,
          reportTitle: rep.title,
          testDate: rep.testDate
        });
      }
    });
  });

  const handleAddConcern = (e) => {
    e.preventDefault();
    if (!newConcernInput.trim()) return;
    setPatientConcerns(prev => [...prev, newConcernInput.trim()]);
    setNewConcernInput('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Action Toolbar */}
      <div className="card-white p-4 bg-gradient-to-r from-white via-emerald-50/40 to-brand-green-50/30 flex items-center justify-between flex-wrap gap-3 print:hidden">
        <div>
          <span className="badge-green text-xs font-bold">
            <Sparkles className="w-3 h-3 text-brand-pink-500" /> AI CLINICAL CONSULTATION PREP
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display mt-0.5">
            Doctor-Ready Visit Summary
          </h3>
          <p className="text-xs text-slate-500">
            Auto-synthesizes abnormal lab trends, active medications, symptoms & targeted clinician questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="btn-primary-green text-xs shadow-soft-green"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Clinical Sheet Canvas */}
      <div className="card-white p-6 sm:p-8 bg-white border border-slate-300 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
        
        {/* Header Sheet Banner */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                AV
              </div>
              <span className="text-xl font-extrabold text-slate-900 font-display tracking-tight">
                ApnaVaidya Pre-Consultation Summary
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized Patient Clinical Dossier • Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 block">Confidential Medical Record</span>
            <span className="text-slate-500">For Authorized Clinician Review</span>
          </div>
        </div>

        {/* Patient Demographics & Baseline Vitals */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
            <strong className="text-slate-900 text-sm">{activeProfile.name}</strong>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender / Blood</span>
            <strong className="text-slate-800">{activeProfile.age} yrs • {activeProfile.gender} • {activeProfile.bloodGroup}</strong>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Height / Weight / BMI</span>
            <strong className="text-slate-800">{activeProfile.height} • {activeProfile.weight} • BMI {activeProfile.bmi}</strong>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Known Allergies</span>
            <span className="font-extrabold text-rose-700">{(activeProfile?.allergies || []).join(', ') || 'NKDA'}</span>
          </div>
        </div>

        {/* Section 1: Recent Abnormal Lab Biomarkers */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>1. Recent Lab Biomarkers Outside Standard Reference</span>
          </div>

          {abnormalParameters.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-emerald-50 rounded-xl">
              All recent lab biomarkers are within standard clinical reference boundaries.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {abnormalParameters.map((param, idx) => (
                <div key={idx} className="p-3.5 bg-rose-50/50 border border-rose-200/80 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{param.name}</strong>
                    <span className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-md">
                      {param.value} {param.unit} (High)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ref Target: {param.minNormal} - {param.maxNormal} {param.unit} • Test: {param.testDate}
                  </div>
                  <p className="text-[11px] text-rose-950 font-medium pt-0.5">
                    {param.plainExplanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Active Prescriptions & Regimen */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            <Pill className="w-4 h-4 text-brand-green-600" />
            <span>2. Current Active Prescriptions & Adherence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {profileMeds.map(med => (
              <div key={med.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <strong className="text-slate-900">{med.name} ({med.dosage})</strong>
                  <div className="text-[11px] text-slate-500">{med.timeSlot} • {med.mealTiming}</div>
                  <div className="text-[10px] text-emerald-800 font-medium">Target: {med.purpose}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                  Adherent
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Patient-Reported Concerns */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>3. Patient-Reported Concerns & Symptoms</span>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-800">
            {patientConcerns.map((concern, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-teal-700">•</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>

          {/* Add concern form (hidden in print) */}
          <form onSubmit={handleAddConcern} className="flex items-center gap-2 pt-1 print:hidden">
            <input
              type="text"
              placeholder="Add another symptom or question for doctor..."
              value={newConcernInput}
              onChange={e => setNewConcernInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Add Concern
            </button>
          </form>
        </div>

        {/* Section 4: AI Suggested Clinician Discussion Questions */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            <MessageSquareHeart className="w-4 h-4 text-rose-600" />
            <span>4. Suggested Topics & Questions to Discuss with Physician</span>
          </div>

          <div className="space-y-2 text-xs">
            {abnormalParameters.slice(0, 3).map((p, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-2">
                <span className="font-extrabold text-emerald-700">{idx + 1}.</span>
                <div>
                  <span className="font-bold block text-slate-900">Regarding {p.name}:</span>
                  <span className="italic text-slate-700">"{p.doctorQuestion}"</span>
                </div>
              </div>
            ))}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-2">
              <span className="font-extrabold text-emerald-700">4.</span>
              <div>
                <span className="font-bold block text-slate-900">Preventive Timing:</span>
                <span className="italic text-slate-700">"What follow-up re-test interval is recommended given my current progress?"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Doctor Clinical Notes Box (For in-person or written notes) */}
        <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            5. Physician Consultation & Prescription Notes
          </span>
          <div className="h-20 text-slate-300 text-xs italic">
            [Clinician signature, medication alterations, and next appointment schedule]
          </div>
        </div>

      </div>

    </div>
  );
}
