export const SAMPLE_PRESCRIPTIONS_OCR = [
  {
    id: 'rx-cardio-1',
    doctorName: 'Dr. Arvind Mehta, MD (Cardiology)',
    clinic: 'Max Super Specialty Hospital, Heart Institute',
    date: '15 Aug 2026',
    prescriptionType: 'Handwritten OPD Clinical Slip',
    extractedDrugs: [
      {
        drugName: 'Atorvastatin (Lipitor)',
        dosage: '20 mg',
        frequency: 'Once Daily (Night / HS)',
        duration: '90 Days',
        instructions: 'Take with plain water after dinner.',
        purpose: 'LDL Cholesterol Reduction',
        allergyWarning: 'Safe — No conflict with patient allergies.'
      },
      {
        drugName: 'Telmisartan (Micardis)',
        dosage: '40 mg',
        frequency: 'Once Daily (Morning / OD)',
        duration: '90 Days',
        instructions: 'Take after breakfast.',
        purpose: 'Vascular Blood Pressure Control',
        allergyWarning: 'Safe — No conflict.'
      },
      {
        drugName: 'Marine Omega-3 (EPA/DHA)',
        dosage: '1000 mg',
        frequency: 'Once Daily (After Lunch)',
        duration: '60 Days',
        instructions: 'Take with a meal containing dietary fats.',
        purpose: 'Endothelial & HDL Support',
        allergyWarning: 'Safe.'
      }
    ],
    doctorAdvice: 'Follow DASH dietary sodium reduction (< 2.0g/day), maintain 150 mins weekly aerobic exercise, repeat Fasting Lipid Panel in 90 days.'
  },
  {
    id: 'rx-diabetes-2',
    doctorName: 'Dr. Shalini Kapoor, MD, DM (Endocrinology)',
    clinic: 'Apollo Hospitals, Diabetology Clinic',
    date: '10 Aug 2026',
    prescriptionType: 'Printed Hospital Prescription',
    extractedDrugs: [
      {
        drugName: 'Metformin Hydrochloride (Glycomet SR)',
        dosage: '500 mg',
        frequency: 'Twice Daily (Morning & Night / BD)',
        duration: '90 Days',
        instructions: 'Take strictly after meals to prevent GI upset.',
        purpose: 'Glycemic Insulin Sensitivity',
        allergyWarning: 'Safe.'
      },
      {
        drugName: 'Teneligliptin (DPP-4 Inhibitor)',
        dosage: '20 mg',
        frequency: 'Once Daily (Morning / OD)',
        duration: '90 Days',
        instructions: 'Take before breakfast.',
        purpose: 'Postprandial Glucose Control',
        allergyWarning: 'Safe.'
      }
    ],
    doctorAdvice: 'Engage in 20-min post-meal walking. Keep fast-acting glucose tablets ready for emergency hypoglycemia precaution.'
  }
];
