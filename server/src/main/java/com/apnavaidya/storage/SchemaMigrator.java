package com.apnavaidya.storage;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.*;

/**
 * ApnaVaidya Relational Schema Migrator & Database DDL Layer
 * Executes structured SQL schema migrations on startup for PostgreSQL / SQLite / H2 / Cloud Databases.
 */
public class SchemaMigrator {

    private static final List<String> MIGRATION_SCRIPTS = Arrays.asList(
        // Table 1: Users (with AES-256 encrypted fields at rest)
        "CREATE TABLE IF NOT EXISTS users ("
        + "  id VARCHAR(64) PRIMARY KEY,"
        + "  name VARCHAR(255) NOT NULL,"
        + "  email VARCHAR(255) UNIQUE NOT NULL,"
        + "  mobile VARCHAR(64),"
        + "  password_hash VARCHAR(255) NOT NULL,"
        + "  salt VARCHAR(64) NOT NULL,"
        + "  age INT DEFAULT 30,"
        + "  gender VARCHAR(32),"
        + "  place VARCHAR(255),"
        + "  address TEXT,"
        + "  blood_group VARCHAR(32),"
        + "  diet_preference VARCHAR(64),"
        + "  created_at VARCHAR(64)"
        + ");",

        // Table 2: Family Profiles
        "CREATE TABLE IF NOT EXISTS family_profiles ("
        + "  id VARCHAR(64) PRIMARY KEY,"
        + "  user_id VARCHAR(64),"
        + "  name VARCHAR(255) NOT NULL,"
        + "  relationship VARCHAR(64),"
        + "  age INT NOT NULL,"
        + "  gender VARCHAR(32) NOT NULL,"
        + "  blood_group VARCHAR(32),"
        + "  weight VARCHAR(32),"
        + "  bmi DOUBLE PRECISION,"
        + "  avatar_initials VARCHAR(16),"
        + "  avatar_color VARCHAR(64),"
        + "  conditions_json TEXT,"
        + "  allergies_json TEXT,"
        + "  goals_json TEXT,"
        + "  diet_preference VARCHAR(64),"
        + "  created_at VARCHAR(64)"
        + ");",

        // Table 3: Structured Electronic Health Records & Digital Diagnostics
        "CREATE TABLE IF NOT EXISTS medical_reports ("
        + "  id VARCHAR(64) PRIMARY KEY,"
        + "  profile_id VARCHAR(64) NOT NULL,"
        + "  title VARCHAR(255) NOT NULL,"
        + "  category VARCHAR(128),"
        + "  lab_name VARCHAR(255),"
        + "  test_date VARCHAR(64),"
        + "  upload_date VARCHAR(64),"
        + "  status VARCHAR(32) DEFAULT 'Analyzed',"
        + "  summary_text TEXT,"
        + "  ocr_confidence VARCHAR(32),"
        + "  parameters_json TEXT,"
        + "  created_at VARCHAR(64)"
        + ");",

        // Table 4: Active Prescription Medications
        "CREATE TABLE IF NOT EXISTS medications ("
        + "  id VARCHAR(64) PRIMARY KEY,"
        + "  profile_id VARCHAR(64) NOT NULL,"
        + "  name VARCHAR(255) NOT NULL,"
        + "  generic_name VARCHAR(255),"
        + "  dosage VARCHAR(64) NOT NULL,"
        + "  frequency VARCHAR(64) NOT NULL,"
        + "  timing VARCHAR(64),"
        + "  food_instruction VARCHAR(255),"
        + "  prescribed_for VARCHAR(255),"
        + "  doctor_name VARCHAR(255),"
        + "  remaining_days INT DEFAULT 30,"
        + "  total_pills INT DEFAULT 60,"
        + "  remaining_pills INT DEFAULT 45,"
        + "  taken_today BOOLEAN DEFAULT FALSE,"
        + "  created_at VARCHAR(64)"
        + ");",

        // Table 5: Immutable Security Audit Trail
        "CREATE TABLE IF NOT EXISTS audit_logs ("
        + "  id VARCHAR(64) PRIMARY KEY,"
        + "  timestamp VARCHAR(64) NOT NULL,"
        + "  event_type VARCHAR(128) NOT NULL,"
        + "  details TEXT NOT NULL,"
        + "  status VARCHAR(32) DEFAULT 'SUCCESS',"
        + "  ip_address VARCHAR(64),"
        + "  block_hash VARCHAR(128) NOT NULL,"
        + "  created_at VARCHAR(64)"
        + ");",

        // Table 6: Cryptographic E-Prescriptions
        "CREATE TABLE IF NOT EXISTS clinical_prescriptions ("
        + "  prescription_id VARCHAR(64) PRIMARY KEY,"
        + "  doctor_name VARCHAR(255) NOT NULL,"
        + "  doctor_reg VARCHAR(64) NOT NULL,"
        + "  patient_name VARCHAR(255) NOT NULL,"
        + "  diagnosis VARCHAR(255) NOT NULL,"
        + "  digital_signature VARCHAR(128) NOT NULL,"
        + "  signing_timestamp VARCHAR(64) NOT NULL,"
        + "  status VARCHAR(32) DEFAULT 'SIGNED'"
        + ");"
    );

    public static void runMigrations(String dbUrl) {
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            System.out.println("📦 SchemaMigrator: DATABASE_URL not set. Running in local JSON file-persistence mode (server/data/*.json).");
            return;
        }

        String jdbcUrl = DatabaseManager.toJdbcUrl(dbUrl);
        System.out.println("📦 SchemaMigrator: Initializing schema migrations on: " + sanitizeJdbcUrl(jdbcUrl));

        try (Connection conn = DatabaseManager.createDirectConnection(dbUrl);
             Statement stmt = conn.createStatement()) {
            for (String sql : MIGRATION_SCRIPTS) {
                stmt.execute(sql);
            }
            System.out.println("✅ SchemaMigrator: All 6 PostgreSQL database tables initialized successfully.");
        } catch (Exception e) {
            System.err.println("⚠️ SchemaMigrator notice: " + e.getMessage() + " (falling back to atomic file-backed storage)");
        }
    }

    private static String sanitizeJdbcUrl(String url) {
        if (url == null) return "null";
        return url.replaceAll("password=[^&;]+", "password=******").replaceAll(":[^:@/]+@", ":******@");
    }

    public static List<String> getMigrationScripts() {
        return Collections.unmodifiableList(MIGRATION_SCRIPTS);
    }
}
