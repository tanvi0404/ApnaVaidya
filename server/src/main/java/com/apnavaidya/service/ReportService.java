package com.apnavaidya.service;

import com.apnavaidya.model.LabParameter;
import com.apnavaidya.model.MedicalReport;
import com.apnavaidya.storage.DatabaseManager;
import com.apnavaidya.storage.JsonUtil;

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
        reports.clear();
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
              .append("\"id\":\"").append(JsonUtil.escapeJson(r.getId())).append("\",")
              .append("\"profileId\":\"").append(JsonUtil.escapeJson(r.getProfileId())).append("\",")
              .append("\"title\":\"").append(JsonUtil.escapeJson(r.getTitle())).append("\",")
              .append("\"labName\":\"").append(JsonUtil.escapeJson(r.getLabName())).append("\",")
              .append("\"testDate\":\"").append(JsonUtil.escapeJson(r.getTestDate())).append("\",")
              .append("\"category\":\"").append(JsonUtil.escapeJson(r.getCategory())).append("\",")
              .append("\"ocrConfidence\":\"").append(JsonUtil.escapeJson(r.getOcrConfidence())).append("\",")
              .append("\"overallSummary\":\"").append(JsonUtil.escapeJson(r.getOverallSummary())).append("\",")
              .append("\"parameters\":[");
            List<LabParameter> params = r.getParameters();
            if (params != null) {
                for (int j = 0; j < params.size(); j++) {
                    LabParameter p = params.get(j);
                    sb.append("{")
                      .append("\"id\":\"").append(JsonUtil.escapeJson(p.getId())).append("\",")
                      .append("\"name\":\"").append(JsonUtil.escapeJson(p.getName())).append("\",")
                      .append("\"value\":").append(p.getValue()).append(",")
                      .append("\"unit\":\"").append(JsonUtil.escapeJson(p.getUnit())).append("\",")
                      .append("\"minNormal\":").append(p.getMinNormal()).append(",")
                      .append("\"maxNormal\":").append(p.getMaxNormal()).append(",")
                      .append("\"status\":\"").append(JsonUtil.escapeJson(p.getStatus())).append("\",")
                      .append("\"plainDescription\":\"").append(JsonUtil.escapeJson(p.getPlainDescription())).append("\",")
                      .append("\"clinicalCitation\":\"").append(JsonUtil.escapeJson(p.getClinicalCitation())).append("\"")
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
            List<String> items = JsonUtil.extractJsonObjects(json);
            if (items.isEmpty()) {
                initPreloadedReports();
                return;
            }
            reports.clear();
            for (String block : items) {
                String id = JsonUtil.extractString(block, "id");
                if (id.isEmpty()) continue;
                String profileId = JsonUtil.extractString(block, "profileId", "user-arjun");
                String title = JsonUtil.extractString(block, "title");
                String labName = JsonUtil.extractString(block, "labName");
                String testDate = JsonUtil.extractString(block, "testDate");
                String category = JsonUtil.extractString(block, "category");
                String ocrConf = JsonUtil.extractString(block, "ocrConfidence");
                String summary = JsonUtil.extractString(block, "overallSummary");

                List<LabParameter> params = new ArrayList<>();
                int paramStart = block.indexOf("\"parameters\":");
                if (paramStart != -1) {
                    String paramPart = block.substring(paramStart);
                    List<String> pItems = JsonUtil.extractJsonObjects(paramPart);
                    for (String pBlock : pItems) {
                        String pId = JsonUtil.extractString(pBlock, "id");
                        String pName = JsonUtil.extractString(pBlock, "name");
                        double pVal = JsonUtil.extractDouble(pBlock, "value");
                        String pUnit = JsonUtil.extractString(pBlock, "unit");
                        double pMin = JsonUtil.extractDouble(pBlock, "minNormal");
                        double pMax = JsonUtil.extractDouble(pBlock, "maxNormal");
                        String pStatus = JsonUtil.extractString(pBlock, "status");
                        String pDesc = JsonUtil.extractString(pBlock, "plainDescription");
                        String pCite = JsonUtil.extractString(pBlock, "clinicalCitation");
                        params.add(new LabParameter(pId, pName, pVal, pUnit, pMin, pMax, pStatus, pDesc, pCite));
                    }
                }
                reports.add(new MedicalReport(id, profileId, title, labName, testDate, category, ocrConf, summary, params));
            }
            if (reports.isEmpty()) {
                initPreloadedReports();
            }
        } catch (Exception e) {
            initPreloadedReports();
        }
    }
}
