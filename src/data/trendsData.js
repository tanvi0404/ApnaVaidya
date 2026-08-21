export const TRENDS_DATA = {
  'user-arjun': {
    biomarkers: [
      {
        id: 'ldl',
        name: 'LDL Cholesterol',
        category: 'Lipid Profile',
        unit: 'mg/dL',
        minNormal: 50,
        maxNormal: 100,
        optimalTarget: '< 100 mg/dL',
        currentValue: 146,
        changeDelta: '-12 mg/dL (-7.6%)',
        changeType: 'improving',
        history: [
          { date: 'Nov 2025', value: 168, status: 'HIGH' },
          { date: 'Feb 2026', value: 158, status: 'HIGH' },
          { date: 'May 2026', value: 152, status: 'HIGH' },
          { date: 'Aug 2026', value: 146, status: 'HIGH' }
        ],
        aiTrendInsight: 'Your LDL has steadily decreased from 168 mg/dL to 146 mg/dL across the last 4 reports. The addition of daily oatmeal and brisk walking is having a measurable positive impact on your cardiovascular risk profile.',
        guidance: 'Continue reducing saturated fats from bakery goods and deep-fried foods. Target LDL is < 100 mg/dL.'
      },
      {
        id: 'tc',
        name: 'Total Cholesterol',
        category: 'Lipid Profile',
        unit: 'mg/dL',
        minNormal: 125,
        maxNormal: 200,
        optimalTarget: '< 200 mg/dL',
        currentValue: 228,
        changeDelta: '-14 mg/dL (-5.8%)',
        changeType: 'improving',
        history: [
          { date: 'Nov 2025', value: 252, status: 'HIGH' },
          { date: 'Feb 2026', value: 242, status: 'HIGH' },
          { date: 'May 2026', value: 236, status: 'HIGH' },
          { date: 'Aug 2026', value: 228, status: 'HIGH' }
        ],
        aiTrendInsight: 'Total cholesterol is tracking downward along with your LDL improvements. Continuing heart-healthy fats (walnuts, olive oil) will help accelerate normalization.',
        guidance: 'Aim for total cholesterol below 200 mg/dL by your next check in November.'
      },
      {
        id: 'hdl',
        name: 'HDL (Good Cholesterol)',
        category: 'Lipid Profile',
        unit: 'mg/dL',
        minNormal: 40,
        maxNormal: 60,
        optimalTarget: '> 50 mg/dL',
        currentValue: 52,
        changeDelta: '+6 mg/dL (+13.0%)',
        changeType: 'improving',
        history: [
          { date: 'Nov 2025', value: 44, status: 'NORMAL' },
          { date: 'Feb 2026', value: 46, status: 'NORMAL' },
          { date: 'May 2026', value: 49, status: 'NORMAL' },
          { date: 'Aug 2026', value: 52, status: 'NORMAL' }
        ],
        aiTrendInsight: 'HDL has risen from 44 to 52 mg/dL, indicating stronger cardiovascular protective reverse cholesterol transport.',
        guidance: 'Regular aerobic workouts and healthy fats are maintaining this upward trajectory.'
      },
      {
        id: 'hb',
        name: 'Hemoglobin (Hb)',
        category: 'CBC Hematology',
        unit: 'g/dL',
        minNormal: 13.0,
        maxNormal: 17.0,
        optimalTarget: '14.0 - 16.0 g/dL',
        currentValue: 15.2,
        changeDelta: '+0.4 g/dL',
        changeType: 'stable',
        history: [
          { date: 'Nov 2025', value: 14.8, status: 'NORMAL' },
          { date: 'Feb 2026', value: 15.0, status: 'NORMAL' },
          { date: 'May 2026', value: 14.9, status: 'NORMAL' },
          { date: 'Aug 2026', value: 15.2, status: 'NORMAL' }
        ],
        aiTrendInsight: 'Hemoglobin levels remain in the ideal physiological zone (14.8 - 15.2 g/dL) with no signs of iron deficiency or anemia.',
        guidance: 'Maintain balanced dietary iron and vitamin C.'
      },
      {
        id: 'vitd',
        name: 'Vitamin D (25-OH)',
        category: 'Vitamins & Minerals',
        unit: 'ng/mL',
        minNormal: 30,
        maxNormal: 100,
        optimalTarget: '> 40 ng/mL',
        currentValue: 38,
        changeDelta: '+16 ng/mL (+72.7%)',
        changeType: 'improving',
        history: [
          { date: 'Nov 2025', value: 18, status: 'LOW' },
          { date: 'Feb 2026', value: 24, status: 'LOW' },
          { date: 'May 2026', value: 32, status: 'NORMAL' },
          { date: 'Aug 2026', value: 38, status: 'NORMAL' }
        ],
        aiTrendInsight: 'Your Vitamin D has recovered from a deficient 18 ng/mL to a healthy 38 ng/mL following weekly supplementation and morning sun exposure.',
        guidance: 'Switch to a monthly maintenance dose as advised by your physician.'
      }
    ]
  },
  'user-rajesh': {
    biomarkers: [
      {
        id: 'hba1c',
        name: 'HbA1c (Glycosylated Hemoglobin)',
        category: 'Glycemic Control',
        unit: '%',
        minNormal: 4.0,
        maxNormal: 5.6,
        optimalTarget: '< 7.0% (Diabetic Goal)',
        currentValue: 7.4,
        changeDelta: '-0.4% (Down from 7.8%)',
        changeType: 'improving',
        history: [
          { date: 'Oct 2025', value: 8.2, status: 'HIGH' },
          { date: 'Jan 2026', value: 7.9, status: 'HIGH' },
          { date: 'Apr 2026', value: 7.8, status: 'HIGH' },
          { date: 'Aug 2026', value: 7.4, status: 'HIGH' }
        ],
        aiTrendInsight: 'HbA1c has improved from 8.2% to 7.4% over 10 months. While still above the clinical target of 7.0%, the trajectory is moving positively.',
        guidance: 'Continue strict portion control of refined carbs at dinner and maintain 30-minute post-meal walks.'
      },
      {
        id: 'fbg',
        name: 'Fasting Blood Sugar (FBS)',
        category: 'Glycemic Control',
        unit: 'mg/dL',
        minNormal: 70,
        maxNormal: 100,
        optimalTarget: '80 - 130 mg/dL',
        currentValue: 148,
        changeDelta: '-18 mg/dL',
        changeType: 'improving',
        history: [
          { date: 'Oct 2025', value: 172, status: 'HIGH' },
          { date: 'Jan 2026', value: 165, status: 'HIGH' },
          { date: 'Apr 2026', value: 156, status: 'HIGH' },
          { date: 'Aug 2026', value: 148, status: 'HIGH' }
        ],
        aiTrendInsight: 'Fasting glucose is dropping steadily. Review whether early morning dawn effect contributes to the remaining elevation.',
        guidance: 'Avoid late night heavy snacks after 8:30 PM.'
      },
      {
        id: 'creat',
        name: 'Serum Creatinine',
        category: 'Kidney Function',
        unit: 'mg/dL',
        minNormal: 0.70,
        maxNormal: 1.20,
        optimalTarget: '< 1.20 mg/dL',
        currentValue: 1.18,
        changeDelta: '+0.04 mg/dL',
        changeType: 'stable',
        history: [
          { date: 'Oct 2025', value: 1.10, status: 'NORMAL' },
          { date: 'Jan 2026', value: 1.12, status: 'NORMAL' },
          { date: 'Apr 2026', value: 1.15, status: 'NORMAL' },
          { date: 'Aug 2026', value: 1.18, status: 'NORMAL' }
        ],
        aiTrendInsight: 'Creatinine is stable near the upper normal boundary. Keeping blood pressure < 130/80 mmHg is essential to protect renal filtration.',
        guidance: 'Maintain 2.5L daily hydration and avoid unnecessary NSAID painkillers.'
      }
    ]
  },
  'user-sunita': {
    biomarkers: [
      {
        id: 'tsh',
        name: 'TSH (Thyroid Stimulating Hormone)',
        category: 'Thyroid Function',
        unit: 'uIU/mL',
        minNormal: 0.40,
        maxNormal: 4.50,
        optimalTarget: '0.50 - 4.00 uIU/mL',
        currentValue: 5.85,
        changeDelta: '+1.15 uIU/mL',
        changeType: 'worsening',
        history: [
          { date: 'Nov 2025', value: 4.20, status: 'NORMAL' },
          { date: 'Feb 2026', value: 4.90, status: 'HIGH' },
          { date: 'May 2026', value: 5.30, status: 'HIGH' },
          { date: 'Aug 2026', value: 5.85, status: 'HIGH' }
        ],
        aiTrendInsight: 'TSH has trended upwards across your last three tests (4.90 → 5.30 → 5.85 uIU/mL). Discuss this trend with your endocrinologist to see if a slight Thyroxine dose titration is needed.',
        guidance: 'Take thyroxine medication strictly on an empty stomach with plain water at least 45 minutes before morning tea.'
      }
    ]
  },
  'user-ananya': {
    biomarkers: [
      {
        id: 'hb-pediatric',
        name: 'Hemoglobin (Hb)',
        category: 'Pediatric Hematology',
        unit: 'g/dL',
        minNormal: 11.5,
        maxNormal: 14.5,
        optimalTarget: '12.0 - 14.0 g/dL',
        currentValue: 12.8,
        changeDelta: '+0.6 g/dL (+4.9%)',
        changeType: 'improving',
        history: [
          { date: 'Nov 2025', value: 12.2, status: 'NORMAL' },
          { date: 'Feb 2026', value: 12.4, status: 'NORMAL' },
          { date: 'May 2026', value: 12.6, status: 'NORMAL' },
          { date: 'Aug 2026', value: 12.8, status: 'NORMAL' }
        ],
        aiTrendInsight: 'Hemoglobin levels are optimal and steady across growth tracking checks, reflecting robust dietary iron and protein intake.',
        guidance: 'Continue iron-rich foods (green leafy vegetables, jaggery, lentils, pomegranate) paired with Vitamin C for absorption.'
      },
      {
        id: 'vitd-pediatric',
        name: 'Serum Vitamin D (25-OH)',
        category: 'Pediatric Bone & Growth',
        unit: 'ng/mL',
        minNormal: 30,
        maxNormal: 100,
        optimalTarget: '30 - 60 ng/mL',
        currentValue: 34.2,
        changeDelta: '+6.2 ng/mL',
        changeType: 'improving',
        history: [
          { date: 'Nov 2025', value: 28.0, status: 'LOW' },
          { date: 'Feb 2026', value: 31.0, status: 'NORMAL' },
          { date: 'May 2026', value: 32.8, status: 'NORMAL' },
          { date: 'Aug 2026', value: 34.2, status: 'NORMAL' }
        ],
        aiTrendInsight: 'Vitamin D has successfully normalized into the healthy physiological range (34.2 ng/mL) supporting strong bone mineralization and pediatric immunity.',
        guidance: 'Encourage 20-30 minutes of outdoor morning physical play and fortified milk intake.'
      }
    ]
  }
};

