package com.apnavaidya.model;

import java.util.List;
import java.util.Map;

public class ChatResponse {
    private String id;
    private String role;
    private String content;
    private String text;
    private boolean isEmergency;
    private List<String> citations;
    private Map<String, String> explainability;

    public ChatResponse() {}

    public ChatResponse(String id, String role, String content, boolean isEmergency, 
                        List<String> citations, Map<String, String> explainability) {
        this.id = id;
        this.role = role;
        this.content = content;
        this.text = content;
        this.isEmergency = isEmergency;
        this.citations = citations;
        this.explainability = explainability;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { 
        this.content = content; 
        this.text = content;
    }

    public String getText() { return text; }
    public void setText(String text) { 
        this.text = text;
        this.content = text;
    }

    public boolean isEmergency() { return isEmergency; }
    public void setEmergency(boolean emergency) { isEmergency = emergency; }

    public List<String> getCitations() { return citations; }
    public void setCitations(List<String> citations) { this.citations = citations; }

    public Map<String, String> getExplainability() { return explainability; }
    public void setExplainability(Map<String, String> explainability) { this.explainability = explainability; }
}
