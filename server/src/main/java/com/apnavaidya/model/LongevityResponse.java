package com.apnavaidya.model;

import java.util.List;

public class LongevityResponse {
    private int compositeScore;
    private double agingVelocity;
    private double estimatedBiologicalAge;
    private String statusTier;
    private String agingTrajectory;
    private List<String> priorityInterventions;

    public LongevityResponse() {}

    public LongevityResponse(int compositeScore, double agingVelocity, double estimatedBiologicalAge, 
                             String statusTier, String agingTrajectory, List<String> priorityInterventions) {
        this.compositeScore = compositeScore;
        this.agingVelocity = agingVelocity;
        this.estimatedBiologicalAge = estimatedBiologicalAge;
        this.statusTier = statusTier;
        this.agingTrajectory = agingTrajectory;
        this.priorityInterventions = priorityInterventions;
    }

    public int getCompositeScore() { return compositeScore; }
    public void setCompositeScore(int compositeScore) { this.compositeScore = compositeScore; }

    public double getAgingVelocity() { return agingVelocity; }
    public void setAgingVelocity(double agingVelocity) { this.agingVelocity = agingVelocity; }

    public double getEstimatedBiologicalAge() { return estimatedBiologicalAge; }
    public void setEstimatedBiologicalAge(double estimatedBiologicalAge) { this.estimatedBiologicalAge = estimatedBiologicalAge; }

    public String getStatusTier() { return statusTier; }
    public void setStatusTier(String statusTier) { this.statusTier = statusTier; }

    public String getAgingTrajectory() { return agingTrajectory; }
    public void setAgingTrajectory(String agingTrajectory) { this.agingTrajectory = agingTrajectory; }

    public List<String> getPriorityInterventions() { return priorityInterventions; }
    public void setPriorityInterventions(List<String> priorityInterventions) { this.priorityInterventions = priorityInterventions; }
}
