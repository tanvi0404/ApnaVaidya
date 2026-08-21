export const ANATOMICAL_ORGAN_SYSTEMS = [
  {
    id: 'organ-heart',
    name: 'Heart & Arterial Vasculature',
    system: 'Cardiovascular',
    status: 'MODERATE_RISK',
    score: 72,
    svgCoords: { cx: 200, cy: 155, r: 28 },
    primaryBiomarkers: [
      { name: 'LDL Cholesterol', value: '146 mg/dL', status: 'HIGH' },
      { name: 'Blood Pressure', value: '124/82 mmHg', status: 'OPTIMAL' },
      { name: 'Pulse Wave Velocity (ePWV)', value: '9.5 m/s', status: 'BORDERLINE' },
      { name: '10-Year ASCVD Risk', value: '4.8%', status: 'LOW' }
    ],
    clinicalSummary: 'Arterial compliance is slightly hardened with elevated circulating atherogenic LDL particles. Heart rhythm and resting blood pressure are well controlled.',
    actionablePlan: [
      'Consume 10-15g daily soluble fiber (oats, psyllium, methi) to promote hepatic LDL clearance.',
      'Accumulate 150 minutes of Zone-2 aerobic fitness weekly to stimulate vascular nitric oxide.',
      'Consider CoQ10 (Ubiquinol 100mg) to support cardiac mitochondrial ATP production alongside statin therapy.'
    ]
  },
  {
    id: 'organ-pancreas',
    name: 'Pancreas & Glycemic Control',
    system: 'Endocrine & Metabolic',
    status: 'ACTION_NEEDED',
    score: 64,
    svgCoords: { cx: 200, cy: 215, r: 24 },
    primaryBiomarkers: [
      { name: 'HbA1c', value: '7.4%', status: 'HIGH' },
      { name: 'Fasting Blood Sugar', value: '132 mg/dL', status: 'HIGH' },
      { name: 'Fasting Serum Insulin', value: '14.2 uIU/mL', status: 'NORMAL' }
    ],
    clinicalSummary: 'Demonstrates sub-optimal 90-day glycemic regulation with peripheral insulin resistance. Beta-cell secretory reserve remains preserved.',
    actionablePlan: [
      'Take a 15-20 minute brisk walk after heavy meals to activate GLUT-4 muscle glucose uptake.',
      'Substitute high-GI polished white rice with low-GI millets (Ragi, Foxtail) and lentils.',
      'Maintain regular Metformin administration with food.'
    ]
  },
  {
    id: 'organ-thyroid',
    name: 'Thyroid Gland (Metabolic Regulator)',
    system: 'Endocrine',
    status: 'ACTION_NEEDED',
    score: 68,
    svgCoords: { cx: 200, cy: 95, r: 20 },
    primaryBiomarkers: [
      { name: 'TSH', value: '5.85 uIU/mL', status: 'HIGH' },
      { name: 'Free T4', value: '1.15 ng/dL', status: 'NORMAL' },
      { name: 'Free T3', value: '3.10 pg/mL', status: 'NORMAL' }
    ],
    clinicalSummary: 'Mild subclinical hypothyroidism. Elevated TSH down-regulates hepatic LDL receptors, compounding elevated cholesterol.',
    actionablePlan: [
      'Take Levothyroxine strictly first thing in the morning with plain water on an empty stomach.',
      'Wait at least 45 minutes before tea, coffee, or breakfast.',
      'Ensure adequate dietary Selenium (2 Brazil nuts daily) to facilitate T4-to-T3 peripheral conversion.'
    ]
  },
  {
    id: 'organ-liver',
    name: 'Liver (Hepatic Detox & Lipid Synthesis)',
    system: 'Hepatic & Metabolic',
    status: 'OPTIMAL',
    score: 92,
    svgCoords: { cx: 165, cy: 210, r: 26 },
    primaryBiomarkers: [
      { name: 'SGOT / AST', value: '24 U/L', status: 'OPTIMAL' },
      { name: 'SGPT / ALT', value: '28 U/L', status: 'OPTIMAL' },
      { name: 'Total Bilirubin', value: '0.8 mg/dL', status: 'OPTIMAL' }
    ],
    clinicalSummary: 'Robust hepatic cellular integrity with no signs of transaminitis, fatty liver, or impaired detoxification.',
    actionablePlan: [
      'Maintain daily 3.0L hydration goal to support bile acid flow.',
      'Incorporate cruciferous vegetables (broccoli, cabbage) rich in glucosinolates for Phase-2 conjugation.'
    ]
  },
  {
    id: 'organ-kidneys',
    name: 'Kidneys (Renal Filtration & Electrolytes)',
    system: 'Renal',
    status: 'OPTIMAL',
    score: 95,
    svgCoords: { cx: 235, cy: 240, r: 22 },
    primaryBiomarkers: [
      { name: 'Serum Creatinine', value: '0.90 mg/dL', status: 'OPTIMAL' },
      { name: 'Blood Urea Nitrogen', value: '14 mg/dL', status: 'OPTIMAL' },
      { name: 'eGFR', value: '> 90 mL/min', status: 'OPTIMAL' }
    ],
    clinicalSummary: 'Excellent glomerular filtration capacity. Fluid balance and electrolyte filtration functioning at peak efficiency.',
    actionablePlan: [
      'Maintain adequate hydration before and during strenuous workouts.',
      'Avoid unprescribed chronic NSAID painkillers to protect renal microvasculature.'
    ]
  },
  {
    id: 'organ-brain',
    name: 'Brain & Central Nervous System',
    system: 'Neurological',
    status: 'BORDERLINE',
    score: 74,
    svgCoords: { cx: 200, cy: 45, r: 24 },
    primaryBiomarkers: [
      { name: 'Vitamin B12', value: '215 pg/mL', status: 'BORDERLINE' },
      { name: 'Sleep Quality Score', value: '82%', status: 'OPTIMAL' },
      { name: 'Heart Rate Variability', value: '46 ms', status: 'OPTIMAL' }
    ],
    clinicalSummary: 'Borderline serum B12 combined with chronic Metformin use can subtly impair peripheral nerve myelin sheath synthesis.',
    actionablePlan: [
      'Supplement Methylcobalamin (1500 mcg) to protect peripheral nerve conduction.',
      'Maintain consistent 7.5-hour sleep window for glymphatic brain waste clearance.'
    ]
  },
  {
    id: 'organ-skeleton',
    name: 'Skeletal & Bone Mineral Matrix',
    system: 'Musculoskeletal',
    status: 'DEFICIENT',
    score: 58,
    svgCoords: { cx: 200, cy: 330, r: 30 },
    primaryBiomarkers: [
      { name: 'Vitamin D3 (25-OH)', value: '18.4 ng/mL', status: 'DEFICIENT' },
      { name: 'Serum Calcium', value: '9.4 mg/dL', status: 'NORMAL' },
      { name: 'Serum Alkaline Phosphatase', value: '68 U/L', status: 'OPTIMAL' }
    ],
    clinicalSummary: 'Severe Vitamin D3 deficiency blunts intestinal calcium absorption and weakens osteoblast mineralization.',
    actionablePlan: [
      '60,000 IU Cholecalciferol weekly loading dose for 8 consecutive weeks.',
      '18 minutes daily morning sunlight exposure between 8:00 AM - 10:00 AM.',
      'Resistance training 3x weekly to stimulate bone mineral density.'
    ]
  }
];

