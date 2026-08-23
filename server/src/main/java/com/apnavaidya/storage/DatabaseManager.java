package com.apnavaidya.storage;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.*;
import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * ApnaVaidya Enterprise Persistence & Cryptographic Vault Layer
 * Features:
 * 1. Real Thread-Safe PostgreSQL Connection Pool (Max 10 connections, auto-recycling & validation)
 * 2. Robust URL Normalization & URL-Decoded Credential Handling for Render / Supabase / Neon / AWS RDS
 * 3. AES-256 GCM authenticated encryption at rest for sensitive health records and PII (derived via SHA-256)
 * 4. Zero-dependency file-backed JSON fallback for local development when DATABASE_URL is not set
 */
public class DatabaseManager {

    private static final String DATA_DIR = "server/data";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;
    private static final int MAX_POOL_SIZE = 10;

    private static DatabaseManager instance;
    private final Path dataPath;
    private final ConcurrentHashMap<String, ReentrantReadWriteLock> tableLocks = new ConcurrentHashMap<>();
    
    // PostgreSQL Connection Pooling
    private boolean postgresConnected = false;
    private String cleanJdbcUrl = null;
    private Properties dbProps = null;
    private final BlockingQueue<Connection> connectionPool = new LinkedBlockingQueue<>(MAX_POOL_SIZE);
    private final AtomicInteger currentPoolSize = new AtomicInteger(0);

