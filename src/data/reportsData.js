export const PRELOADED_REPORTS = [
  {
    id: 'rep-lipid-01',
    profileId: 'user-arjun',
    title: 'Comprehensive Lipid Profile',
    category: 'Cardiovascular',
    labName: 'Thyrocare Diagnostics & Wellness Lab',
    testDate: '12 Aug 2026',
    uploadDate: '14 Aug 2026',
    status: 'Analyzed',
    badgeCount: '2 Elevated',
    summary: {
      overallStatus: 'Mild Dyslipidemia Flagged',
      keyFindings: [
        'Total Cholesterol and LDL ("bad cholesterol") are moderately elevated above ideal limits.',
        'Triglycerides are within the normal reference boundary.',
        'HDL ("good cholesterol") is healthy, providing protective cardiovascular support.'
      ],
      aiRecommendation: 'Consider reducing saturated fats and ultra-processed snacks. Incorporate soluble fiber (oats, flaxseeds) and regular aerobic cardio. Discuss with your physician at your next routine checkup.',
      normalCount: 4,
      abnormalCount: 2
    },
    parameters: [
      {
        id: 'param-tc',
        name: 'Total Cholesterol',
        category: 'Lipids',
        value: 228,
        unit: 'mg/dL',
        minNormal: 125,
        maxNormal: 200,
        status: 'HIGH',
        clinicalMeaning: 'Total amount of cholesterol circulating in your bloodstream.',
        plainExplanation: 'Your total cholesterol is slightly above the recommended ceiling of 200 mg/dL. This is primarily driven by your elevated LDL.',
        lifestyleTip: 'Include more plant sterols, almonds, walnuts, and oats. Reduce fried snacks.',
        doctorQuestion: 'Should we re-test in 3 months with dietary adjustments before considering lipid-lowering therapy?',
        sourceCitation: 'NCEP ATP III Guidelines / ICMR Cardiovascular Protocols 2024'
      },
      {
        id: 'param-ldl',
        name: 'LDL Cholesterol (Direct)',
        category: 'Lipids',
        value: 146,
        unit: 'mg/dL',
        minNormal: 50,
        maxNormal: 100,
        status: 'HIGH',
        clinicalMeaning: 'Low-Density Lipoprotein, often called "bad cholesterol" because it can form arterial plaque.',
        plainExplanation: 'Your LDL level is elevated at 146 mg/dL. Lowering LDL helps maintain clear, flexible blood vessels.',
        lifestyleTip: 'Engage in 150 minutes of moderate aerobic activity weekly (brisk walking, cycling, swimming).',
        doctorQuestion: 'What is my personal target LDL based on my age, lifestyle, and family cardiovascular history?',
        sourceCitation: 'American College of Cardiology (ACC/AHA) & ICMR Dyslipidemia Management'
      },
      {
        id: 'param-hdl',
        name: 'HDL Cholesterol',
        category: 'Lipids',
        value: 52,
        unit: 'mg/dL',
        minNormal: 40,
        maxNormal: 60,
        status: 'NORMAL',
        clinicalMeaning: 'High-Density Lipoprotein ("good cholesterol") which transports excess cholesterol to the liver for disposal.',
        plainExplanation: 'Your HDL is at a good, protective level of 52 mg/dL. Higher HDL helps clear arterial cholesterol.',
        lifestyleTip: 'Continue regular physical exercise and extra virgin olive oil consumption to sustain HDL levels.',
        doctorQuestion: 'How can I continue to optimize my HDL through functional nutrition?',
        sourceCitation: 'AHA Heart Health Standards'
      },
      {
        id: 'param-trig',
        name: 'Triglycerides',
        category: 'Lipids',
        value: 142,
        unit: 'mg/dL',
        minNormal: 0,
        maxNormal: 150,
        status: 'NORMAL',
        clinicalMeaning: 'A type of fat (lipid) found in your blood used for energy between meals.',
        plainExplanation: 'Your triglycerides are well within the safe healthy range (< 150 mg/dL).',
        lifestyleTip: 'Keep refined sugar and high-fructose beverages minimal to prevent triglyceride spikes.',
        doctorQuestion: 'Is my triglyceride-to-HDL ratio within optimal metabolic bounds?',
        sourceCitation: 'Endocrine Society Clinical Practice Guidelines'
      },
      {
        id: 'param-vldl',
        name: 'VLDL Cholesterol',
        category: 'Lipids',
        value: 28.4,
        unit: 'mg/dL',
        minNormal: 5,
        maxNormal: 30,
        status: 'NORMAL',
        clinicalMeaning: 'Very Low-Density Lipoprotein, contains mostly triglycerides.',
        plainExplanation: 'VLDL level is normal and balanced.',
        lifestyleTip: 'Maintain balanced carbohydrate intake.',
        doctorQuestion: 'No specific questions required for normal VLDL.',
        sourceCitation: 'Clinical Lipidology Consensus'
      },
      {
        id: 'param-ratio',
        name: 'Total Chol / HDL Ratio',
        category: 'Ratios',
        value: 4.38,
        unit: 'Ratio',
        minNormal: 3.0,
        maxNormal: 5.0,
        status: 'NORMAL',
        clinicalMeaning: 'An indicator of cardiovascular risk balance.',
        plainExplanation: 'Your ratio of 4.38 is within acceptable risk limits, though lower is generally better.',
        lifestyleTip: 'Aerobic fitness improves this ratio by raising HDL and lowering total cholesterol.',
        doctorQuestion: 'What ratio benchmark should I aim for over the next 6 months?',
        sourceCitation: 'Framingham Heart Study Risk Stratification'
      }
    ]
  },
  {
    id: 'rep-diabetes-02',
    profileId: 'user-rajesh',
    title: 'Diabetic Glycemic Profile (HbA1c & Fasting)',
    category: 'Endocrinology',
    labName: 'Dr. Lal PathLabs Central Reference',
    testDate: '10 Aug 2026',
    uploadDate: '11 Aug 2026',
    status: 'Analyzed',
    badgeCount: '2 Elevated',
    summary: {
      overallStatus: 'Elevated Glycemic Marker',
      keyFindings: [
        'HbA1c is 7.4%, reflecting higher than targeted 3-month average blood glucose.',
        'Fasting Blood Glucose is 148 mg/dL, elevated above normal fasting target (70-100 mg/dL).',
        'Estimated Average Glucose (eAG) is approx 166 mg/dL.'
      ],
      aiRecommendation: 'Review your medication adherence and evening carbohydrate portions with your diabetologist. Ensure daily 30-minute post-meal walks.',
      normalCount: 1,
      abnormalCount: 2
    },
    parameters: [
      {
        id: 'param-hba1c',
        name: 'HbA1c (Glycosylated Hemoglobin)',
        category: 'Glycemic',
        value: 7.4,
        unit: '%',
        minNormal: 4.0,
        maxNormal: 5.6,
        status: 'HIGH',
        clinicalMeaning: 'Percentage of hemoglobin coated with glucose, reflecting average blood sugar over past 90 days.',
        plainExplanation: 'Your HbA1c is 7.4%. For diagnosed individuals, doctors typically aim for below 7.0% (or personalized target).',
        lifestyleTip: 'Focus on low-glycemic Indian foods like methi roti, bitter gourd (karela), dalia, and whole pulses.',
        doctorQuestion: 'Do we need to adjust my Metformin dose or add another agent to reach my < 7.0% goal?',
        sourceCitation: 'ADA Standards of Medical Care in Diabetes / RSSDI Guidelines 2024'
      },
      {
        id: 'param-fbg',
        name: 'Fasting Blood Sugar (FBS)',
        category: 'Glycemic',
        value: 148,
        unit: 'mg/dL',
        minNormal: 70,
        maxNormal: 100,
        status: 'HIGH',
        clinicalMeaning: 'Glucose level in blood after an 8-12 hour overnight fast.',
        plainExplanation: 'Fasting glucose is elevated at 148 mg/dL (target for managed diabetics is often 80-130 mg/dL).',
        lifestyleTip: 'Avoid late-night carbohydrate-heavy dinners. Have a lighter dinner by 8:00 PM.',
        doctorQuestion: 'Is the dawn phenomenon contributing to my elevated fasting morning readings?',
        sourceCitation: 'ADA Guidelines & Endocrine Protocols'
      },
      {
        id: 'param-eag',
        name: 'Estimated Average Glucose (eAG)',
        category: 'Glycemic',
        value: 166,
        unit: 'mg/dL',
        minNormal: 70,
        maxNormal: 114,
        status: 'HIGH',
        clinicalMeaning: 'Mathematical translation of your HbA1c into daily blood glucose values.',
        plainExplanation: 'Your blood sugar has averaged approximately 166 mg/dL day and night over the past 3 months.',
        lifestyleTip: 'Monitor pre-lunch and pre-dinner readings twice weekly to understand glucose spikes.',
        doctorQuestion: 'Would a Continuous Glucose Monitor (CGM) sensor be helpful for 2 weeks?',
        sourceCitation: 'AACC & ADA Clinical Translation Metrics'
      }
    ]
  },
  {
    id: 'rep-thyroid-03',
    profileId: 'user-sunita',
    title: 'Thyroid Function Panel (TSH, T3, T4)',
    category: 'Endocrinology',
    labName: 'Max Healthcare Pathology Services',
    testDate: '05 Aug 2026',
    uploadDate: '06 Aug 2026',
    status: 'Analyzed',
    badgeCount: '1 Borderline High',
    summary: {
      overallStatus: 'Subclinical Hypothyroidism Trend',
      keyFindings: [
        'TSH is mildly elevated at 5.85 uIU/mL (reference 0.40 - 4.50).',
        'Free T3 and Free T4 levels are currently within normal baseline ranges.'
      ],
      aiRecommendation: 'Take Thyroxine medication strictly on an empty stomach with plain water, 45 minutes before morning tea or breakfast.',
      normalCount: 2,
      abnormalCount: 1
    },
    parameters: [
      {
        id: 'param-tsh',
        name: 'TSH (Thyroid Stimulating Hormone)',
        category: 'Thyroid',
        value: 5.85,
        unit: 'uIU/mL',
        minNormal: 0.40,
        maxNormal: 4.50,
        status: 'HIGH',
        clinicalMeaning: 'Hormone produced by the pituitary gland to stimulate your thyroid.',
        plainExplanation: 'TSH is slightly high at 5.85 uIU/mL, which suggests your thyroid is working a bit harder to produce adequate hormone.',
        lifestyleTip: 'Ensure adequate selenium and zinc from sunflower seeds, eggs, and legumes. Avoid taking calcium/iron supplements within 4 hours of thyroid medication.',
        doctorQuestion: 'Should we adjust my Levothyroxine dosage from 50mcg to 62.5mcg?',
        sourceCitation: 'American Thyroid Association (ATA) & Indian Thyroid Society Guidelines'
      },
      {
        id: 'param-ft4',
        name: 'Free T4 (Thyroxine)',
        category: 'Thyroid',
        value: 1.15,
        unit: 'ng/dL',
        minNormal: 0.80,
        maxNormal: 1.80,
        status: 'NORMAL',
        clinicalMeaning: 'Active circulating form of thyroid hormone.',
        plainExplanation: 'Free T4 is at a normal level of 1.15 ng/dL, indicating adequate cellular supply.',
        lifestyleTip: 'Maintain consistent sleep patterns to support endocrine health.',
        doctorQuestion: 'Is my Free T4 sufficient to prevent fatigue symptoms?',
        sourceCitation: 'ATA Guidelines'
      },
      {
        id: 'param-ft3',
        name: 'Free T3 (Triiodothyronine)',
        category: 'Thyroid',
        value: 3.10,
        unit: 'pg/mL',
        minNormal: 2.30,
        maxNormal: 4.20,
        status: 'NORMAL',
        clinicalMeaning: 'Most potent thyroid hormone affecting metabolic rate.',
        plainExplanation: 'Free T3 is in the healthy zone at 3.10 pg/mL.',
        lifestyleTip: 'Stay physically active with gentle joint-friendly yoga.',
        doctorQuestion: 'No adjustments required for T3.',
        sourceCitation: 'Indian Thyroid Society Protocols'
      }
    ]
  },
  {
    id: 'rep-cbc-04',
    profileId: 'user-arjun',
    title: 'Complete Blood Count (CBC) with ESR',
    category: 'Hematology',
    labName: 'Apollo Diagnostics Centre',
    testDate: '15 Jul 2026',
    uploadDate: '16 Jul 2026',
    status: 'Analyzed',
    badgeCount: 'All Normal',
    summary: {
      overallStatus: 'Optimal Hematologic Profile',
      keyFindings: [
        'Hemoglobin is robust at 15.2 g/dL.',
        'White Blood Cell count and platelet count are in ideal physiological ranges.',
        'No signs of acute inflammation or infection.'
      ],
      aiRecommendation: 'Excellent blood profile. Continue balanced iron and folate-rich nutrition.',
      normalCount: 6,
      abnormalCount: 0
    },
    parameters: [
      {
        id: 'param-hb',
        name: 'Hemoglobin (Hb)',
        category: 'RBC Indices',
        value: 15.2,
        unit: 'g/dL',
        minNormal: 13.0,
        maxNormal: 17.0,
        status: 'NORMAL',
        clinicalMeaning: 'Iron-containing protein in red blood cells that carries oxygen throughout your body.',
        plainExplanation: 'Your hemoglobin is at an optimal 15.2 g/dL, supporting energetic cellular oxygenation.',
        lifestyleTip: 'Maintain dietary iron from spinach, lentils, beetroot, and vitamin C for optimal absorption.',
        doctorQuestion: 'No questions needed; level is optimal.',
        sourceCitation: 'WHO Hematology Guidelines & AIIMS Clinical Pathology'
      },
      {
        id: 'param-wbc',
        name: 'Total Leukocyte Count (WBC)',
        category: 'Immune Cells',
        value: 6800,
        unit: '/cumm',
        minNormal: 4000,
        maxNormal: 11000,
        status: 'NORMAL',
        clinicalMeaning: 'White blood cells that defend the body against infections.',
        plainExplanation: 'WBC count of 6,800 is right in the middle of normal range.',
        lifestyleTip: 'Consistent sleep and moderate exercise keep immune surveillance sharp.',
        doctorQuestion: 'Normal immune baseline.',
        sourceCitation: 'Clinical Hematology Reference Manual'
      },
      {
        id: 'param-plt',
        name: 'Platelet Count',
        category: 'Clotting',
        value: 240000,
        unit: '/cumm',
        minNormal: 150000,
        maxNormal: 450000,
        status: 'NORMAL',
        clinicalMeaning: 'Blood cell fragments essential for healthy blood clotting and wound healing.',
        plainExplanation: 'Platelets are healthy and plentiful at 2.4 Lakhs.',
        lifestyleTip: 'Stay well-hydrated.',
        doctorQuestion: 'Optimal clotting profile.',
        sourceCitation: 'ICMR Hematology Standards'
      },
      {
        id: 'param-rbc',
        name: 'Total RBC Count',
        category: 'RBC Indices',
        value: 5.1,
        unit: 'mil/cumm',
        minNormal: 4.5,
        maxNormal: 5.9,
        status: 'NORMAL',
        clinicalMeaning: 'Number of red blood cells per volume of blood.',
        plainExplanation: 'Red cell count is healthy and balanced.',
        lifestyleTip: 'Stay active.',
        doctorQuestion: 'Normal RBC count.',
        sourceCitation: 'AIIMS Protocols'
      }
    ]
  },
  {
    id: 'rep-kft-05',
    profileId: 'user-rajesh',
    title: 'Kidney Function Test (KFT / Renal Panel)',
    category: 'Nephrology',
    labName: 'Thyrocare Laboratories',
    testDate: '18 Jun 2026',
    uploadDate: '20 Jun 2026',
    status: 'Analyzed',
    badgeCount: 'Borderline',
    summary: {
      overallStatus: 'Stable Renal Filtration',
      keyFindings: [
        'Serum Creatinine is 1.18 mg/dL (Upper limit 1.20 mg/dL).',
        'eGFR is 78 mL/min/1.73m², reflecting mild age-related reduction.',
        'Blood Urea is 34 mg/dL (Normal: 15 - 45 mg/dL).'
      ],
      aiRecommendation: 'Maintain adequate daily hydration (2.5L). Continue strict blood pressure and glucose management to safeguard kidney microvasculature.',
      normalCount: 3,
      abnormalCount: 0
    },
    parameters: [
      {
        id: 'param-creat',
        name: 'Serum Creatinine',
        category: 'Renal',
        value: 1.18,
        unit: 'mg/dL',
        minNormal: 0.70,
        maxNormal: 1.20,
        status: 'NORMAL',
        clinicalMeaning: 'Waste product from muscle metabolism filtered by the kidneys.',
        plainExplanation: 'Creatinine is 1.18 mg/dL, within normal range but near the upper boundary for age.',
        lifestyleTip: 'Avoid taking NSAID pain relievers (like Ibuprofen) without doctor guidance. Drink plenty of water.',
        doctorQuestion: 'Should we perform a spot urine albumin-to-creatinine ratio (uACR) test at our next visit?',
        sourceCitation: 'KDIGO Kidney Disease Clinical Practice Guidelines'
      },
      {
        id: 'param-egfr',
        name: 'Estimated GFR (eGFR)',
        category: 'Renal',
        value: 78,
        unit: 'mL/min/1.73m²',
        minNormal: 60,
        maxNormal: 120,
        status: 'NORMAL',
        clinicalMeaning: 'Measure of how efficiently your kidneys filter blood.',
        plainExplanation: 'eGFR of 78 indicates good functioning kidneys (> 60 is generally healthy for older adults).',
        lifestyleTip: 'Keep blood pressure below 130/80 mmHg to preserve filtration rate.',
        doctorQuestion: 'Is my eGFR stable compared to last year?',
        sourceCitation: 'KDIGO & National Kidney Foundation'
      },
      {
        id: 'param-urea',
        name: 'Blood Urea',
        category: 'Renal',
        value: 34,
        unit: 'mg/dL',
        minNormal: 15,
        maxNormal: 45,
        status: 'NORMAL',
        clinicalMeaning: 'Byproduct of protein breakdown handled by the kidneys.',
        plainExplanation: 'Blood urea is balanced and normal.',
        lifestyleTip: 'Eat moderate, high-quality proteins.',
        doctorQuestion: 'Normal urea parameters.',
        sourceCitation: 'ICMR Clinical Chemistry Protocols'
      }
    ]
  }
];

