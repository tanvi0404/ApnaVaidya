import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Sparkles, 
  Footprints, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Salad 
} from 'lucide-react';
import { CALCULATE_VASCULAR_AGE, POSTPRANDIAL_GLUCOSE_CURVES } from '../../data/vascularData';
import { calculateVascularBackend } from '../../services/apiClient';

export default function VascularGlucoseView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('vascular'); // 'vascular' | 'glucose_curves'
  
  // Vascular Age State
  const [systolicBp, setSystolicBp] = useState(124);
  const [diastolicBp, setDiastolicBp] = useState(82);
  const [totalChol, setTotalChol] = useState(228);
  const [hdlChol, setHdlChol] = useState(52);
  const [restingHr, setRestingHr] = useState(68);
  const [isSmoker, setIsSmoker] = useState(false);

  const localVasc = CALCULATE_VASCULAR_AGE({
    chronologicalAge: activeProfile.age || 32,
    systolicBp: Number(systolicBp) || 120,
    diastolicBp: Number(diastolicBp) || 80,
    totalChol: Number(totalChol) || 200,
    hdlChol: Number(hdlChol) || 50,
    restingHr: Number(restingHr) || 70,
    smoker: isSmoker
  });

  const [vascularResult, setVascularResult] = useState(localVasc);

  // Sync with Java Backend when inputs change
  React.useEffect(() => {
    let isMounted = true;
    const currentLocal = CALCULATE_VASCULAR_AGE({
      chronologicalAge: activeProfile.age || 32,
      systolicBp: Number(systolicBp) || 120,
      diastolicBp: Number(diastolicBp) || 80,
      totalChol: Number(totalChol) || 200,
      hdlChol: Number(hdlChol) || 50,
      restingHr: Number(restingHr) || 70,
      smoker: isSmoker
    });
    setVascularResult(currentLocal);

    calculateVascularBackend({
      chronologicalAge: activeProfile.age || 32,
      systolicBp: Number(systolicBp) || 120,
      diastolicBp: Number(diastolicBp) || 80,
      totalChol: Number(totalChol) || 200,
      hdlChol: Number(hdlChol) || 50,
      restingHr: Number(restingHr) || 70,
      smoker: isSmoker
    }).then(res => {
      if (isMounted && res) {
        setVascularResult(res);
      }
    }).catch(() => {
      if (isMounted) setVascularResult(currentLocal);
    });
    return () => { isMounted = false; };
  }, [systolicBp, diastolicBp, totalChol, hdlChol, restingHr, isSmoker, activeProfile.age]);

  // Glucose Curve Simulation State
  const [selectedScenario, setSelectedScenario] = useState('all'); // 'all' | 'highGi' | 'lowGi' | 'walk'

  // SVG Chart Geometry Constants
  const svgWidth = 700;
  const svgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const minTime = 0;
  const maxTime = 180;
  const minG = 60;
  const maxG = 210;

  const getX = (t) => paddingLeft + ((t - minTime) / (maxTime - minTime)) * chartW;
  const getY = (g) => paddingTop + chartH - ((g - minG) / (maxG - minG)) * chartH;

  const makePath = (points) => {
    return points.reduce((acc, pt, idx) => {
      const x = getX(pt.time);
      const y = getY(pt.glucose);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <Heart className="w-3.5 h-3.5 text-rose-600" /> VASCULAR ELASTICITY & GLYCEMIC DYNAMICS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Arterial Health & Postprandial Glucose Surge Simulator
            </h2>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('vascular')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'vascular'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vascular Age & ePWV
            </button>
            <button
              onClick={() => setActiveTab('glucose_curves')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'glucose_curves'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              180-Min Glucose Curve Simulator
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'vascular' ? (
        /* Vascular Age Screener View */
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input Controls */}
            <div className="card-white p-6 space-y-4 lg:col-span-1">
              <h3 className="font-extrabold text-slate-900 text-base font-display">
                Biometric Parameters
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Blood Pressure (Systolic / Diastolic)</span>
                    <span className="text-rose-600">{systolicBp} / {diastolicBp} mmHg</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={systolicBp}
                      onChange={e => setSystolicBp(e.target.value)}
                      placeholder="Sys (e.g. 124)"
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="number"
                      value={diastolicBp}
                      onChange={e => setDiastolicBp(e.target.value)}
                      placeholder="Dia (e.g. 82)"
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Lipids (Total Chol / HDL)</span>
                    <span className="text-emerald-700">{totalChol} / {hdlChol} mg/dL</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={totalChol}
                      onChange={e => setTotalChol(e.target.value)}
                      placeholder="Total (e.g. 228)"
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="number"
                      value={hdlChol}
                      onChange={e => setHdlChol(e.target.value)}
                      placeholder="HDL (e.g. 52)"
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Resting Heart Rate</span>
                    <span className="text-slate-900">{restingHr} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="105"
                    value={restingHr}
                    onChange={e => setRestingHr(e.target.value)}
                    className="w-full accent-rose-600"
                  />
                </div>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
                  <span className="font-bold text-slate-800">Current Tobacco / Smoking</span>
                  <input
                    type="checkbox"
                    checked={isSmoker}
                    onChange={e => setIsSmoker(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Results Score Card */}
            <div className="card-white p-6 sm:p-8 lg:col-span-2 space-y-6 flex flex-col justify-between border-l-4 border-l-rose-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      ESC & Framingham Arterial Model
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                      Estimated Arterial Vascular Age
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    vascularResult.ageDelta > 3
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : vascularResult.ageDelta < 0
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {vascularResult.ageDelta > 0
                      ? `+${vascularResult.ageDelta} Years Older than Calendar Age`
                      : vascularResult.ageDelta < 0
                      ? `${vascularResult.ageDelta} Years Younger`
                      : 'Synchronized with Calendar Age'}
                  </span>
                </div>

                {/* Score Big Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Calendar Age</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">{vascularResult.chronologicalAge}y</div>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                    <span className="text-[10px] text-rose-800 font-bold uppercase block">Vascular Arterial Age</span>
                    <div className="text-3xl font-black text-rose-600 mt-1">{vascularResult.estimatedVascularAge}y</div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Pulse Wave Velocity</span>
                    <div className="text-3xl font-black text-emerald-900 mt-1">{vascularResult.epwv} <span className="text-xs">m/s</span></div>
                    <span className="text-[10px] font-bold text-emerald-800 block mt-0.5">{vascularResult.stiffnessLabel}</span>
                  </div>
                </div>
              </div>

              {/* Actionable Clinical Protocol */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green-600" />
                  Arterial Compliance & Endothelial Health Recommendations:
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {vascularResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* 180-Min Postprandial Glucose Curve Simulator */
        <div className="card-white p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                180-Minute Postprandial Continuous Glucose Curve
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing how food glycemic index and post-meal physical movement alter the blood sugar surge.
              </p>
            </div>

            {/* Scenario Toggles */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold flex-wrap">
              <button
                onClick={() => setSelectedScenario('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedScenario === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Compare All Curves
              </button>
              <button
                onClick={() => setSelectedScenario('highGi')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedScenario === 'highGi' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                High GI (Sedentary)
              </button>
              <button
                onClick={() => setSelectedScenario('lowGi')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedScenario === 'lowGi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Low GI (High Fiber)
              </button>
              <button
                onClick={() => setSelectedScenario('walk')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedScenario === 'walk' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                High GI + 15-Min Walk
              </button>
            </div>
          </div>

          {/* SVG Multi-Line Chart Canvas */}
          <div className="p-4 bg-slate-950 rounded-3xl overflow-x-auto text-white">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[300px]">
              
              {/* Grid Lines */}
              {[70, 100, 140, 180].map(val => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 4"
                    />
                    <text x={paddingLeft - 8} y={y + 3} fill="#94A3B8" fontSize="10" textAnchor="end">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Time X-axis labels */}
              {[0, 30, 60, 90, 120, 150, 180].map(t => {
                const x = getX(t);
                return (
                  <text key={t} x={x} y={svgHeight - 10} fill="#94A3B8" fontSize="10" textAnchor="middle">
                    {t}m
                  </text>
                );
              })}

              {/* Normal Target Shaded Band (70 - 140 mg/dL) */}
              <rect
                x={paddingLeft}
                y={getY(140)}
                width={chartW}
                height={getY(70) - getY(140)}
                fill="#10B981"
                fillOpacity="0.1"
              />

              {/* Curve 1: High GI Sedentary (Red) */}
              {(selectedScenario === 'all' || selectedScenario === 'highGi') && (
                <path
                  d={makePath(POSTPRANDIAL_GLUCOSE_CURVES.highGiSedentary)}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Curve 2: Low GI Sedentary (Emerald) */}
              {(selectedScenario === 'all' || selectedScenario === 'lowGi') && (
                <path
                  d={makePath(POSTPRANDIAL_GLUCOSE_CURVES.lowGiSedentary)}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Curve 3: High GI + 15m Walk (Teal) */}
              {(selectedScenario === 'all' || selectedScenario === 'walk') && (
                <path
                  d={makePath(POSTPRANDIAL_GLUCOSE_CURVES.highGiWith15MinWalk)}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}

              {/* Peak Annotations */}
              <circle cx={getX(45)} cy={getY(192)} r="4" fill="#F43F5E" />
              <text x={getX(45)} y={getY(192) - 8} fill="#FDA4AF" fontSize="10" fontWeight="bold" textAnchor="middle">
                Peak: 192 mg/dL
              </text>

              <circle cx={getX(45)} cy={getY(142)} r="4" fill="#06B6D4" />
              <text x={getX(45) + 30} y={getY(142) - 8} fill="#67E8F9" fontSize="10" fontWeight="bold" textAnchor="start">
                Walk Peak: 142 (-26%)
              </text>
            </svg>
          </div>

          {/* Clinical Interpretation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                High GI Sedentary Meal
              </strong>
              <p className="text-rose-800 leading-relaxed">
                Acute spike (&gt; 180 mg/dL) triggers massive pancreatic insulin release followed by a reactive hypoglycemic energy crash at 150 mins.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <strong className="text-emerald-950 font-bold block flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                Low GI High-Fiber Meal
              </strong>
              <p className="text-emerald-900 leading-relaxed">
                Smooth plateau keeping glucose strictly within the optimal 70-140 mg/dL target without draining cellular energy.
              </p>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-1">
              <strong className="text-teal-950 font-bold block flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-teal-600" />
                15-Min Post-Meal Walk
              </strong>
              <p className="text-teal-900 leading-relaxed">
                Muscle contractions activate GLUT-4 transporters directly without requiring extra insulin, blunting peak glucose by 26-32%.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
