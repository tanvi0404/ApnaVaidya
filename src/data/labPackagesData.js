export const LAB_PACKAGES_DATA = [
  {
    id: 'pkg-heart-followup',
    title: 'Lipid & Cardiometabolic 3-Month Follow-Up',
    recommendedFor: 'user-arjun',
    reason: 'Elevated LDL (146 mg/dL) from August 2026 test warrants 90-day progress evaluation.',
    urgency: 'RECOMMENDED (Due in 60 Days)',
    includedParametersCount: 8,
    includedParameters: [
      'Total Cholesterol', 'LDL Cholesterol (Direct)', 'HDL Cholesterol', 
      'Triglycerides', 'VLDL', 'Non-HDL Cholesterol', 'hs-CRP (Cardiac Inflammation)', 'ApoB'
    ],
    fastingRequired: true,
    fastingHours: '10-12 Hours Fasting',
    popularBadge: 'Top AI Recommendation',
    labPrices: [
      { labName: 'Thyrocare Technologies', price: '₹650', originalPrice: '₹1,400', rating: 4.8, nabl: true, turnaround: '24 Hours' },
      { labName: 'Dr. Lal PathLabs', price: '₹850', originalPrice: '₹1,600', rating: 4.9, nabl: true, turnaround: '18 Hours' },
      { labName: 'Apollo Diagnostics', price: '₹799', originalPrice: '₹1,500', rating: 4.8, nabl: true, turnaround: '24 Hours' },
      { labName: 'Metropolis Healthcare', price: '₹899', originalPrice: '₹1,750', rating: 4.7, nabl: true, turnaround: '24 Hours' }
    ]
  },
  {
    id: 'pkg-diabetes-comprehensive',
    title: 'Comprehensive Diabetic Glycemic & Renal Panel',
    recommendedFor: 'user-rajesh',
    reason: 'Quarterly monitoring of glycemic control (HbA1c) and microvascular kidney protection.',
    urgency: 'DUE NOW',
    includedParametersCount: 14,
    includedParameters: [
      'HbA1c (Glycosylated Hemoglobin)', 'Average Estimated Glucose (eAG)', 'Fasting Blood Sugar (FBS)', 
      'Postprandial Blood Sugar (PPBS)', 'Serum Creatinine', 'eGFR', 'Blood Urea Nitrogen', 
      'Urine Microalbumin / Creatinine Ratio (ACR)', 'Serum Electrolytes (Na, K, Cl)'
    ],
    fastingRequired: true,
    fastingHours: '8-10 Hours Fasting',
    popularBadge: 'Essential Senior Care',
    labPrices: [
      { labName: 'Dr. Lal PathLabs', price: '₹1,150', originalPrice: '₹2,200', rating: 4.9, nabl: true, turnaround: '18 Hours' },
      { labName: 'Thyrocare Technologies', price: '₹950', originalPrice: '₹2,000', rating: 4.8, nabl: true, turnaround: '24 Hours' },
      { labName: 'Apollo Diagnostics', price: '₹1,099', originalPrice: '₹2,100', rating: 4.8, nabl: true, turnaround: '24 Hours' }
    ]
  },
  {
    id: 'pkg-full-body-executive',
    title: 'ApnaVaidya Complete Executive Full Body Checkup',
    recommendedFor: 'user-arjun',
    reason: 'Comprehensive annual wellness screen covering all vital organ systems.',
    urgency: 'ANNUAL ROUTINE',
    includedParametersCount: 78,
    includedParameters: [
      'Complete Blood Count (CBC - 24 params)', 'Lipid Profile (8 params)', 'Liver Function Test (LFT - 12 params)', 
      'Kidney Function Test (KFT - 10 params)', 'Thyroid Panel (TSH, FT3, FT4)', 'Vitamin D3 & B12', 
      'HbA1c & Fasting Glucose', 'Complete Urine Routine (20 params)'
    ],
    fastingRequired: true,
    fastingHours: '10-12 Hours Fasting',
    popularBadge: 'Most Comprehensive (78 Tests)',
    labPrices: [
      { labName: 'Thyrocare Technologies', price: '₹1,499', originalPrice: '₹4,500', rating: 4.8, nabl: true, turnaround: '24-36 Hours' },
      { labName: 'Apollo Diagnostics', price: '₹1,899', originalPrice: '₹5,000', rating: 4.8, nabl: true, turnaround: '24 Hours' },
      { labName: 'Dr. Lal PathLabs', price: '₹2,199', originalPrice: '₹5,500', rating: 4.9, nabl: true, turnaround: '24 Hours' }
    ]
  }
];

export const WELLNESS_MILESTONES_BADGES = [
  {
    id: 'badge-1',
    title: 'Adherence Champion',
    description: 'Maintained 100% daily medication adherence for 7 consecutive days.',
    icon: 'Pill',
    earnedDate: '15 Aug 2026',
    status: 'EARNED',
    color: 'green'
  },
  {
    id: 'badge-2',
    title: 'Hydration Master',
    description: 'Met the 3.0L daily water intake goal 5 days in a row.',
    icon: 'Droplet',
    earnedDate: '14 Aug 2026',
    status: 'EARNED',
    color: 'teal'
  },
  {
    id: 'badge-3',
    title: 'Proactive Diagnostic Screener',
    description: 'Uploaded all baseline annual lab investigations to health vault.',
    icon: 'FileCheck',
    earnedDate: '12 Aug 2026',
    status: 'EARNED',
    color: 'pink'
  },
  {
    id: 'badge-4',
    title: 'Cardio Vitality Hero',
    description: 'Completed 150 minutes of Zone-2 cardio aerobic movement this week.',
    icon: 'Flame',
    earnedDate: 'In Progress (115/150m)',
    status: 'IN_PROGRESS',
    color: 'amber'
  }
];