export const SAMPLE_REPORT_PRESETS = [
  {
    name: 'Comprehensive Lipid Profile',
    category: 'Cardiovascular',
    description: 'Total Chol (228 mg/dL), LDL (146 mg/dL), HDL (52 mg/dL), Triglycerides (142 mg/dL)',
    date: '12 Aug 2026',
    parametersCount: 6,
    abnormalCount: 2,
    fileType: 'PDF (2.4 MB)'
  },
  {
    name: 'Diabetic HbA1c & Fasting Glucose',
    category: 'Endocrinology',
    description: 'HbA1c (7.4%), Fasting Glucose (148 mg/dL), eAG (166 mg/dL)',
    date: '10 Aug 2026',
    parametersCount: 3,
    abnormalCount: 2,
    fileType: 'PDF (1.8 MB)'
  },
  {
    name: 'Thyroid Panel (TSH, FT3, FT4)',
    category: 'Endocrinology',
    description: 'TSH (5.85 uIU/mL), Free T4 (1.15 ng/dL), Free T3 (3.10 pg/mL)',
    date: '05 Aug 2026',
    parametersCount: 3,
    abnormalCount: 1,
    fileType: 'Scan/JPG (3.1 MB)'
  },
  {
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    description: 'Hemoglobin (15.2 g/dL), WBC (6,800), Platelets (2.4 Lakhs)',
    date: '15 Jul 2026',
    parametersCount: 4,
    abnormalCount: 0,
    fileType: 'PDF (1.2 MB)'
  },
  {
    name: 'Kidney Function Test (KFT)',
    category: 'Nephrology',
    description: 'Serum Creatinine (1.18 mg/dL), eGFR (78 mL/min), Blood Urea (34 mg/dL)',
    date: '18 Jun 2026',
    parametersCount: 3,
    abnormalCount: 0,
    fileType: 'PDF (1.5 MB)'
  }
];
