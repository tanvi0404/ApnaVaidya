package com.apnavaidya.service;

import com.apnavaidya.model.LabParameter;
import com.apnavaidya.model.MedicalReport;
import com.apnavaidya.storage.repository.MedicalReportRepository;

import java.util.*;

/**
 * ApnaVaidya Diagnostic Lab Report Service
 * Fully backed by the Phase 4 MedicalReportRepository
 */
public class ReportService {

    private final MedicalReportRepository reportRepo = new MedicalReportRepository();

    public ReportService() {
        initIfEmpty();
    }

    private void initIfEmpty() {
        if (!com.apnavaidya.storage.DatabaseManager.getInstance().isPostgres() && reportRepo.findAll().isEmpty()) {
            initPreloadedReports();
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

        reportRepo.save(new MedicalReport(
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

        reportRepo.save(new MedicalReport(
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

        reportRepo.save(new MedicalReport(
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

    public List<MedicalReport> getAllReports() {
        return reportRepo.findAll();
    }

    public List<MedicalReport> getReportsByProfile(String profileId) {
        List<MedicalReport> res = reportRepo.findByProfileId(profileId);
        return res.isEmpty() ? reportRepo.findAll() : res;
    }

    public MedicalReport addReport(MedicalReport newReport) {
        return reportRepo.save(newReport);
    }
}
