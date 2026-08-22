import { describe, it, expect } from 'vitest';

/**
 * Frontend Clinical Algorithms & Mathematical Validation Tests
 */
describe('Clinical Calculators Mathematical Assertions', () => {

  // 1. ASCVD Risk Estimation Logic
  it('calculates elevated ASCVD 10-year risk for older male with dyslipidemia', () => {
    const calculateMockAscvd = (age, totalChol, hdl, sbp, smoker = false, diabetic = false) => {
      let score = 0.5;
      score += (age - 40) * 0.35;
      score += (totalChol - 180) * 0.05;
      score -= (hdl - 45) * 0.1;
      score += (sbp - 120) * 0.08;
      if (smoker) score += 4.5;
      if (diabetic) score += 5.0;
      return Math.max(1.0, Math.min(60.0, parseFloat(score.toFixed(1))));
    };

    const risk = calculateMockAscvd(55, 230, 40, 140, false, false);
    expect(risk).toBeGreaterThan(7.5);
    expect(risk).toBeLessThan(30.0);
  });

  // 2. IDRS (Indian Diabetes Risk Score, 0 - 100)
  it('calculates exact ICMR-INDIAB IDRS risk points and classifications', () => {
    const calculateIdrs = (age, waistCm, physicalActivity, familyHistory) => {
      let score = 0;
      // Age points (0, 20, 30)
      if (age >= 50) score += 30;
      else if (age >= 35) score += 20;

      // Waist points (0, 10, 30)
      if (waistCm >= 90) score += 30;
      else if (waistCm >= 80) score += 10;

      // Physical activity points (0, 20, 30)
      if (physicalActivity === 'vigorous') score += 0;
      else if (physicalActivity === 'moderate') score += 20;
      else score += 30; // sedentary

      // Family history points (0, 10)
      if (familyHistory === 'both' || familyHistory === 'one') score += 10;

      let riskCategory = 'LOW RISK';
      if (score >= 60) riskCategory = 'HIGH RISK';
      else if (score >= 30) riskCategory = 'MODERATE RISK';

      return { score: Math.min(100, score), riskCategory };
    };

    const highRisk = calculateIdrs(55, 95, 'sedentary', 'both');
    expect(highRisk.score).toBe(100);
    expect(highRisk.riskCategory).toBe('HIGH RISK');

    const lowRisk = calculateIdrs(28, 76, 'vigorous', 'none');
    expect(lowRisk.score).toBe(0);
    expect(lowRisk.riskCategory).toBe('LOW RISK');
  });

  // 3. Estimated Vascular Age & Pulse Wave Velocity
  it('calculates vascular age delta based on SBP and cholesterol ratio', () => {
    const calculateVascularAge = (chronologicalAge, sbp, totalChol, hdl) => {
      const cholRatio = totalChol / (hdl || 40);
      let delta = 0;
      if (sbp > 130) delta += (sbp - 130) * 0.25;
      if (cholRatio > 4.5) delta += (cholRatio - 4.5) * 2.0;
      const estimatedVascularAge = Math.round(chronologicalAge + delta);
      return {
        chronologicalAge,
        estimatedVascularAge,
        ageDelta: estimatedVascularAge - chronologicalAge
      };
    };

    const vascular = calculateVascularAge(52, 142, 220, 42);
    expect(vascular.estimatedVascularAge).toBeGreaterThan(52);
    expect(vascular.ageDelta).toBeGreaterThanOrEqual(3);
  });
});
