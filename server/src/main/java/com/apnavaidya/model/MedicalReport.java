package com.apnavaidya.model;

import java.util.List;

public class MedicalReport {
    private String id;
    private String profileId;
    private String title;
    private String labName;
    private String date;
    private String category;
    private String ocrConfidence;
    private String overallSummary;
    private List<LabParameter> parameters;

    public MedicalReport() {}

    public MedicalReport(String id, String profileId, String title, String labName, String date, 
                         String category, String ocrConfidence, String overallSummary, List<LabParameter> parameters) {
        this.id = id;
        this.profileId = profileId;
        this.title = title;
        this.labName = labName;
        this.date = date;
        this.category = category;
        this.ocrConfidence = ocrConfidence;
        this.overallSummary = overallSummary;
        this.parameters = parameters;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProfileId() { return profileId; }
    public void setProfileId(String profileId) { this.profileId = profileId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOcrConfidence() { return ocrConfidence; }
    public void setOcrConfidence(String ocrConfidence) { this.ocrConfidence = ocrConfidence; }

    public String getOverallSummary() { return overallSummary; }
    public void setOverallSummary(String overallSummary) { this.overallSummary = overallSummary; }

    public List<LabParameter> getParameters() { return parameters; }
    public void setParameters(List<LabParameter> parameters) { this.parameters = parameters; }
}
