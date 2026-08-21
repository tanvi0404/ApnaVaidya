export const HEALTH_TIMELINE_EVENTS = {
  'user-arjun': [
    {
      id: 'time-1',
      date: '12 Aug 2026',
      title: 'Comprehensive Lipid Profile Test',
      category: 'Lab Test',
      iconType: 'lab',
      summary: 'Thyrocare Diagnostics. Total Chol: 228 mg/dL, LDL: 146 mg/dL (High), HDL: 52 mg/dL.',
      statusTag: '2 Flagged',
      badgeColor: 'rose',
      details: 'Follow-up lipid test after 3 months of dietary modifications. Shows 12 mg/dL improvement in LDL compared to May 2026.'
    },
    {
      id: 'time-2',
      date: '15 Jul 2026',
      title: 'Complete Blood Count (CBC) Routine Check',
      category: 'Lab Test',
      iconType: 'lab',
      summary: 'Apollo Diagnostics. Hemoglobin: 15.2 g/dL, WBC: 6,800/cumm, Platelets: 2.4 Lakhs.',
      statusTag: 'All Optimal',
      badgeColor: 'green',
      details: 'Routine hematological screening. Normal red blood cell count and immune indices.'
    },
    {
      id: 'time-3',
      date: '20 Jun 2026',
      title: 'Cardiology Consultation with Dr. Arvind Mehta',
      category: 'Doctor Visit',
      iconType: 'doctor',
      summary: 'Max Super Specialty Hospital. Evaluated resting ECG and family cardiovascular history.',
      statusTag: 'Consultation Complete',
      badgeColor: 'teal',
      details: 'Physician advised continuing daily 40-minute brisk cardio, adding plant sterols/fiber, and retesting lipid panel in August.'
    },
    {
      id: 'time-4',
      date: '15 Jan 2026',
      title: 'Started Omega-3 Fatty Acid Regimen',
      category: 'Medication',
      iconType: 'med',
      summary: 'Prescribed 1000mg high-potency Omega-3 capsule daily after breakfast.',
      statusTag: 'Active Regimen',
      badgeColor: 'green',
      details: 'Initiated to support HDL function and reduce triglyceride/arterial inflammation.'
    },
    {
      id: 'time-5',
      date: '10 Nov 2025',
      title: 'Baseline Diagnostic Workup',
      category: 'Lab Test',
      iconType: 'lab',
      summary: 'Initial baseline lipid and metabolic profile. Total Chol was 252 mg/dL, LDL 168 mg/dL.',
      statusTag: 'Baseline Record',
      badgeColor: 'amber',
      details: 'Triggered the start of active lifestyle and nutritional intervention.'
    }
  ],
  'user-rajesh': [
    {
      id: 'time-6',
      date: '10 Aug 2026',
      title: 'Diabetic Glycemic Profile (HbA1c & FBS)',
      category: 'Lab Test',
      iconType: 'lab',
      summary: 'Dr. Lal PathLabs. HbA1c: 7.4%, Fasting Blood Sugar: 148 mg/dL.',
      statusTag: 'Improving Trend',
      badgeColor: 'rose',
      details: 'HbA1c improved from 7.8% in April 2026 down to 7.4%.'
    },
    {
      id: 'time-7',
      date: '18 Jun 2026',
      title: 'Kidney Function Test (KFT)',
      category: 'Lab Test',
      iconType: 'lab',
      summary: 'Serum Creatinine: 1.18 mg/dL, eGFR: 78 mL/min. Stable renal filtration.',
      statusTag: 'Stable',
      badgeColor: 'green',
      details: 'Monitored annually to protect microvasculature against diabetic nephropathy.'
    },
    {
      id: 'time-8',
      date: '15 Jan 2025',
      title: 'Blood Pressure Regimen Adjusted (Telmisartan 40mg)',
      category: 'Medication',
      iconType: 'med',
      summary: 'Started Telmisartan 40mg once daily to maintain blood pressure < 130/80 mmHg.',
      statusTag: 'Active Regimen',
      badgeColor: 'green',
      details: 'Dual action blood pressure control and nephroprotective coverage.'
    }
  ]
};

