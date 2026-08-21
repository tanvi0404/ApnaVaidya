export const EXERCISES_DATA = [
  {
    id: 'ex-1',
    title: 'Brisk Walking & Zone-2 Cardio',
    category: 'Aerobic Cardio',
    difficulty: 'Beginner',
    duration: '30-45 mins',
    caloriesBurned: '160 - 220 kcal',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Cardiovascular System'],
    equipment: 'Running Shoes, Hydration Bottle',
    description: 'Rhythmic, purposeful walking maintaining a conversational pace (Zone 2 heart rate: 60-70% max HR).',
    instructions: [
      'Warm up with 5 minutes of gentle casual strolling and arm swings.',
      'Transition into brisk pace: stand tall, shoulders relaxed, arms swinging naturally at 90 degrees.',
      'Maintain steady breathing through the nose where possible.',
      'Cool down with 5 minutes of slow walking and calf stretches.'
    ],
    safetyPrecautions: [
      'Diabetic users: Carry glucose tablets or a small snack in case of sudden hypoglycemia.',
      'Hypertensive users: Avoid abrupt sudden sprints; keep pace smooth and steady.',
      'Joint care: Choose cushioned footwear and avoid concrete running if knees ache.'
    ]
  },
  {
    id: 'ex-2',
    title: 'Bodyweight Chair / Box Squats',
    category: 'Lower Body Strength',
    difficulty: 'Beginner to Intermediate',
    duration: '3 Sets of 10-12 Reps',
    caloriesBurned: '80 - 120 kcal',
    targetMuscles: ['Glutes', 'Quadriceps', 'Hamstrings', 'Core Stabilizers'],
    equipment: 'Sturdy Chair or Bench',
    description: 'Functional lower-body movement reinforcing hip hinge, knee tracking, and independence in daily activities.',
    instructions: [
      'Stand in front of a chair with feet shoulder-width apart, toes pointing slightly outward.',
      'Engage your abdominal core and push your hips back as if sitting down into the chair.',
      'Lightly touch the chair seat with your glutes without collapsing weight.',
      'Press through your whole foot (heels and midfoot) to stand back up, squeezing your glutes at the top.',
      'Inhale on the way down, exhale on standing up.'
    ],
    safetyPrecautions: [
      'Knee safety: Do not let knees cave inwards (valgus collapse); track them in line with your second toe.',
      'Keep chest elevated; avoid rounding the lower back.',
      'If you have osteoarthritis, stop at 60-degree bend rather than full 90 degrees.'
    ]
  },
  {
    id: 'ex-3',
    title: 'Incline Wall / Countertop Push-Ups',
    category: 'Upper Body Strength',
    difficulty: 'Beginner',
    duration: '3 Sets of 8-10 Reps',
    caloriesBurned: '60 - 90 kcal',
    targetMuscles: ['Pectorals (Chest)', 'Anterior Deltoids (Shoulders)', 'Triceps', 'Core'],
    equipment: 'Wall or Stable Kitchen Counter',
    description: 'Joint-friendly upper-body pressing exercise building chest and shoulder tone without straining wrists or lower back.',
    instructions: [
      'Stand facing a wall or counter, about an arm-length away.',
      'Place palms flat against the surface at shoulder width and chest height.',
      'Keep your body in a straight plank line from heels to head.',
      'Slowly lower your chest towards the wall by bending elbows at a 45-degree angle.',
      'Push firmly back to the starting position with controlled control.'
    ],
    safetyPrecautions: [
      'Shoulder care: Keep elbows at 45 degrees relative to torso, never flared out at 90 degrees.',
      'Do not hold your breath; exhale as you push away from the wall to avoid blood pressure spikes.'
    ]
  },
  {
    id: 'ex-4',
    title: 'Surya Namaskar (Gentle Sun Salutations)',
    category: 'Yoga & Mobility',
    difficulty: 'All Levels',
    duration: '15-20 mins (6 Cycles)',
    caloriesBurned: '90 - 140 kcal',
    targetMuscles: ['Full Body Spine Flexibility', 'Hamstrings', 'Chest', 'Shoulders'],
    equipment: 'Yoga Mat',
    description: 'Dynamic sequence of 12 interconnected yoga asanas synchronizing conscious breathing with full-body spinal mobility.',
    instructions: [
      'Cycle starts in Pranamasana (Prayer pose) with deep breath awareness.',
      'Inhale into Hastauttanasana (Raised arms arching back gently).',
      'Exhale forward into Padahastasana (Forward bend, knees softly bent if tight).',
      'Step right leg back into Ashwa Sanchalanasana (Equestrian lunge).',
      'Transition smoothly through Dandasana (Plank), Ashtanga Namaskara, and Bhujangasana (Cobra pose).',
      'Push hips back into Adho Mukha Svanasana (Downward dog) and complete cycle with opposite leg.'
    ],
    safetyPrecautions: [
      'Hypertension: Avoid prolonged head-below-heart positions; lift head gradually.',
      'Spinal disk issues: Avoid aggressive backward bends in Cobra; practice Sphinx pose instead.'
    ]
  },
  {
    id: 'ex-5',
    title: 'Forearm Plank & Core Brace',
    category: 'Core Stability',
    difficulty: 'Intermediate',
    duration: '3 Sets of 20-30 Seconds',
    caloriesBurned: '50 - 70 kcal',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Glutes'],
    equipment: 'Yoga Mat / Carpet',
    description: 'Static isometric core exercise strengthening the natural muscular corset that stabilizes the lumbar spine.',
    instructions: [
      'Lie face down and place forearms flat on the floor, elbows directly beneath shoulders.',
      'Tuck toes and lift hips so your body forms a straight horizontal plank.',
      'Squeeze your glutes, brace your abs as if expecting a gentle tap to the stomach.',
      'Breathe steadily through your nose; hold for 20-30 seconds without letting hips sag.'
    ],
    safetyPrecautions: [
      'Stop immediately if you feel pressure in your lower back rather than your abdominal wall.',
      'Never hold your breath during isometric holds to prevent Valsalva blood pressure surges.'
    ]
  }
];

