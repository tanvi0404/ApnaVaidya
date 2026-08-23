package com.apnavaidya.storage.repository;

import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-Safe User Repository supporting PostgreSQL Relational Database with Local JSON Fallback.
 * All sensitive fields (passwordHash, salt, bloodGroup, address) are transparently AES-256 GCM encrypted at rest.
 */
public class UserRepository {

    public static class UserEntity {
        private String id;
        private String name;
        private String email;
        private String mobile;
        private String passwordHash; // Encrypted at rest
        private String salt;         // Encrypted at rest
        private int age;
        private String gender;
        private String place;
        private String address;      // Encrypted at rest
        private String bloodGroup;   // Encrypted at rest
        private String dietPreference;
        private String createdAt;

        public UserEntity() {}

        public UserEntity(String id, String name, String email, String mobile, String passwordHash, String salt,
                          int age, String gender, String place, String address, String bloodGroup,
                          String dietPreference, String createdAt) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.mobile = mobile;
            this.passwordHash = passwordHash;
            this.salt = salt;
            this.age = age;
            this.gender = gender;
            this.place = place;
            this.address = address;
            this.bloodGroup = bloodGroup;
            this.dietPreference = dietPreference;
            this.createdAt = createdAt;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getMobile() { return mobile; }
        public String getPasswordHash() { return passwordHash; }
        public String getSalt() { return salt; }
        public int getAge() { return age; }
        public String getGender() { return gender; }
        public String getPlace() { return place; }
        public String getAddress() { return address; }
        public String getBloodGroup() { return bloodGroup; }
        public String getDietPreference() { return dietPreference; }
        public String getCreatedAt() { return createdAt; }

        public void setPasswordHash(String hash) { this.passwordHash = hash; }
        public void setSalt(String salt) { this.salt = salt; }
    }

    private final DatabaseManager db;
    private final Map<String, UserEntity> memoryIndex = new ConcurrentHashMap<>();

    public UserRepository() {
        this.db = DatabaseManager.getInstance();
        loadAll();
    }

    private synchronized void loadAll() {
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM users");
                         ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            String id = rs.getString("id");
                            UserEntity user = new UserEntity(
                                id,
                                rs.getString("name"),
                                rs.getString("email"),
                                rs.getString("mobile"),
                                DatabaseManager.decryptField(rs.getString("password_hash")),
                                DatabaseManager.decryptField(rs.getString("salt")),
                                rs.getInt("age"),
                                rs.getString("gender"),
                                rs.getString("place"),
                                DatabaseManager.decryptField(rs.getString("address")),
                                DatabaseManager.decryptField(rs.getString("blood_group")),
                                rs.getString("diet_preference"),
                                rs.getString("created_at")
                            );
                            memoryIndex.put(id, user);
                        }
                        return;
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres users load error: " + e.getMessage());
                throw new RuntimeException("Failed to load users from PostgreSQL production database", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        // Local JSON fallback
        String json = db.loadTableData("users");
        if (json != null && !json.trim().isEmpty()) {
            List<String> objects = JsonUtil.extractJsonObjects(json);
            for (String obj : objects) {
                String id = JsonUtil.extractString(obj, "id");
                if (id == null || id.isEmpty()) continue;

                UserEntity user = new UserEntity(
                    id,
                    JsonUtil.extractString(obj, "name"),
                    JsonUtil.extractString(obj, "email"),
                    JsonUtil.extractString(obj, "mobile"),
                    DatabaseManager.decryptField(JsonUtil.extractString(obj, "passwordHash")),
                    DatabaseManager.decryptField(JsonUtil.extractString(obj, "salt")),
                    JsonUtil.extractInt(obj, "age", 30),
                    JsonUtil.extractString(obj, "gender"),
                    JsonUtil.extractString(obj, "place"),
                    DatabaseManager.decryptField(JsonUtil.extractString(obj, "address")),
                    DatabaseManager.decryptField(JsonUtil.extractString(obj, "bloodGroup")),
                    JsonUtil.extractString(obj, "dietPreference"),
                    JsonUtil.extractString(obj, "createdAt")
                );
                memoryIndex.put(user.getId(), user);
            }
        }
    }

    public List<UserEntity> findAll() {
        return new ArrayList<>(memoryIndex.values());
    }

    public Optional<UserEntity> findById(String id) {
        return Optional.ofNullable(memoryIndex.get(id));
    }

