package com.apnavaidya.service;

import com.apnavaidya.model.VascularRequest;
import com.apnavaidya.model.VascularResponse;

import java.util.Arrays;
import java.util.List;

public class VascularService {

    public VascularResponse calculateVascularAge(VascularRequest req) {
        int age = req.getChronologicalAge();
        double sbp = req.getSystolicBp();
        double dbp = req.getDiastolicBp();
        double tc = req.getTotalChol();
        double hdl = req.getHdlChol();
        int hr = req.getRestingHr();
        boolean smoker = req.isSmoker();

        double pulsePressure = sbp - dbp;
        double cholHdlRatio = Double.parseDouble(String.format("%.1f", tc / (hdl > 0 ? hdl : 1.0)));

        double offset = 0.0;
        if (sbp >= 140) offset += 7.0;
        else if (sbp >= 130) offset += 3.5;
        else if (sbp < 115) offset -= 2.0;

        if (pulsePressure > 50) offset += 3.0;
        if (cholHdlRatio > 5.0) offset += 4.0;
        else if (cholHdlRatio < 3.5) offset -= 2.0;

        if (hr > 80) offset += 2.0;
        else if (hr < 62) offset -= 2.0;

        if (smoker) offset += 8.0;

        int estimatedVascularAge = Math.max(18, (int) Math.round(age + offset));
        int ageDelta = estimatedVascularAge - age;

        double mbp = dbp + (pulsePressure / 3.0);
        double rawPwv = 6.0 + (age * 0.05) + (mbp * 0.02) + (offset * 0.1);
        double epwv = Double.parseDouble(String.format("%.1f", rawPwv));

        String stiffnessLabel = "Optimal Elasticity";
        String stiffnessColor = "emerald";
        if (epwv >= 10.0) {
            stiffnessLabel = "Elevated Arterial Stiffness";
            stiffnessColor = "rose";
        } else if (epwv >= 8.0) {
            stiffnessLabel = "Mild Age-Related Hardening";
            stiffnessColor = "amber";
        }

        List<String> recommendations = Arrays.asList(
            "Increase dietary nitrates (beetroot, spinach, arugula) to boost endothelial Nitric Oxide (NO) synthesis.",
            "Maintain 150 minutes of Zone-2 aerobic movement weekly to preserve aortic compliance.",
            "Target sodium intake below 2.0g/day and increase potassium to optimize pulse pressure."
        );

        return new VascularResponse(
            age,
            estimatedVascularAge,
            ageDelta,
            epwv,
            pulsePressure,
            cholHdlRatio,
            stiffnessLabel,
            stiffnessColor,
            recommendations
        );
    }
}
