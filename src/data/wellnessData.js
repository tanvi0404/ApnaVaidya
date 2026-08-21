export const WOMENS_HEALTH_DATA = {
  cycleLength: 28,
  periodDuration: 5,
  lastPeriodDate: '01 Aug 2026',
  nextPeriodDate: '29 Aug 2026',
  fertileWindow: '11 Aug - 16 Aug 2026',
  ovulationDay: '14 Aug 2026',
  currentPhase: 'Luteal Phase (Day 15 of 28)',
  phaseDescription: 'Progesterone levels rise to prepare the uterine lining. Mild mood sensitivity or fluid retention may occur.',
  hormonePanels: [
    { name: 'TSH (Thyroid)', value: '2.4 uIU/mL', status: 'Optimal', notes: 'Normal thyroid axis supports regular ovulation.' },
    { name: 'Prolactin', value: '14.2 ng/mL', status: 'Normal', notes: 'Within baseline reference (4.8 - 23.3 ng/mL).' },
    { name: 'LH / FSH Ratio', value: '1.1 : 1', status: 'Balanced', notes: 'No indicator of polycystic ovarian morphology (PCOS).' }
  ]
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
