package com.apnavaidya.storage.repository;

import com.apnavaidya.model.MedicalReport;
import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Phase 4: Thread-Safe Relational Repository for Medical Diagnostic Reports
 */
public class MedicalReportRepository {

    private final DatabaseManager db;
    private final Map<String, MedicalReport> memoryIndex = new ConcurrentHashMap<>();

    public MedicalReportRepository() {
        this.db = DatabaseManager.getInstance();
        loadAll();
    }

    private synchronized void loadAll() {
        String json = db.loadTableData("reports");
        if (json != null && !json.trim().isEmpty()) {
            List<String> objects = JsonUtil.extractJsonObjects(json);
            for (String obj : objects) {
                MedicalReport rep = new MedicalReport(
                    JsonUtil.extractString(obj, "id"),
                    JsonUtil.extractString(obj, "profileId"),
                    JsonUtil.extractString(obj, "title"),
                    JsonUtil.extractString(obj, "labName"),
                    JsonUtil.extractString(obj, "testDate"),
                    JsonUtil.extractString(obj, "category"),
                    JsonUtil.extractString(obj, "ocrConfidence"),
                    JsonUtil.extractString(obj, "overallSummary"),
                    Collections.emptyList()
                );
                if (rep.getId() != null && !rep.getId().isEmpty()) {
                    memoryIndex.put(rep.getId(), rep);
                }
            }
        }
    }

    public List<MedicalReport> findAll() {
        return new ArrayList<>(memoryIndex.values());
    }

    public List<MedicalReport> findByProfileId(String profileId) {
        List<MedicalReport> results = new ArrayList<>();
        for (MedicalReport r : memoryIndex.values()) {
            if (profileId != null && profileId.equalsIgnoreCase(r.getProfileId())) {
                results.add(r);
            }
        }
        return results;
    }

    public Optional<MedicalReport> findById(String id) {
        return Optional.ofNullable(memoryIndex.get(id));
    }

    public synchronized MedicalReport save(MedicalReport report) {
        if (report.getId() == null || report.getId().isEmpty()) {
            report = new MedicalReport(
                "rep-" + System.currentTimeMillis(),
                report.getProfileId(),
                report.getTitle(),
                report.getLabName(),
                report.getDate(),
                report.getCategory(),
                report.getOcrConfidence(),
                report.getOverallSummary(),
                report.getParameters()
            );
        }
        memoryIndex.put(report.getId(), report);
        flushToDisk();
        return report;
    }

    public synchronized boolean deleteById(String id) {
        MedicalReport removed = memoryIndex.remove(id);
        if (removed != null) {
            flushToDisk();
            return true;
        }
        return false;
    }

    private void flushToDisk() {
        StringBuilder sb = new StringBuilder("[");
        List<MedicalReport> list = new ArrayList<>(memoryIndex.values());
        for (int i = 0; i < list.size(); i++) {
            MedicalReport r = list.get(i);
            sb.append(String.format(
                "{\"id\":\"%s\",\"profileId\":\"%s\",\"title\":\"%s\",\"labName\":\"%s\",\"testDate\":\"%s\",\"category\":\"%s\",\"ocrConfidence\":\"%s\",\"overallSummary\":\"%s\",\"badgeCount\":\"%s\",\"status\":\"%s\"}",
                JsonUtil.escapeJson(r.getId()),
                JsonUtil.escapeJson(r.getProfileId() != null ? r.getProfileId() : "user-arjun"),
                JsonUtil.escapeJson(r.getTitle()),
                JsonUtil.escapeJson(r.getLabName()),
                JsonUtil.escapeJson(r.getDate()),
                JsonUtil.escapeJson(r.getCategory()),
                JsonUtil.escapeJson(r.getOcrConfidence()),
                JsonUtil.escapeJson(r.getOverallSummary()),
                "Normal",
                "Analyzed"
            ));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("reports", sb.toString());
    }
}
