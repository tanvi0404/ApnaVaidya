package com.apnavaidya.storage.repository;

import com.apnavaidya.model.MedicationItem;
import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Relational Repository for Prescription Medications with PostgreSQL & Local JSON fallback.
 */
public class MedicationRepository {

    private final DatabaseManager db;
    private final Map<String, MedicationItem> memoryIndex = new ConcurrentHashMap<>();

    public MedicationRepository() {
        this.db = DatabaseManager.getInstance();
        loadAll();
    }

    private synchronized void loadAll() {
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM medications");
                         ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            String id = rs.getString("id");
                            MedicationItem item = new MedicationItem(
                                id,
                                rs.getString("profile_id"),
                                rs.getString("name"),
                                rs.getString("generic_name"),
                                rs.getString("dosage"),
                                rs.getString("frequency"),
                                rs.getString("timing"),
                                rs.getString("food_instruction"),
                                rs.getString("prescribed_for"),
                                rs.getString("doctor_name"),
                                rs.getInt("remaining_days"),
                                rs.getInt("total_pills"),
                                rs.getInt("remaining_pills"),
                                rs.getBoolean("taken_today")
                            );
                            memoryIndex.put(id, item);
                        }
                        return;
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres medications load error: " + e.getMessage());
                throw new RuntimeException("Failed to load medications from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        // Local JSON fallback
        String json = db.loadTableData("medications");
        if (json != null && !json.trim().isEmpty()) {
            List<String> objects = JsonUtil.extractJsonObjects(json);
            for (String obj : objects) {
                String id = JsonUtil.extractString(obj, "id");
                if (id == null || id.isEmpty()) {
                    id = "med-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
                }
                MedicationItem item = new MedicationItem(
                    id,
                    JsonUtil.extractString(obj, "profileId", "user-default"),
                    JsonUtil.extractString(obj, "name"),
                    JsonUtil.extractString(obj, "genericName"),
                    JsonUtil.extractString(obj, "dosage"),
                    JsonUtil.extractString(obj, "frequency"),
                    JsonUtil.extractString(obj, "timing"),
                    JsonUtil.extractString(obj, "foodInstruction"),
                    JsonUtil.extractString(obj, "prescribedFor"),
                    JsonUtil.extractString(obj, "doctorName"),
                    JsonUtil.extractInt(obj, "remainingDays", 30),
                    JsonUtil.extractInt(obj, "totalPills", 60),
                    JsonUtil.extractInt(obj, "remainingPills", 45),
                    JsonUtil.extractBoolean(obj, "takenToday", false)
                );
                memoryIndex.put(item.getId(), item);
            }
        }
    }

    public List<MedicationItem> findAll() {
        return new ArrayList<>(memoryIndex.values());
    }

    public List<MedicationItem> findByProfileId(String profileId) {
        List<MedicationItem> results = new ArrayList<>();
        for (MedicationItem m : memoryIndex.values()) {
            if (profileId != null && profileId.equalsIgnoreCase(m.getProfileId())) {
                results.add(m);
            }
        }
        return results;
    }

    public Optional<MedicationItem> findById(String id) {
        return Optional.ofNullable(memoryIndex.get(id));
    }