export const PROFILE_WORKOUT_ROUTINES = {
  'user-arjun': {
    title: 'Cardio Vitality & Lean Toning Routine',
    weeklyCommitment: '4 Days / Week (35-45 mins)',
    primaryGoal: 'Lower LDL, Enhance HDL & Improve Metabolic Flexibility',
    weeklySchedule: [
      { day: 'Monday', focus: 'Zone-2 Aerobic Cardio', exercise: 'Brisk Walking or Outdoor Cycling (40 mins)', duration: '40m', completed: true },
      { day: 'Tuesday', focus: 'Full-Body Resistance', exercise: 'Box Squats (3x12), Push-Ups (3x10), Forearm Plank (3x30s)', duration: '35m', completed: true },
      { day: 'Wednesday', focus: 'Active Recovery', exercise: 'Gentle Strolls & Hydration Focus', duration: '20m', completed: false },
      { day: 'Thursday', focus: 'HIIT & Interval Cardio', exercise: 'Brisk Incline Walk intervals + Core Planks', duration: '35m', completed: false },
      { day: 'Friday', focus: 'Yoga & Mobility Flow', exercise: 'Surya Namaskar (6 cycles) + Deep Hamstring Stretches', duration: '30m', completed: false },
      { day: 'Saturday', focus: 'Outdoor Endurance', exercise: 'Weekend 5km Brisk Walk / Jog', duration: '45m', completed: false },
      { day: 'Sunday', focus: 'Rest & Regeneration', exercise: 'Full Rest Day & Sleep Recovery', duration: '—', completed: false }
    ]
  },
  'user-rajesh': {
    title: 'Joint-Safe Diabetic Glycemic Management',
    weeklyCommitment: '5 Days / Week (25-30 mins)',
    primaryGoal: 'Stimulate GLUT-4 Glucose Transporters & Regulate BP',
    weeklySchedule: [
      { day: 'Monday', focus: 'Post-Meal Glycemic Walk', exercise: 'Brisk Walking (30 mins in morning or post-lunch)', duration: '30m', completed: true },
      { day: 'Tuesday', focus: 'Chair Strength & Balance', exercise: 'Chair Squats (3x8), Wall Push-Ups (3x8), Calf Raises', duration: '25m', completed: true },
      { day: 'Wednesday', focus: 'Post-Meal Walking', exercise: 'Evening Stroll in Park with Family', duration: '30m', completed: false },
      { day: 'Thursday', focus: 'Gentle Joint Yoga', exercise: 'Sukhasana breathing, Ankle Rotations & Cat-Cow stretch', duration: '25m', completed: false },
      { day: 'Friday', focus: 'Post-Meal Glycemic Walk', exercise: 'Brisk 30-min walking to support insulin sensitivity', duration: '30m', completed: false },
      { day: 'Saturday', focus: 'Chair Strength', exercise: 'Light Resistance Band Rows + Chair Squats', duration: '25m', completed: false },
      { day: 'Sunday', focus: 'Rest & Family Time', exercise: 'Light recreational stroll', duration: '15m', completed: false }
    ]
  },
  'user-sunita': {
    title: 'Thyroid Metabolism & Bone Strengthening Plan',
    weeklyCommitment: '4 Days / Week (25 mins)',
    primaryGoal: 'Promote T3 Conversion, Bone Density & Joint Ease',
    weeklySchedule: [
      { day: 'Monday', focus: 'Morning Sun Yoga', exercise: 'Gentle Surya Namaskar (4 cycles) + Vrikshasana for balance', duration: '25m', completed: true },
      { day: 'Tuesday', focus: 'Low-Impact Walk', exercise: 'Pleasant morning walk in sunlight (Vitamin D synthesis)', duration: '30m', completed: true },
      { day: 'Wednesday', focus: 'Bone Loading Strength', exercise: 'Wall Push-Ups (3x8), Chair Squats (2x10)', duration: '20m', completed: false },
      { day: 'Thursday', focus: 'Rest & Gentle Stretches', exercise: 'Rest day with evening breathing exercises', duration: '15m', completed: false },
      { day: 'Friday', focus: 'Metabolic Cardio Walk', exercise: 'Brisk 25-minute walk', duration: '25m', completed: false },
      { day: 'Saturday', focus: 'Yoga & Flexibility', exercise: 'Bhujangasana, Balasana & Pranayama', duration: '30m', completed: false },
      { day: 'Sunday', focus: 'Rest & Reflection', exercise: 'Full Rest Day', duration: '—', completed: false }
    ]
  }
};
