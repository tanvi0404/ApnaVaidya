package com.apnavaidya.model;

public class MedicationItem {
    private String id;
    private String profileId;
    private String name;
    private String genericName;
    private String dosage;
    private String frequency;
    private String timing;
    private String foodInstruction;
    private String prescribedFor;
    private String doctorName;
    private int remainingDays;
    private int totalPills;
    private int remainingPills;
    private boolean takenToday;

    public MedicationItem() {}

    public MedicationItem(String id, String profileId, String name, String genericName, String dosage, 
                          String frequency, String timing, String foodInstruction, String prescribedFor, 
                          String doctorName, int remainingDays, int totalPills, int remainingPills, boolean takenToday) {
        this.id = id;
        this.profileId = profileId;
        this.name = name;
        this.genericName = genericName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.timing = timing;
        this.foodInstruction = foodInstruction;
        this.prescribedFor = prescribedFor;
        this.doctorName = doctorName;
        this.remainingDays = remainingDays;
        this.totalPills = totalPills;
        this.remainingPills = remainingPills;
        this.takenToday = takenToday;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProfileId() { return profileId; }
    public void setProfileId(String profileId) { this.profileId = profileId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }

    public String getFoodInstruction() { return foodInstruction; }
    public void setFoodInstruction(String foodInstruction) { this.foodInstruction = foodInstruction; }

    public String getPrescribedFor() { return prescribedFor; }
    public void setPrescribedFor(String prescribedFor) { this.prescribedFor = prescribedFor; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public int getRemainingDays() { return remainingDays; }
    public void setRemainingDays(int remainingDays) { this.remainingDays = remainingDays; }

    public int getTotalPills() { return totalPills; }
    public void setTotalPills(int totalPills) { this.totalPills = totalPills; }

    public int getRemainingPills() { return remainingPills; }
    public void setRemainingPills(int remainingPills) { this.remainingPills = remainingPills; }

    public boolean isTakenToday() { return takenToday; }
    public void setTakenToday(boolean takenToday) { this.takenToday = takenToday; }
}
