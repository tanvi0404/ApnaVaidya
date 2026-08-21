import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  Lock,
  Download
} from 'lucide-react';

export default function ReportShareModal({ report, isOpen, onClose }) {
  const [duration, setDuration] = useState('48h');
  const [allowAiSummary, setAllowAiSummary] = useState(true);
  const [allowRawValues, setAllowRawValues] = useState(true);
  const [allowDoctorQuestions, setAllowDoctorQuestions] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const shareToken = `AV-SEC-${report.id.substring(4, 10).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const shareUrl = `https://apnavaidya.health/share/${shareToken}?exp=${duration}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-brand-green-50 to-brand-pink-50 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Secure Report Sharing</h3>
              <p className="text-xs text-slate-500">Generate time-limited link or QR for doctor/second opinion</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Report Meta Pill */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">{report.title}</div>
              <div className="text-[11px] text-slate-500">{report.labName} • {report.testDate}</div>
            </div>
            <span className="badge-green text-xs">
              {report.parameters.length} Parameters
            </span>
          </div>

          {/* Time Duration Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Link Expiry Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '24h', label: '24 Hours' },
                { id: '48h', label: '48 Hours (Rec)' },
                { id: '7d', label: '7 Days' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDuration(opt.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    duration === opt.id
                      ? 'bg-brand-green-50 border-brand-green-400 text-brand-green-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Scope */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-600" /> Scoped Access Permissions
            </label>
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAiSummary}
                  onChange={e => setAllowAiSummary(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-800">Include AI Plain-Language Analysis</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowRawValues}
                  onChange={e => setAllowRawValues(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-800">Include Numerical Biomarkers & Reference Ranges</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDoctorQuestions}
                  onChange={e => setAllowDoctorQuestions(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-800">Include Suggested Clinician Questions</span>
              </label>
            </div>
          </div>

          {/* Generated Link Box */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Encrypted Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-xl text-slate-700 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="btn-primary-green px-3 py-2 text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Preview Box */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-center gap-4">
            <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0">
              <QrCode className="w-16 h-16 text-slate-800" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block mb-1">Doctor QR Quick Scan</span>
              <p className="text-slate-600 leading-relaxed">
                Your doctor can instantly scan this token on their tablet or phone during consultation without installing any app.
              </p>
            </div>
          </div>

          {/* Privacy Security Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Link automatically self-revokes after expiry. You can revoke it anytime in Security Vault.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