export const WEARABLES_DATA = {
  'user-arjun': {
    device: 'Apple Watch Series 9 & HealthKit',
    syncStatus: 'Live Synchronized',
    lastSync: '2 minutes ago',
    battery: '84%',
    metrics: {
      steps: { current: 8420, goal: 10000, unit: 'steps', percentage: 84 },
      restingHeartRate: { current: 62, optimal: '58 - 72', unit: 'bpm', status: 'Optimal' },
      heartRateVariability: { current: 58, optimal: '> 45', unit: 'ms', status: 'High Recovery' },
      spo2: { current: 98, optimal: '95 - 100', unit: '%', status: 'Optimal' },
      activeCalories: { current: 540, goal: 600, unit: 'kcal', percentage: 90 },
      sleepDuration: { current: 7.6, goal: 8.0, unit: 'hrs', percentage: 95 }
    },
    heartRateZones: [
      { name: 'Resting / Casual', range: '< 100 bpm', duration: '18h 40m' },
      { name: 'Zone 2 (Fat Burn & Cardio)', range: '110 - 135 bpm', duration: '42 mins' },
      { name: 'Zone 4 (Peak Cardio)', range: '145 - 165 bpm', duration: '14 mins' }
    ]
  },
  'user-rajesh': {
    device: 'Fitbit Charge 6',
    syncStatus: 'Live Synchronized',
    lastSync: '10 minutes ago',
    battery: '72%',
    metrics: {
      steps: { current: 6200, goal: 7500, unit: 'steps', percentage: 82 },
      restingHeartRate: { current: 68, optimal: '60 - 75', unit: 'bpm', status: 'Optimal' },
      heartRateVariability: { current: 42, optimal: '> 35', unit: 'ms', status: 'Normal' },
      spo2: { current: 97, optimal: '95 - 100', unit: '%', status: 'Optimal' },
      activeCalories: { current: 380, goal: 450, unit: 'kcal', percentage: 84 },
      sleepDuration: { current: 6.4, goal: 7.5, unit: 'hrs', percentage: 85 }
    },
    heartRateZones: [
      { name: 'Resting / Casual', range: '< 95 bpm', duration: '20h 15m' },
      { name: 'Zone 2 (Brisk Walk)', range: '100 - 120 bpm', duration: '35 mins' },
      { name: 'Zone 3 (Moderate)', range: '120 - 135 bpm', duration: '8 mins' }
    ]
  }
};

export const DOCUMENT_SUMMARIES_PRESETS = [
  {
    id: 'sum-1',
    title: 'Hospital Discharge Summary (Bronchitis & Recovery)',
    hospital: 'Fortis Memorial Research Institute, Gurugram',
    admissionDate: '10 Nov 2025',
    dischargeDate: '12 Nov 2025',
    primaryDiagnosis: 'Acute Exacerbation of Bronchitis with Mild Hypoxemia (Resolved)',
    aiStructuredSummary: {
      keyFindings: [
        'Patient presented with productive cough and mild chest wheezing.',
        'Chest X-Ray showed bilateral bronchial wall thickening without consolidation.',
        'SpO2 normalized from 92% to 98% on room air post bronchodilator nebulization.'
      ],
      dischargeMedications: [
        { drug: 'Azithromycin 500mg', dose: '1 Tab Daily', duration: '3 Days (Completed)' },
        { drug: 'Budesonide Inhaler (200mcg)', dose: '2 Puffs Twice Daily', duration: '14 Days' },
        { drug: 'Levocetirizine 5mg', dose: '1 Tab at Bedtime', duration: '5 Days' }
      ],
      dischargeInstructions: [
        'Avoid exposure to active smoke, dust, and chilled unboiled beverages for 2 weeks.',
        'Practice deep breathing spirometry exercises 3 times daily.',
        'Follow-up visit with pulmonologist if cough recurs.'
      ]
    }
  },
  {
    id: 'sum-2',
    title: 'Cardiology Outpatient Prescription & Care Plan',
    hospital: 'Max Super Specialty Hospital, Cardiology OPD',
    admissionDate: '20 Jun 2026',
    dischargeDate: 'Same Day OPD',
    primaryDiagnosis: 'Mild Dyslipidemia & Essential Hypertension Stage 1',
    aiStructuredSummary: {
      keyFindings: [
        'Resting blood pressure in clinic: 128/82 mmHg.',
        'Resting 12-lead ECG: Normal Sinus Rhythm (NSR), no ST-T ischemic changes.',
        'Lipid Profile reviewed: Elevated LDL at 152 mg/dL.'
      ],
      dischargeMedications: [
        { drug: 'Telmisartan 40mg', dose: '1 Tab Morning', duration: 'Long-term' },
        { drug: 'Omega-3 Marine Triglyceride 1000mg', dose: '1 Cap Daily', duration: 'Ongoing' }
      ],
      dischargeInstructions: [
        'Adhere to DASH-style dietary pattern: sodium < 2.0g/day, high potassium from bananas and tender coconut.',
        'Engage in 150 minutes of moderate aerobic cardio weekly.',
        'Repeat fasting lipid profile in 90 days.'
      ]
    }
  }
];

