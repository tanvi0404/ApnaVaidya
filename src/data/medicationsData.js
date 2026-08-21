export const MEDICATIONS_DATA = {
  'user-arjun': [
    {
      id: 'med-1',
      name: 'Omega-3 Fish Oil / Flax Oil',
      dosage: '1000 mg',
      form: 'Capsule',
      frequency: 'Once Daily',
      timeSlot: 'Morning (8:30 AM)',
      mealTiming: 'After Breakfast',
      purpose: 'Cardiovascular & HDL Support',
      startDate: '01 Jan 2026',
      totalPills: 60,
      remainingPills: 38,
      refillThreshold: 10,
      status: 'taken', // 'taken' | 'pending' | 'missed'
      prescribedBy: 'Dr. Arvind Mehta (Cardiologist)'
    },
    {
      id: 'med-2',
      name: 'Vitamin D3 (Cholecalciferol)',
      dosage: '60,000 IU',
      form: 'Chewable Tablet',
      frequency: 'Weekly (Every Sunday)',
      timeSlot: 'Morning (9:00 AM)',
      mealTiming: 'With Milk / Fat-containing meal',
      purpose: 'Bone Density & Immune Support',
      startDate: '15 Feb 2026',
      totalPills: 12,
      remainingPills: 4,
      refillThreshold: 2,
      status: 'pending',
      prescribedBy: 'Dr. Arvind Mehta'
    }
  ],
  'user-rajesh': [
    {
      id: 'med-3',
      name: 'Metformin Hydrochloride (SR)',
      dosage: '500 mg',
      form: 'Tablet',
      frequency: 'Twice Daily',
      timeSlot: 'Morning (8:00 AM) & Night (8:30 PM)',
      mealTiming: 'With or immediately after meals',
      purpose: 'Type 2 Diabetes Glycemic Control',
      startDate: '10 Oct 2024',
      totalPills: 60,
      remainingPills: 8, // Refill Alert!
      refillThreshold: 10,
      status: 'taken',
      prescribedBy: 'Dr. Shalini Kapoor (Diabetologist)'
    },
    {
      id: 'med-4',
      name: 'Telmisartan',
      dosage: '40 mg',
      form: 'Tablet',
      frequency: 'Once Daily',
      timeSlot: 'Morning (8:00 AM)',
      mealTiming: 'Before or After Food',
      purpose: 'Blood Pressure & Renal Protection',
      startDate: '15 Jan 2025',
      totalPills: 30,
      remainingPills: 14,
      refillThreshold: 7,
      status: 'taken',
      prescribedBy: 'Dr. Arvind Mehta (Cardiologist)'
    },
    {
      id: 'med-5',
      name: 'Atorvastatin',
      dosage: '10 mg',
      form: 'Tablet',
      frequency: 'Once Daily',
      timeSlot: 'Night (9:30 PM)',
      mealTiming: 'Before Bedtime',
      purpose: 'Lipid Regulation',
      startDate: '10 Oct 2025',
      totalPills: 30,
      remainingPills: 5, // Refill Alert!
      refillThreshold: 7,
      status: 'pending',
      prescribedBy: 'Dr. Arvind Mehta'
    }
  ],
  'user-sunita': [
    {
      id: 'med-6',
      name: 'Levothyroxine Sodium (Thyronorm)',
      dosage: '50 mcg',
      form: 'Tablet',
      frequency: 'Once Daily',
      timeSlot: 'Early Morning (6:30 AM)',
      mealTiming: 'Empty Stomach with plain water (45m before tea)',
      purpose: 'Hypothyroidism Hormone Replacement',
      startDate: '05 Aug 2023',
      totalPills: 100,
      remainingPills: 45,
      refillThreshold: 15,
      status: 'taken',
      prescribedBy: 'Dr. Rajeshwari Nair (Endocrinologist)'
    },
    {
      id: 'med-7',
      name: 'Calcium Carbonate + Vitamin D3',
      dosage: '500 mg / 250 IU',
      form: 'Tablet',
      frequency: 'Once Daily',
      timeSlot: 'Afternoon (1:30 PM)',
      mealTiming: 'After Lunch (4+ hours after Thyroxine)',
      purpose: 'Bone Density Support',
      startDate: '01 Mar 2026',
      totalPills: 60,
      remainingPills: 18,
      refillThreshold: 10,
      status: 'pending',
      prescribedBy: 'Dr. Rajeshwari Nair'
    }
  ]
};
