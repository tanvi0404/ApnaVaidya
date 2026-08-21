export const COMMON_SYMPTOMS_LIST = [
  { id: 'sym-fatigue', label: 'Persistent Fatigue / Lethargy', category: 'General' },
  { id: 'sym-headache', label: 'Tension / Throbbing Headache', category: 'Neurological' },
  { id: 'sym-dizzy', label: 'Dizziness / Lightheadedness', category: 'Neurological' },
  { id: 'sym-cough', label: 'Dry or Productive Cough', category: 'Respiratory' },
  { id: 'sym-chest-mild', label: 'Mild Chest Discomfort / Heartburn', category: 'Cardiovascular' },
  { id: 'sym-thirst', label: 'Excessive Thirst & Frequent Urination', category: 'Metabolic' },
  { id: 'sym-joint', label: 'Joint Stiffness / Knee Ache', category: 'Musculoskeletal' },
  { id: 'sym-insomnia', label: 'Difficulty Falling or Staying Asleep', category: 'Wellness' }
];

export const SYMPTOM_EVALUATIONS = {
  'sym-fatigue': {
    title: 'Persistent Daytime Fatigue Evaluation',
    urgencyLevel: 'NON_URGENT',
    urgencyLabel: 'Schedule Non-Urgent Doctor Consultation',
    summary: 'Fatigue can stem from metabolic factors (such as thyroid slowdown or glycemic swings), micronutrient gaps (Vitamin D, B12, or Hemoglobin), or suboptimal sleep hygiene.',
    potentialCorrelations: [
      'Thyroid Profile (TSH): Check for subclinical hypothyroidism.',
      'Complete Blood Count: Verify Hemoglobin levels for anemia.',
      'Vitamin D & B12 Levels: Vital for cellular mitochondria energy.'
    ],
    homeCareTips: [
      'Ensure 7.5 - 8 hours of consistent nightly sleep.',
      'Hydrate with at least 2.5L of water throughout the day.',
      'Incorporate 20 minutes of morning natural sunlight exposure.'
    ],
    doctorQuestions: [
      'Should we run a comprehensive CBC and Thyroid/B12 panel?',
      'Could my current medication regimen be contributing to lethargy?'
    ]
  },
  'sym-chest-mild': {
    title: 'Chest Discomfort / Heartburn Assessment',
    urgencyLevel: 'REQUIRES_TRIAGE',
    urgencyLabel: 'Monitor Closely / Emergency Red-Flag Triage',
    summary: 'Chest sensations must always be evaluated cautiously. If accompanied by radiating pain to the left arm, jaw, crushing pressure, cold sweats, or shortness of breath, this is an EMERGENCY requiring immediate 108 dispatch.',
    potentialCorrelations: [
      'Gastroesophageal Reflux (Acid Peptic Disease)',
      'Lipid Profile & Coronary Circulation Check'
    ],
    homeCareTips: [
      'Avoid lying down immediately after meals; maintain a 3-hour gap before bedtime.',
      'Reduce spicy, deep-fried foods and caffeinated stimulants.'
    ],
    doctorQuestions: [
      'Is an ECG and 2D-Echocardiogram or TMT exercise test indicated?'
    ]
  }
};
