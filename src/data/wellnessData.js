export const WOMENS_HEALTH_DATA = {
  'user-sunita': {
    stage: 'Post-Menopausal Vitality & Bone Health',
    cycleLengthDays: 0,
    periodDurationDays: 0,
    lastPeriodDate: 'Menopause Established (52y)',
    nextPeriodDate: 'N/A (Post-Menopause Phase)',
    fertileWindow: 'N/A',
    ovulationDate: 'N/A',
    currentPhase: 'Post-Menopausal Hormone Balance',
    phaseDescription: 'Focus on bone mineral density retention (DEXA monitoring), cardiovascular lipid protection, and thyroid T3/T4 metabolic equilibrium.',
    recommendedFoods: [
      'Calcium-Rich Low-Fat Yogurt',
      'Sesame Seeds (Til) & Flaxseeds',
      'Steamed Spinach & Fenugreek (Methi)',
      'Walnuts & Almonds',
      'Ragi / Finger Millet'
    ],
    commonSymptoms: [
      'Joint Stiffness',
      'Mild Cold Sensitivity',
      'Sleep Disruption',
      'Fatigue',
      'Dry Skin',
      'Mood Fluctuations'
    ],
    hormonePanels: [
      { name: 'TSH (Thyroid Stimulating Hormone)', value: '5.85 uIU/mL', status: 'Subclinical High', notes: 'Titrate Thyroxine dose under endocrinologist guidance.' },
      { name: 'Serum Calcium', value: '9.4 mg/dL', status: 'Optimal', notes: 'Within normal reference range (8.8 - 10.2 mg/dL).' },
      { name: 'Serum 25-OH Vitamin D', value: '24 ng/mL', status: 'Mild Deficiency', notes: 'Maintain weekly Cholecalciferol 60,000 IU supplementation.' }
    ]
  },
  'user-ananya': {
    stage: 'Pediatric Growth & Pre-Pubertal Wellness',
    cycleLengthDays: 0,
    periodDurationDays: 0,
    lastPeriodDate: 'Pre-Menarche (Pediatric)',
    nextPeriodDate: 'N/A',
    fertileWindow: 'N/A',
    ovulationDate: 'N/A',
    currentPhase: 'Pediatric Growth & Immune Foundation',
    phaseDescription: 'Growth milestone monitoring, childhood immunity, and balanced nutrition free from peanut/shellfish allergens.',
    recommendedFoods: [
      'Fortified Milk & Cottage Cheese (Paneer)',
      'Moong Dal & Sprouted Lentils',
      'Pomegranate & Citrus Fruits',
      'Roasted Makhana (Foxnuts)',
      'Fresh Green Vegetables'
    ],
    commonSymptoms: [
      'Seasonal Allergic Sneezing',
      'Mild Fatigue after Sports',
      'Occasional Growing Aches'
    ],
    hormonePanels: [
      { name: 'Growth & Pediatric Biomarkers', value: 'Optimal', status: 'Normal', notes: 'Pediatric growth velocity steady at 50th percentile.' }
    ]
  },
  'default': {
    stage: 'Reproductive Hormonal Rhythm',
    cycleLengthDays: 28,
    periodDurationDays: 5,
    lastPeriodDate: '01 Aug 2026',
    nextPeriodDate: '29 Aug 2026',
    fertileWindow: '11 Aug - 16 Aug 2026',
    ovulationDate: '14 Aug 2026',
    currentPhase: 'Luteal Phase (Day 15 of 28)',
    phaseDescription: 'Progesterone levels rise to prepare the uterine lining. Mild mood sensitivity or fluid retention may occur.',
    recommendedFoods: [
      'Warm Soups & Lentils',
      'Pumpkin & Sesame Seeds',
      'Dark Leafy Greens (Palak/Methi)',
      'Avocado & Cold-Pressed Oils',
      'Chamomile / Ginger Tea'
    ],
    commonSymptoms: [
      'Mild Cramps',
      'Bloating',
      'Mood Sensitivity',
      'Breast Tenderness',
      'Fatigue',
      'Headache',
      'Sugar Cravings'
    ],
    hormonePanels: [
      { name: 'TSH (Thyroid)', value: '2.4 uIU/mL', status: 'Optimal', notes: 'Normal thyroid axis supports regular ovulation.' },
      { name: 'Prolactin', value: '14.2 ng/mL', status: 'Normal', notes: 'Within baseline reference (4.8 - 23.3 ng/mL).' },
      { name: 'LH / FSH Ratio', value: '1.1 : 1', status: 'Balanced', notes: 'No indicator of polycystic ovarian morphology (PCOS).' }
    ]
  }
};

export const SLEEP_LOGS_DATA = [
  { day: 'Mon', duration: 7.6, quality: 'Optimal', deepSleep: '1.8h (24%)', score: 88 },
  { day: 'Tue', duration: 7.2, quality: 'Good', deepSleep: '1.5h (21%)', score: 82 },
  { day: 'Wed', duration: 6.8, quality: 'Fair', deepSleep: '1.2h (18%)', score: 74 },
  { day: 'Thu', duration: 7.8, quality: 'Optimal', deepSleep: '1.9h (25%)', score: 91 },
  { day: 'Fri', duration: 7.4, quality: 'Good', deepSleep: '1.6h (22%)', score: 85 },
  { day: 'Sat', duration: 8.2, quality: 'Optimal', deepSleep: '2.1h (26%)', score: 94 },
  { day: 'Sun', duration: 7.5, quality: 'Optimal', deepSleep: '1.7h (23%)', score: 86 }
];
