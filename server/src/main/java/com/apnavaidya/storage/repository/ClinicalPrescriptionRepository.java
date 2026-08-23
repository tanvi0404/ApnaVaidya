package com.apnavaidya.storage.repository;

import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-Safe Relational Repository for NMC-Compliant Clinical E-Prescriptions
 * Backed by PostgreSQL in production with local JSON fallback.
 */
public class ClinicalPrescriptionRepository {

    public static class PrescriptionEntity {
        private String prescriptionId;
        private String doctorName;
        private String doctorReg;
        private String patientName;
        private String diagnosis;
        private String digitalSignature;
        private String signingTimestamp;
        private String status;

        public PrescriptionEntity() {}

        public PrescriptionEntity(String prescriptionId, String doctorName, String doctorReg, 
                                  String patientName, String diagnosis, String digitalSignature, 
                                  String signingTimestamp, String status) {
            this.prescriptionId = prescriptionId;
            this.doctorName = doctorName;
            this.doctorReg = doctorReg;
            this.patientName = patientName;
            this.diagnosis = diagnosis;
            this.digitalSignature = digitalSignature;
            this.signingTimestamp = signingTimestamp;
            this.status = status;
        }

        public String getPrescriptionId() { return prescriptionId; }
        public String getDoctorName() { return doctorName; }
        public String getDoctorReg() { return doctorReg; }
        public String getPatientName() { return patientName; }
        public String getDiagnosis() { return diagnosis; }
        public String getDigitalSignature() { return digitalSignature; }
        public String getSigningTimestamp() { return signingTimestamp; }
        public String getStatus() { return status; }
    }

    private final DatabaseManager db;
    private final Map<String, PrescriptionEntity> memoryIndex = new ConcurrentHashMap<>();

    public ClinicalPrescriptionRepository() {
        this.db = DatabaseManager.getInstance();
        loadAll();
    }

    private synchronized void loadAll() {
        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM clinical_prescriptions");
                         ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            String id = rs.getString("prescription_id");
                            PrescriptionEntity rx = new PrescriptionEntity(
                                id,
                                rs.getString("doctor_name"),
                                rs.getString("doctor_reg"),
                                rs.getString("patient_name"),
                                rs.getString("diagnosis"),
                                rs.getString("digital_signature"),
                                rs.getString("signing_timestamp"),
                                rs.getString("status")
                            );
                            if (id != null && !id.isEmpty()) {
                                memoryIndex.put(id, rx);
                            }
                        }
                        return;
                    }
                }
            } catch (Exception e) {
                System.err.println("Postgres clinical_prescriptions load error: " + e.getMessage());
                throw new RuntimeException("Failed to load clinical prescriptions from PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        String json = db.loadTableData("clinical_prescriptions");
        if (json != null && !json.trim().isEmpty()) {
            List<String> objects = JsonUtil.extractJsonObjects(json);
            for (String obj : objects) {
                String id = JsonUtil.extractString(obj, "prescriptionId");
                if (id == null || id.isEmpty()) continue;
                PrescriptionEntity rx = new PrescriptionEntity(
                    id,
                    JsonUtil.extractString(obj, "doctorName"),
                    JsonUtil.extractString(obj, "doctorReg"),
                    JsonUtil.extractString(obj, "patientName"),
                    JsonUtil.extractString(obj, "diagnosis"),
                    JsonUtil.extractString(obj, "digitalSignature"),
                    JsonUtil.extractString(obj, "signingTimestamp"),
                    JsonUtil.extractString(obj, "status", "SIGNED")
                );
                memoryIndex.put(id, rx);
            }
        }
    }

    public List<PrescriptionEntity> findAll() {
        return new ArrayList<>(memoryIndex.values());
    }

    public Optional<PrescriptionEntity> findById(String id) {
        return Optional.ofNullable(memoryIndex.get(id));
    }

    public synchronized PrescriptionEntity save(PrescriptionEntity rx) {
        if (rx.getPrescriptionId() == null || rx.getPrescriptionId().isEmpty()) {
            return rx;
        }
        memoryIndex.put(rx.getPrescriptionId(), rx);

        if (db.isPostgres()) {
            Connection conn = null;
            try {
                conn = db.getConnection();
                if (conn != null) {
                    try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO clinical_prescriptions (prescription_id, doctor_name, doctor_reg, patient_name, diagnosis, digital_signature, signing_timestamp, status) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?) "
                        + "ON CONFLICT (prescription_id) DO UPDATE SET doctor_name = EXCLUDED.doctor_name, status = EXCLUDED.status"
                    )) {
                        ps.setString(1, rx.getPrescriptionId());
                        ps.setString(2, rx.getDoctorName());
                        ps.setString(3, rx.getDoctorReg());
                        ps.setString(4, rx.getPatientName());
                        ps.setString(5, rx.getDiagnosis());
                        ps.setString(6, rx.getDigitalSignature());
                        ps.setString(7, rx.getSigningTimestamp());
                        ps.setString(8, rx.getStatus());
                        ps.executeUpdate();
                    }
                    return rx;
                }
            } catch (Exception e) {
                System.err.println("Postgres save prescription error: " + e.getMessage());
                throw new RuntimeException("Failed to save prescription to PostgreSQL", e);
            } finally {
                db.releaseConnection(conn);
            }
        }

        flushToDisk();
        return rx;
    }

    private void flushToDisk() {
        StringBuilder sb = new StringBuilder("[");
        List<PrescriptionEntity> list = new ArrayList<>(memoryIndex.values());
        for (int i = 0; i < list.size(); i++) {
            PrescriptionEntity p = list.get(i);
            sb.append(String.format(
                "{\"prescriptionId\":\"%s\",\"doctorName\":\"%s\",\"doctorReg\":\"%s\",\"patientName\":\"%s\",\"diagnosis\":\"%s\",\"digitalSignature\":\"%s\",\"signingTimestamp\":\"%s\",\"status\":\"%s\"}",
                JsonUtil.escapeJson(p.getPrescriptionId()),
                JsonUtil.escapeJson(p.getDoctorName()),
                JsonUtil.escapeJson(p.getDoctorReg()),
                JsonUtil.escapeJson(p.getPatientName()),
                JsonUtil.escapeJson(p.getDiagnosis()),
                JsonUtil.escapeJson(p.getDigitalSignature()),
                JsonUtil.escapeJson(p.getSigningTimestamp()),
                JsonUtil.escapeJson(p.getStatus())
            ));
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("clinical_prescriptions", sb.toString());
    }
}
