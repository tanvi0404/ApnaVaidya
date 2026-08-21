import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  Printer, 
  CreditCard, 
  Send, 
  QrCode, 
  Stethoscope, 
  Clock, 
  Activity, 
  Heart,
  ChevronRight,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { 
  ACTIVE_INSURANCE_POLICY, 
  CLAIM_DOCUMENT_CHECKLIST, 
  TELECONSULT_DOCTORS 
} from '../../data/teleconsultationData';
import { signPrescriptionBackend } from '../../services/apiClient';

export default function TeleconsultClaimView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('insurance'); // 'insurance' | 'teleconsult'
  const [checklist, setChecklist] = useState(CLAIM_DOCUMENT_CHECKLIST);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Teleconsultation State
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Sharma', time: '10:02 AM', text: 'Hello Arjun! I have your latest Lipid Profile and HbA1c open on my clinical HUD.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('Patient presents with borderline dyslipidemia (LDL 146) and HbA1c 7.4%. Advised 20m post-meal walking and soluble fiber dietary intervention.');
  const [prescriptionGenerated, setPrescriptionGenerated] = useState(false);
  const [signedRxData, setSignedRxData] = useState(null);

  const handleGeneratePrescription = () => {
    setPrescriptionGenerated(true);
    signPrescriptionBackend({
      doctorName: 'Dr. A. K. Sharma',
      regNumber: 'MCI-48291',
      patientName: activeProfile.name,
      diagnosis: 'Mild Dyslipidemia & Vitamin D Deficiency'
    }).then(res => {
      if (res) setSignedRxData(res);
    });
  };

  // Timer for call
  useEffect(() => {
    let interval = null;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatCallTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', time: 'Just now', text: chatInput }
    ]);
    setChatInput('');
  };

  const toggleDocumentUpload = (id) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextUploaded = !item.uploaded;
        return {
          ...item,
          uploaded: nextUploaded,
          status: nextUploaded ? 'VERIFIED' : 'PENDING_UPLOAD',
          aiCheckNotes: nextUploaded ? 'File uploaded and verified by AI claim scanner.' : 'Pending document upload.'
        };
      }
      return item;
    }));
  };

  const uploadedCount = checklist.filter(c => c.uploaded).length;
  const isReadyForSubmission = uploadedCount === checklist.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HEALTH WALLET & TELEMEDICINE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Smart Insurance Claim Co-Pilot & Virtual Teleconsultation
            </h2>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('insurance')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'insurance'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Insurance Claim Co-Pilot
            </button>
            <button
              onClick={() => setActiveTab('teleconsult')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'teleconsult'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Virtual Teleconsult Room
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'insurance' ? (
        /* Smart Health Insurance Claim View */
        <div className="space-y-6">
          
          {/* Policy Card */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl border-emerald-900">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                  Active Health Insurance Policy
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  {ACTIVE_INSURANCE_POLICY.insurerName}
                </h3>
                <span className="text-xs text-slate-300 font-semibold">
                  Policy No: {ACTIVE_INSURANCE_POLICY.policyNumber} • TPA: {ACTIVE_INSURANCE_POLICY.tpaName}
                </span>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {ACTIVE_INSURANCE_POLICY.policyStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sum Insured</span>
                <strong className="text-lg font-black text-emerald-400 block mt-0.5">{ACTIVE_INSURANCE_POLICY.sumInsured}</strong>
                <span className="text-[10px] text-slate-300">{ACTIVE_INSURANCE_POLICY.noClaimBonus}</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Room Rent Limit</span>
                <strong className="text-sm font-extrabold text-white block mt-0.5">Single Private A/C</strong>
                <span className="text-[10px] text-emerald-300">No Proportional Deduction</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Co-Payment</span>
                <strong className="text-sm font-extrabold text-emerald-300 block mt-0.5">{ACTIVE_INSURANCE_POLICY.copayPercent}</strong>
                <span className="text-[10px] text-slate-300">Zero Out-of-Pocket</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Cashless Network</span>
                <strong className="text-sm font-extrabold text-white block mt-0.5">{ACTIVE_INSURANCE_POLICY.cashlessHospitalsCount}</strong>
                <span className="text-[10px] text-emerald-300">Instant Pre-Auth</span>
              </div>
            </div>
          </div>

          {/* 6-Point Hospitalization Claim Document Readiness Scanner */}
          <div className="card-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Hospitalization Claim & Pre-Authorization Document Readiness Scanner
                </h3>
                <p className="text-xs text-slate-500">
                  AI scans claim files for mandatory TPA compliance to prevent settlement delays and deduction queries.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  Readiness: <strong className="text-emerald-700">{uploadedCount}/{checklist.length} Files Ready</strong>
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {checklist.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleDocumentUpload(item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          item.uploaded
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-slate-300 text-transparent hover:border-emerald-500'
                        }`}
                      >
                        ✓
                      </button>
                      <h4 className="text-sm font-extrabold text-slate-900">{item.name}</h4>
                      <span className="badge-neutral text-[10px]">{item.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.uploaded
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                      }`}>
                        {item.uploaded ? '✓ Verified by AI' : '⚠️ Missing File'}
                      </span>
                    </div>
                  </div>

                  <div className="pl-8.5 text-xs text-slate-600">
                    <strong className="text-slate-900">AI Claim Validation:</strong> {item.aiCheckNotes}
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Settlement Summary */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-3xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-900 tracking-wider block">
                  AI Settlement Estimation Radar
                </span>
                <div className="flex items-center gap-4 text-xs mt-1">
                  <span>Claim Total: <strong>₹1,45,000</strong></span>
                  <span>Non-Medical Deductions: <strong className="text-rose-600">-₹4,200</strong></span>
                  <span>Estimated Payout: <strong className="text-emerald-800 text-sm font-black">₹1,40,800 (97.1%)</strong></span>
                </div>
              </div>

              <button
                onClick={() => setClaimSubmitted(true)}
                disabled={!isReadyForSubmission || claimSubmitted}
                className={`py-2 px-5 rounded-2xl text-xs font-extrabold transition-all shadow-xs ${
                  claimSubmitted
                    ? 'bg-emerald-800 text-white cursor-default'
                    : isReadyForSubmission
                    ? 'btn-primary-green'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {claimSubmitted ? '✓ Claim Submitted to Medi Assist' : 'Submit Direct TPA Claim'}
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Virtual Teleconsultation Room View */
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Video Stream Room (2 Cols) */}
            <div className="card-white p-6 bg-slate-950 text-white rounded-3xl lg:col-span-2 space-y-4 shadow-xl border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
              
              {/* Top Header inside Video Room */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    VS
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Dr. Vikramaditya Sharma, MD, DM</h4>
                    <span className="text-[11px] text-slate-300">Senior Consultant Cardiologist • Fortis Escorts</span>
                  </div>
                </div>

                {isInCall && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-rose-600/80 rounded-full text-xs font-bold text-white animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white inline-block" />
                    <span>REC • {formatCallTime(callDuration)}</span>
                  </div>
                )}
              </div>

              {/* Main Video Surface */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10 space-y-4">
                {!isInCall ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
                      <Video className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-white font-display">Virtual Consultation Waiting Room</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Doctor is online and reviewing your shared lab diagnostic records. Click below to start the HD consultation.
                    </p>
                    <button
                      onClick={() => setIsInCall(true)}
                      className="btn-primary-green text-xs py-2.5 px-6"
                    >
                      Join Secure Video Call
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center mx-auto text-3xl font-black shadow-lg">
                      VS
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Dr. Vikramaditya Sharma is Speaking</h3>
                      <p className="text-xs text-slate-400">Encrypted End-to-End Clinical Video Channel</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom In-Call Media Controls */}
              {isInCall && (
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10 z-10">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-2xl transition-all ${
                      isMuted ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3 rounded-2xl transition-all ${
                      isVideoOff ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                  <button
                    className="p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
                    title="Share Screen"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsInCall(false)}
                    className="p-3 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 transition-all font-bold text-xs flex items-center gap-2"
                  >
                    <PhoneOff className="w-5 h-5" /> End Call
                  </button>
                </div>
              )}

            </div>

            {/* Right: In-Call Clinical HUD & Chat (1 Col) */}
            <div className="card-white p-5 space-y-4 flex flex-col justify-between border-l-4 border-l-brand-green-600">
              
              <div className="space-y-4">
                {/* Doctor's Live Patient HUD */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Doctor's Live HUD Overlay
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">LDL Cholesterol</span>
                      <strong className="text-rose-600 font-extrabold">146 mg/dL (High)</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">HbA1c</span>
                      <strong className="text-rose-600 font-extrabold">7.4% (Elevated)</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                      <strong className="text-emerald-700 font-extrabold">124/82 mmHg</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Active Statin</span>
                      <strong className="text-slate-900 font-extrabold">Atorvastatin 20mg</strong>
                    </div>
                  </div>
                </div>

                {/* In-Call Encrypted Chat Messages */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    In-Call Live Chat
                  </span>
                  <div className="h-44 overflow-y-auto space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`space-y-0.5 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                        <span className="text-[10px] font-bold text-slate-400">{msg.sender} • {msg.time}</span>
                        <div className={`p-2.5 rounded-2xl inline-block text-xs ${
                          msg.sender === 'You'
                            ? 'bg-brand-green-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-800'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type clinical question..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                    />
                    <button type="submit" className="p-2 bg-brand-green-600 text-white rounded-xl hover:bg-brand-green-700">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Digital Prescription Generator */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleGeneratePrescription}
                  className="w-full btn-outline-white text-xs py-2 flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-green-600" />
                  <span>Generate Signed E-Prescription</span>
                </button>

                {prescriptionGenerated && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-900 font-bold">✓ Digitally Signed (SHA-256)</strong>
                      <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full font-extrabold text-emerald-900">VERIFIED</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Rx: Atorvastatin 20mg OD + Metformin 500mg BD + Dietary Soluble Fiber.
                    </p>
                    {signedRxData && (
                      <div className="p-2 bg-white/80 rounded-xl border border-emerald-200 text-[10px] text-slate-600 font-mono break-all">
                        <strong>Signature:</strong> {signedRxData.digitalSignature}
                      </div>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="text-[11px] font-bold text-emerald-700 hover:underline pt-0.5 block"
                    >
                      🖨️ Print / Download Prescription (PDF)
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
