// Clinical Risk Calculators Data & Reference Models (ACC/AHA, ICMR, NCEP-ATP III)

export const CALCULATE_ASCVD_RISK = (age, gender, totalChol, hdl, sbp, isSmoker, hasDiabetes) => {
  // Simplified Framingham / ACC-AHA 10-Year ASCVD Risk Estimation Model
  let baseScore = (age - 20) * 0.4;
  if (gender === 'Male') baseScore += 2.5;
  if (totalChol > 200) baseScore += (totalChol - 200) * 0.05;
  if (hdl < 45) baseScore += (45 - hdl) * 0.08;
  if (sbp > 120) baseScore += (sbp - 120) * 0.06;
  if (isSmoker) baseScore += 3.5;
  if (hasDiabetes) baseScore += 4.0;

  const riskPercent = Math.min(Math.max(Math.round(baseScore * 10) / 10, 1.2), 35.0);

  let category = 'LOW';
  let categoryLabel = 'Low Risk (< 5%)';
  let badgeColor = 'green';
  let recommendation = 'Maintain current heart-healthy Mediterranean/DASH diet, 150 mins weekly aerobic activity, and annual lipid check.';

  if (riskPercent >= 20.0) {
    category = 'HIGH';
    categoryLabel = 'High Risk (≥ 20%)';
    badgeColor = 'rose';
    recommendation = 'Strong indication to consult a cardiologist regarding high-intensity statin therapy, strict LDL < 70 mg/dL target, and formal cardiovascular risk management.';
  } else if (riskPercent >= 7.5) {
    category = 'INTERMEDIATE';
    categoryLabel = 'Intermediate Risk (7.5% - 19.9%)';
    badgeColor = 'amber';
    recommendation = 'Moderate-intensity statin discussion recommended. Emphasize dietary soluble fiber, weight optimization, and blood pressure control (< 130/80 mmHg).';
  } else if (riskPercent >= 5.0) {
    category = 'BORDERLINE';
    categoryLabel = 'Borderline Risk (5.0% - 7.4%)';
    badgeColor = 'amber';
    recommendation = 'Lifestyle therapy primary focus. Consider Coronary Artery Calcium (CAC) scan if decision on statin initiation is uncertain.';
  }

  return { riskPercent, category, categoryLabel, badgeColor, recommendation };
};

export const CALCULATE_IDRS_SCORE = (age, waistCm, physicalActivity, familyHistory) => {
  // Indian Diabetes Risk Score (Madras Diabetes Research Foundation / ICMR validated)
  let score = 0;

  // Age score
  if (age < 35) score += 0;
  else if (age <= 49) score += 20;
  else score += 30;

  // Waist circumference score (Asian Indian cutoffs)
  if (waistCm < 80) score += 0;
  else if (waistCm <= 89) score += 10;
  else score += 20;

  // Physical activity score
  if (physicalActivity === 'Regular Vigorous Exercise / Strenuous Work') score += 0;
  else if (physicalActivity === 'Moderate Exercise / Regular Walking') score += 10;
  else if (physicalActivity === 'Mild Exercise / Sedentary with Little Activity') score += 20;
  else score += 30;

  // Family history score
  if (familyHistory === 'None') score += 0;
  else if (familyHistory === 'One Parent Diabetic') score += 10;
  else score += 20; // Both parents diabetic

  let riskCategory = 'LOW';
  let label = 'Low Risk (< 30)';
  let advice = 'Low risk of developing Type 2 Diabetes. Continue balanced nutrition and annual glycemic screening.';

  if (score >= 60) {
    riskCategory = 'HIGH';
    label = 'High Risk (≥ 60)';
    advice = 'High probability of prediabetes or undiagnosed diabetes. Highly recommended to undergo a 3-month HbA1c and Oral Glucose Tolerance Test (OGTT).';
  } else if (score >= 30) {
    riskCategory = 'MODERATE';
    label = 'Moderate Risk (30 - 50)';
    advice = 'Moderate diabetes risk. Implement 30 minutes of daily post-meal brisk walking and reduce refined glycemic carbohydrates.';
  }

  return { score, maxScore: 100, riskCategory, label, advice };
};

export const METABOLIC_SYNDROME_CRITERIA = [
  {
    id: 'crit-waist',
    label: 'Abdominal Obesity (Waist Circumference)',
    thresholdMale: '≥ 90 cm (Asian Indian standard)',
    thresholdFemale: '≥ 80 cm (Asian Indian standard)',
    riskFactor: 'Visceral adiposity triggering insulin resistance'
  },
  {
    id: 'crit-triglycerides',
    label: 'Elevated Serum Triglycerides',
    thresholdMale: '≥ 150 mg/dL (or on fibrate/statin therapy)',
    thresholdFemale: '≥ 150 mg/dL',
    riskFactor: 'Excessive remnant lipoprotein particles in circulation'
  },
  {
    id: 'crit-hdl',
    label: 'Reduced HDL ("Good") Cholesterol',
    thresholdMale: '< 40 mg/dL',
    thresholdFemale: '< 50 mg/dL',
    riskFactor: 'Impaired reverse cholesterol transport from arteries'
  },
  {
    id: 'crit-bp',
    label: 'Elevated Blood Pressure',
    thresholdMale: 'Systolic ≥ 130 mmHg OR Diastolic ≥ 85 mmHg',
    thresholdFemale: 'Systolic ≥ 130 mmHg OR Diastolic ≥ 85 mmHg',
    riskFactor: 'Endothelial shear stress and arterial stiffening'
  },
  {
    id: 'crit-fbs',
    label: 'Elevated Fasting Plasma Glucose',
    thresholdMale: '≥ 100 mg/dL (or diagnosed Type 2 Diabetes)',
    thresholdFemale: '≥ 100 mg/dL',
    riskFactor: 'Impaired fasting glycemic regulation'
  }
];