export const VERIFIED_FEED_ARTICLES = [
  {
    id: 'art-1',
    title: 'How Soluble Fiber Actively Lowers LDL Cholesterol in South Asian Diets',
    author: 'Dr. Arvind Mehta (Cardiologist) & ICMR Clinical Review',
    readTime: '4 min read',
    category: 'Heart Health',
    tags: ['Cardiology', 'LDL', 'Nutrition'],
    summary: 'Soluble fiber forms a gel-like matrix in the small intestine that binds directly to bile acids (made of cholesterol), prompting the liver to pull LDL from your blood to manufacture new bile.',
    keyTakeaways: [
      'Consuming 10-15g of soluble fiber daily (from oats, isabgol/psyllium husk, methi seeds) lowers LDL by 5-10%.',
      'South Asian populations experience higher premature CAD risks, making non-pharmacological lipid management crucial.',
      'Replace refined white maida with whole-grain millets (jowar, bajra, ragi).'
    ],
    citation: 'Journal of Clinical Lipidology & ICMR Consensus 2024'
  },
  {
    id: 'art-2',
    title: 'Post-Meal Walking: The Science of Insulin-Independent Glucose Clearance',
    author: 'Dr. Shalini Kapoor (Diabetologist)',
    readTime: '3 min read',
    category: 'Diabetes Care',
    tags: ['HbA1c', 'Walking', 'Endocrinology'],
    summary: 'A 15-20 minute walk taken 20 minutes after meals stimulates skeletal muscle contractions, moving GLUT-4 transporters to cell surfaces to soak up glucose without requiring extra insulin.',
    keyTakeaways: [
      'Postprandial (post-meal) walking significantly blunts early glucose spikes.',
      'Gentle consistent walking avoids the risk of exercise-induced hypoglycemia in medicated diabetics.',
      'Evening walks also improve nocturnal growth hormone release and deep sleep quality.'
    ],
    citation: 'Diabetes Care Journal (ADA) & RSSDI Guidelines'
  },
  {
    id: 'art-3',
    title: 'The 45-Minute Empty Stomach Rule for Levothyroxine Absorption',
    author: 'Dr. Rajeshwari Nair (Endocrinologist)',
    readTime: '3 min read',
    category: 'Thyroid & Hormones',
    tags: ['TSH', 'Thyroid', 'Medication Timing'],
    summary: 'Synthetic thyroxine is notoriously sensitive to gastric pH and binding agents. Calcium, iron, dietary fiber, and polyphenols in morning tea/coffee reduce its bioabsorption by up to 40%.',
    keyTakeaways: [
      'Take your thyroid pill with a full glass of plain water upon waking.',
      'Wait at least 45-60 minutes before morning chai, coffee, milk, or breakfast.',
      'Separate calcium, iron, or antacid supplements by at least 4 hours.'
    ],
    citation: 'American Thyroid Association (ATA) Clinical Protocols'
  }
];
