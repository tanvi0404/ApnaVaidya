export const AUDIT_TRAIL_LOGS = [
  {
    id: 'aud-101',
    timestamp: '15 Aug 2026, 12:10 PM',
    actor: 'Arjun Sharma (Self)',
    action: 'LAB_REPORT_UPLOADED',
    details: 'Uploaded "Comprehensive Lipid Profile (Thyrocare)". AES-256 encrypted in personal health vault.',
    ipAddress: '192.168.1.45',
    status: 'SUCCESS'
  },
  {
    id: 'aud-102',
    timestamp: '15 Aug 2026, 12:11 PM',
    actor: 'ApnaVaidya AI OCR Engine',
    action: 'AI_CLINICAL_ANALYSIS',
    details: 'Extracted 6 lab parameters and evaluated against ICMR 2024 reference tables.',
    ipAddress: 'System Daemon',
    status: 'SUCCESS'
  },
  {
    id: 'aud-103',
    timestamp: '15 Aug 2026, 12:20 PM',
    actor: 'Arjun Sharma (Self)',
    action: 'SHARE_TOKEN_GENERATED',
    details: 'Created 48-hour scoped access token (AV-SEC-LIPID-48H) for Dr. Arvind Mehta.',
    ipAddress: '192.168.1.45',
    status: 'SUCCESS'
  },
  {
    id: 'aud-104',
    timestamp: '14 Aug 2026, 08:30 AM',
    actor: 'Rajesh Sharma (Father)',
    action: 'MEDICATION_DOSE_LOGGED',
    details: 'Marked morning Metformin 500mg as taken.',
    ipAddress: '192.168.1.18',
    status: 'SUCCESS'
  },
  {
    id: 'aud-105',
    timestamp: '13 Aug 2026, 04:15 PM',
    actor: 'Dr. Arvind Mehta (Physician)',
    action: 'DOCTOR_TOKEN_ACCESSED',
    details: 'Authorized physician accessed pre-consultation report summary via time-limited QR token.',
    ipAddress: '10.14.220.89 (Max Hospital Network)',
    status: 'SUCCESS'
  }
];
