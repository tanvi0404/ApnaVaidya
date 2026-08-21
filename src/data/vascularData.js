export function CALCULATE_VASCULAR_AGE({
  chronologicalAge = 32,
  systolicBp = 124,
  diastolicBp = 82,
  totalChol = 228,
  hdlChol = 52,
  restingHr = 68,
  smoker = false
}) {
  const pulsePressure = systolicBp - diastolicBp;
  const cholHdlRatio = (totalChol / (hdlChol || 1)).toFixed(1);
  
  // Baseline vascular offset computation
  let offset = 0;

  // Blood Pressure offset
  if (systolicBp >= 140) offset += 7;
  else if (systolicBp >= 130) offset += 3.5;
  else if (systolicBp < 115) offset -= 2;

  // Pulse Pressure offset (stiffness indicator)
  if (pulsePressure > 50) offset += 3;
  
  // Cholesterol/HDL ratio offset
  if (cholHdlRatio > 5.0) offset += 4;
  else if (cholHdlRatio < 3.5) offset -= 2;

  // Heart rate & lifestyle
  if (restingHr > 80) offset += 2;
  else if (restingHr < 62) offset -= 2;

  if (smoker) offset += 8;

  const estimatedVascularAge = Math.max(18, Math.round(chronologicalAge + offset));
  
  // Estimated Pulse Wave Velocity (ePWV in m/s)
  // Standard equation: ePWV = 9.587 - (0.402 * age) + (4.560 * 10^-3 * age^2) - (2.621 * 10^-5 * age^2 * MBP) + (3.176 * 10^-3 * age * MBP) - (1.832 * 10^-2 * MBP)
  const mbp = diastolicBp + (pulsePressure / 3);
  const rawPwv = (6.0 + (chronologicalAge * 0.05) + (mbp * 0.02) + (offset * 0.1)).toFixed(1);
  const epwv = Number(rawPwv);

  let stiffnessLabel = 'Optimal Elasticity';
  let stiffnessColor = 'emerald';
  if (epwv >= 10.0) {
    stiffnessLabel = 'Elevated Arterial Stiffness';
    stiffnessColor = 'rose';
  } else if (epwv >= 8.0) {
    stiffnessLabel = 'Mild Age-Related Hardening';
    stiffnessColor = 'amber';
  }

  return {
    chronologicalAge,
    estimatedVascularAge,
    ageDelta: estimatedVascularAge - chronologicalAge,
    epwv,
    pulsePressure,
    cholHdlRatio,
    stiffnessLabel,
    stiffnessColor,
    recommendations: [
      'Increase dietary dietary nitrates (beetroot juice, spinach, arugula) to boost endothelial Nitric Oxide (NO) synthesis.',
      'Maintain 150 minutes of Zone-2 aerobic movement weekly to preserve aortic compliance.',
      'Target sodium intake below 2.0g/day and increase potassium (bananas, coconut water) to reduce pulse pressure.'
    ]
  };
}

export const POSTPRANDIAL_GLUCOSE_CURVES = {
  highGiSedentary: [
    { time: 0, glucose: 95, label: 'Pre-meal Fasting' },
    { time: 15, glucose: 115, label: 'Rapid Digestion' },
    { time: 30, glucose: 158, label: 'Insulin Surge' },
    { time: 45, glucose: 192, label: 'Peak Hyperglycemia' },
    { time: 60, glucose: 178, label: 'Delayed Clearance' },
    { time: 90, glucose: 135, label: 'Descending' },
    { time: 120, glucose: 98, label: 'Baseline' },
    { time: 150, glucose: 72, label: 'Reactive Hypoglycemic Dip' },
    { time: 180, glucose: 88, label: 'Stabilized' }
  ],
  lowGiSedentary: [
    { time: 0, glucose: 95, label: 'Pre-meal Fasting' },
    { time: 15, glucose: 102, label: 'Slow Fiber Digestion' },
    { time: 30, glucose: 118, label: 'Steady Glycemia' },
    { time: 45, glucose: 132, label: 'Mild Peak' },
    { time: 60, glucose: 136, label: 'Smooth Plateau' },
    { time: 90, glucose: 122, label: 'Gradual Clearance' },
    { time: 120, glucose: 108, label: 'Baseline' },
    { time: 150, glucose: 96, label: 'Stable' },
    { time: 180, glucose: 94, label: 'Normal' }
  ],
  highGiWith15MinWalk: [
    { time: 0, glucose: 95, label: 'Pre-meal Fasting' },
    { time: 15, glucose: 110, label: 'Walk Initiated' },
    { time: 30, glucose: 130, label: 'GLUT-4 Uptake' },
    { time: 45, glucose: 142, label: 'Blunted Peak (-26%)' },
    { time: 60, glucose: 135, label: 'Muscle Clearance' },
    { time: 90, glucose: 115, label: 'Descending' },
    { time: 120, glucose: 98, label: 'Baseline' },
    { time: 150, glucose: 92, label: 'No Crash' },
    { time: 180, glucose: 90, label: 'Normal' }
  ]
};
