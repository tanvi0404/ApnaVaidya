export const HEALTH_VAULT_ITEMS = [
  {
    id: 'doc-vault-1',
    profileId: 'user-arjun',
    title: 'Comprehensive Lipid Profile Report',
    category: 'Lab Report',
    date: '12 Aug 2026',
    issuer: 'Thyrocare Diagnostics',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    status: 'Verified & Encrypted',
    tags: ['Lipids', 'Cholesterol', 'Blood Test']
  },
  {
    id: 'doc-vault-2',
    profileId: 'user-arjun',
    title: 'Annual Cardiology Prescription',
    category: 'Prescription',
    date: '15 Jan 2026',
    issuer: 'Dr. Arvind Mehta (Max Healthcare)',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    status: 'Active',
    tags: ['Cardiology', 'Omega-3', 'Prescription']
  },
  {
    id: 'doc-vault-3',
    profileId: 'user-arjun',
    title: 'Star Health Optima Family Insurance Policy',
    category: 'Insurance Policy',
    date: '01 Apr 2026',
    issuer: 'Star Health & Allied Insurance',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    status: 'Active (₹15 Lakh Sum Insured)',
    tags: ['Insurance', 'Policy', 'Cashless TPA']
  },
  {
    id: 'doc-vault-4',
    profileId: 'user-rajesh',
    title: 'HbA1c & Fasting Glucose Report',
    category: 'Lab Report',
    date: '10 Aug 2026',
    issuer: 'Dr. Lal PathLabs',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    status: 'Verified & Encrypted',
    tags: ['Diabetes', 'HbA1c', 'Endocrinology']
  },
  {
    id: 'doc-vault-5',
    profileId: 'user-rajesh',
    title: 'Hospital Discharge Summary (Mild Bronchitis)',
    category: 'Discharge Summary',
    date: '12 Nov 2025',
    issuer: 'Fortis Memorial Hospital',
    fileSize: '3.2 MB',
    fileType: 'PDF',
    status: 'Archived',
    tags: ['Hospital', 'Discharge', 'Pulmonology']
  },
  {
    id: 'doc-vault-6',
    profileId: 'user-sunita',
    title: 'Thyroid & Vitamin D3 Investigation',
    category: 'Lab Report',
    date: '05 Aug 2026',
    issuer: 'Max Pathology Labs',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    status: 'Verified & Encrypted',
    tags: ['Thyroid', 'TSH', 'Vitamin D']
  }
];

export const FAMILY_HEREDITARY_HISTORY = [
  {
    condition: 'Type 2 Diabetes Mellitus',
    relation: 'Father & Paternal Grandfather',
    ageOfOnset: '52 years',
    aiContextImpact: 'AI lowers fasting glucose alert threshold to 95 mg/dL due to first-degree hereditary risk.',
    riskLevel: 'Moderate to High'
  },
  {
    condition: 'Premature Coronary Artery Disease (CAD)',
    relation: 'Paternal Grandfather',
    ageOfOnset: '58 years',
    aiContextImpact: 'AI recommends annual lipid screening and maintaining LDL < 100 mg/dL rather than standard 130 mg/dL.',
    riskLevel: 'Moderate'
  },
  {
    condition: 'Hypothyroidism (Hashimoto Pattern)',
    relation: 'Mother',
    ageOfOnset: '48 years',
    aiContextImpact: 'AI suggests annual TSH screening if fatigue or cold intolerance symptoms are reported.',
    riskLevel: 'Mild'
  }
];

export const VACCINATION_RECORDS = {
  'user-arjun': [
    {
      id: 'vac-1',
      name: 'Annual Influenza (Quadrivalent Flu Shot)',
      dueDate: '15 Oct 2026',
      status: 'UPCOMING',
      lastGiven: '20 Oct 2025',
      dose: '0.5 mL IM',
      notes: 'Recommended annually before winter season.'
    },
    {
      id: 'vac-2',
      name: 'Tetanus, Diphtheria, Pertussis (Tdap Booster)',
      dueDate: '10 Nov 2028',
      status: 'COMPLETED',
      lastGiven: '10 Nov 2018',
      dose: 'Single Booster Dose',
      notes: '10-year booster schedule active and protected.'
    },
    {
      id: 'vac-3',
      name: 'Hepatitis B (3-Dose Series)',
      dueDate: 'Lifelong Immunity',
      status: 'COMPLETED',
      lastGiven: '15 Mar 2016',
      dose: '3 Doses Complete',
      notes: 'Anti-HBs antibody titer verified (> 100 mIU/mL).'
    }
  ],
  'user-rajesh': [
    {
      id: 'vac-4',
      name: 'Pneumococcal Conjugate (PCV13 / PPSV23)',
      dueDate: 'Lifelong Coverage',
      status: 'COMPLETED',
      lastGiven: '12 Jan 2024',
      dose: 'PPSV23 Dose 1',
      notes: 'Protects senior lungs against pneumococcal pneumonia.'
    },
    {
      id: 'vac-5',
      name: 'Herpes Zoster (Shingles Vaccine - Shingrix)',
      dueDate: '05 Sep 2026',
      status: 'DUE',
      lastGiven: 'Never Taken',
      dose: '2-Dose Series',
      notes: 'Recommended for adults 50+ to prevent shingles neuralgia.'
    }
  ]
};
