package com.apnavaidya.model;

public class LabParameter {
    private String id;
    private String name;
    private double value;
    private String unit;
    private double minNormal;
    private double maxNormal;
    private String status; // NORMAL, HIGH, LOW, CRITICAL
    private String plainDescription;
    private String clinicalCitation;

    public LabParameter() {}

    public LabParameter(String id, String name, double value, String unit, double minNormal, 
                        double maxNormal, String status, String plainDescription, String clinicalCitation) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.unit = unit;
        this.minNormal = minNormal;
        this.maxNormal = maxNormal;
        this.status = status;
        this.plainDescription = plainDescription;
        this.clinicalCitation = clinicalCitation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public double getMinNormal() { return minNormal; }
    public void setMinNormal(double minNormal) { this.minNormal = minNormal; }

    public double getMaxNormal() { return maxNormal; }
    public void setMaxNormal(double maxNormal) { this.maxNormal = maxNormal; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPlainDescription() { return plainDescription; }
    public void setPlainDescription(String plainDescription) { this.plainDescription = plainDescription; }

    public String getClinicalCitation() { return clinicalCitation; }
    public void setClinicalCitation(String clinicalCitation) { this.clinicalCitation = clinicalCitation; }
}