    public Optional<UserEntity> findByEmailOrMobile(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) return Optional.empty();
        String cleanInput = identifier.replaceAll("[^0-9]", "");
        for (UserEntity u : memoryIndex.values()) {
            if (identifier.equalsIgnoreCase(u.getEmail())) return Optional.of(u);
            if (!cleanInput.isEmpty() && u.getMobile() != null) {
                String cleanMobile = u.getMobile().replaceAll("[^0-9]", "");
                if (cleanMobile.endsWith(cleanInput)) return Optional.of(u);
            }
        }
        return Optional.empty();
    }

    public synchronized UserEntity save(UserEntity user) {
        if (user.getId() == null || user.getId().isEmpty()) {
            user = new UserEntity(
                "user-reg-" + System.currentTimeMillis(),
                user.getName(),
                user.getEmail(),
                user.getMobile(),
                user.getPasswordHash(),
                user.getSalt(),
                user.getAge(),
                user.getGender(),
                user.getPlace(),
                user.getAddress(),
                user.getBloodGroup(),
                user.getDietPreference(),
                java.time.Instant.now().toString()
            );
        }
        memoryIndex.put(user.getId(), user);

        // Encrypted field persistence
        String encHash = DatabaseManager.encryptField(user.getPasswordHash());
        String encSalt = DatabaseManager.encryptField(user.getSalt());
        String encAddress = DatabaseManager.encryptField(user.getAddress());
        String encBloodGroup = DatabaseManager.encryptField(user.getBloodGroup());

        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO users (id, name, email, mobile, password_hash, salt, age, gender, place, address, blood_group, diet_preference, created_at) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
                        + "ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, mobile = EXCLUDED.mobile, "
                        + "password_hash = EXCLUDED.password_hash, salt = EXCLUDED.salt, age = EXCLUDED.age, gender = EXCLUDED.gender, "
                        + "place = EXCLUDED.place, address = EXCLUDED.address, blood_group = EXCLUDED.blood_group, diet_preference = EXCLUDED.diet_preference"
                    )) {
                        ps.setString(1, user.getId());
                        ps.setString(2, user.getName());
                        ps.setString(3, user.getEmail());
                        ps.setString(4, user.getMobile());
                        ps.setString(5, encHash);
                        ps.setString(6, encSalt);
                        ps.setInt(7, user.getAge());
                        ps.setString(8, user.getGender());
                        ps.setString(9, user.getPlace());
                        ps.setString(10, encAddress);
                        ps.setString(11, encBloodGroup);
                        ps.setString(12, user.getDietPreference());
                        ps.setString(13, user.getCreatedAt());
                        ps.executeUpdate();
                    }
                    return user;
                }
            } catch (Exception e) {
                System.err.println("Postgres save user error: " + e.getMessage());
                throw new RuntimeException("Failed to save user in PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        // Local cache sync
        flushToDisk();
        return user;
    }

    private void flushToDisk() {
        StringBuilder sb = new StringBuilder("[");
        List<UserEntity> list = new ArrayList<>(memoryIndex.values());
        for (int i = 0; i < list.size(); i++) {
            UserEntity u = list.get(i);
            String encHash = DatabaseManager.encryptField(u.getPasswordHash());
            String encSalt = DatabaseManager.encryptField(u.getSalt());
            String encAddress = DatabaseManager.encryptField(u.getAddress());
            String encBloodGroup = DatabaseManager.encryptField(u.getBloodGroup());

            sb.append(String.format(
                "{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"mobile\":\"%s\",\"passwordHash\":\"%s\",\"salt\":\"%s\",\"age\":%d,\"gender\":\"%s\",\"place\":\"%s\",\"address\":\"%s\",\"bloodGroup\":\"%s\",\"dietPreference\":\"%s\",\"createdAt\":\"%s\"}",
                JsonUtil.escapeJson(u.getId()),
                JsonUtil.escapeJson(u.getName()),
                JsonUtil.escapeJson(u.getEmail()),
                JsonUtil.escapeJson(u.getMobile()),
                JsonUtil.escapeJson(encHash),
                JsonUtil.escapeJson(encSalt),
                u.getAge(),
                JsonUtil.escapeJson(u.getGender()),
                JsonUtil.escapeJson(u.getPlace()),
                JsonUtil.escapeJson(encAddress),
                JsonUtil.escapeJson(encBloodGroup),
                JsonUtil.escapeJson(u.getDietPreference()),
                JsonUtil.escapeJson(u.getCreatedAt())
            ));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("users", sb.toString());
    }
}
