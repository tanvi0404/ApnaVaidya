import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  ChevronRight, 
  Scale, 
  Heart, 
  Gauge, 
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';
import { 
  CALCULATE_ASCVD_RISK, 
  CALCULATE_IDRS_SCORE, 
  METABOLIC_SYNDROME_CRITERIA 
} from '../../data/riskCalculatorsData';
import { calculateAscvdBackend, calculateIdrsBackend } from '../../services/apiClient';

export default function ClinicalRiskCalculatorsView({ activeProfile }) {
  const [activeTab, setActiveTab] = useState('ascvd'); // 'ascvd' | 'idrs' | 'metabolic' | 'bioage'

  // ASCVD Calculator States (Pre-filled with active profile baseline)
  const [ascvdAge, setAscvdAge] = useState(activeProfile.age || 32);
  const [ascvdGender, setAscvdGender] = useState(activeProfile.gender === 'Female' ? 'Female' : 'Male');
  const [ascvdTotalChol, setAscvdTotalChol] = useState(228);
  const [ascvdHdl, setAscvdHdl] = useState(52);
  const [ascvdSbp, setAscvdSbp] = useState(124);
  const [ascvdIsSmoker, setAscvdIsSmoker] = useState(false);
  const [ascvdHasDiabetes, setAscvdHasDiabetes] = useState(activeProfile.id === 'user-rajesh');

  // IDRS Calculator States
  const [idrsAge, setIdrsAge] = useState(activeProfile.age || 32);
  const [idrsWaist, setIdrsWaist] = useState(84); // cm
  const [idrsActivity, setIdrsActivity] = useState('Moderate Exercise / Regular Walking');
  const [idrsFamilyHistory, setIdrsFamilyHistory] = useState('One Parent Diabetic');

  // Metabolic Syndrome Checkbox States (5 points)
  const [metabolicChecks, setMetabolicChecks] = useState({
    'crit-waist': false,
    'crit-triglycerides': false,
    'crit-hdl': false,
    'crit-bp': false,
    'crit-fbs': activeProfile.id === 'user-rajesh'
  });

  // Sync calculator state when activeProfile updates
  React.useEffect(() => {
    if (activeProfile) {
      if (activeProfile.age !== undefined && activeProfile.age !== null) {
        setAscvdAge(activeProfile.age);
        setIdrsAge(activeProfile.age);
      }
      setAscvdGender(activeProfile.gender === 'Female' ? 'Female' : 'Male');
      setAscvdHasDiabetes(activeProfile.id === 'user-rajesh');
      setMetabolicChecks(prev => ({
        ...prev,
        'crit-fbs': activeProfile.id === 'user-rajesh'
      }));
    }
  }, [activeProfile.id, activeProfile.age, activeProfile.gender]);

  // Calculate local results
  const localAscvd = CALCULATE_ASCVD_RISK(
    ascvdAge,
    ascvdGender,
    ascvdTotalChol,
    ascvdHdl,
    ascvdSbp,
    ascvdIsSmoker,
    ascvdHasDiabetes
  );

  const [ascvdResult, setAscvdResult] = useState(localAscvd);

  // Sync ASCVD with Java Backend
  React.useEffect(() => {
    let isMounted = true;
    calculateAscvdBackend({
      age: Number(ascvdAge) || 40,
      gender: ascvdGender,
      totalChol: Number(ascvdTotalChol) || 200,
      hdlChol: Number(ascvdHdl) || 50,
      systolicBp: Number(ascvdSbp) || 120,
      smoker: ascvdIsSmoker,
      diabetic: ascvdHasDiabetes
    }).then(res => {
      if (isMounted && res) {
        setAscvdResult(res);
      }
    }).catch(() => {
      if (isMounted) setAscvdResult(localAscvd);
    });
    return () => { isMounted = false; };
  }, [ascvdAge, ascvdGender, ascvdTotalChol, ascvdHdl, ascvdSbp, ascvdIsSmoker, ascvdHasDiabetes]);

  const localIdrs = CALCULATE_IDRS_SCORE(
    idrsAge,
    idrsWaist,
    idrsActivity,
    idrsFamilyHistory
  );

  const [idrsResult, setIdrsResult] = useState(localIdrs);

  // Sync IDRS with Java Backend
  React.useEffect(() => {
    let isMounted = true;
    calculateIdrsBackend({
      age: Number(idrsAge) || 35,
      waist: Number(idrsWaist) || 85,
      activity: idrsActivity,
      familyHistory: idrsFamilyHistory
    }).then(res => {
      if (isMounted && res) {
        setIdrsResult(prev => {
          const serverScore = res.score ?? res.idrsScore ?? res.totalScore ?? prev.score ?? 50;
          return {
            ...prev,
            score: serverScore,
            totalScore: serverScore,
            maxScore: 100,
            riskCategory: res.riskCategory || prev.riskCategory || 'HIGH',
            category: res.riskCategory || prev.category,
            label: res.riskCategory || prev.label,
            advice: res.clinicalAdvice || prev.advice,
            recommendation: res.clinicalAdvice || prev.recommendation
          };
        });
      }
    }).catch(() => {
      if (isMounted) setIdrsResult(localIdrs);
    });
    return () => { isMounted = false; };
  }, [idrsAge, idrsWaist, idrsActivity, idrsFamilyHistory]);

  const metabolicCount = Object.values(metabolicChecks).filter(Boolean).length;
  const hasMetabolicSyndrome = metabolicCount >= 3;

  // Bio-Age Calculation
  const bioAgeOffset = (
    (ascvdTotalChol > 200 ? 1.5 : -1.0) +
    (ascvdSbp > 130 ? 2.0 : -0.5) +
    (ascvdIsSmoker ? 4.0 : 0) +
    (ascvdHasDiabetes ? 3.0 : 0) +
    (idrsActivity === 'Regular Vigorous Exercise / Strenuous Work' ? -2.5 : 1.0)
  );
  const estimatedBioAge = Math.round(Number(activeProfile.age) + bioAgeOffset);

  const toggleMetabolic = (id) => {
    setMetabolicChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <HeartPulse className="w-3.5 h-3.5" /> CLINICAL RISK PREDICTION ENGINE
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Cardiometabolic & Preventive Risk Calculators
            </h2>
          </div>

          {/* Calculator Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold flex-wrap">
            {[
              { id: 'ascvd', label: '10-Yr Heart Risk (ASCVD)' },
              { id: 'idrs', label: 'Diabetes Score (IDRS)' },
              { id: 'metabolic', label: 'Metabolic Syndrome' },
              { id: 'bioage', label: 'Biological Health Age' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator 1: 10-Year ASCVD Cardiovascular Risk */}
      {activeTab === 'ascvd' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Form */}
          <div className="card-white p-6 space-y-4 lg:col-span-1">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Cardiovascular Biomarkers
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Age (Years): {ascvdAge}</label>
                <input
                  type="range"
                  min="20"
                  max="79"
                  value={ascvdAge}
                  onChange={e => setAscvdAge(Number(e.target.value))}
                  className="w-full accent-brand-green-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Biological Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Male', 'Female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setAscvdGender(g)}
                      className={`p-2 rounded-xl text-center font-bold border transition-all ${
                        ascvdGender === g ? 'bg-brand-green-700 text-white border-brand-green-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Cholesterol: {ascvdTotalChol} mg/dL</label>
                <input
                  type="range"
                  min="130"
                  max="320"
                  value={ascvdTotalChol}
                  onChange={e => setAscvdTotalChol(Number(e.target.value))}
                  className="w-full accent-brand-green-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">HDL Cholesterol: {ascvdHdl} mg/dL</label>
                <input
                  type="range"
                  min="25"
                  max="90"
                  value={ascvdHdl}
                  onChange={e => setAscvdHdl(Number(e.target.value))}
                  className="w-full accent-brand-green-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Systolic Blood Pressure: {ascvdSbp} mmHg</label>
                <input
                  type="range"
                  min="90"
                  max="190"
                  value={ascvdSbp}
                  onChange={e => setAscvdSbp(Number(e.target.value))}
                  className="w-full accent-brand-green-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ascvdIsSmoker}
                    onChange={e => setAscvdIsSmoker(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                  />
                  <span className="font-semibold text-slate-800">Current Tobacco / Cigarette Smoker</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ascvdHasDiabetes}
                    onChange={e => setAscvdHasDiabetes(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                  />
                  <span className="font-semibold text-slate-800">Diagnosed Type 2 Diabetes</span>
                </label>
              </div>
            </div>
          </div>

          {/* Outcome & Clinical Insights */}
          <div className="card-white p-6 space-y-5 lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Risk Gauge Header */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-extrabold block">
                    Estimated 10-Year ASCVD Risk Score
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                    {ascvdResult.riskPercent}%
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    Risk of Heart Attack or Stroke in next 10 years
                  </span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    ascvdResult.category === 'HIGH' ? 'bg-rose-500 text-white' : ascvdResult.category === 'INTERMEDIATE' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {ascvdResult.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Clinical Recommendation Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-950">
                <span className="font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-green-600" />
                  ACC / AHA & ICMR Clinical Recommendation
                </span>
                <p className="leading-relaxed font-medium">
                  {ascvdResult.recommendation}
                </p>
              </div>

              {/* Modifiable Risk Factors Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lipid Ratio</span>
                  <strong className="text-slate-900 text-sm">{(ascvdTotalChol / ascvdHdl).toFixed(1)} : 1</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Target &lt; 4.0</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Vascular Pressure</span>
                  <strong className="text-slate-900 text-sm">{ascvdSbp} mmHg</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Optimal &lt; 120</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Metabolic Impact</span>
                  <strong className="text-slate-900 text-sm">{ascvdHasDiabetes ? '+4.0% Risk' : 'None'}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Glycemic status</span>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
              Based on the 2019 ACC/AHA Primary Prevention Guidelines and ICMR South Asian cardiovascular risk calibration.
            </div>
          </div>
        </div>
      )}

      {/* Calculator 2: Indian Diabetes Risk Score (IDRS) */}
      {activeTab === 'idrs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card-white p-6 space-y-4 lg:col-span-1">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              IDRS Evaluation Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Age: {idrsAge} Years</label>
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={idrsAge}
                  onChange={e => setIdrsAge(Number(e.target.value))}
                  className="w-full accent-brand-green-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Waist Circumference: {idrsWaist} cm</label>
                <input
                  type="range"
                  min="60"
                  max="125"
                  value={idrsWaist}
                  onChange={e => setIdrsWaist(Number(e.target.value))}
                  className="w-full accent-brand-green-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Asian cutoff: &lt; 80cm (F), &lt; 90cm (M)</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Physical Activity Level</label>
                <select
                  value={idrsActivity}
                  onChange={e => setIdrsActivity(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option>Regular Vigorous Exercise / Strenuous Work</option>
                  <option>Moderate Exercise / Regular Walking</option>
                  <option>Mild Exercise / Sedentary with Little Activity</option>
                  <option>Completely Sedentary / No Activity</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Family History of Diabetes</label>
                <select
                  value={idrsFamilyHistory}
                  onChange={e => setIdrsFamilyHistory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option>None</option>
                  <option>One Parent Diabetic</option>
                  <option>Both Parents Diabetic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-white p-6 space-y-5 lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-800 to-brand-green-900 text-white flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-200 font-extrabold block">
                    Indian Diabetes Risk Score (IDRS)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                    {idrsResult.score} / {idrsResult.maxScore}
                  </div>
                </div>

                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  idrsResult.riskCategory === 'HIGH' ? 'bg-rose-500 text-white' : idrsResult.riskCategory === 'MODERATE' ? 'bg-amber-500 text-white' : 'bg-emerald-400 text-slate-900'
                }`}>
                  {idrsResult.label}
                </span>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1 text-emerald-950">
                <span className="font-bold text-emerald-900 uppercase">ICMR / MDRF Clinical Guidance:</span>
                <p className="leading-relaxed font-medium">{idrsResult.advice}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              IDRS is an ICMR-endorsed non-invasive scoring model developed by the Madras Diabetes Research Foundation.
            </div>
          </div>
        </div>
      )}

      {/* Calculator 3: Metabolic Syndrome Diagnostic Screener */}
      {activeTab === 'metabolic' && (
        <div className="card-white p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                NCEP-ATP III & IDF 5-Point Metabolic Syndrome Screener
              </h3>
              <p className="text-xs text-slate-500">
                A constellation of 3 or more metabolic factors indicates Metabolic Syndrome, multiplying cardiovascular and diabetes risk.
              </p>
            </div>

            <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full ${
              hasMetabolicSyndrome ? 'bg-rose-600 text-white animate-pulse' : metabolicCount >= 1 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {hasMetabolicSyndrome ? '⚠ METABOLIC SYNDROME PRESENT (3+ Factors)' : `${metabolicCount} of 5 Criteria Present`}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {METABOLIC_SYNDROME_CRITERIA.map((crit) => {
              const isChecked = !!metabolicChecks[crit.id];

              return (
                <div
                  key={crit.id}
                  onClick={() => toggleMetabolic(crit.id)}
                  className={`py-3.5 px-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 flex-wrap ${
                    isChecked ? 'bg-rose-50/80 border border-rose-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-[240px] flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="mt-1 w-4 h-4 text-emerald-600 rounded pointer-events-none"
                    />
                    <div>
                      <strong className="text-xs sm:text-sm text-slate-900 block font-bold">{crit.label}</strong>
                      <span className="text-xs text-slate-500">
                        Threshold: <strong>{crit.thresholdMale}</strong>
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Biological Impact: {crit.riskFactor}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    isChecked ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isChecked ? 'Positive (+1)' : 'Negative (0)'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
            <strong>Reversal Strategy:</strong> Visceral adiposity and metabolic insulin resistance respond rapidly to 150 minutes of Zone-2 aerobic cardio weekly, Mediterranean high-fiber nutrition, and eliminating liquid sugary calories.
          </div>
        </div>
      )}

      {/* Calculator 4: Biological Health Age Estimator */}
      {activeTab === 'bioage' && (
        <div className="card-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display flex items-center gap-2">
                <Flame className="w-5 h-5 text-brand-pink-500" />
                Biological Vitality Age vs Chronological Age
              </h3>
              <p className="text-xs text-slate-500">
                Estimated by composite cardiometabolic biomarkers, sleep quality, and physical movement volume.
              </p>
            </div>

            <span className="badge-green text-xs font-bold">
              Multi-Organ Biomarker Index
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Age Dial Visual Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-brand-green-800 to-emerald-950 text-white text-center space-y-2 shadow-lg">
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-extrabold block">
                Estimated Biological Health Age
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold font-display text-emerald-300">
                {estimatedBioAge} <span className="text-xl text-white font-normal">Years</span>
              </div>
              <div className="pt-2 text-xs text-emerald-100">
                Chronological Age: <strong>{activeProfile.age} Years</strong> ({estimatedBioAge <= activeProfile.age ? '🌟 Younger than calendar age!' : '⚡ Slightly higher wear & tear'})
              </div>
            </div>

            {/* Drivers list */}
            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-slate-700 block uppercase tracking-wider">Top Biological Age Drivers:</span>
              
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span>Lipid Profile (LDL 146 mg/dL)</span>
                <span className="font-bold text-rose-600">+1.5 yrs</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span>Vascular BP (124/80 mmHg)</span>
                <span className="font-bold text-emerald-600">-0.5 yrs</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span>Aerobic Physical Activity (4 days/wk)</span>
                <span className="font-bold text-emerald-600">-2.0 yrs</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span>Sleep Duration & HRV Recovery</span>
                <span className="font-bold text-emerald-600">-1.0 yrs</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
