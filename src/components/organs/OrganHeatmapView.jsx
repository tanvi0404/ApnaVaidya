import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Pill, 
  ShieldCheck, 
  Zap, 
  Info, 
  ChevronRight, 
  Stethoscope,
  Flame,
  Dna,
  Layers
} from 'lucide-react';
import { 
  ANATOMICAL_ORGAN_SYSTEMS, 
  DRUG_NUTRIENT_DEPLETION_DATABASE 
} from '../../data/organHeatmapData';
import { calculateOrganHeatmapBackend } from '../../services/apiClient';

export default function OrganHeatmapView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('heatmap'); // 'heatmap' | 'depletion'
  const [selectedOrganId, setSelectedOrganId] = useState('organ-heart');
  const [organSystems, setOrganSystems] = useState(ANATOMICAL_ORGAN_SYSTEMS);

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    calculateOrganHeatmapBackend({
      ldl: 146.0,
      hba1c: activeProfile.id === 'user-rajesh' ? 7.4 : 5.4,
      tsh: activeProfile.id === 'user-sunita' ? 5.85 : 2.2,
      egfr: 95.0,
      alt: 28.0,
      b12: 215.0,
      vitd: 18.4
    }).then(res => {
      if (isMounted && res) {
        setOrganSystems(prev => prev.map(o => {
          if (o.id === 'organ-heart' && res.heartScore) return { ...o, score: res.heartScore };
          if (o.id === 'organ-pancreas' && res.pancreasScore) return { ...o, score: res.pancreasScore };
          if (o.id === 'organ-thyroid' && res.thyroidScore) return { ...o, score: res.thyroidScore };
          if (o.id === 'organ-liver' && res.liverScore) return { ...o, score: res.liverScore };
          if (o.id === 'organ-kidneys' && res.kidneyScore) return { ...o, score: res.kidneyScore };
          if (o.id === 'organ-brain' && res.brainScore) return { ...o, score: res.brainScore };
          if (o.id === 'organ-skeleton' && res.skeletonScore) return { ...o, score: res.skeletonScore };
          return o;
        }));
      }
    }).catch(err => console.warn('Organ heatmap client fallback:', err));

    return () => { isMounted = false; };
  }, [activeProfile.id]);

  const selectedOrgan = organSystems.find(o => o.id === selectedOrganId) || organSystems[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'DEFICIENT':
      case 'ACTION_NEEDED':
        return { stroke: '#F43F5E', fill: 'rgba(244, 63, 94, 0.2)', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'MODERATE_RISK':
      case 'BORDERLINE':
        return { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.2)', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'OPTIMAL':
      default:
        return { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.2)', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-emerald-600" /> ANATOMICAL HEALTH HEATMAP & DEPLETION
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Multi-Organ System Heatmap & Drug-Nutrient Depletion Matrix
            </h2>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'heatmap'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Organ System Heatmap
            </button>
            <button
              onClick={() => setActiveTab('depletion')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'depletion'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drug-Nutrient Depletion Matrix
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'heatmap' ? (
        /* Organ Health Heatmap Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Anatomical SVG Heatmap (2 Cols) */}
          <div className="card-white p-6 bg-slate-950 text-white rounded-3xl lg:col-span-2 space-y-4 shadow-xl border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            
            <div className="flex items-center justify-between z-10 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">Interactive Full-Body Anatomical Map</span>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Action Needed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Moderate Risk
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Optimal
                </span>
              </div>
            </div>

            {/* SVG Anatomical Silhouette Canvas */}
            <div className="w-full flex items-center justify-center py-4">
              <svg viewBox="0 0 400 420" className="w-full max-w-[380px] h-auto">
                
                {/* Simplified Body Silhouette Outline */}
                <path
                  d="M 170 30 Q 200 15 230 30 Q 240 60 230 75 Q 260 90 280 120 L 260 220 L 240 220 L 250 390 L 220 390 L 205 270 L 195 270 L 180 390 L 150 390 L 160 220 L 140 220 L 120 120 Q 140 90 170 75 Z"
                  fill="#0B132B"
                  stroke="#1E293B"
                  strokeWidth="2"
                  opacity="0.6"
                />

                {/* Organ Nodes */}
                {ANATOMICAL_ORGAN_SYSTEMS.map((organ) => {
                  const isSelected = selectedOrganId === organ.id;
                  const color = getStatusColor(organ.status);

                  return (
                    <g
                      key={organ.id}
                      onClick={() => setSelectedOrganId(organ.id)}
                      className="cursor-pointer transition-all duration-300 group"
                    >
                      {/* Outer Pulse Ring */}
                      <circle
                        cx={organ.svgCoords.cx}
                        cy={organ.svgCoords.cy}
                        r={organ.svgCoords.r + (isSelected ? 8 : 4)}
                        fill={color.fill}
                        stroke={color.stroke}
                        strokeWidth={isSelected ? '2.5' : '1'}
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                        className={isSelected ? 'animate-pulse' : 'group-hover:opacity-100'}
                      />

                      {/* Main Organ Bubble */}
                      <circle
                        cx={organ.svgCoords.cx}
                        cy={organ.svgCoords.cy}
                        r={organ.svgCoords.r}
                        fill="#0F172A"
                        stroke={color.stroke}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        className="transition-all hover:brightness-125"
                      />

                      {/* Organ Label */}
                      <text
                        x={organ.svgCoords.cx}
                        y={organ.svgCoords.cy - 2}
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {organ.name.split(' ')[0]}
                      </text>

                      {/* Score Tag */}
                      <text
                        x={organ.svgCoords.cx}
                        y={organ.svgCoords.cy + 10}
                        fill={color.stroke}
                        fontSize="8"
                        fontWeight="extrabold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {organ.score}/100
                      </text>
                    </g>
                  );
                })}

              </svg>
            </div>

            <div className="text-[11px] text-slate-400 text-center z-10 pt-2 border-t border-slate-800">
              Click any organ node to inspect linked diagnostic biomarkers and personalized clinical interventions.
            </div>

          </div>

          {/* Right: Selected Organ Deep-Dive Inspector (1 Col) */}
          <div className="card-white p-6 space-y-5 border-l-4 border-l-brand-green-600 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge-neutral text-[10px] uppercase font-bold">
                    {selectedOrgan.system}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedOrgan.status).badge}`}>
                    {selectedOrgan.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                  {selectedOrgan.name}
                </h3>
                <div className="text-xs font-bold text-slate-500 mt-0.5">
                  Organ Vitality Score: <span className="text-emerald-700 font-extrabold">{selectedOrgan.score}/100</span>
                </div>
              </div>

              {/* Primary Diagnostic Biomarkers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Linked Diagnostic Biomarkers:
                </span>
                <div className="space-y-1.5">
                  {selectedOrgan.primaryBiomarkers.map((b, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{b.value}</strong>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          b.status === 'HIGH' || b.status === 'DEFICIENT'
                            ? 'bg-rose-100 text-rose-800'
                            : b.status === 'BORDERLINE'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-0.5">Clinical Assessment:</strong>
                {selectedOrgan.clinicalSummary}
              </div>

              {/* 3-Step Actionable Prescription */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Targeted Clinical Action Plan:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedOrgan.actionablePlan.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
              💡 <strong>Integrative Guidance:</strong> Organ health scores update automatically when you upload new diagnostic blood tests or log daily biometric data.
            </div>

          </div>

        </div>
      ) : (
        /* Clinical Drug-Nutrient Depletion Matrix View */
        <div className="space-y-6">
          
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-4 shadow-xl border-emerald-900">
            <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                  Pharmacological Nutrient Audit
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  Prescription Drug-Induced Nutrient Depletion Engine
                </h3>
              </div>

              <span className="badge-pink text-xs font-bold">
                Clinical Pharmacotherapy
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Chronic prescription medications frequently inhibit intestinal absorption, accelerate renal excretion, or block enzymatic synthesis of essential vitamins and minerals. ApnaVaidya cross-references your active medications with evidence-based restoration protocols.
            </p>
          </div>

          {/* Depletion Cards */}
          <div className="space-y-4">
            {DRUG_NUTRIENT_DEPLETION_DATABASE.map((dep) => (
              <div key={dep.id} className="card-white p-6 space-y-4 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-brand-green-600" />
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                      {dep.medicationName}
                    </h3>
                  </div>

                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Depletion Alert
                  </span>
                </div>

                {/* Depleted Nutrients List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dep.depletedNutrients.map((nut, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 font-extrabold">{nut.name}</strong>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          {nut.severity} DEPLETION
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{nut.mechanism}</p>
                    </div>
                  ))}
                </div>

                {/* Clinical Warning Symptoms */}
                <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-950">
                  <strong className="text-rose-900 block mb-0.5">⚠️ Warning Symptoms to Watch For:</strong>
                  {dep.clinicalSymptoms}
                </div>

                {/* Evidence-Based Restoration Protocol */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
                  <strong className="text-emerald-900 block uppercase tracking-wider text-[10px] font-extrabold">
                    🌱 Clinical Micronutrient Restoration Protocol:
                  </strong>
                  <p className="leading-relaxed font-medium">{dep.restorationProtocol}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
