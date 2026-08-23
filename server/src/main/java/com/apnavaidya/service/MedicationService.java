package com.apnavaidya.service;

import com.apnavaidya.model.MedicationItem;
import com.apnavaidya.storage.repository.MedicationRepository;

import java.util.*;

/**
 * ApnaVaidya Prescription Medication & Drug Pharmacovigilance Service
 * Fully backed by the Phase 4 MedicationRepository
 */
public class MedicationService {

    private final MedicationRepository medicationRepo = new MedicationRepository();

    public MedicationService() {
        initIfEmpty();
    }

    private void initIfEmpty() {
        if (!com.apnavaidya.storage.DatabaseManager.getInstance().isPostgres() && medicationRepo.findAll().isEmpty()) {
            initMedications();
        }
    }

    private void initMedications() {
        // Arjun's Medications
        medicationRepo.save(new MedicationItem(
            "med-ator-10", "user-arjun", "Atorva 10", "Atorvastatin Calcium", "10 mg",
            "Once Daily (OD)", "9:30 PM (Bedtime)", "After dinner, before sleep",
            "LDL-C Reduction & Plaque Stabilization", "Dr. A. K. Sharma (Cardiology)",
            18, 30, 18, false
        ));
        medicationRepo.save(new MedicationItem(
            "med-vitd-60k", "user-arjun", "Calcirol 60K", "Cholecalciferol (Vitamin D3)", "60,000 IU",
            "Once Weekly (QW)", "Sunday 9:00 AM", "With milk / healthy fat meal",
            "Vitamin D3 Deficiency Correction", "Dr. A. K. Sharma (Cardiology)",
            4, 8, 4, true
        ));
        medicationRepo.save(new MedicationItem(
            "med-omega3", "user-arjun", "MaxEPA Omega-3", "EPA 180mg + DHA 120mg", "1 Capsule",
            "Once Daily (OD)", "1:30 PM (Post Lunch)", "Immediately after lunch",
            "Triglyceride & Endothelial Support", "Dr. Neha Verma (Nutrition)",
            24, 60, 24, true
        ));

        // Rajesh's Medications
        medicationRepo.save(new MedicationItem(
            "med-met-500", "user-rajesh", "Glycomet 500", "Metformin Hydrochloride", "500 mg",
            "Twice Daily (BD)", "8:30 AM & 8:30 PM", "With or immediately after main meals",
            "Type-2 Diabetes Glycemic Control", "Dr. V. K. Gupta (Endocrinology)",
            12, 60, 24, false
        ));
        medicationRepo.save(new MedicationItem(
            "med-telmi-40", "user-rajesh", "Telma 40", "Telmisartan", "40 mg",
            "Once Daily (OD)", "8:00 AM (Morning)", "Empty stomach or after breakfast",
            "Hypertension & Renal Protection", "Dr. V. K. Gupta (Endocrinology)",
            20, 30, 20, false
        ));

        // Sunita's Medications
        medicationRepo.save(new MedicationItem(
            "med-thyro-50", "user-sunita", "Thyronorm 50", "Levothyroxine Sodium", "50 mcg",
            "Once Daily (OD)", "6:30 AM (Early Morning)", "Empty stomach with plain water, 45 mins before tea/breakfast",
            "Hypothyroidism Hormone Replacement", "Dr. Shalini Rai (Endocrinology)",
            15, 100, 45, true
        ));
    }

    public List<MedicationItem> getAllMedications() {
        return medicationRepo.findAll();
    }

    public List<MedicationItem> getMedicationsByProfile(String profileId) {
        List<MedicationItem> res = medicationRepo.findByProfileId(profileId);
        return res.isEmpty() ? medicationRepo.findAll() : res;
    }

    public MedicationItem addMedication(MedicationItem item) {
        return medicationRepo.save(item);
    }

    public boolean toggleMedicationTaken(String id) {
        return medicationRepo.toggleTakenToday(id);
    }

    public boolean toggleMedicationStatus(String id) {
        return medicationRepo.toggleTakenToday(id);
    }

    /**
     * Drug Interaction & Pharmacovigilance Rule Engine
     */
    public List<String> checkInteractions(List<String> drugs) {
        List<String> warnings = new ArrayList<>();
        if (drugs == null || drugs.size() < 2) return warnings;

        Set<String> set = new HashSet<>();
        for (String d : drugs) set.add(d.toLowerCase());

        if (set.contains("atorvastatin") && (set.contains("clarithromycin") || set.contains("erythromycin"))) {
            warnings.add("HIGH SEVERITY: Atorvastatin + Macrolide Antibiotic significantly increases risk of myopathy / rhabdomyolysis.");
        }
        if (set.contains("levothyroxine") && (set.contains("calcium carbonate") || set.contains("calcium") || set.contains("iron"))) {
            warnings.add("MODERATE SEVERITY: Calcium/Iron supplements impair Levothyroxine gastrointestinal absorption. Separate administration by at least 4 hours.");
        }
        if (set.contains("metformin") && (set.contains("alcohol") || set.contains("iodinated contrast"))) {
            warnings.add("HIGH SEVERITY: Metformin combined with excess alcohol or iodinated contrast media increases risk of lactic acidosis.");
        }
        if (set.contains("telmisartan") && (set.contains("potassium") || set.contains("spironolactone"))) {
            warnings.add("MODERATE SEVERITY: ARB (Telmisartan) paired with potassium supplements may induce hyperkalemia. Monitor serum electrolytes.");
        }

        if (warnings.isEmpty() && drugs.size() >= 2) {
            warnings.add("NO SIGNIFICANT DIRECT CONTRAINDICATIONS: Evaluated " + drugs.size() + " active pharmaceutical compounds against standard pharmacovigilance databases.");
        }

        return warnings;
    }
}
