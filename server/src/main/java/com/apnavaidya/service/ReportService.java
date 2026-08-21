package com.apnavaidya.service;

import com.apnavaidya.model.LabParameter;
import com.apnavaidya.model.MedicalReport;
import com.apnavaidya.storage.DatabaseManager;

import java.util.*;

public class ReportService {

    private final List<MedicalReport> reports = new ArrayList<>();
    private final DatabaseManager db = DatabaseManager.getInstance();

    public ReportService() {
        loadOrInitReports();
    }

    private void loadOrInitReports() {
        String json = db.loadTableData("reports");
        if (json != null && !json.trim().isEmpty() && !json.trim().equals("[]")) {
            parseReportsJson(json);
        } else {
            initPreloadedReports();
            saveReports();
        }
    }

    private void initPreloadedReports() {
        // 1. Comprehensive Lipid Profile
        List<LabParameter> lipidParams = Arrays.asList(
            new LabParameter("param-ldl", "LDL Cholesterol (Direct)", 146.0, "mg/dL", 0, 100.0, "HIGH", 
                "Atherogenic lipoprotein that carries cholesterol into artery walls.", "ICMR Lipid Guidelines"),
            new LabParameter("param-hdl", "HDL Cholesterol", 52.0, "mg/dL", 40.0, 60.0, "NORMAL", 
                "Cardioprotective reverse cholesterol transporter.", "ACC/AHA Guidelines"),
            new LabParameter("param-trig", "Serum Triglycerides", 178.0, "mg/dL", 0, 150.0, "HIGH", 
                "Circulating neutral fats synthesized in response to refined carbohydrates.", "NCEP-ATP III"),
            new LabParameter("param-tc", "Total Cholesterol", 228.0, "mg/dL", 100.0, 200.0, "HIGH", 
                "Total circulating sterol molecules in blood.", "ESC 2024 Guidelines")
        );

        reports.add(new MedicalReport(
            "rep-lipid-01",
            "user-arjun",
            "Comprehensive Fasting Lipid Profile",
            "Max Diagnostic Labs & PathCare (NABL Accredited)",
            "15 Aug 2026",
            "Lipids & Cardiovascular",
            "99.4% OCR Confidence",
            "Fasting lipid panel demonstrates elevated LDL (146 mg/dL) and borderline triglycerides (178 mg/dL). HDL is optimal (52 mg/dL). Clinical lifestyle intervention with soluble fiber and aerobic conditioning recommended.",
            lipidParams
        ));

        // 2. Diabetic HbA1c & Fasting Glycemic Panel
        List<LabParameter> diabeticParams = Arrays.asList(
            new LabParameter("param-hba1c", "HbA1c (Glycated Hemoglobin)", 7.4, "%", 4.0, 5.6, "HIGH", 
                "90-day average blood glucose level.", "ADA Standards of Care"),
            new LabParameter("param-fbs", "Fasting Blood Glucose", 132.0, "mg/dL", 70.0, 99.0, "HIGH", 
                "Fasting capillary plasma glucose.", "ICMR Diabetes Guidelines"),
            new LabParameter("param-insulin", "Fasting Serum Insulin", 14.2, "uIU/mL", 2.6, 24.9, "NORMAL", 
                "Basal pancreatic beta-cell insulin secretion.", "Endocrine Society")
        );

        reports.add(new MedicalReport(
            "rep-diab-02",
            "user-rajesh",
            "Diabetic Glycemic & HbA1c Panel",
            "Dr. Lal PathLabs (ISO 15189 Certified)",
            "10 Aug 2026",
            "Diabetes & Endocrinology",
            "98.9% OCR Confidence",
            "HbA1c is 7.4%, indicating sub-optimally controlled glycemia. Post-meal walking and dietary carbohydrate management advised.",
            diabeticParams
        ));

        // 3. Thyroid Function Test (TFT)
        List<LabParameter> thyroidParams = Arrays.asList(
            new LabParameter("param-tsh", "TSH (Thyroid Stimulating Hormone)", 5.85, "uIU/mL", 0.40, 4.50, "HIGH", 
                "Pituitary hormone regulating thyroid function.", "American Thyroid Association"),
            new LabParameter("param-ft4", "Free T4 (Free Thyroxine)", 1.15, "ng/dL", 0.80, 1.80, "NORMAL", 
                "Circulating unbound active thyroxine hormone.", "ATA Guidelines"),
            new LabParameter("param-ft3", "Free T3 (Free Triiodothyronine)", 3.10, "pg/mL", 2.30, 4.20, "NORMAL", 
                "Active metabolic cellular thyroid hormone.", "ATA Guidelines")
        );

        reports.add(new MedicalReport(
            "rep-thyroid-03",
            "user-sunita",
            "Comprehensive Thyroid Function Test (TFT)",
            "Apollo Diagnostics Center",
            "02 Aug 2026",
            "Thyroid & Endocrine",
            "99.1% OCR Confidence",
            "TSH is mildly elevated at 5.85 uIU/mL with normal FT4 and FT3, consistent with early subclinical hypothyroidism. Take thyroxine empty stomach with plain water.",
            thyroidParams
        ));
    }

    public synchronized List<MedicalReport> getAllReports() {
        return new ArrayList<>(reports);
    }