    private DatabaseManager() {
        this.dataPath = Paths.get(DATA_DIR);
        try {
            if (!Files.exists(dataPath)) {
                Files.createDirectories(dataPath);
            }
        } catch (IOException e) {
            System.err.println("Warning: Could not create data directory: " + e.getMessage());
        }

        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl != null && !dbUrl.trim().isEmpty()) {
            try {
                this.dbProps = parseConnectionProperties(dbUrl);
                this.cleanJdbcUrl = toJdbcUrl(dbUrl);

                // Pre-warm initial pool connection to verify database connectivity
                try {
                    Class.forName("org.postgresql.Driver");
                } catch (ClassNotFoundException ignored) {}

                Connection initialConn = DriverManager.getConnection(this.cleanJdbcUrl, this.dbProps);
                if (initialConn != null && !initialConn.isClosed()) {
                    this.postgresConnected = true;
                    connectionPool.offer(initialConn);
                    currentPoolSize.set(1);
                    System.out.println("🐘 DatabaseManager: Real PostgreSQL Connection Pool initialized (Pool Capacity: " + MAX_POOL_SIZE + ").");
                }
            } catch (Exception e) {
                System.err.println("⚠️ DatabaseManager notice: PostgreSQL connection failed (" + e.getMessage() + "). Operating in local JSON fallback mode.");
                this.postgresConnected = false;
            }
        } else {
            System.out.println("📦 DatabaseManager: DATABASE_URL not set. Running in local JSON storage mode (server/data/*.json).");
        }
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }

    public boolean isPostgres() {
        return postgresConnected;
    }

    /**
     * Borrow a validated connection from the connection pool
     */
    public Connection getConnection() throws SQLException {
        if (!postgresConnected || cleanJdbcUrl == null) return null;

        Connection conn = connectionPool.poll();
        if (conn != null) {
            try {
                if (!conn.isClosed() && conn.isValid(2)) {
                    return conn;
                }
            } catch (SQLException ignored) {}
            currentPoolSize.decrementAndGet();
        }

        // If pool is below capacity, allocate new connection
        if (currentPoolSize.get() < MAX_POOL_SIZE) {
            currentPoolSize.incrementAndGet();
            try {
                return DriverManager.getConnection(cleanJdbcUrl, dbProps);
            } catch (SQLException e) {
                currentPoolSize.decrementAndGet();
                throw e;
            }
        }

        // Wait briefly for a connection to return to the pool
        try {
            conn = connectionPool.poll(3, TimeUnit.SECONDS);
            if (conn != null && !conn.isClosed() && conn.isValid(2)) {
                return conn;
            }
            return DriverManager.getConnection(cleanJdbcUrl, dbProps);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SQLException("Database connection acquisition interrupted", e);
        }
    }

    /**
     * Return a connection back to the connection pool
     */
    public void releaseConnection(Connection conn) {
        if (conn != null && postgresConnected) {
            try {
                if (!conn.isClosed() && conn.isValid(2) && connectionPool.size() < MAX_POOL_SIZE) {
                    connectionPool.offer(conn);
                    return;
                }
                conn.close();
            } catch (SQLException ignored) {}
            currentPoolSize.decrementAndGet();
        }
    }

    /**
     * Converts generic PostgreSQL URIs to standard JDBC URLs and extracts properties
     */
    public static String toJdbcUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.trim().isEmpty()) return null;
        String trimmed = rawUrl.trim();
        if (trimmed.startsWith("jdbc:")) {
            // Strip credentials if present in JDBC URL query string to prevent duplicate param issues
            int queryIdx = trimmed.indexOf("?");
            return (queryIdx > 0) ? trimmed.substring(0, queryIdx) : trimmed;
        }

        if (trimmed.startsWith("postgres://") || trimmed.startsWith("postgresql://")) {
            try {
                String normalized = trimmed.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = URI.create(normalized);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                if (path == null || path.isEmpty() || path.equals("/")) path = "/apnavaidya";

                return "jdbc:postgresql://" + host + ":" + port + path;
            } catch (Exception e) {
                return "jdbc:" + trimmed;
            }
        }
        return "jdbc:" + trimmed;
    }

    public static Properties parseConnectionProperties(String rawUrl) {
        Properties props = new Properties();
        if (rawUrl == null || rawUrl.trim().isEmpty()) return props;
        String trimmed = rawUrl.trim();

        try {
            if (trimmed.startsWith("postgres://") || trimmed.startsWith("postgresql://")) {
                String normalized = trimmed.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = URI.create(normalized);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    props.setProperty("user", URLDecoder.decode(parts[0], StandardCharsets.UTF_8));
                    props.setProperty("password", URLDecoder.decode(parts[1], StandardCharsets.UTF_8));
                }

                String host = uri.getHost();
                if (host != null && !host.equals("localhost") && !host.equals("127.0.0.1") && !host.equals("postgres")) {
                    props.setProperty("sslmode", "require");
                }

                String rawQuery = uri.getRawQuery();
                if (rawQuery != null && !rawQuery.isEmpty()) {
                    String[] params = rawQuery.split("&");
                    for (String p : params) {
                        String[] kv = p.split("=", 2);
                        if (kv.length == 2) {
                            props.setProperty(URLDecoder.decode(kv[0], StandardCharsets.UTF_8), URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
                        }
                    }
                }
            } else if (trimmed.startsWith("jdbc:postgresql://")) {
                int queryIdx = trimmed.indexOf("?");
                if (queryIdx > 0) {
                    String query = trimmed.substring(queryIdx + 1);
                    String[] params = query.split("&");
                    for (String p : params) {
                        String[] kv = p.split("=", 2);
                        if (kv.length == 2) {
                            props.setProperty(kv[0], kv[1]);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Notice: URL properties parsing: " + e.getMessage());
        }
        return props;
    }

    public static Connection createDirectConnection(String rawUrl) throws SQLException {
        String jdbcUrl = toJdbcUrl(rawUrl);
        Properties props = parseConnectionProperties(rawUrl);
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException ignored) {}
        return DriverManager.getConnection(jdbcUrl, props);
    }

    /**
     * Externalized 256-bit AES Vault Key derived deterministically via SHA-256
     */
    private static byte[] getEncryptionKeyBytes() {
        String envKey = System.getenv("VAULT_ENCRYPTION_KEY");
        if (envKey == null || envKey.trim().isEmpty()) {
            if ("production".equalsIgnoreCase(System.getenv("NODE_ENV")) || System.getenv("RENDER") != null) {
                System.err.println("⚠️ SECURITY ALERT: VAULT_ENCRYPTION_KEY is not configured in production environment variables!");
            }
            envKey = "ApnaVaidya_2026_Enterprise_AES256_Vault_Key_Production_98234!";
        }
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            return sha.digest(envKey.trim().getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return "ApnaVaidya2026AES256HealthVaultK".getBytes(StandardCharsets.UTF_8);
        }
    }

    private ReentrantReadWriteLock getLock(String tableName) {
        return tableLocks.computeIfAbsent(tableName, k -> new ReentrantReadWriteLock());
    }

    /**
     * Read table data from local JSON file (local dev fallback)
     */
    public String loadTableData(String tableName) {
        ReentrantReadWriteLock.ReadLock readLock = getLock(tableName).readLock();
        readLock.lock();
        try {
            Path tableFile = dataPath.resolve(tableName + ".json");
            if (!Files.exists(tableFile)) {
                return null;
            }
            return Files.readString(tableFile, StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error reading " + tableName + ": " + e.getMessage());
            return null;
        } finally {
            readLock.unlock();
        }
    }

    /**
     * Write table data with atomic swap and exclusive write lock (local dev fallback)
     */
    public void saveTableData(String tableName, String jsonData) {
        ReentrantReadWriteLock.WriteLock writeLock = getLock(tableName).writeLock();
        writeLock.lock();
        try {
            Path tableFile = dataPath.resolve(tableName + ".json");
            Path tempFile = dataPath.resolve(tableName + ".tmp");
            Files.writeString(tempFile, jsonData, StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            try {
                Files.move(tempFile, tableFile, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException e) {
                Files.move(tempFile, tableFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            System.err.println("Error writing " + tableName + ": " + e.getMessage());
        } finally {
            writeLock.unlock();
        }
    }

    /**
     * AES-256 GCM Field Encryption for sensitive patient biometrics, passwords, & PII
     */
    public static String encryptField(String plainText) {
        if (plainText == null || plainText.isEmpty()) return plainText;
        if (plainText.startsWith("enc_aes256:")) return plainText;
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(getEncryptionKeyBytes(), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);

            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            byte[] combined = new byte[iv.length + cipherText.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(cipherText, 0, combined, iv.length, cipherText.length);

            return "enc_aes256:" + Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            System.err.println("Encryption error: " + e.getMessage());
            return plainText;
        }
    }

    /**
     * AES-256 GCM Field Decryption
     */
    public static String decryptField(String cipherString) {
        if (cipherString == null || !cipherString.startsWith("enc_aes256:")) return cipherString;
        try {
            String b64 = cipherString.substring("enc_aes256:".length());
            byte[] combined = Base64.getDecoder().decode(b64);

            byte[] iv = new byte[GCM_IV_LENGTH];
            System.arraycopy(combined, 0, iv, 0, GCM_IV_LENGTH);

            int cipherLength = combined.length - GCM_IV_LENGTH;
            byte[] cipherText = new byte[cipherLength];
            System.arraycopy(combined, GCM_IV_LENGTH, cipherText, 0, cipherLength);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(getEncryptionKeyBytes(), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

            byte[] plainBytes = cipher.doFinal(cipherText);
            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.err.println("Decryption error: " + e.getMessage());
            return cipherString;
        }
    }
}
