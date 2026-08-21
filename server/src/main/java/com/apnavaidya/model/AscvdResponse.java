package com.apnavaidya.model;

public class AscvdResponse {
    private double riskPercent;
    private String category;
    private String categoryLabel;
    private String recommendation;
    private String clinicalSource;

    public AscvdResponse() {}

    public AscvdResponse(double riskPercent, String category, String categoryLabel, 
                         String recommendation, String clinicalSource) {
        this.riskPercent = riskPercent;
        this.category = category;
        this.categoryLabel = categoryLabel;
        this.recommendation = recommendation;
        this.clinicalSource = clinicalSource;
    }

    public double getRiskPercent() { return riskPercent; }
    public void setRiskPercent(double riskPercent) { this.riskPercent = riskPercent; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryLabel() { return categoryLabel; }
    public void setCategoryLabel(String categoryLabel) { this.categoryLabel = categoryLabel; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getClinicalSource() { return clinicalSource; }
    public void setClinicalSource(String clinicalSource) { this.clinicalSource = clinicalSource; }
}
