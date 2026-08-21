import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Sparkles, 
  Activity, 
  Heart, 
  Footprints, 
  Salad, 
  Moon, 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  RotateCcw,
  Zap,
  Sliders
} from 'lucide-react';
import { simulateWhatIfBackend } from '../../services/apiClient';

export default function WhatIfSimulatorView({ activeProfile }) {
  // Baseline Values
  const baselineHba1c = activeProfile.id === 'user-rajesh' ? 7.4 : 5.8;
  const baselineLdl = 146.0;
  const baselineSbp = 128.0;
  const baselineWeight = parseFloat(activeProfile.weight) || 76.0;

  // Sliders
  const [extraWalking, setExtraWalking] = useState(30); // 0-60 mins
  const [extraFiber, setExtraFiber] = useState(15); // 0-30 g
  const [extraSleep, setExtraSleep] = useState(1.0); // 0-2.5 hrs
  const [weightLoss, setWeightLoss] = useState(4.0); // 0-12 kg

  // Server Simulation Output
  const [simulationResult, setSimulationResult] = useState({
    projectedHba1c: Math.round((baselineHba1c - 0.6) * 10) / 10,
    projectedLdl: Math.round((baselineLdl - 22) * 10) / 10,
    projectedSbp: Math.round((baselineSbp - 8) * 10) / 10,
    projectedWeight: Math.round((baselineWeight - 4) * 10) / 10,
    hba1cReduction: 0.6,
    ldlReduction: 22.0,
    sbpReduction: 8.0,
    clinicalSummary: 'Targeted lifestyle interventions project a 0.6% drop in HbA1c and 22.0 mg/dL drop in LDL-C over 12 months.',
    trajectory: [
      { month: 0, currentTrajectoryHba1c: baselineHba1c, simulatedHba1c: baselineHba1c, currentTrajectoryLdl: baselineLdl, simulatedLdl: baselineLdl },
      { month: 6, currentTrajectoryHba1c: baselineHba1c + 0.1, simulatedHba1c: baselineHba1c - 0.3, currentTrajectoryLdl: baselineLdl + 2, simulatedLdl: baselineLdl - 11 },
      { month: 12, currentTrajectoryHba1c: baselineHba1c + 0.1, simulatedHba1c: baselineHba1c - 0.5, currentTrajectoryLdl: baselineLdl + 4, simulatedLdl: baselineLdl - 19 },
      { month: 24, currentTrajectoryHba1c: baselineHba1c + 0.2, simulatedHba1c: baselineHba1c - 0.6, currentTrajectoryLdl: baselineLdl + 7, simulatedLdl: baselineLdl - 22 },
      { month: 36, currentTrajectoryHba1c: baselineHba1c + 0.4, simulatedHba1c: baselineHba1c - 0.6, currentTrajectoryLdl: baselineLdl + 11, simulatedLdl: baselineLdl - 22 }
    ]
  });

  const [activeMetricTab, setActiveMetricTab] = useState('hba1c'); // 'hba1c' | 'ldl'

  // Sync with Java 17 Simulation Backend
  useEffect(() => {
    let isMounted = true;
    simulateWhatIfBackend({
      baseHba1c: baselineHba1c,
      baseLdl: baselineLdl,
      baseSbp: baselineSbp,
      baseWeight: baselineWeight,
      extraWalkingMins: extraWalking,
      extraFiberGrams: extraFiber,
      extraSleepHours: extraSleep,
      weightLossKg: weightLoss
    }).then(res => {
      if (isMounted && res && res.trajectory) {
        setSimulationResult(res);
      }
    }).catch(err => console.warn('Simulation client fallback:', err));

    return () => { isMounted = false; };
  }, [baselineHba1c, baselineLdl, baselineSbp, baselineWeight, extraWalking, extraFiber, extraSleep, weightLoss]);

  const handleReset = () => {
    setExtraWalking(30);
    setExtraFiber(15);
    setExtraSleep(1.0);
    setWeightLoss(4.0);
  };

  // SVG Chart Dimensions
  const chartWidth = 540;
  const chartHeight = 180;
  const padding = 35;

  const trajectory = simulationResult.trajectory || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" /> WHAT-IF METABOLIC SIMULATOR
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Interactive Lifestyle & Biomarker Scenario Engine
            </h2>
          </div>

          <button
            onClick={handleReset}
            className="btn-outline-white text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Sliders</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Projected Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-white p-6 space-y-5">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                Intervention Sliders
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Java 17 Engine
              </span>
            </div>

            {/* Slider 1: Daily Aerobic Walking */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-emerald-600" />
                  <span>Daily Post-Meal Walking</span>
                </div>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  +{extraWalking} mins/day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={extraWalking}
                onChange={e => setExtraWalking(parseInt(e.target.value))}
                className="w-full accent-brand-green-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Stimulates GLUT-4 muscle translocation without insulin requirement.
              </span>
            </div>

            {/* Slider 2: Dietary Soluble Fiber */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <div className="flex items-center gap-2">
                  <Salad className="w-4 h-4 text-teal-600" />
                  <span>Soluble Prebiotic Fiber</span>
                </div>
                <span className="text-teal-700 bg-teal-100 px-2 py-0.5 rounded-lg">
                  +{extraFiber} g/day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={extraFiber}
                onChange={e => setExtraFiber(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Binds intestinal bile salts to accelerate hepatic LDL clearance.
              </span>
            </div>

            {/* Slider 3: Sleep Quality */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Consistent Sleep Extension</span>
                </div>
                <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg">
                  +{extraSleep} hrs/night
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.5"
                value={extraSleep}
                onChange={e => setExtraSleep(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Reduces nocturnal cortisol spikes and morning hepatic gluconeogenesis.
              </span>
            </div>

            {/* Slider 4: Weight / Visceral Fat Loss */}
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-rose-600" />
                  <span>Target Weight Loss</span>
                </div>
                <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg">
                  -{weightLoss} kg
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={weightLoss}
                onChange={e => setWeightLoss(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Decreases ectopic liver & pancreatic fat deposition.
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Projected Outcomes & 3-Year Trajectory (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Projected Biomarker Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="card-white p-4 text-center space-y-1 bg-gradient-to-b from-white to-emerald-50/40">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Projected HbA1c</span>
              <div className="text-2xl font-black font-display text-emerald-600">
                {simulationResult.projectedHba1c}%
              </div>
              <div className="text-[10px] font-bold text-emerald-700">
                ↓ -{simulationResult.hba1cReduction}% (was {baselineHba1c}%)
              </div>
            </div>

            <div className="card-white p-4 text-center space-y-1 bg-gradient-to-b from-white to-teal-50/40">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Projected LDL-C</span>
              <div className="text-2xl font-black font-display text-teal-600">
                {simulationResult.projectedLdl}
              </div>
              <div className="text-[10px] font-bold text-teal-700">
                ↓ -{simulationResult.ldlReduction} mg/dL
              </div>
            </div>

            <div className="card-white p-4 text-center space-y-1 bg-gradient-to-b from-white to-indigo-50/40">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Systolic BP</span>
              <div className="text-2xl font-black font-display text-indigo-600">
                {simulationResult.projectedSbp}
              </div>
              <div className="text-[10px] font-bold text-indigo-700">
                ↓ -{simulationResult.sbpReduction} mmHg
              </div>
            </div>

            <div className="card-white p-4 text-center space-y-1 bg-gradient-to-b from-white to-rose-50/40">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Target Weight</span>
              <div className="text-2xl font-black font-display text-rose-600">
                {simulationResult.projectedWeight} kg
              </div>
              <div className="text-[10px] font-bold text-rose-700">
                ↓ -{weightLoss} kg
              </div>
            </div>

          </div>

          {/* 3-Year Longitudinal Projection Chart */}
          <div className="card-white p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm font-display">
                  3-Year Trajectory: Current vs Simulated Protocol
                </h3>
                <p className="text-[11px] text-slate-500">
                  Visualizing multi-year biomarker drift with and without lifestyle modifications.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveMetricTab('hba1c')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeMetricTab === 'hba1c'
                      ? 'bg-brand-green-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  HbA1c (%)
                </button>
                <button
                  onClick={() => setActiveMetricTab('ldl')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeMetricTab === 'ldl'
                      ? 'bg-brand-green-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  LDL-C (mg/dL)
                </button>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
                {/* Horizontal Grid lines */}
                <line x1={padding} y1={30} x2={chartWidth - padding} y2={30} stroke="#E2E8F0" strokeDasharray="3,3" />
                <line x1={padding} y1={80} x2={chartWidth - padding} y2={80} stroke="#E2E8F0" strokeDasharray="3,3" />
                <line x1={padding} y1={130} x2={chartWidth - padding} y2={130} stroke="#E2E8F0" strokeDasharray="3,3" />

                {/* Target Normal Band */}
                <rect 
                  x={padding} 
                  y={activeMetricTab === 'hba1c' ? 95 : 100} 
                  width={chartWidth - padding * 2} 
                  height={35} 
                  fill="rgba(16, 185, 129, 0.08)" 
                />
                <text x={chartWidth - padding - 80} y={activeMetricTab === 'hba1c' ? 116 : 122} fill="#10B981" fontSize="9" fontWeight="bold">
                  Target Zone
                </text>

                {/* Trajectory Points & Polyline */}
                {(() => {
                  const points = trajectory;
                  if (points.length === 0) return null;

                  const xStep = (chartWidth - padding * 2) / (points.length - 1);
                  
                  // Current trajectory path (Rose)
                  const currPath = points.map((p, idx) => {
                    const x = padding + idx * xStep;
                    const val = activeMetricTab === 'hba1c' ? p.currentTrajectoryHba1c : p.currentTrajectoryLdl;
                    const minVal = activeMetricTab === 'hba1c' ? 4.5 : 60;
                    const maxVal = activeMetricTab === 'hba1c' ? 8.5 : 190;
                    const y = 140 - ((val - minVal) / (maxVal - minVal)) * 110;
                    return `${x},${y}`;
                  }).join(' ');

                  // Simulated trajectory path (Emerald Green)
                  const simPath = points.map((p, idx) => {
                    const x = padding + idx * xStep;
                    const val = activeMetricTab === 'hba1c' ? p.simulatedHba1c : p.simulatedLdl;
                    const minVal = activeMetricTab === 'hba1c' ? 4.5 : 60;
                    const maxVal = activeMetricTab === 'hba1c' ? 8.5 : 190;
                    const y = 140 - ((val - minVal) / (maxVal - minVal)) * 110;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <>
                      {/* Current Drift Path (Dashed Rose) */}
                      <polyline
                        points={currPath}
                        fill="none"
                        stroke="#F43F5E"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                      />

                      {/* Simulated Intervention Path (Solid Emerald) */}
                      <polyline
                        points={simPath}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                      />

                      {/* Point Markers */}
                      {points.map((p, idx) => {
                        const x = padding + idx * xStep;
                        const simVal = activeMetricTab === 'hba1c' ? p.simulatedHba1c : p.simulatedLdl;
                        const minVal = activeMetricTab === 'hba1c' ? 4.5 : 60;
                        const maxVal = activeMetricTab === 'hba1c' ? 8.5 : 190;
                        const y = 140 - ((simVal - minVal) / (maxVal - minVal)) * 110;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                            <text x={x} y={160} textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold">
                              {p.month === 0 ? 'Today' : `${p.month}m`}
                            </text>
                            <text x={x} y={y - 8} textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold">
                              {simVal}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold border-t border-slate-200 mt-2">
                <div className="flex items-center gap-1.5 text-rose-600">
                  <span className="w-3 h-0.5 bg-rose-500 inline-block border-b-2 border-dashed border-rose-500" />
                  <span>Current Baseline Trajectory</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />
                  <span>Simulated Intervention Trajectory</span>
                </div>
              </div>
            </div>

            {/* Clinical Evidence Summary */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
              <strong className="text-emerald-900 font-bold block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Evidence-Based Clinical Rationale:
              </strong>
              <p className="text-emerald-900 leading-relaxed">
                {simulationResult.clinicalSummary}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
