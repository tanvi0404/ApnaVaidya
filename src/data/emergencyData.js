export const FIRST_AID_PROTOCOLS = [
  {
    id: 'aid-cpr',
    title: 'Adult CPR (Cardiopulmonary Resuscitation)',
    urgency: 'LIFE-THREATENING (CALL 108 IMMEDIATELY)',
    category: 'Cardiac Arrest',
    icon: 'HeartCrack',
    metronomeBpm: 110, // 100-120 bpm
    steps: [
      {
        stepNumber: 1,
        title: 'Check Responsiveness & Breathing',
        instruction: 'Tap shoulders firmly and shout "Are you okay?". Check chest for absence of normal breathing or gasping (≤ 10 seconds).',
        caution: 'If unresponsive and not breathing normally, immediately dispatch 108 and get an AED if nearby.'
      },
      {
        stepNumber: 2,
        title: 'Hand Placement & Posture',
        instruction: 'Place heel of one hand on the center of the chest (lower half of sternum). Interlock fingers with the other hand. Keep elbows locked straight.',
        caution: 'Position your shoulders directly over your hands.'
      },
      {
        stepNumber: 3,
        title: 'High-Quality Chest Compressions',
        instruction: 'Push hard and fast: at least 2 inches (5 cm) deep at a cadence of 100-120 compressions/min. Allow full chest recoil after every push.',
        caution: 'Maintain continuous rhythm with the audio/visual metronome below.'
      },
      {
        stepNumber: 4,
        title: 'Rescue Breaths (If Trained) or Hands-Only CPR',
        instruction: 'If trained, give 2 rescue breaths after every 30 compressions (tilt head, lift chin, pinch nose). If untrained, perform continuous Hands-Only CPR without stopping.',
        caution: 'Do not interrupt compressions for more than 10 seconds until paramedics arrive.'
      }
    ]
  },
  {
    id: 'aid-stroke',
    title: 'Acute Stroke Recognition (BE FAST Protocol)',
    urgency: 'TIME CRITICAL (3-HOUR THROMBOLYSIS WINDOW)',
    category: 'Neurological',
    icon: 'Brain',
    steps: [
      {
        stepNumber: 1,
        title: 'B — Balance Loss',
        instruction: 'Is the person experiencing sudden dizziness, loss of coordination, or difficulty walking?',
        caution: 'Support them safely to prevent falling.'
      },
      {
        stepNumber: 2,
        title: 'E — Eyesight Changes',
        instruction: 'Is there sudden blurriness, double vision, or complete loss of vision in one or both eyes?',
        caution: 'Note the exact minute symptoms began.'
      },
      {
        stepNumber: 3,
        title: 'F — Facial Drooping',
        instruction: 'Ask the person to smile. Does one side of the face or mouth droop or feel numb?',
        caution: 'Uneven smile is a hallmark stroke sign.'
      },
      {
        stepNumber: 4,
        title: 'A — Arm Weakness',
        instruction: 'Ask them to raise both arms out in front. Does one arm drift downward or feel paralyzed?',
        caution: 'Sudden weakness on one side of the body.'
      },
      {
        stepNumber: 5,
        title: 'S — Speech Slurring',
        instruction: 'Ask them to repeat a simple sentence like "The sky is blue". Is speech slurred, strange, or are they unable to speak?',
        caution: 'Aphasia or speech difficulty requires immediate CT scan.'
      },
      {
        stepNumber: 6,
        title: 'T — Time to Call 108 / 112',
        instruction: 'If you observe ANY one of these signs, call 108 immediately. State: "Suspected acute ischemic stroke, requesting stroke-ready hospital with CT/Cath lab".',
        caution: 'Do NOT give aspirin or water before medical evaluation.'
      }
    ]
  },
  {
    id: 'aid-choking',
    title: 'Severe Choking (Heimlich Maneuver)',
    urgency: 'IMMEDIATE AIRWAY OBSTRUCTION',
    category: 'Airway',
    icon: 'Wind',
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Severe Airway Blockage',
        instruction: 'Ask "Are you choking?". If they cannot speak, cough forcefully, or breathe, and are clutching their throat, take immediate action.',
        caution: 'If they can cough loudly, encourage them to keep coughing.'
      },
      {
        stepNumber: 2,
        title: 'Stand Behind & Make a Fist',
        instruction: 'Stand behind the person, wrap your arms around their waist. Make a fist with one hand and place the thumb side just above their navel (well below ribcage).',
        caution: 'Do not compress the ribs.'
      },
      {
        stepNumber: 3,
        title: 'Perform Quick Inward & Upward Thrusts',
        instruction: 'Grasp your fist with your other hand and press forcefully into the abdomen with quick, inward and upward thrusts.',
        caution: 'Repeat thrusts until the dislodged foreign object is expelled or the person becomes unconscious.'
      }
    ]
  },
  {
    id: 'aid-hypo',
    title: 'Severe Hypoglycemia (Blood Sugar < 70 mg/dL)',
    urgency: 'URGENT METABOLIC DROP',
    category: 'Endocrine',
    icon: 'Activity',
    steps: [
      {
        stepNumber: 1,
        title: 'Recognize Signs of Rapid Sugar Drop',
        instruction: 'Shakiness, cold profuse sweating, extreme hunger, confusion, rapid heartbeat, or dizziness.',
        caution: 'Check capillary blood sugar immediately with glucometer if available.'
      },
      {
        stepNumber: 2,
        title: 'Apply the Clinical 15-15 Rule',
        instruction: 'Give 15 grams of fast-acting simple carbohydrates: 1/2 cup fruit juice, 3-4 glucose tablets, or 1 tablespoon of sugar/honey in water.',
        caution: 'Avoid chocolates or fat-heavy snacks as fat delays sugar absorption.'
      },
      {
        stepNumber: 3,
        title: 'Wait 15 Minutes & Retest',
        instruction: 'Wait 15 minutes and recheck blood sugar. If still < 70 mg/dL, repeat with another 15g fast carbohydrate.',
        caution: 'Once > 70 mg/dL, give a small complex snack (chapati or biscuit) to stabilize.'
      }
    ]
  }
];

