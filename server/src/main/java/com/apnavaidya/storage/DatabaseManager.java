package com.apnavaidya.storage;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

public class DatabaseManager {

    private static final String DATA_DIR = "server/data";
    private static DatabaseManager instance;

    private final Path dataPath;

    private DatabaseManager() {
        this.dataPath = Paths.get(DATA_DIR);
        try {
            if (!Files.exists(dataPath)) {
                Files.createDirectories(dataPath);
            }
        } catch (IOException e) {
            System.err.println("Warning: Could not create data directory: " + e.getMessage());
        }
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }

    public synchronized String loadTableData(String tableName) {
        Path tableFile = dataPath.resolve(tableName + ".json");
        if (!Files.exists(tableFile)) {
            return null;
        }
        try {
            return Files.readString(tableFile, StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error reading " + tableName + ": " + e.getMessage());
            return null;
        }
    }

    public synchronized void saveTableData(String tableName, String jsonData) {
        Path tableFile = dataPath.resolve(tableName + ".json");
        try {
            Path tempFile = dataPath.resolve(tableName + ".tmp");
            Files.writeString(tempFile, jsonData, StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            Files.move(tempFile, tableFile, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (IOException e) {
            System.err.println("Error writing " + tableName + ": " + e.getMessage());
        }
    }
}
