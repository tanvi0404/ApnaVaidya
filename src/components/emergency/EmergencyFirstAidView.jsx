import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  PhoneCall, 
  Building2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  ChevronRight,
  HeartCrack,
  Clock,
  IdCard,
  MapPin
} from 'lucide-react';
import { FIRST_AID_PROTOCOLS, NEARBY_EMERGENCY_HOSPITALS } from '../../data/emergencyData';

export default function EmergencyFirstAidView({ activeProfile, onOpenEmergency }) {
  const [selectedProtocolId, setSelectedProtocolId] = useState('aid-cpr');
  const [cprMetronomeActive, setCprMetronomeActive] = useState(false);
  const [metronomeBeat, setMetronomeBeat] = useState(false);

  const activeProtocol = FIRST_AID_PROTOCOLS.find(p => p.id === selectedProtocolId) || FIRST_AID_PROTOCOLS[0];

  // CPR Metronome at 110 BPM (approx 545ms per beat)
  useEffect(() => {
    let interval = null;
    if (cprMetronomeActive && selectedProtocolId === 'aid-cpr') {
      interval = setInterval(() => {
        setMetronomeBeat(prev => !prev);
      }, 545);
    } else {
      setMetronomeBeat(false);
    }
    return () => clearInterval(interval);
  }, [cprMetronomeActive, selectedProtocolId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/50 to-pink-50/40 border-rose-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> EMERGENCY TRIAGE & FIRST-AID WIZARD
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Interactive Emergency Response & Hospital Navigator
            </h2>
          </div>

          {/* Quick Direct Dials */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEmergency}
              className="btn-primary-pink text-xs py-2 px-3.5 animate-pulse"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call 108 / 112
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Medical ID Card (Digital ICE Card) */}
      <div className="card-white p-6 bg-gradient-to-tr from-rose-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-4 shadow-xl border-rose-900">
        <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-600 flex items-center justify-center font-bold text-white shadow-soft-pink">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base font-display">
                Emergency Medical ID Card (In Case of Emergency - ICE)
              </h3>
              <p className="text-xs text-slate-400">Lock screen medical information for paramedics & ER clinicians</p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40">
            Certified ICE Record
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
            <strong className="text-sm font-extrabold text-white">{activeProfile.name}</strong>
            <span className="text-[11px] text-slate-400 block mt-0.5">{activeProfile.age}y, {activeProfile.gender}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
            <strong className="text-base font-black text-rose-400">{activeProfile.bloodGroup}</strong>
            <span className="text-[11px] text-slate-400 block mt-0.5">Weight: {activeProfile.weight}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Known Allergies</span>
            <strong className="text-rose-300 font-bold">
              {(activeProfile?.allergies || []).join(', ') || 'No Known Drug Allergies'}
            </strong>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Emergency Contact</span>
            <strong className="text-emerald-400 font-bold block">+91 98765 43210</strong>
            <span className="text-[11px] text-slate-400">Relationship: Primary Next of Kin</span>
          </div>
        </div>
      </div>

      {/* Interactive First-Aid Protocol Wizard */}
      <div className="card-white p-6 sm:p-8 space-y-6">
        
        {/* Protocol Selector Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-pink-500" />
              Step-by-Step Emergency First-Aid Protocols
            </h3>
            <p className="text-xs text-slate-500">
              Clear, visual, life-saving instructions designed for high-stress emergency situations.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
            {FIRST_AID_PROTOCOLS.map((proto) => (
              <button
                key={proto.id}
                onClick={() => setSelectedProtocolId(proto.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedProtocolId === proto.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {proto.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Protocol Header */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 block">
              Urgency Level: {activeProtocol.urgency}
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
              {activeProtocol.title}
            </h4>
          </div>

          {/* CPR Cadence Metronome (Only for CPR) */}
          {selectedProtocolId === 'aid-cpr' && (
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-rose-200 shadow-xs">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                metronomeBeat ? 'bg-rose-600 scale-125 text-white shadow-md' : 'bg-rose-100 text-rose-700'
              }`}>
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-900 block">110 BPM Metronome</span>
                <span className="text-[10px] text-slate-400">Push to this beat</span>
              </div>
              <button
                onClick={() => setCprMetronomeActive(!cprMetronomeActive)}
                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                {cprMetronomeActive ? 'Stop' : 'Start Beat'}
              </button>
            </div>
          )}
        </div>

        {/* Step-by-Step Instruction Cards */}
        <div className="space-y-3">
          {activeProtocol.steps.map((step) => (
            <div key={step.stepNumber} className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                  {step.stepNumber}
                </div>
                <h5 className="text-sm font-extrabold text-slate-900 font-display">
                  {step.title}
                </h5>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9">
                {step.instruction}
              </p>

              <div className="ml-9 p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-950 font-medium">
                ⚠️ <strong>Clinical Precaution:</strong> {step.caution}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Nearby 24x7 Accredited Trauma Centers & Emergency Hospitals */}
      <div className="card-white p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-display flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Nearby 24x7 Accredited Emergency & Trauma Centers
            </h3>
            <p className="text-xs text-slate-500">
              Verified tertiary hospitals with round-the-clock Cath Labs, Stroke Units, and ICU bed availability.
            </p>
          </div>

          <span className="badge-green text-xs font-bold">
            Live ER Readiness
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NEARBY_EMERGENCY_HOSPITALS.map((hosp) => (
            <div key={hosp.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between hover:border-brand-green-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge-green text-[10px] font-bold">
                    <MapPin className="w-3 h-3" /> {hosp.distance}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.2 rounded-full">
                    {hosp.icuBeds}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900">
                  {hosp.name}
                </h4>

                <p className="text-xs text-slate-500">
                  {hosp.address}
                </p>

                <div className="text-[11px] text-emerald-900 font-semibold">
                  🏥 {hosp.traumaLevel}
                </div>

                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {hosp.specialties.map((spec, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <a
                  href={`tel:${hosp.emergencyDirectDial}`}
                  className="w-full btn-primary-pink text-xs justify-center py-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call ER ({hosp.emergencyDirectDial})
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
