package com.apnavaidya.service;

import com.apnavaidya.model.MedicationItem;
import com.apnavaidya.storage.DatabaseManager;

import java.util.*;

public class MedicationService {

    private final List<MedicationItem> medications = new ArrayList<>();
    private final DatabaseManager db = DatabaseManager.getInstance();

    public MedicationService() {
        loadOrInitMedications();
    }

    private void loadOrInitMedications() {
        String json = db.loadTableData("medications");
        if (json != null && !json.trim().isEmpty() && !json.trim().equals("[]")) {
            parseMedicationsJson(json);
        } else {
            initMedications();
            saveMedications();
        }
    }

    private void initMedications() {
        // Arjun's Medications
        medications.add(new MedicationItem(
            "med-ator-10", "user-arjun", "Atorva 10", "Atorvastatin Calcium", "10 mg",
            "Once Daily (OD)", "9:30 PM (Bedtime)", "After dinner, before sleep",
            "LDL-C Reduction & Plaque Stabilization", "Dr. A. K. Sharma (Cardiology)",
            18, 30, 18, false
        ));
        medications.add(new MedicationItem(
            "med-vitd-60k", "user-arjun", "Calcirol 60K", "Cholecalciferol (Vitamin D3)", "60,000 IU",
            "Once Weekly (QW)", "Sunday 9:00 AM", "With milk / healthy fat meal",
            "Vitamin D3 Deficiency Correction", "Dr. A. K. Sharma (Cardiology)",
            4, 8, 4, true
        ));
        medications.add(new MedicationItem(
            "med-omega3", "user-arjun", "MaxEPA Omega-3", "EPA 180mg + DHA 120mg", "1 Capsule",
            "Once Daily (OD)", "1:30 PM (Post Lunch)", "Immediately after lunch",
            "Triglyceride & Endothelial Support", "Dr. Neha Verma (Nutrition)",
            24, 60, 24, true
        ));

        // Rajesh's Medications
        medications.add(new MedicationItem(
            "med-met-500", "user-rajesh", "Glycomet 500", "Metformin Hydrochloride", "500 mg",
            "Twice Daily (BD)", "8:30 AM & 8:30 PM", "With or immediately after main meals",
            "Type-2 Diabetes Glycemic Control", "Dr. V. K. Gupta (Endocrinology)",
            12, 60, 24, false
        ));
        medications.add(new MedicationItem(
            "med-telmi-40", "user-rajesh", "Telma 40", "Telmisartan", "40 mg",
            "Once Daily (OD)", "8:00 AM (Morning)", "Empty stomach or after breakfast",
            "Hypertension & Renal Protection", "Dr. V. K. Gupta (Endocrinology)",
            15, 30, 15, true
        ));

        // Sunita's Medications
        medications.add(new MedicationItem(
            "med-thyro-50", "user-sunita", "Thyronorm 50", "Levothyroxine Sodium", "50 mcg",
            "Once Daily (OD)", "6:30 AM (Fasting)", "First thing upon waking with plain water only",
            "Primary Hypothyroidism Replacement", "Dr. Meenakshi S. (Endocrinology)",
            22, 100, 72, true
        ));
    }

    public synchronized List<MedicationItem> getMedicationsByProfile(String profileId) {
        List<MedicationItem> result = new ArrayList<>();
        for (MedicationItem m : medications) {
            if (profileId == null || profileId.equalsIgnoreCase(m.getProfileId())) {
                result.add(m);
            }
        }
        return result.isEmpty() ? medications : result;
    }

    public synchronized boolean toggleMedicationStatus(String medId) {
        for (MedicationItem m : medications) {
            if (m.getId().equalsIgnoreCase(medId)) {
                m.setTakenToday(!m.isTakenToday());
                if (m.isTakenToday() && m.getRemainingPills() > 0) {
                    m.setRemainingPills(m.getRemainingPills() - 1);
                } else if (!m.isTakenToday()) {
                    m.setRemainingPills(m.getRemainingPills() + 1);
                }
                saveMedications();
                return true;
            }
        }
        return false;
    }

