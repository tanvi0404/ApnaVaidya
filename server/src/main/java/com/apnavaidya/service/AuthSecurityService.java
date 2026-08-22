package com.apnavaidya.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * ApnaVaidya Cryptographic Authentication & JWT Token Authority
 * Implements Salted SHA-256 password hashing and HMAC-SHA256 signed JWT tokens.
 */
public class AuthSecurityService {

    private static final String DEFAULT_DEV_SECRET = "ApnaVaidya_2026_Secure_Secret_Key_Health_Care_JWT_Signature_98234!";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String getJwtSecret() {
        String envSecret = System.getenv("JWT_SECRET");
        return (envSecret != null && !envSecret.trim().isEmpty()) ? envSecret.trim() : DEFAULT_DEV_SECRET;
    }

    public static boolean isDemoPasswordValid(String password) {
        if (password == null) return false;
        return password.equals("Demo@123") || password.equals("demo123") || password.equals("Arjun@123") || password.equals("ApnaVaidya@2026");
    }

    /**
     * Generate a cryptographically random 16-byte hex salt
     */
    public static String generateSalt() {
        byte[] salt = new byte[16];
        secureRandom.nextBytes(salt);
        StringBuilder sb = new StringBuilder();
        for (byte b : salt) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    /**
     * Hash password with salt using multi-round SHA-256
     */
    public static String hashPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            
            // 1000 rounds of key stretching
            for (int i = 0; i < 1000; i++) {
                digest.reset();
                hash = digest.digest(hash);
            }

            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Verify a password against stored salt and hash
     */
    public static boolean verifyPassword(String password, String salt, String storedHash) {
        if (password == null || salt == null || storedHash == null) return false;
        String computedHash = hashPassword(password, salt);
        return MessageDigest.isEqual(
            computedHash.getBytes(StandardCharsets.UTF_8),
            storedHash.getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Generate a cryptographically signed HMAC-SHA256 JWT token
     */
    public static String createJwtToken(String userId, String email, String name) {
        try {
            long nowSec = System.currentTimeMillis() / 1000L;
            long expSec = nowSec + (7 * 24 * 3600); // 7 days validity

            // Header
            String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            String encodedHeader = Base64.getUrlEncoder().withoutPadding().encodeToString(headerJson.getBytes(StandardCharsets.UTF_8));

            // Payload
            String payloadJson = String.format(
                "{\"sub\":\"%s\",\"email\":\"%s\",\"name\":\"%s\",\"iat\":%d,\"exp\":%d,\"iss\":\"ApnaVaidya_Auth_Service\"}",
                escape(userId), escape(email), escape(name), nowSec, expSec
            );
            String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));

            // Signature
            String signature = signHmacSha256(encodedHeader + "." + encodedPayload, getJwtSecret());

            return encodedHeader + "." + encodedPayload + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create JWT token", e);
        }
    }

    /**
     * Verify HMAC-SHA256 JWT Token and return claims map, or null if invalid/expired
     */
    public static Map<String, String> verifyJwtToken(String token) {
        if (token == null || !token.contains(".")) return null;
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;

            String headerPayload = parts[0] + "." + parts[1];
            String expectedSignature = signHmacSha256(headerPayload, getJwtSecret());

            // Constant-time signature verification
            if (!MessageDigest.isEqual(parts[2].getBytes(StandardCharsets.UTF_8), expectedSignature.getBytes(StandardCharsets.UTF_8))) {
                return null;
            }

            // Decode payload
            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            String payloadJson = new String(payloadBytes, StandardCharsets.UTF_8);

            Map<String, String> claims = new HashMap<>();
            claims.put("sub", extractJsonField(payloadJson, "sub"));
            claims.put("email", extractJsonField(payloadJson, "email"));
            claims.put("name", extractJsonField(payloadJson, "name"));
            String expStr = extractJsonField(payloadJson, "exp");
            
            if (expStr != null && !expStr.isEmpty()) {
                long exp = Long.parseLong(expStr);
                long now = System.currentTimeMillis() / 1000L;
                if (now > exp) {
                    return null; // Expired
                }
            }

            return claims;
        } catch (Exception e) {
            return null;
        }
    }

    private static String signHmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String extractJsonField(String json, String key) {
        String search = "\"" + key + "\":";
        int idx = json.indexOf(search);
        if (idx == -1) return "";
        int start = idx + search.length();
        while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '"')) {
            start++;
        }
        int end = start;
        while (end < json.length() && json.charAt(end) != '"' && json.charAt(end) != ',' && json.charAt(end) != '}') {
            end++;
        }
        return json.substring(start, end).trim();
    }
}
