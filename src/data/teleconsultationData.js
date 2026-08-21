export const ACTIVE_INSURANCE_POLICY = {
  policyNumber: 'POL-HDFC-9948214',
  insurerName: 'HDFC ERGO Health Suraksha Platinum',
  tpaName: 'Medi Assist Insurance TPA Pvt. Ltd.',
  sumInsured: '₹15,00,000',
  remainingSumInsured: '₹15,00,000',
  noClaimBonus: '₹3,00,000 (20% Cumulative Bonus)',
  roomRentLimit: 'Single Private A/C Room (No Proportional Deduction)',
  copayPercent: '0% (Zero Co-payment across all network hospitals)',
  restorationBenefit: '100% Instant Automatic Restoration for Unrelated Illnesses',
  cashlessHospitalsCount: '12,400+ Network Hospitals',
  policyStatus: 'Active (Valid till 31 Mar 2027)'
};

export const CLAIM_DOCUMENT_CHECKLIST = [
  {
    id: 'doc-discharge',
    name: 'Hospital Discharge Summary with ICD-10 Code',
    category: 'Clinical Proof',
    required: true,
    uploaded: true,
    status: 'VERIFIED',
    aiCheckNotes: 'Clinical diagnosis (ICD-10 I20.9) matches admission reason and physician notes.'
  },
  {
    id: 'doc-final-bill',
    name: 'Final Itemized Hospital Bill & Detailed Breakup',
    category: 'Billing',
    required: true,
    uploaded: true,
    status: 'VERIFIED',
    aiCheckNotes: 'Itemized pharmacy, OT, and bed charges reconciled with daily indoor case papers.'
  },
  {
    id: 'doc-lab-reports',
    name: 'Diagnostic Pathology & Radiology Test Slips',
    category: 'Diagnostic Confirmation',
    required: true,
    uploaded: true,
    status: 'VERIFIED',
    aiCheckNotes: 'Lipid Profile, ECG, and Troponin-I lab records attached with lab accreditation stamps.'
  },
  {
    id: 'doc-icp',
    name: 'Indoor Case Papers (ICP) / Treating Doctor Notes',
    category: 'Physician Records',
    required: true,
    uploaded: true,
    status: 'VERIFIED',
    aiCheckNotes: 'Daily vital charts and consultant round notes signed by primary cardiologist.'
  },
  {
    id: 'doc-pharmacy-bills',
    name: 'Pharmacy Bills with Matching Doctor Prescriptions',
    category: 'Medication Evidence',
    required: true,
    uploaded: false,
    status: 'PENDING_UPLOAD',
    aiCheckNotes: 'Awaiting day-3 discharge pharmacy counter receipt with GST stamp.'
  },
  {
    id: 'doc-cheque',
    name: 'Cancelled Cheque with Printed Name / Bank KYC',
    category: 'Payout Transfer',
    required: true,
    uploaded: true,
    status: 'VERIFIED',
    aiCheckNotes: 'Account details and IFSC code validated for direct NEFT/RTGS settlement.'
  }
];

export const TELECONSULT_DOCTORS = [
  {
    id: 'doc-sharma',
    name: 'Dr. Vikramaditya Sharma, MD, DM',
    specialty: 'Senior Consultant Cardiologist',
    hospital: 'Fortis Escorts Heart Institute',
    experience: '18 Years Experience',
    rating: 4.9,
    consultationsCount: '3,800+',
    avatarInitials: 'VS',
    avatarColor: 'from-emerald-600 to-teal-700',
    status: 'READY_TO_CONNECT',
    nextAvailableSlot: 'Today • Instant Virtual Room'
  }
];
