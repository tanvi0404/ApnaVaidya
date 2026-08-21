export function CALCULATE_LONGEVITY_METRICS(activeProfile) {
  // Score computation out of 100 based on 5 clinical pillars
  const cardiometabolicScore = 78; // LDL 146, Fasting Glucose 98
  const inflammationScore = 84;     // Low hs-CRP, stable liver enzymes
  const organVitalityScore = 92;    // eGFR > 90, normal creatinine
  const micronutrientScore = 65;    // Vit D3 deficient, B12 borderline
  const lifestyleRecoveryScore = 88; // 3.0L water, 7.5h sleep, regular walking

  const compositeScore = Math.round(
    (cardiometabolicScore * 0.25) +
    (inflammationScore * 0.20) +
    (organVitalityScore * 0.20) +
    (micronutrientScore * 0.15) +
    (lifestyleRecoveryScore * 0.20)
  );

  // Aging Velocity: Biological years accrued per calendar year
  // Ideal: < 0.90 (Decelerated aging)
  const agingVelocity = (1.0 - ((compositeScore - 70) * 0.006)).toFixed(2);

  return {
    compositeScore, // e.g. 82/100
    agingVelocity,  // e.g. 0.85x
    status: compositeScore >= 80 ? 'Optimal Healthspan Trajectory' : 'Moderate Longevity Reserve',
    pillars: [
      {
        name: 'Cardiometabolic Reserve',
        score: cardiometabolicScore,
        target: 'ApoB < 80 mg/dL, Trig/HDL < 2.0',
        currentStatus: 'Elevated LDL (146 mg/dL) — Needs Soluble Fiber',
        impact: 'Moderate Priority'
      },
      {
        name: 'Systemic Inflammation & Endothelium',
        score: inflammationScore,
        target: 'hs-CRP < 1.0 mg/L, Homocysteine < 10 µmol/L',
        currentStatus: 'Optimal baseline vascular inflammation',
        impact: 'Low Risk'
      },
      {
        name: 'Renal & Hepatic Vitality',
        score: organVitalityScore,
        target: 'eGFR > 90 mL/min, Normal AST/ALT',
        currentStatus: 'Robust filtration & detoxification capacity',
        impact: 'Optimal'
      },
      {
        name: 'Micronutrient & Mitochondrial Co-factors',
        score: micronutrientScore,
        target: 'Vit D3 > 40 ng/mL, B12 > 400 pg/mL',
        currentStatus: 'D3 Deficient (18.4 ng/mL) — Loading Dose Advised',
        impact: 'High Priority'
      },
      {
        name: 'Autophagy & Circadian Recovery',
        score: lifestyleRecoveryScore,
        target: '7.5h REM/Deep sleep, 150m Zone-2 cardio',
        currentStatus: 'High adherence to hydration & movement goals',
        impact: 'Optimal'
      }
    ]
  };
}

export const PREVENTIVE_SCREENING_SCHEDULE = [
  {
    id: 'screen-lipid',
    title: 'Fasting Lipid & Cardiometabolic Panel',
    category: 'Cardiovascular',
    recommendedFrequency: 'Every 6-12 Months',
    targetAgeRange: 'Age 20+',
    status: 'COMPLETED',
    lastDoneDate: '15 Aug 2026',
    nextDueDate: '15 Feb 2027',
    clinicalRationale: 'Detects atherogenic dyslipidemia early to prevent plaque accumulation.',
    guidelineSource: 'ICMR & ESC Guidelines 2025'
  },
  {
    id: 'screen-hba1c',
    title: 'HbA1c & Fasting Insulin / Glycemic Index',
    category: 'Metabolic & Diabetes',
    recommendedFrequency: 'Every 3-6 Months',
    targetAgeRange: 'Age 25+ (Annual or 3m if prediabetic)',
    status: 'COMPLETED',
    lastDoneDate: '15 Aug 2026',
    nextDueDate: '15 Nov 2026',
    clinicalRationale: 'Assesses 90-day average blood glucose and detects insulin resistance before diabetes onset.',
    guidelineSource: 'ADA Clinical Practice Guidelines'
  },
  {
    id: 'screen-vitd',
    title: 'Vitamin D3 & B12 Follow-Up Retest',
    category: 'Nutritional Co-factors',
    recommendedFrequency: 'After 8-10 Weeks of Supplementation',
    targetAgeRange: 'All Adults',
    status: 'DUE_SOON',
    lastDoneDate: '10 Aug 2026',
    nextDueDate: '15 Oct 2026',
    clinicalRationale: 'Verifies normalization of serum 25-OH Vitamin D after 60,000 IU weekly loading therapy.',
    guidelineSource: 'Endocrine Society Clinical Guidelines'
  },
  {
    id: 'screen-cac',
    title: 'Coronary Artery Calcium (CAC) CT Scan',
    category: 'Cardiovascular Imaging',
    recommendedFrequency: 'Once every 5 Years',
    targetAgeRange: 'Men 40+ / Women 45+ or Family History',
    status: 'RECOMMENDED',
    lastDoneDate: 'Not yet performed',
    nextDueDate: 'Schedule at Age 40',
    clinicalRationale: 'Directly quantifies calcified coronary atheroma for definitive risk stratification.',
    guidelineSource: 'ACC/AHA Guideline on Primary Prevention'
  },
  {
    id: 'screen-retina',
    title: 'Diabetic Retinopathy Digital Fundus Exam',
    category: 'Ophthalmic Microvascular',
    recommendedFrequency: 'Annual',
    targetAgeRange: 'All individuals with HbA1c > 6.5%',
    status: 'DUE_SOON',
    lastDoneDate: '12 Sep 2025',
    nextDueDate: '15 Sep 2026',
    clinicalRationale: 'Screening for retinal microaneurysms and macular edema before vision symptoms appear.',
    guidelineSource: 'All India Ophthalmological Society'
  }
];

export const LONGEVITY_STACK_PROTOCOLS = [
  {
    id: 'stack-zone2',
    name: 'Zone-2 Mitochondrial Biogenesis Protocol',
    pillar: 'Cardiorespiratory Fitness',
    instruction: '150-180 minutes weekly of low-intensity aerobic movement (brisk walking, cycling) at a conversational pace (60-70% max heart rate).',
    longevityBenefit: 'Multiplies mitochondrial density in slow-twitch muscle fibers, enhancing fatty acid oxidation and reducing all-cause mortality risk by up to 40%.'
  },
  {
    id: 'stack-fiber',
    name: 'Soluble Beta-Glucan & Viscous Fiber Surge',
    pillar: 'Metabolic Longevity',
    instruction: 'Consume 10-15g soluble fiber daily (rolled oats, psyllium husk, methi seeds, chia seeds) before primary meals.',
    longevityBenefit: 'Binds bile acids in the small intestine, forcing the liver to extract circulating LDL cholesterol from bloodstream to synthesize new bile acids.'
  },
  {
    id: 'stack-circadian',
    name: 'Circadian Fasting & Autophagy Window',
    pillar: 'Cellular Cleanup',
    instruction: 'Maintain a 12-to-14 hour overnight fasting window (e.g. finish dinner by 8:00 PM, breakfast at 9:00 AM).',
    longevityBenefit: 'Activates AMPK and cellular autophagy pathways, promoting lysosomal clearance of misfolded proteins and senescent cellular debris.'
  }
];
