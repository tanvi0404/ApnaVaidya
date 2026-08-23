package com.apnavaidya.storage.repository;

import com.apnavaidya.model.MedicalReport;
import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Relational Repository for Medical Diagnostic Reports with PostgreSQL & Local JSON fallback.
 */
public class MedicalReportRepository {

    private final DatabaseManager db;
    private final Map<String, MedicalReport> memoryIndex = new ConcurrentHashMap<>();

    public MedicalReportRepository() {
        this.db = DatabaseManager.getInstance();
        loadAll();
    }

    private synchronized void loadAll() {
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM medical_reports");
                         ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            String id = rs.getString("id");
                            MedicalReport rep = new MedicalReport(
                                id,
                                rs.getString("profile_id"),
                                rs.getString("title"),
                                rs.getString("lab_name"),
                                rs.getString("test_date"),
                                rs.getString("category"),
                                rs.getString("ocr_confidence"),
                                rs.getString("summary_text"),
                                Collections.emptyList()
                            );
                            if (id != null && !id.isEmpty()) {
                                memoryIndex.put(id, rep);
                            }
                        }
                        return;
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres reports load error: " + e.getMessage());
                throw new RuntimeException("Failed to load medical reports from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        // Local JSON fallback
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
        if (profileId == null || profileId.trim().isEmpty()) return Collections.emptyList();

        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM medical_reports WHERE profile_id = ? ORDER BY id DESC")) {
                        ps.setString(1, profileId.trim());
                        try (ResultSet rs = ps.executeQuery()) {
                            List<MedicalReport> list = new ArrayList<>();
                            while (rs.next()) {
                                String id = rs.getString("id");
                                MedicalReport rep = new MedicalReport(
                                    id,
                                    rs.getString("profile_id"),
                                    rs.getString("title"),
                                    rs.getString("lab_name"),
                                    rs.getString("test_date"),
                                    rs.getString("category"),
                                    rs.getString("ocr_confidence"),
                                    rs.getString("summary_text"),
                                    Collections.emptyList()
                                );
                                list.add(rep);
                                if (id != null && !id.isEmpty()) {
                                    memoryIndex.put(id, rep);
                                }
                            }
                            return list;
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres reports findByProfileId error: " + e.getMessage());
                throw new RuntimeException("Failed to query medical reports from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        List<MedicalReport> results = new ArrayList<>();
        for (MedicalReport r : memoryIndex.values()) {
            if (profileId.equalsIgnoreCase(r.getProfileId())) {
                results.add(r);
            }
        }
        return results;
    }

    public Optional<MedicalReport> findById(String id) {
        if (id == null || id.isEmpty()) return Optional.empty();
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM medical_reports WHERE id = ?")) {
                        ps.setString(1, id.trim());
                        try (ResultSet rs = ps.executeQuery()) {
                            if (rs.next()) {
                                MedicalReport rep = new MedicalReport(
                                    rs.getString("id"),
                                    rs.getString("profile_id"),
                                    rs.getString("title"),
                                    rs.getString("lab_name"),
                                    rs.getString("test_date"),
                                    rs.getString("category"),
                                    rs.getString("ocr_confidence"),
                                    rs.getString("summary_text"),
                                    Collections.emptyList()
                                );
                                memoryIndex.put(id, rep);
                                return Optional.of(rep);
                            }
                            return Optional.empty();
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres reports findById error: " + e.getMessage());
                throw new RuntimeException("Failed to query medical report from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }
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

        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO medical_reports (id, profile_id, title, category, lab_name, test_date, upload_date, status, summary_text, ocr_confidence, parameters_json, created_at) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
                        + "ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category, lab_name = EXCLUDED.lab_name, "
                        + "test_date = EXCLUDED.test_date, status = EXCLUDED.status, summary_text = EXCLUDED.summary_text, ocr_confidence = EXCLUDED.ocr_confidence"
                    )) {
                        ps.setString(1, report.getId());
                        ps.setString(2, report.getProfileId() != null ? report.getProfileId() : "user-default");
                        ps.setString(3, report.getTitle());
                        ps.setString(4, report.getCategory());
                        ps.setString(5, report.getLabName());
                        ps.setString(6, report.getDate());
                        ps.setString(7, java.time.LocalDate.now().toString());
                        ps.setString(8, "Analyzed");
                        ps.setString(9, report.getOverallSummary());
                        ps.setString(10, report.getOcrConfidence());
                        ps.setString(11, "[]");
                        ps.setString(12, java.time.Instant.now().toString());
                        ps.executeUpdate();
                    }
                    return report;
                }
            } catch (Exception e) {
                System.err.println("Postgres save report error: " + e.getMessage());
                throw new RuntimeException("Failed to save medical report to PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        flushToDisk();
        return report;
    }

    public synchronized boolean deleteById(String id) {
        return deleteById(id, null);
    }

    public synchronized boolean deleteById(String id, String profileId) {
        if (id == null || id.isEmpty()) return false;
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    String sql = (profileId != null && !profileId.trim().isEmpty())
                        ? "DELETE FROM medical_reports WHERE id = ? AND profile_id = ?"
                        : "DELETE FROM medical_reports WHERE id = ?";
                    try (PreparedStatement ps = conn.prepareStatement(sql)) {
                        ps.setString(1, id);
                        if (profileId != null && !profileId.trim().isEmpty()) {
                            ps.setString(2, profileId.trim());
                        }
                        int affected = ps.executeUpdate();
                        memoryIndex.remove(id);
                        return affected > 0;
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres delete report error: " + e.getMessage());
                throw new RuntimeException("Failed to delete medical report from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }
        MedicalReport removed = memoryIndex.get(id);
        if (removed != null && (profileId == null || profileId.equalsIgnoreCase(removed.getProfileId()))) {
            memoryIndex.remove(id);
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
                JsonUtil.escapeJson(r.getProfileId() != null ? r.getProfileId() : "user-default"),
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
