export const FAMILY_PROFILES = [
  {
    id: 'user-arjun',
    name: 'Arjun Sharma',
    relationship: 'Self',
    age: 32,
    gender: 'Male',
    bloodGroup: 'B+',
    avatarColor: 'from-emerald-500 to-teal-600',
    avatarInitials: 'AS',
    weight: '74 kg',
    height: '178 cm',
    bmi: 23.4,
    conditions: ['Mild Dyslipidemia'],
    allergies: ['Dust / Pollen'],
    goals: ['Improve HDL', 'Lower Resting Heart Rate', 'Lean Muscle Gain'],
    dietPreference: 'Vegetarian (Eggs included)',
    lifestyle: {
      nutrition: 'Good',
      activity: 'Active (4 days/wk)',
      sleep: '7.5 hrs (Optimal)',
      hydration: '2.8 L / 3.0 L'
    }
  },
  {
    id: 'user-rajesh',
    name: 'Rajesh Sharma',
    relationship: 'Father',
    age: 62,
    gender: 'Male',
    bloodGroup: 'O+',
    avatarColor: 'from-rose-500 to-pink-600',
    avatarInitials: 'RS',
    weight: '81 kg',
    height: '172 cm',
    bmi: 27.4,
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    allergies: ['Penicillin'],
    goals: ['Keep HbA1c < 6.8%', 'Maintain BP 120/80', 'Daily 45-min Walking'],
    dietPreference: 'Diabetic-Friendly Vegetarian',
    lifestyle: {
      nutrition: 'Needs Attention (High Carbs)',
      activity: 'Moderate (Walking)',
      sleep: '6.2 hrs (Fair)',
      hydration: '2.0 L / 2.5 L'
    }
  },
  {
    id: 'user-sunita',
    name: 'Sunita Sharma',
    relationship: 'Mother',
    age: 58,
    gender: 'Female',
    bloodGroup: 'A+',
    avatarColor: 'from-emerald-600 to-green-700',
    avatarInitials: 'SS',
    weight: '66 kg',
    height: '158 cm',
    bmi: 26.4,
    conditions: ['Hypothyroidism', 'Vitamin D Deficiency'],
    allergies: ['Sulfa Drugs'],
    goals: ['Balance TSH Levels', 'Improve Bone Density', 'Gentle Yoga'],
    dietPreference: 'Pure Vegetarian / High Calcium',
    lifestyle: {
      nutrition: 'Good',
      activity: 'Light (Yoga & Strolls)',
      sleep: '7.0 hrs (Good)',
      hydration: '2.2 L / 2.5 L'
    }
  },
  {
    id: 'user-ananya',
    name: 'Ananya Sharma',
    relationship: 'Daughter',
    age: 8,
    gender: 'Female',
    bloodGroup: 'B+',
    avatarColor: 'from-pink-400 to-rose-400',
    avatarInitials: 'AS',
    weight: '26 kg',
    height: '128 cm',
    bmi: 15.9,
    conditions: ['Mild Allergic Rhinitis'],
    allergies: ['Peanuts', 'Shellfish'],
    goals: ['Immunity Support', 'Balanced Pediatric Growth'],
    dietPreference: 'Balanced Nutrition',
    lifestyle: {
      nutrition: 'Excellent',
      activity: 'Very Active (Play/Sports)',
      sleep: '9.0 hrs (Optimal)',
      hydration: '1.8 L / 2.0 L'
    }
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'AI Lab Analysis Ready',
    message: 'Your Comprehensive Lipid Profile (12 Aug 2026) has been analyzed. 2 parameters flagged for review.',
    timestamp: '10 mins ago',
    type: 'report_ready',
    unread: true,
    actionTab: 'reports'
  },
  {
    id: 'notif-2',
    title: 'Medication Reminder',
    message: 'Time for afternoon dose: Metformin 500mg & Vitamin D3 capsule.',
    timestamp: '1 hour ago',
    type: 'med_reminder',
    unread: true,
    actionTab: 'medications'
  },
  {
    id: 'notif-3',
    title: 'Preventive Care Alert',
    message: 'Annual HbA1c screening is recommended for Rajesh Sharma based on diabetes history.',
    timestamp: 'Yesterday',
    type: 'preventive_alert',
    unread: false,
    actionTab: 'dashboard'
  },
  {
    id: 'notif-4',
    title: 'Doctor Summary Generated',
    message: 'Pre-visit summary prepared for Dr. Arvind Mehta (Cardiologist) on Friday 10:30 AM.',
    timestamp: '2 days ago',
    type: 'doctor_share',
    unread: false,
    actionTab: 'doctors'
  }
];

export const EMERGENCY_CONTACTS = [
  { name: 'National Emergency Helpline', number: '112', type: 'Emergency All-in-One' },
  { name: 'Ambulance First Response', number: '108', type: 'Medical Emergency' },
  { name: 'National Teleconsultation (eSanjeevani)', number: '1075', type: 'Govt Health Hotline' },
  { name: 'Dr. Arvind Mehta (Personal Physician)', number: '+91 98765 43210', type: 'Primary Doctor' },
  { name: 'Max Super Specialty Hospital', number: '011-26515050', type: 'Nearest Hospital 24x7' }
];

export const RED_FLAG_SYMPTOMS = [
  {
    title: 'Acute Severe Chest Pressure / Pain',
    description: 'Crushing sensation, pain radiating to left jaw/shoulder, cold sweats, nausea.',
    urgency: 'CRITICAL',
    action: 'Call 108 or reach nearest ER immediately. Do not drive yourself.'
  },
  {
    title: 'FAST Stroke Indicators',
    description: 'Face drooping, Arm weakness on one side, Slurred Speech, Sudden confusion.',
    urgency: 'CRITICAL',
    action: 'Every minute counts. Rush to stroke-ready emergency center.'
  },
  {
    title: 'Severe Shortness of Breath',
    description: 'Inability to speak in full sentences, blue lips or fingernails, gasping.',
    urgency: 'EMERGENCY',
    action: 'Sit upright, call emergency ambulance immediately.'
  },
  {
    title: 'Sudden Unbearable "Thunderclap" Headache',
    description: 'Worst headache of your life, sudden vision loss or stiff neck with fever.',
    urgency: 'URGENT CARE',
    action: 'Seek urgent neurological evaluation at emergency hospital.'
  }
];
