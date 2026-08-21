package com.apnavaidya.model;

import java.util.List;

public class VascularResponse {
    private int chronologicalAge;
    private int estimatedVascularAge;
    private int ageDelta;
    private double epwv;
    private double pulsePressure;
    private double cholHdlRatio;
    private String stiffnessLabel;
    private String stiffnessColor;
    private List<String> recommendations;

    public VascularResponse() {}

    public VascularResponse(int chronologicalAge, int estimatedVascularAge, int ageDelta, 
                            double epwv, double pulsePressure, double cholHdlRatio, 
                            String stiffnessLabel, String stiffnessColor, List<String> recommendations) {
        this.chronologicalAge = chronologicalAge;
        this.estimatedVascularAge = estimatedVascularAge;
        this.ageDelta = ageDelta;
        this.epwv = epwv;
        this.pulsePressure = pulsePressure;
        this.cholHdlRatio = cholHdlRatio;
        this.stiffnessLabel = stiffnessLabel;
        this.stiffnessColor = stiffnessColor;
        this.recommendations = recommendations;
    }

    public int getChronologicalAge() { return chronologicalAge; }
    public void setChronologicalAge(int chronologicalAge) { this.chronologicalAge = chronologicalAge; }

    public int getEstimatedVascularAge() { return estimatedVascularAge; }
    public void setEstimatedVascularAge(int estimatedVascularAge) { this.estimatedVascularAge = estimatedVascularAge; }

    public int getAgeDelta() { return ageDelta; }
    public void setAgeDelta(int ageDelta) { this.ageDelta = ageDelta; }

    public double getEpwv() { return epwv; }
    public void setEpwv(double epwv) { this.epwv = epwv; }

    public double getPulsePressure() { return pulsePressure; }
    public void setPulsePressure(double pulsePressure) { this.pulsePressure = pulsePressure; }

    public double getCholHdlRatio() { return cholHdlRatio; }
    public void setCholHdlRatio(double cholHdlRatio) { this.cholHdlRatio = cholHdlRatio; }

    public String getStiffnessLabel() { return stiffnessLabel; }
    public void setStiffnessLabel(String stiffnessLabel) { this.stiffnessLabel = stiffnessLabel; }

    public String getStiffnessColor() { return stiffnessColor; }
    public void setStiffnessColor(String stiffnessColor) { this.stiffnessColor = stiffnessColor; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
}