export const NEARBY_EMERGENCY_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'Max Super Specialty Hospital (24x7 Trauma & Cardiac ER)',
    distance: '2.3 km (6 mins drive)',
    address: 'B-Block, Sushant Lok 1, Sector 43, Gurugram',
    phone: '+91 124 662 3000',
    emergencyDirectDial: '1066',
    traumaLevel: 'Level 1 Trauma & 24x7 Cath Lab',
    icuBeds: 'Available (14 ICU Beds Vacant)',
    specialties: ['Cardiac Cath Lab', 'Stroke Ready 24x7', 'Trauma Center']
  },
  {
    id: 'hosp-2',
    name: 'Fortis Memorial Research Institute (FMRI)',
    distance: '3.8 km (10 mins drive)',
    address: 'Sector 44, Opposite Huda City Centre Metro, Gurugram',
    phone: '+91 124 496 2200',
    emergencyDirectDial: '105010',
    traumaLevel: 'Comprehensive Multi-Organ Trauma Center',
    icuBeds: 'Available (8 ICU Beds Vacant)',
    specialties: ['Comprehensive Stroke Center', 'Pediatric ICU', 'ECMO Support']
  },
  {
    id: 'hosp-3',
    name: 'Medanta — The Medicity',
    distance: '5.6 km (14 mins drive)',
    address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram',
    phone: '+91 124 414 1414',
    emergencyDirectDial: '1068',
    traumaLevel: 'Advanced Tertiary Quaternary Trauma Institute',
    icuBeds: 'Available (22 ICU Beds Vacant)',
    specialties: ['Air Ambulance Helipad', 'Cardiothoracic Surgery', 'Neurosurgery ER']
  }
];
