package com.apnavaidya.model;

import java.util.List;

public class FamilyProfile {
    private String id;
    private String name;
    private String relationship;
    private int age;
    private String gender;
    private String bloodGroup;
    private String weight;
    private double bmi;
    private String avatarInitials;
    private String avatarColor;
    private List<String> conditions;
    private List<String> allergies;
    private List<String> goals;
    private String dietPreference;

    public FamilyProfile() {}

    public FamilyProfile(String id, String name, String relationship, int age, String gender, 
                         String bloodGroup, String weight, double bmi, String avatarInitials, 
                         String avatarColor, List<String> conditions, List<String> allergies, 
                         List<String> goals, String dietPreference) {
        this.id = id;
        this.name = name;
        this.relationship = relationship;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.weight = weight;
        this.bmi = bmi;
        this.avatarInitials = avatarInitials;
        this.avatarColor = avatarColor;
        this.conditions = conditions;
        this.allergies = allergies;
        this.goals = goals;
        this.dietPreference = dietPreference;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public double getBmi() { return bmi; }
    public void setBmi(double bmi) { this.bmi = bmi; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }

    public String getAvatarColor() { return avatarColor; }
    public void setAvatarColor(String avatarColor) { this.avatarColor = avatarColor; }

    public List<String> getConditions() { return conditions; }
    public void setConditions(List<String> conditions) { this.conditions = conditions; }

    public List<String> getAllergies() { return allergies; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }

    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }

    public String getDietPreference() { return dietPreference; }
    public void setDietPreference(String dietPreference) { this.dietPreference = dietPreference; }
}
