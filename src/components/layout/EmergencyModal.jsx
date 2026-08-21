import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, HeartPulse, Hospital, ArrowRight } from 'lucide-react';
import { EMERGENCY_CONTACTS, RED_FLAG_SYMPTOMS } from '../../data/mockData';

export default function EmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-rose-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with High-Contrast Rose/Pink Alert */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-brand-pink-600 text-white p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all"
            aria-label="Close Emergency Modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-rose-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Emergency Support
                </span>
                <span className="text-rose-100 text-xs font-medium">Available 24x7</span>
              </div>
              <h2 className="text-2xl font-bold font-display mt-1">Medical Red-Flag & Urgent Assistance</h2>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-rose-100 leading-relaxed">
            ApnaVaidya is an educational companion and <strong>NOT a replacement for emergency care</strong>. If you or someone around you is experiencing life-threatening symptoms, reach emergency medical services immediately.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick-Dial Emergency Numbers */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" /> Immediate Emergency Hotlines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EMERGENCY_CONTACTS.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number.replace(/\s+/g, '')}`}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">{contact.type}</div>
                      <div className="text-sm font-bold text-slate-800">{contact.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-white border border-slate-200 text-emerald-700 font-extrabold text-sm rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      {contact.number}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Red Flag Symptoms to Recognize */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600" /> Recognized Emergency Red-Flags
            </h3>
            <div className="space-y-3">
              {RED_FLAG_SYMPTOMS.map((symptom, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl flex items-start gap-3.5"
                >
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-xl mt-0.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{symptom.title}</span>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 bg-rose-600 text-white rounded-md">
                        {symptom.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{symptom.description}</p>
                    <div className="mt-2 text-xs font-semibold text-rose-800 bg-rose-100/60 p-2 rounded-lg flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5" /> Action: {symptom.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer Callout */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-3">
            <Hospital className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-950 mb-0.5">ApnaVaidya Safety Policy</span>
              Our AI models are built with strict safety thresholds. Any report values or chat inquiries hinting at an emergency immediately recommend licensed clinician triage over digital interpretation.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm rounded-xl transition-all"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
