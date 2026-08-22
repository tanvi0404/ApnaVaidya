package com.apnavaidya;

import com.apnavaidya.model.*;
import com.apnavaidya.service.*;
import com.apnavaidya.storage.DatabaseManager;

import java.util.*;

/**
 * ApnaVaidya Comprehensive Clinical Test Suite
 * Validates backend risk engines, pharmacovigilance, simulation regressions, and persistence round-trip ID integrity.
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

        // Test 2: IDRS Indian Diabetes Risk Score (ICMR-INDIAB Standard, 0 - 100 points)
        try {
            ComprehensiveHealthService compService = new ComprehensiveHealthService();
            Map<String, Object> idrsHigh = compService.calculateIdrs(55, 95, "Sedentary / Desk Job", "Both Parents Diabetic");
            
            int scoreHigh = (Integer) idrsHigh.get("score");
            String catHigh = (String) idrsHigh.get("riskCategory");
            assert scoreHigh == 100 : "Max possible IDRS score must equal exactly 100 (got " + scoreHigh + ")";
            assert catHigh != null && catHigh.contains("HIGH RISK") : "Expected HIGH RISK";

            Map<String, Object> idrsMod = compService.calculateIdrs(38, 85, "Moderate Exercise / Regular Walking", "One Parent Diabetic");
            int scoreMod = (Integer) idrsMod.get("score");
            assert scoreMod == 50 : "Expected 50 for 38yo(20) + 85cm(10) + mod(10) + oneParent(10), got " + scoreMod;
            
            System.out.printf("  ✓ [PASS] IDRS Diabetes Engine: Boundary 0-100 Validated (%d/100, %d/100)%n", scoreHigh, scoreMod);
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

        // Test 7: Persistence Round-Trip ID Integrity (Medications, Reports, Audit Logs)
        try {
            MedicationService medService = new MedicationService();
            List<MedicationItem> meds = medService.getMedicationsByProfile("user-arjun");
            assert !meds.isEmpty() : "Medications list should not be empty";
            
            for (MedicationItem m : meds) {
                assert m.getId() != null && !m.getId().trim().isEmpty() : "Medication ID must not be empty";
                assert m.getId().startsWith("med-") : "Medication ID must start with med- prefix (got: " + m.getId() + ")";
            }

            // Test toggling specific medication
            boolean toggled = medService.toggleMedicationStatus("med-ator-10");
            assert toggled : "Should successfully toggle med-ator-10";

            // Reload from disk to verify round-trip persistence with exact IDs
            MedicationService reloadedMedService = new MedicationService();
            List<MedicationItem> reloadedMeds = reloadedMedService.getMedicationsByProfile("user-arjun");
            MedicationItem ator = reloadedMeds.stream()
                .filter(m -> "med-ator-10".equals(m.getId()))
                .findFirst()
                .orElse(null);
            assert ator != null : "med-ator-10 must exist in reloaded list";
            assert ator.getId().equals("med-ator-10") : "Reloaded ID must equal med-ator-10";

            // Verify Reports ID Integrity
            ReportService reportService = new ReportService();
            List<MedicalReport> reports = reportService.getAllReports();
            assert !reports.isEmpty() : "Reports list should not be empty";
            for (MedicalReport r : reports) {
                assert r.getId() != null && !r.getId().trim().isEmpty() : "Report ID must not be empty";
                assert r.getId().startsWith("rep-") : "Report ID must start with rep- (got: " + r.getId() + ")";
            }

            // Verify Audit Logs ID Integrity
            ComprehensiveHealthService auditService = new ComprehensiveHealthService();
            List<Map<String, Object>> logs = auditService.getAuditLogs();
            assert !logs.isEmpty() : "Audit logs list should not be empty";
            for (Map<String, Object> l : logs) {
                String logId = (String) l.get("id");
                assert logId != null && !logId.trim().isEmpty() : "Audit Log ID must not be empty";
                assert logId.startsWith("audit-") : "Audit Log ID must start with audit- (got: " + logId + ")";
            }

            System.out.printf("  ✓ [PASS] Persistence Round-Trip ID Integrity: Verified (Meds, Reports, Audit Logs)%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Persistence Round-Trip ID Integrity: " + t.getMessage());
            failed++;
        }

        // Test 8: Salted SHA-256 Multi-Round Password Hashing & Tamper Detection
        try {
            String password = "SecurePatientPassword#2026";
            String salt = AuthSecurityService.generateSalt();
            assert salt != null && salt.length() == 32 : "Salt must be a 32-char hex string (16 bytes)";

            String hash1 = AuthSecurityService.hashPassword(password, salt);
            String hash2 = AuthSecurityService.hashPassword(password, salt);
            assert hash1.equals(hash2) : "Hash must be deterministic for identical salt and password";

            boolean verified = AuthSecurityService.verifyPassword(password, salt, hash1);
            assert verified : "Correct password must verify successfully";

            boolean wrongPassword = AuthSecurityService.verifyPassword("WrongPassword", salt, hash1);
            assert !wrongPassword : "Incorrect password must be rejected";

            System.out.printf("  ✓ [PASS] Cryptographic Password Hashing: Salted SHA-256 Verified%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Cryptographic Password Hashing: " + t.getMessage());
            failed++;
        }

        // Test 9: HMAC-SHA256 Signed JWT Token Generation & Signature Integrity
        try {
            String userId = "user-test-8492";
            String email = "test.patient@apnavaidya.in";
            String name = "Test Patient";

            String token = AuthSecurityService.createJwtToken(userId, email, name);
            assert token != null && token.split("\\.").length == 3 : "JWT must have header.payload.signature format";

            Map<String, String> claims = AuthSecurityService.verifyJwtToken(token);
            assert claims != null : "Valid token must decode and verify";
            assert userId.equals(claims.get("sub")) : "Subject must match user ID";
            assert email.equals(claims.get("email")) : "Email claim must match";

            // Tamper token payload and verify rejection
            String[] parts = token.split("\\.");
            String tamperedToken = parts[0] + ".eyJzdWIiOiJoYWNrZXIifQ." + parts[2];
            Map<String, String> tamperedClaims = AuthSecurityService.verifyJwtToken(tamperedToken);
            assert tamperedClaims == null : "Tampered token must be rejected by signature validator";

            System.out.printf("  ✓ [PASS] Cryptographic JWT Tokens: HMAC-SHA256 Signature Verified%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Cryptographic JWT Tokens: " + t.getMessage());
            failed++;
        }

        // Test 10: Demo Password Validation & JWT Secret Externalization
        try {
            assert AuthSecurityService.isDemoPasswordValid("Demo@123") : "Demo@123 must be recognized as a valid demo password";
            assert AuthSecurityService.isDemoPasswordValid("demo123") : "demo123 must be recognized";
            assert !AuthSecurityService.isDemoPasswordValid("RandomPass") : "Arbitrary passwords must NOT bypass demo login";
            assert !AuthSecurityService.isDemoPasswordValid("") : "Empty password must NOT bypass demo login";

            String secret = AuthSecurityService.getJwtSecret();
            assert secret != null && !secret.isEmpty() : "JWT secret must be loaded";

            System.out.printf("  ✓ [PASS] Demo Auth Lockdown & Secret Externalization: Verified%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Demo Auth Lockdown & Secret Externalization: " + t.getMessage());
            failed++;
        }

        // Test 11: AES-256 GCM Authenticated Field Encryption at Rest
        try {
            String sensitiveLabNote = "Patient fasting blood glucose elevated at 148 mg/dL with microalbuminuria.";
            String cipher = DatabaseManager.encryptField(sensitiveLabNote);
            assert cipher != null && cipher.startsWith("enc_aes256:") : "Encrypted string must have enc_aes256: prefix";
            assert !cipher.contains("glucose") : "Ciphertext must not expose plaintext biomarkers";

            String decrypted = DatabaseManager.decryptField(cipher);
            assert sensitiveLabNote.equals(decrypted) : "Decrypted text must match original plaintext";

            System.out.printf("  ✓ [PASS] AES-256 GCM Cryptographic Vault: Field Encryption Verified%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] AES-256 GCM Cryptographic Vault: " + t.getMessage());
            failed++;
        }

        // Test 12: Chikitsak AI Emergency Intercept & Multi-Lingual RAG
        try {
            ChikitsakAiService aiService = new ChikitsakAiService();

            // Check English emergency intercept
            assert aiService.detectRedFlagEmergency("I am having severe crushing chest pain radiating to my left arm") : "Must detect acute cardiac red-flag";

            // Check Hindi/Hinglish emergency intercept
            assert aiService.detectRedFlagEmergency("Mujhe chhati me dard ho raha hai aur saans lene me dikkat hai") : "Must detect Hinglish cardiac red-flag";

            ChatRequest emergencyReq = new ChatRequest();
            emergencyReq.setUserMessage("I have sudden chest pain and can't breathe");
            emergencyReq.setProfileName("Arjun Sharma");
            emergencyReq.setProfileAge(52);
            emergencyReq.setProfileGender("Male");
            emergencyReq.setLanguage("en");

            ChatResponse emergencyResp = aiService.generateResponse(emergencyReq);
            assert emergencyResp.isEmergency() : "Emergency flag must be set to true";
            assert emergencyResp.getContent().contains("108") || emergencyResp.getContent().contains("112") : "Emergency response must contain ambulance dial numbers";

            // Check standard clinical RAG query
            ChatRequest clinicalReq = new ChatRequest();
            clinicalReq.setUserMessage("What should be my target LDL level and how to reduce it?");
            clinicalReq.setProfileName("Arjun Sharma");
            clinicalReq.setProfileAge(52);
            clinicalReq.setProfileGender("Male");
            clinicalReq.setLanguage("en");

            ChatResponse clinicalResp = aiService.generateResponse(clinicalReq);
            assert !clinicalResp.isEmergency() : "Clinical query must not flag emergency";
            assert clinicalResp.getContent().contains("LDL") : "Response must ground on LDL clinical target";
            assert clinicalResp.getCitations().contains("ICMR Clinical Practice Guidelines") : "Must cite ICMR guidelines";

            System.out.printf("  ✓ [PASS] Chikitsak AI & Clinical RAG: Emergency Intercept & ICMR Grounding Verified%n");
            passed++;
        } catch (Throwable t) {
            System.err.println("  ✗ [FAIL] Chikitsak AI & Clinical RAG: " + t.getMessage());
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
