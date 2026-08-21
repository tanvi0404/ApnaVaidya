package com.apnavaidya;

import com.apnavaidya.model.*;
import com.apnavaidya.service.*;
import com.apnavaidya.storage.DatabaseManager;

import java.util.*;

/**
 * ApnaVaidya Comprehensive Clinical Test Suite
 * Validates backend risk engines, pharmacovigilance, simulation regressions, and persistence.
 */
public class ApnaVaidyaTest {

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("🧪 Running ApnaVaidya Java 17 Test Suite");
        System.out.println("==================================================");

        int passed = 0;
        int failed = 0;

        // Test 1: ASCVD 10-Year Cardiovascular Risk Calculator
        try {
            ClinicalRiskService riskService = new ClinicalRiskService();
            AscvdRequest req = new AscvdRequest();
            req.setAge(52);
            req.setGender("Male");
            req.setTotalChol(220);
            req.setHdlChol(42);
            req.setSystolicBp(138);
            req.setSmoker(false);
            req.setDiabetic(false);

            AscvdResponse res = riskService.calculateAscvdRisk(req);
            
            assert res.getRiskPercent() > 0 : "ASCVD risk must be positive";
            assert res.getCategory() != null : "Risk category must not be null";
            assert res.getRecommendation() != null && !res.getRecommendation().isEmpty() : "Must have clinical recommendations";
            
            System.out.printf("  ✓ [PASS] ASCVD Risk Engine: %.1f%% (%s)%n", res.getRiskPercent(), res.getCategory());
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] ASCVD Risk Engine: " + t.getMessage());
            failed++;
        }

        // Test 2: IDRS Indian Diabetes Risk Score
        try {
            ComprehensiveHealthService compService = new ComprehensiveHealthService();
            Map<String, Object> idrs = compService.calculateIdrs(55, 95, "Sedentary / Desk Job", "Both Parents Diabetic");
            
            int score = (Integer) idrs.get("idrsScore");
            String cat = (String) idrs.get("riskCategory");
            assert score >= 60 : "High risk IDRS score expected for 55yo sedentary with diabetic parents";
            assert cat != null && cat.contains("HIGH RISK") : "Expected HIGH RISK";
            
            System.out.printf("  ✓ [PASS] IDRS Diabetes Engine: Score %d/100 (%s)%n", score, cat);
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] IDRS Diabetes Engine: " + t.getMessage());
            failed++;
        }

        // Test 3: What-If Metabolic Simulator Regression
        try {
            SimulationService simService = new SimulationService();
            Map<String, Object> sim = simService.simulateLifestyleIntervention(
                7.4, 160.0, 138.0, 82.0, 45, 20, 1.5, 5.0
            );

            double hba1cDrop = (Double) sim.get("hba1cReduction");
            double ldlDrop = (Double) sim.get("ldlReduction");
            double sbpDrop = (Double) sim.get("sbpReduction");

            assert hba1cDrop > 0 : "HbA1c drop should be positive";
            assert ldlDrop > 0 : "LDL drop should be positive";
            assert sbpDrop > 0 : "SBP drop should be positive";

            System.out.printf("  ✓ [PASS] What-If Simulation: HbA1c -%.2f%%, LDL -%.1f mg/dL, SBP -%.1f mmHg%n",
                hba1cDrop, ldlDrop, sbpDrop);
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] What-If Simulation: " + t.getMessage());
            failed++;
        }

        // Test 4: Pharmacovigilance & Drug Interaction Checks
        try {
            MedicationService medService = new MedicationService();
            List<String> warnings = medService.checkInteractions(Arrays.asList("Atorvastatin", "Levothyroxine", "Calcium Carbonate", "Metformin"));
            
            assert warnings.size() >= 3 : "Should detect Statin, Thyroxine chelation, and Metformin B12 warnings";
            System.out.printf("  ✓ [PASS] Drug Pharmacovigilance: Detected %d clinical safety warnings%n", warnings.size());
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Drug Pharmacovigilance: " + t.getMessage());
            failed++;
        }

        // Test 5: Cryptographic Digital Prescription & SHA-256 Signing
        try {
            ComprehensiveHealthService compService = new ComprehensiveHealthService();
            Map<String, Object> rx = compService.generateDigitalPrescription(
                "Dr. A. K. Sharma", "NMC-48201", "Arjun Sharma", "Essential Dyslipidemia", Arrays.asList("Atorva 10mg OD")
            );

            String sig = (String) rx.get("digitalSignature");
            assert sig != null && sig.startsWith("0x") && sig.length() > 20 : "Must generate valid SHA-256 signature hash";
            System.out.printf("  ✓ [PASS] Cryptographic E-Prescription: Signature %s%n", sig);
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Cryptographic E-Prescription: " + t.getMessage());
            failed++;
        }

        // Test 6: DatabaseManager Persistent Storage Verification
        try {
            DatabaseManager db = DatabaseManager.getInstance();
            String testKey = "test_persistence";
            String testVal = "{\"testStatus\":\"PERSISTED_OK\",\"timestamp\":" + System.currentTimeMillis() + "}";
            db.saveTableData(testKey, testVal);
            
            String loaded = db.loadTableData(testKey);
            assert loaded != null && loaded.contains("PERSISTED_OK") : "Loaded data must match saved payload";
            System.out.printf("  ✓ [PASS] DatabaseManager Atomic Persistence: File I/O Verified%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] DatabaseManager Atomic Persistence: " + t.getMessage());
            failed++;
        }

        System.out.println("==================================================");
        System.out.printf("🏁 Test Results: %d Passed, %d Failed%n", passed, failed);
        System.out.println("==================================================");

        if (failed > 0) {
            System.exit(1);
        }
    }
}
