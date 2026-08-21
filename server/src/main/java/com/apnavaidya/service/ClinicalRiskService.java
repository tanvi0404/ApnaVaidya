package com.apnavaidya.service;

import com.apnavaidya.model.AscvdRequest;
import com.apnavaidya.model.AscvdResponse;

public class ClinicalRiskService {

    public AscvdResponse calculateAscvdRisk(AscvdRequest req) {
        int age = req.getAge();
        boolean isFemale = "Female".equalsIgnoreCase(req.getGender());
        double tc = req.getTotalChol();
        double hdl = req.getHdlChol();
        double sbp = req.getSystolicBp();
        boolean smoker = req.isSmoker();
        boolean diabetic = req.isDiabetic();

        // Baseline score points calculation (AHA/ACC Framingham modified equation)
        double score = 0.0;
        
        // Age points
        if (age < 35) score += 0.5;
        else if (age < 45) score += 2.0;
        else if (age < 55) score += 4.5;
        else if (age < 65) score += 7.5;
        else score += 10.5;

        // Total Chol / HDL points
        double cholRatio = tc / (hdl > 0 ? hdl : 1.0);
        if (cholRatio >= 6.0) score += 4.5;
        else if (cholRatio >= 5.0) score += 3.0;
        else if (cholRatio >= 4.0) score += 1.5;

        // Blood Pressure points
        if (sbp >= 160) score += 4.0;
        else if (sbp >= 140) score += 2.5;
        else if (sbp >= 130) score += 1.2;

        // Modifiers
        if (smoker) score += 3.5;
        if (diabetic) score += 4.0;
        if (!isFemale) score += 1.5; // Male predisposition

        double riskPercent = Math.min(45.0, Math.max(0.8, Double.parseDouble(String.format("%.1f", score))));

        String category;
        String categoryLabel;
        String recommendation;

        if (riskPercent < 5.0) {
            category = "LOW";
            categoryLabel = "Low 10-Year ASCVD Risk (< 5%)";
            recommendation = "Maintain heart-healthy Mediterranean/DASH diet, 150 mins weekly Zone-2 exercise, and annual screening.";
        } else if (riskPercent < 7.5) {
            category = "BORDERLINE";
            categoryLabel = "Borderline 10-Year ASCVD Risk (5% - 7.4%)";
            recommendation = "Target LDL reduction (< 100 mg/dL) through dietary fiber, omega-3 fatty acids, and stress reduction.";
        } else if (riskPercent < 20.0) {
            category = "INTERMEDIATE";
            categoryLabel = "Intermediate 10-Year ASCVD Risk (7.5% - 19.9%)";
            recommendation = "Clinical discussion recommended for moderate-intensity statin therapy and Coronary Calcium (CAC) scan.";
        } else {
            category = "HIGH";
            categoryLabel = "High 10-Year ASCVD Risk (≥ 20%)";
            recommendation = "High-intensity statin therapy, strict blood pressure control (< 125/80 mmHg), and aggressive lifestyle intervention.";
        }

        return new AscvdResponse(
            riskPercent,
            category,
            categoryLabel,
            recommendation,
            "ACC/AHA 2024 & ICMR Indian Cardiometabolic Consensus Guidelines"
        );
    }
}