    public synchronized MedicationItem save(MedicationItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId("med-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000));
        }
        memoryIndex.put(item.getId(), item);

        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO medications (id, profile_id, name, generic_name, dosage, frequency, timing, food_instruction, prescribed_for, doctor_name, remaining_days, total_pills, remaining_pills, taken_today, created_at) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
                        + "ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, generic_name = EXCLUDED.generic_name, dosage = EXCLUDED.dosage, "
                        + "frequency = EXCLUDED.frequency, timing = EXCLUDED.timing, food_instruction = EXCLUDED.food_instruction, "
                        + "remaining_days = EXCLUDED.remaining_days, total_pills = EXCLUDED.total_pills, remaining_pills = EXCLUDED.remaining_pills, taken_today = EXCLUDED.taken_today"
                    )) {
                        ps.setString(1, item.getId());
                        ps.setString(2, item.getProfileId() != null ? item.getProfileId() : "user-default");
                        ps.setString(3, item.getName());
                        ps.setString(4, item.getGenericName());
                        ps.setString(5, item.getDosage());
                        ps.setString(6, item.getFrequency());
                        ps.setString(7, item.getTiming());
                        ps.setString(8, item.getFoodInstruction());
                        ps.setString(9, item.getPrescribedFor());
                        ps.setString(10, item.getDoctorName());
                        ps.setInt(11, item.getRemainingDays());
                        ps.setInt(12, item.getTotalPills());
                        ps.setInt(13, item.getRemainingPills());
                        ps.setBoolean(14, item.isTakenToday());
                        ps.setString(15, java.time.Instant.now().toString());
                        ps.executeUpdate();
                    }
                    return item;
                }
            } catch (Exception e) {
                System.err.println("Postgres save medication error: " + e.getMessage());
                throw new RuntimeException("Failed to save medication to PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        flushToDisk();
        return item;
    }

    public synchronized boolean toggleTakenToday(String id) {
        MedicationItem m = memoryIndex.get(id);
        if (m != null) {
            m.setTakenToday(!m.isTakenToday());
            if (db.isPostgres()) {
                Connection conn = null;
                try {
                    conn = db.getConnection();
                    if (conn != null) {
                        try (PreparedStatement ps = conn.prepareStatement("UPDATE medications SET taken_today = ? WHERE id = ?")) {
                            ps.setBoolean(1, m.isTakenToday());
                            ps.setString(2, id);
                            ps.executeUpdate();
                        }
                        return true;
                    }
                } catch (Exception e) {
                    System.err.println("Postgres toggle medication error: " + e.getMessage());
                    throw new RuntimeException("Failed to update medication adherence in PostgreSQL", e);
                } finally {
                    db.releaseConnection(conn);
                }
            }
            flushToDisk();
            return true;
        }
        return false;
    }

    public synchronized boolean deleteById(String id) {
        MedicationItem removed = memoryIndex.remove(id);
        if (removed != null) {
            if (db.isPostgres()) {
                Connection conn = null;
                try {
                    conn = db.getConnection();
                    if (conn != null) {
                        try (PreparedStatement ps = conn.prepareStatement("DELETE FROM medications WHERE id = ?")) {
                            ps.setString(1, id);
                            ps.executeUpdate();
                        }
                        return true;
                    }
                } catch (Exception e) {
                    System.err.println("Postgres delete medication error: " + e.getMessage());
                    throw new RuntimeException("Failed to delete medication from PostgreSQL", e);
                } finally {
                    db.releaseConnection(conn);
                }
            }
            flushToDisk();
            return true;
        }
        return false;
    }

    private void flushToDisk() {
        StringBuilder sb = new StringBuilder("[");
        List<MedicationItem> list = new ArrayList<>(memoryIndex.values());
        for (int i = 0; i < list.size(); i++) {
            MedicationItem m = list.get(i);
            sb.append(String.format(
                "{\"id\":\"%s\",\"profileId\":\"%s\",\"name\":\"%s\",\"genericName\":\"%s\",\"dosage\":\"%s\",\"frequency\":\"%s\",\"timing\":\"%s\",\"foodInstruction\":\"%s\",\"prescribedFor\":\"%s\",\"doctorName\":\"%s\",\"remainingDays\":%d,\"totalPills\":%d,\"remainingPills\":%d,\"takenToday\":%b}",
                JsonUtil.escapeJson(m.getId()),
                JsonUtil.escapeJson(m.getProfileId() != null ? m.getProfileId() : "user-default"),
                JsonUtil.escapeJson(m.getName()),
                JsonUtil.escapeJson(m.getGenericName()),
                JsonUtil.escapeJson(m.getDosage()),
                JsonUtil.escapeJson(m.getFrequency()),
                JsonUtil.escapeJson(m.getTiming()),
                JsonUtil.escapeJson(m.getFoodInstruction()),
                JsonUtil.escapeJson(m.getPrescribedFor()),
                JsonUtil.escapeJson(m.getDoctorName()),
                m.getRemainingDays(),
                m.getTotalPills(),
                m.getRemainingPills(),
                m.isTakenToday()
            ));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("medications", sb.toString());
    }
}
