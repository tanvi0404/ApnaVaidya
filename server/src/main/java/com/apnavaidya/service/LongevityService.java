package com.apnavaidya.service;

import com.apnavaidya.model.LongevityRequest;
import com.apnavaidya.model.LongevityResponse;

import java.util.ArrayList;
import java.util.List;

public class LongevityService {

    public LongevityResponse calculateLongevity(LongevityRequest req) {
        int age = req.getChronologicalAge() > 0 ? req.getChronologicalAge() : 35;
        double sbp = req.getSystolicBp() > 0 ? req.getSystolicBp() : 120.0;
        double tc = req.getTotalChol() > 0 ? req.getTotalChol() : 190.0;
        double hdl = req.getHdlChol() > 0 ? req.getHdlChol() : 50.0;
        double hba1c = req.getHba1c() > 0 ? req.getHba1c() : 5.4;
        int exerciseMins = req.getWeeklyExerciseMins();
        double sleep = req.getSleepHours() > 0 ? req.getSleepHours() : 7.5;

        // Baseline score
        int score = 80;
        double ageDelta = 0.0;

        // 1. Cardiovascular & BP Impact
        if (sbp > 135) {
            score -= 8;
            ageDelta += 2.5;
        } else if (sbp <= 120) {
            score += 4;
            ageDelta -= 1.0;
        }

        // 2. Lipid Ratio Impact (TC/HDL)
        double lipidRatio = tc / Math.max(hdl, 20.0);
        if (lipidRatio > 4.5) {
            score -= 7;
            ageDelta += 2.0;
        } else if (lipidRatio < 3.5) {
            score += 4;
            ageDelta -= 1.2;
        }

        // 3. Glycemic Impact (HbA1c)
        if (hba1c >= 6.5) {
            score -= 12;
            ageDelta += 4.0;
        } else if (hba1c > 5.7) {
            score -= 6;
            ageDelta += 1.8;
        } else {
            score += 5;
            ageDelta -= 1.5;
        }

        // 4. Movement & Aerobic Conditioning
        if (exerciseMins >= 150) {
            score += 7;
            ageDelta -= 2.0;
        } else if (exerciseMins < 60) {
            score -= 6;
            ageDelta += 1.5;
        }

        // 5. Sleep & Circadian Autophagy
        if (sleep >= 7.0 && sleep <= 8.5) {
            score += 4;
            ageDelta -= 0.8;
        } else if (sleep < 6.0) {
            score -= 5;
            ageDelta += 1.5;
        }

        if (req.isSmoker()) {
            score -= 15;
            ageDelta += 5.0;
        }

        score = Math.max(25, Math.min(98, score));
        double bioAge = Math.max(18.0, age + ageDelta);
        double velocity = Math.round((bioAge / Math.max(age, 1)) * 100.0) / 100.0;

        String tier = score >= 80 ? "OPTIMAL LONGEVITY" : score >= 65 ? "MODERATE HEALTHSPAN" : "ELEVATED AGING RISK";
        String trajectory = velocity < 1.0 ? "Decelerated Biological Aging (" + velocity + "x)" : "Accelerated Biological Aging (" + velocity + "x)";

        List<String> interventions = new ArrayList<>();
        if (hba1c > 5.7) {
            interventions.add("Postprandial Glucose Blunting: 15-minute brisk walk following main meals to activate GLUT-4 muscular glucose uptake.");
        }
        if (lipidRatio > 4.0) {
            interventions.add("ApoB / LDL Clearance: Increase viscous soluble fibers (psyllium, oats) and replace saturated with monounsaturated fats.");
        }
        if (exerciseMins < 150) {
            interventions.add("Zone-2 Aerobic Base: Accumulate 150+ minutes weekly of low-intensity continuous movement to stimulate mitochondrial biogenesis.");
        }
        if (interventions.isEmpty()) {
            interventions.add("Maintain current optimal cardio-metabolic regimen and 7.5 hours of sleep nightly.");
        }

        return new LongevityResponse(score, velocity, bioAge, tier, trajectory, interventions);
    }
}