export const PREVENTIVE_CARE_ALERTS = [
  {
    id: 'prev-1',
    profileId: 'user-rajesh',
    title: 'Annual Diabetic Eye Screening (Fundoscopy)',
    category: 'Diabetic Care',
    dueDate: 'Due this Month',
    urgency: 'HIGH',
    description: 'Annual dilated eye exam to screen for early diabetic retinopathy.',
    recommendation: 'Schedule with Dr. Arvind Mehta or an ophthalmologist.'
  },
  {
    id: 'prev-2',
    profileId: 'user-arjun',
    title: 'Lipid Profile 3-Month Re-Test',
    category: 'Cardiovascular',
    dueDate: 'Due in November 2026',
    urgency: 'MEDIUM',
    description: 'Track LDL reduction following dietary and exercise changes.',
    recommendation: 'Fast 10-12 hours prior to the blood draw.'
  },
  {
    id: 'prev-3',
    profileId: 'user-sunita',
    title: 'DEXA Bone Mineral Density Scan',
    category: 'Bone Health',
    dueDate: 'Recommended for 58y female',
    urgency: 'MEDIUM',
    description: 'Evaluates osteopenia/osteoporosis risk and calcium retention.',
    recommendation: 'Discuss with orthopedic specialist at next visit.'
  },
  {
    id: 'prev-4',
    profileId: 'user-ananya',
    title: 'Annual Pediatric Growth & Vision Screening',
    category: 'Pediatric Health',
    dueDate: 'Due at 8.5 Years',
    urgency: 'LOW',
    description: 'Annual pediatric milestone tracking, visual acuity test, and dental fluoride check.',
    recommendation: 'Schedule routine pediatric wellness check with Dr. Neha Verma.'
  }
];
