package com.apnavaidya.storage.repository;

import com.apnavaidya.model.FamilyProfile;
import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-Safe Relational Repository for Family Profiles
 * Backed by PostgreSQL in production with local JSON fallback.
 */
public class FamilyProfileRepository {

    private final DatabaseManager db;
    private final Map<String, FamilyProfile> memoryIndex = new ConcurrentHashMap<>();

    public FamilyProfileRepository() {
        this.db = DatabaseManager.getInstance();
        loadAll();
    }

    private synchronized void loadAll() {
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM family_profiles");
                         ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            String id = rs.getString("id");
                            FamilyProfile profile = new FamilyProfile(
                                id,
                                rs.getString("name"),
                                rs.getString("relationship"),
                                rs.getInt("age"),
                                rs.getString("gender"),
                                rs.getString("blood_group"),
                                rs.getString("weight"),
                                rs.getDouble("bmi"),
                                rs.getString("avatar_initials"),
                                rs.getString("avatar_color"),
                                Collections.emptyList(),
                                Collections.emptyList(),
                                Collections.emptyList(),
                                rs.getString("diet_preference")
                            );
                            if (id != null && !id.isEmpty()) {
                                memoryIndex.put(id, profile);
                            }
                        }
                        return;
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres family_profiles load error: " + e.getMessage());
                throw new RuntimeException("Failed to load family profiles from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        // Local JSON fallback
        String json = db.loadTableData("family_profiles");
        if (json != null && !json.trim().isEmpty()) {
            List<String> objects = JsonUtil.extractJsonObjects(json);
            for (String obj : objects) {
                String id = JsonUtil.extractString(obj, "id");
                if (id == null || id.isEmpty()) continue;
                FamilyProfile profile = new FamilyProfile(
                    id,
                    JsonUtil.extractString(obj, "name"),
                    JsonUtil.extractString(obj, "relationship"),
                    JsonUtil.extractInt(obj, "age", 30),
                    JsonUtil.extractString(obj, "gender"),
                    JsonUtil.extractString(obj, "bloodGroup"),
                    JsonUtil.extractString(obj, "weight"),
                    22.0,
                    JsonUtil.extractString(obj, "avatarInitials"),
                    JsonUtil.extractString(obj, "avatarColor"),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    JsonUtil.extractString(obj, "dietPreference")
                );
                memoryIndex.put(id, profile);
            }
        }
    }

    public List<FamilyProfile> findAll() {
        return new ArrayList<>(memoryIndex.values());
    }

    public Optional<FamilyProfile> findById(String id) {
        return Optional.ofNullable(memoryIndex.get(id));
    }

    public synchronized FamilyProfile save(FamilyProfile profile) {
        if (profile.getId() == null || profile.getId().isEmpty()) {
            profile.setId("profile-" + System.currentTimeMillis());
        }
        memoryIndex.put(profile.getId(), profile);

        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO family_profiles (id, user_id, name, relationship, age, gender, blood_group, weight, bmi, avatar_initials, avatar_color, conditions_json, allergies_json, goals_json, diet_preference, created_at) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
                        + "ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, relationship = EXCLUDED.relationship, age = EXCLUDED.age, "
                        + "gender = EXCLUDED.gender, blood_group = EXCLUDED.blood_group, weight = EXCLUDED.weight, bmi = EXCLUDED.bmi, "
                        + "avatar_initials = EXCLUDED.avatar_initials, avatar_color = EXCLUDED.avatar_color, diet_preference = EXCLUDED.diet_preference"
                    )) {
                        ps.setString(1, profile.getId());
                        ps.setString(2, "user-arjun");
                        ps.setString(3, profile.getName());
                        ps.setString(4, profile.getRelationship());
                        ps.setInt(5, profile.getAge());
                        ps.setString(6, profile.getGender());
                        ps.setString(7, profile.getBloodGroup());
                        ps.setString(8, profile.getWeight());
                        ps.setDouble(9, profile.getBmi());
                        ps.setString(10, profile.getAvatarInitials());
                        ps.setString(11, profile.getAvatarColor());
                        ps.setString(12, "[]");
                        ps.setString(13, "[]");
                        ps.setString(14, "[]");
                        ps.setString(15, profile.getDietPreference());
                        ps.setString(16, java.time.Instant.now().toString());
                        ps.executeUpdate();
                    }
                    return profile;
                }
            } catch (Exception e) {
                System.err.println("Postgres save family profile error: " + e.getMessage());
                throw new RuntimeException("Failed to save family profile to PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        flushToDisk();
        return profile;
    }

    private void flushToDisk() {
        StringBuilder sb = new StringBuilder("[");
        List<FamilyProfile> list = new ArrayList<>(memoryIndex.values());
        for (int i = 0; i < list.size(); i++) {
            FamilyProfile p = list.get(i);
            sb.append(String.format(
                "{\"id\":\"%s\",\"name\":\"%s\",\"relationship\":\"%s\",\"age\":%d,\"gender\":\"%s\",\"bloodGroup\":\"%s\",\"weight\":\"%s\",\"bmi\":%.1f,\"avatarInitials\":\"%s\",\"avatarColor\":\"%s\",\"dietPreference\":\"%s\"}",
                JsonUtil.escapeJson(p.getId()),
                JsonUtil.escapeJson(p.getName()),
                JsonUtil.escapeJson(p.getRelationship()),
                p.getAge(),
                JsonUtil.escapeJson(p.getGender()),
                JsonUtil.escapeJson(p.getBloodGroup()),
                JsonUtil.escapeJson(p.getWeight()),
                p.getBmi(),
                JsonUtil.escapeJson(p.getAvatarInitials()),
                JsonUtil.escapeJson(p.getAvatarColor()),
                JsonUtil.escapeJson(p.getDietPreference())
            ));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("family_profiles", sb.toString());
    }
}
