package com.apnavaidya.model;

import java.util.List;
import java.util.Map;

public class ChatRequest {
    private String userMessage;
    private String language; // en, hi, hg, pb
    private String profileName;
    private int profileAge;
    private String profileGender;
    private List<String> conditions;
    private String reportContext;

    public ChatRequest() {}

    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }

    public String getLanguage() { return language != null ? language : "en"; }
    public void setLanguage(String language) { this.language = language; }

    public String getProfileName() { return profileName != null ? profileName : "User"; }
    public void setProfileName(String profileName) { this.profileName = profileName; }

    public int getProfileAge() { return profileAge > 0 ? profileAge : 30; }
    public void setProfileAge(int profileAge) { this.profileAge = profileAge; }

    public String getProfileGender() { return profileGender != null ? profileGender : "Male"; }
    public void setProfileGender(String profileGender) { this.profileGender = profileGender; }

    public List<String> getConditions() { return conditions; }
    public void setConditions(List<String> conditions) { this.conditions = conditions; }

    public String getReportContext() { return reportContext; }
    public void setReportContext(String reportContext) { this.reportContext = reportContext; }
}
