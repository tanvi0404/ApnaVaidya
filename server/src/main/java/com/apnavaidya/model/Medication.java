package com.apnavaidya.model;

public class Medication {
    private String id;
    private String name;
    private String dosage;
    private String form;
    private String frequency;
    private String timeSlot;
    private String mealTiming;
    private String purpose;
    private String startDate;
    private int totalPills;
    private int remainingPills;
    private int refillThreshold;
    private String status; // taken, pending
    private String prescribedBy;

    public Medication() {}

    public Medication(String id, String name, String dosage, String form, String frequency, 
                      String timeSlot, String mealTiming, String purpose, String startDate, 
                      int totalPills, int remainingPills, int refillThreshold, String status, String prescribedBy) {
        this.id = id;
        this.name = name;
        this.dosage = dosage;
        this.form = form;
        this.frequency = frequency;
        this.timeSlot = timeSlot;
        this.mealTiming = mealTiming;
        this.purpose = purpose;
        this.startDate = startDate;
        this.totalPills = totalPills;
        this.remainingPills = remainingPills;
        this.refillThreshold = refillThreshold;
        this.status = status;
        this.prescribedBy = prescribedBy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getForm() { return form; }
    public void setForm(String form) { this.form = form; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getMealTiming() { return mealTiming; }
    public void setMealTiming(String mealTiming) { this.mealTiming = mealTiming; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public int getTotalPills() { return totalPills; }
    public void setTotalPills(int totalPills) { this.totalPills = totalPills; }

    public int getRemainingPills() { return remainingPills; }
    public void setRemainingPills(int remainingPills) { this.remainingPills = remainingPills; }

    public int getRefillThreshold() { return refillThreshold; }
    public void setRefillThreshold(int refillThreshold) { this.refillThreshold = refillThreshold; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPrescribedBy() { return prescribedBy; }
    public void setPrescribedBy(String prescribedBy) { this.prescribedBy = prescribedBy; }
}