export const DRUG_NUTRIENT_DEPLETION_DATABASE = [
  {
    id: 'dep-metformin',
    medicationName: 'Metformin (Biguanide)',
    depletedNutrients: [
      { name: 'Vitamin B12 (Cobalamin)', severity: 'HIGH', mechanism: 'Inhibits calcium-dependent ileal membrane absorption of the intrinsic factor-B12 complex.' },
      { name: 'Folic Acid (Vitamin B9)', severity: 'MODERATE', mechanism: 'Reduces gastrointestinal folate transporter kinetics.' }
    ],
    clinicalSymptoms: 'Numbness/tingling in toes (neuropathy), unexplained fatigue, brain fog, and elevated homocysteine.',
    restorationProtocol: 'Sublingual Methylcobalamin (1500 mcg) + L-Methylfolate (400 mcg) daily taken with lunch.'
  },
  {
    id: 'dep-statin',
    medicationName: 'Atorvastatin / Rosuvastatin (Statins)',
    depletedNutrients: [
      { name: 'Coenzyme Q10 (CoQ10 / Ubiquinol)', severity: 'HIGH', mechanism: 'Inhibits HMG-CoA reductase, which is shared by both cholesterol and CoQ10 synthesis pathways.' }
    ],
    clinicalSymptoms: 'Muscle aches (myalgias), post-exercise muscle soreness, reduced mitochondrial aerobic endurance.',
    restorationProtocol: 'Ubiquinol (100-200 mg) daily with meals containing healthy fats (avocado, nuts).'
  },
  {
    id: 'dep-ppi',
    medicationName: 'Pantoprazole / Omeprazole (PPIs)',
    depletedNutrients: [
      { name: 'Magnesium', severity: 'HIGH', mechanism: 'Hypochlorhydria reduces ionization and passive intestinal absorption of dietary minerals.' },
      { name: 'Iron & Vitamin B12', severity: 'MODERATE', mechanism: 'Gastric acid is required to cleave protein-bound iron and B12 from food.' }
    ],
    clinicalSymptoms: 'Muscle twitches, nighttime calf cramps, fatigue, and hair thinning.',
    restorationProtocol: 'Magnesium Glycinate (250-400 mg) taken before sleep; take PPI only for clinically necessary duration.'
  }
];
