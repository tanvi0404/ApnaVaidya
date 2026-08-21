package com.apnavaidya.storage;

import java.util.*;
import java.util.regex.*;

/**
 * Robust, zero-dependency JSON utility for serialization and deserialization
 * using standard Java regex pattern matching.
 */
public class JsonUtil {

    private static final Pattern STRING_FIELD_PATTERN = Pattern.compile("\"([^\"]+)\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"");
    private static final Pattern NUMBER_FIELD_PATTERN = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)");
    private static final Pattern BOOLEAN_FIELD_PATTERN = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(true|false)");

    public static String extractString(String json, String key, String defaultValue) {
        if (json == null || key == null) return defaultValue;
        Pattern p = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"");
        Matcher m = p.matcher(json);
        if (m.find()) {
            return unescapeJson(m.group(1));
        }
        return defaultValue;
    }

    public static String extractString(String json, String key) {
        return extractString(json, key, "");
    }

    public static int extractInt(String json, String key, int defaultValue) {
        if (json == null || key == null) return defaultValue;
        Pattern p = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*(-?\\d+)");
        Matcher m = p.matcher(json);
        if (m.find()) {
            try {
                return Integer.parseInt(m.group(1));
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public static int extractInt(String json, String key) {
        return extractInt(json, key, 0);
    }

    public static double extractDouble(String json, String key, double defaultValue) {
        if (json == null || key == null) return defaultValue;
        Pattern p = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)");
        Matcher m = p.matcher(json);
        if (m.find()) {
            try {
                return Double.parseDouble(m.group(1));
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public static double extractDouble(String json, String key) {
        return extractDouble(json, key, 0.0);
    }

    public static boolean extractBoolean(String json, String key, boolean defaultValue) {
        if (json == null || key == null) return defaultValue;
        Pattern p = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*(true|false)", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(json);
        if (m.find()) {
            return Boolean.parseBoolean(m.group(1));
        }
        return defaultValue;
    }

    public static boolean extractBoolean(String json, String key) {
        return extractBoolean(json, key, false);
    }

    /**
     * Splits a JSON array of objects into individual JSON object strings.
     * e.g. [{"id":"1"},{"id":"2"}] -> ["{\"id\":\"1\"}", "{\"id\":\"2\"}"]
     */
    public static List<String> extractJsonObjects(String jsonArray) {
        List<String> objects = new ArrayList<>();
        if (jsonArray == null || jsonArray.trim().isEmpty()) return objects;

        int depth = 0;
        int startIndex = -1;
        boolean inQuotes = false;
        boolean escape = false;

        for (int i = 0; i < jsonArray.length(); i++) {
            char c = jsonArray.charAt(i);

            if (escape) {
                escape = false;
                continue;
            }

            if (c == '\\') {
                escape = true;
                continue;
            }

            if (c == '"') {
                inQuotes = !inQuotes;
                continue;
            }

            if (!inQuotes) {
                if (c == '{') {
                    if (depth == 0) {
                        startIndex = i;
                    }
                    depth++;
                } else if (c == '}') {
                    depth--;
                    if (depth == 0 && startIndex != -1) {
                        objects.add(jsonArray.substring(startIndex, i + 1));
                        startIndex = -1;
                    }
                }
            }
        }

        return objects;
    }

    public static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    public static String unescapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\\"", "\"")
                .replace("\\\\", "\\")
                .replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t");
    }
}