    public List<String> checkInteractions(List<String> activeDrugNames) {
        List<String> warnings = new ArrayList<>();
        String combined = String.join(" ", activeDrugNames).toLowerCase();

        if (combined.contains("atorvastatin") || combined.contains("statin")) {
            warnings.add("⚠️ Food Interaction: Avoid Grapefruit juice while taking Statins (CYP3A4 inhibition increases statin serum concentration).");
        }
        if (combined.contains("levothyroxine") && (combined.contains("calcium") || combined.contains("iron"))) {
            warnings.add("⚠️ Critical Timing Rule: Space Calcium and Iron supplements at least 4 hours apart from Levothyroxine to avoid chelation binding.");
        }
        if (combined.contains("metformin")) {
            warnings.add("ℹ️ Nutritional Note: Long-term Metformin usage (>12 months) depletes Vitamin B12 absorption in the terminal ileum. Periodic B12 monitoring advised.");
        }

        return warnings;
    }

    private synchronized void saveMedications() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < medications.size(); i++) {
            MedicationItem m = medications.get(i);
            sb.append("{")
              .append("\"id\":\"").append(escapeJson(m.getId())).append("\",")
              .append("\"profileId\":\"").append(escapeJson(m.getProfileId())).append("\",")
              .append("\"name\":\"").append(escapeJson(m.getName())).append("\",")
              .append("\"genericName\":\"").append(escapeJson(m.getGenericName())).append("\",")
              .append("\"dosage\":\"").append(escapeJson(m.getDosage())).append("\",")
              .append("\"frequency\":\"").append(escapeJson(m.getFrequency())).append("\",")
              .append("\"timing\":\"").append(escapeJson(m.getTiming())).append("\",")
              .append("\"foodInstruction\":\"").append(escapeJson(m.getFoodInstruction())).append("\",")
              .append("\"prescribedFor\":\"").append(escapeJson(m.getPrescribedFor())).append("\",")
              .append("\"doctorName\":\"").append(escapeJson(m.getDoctorName())).append("\",")
              .append("\"remainingDays\":").append(m.getRemainingDays()).append(",")
              .append("\"totalPills\":").append(m.getTotalPills()).append(",")
              .append("\"remainingPills\":").append(m.getRemainingPills()).append(",")
              .append("\"takenToday\":").append(m.isTakenToday())
              .append("}");
            if (i < medications.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("medications", sb.toString());
    }

    private void parseMedicationsJson(String json) {
        try {
            String[] items = json.split("\\{\"id\":");
            for (int i = 1; i < items.length; i++) {
                String b = items[i];
                String id = extractField(b, "\"id\":\"", "\"");
                String prof = extractField(b, "\"profileId\":\"", "\"");
                String name = extractField(b, "\"name\":\"", "\"");
                String gen = extractField(b, "\"genericName\":\"", "\"");
                String dos = extractField(b, "\"dosage\":\"", "\"");
                String freq = extractField(b, "\"frequency\":\"", "\"");
                String tim = extractField(b, "\"timing\":\"", "\"");
                String food = extractField(b, "\"foodInstruction\":\"", "\"");
                String purp = extractField(b, "\"prescribedFor\":\"", "\"");
                String doc = extractField(b, "\"doctorName\":\"", "\"");
                int remDays = extractInt(b, "\"remainingDays\":");
                int totPills = extractInt(b, "\"totalPills\":");
                int remPills = extractInt(b, "\"remainingPills\":");
                boolean taken = b.contains("\"takenToday\":true");
                medications.add(new MedicationItem(id, prof, name, gen, dos, freq, tim, food, purp, doc, remDays, totPills, remPills, taken));
            }
        } catch (Exception e) {
            initMedications();
        }
    }

    private String extractField(String block, String prefix, String suffix) {
        int start = block.indexOf(prefix);
        if (start == -1) {
            int alt = block.indexOf(prefix.substring(prefix.indexOf(":") + 1));
            if (alt == -1) return "";
            start = alt;
        } else {
            start += prefix.length();
        }
        int end = block.indexOf(suffix, start);
        if (end == -1) return "";
        return block.substring(start, end).replace("\\\"", "\"");
    }

    private int extractInt(String block, String prefix) {
        try {
            int start = block.indexOf(prefix);
            if (start == -1) return 0;
            start += prefix.length();
            int end = block.indexOf(",", start);
            if (end == -1) end = block.indexOf("}", start);
            return Integer.parseInt(block.substring(start, end).trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