    public synchronized List<MedicalReport> getReportsByProfile(String profileId) {
        List<MedicalReport> result = new ArrayList<>();
        for (MedicalReport r : reports) {
            if (profileId == null || profileId.equalsIgnoreCase(r.getProfileId())) {
                result.add(r);
            }
        }
        return result.isEmpty() ? reports : result;
    }

    public synchronized MedicalReport addReport(MedicalReport newReport) {
        if (newReport.getId() == null || newReport.getId().isEmpty()) {
            newReport.setId("rep-" + System.currentTimeMillis());
        }
        reports.add(0, newReport);
        saveReports();
        return newReport;
    }

    private synchronized void saveReports() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < reports.size(); i++) {
            MedicalReport r = reports.get(i);
            sb.append("{")
              .append("\"id\":\"").append(escapeJson(r.getId())).append("\",")
              .append("\"profileId\":\"").append(escapeJson(r.getProfileId())).append("\",")
              .append("\"title\":\"").append(escapeJson(r.getTitle())).append("\",")
              .append("\"labName\":\"").append(escapeJson(r.getLabName())).append("\",")
              .append("\"testDate\":\"").append(escapeJson(r.getTestDate())).append("\",")
              .append("\"category\":\"").append(escapeJson(r.getCategory())).append("\",")
              .append("\"ocrConfidence\":\"").append(escapeJson(r.getOcrConfidence())).append("\",")
              .append("\"overallSummary\":\"").append(escapeJson(r.getOverallSummary())).append("\",")
              .append("\"parameters\":[");
            List<LabParameter> params = r.getParameters();
            if (params != null) {
                for (int j = 0; j < params.size(); j++) {
                    LabParameter p = params.get(j);
                    sb.append("{")
                      .append("\"id\":\"").append(escapeJson(p.getId())).append("\",")
                      .append("\"name\":\"").append(escapeJson(p.getName())).append("\",")
                      .append("\"value\":").append(p.getValue()).append(",")
                      .append("\"unit\":\"").append(escapeJson(p.getUnit())).append("\",")
                      .append("\"minNormal\":").append(p.getMinNormal()).append(",")
                      .append("\"maxNormal\":").append(p.getMaxNormal()).append(",")
                      .append("\"status\":\"").append(escapeJson(p.getStatus())).append("\",")
                      .append("\"plainDescription\":\"").append(escapeJson(p.getPlainDescription())).append("\",")
                      .append("\"clinicalCitation\":\"").append(escapeJson(p.getClinicalCitation())).append("\"")
                      .append("}");
                    if (j < params.size() - 1) sb.append(",");
                }
            }
            sb.append("]}");
            if (i < reports.size() - 1) sb.append(",");
        }
        sb.append("]");
        db.saveTableData("reports", sb.toString());
    }

    private void parseReportsJson(String json) {
        try {
            // Robust simple extractor for reports
            String[] items = json.split("\\{\"id\":");
            for (int i = 1; i < items.length; i++) {
                String block = items[i];
                String id = extractField(block, "\"id\":\"", "\"");
                if (id.isEmpty()) id = "rep-" + i;
                String profileId = extractField(block, "\"profileId\":\"", "\"");
                String title = extractField(block, "\"title\":\"", "\"");
                String labName = extractField(block, "\"labName\":\"", "\"");
                String testDate = extractField(block, "\"testDate\":\"", "\"");
                String category = extractField(block, "\"category\":\"", "\"");
                String ocrConf = extractField(block, "\"ocrConfidence\":\"", "\"");
                String summary = extractField(block, "\"overallSummary\":\"", "\"");

                List<LabParameter> params = new ArrayList<>();
                if (block.contains("\"parameters\":[")) {
                    String paramPart = block.split("\"parameters\":\\[")[1].split("\\]")[0];
                    String[] pItems = paramPart.split("\\{\"id\":");
                    for (int j = 1; j < pItems.length; j++) {
                        String pBlock = pItems[j];
                        String pId = extractField(pBlock, "\"id\":\"", "\"");
                        String pName = extractField(pBlock, "\"name\":\"", "\"");
                        double pVal = extractDouble(pBlock, "\"value\":");
                        String pUnit = extractField(pBlock, "\"unit\":\"", "\"");
                        double pMin = extractDouble(pBlock, "\"minNormal\":");
                        double pMax = extractDouble(pBlock, "\"maxNormal\":");
                        String pStatus = extractField(pBlock, "\"status\":\"", "\"");
                        String pDesc = extractField(pBlock, "\"plainDescription\":\"", "\"");
                        String pCite = extractField(pBlock, "\"clinicalCitation\":\"", "\"");
                        params.add(new LabParameter(pId, pName, pVal, pUnit, pMin, pMax, pStatus, pDesc, pCite));
                    }
                }
                reports.add(new MedicalReport(id, profileId, title, labName, testDate, category, ocrConf, summary, params));
            }
        } catch (Exception e) {
            initPreloadedReports();
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

    private double extractDouble(String block, String prefix) {
        try {
            int start = block.indexOf(prefix);
            if (start == -1) return 0.0;
            start += prefix.length();
            int end = block.indexOf(",", start);
            if (end == -1) end = block.indexOf("}", start);
            return Double.parseDouble(block.substring(start, end).trim());
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
