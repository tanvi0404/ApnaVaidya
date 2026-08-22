# 🌿 ApnaVaidya (अपना वैद्य) — Comprehensive AI Healthcare Platform

> **Your Health, Understood.**  
> An enterprise-grade, privacy-first personal healthcare decision-support platform featuring a **White + Emerald Green + Caring Rose Pink** clinical design system, on-device Neural OCR (`pdfjs-dist` + `tesseract.js`), and a high-performance **Java 17 REST API Backend** running with AES-256 GCM encrypted persistence, SQL schema migrations, and an immutable SHA-256 audit ledger.

[![CI Workflow](https://github.com/tanvi0404/ApnaVaidya/actions/workflows/ci.yml/badge.svg)](https://github.com/tanvi0404/ApnaVaidya/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/Tests-27%2F27%20Passed-059669.svg)](https://github.com/tanvi0404/ApnaVaidya)
[![Security](https://img.shields.io/badge/Security-AES--256--GCM%20%2B%20PBKDF2-10B981.svg)](https://github.com/tanvi0404/ApnaVaidya)
[![Java](https://img.shields.io/badge/Backend-Java%2017%20LTS-F43F5E.svg)](https://openjdk.org/projects/jdk/17/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%205-0284C7.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-64748B.svg)](https://opensource.org/licenses/MIT)

> ⚠️ **IMPORTANT CLINICAL & MEDICAL DISCLAIMER**  
> **ApnaVaidya is an educational and research healthcare decision-support platform.** It is not a certified medical device and does not replace professional medical judgment, clinical diagnosis, prescription writing, or emergency medical services. The AI insights and risk estimators are designed to assist patient health literacy. **In case of a medical emergency, immediately call 108 or 112 (India) or visit the nearest hospital emergency department.**

---

## 🌐 Live Deployments & Preview

| Platform | Deployment Target | Status | Live Link |
| :--- | :--- | :---: | :--- |
| **🐳 Render** | **Full-Stack Container** (Java 17 REST API + Web UI) | `Blueprint Configured` | [`https://apna-vaidya.onrender.com`](https://dashboard.render.com) |
| **⚡ Vercel** | **Edge CDN Web App** (On-Device OCR & UI Preview) | `Ready to Deploy` | [`https://apnavaidya.vercel.app`](https://vercel.com) |

---

## 📐 System Architecture Diagrams

### 1. High-Level Full-Stack Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                   React 18 + Vite 5 Frontend (SPA)                     │
│       Tailwind CSS • Lucide Icons • On-Demand Lazy Code-Splitting       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  HTTPS REST + HMAC-SHA256 JWT Bearer
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Java 17 High-Throughput REST Engine                  │
│       Multi-threaded HttpServer • 23 Endpoints (20/20 Shielded)        │
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │                                    │
│   🔐 Auth & Security Service      │   🤖 Chikitsak AI & RAG Engine     │
│   • PBKDF2-HMAC-SHA512 (100k)     │   • <1ms Red-Flag Intercept        │
│   • HMAC-SHA256 Signed JWTs       │   • Multi-Model (Gemini / GPT / Ollama)
│   • Origin-Checked CORS Guard     │   • ICMR & Harrison's Grounding    │
│                                   │                                    │
├───────────────────────────────────┴────────────────────────────────────┤
│                    🗄️ Relational Repository Layer                      │
│      UserRepository • MedicalReportRepository • MedicationRepository    │
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │                                    │
│   🛡️ AES-256 GCM Vault            │   📜 SQL Schema Migrator           │
│   • Authenticated Encryption      │   • Automatic DDL Startup (6 tables)│
│   • Externalized Key (SHA-256)    │   • ReentrantReadWriteLock I/O     │
│                                   │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 2. Clinical Diagnostic Data Flow
```
[User Uploads PDF / Scanned Image]
               │
               ▼
[On-Device Neural OCR: pdfjs-dist Text Layer + tesseract.js Neural Worker]
               │
               ▼
[Regex Clinical Entity Parser (16 Biomarkers: HbA1c, LDL, TSH, Glucose...)]
               │
               ▼
[Multi-Model RAG & Clinical Engines (ASCVD Risk, IDRS, Organ Heatmap)]
               │
               ▼
[AES-256 GCM Encrypted Persistence + Immutable SHA-256 Audit Log]
```

---

## 📊 Platform Feature Maturity Matrix

### ✅ Fully Implemented, Verified & Tested
* **🔐 Enterprise Authentication**: NIST SP 800-132 compliant PBKDF2-HMAC-SHA512 (100,000 iterations, 32-byte salt) + HMAC-SHA256 JWTs with 7-day expiry and constant-time signature comparison.
* **🔒 100% Endpoint Shielding & CORS**: 20 of 20 protected REST routes enforce `isAuthorized()` Bearer validation. Origin-restricted CORS allowlist prevents cross-origin hijacking.
* **📄 On-Device Neural OCR**: Browser-level `pdfjs-dist` text layer extractor and `tesseract.js` OCR parsing multi-format reports (`.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.txt`, `.csv`).
* **🤖 Chikitsak AI Assistant**: Zero-latency (<1ms) emergency red-flag triage (AIIMS/AHA) + Multi-Model LLM Gateway (Gemini 1.5, OpenAI GPT-4o, Ollama) + ICMR Clinical RAG in 4 languages (EN, HI, HG, PB).
* **🗄️ Repositories & SQL Schema Migrations**: `SchemaMigrator.java` defines 6 DDL tables (`users`, `family_profiles`, `medical_reports`, `medications`, `audit_logs`, `clinical_prescriptions`) backed by thread-safe repositories.
* **🛡️ AES-256 GCM Field Encryption**: Sensitive PII (`passwordHash`, `salt`, `bloodGroup`, `address`) stored encrypted at rest with 12-byte random IVs (`enc_aes256:`), externalized via `VAULT_ENCRYPTION_KEY`.
* **📊 What-If Lifestyle Scenario Simulator**: Multivariate linear regression algorithms projecting 36-month drops in HbA1c, LDL, SBP, and weight with 3-year SVG curves.
* **🫀 ASCVD & IDRS Clinical Risk Engines**: ACC/AHA 10-Year Cardiovascular Risk & ICMR-INDIAB Indian Diabetes Risk Score (0-100).
* **💊 Medication Adherence & Interactions**: Real-time pill countdown inventory, dosage schedule, and automated contraindication rule checks.
* **👨‍👩‍👧‍👦 Dynamic Family Vault & Clean Slate**: Demo accounts (`Demo@123`) showcase pre-seeded records; newly registered accounts start with an **uncluttered clean slate (0 reports, 0 meds)**.
* **📜 Immutable Security Audit Trail**: Tamper-evident SHA-256 cryptographic audit ledger recording patient record access and consent events.

### 🧪 Specialized Clinical Prototypes
* **🌿 Ayurvedic Prakriti Engine**: Tri-Dosha constitutional distribution (Vata/Pitta/Kapha percentage) and Ahara/Dinacharya lifestyle recommendations.
* **🧬 Pharmacogenomics (PGx) Matcher**: CPIC Level precision drug-gene guidelines (`CYP2C19`, `SLCO1B1`, `CYP2D6`, `MTHFR`).
* **⏳ Longevity & Biological Aging**: Multi-biomarker composite biological age vs chronological age calculation.
* **🦠 Gut Microbiome & Chrono-Nutrition**: Gut flora diversity score, Short-Chain Fatty Acid (SCFA) gauges, and circadian fasting timer.
* **🍃 AQI & Heat Exposome Shield**: Indian city pollutant and heatwave vulnerability index (Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Kolkata).

### 🚧 Planned Roadmap
* **ABDM / ABHA Sandbox Integration**: Milestone 1-3 Health ID creation and HIU/HIP consent manager.
* **FHIR R4 JSON Export**: International patient summary export formatted to HL7 FHIR Release 4.
* **BLE Bluetooth Sensor Streaming**: Direct real-time Web Bluetooth pairing for blood glucose meters and pulse oximeters.

---

## 🏗️ Technical Stack Details

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, Vite 5, Tailwind CSS, Lucide React Icons, Web Speech API |
| **On-Device OCR** | `pdfjs-dist` (Text Layer Extraction), `tesseract.js` (Neural Image OCR) |
| **Backend Engine** | Java 17 (OpenJDK), `com.sun.net.httpserver.HttpServer`, `java.security` |
| **Password Security** | PBKDF2-HMAC-SHA512 (100,000 rounds, 32-byte salt, constant-time verification) |
| **Token Authority** | HMAC-SHA256 signed JSON Web Tokens (JWT) with 7-day expiration |
| **At-Rest Encryption**| AES-256 GCM (12-byte random IV, 128-bit authentication tag) |
| **Database Architecture** | File-backed atomic JSON tables + `SchemaMigrator` DDL + Repository Pattern |
| **Testing Framework**| Vitest 4, `@testing-library/react`, `@testing-library/jest-dom`, Java 17 Suite |
| **Container & Cloud**| Docker Multi-Stage (`Dockerfile`), Docker Compose, Render (`render.yaml`), Vercel (`vercel.json`) |

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/tanvi0404/ApnaVaidya.git
cd ApnaVaidya
npm install
```

### 2. Run the Automated Test Suite (27 Tests)
```bash
npm run test:server    # Executes 16 Java 17 backend security & clinical tests
npm test               # Executes 11 Vitest frontend component & calculator tests
```

### 3. Start the Application
```bash
# Terminal 1: Launch Java 17 REST API (Port 8080)
npm run start:server

# Terminal 2: Launch React Frontend (Port 5173)
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 🧪 Automated Testing Matrix (`npm run test:server`)

```text
==================================================
🧪 Running ApnaVaidya Java 17 Test Suite
==================================================
  ✓ [PASS] ASCVD Risk Engine: 10.2% (INTERMEDIATE)
  ✓ [PASS] IDRS Diabetes Engine: Boundary 0-100 Validated (100/100, 50/100)
  ✓ [PASS] What-If Simulation: HbA1c -0.90%, LDL -18.3 mg/dL, SBP -10.8 mmHg
  ✓ [PASS] Drug Pharmacovigilance: Detected 1 clinical safety warnings
  ✓ [PASS] Cryptographic E-Prescription: Signature Verified
  ✓ [PASS] DatabaseManager Atomic Persistence: File I/O Verified
  ✓ [PASS] Persistence Round-Trip ID Integrity: Verified (Meds, Reports, Audit Logs)
  ✓ [PASS] Cryptographic Password Hashing: PBKDF2-HMAC-SHA512 (100,000 Rounds) Verified
  ✓ [PASS] Cryptographic JWT Tokens: HMAC-SHA256 Signature Verified
  ✓ [PASS] Demo Auth Lockdown & Secret Externalization: Verified
  ✓ [PASS] AES-256 GCM Cryptographic Vault: Field Encryption Verified
  ✓ [PASS] Chikitsak AI & Clinical RAG: Emergency Intercept & ICMR Grounding Verified
  ✓ [PASS] Ayurvedic Prakriti Engine: Vata (50% Vata, 30% Pitta, 20% Kapha)
  ✓ [PASS] Pharmacogenomics (PGx) Matcher: Validated CPIC CYP2C19/Clopidogrel
  ✓ [PASS] Longevity & Biological Age Engine: Score 96/100 (Bio-Age: 47.7 yrs)
  ✓ [PASS] Schema Migrations & Relational Repository Engine: Verified 6 DDL Schemas, AES-256 Vault & Hardened JSON Parser
==================================================
🏁 Java 17 Tests: 16 Passed, 0 Failed (100% Green)
==================================================
```

---

## 🔌 API Route Reference (23 Endpoints)

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | System status and dynamic port discovery probe |
| `/api/auth/login` | `POST` | Public | Authenticates credentials with PBKDF2 & returns JWT |
| `/api/auth/register` | `POST` | Public | Registers user with PBKDF2 hash & AES-256 field encryption |
| `/api/reports` | `GET` / `POST` | **Protected (JWT)** | Medical lab report CRUD & OCR biomarker ingestion |
| `/api/medications` | `GET` / `POST` | **Protected (JWT)** | Active prescription management & dosage logging |
| `/api/medications/interaction` | `POST` | **Protected (JWT)** | Multi-drug contraindication & food interaction analysis |
| `/api/simulation/what-if` | `POST` | **Protected (JWT)** | Multivariate metabolic trajectory forecasting |
| `/api/chat/ask` | `POST` | **Protected (JWT)** | Chikitsak AI multilingual RAG & emergency triage |
| `/api/risk/ascvd` | `POST` | **Protected (JWT)** | 10-Year ASCVD Cardiovascular Risk calculation |
| `/api/risk/idrs` | `POST` | **Protected (JWT)** | ICMR-INDIAB Diabetes Risk Score calculation |
| `/api/vascular/age` | `POST` | **Protected (JWT)** | Estimated Vascular Age & Pulse Wave Velocity (ePWV) |
| `/api/longevity/score` | `POST` | **Protected (JWT)** | Biological Age & Aging Velocity composite score |
| `/api/ayurveda/prakriti` | `POST` | **Protected (JWT)** | Tri-Dosha Prakriti constitutional calculation |
| `/api/organs/heatmap` | `POST` | **Protected (JWT)** | 7-Organ vitality scores based on circulating biomarkers |
| `/api/microbiome/profile` | `GET` | **Protected (JWT)** | Gut flora diversity & Short-Chain Fatty Acid (SCFA) gauges |
| `/api/exposome/city` | `POST` | **Protected (JWT)** | Indian city AQI & environmental vulnerability shield |
| `/api/nutrition/plan` | `POST` | **Protected (JWT)** | Medical Nutrition Therapy (MNT) targets |
| `/api/exercise/routine` | `POST` | **Protected (JWT)** | Cardio-metabolic movement routines |
| `/api/genomics/match` | `POST` | **Protected (JWT)** | CPIC precision drug-gene interaction guidelines |
| `/api/symptoms/triage` | `POST` | **Protected (JWT)** | Clinical red-flag triage & specialist routing |
| `/api/wearables/sync` | `GET` | **Protected (JWT)** | Wearables biometrics sync (Resting HR, HRV, VO2 max) |
| `/api/teleconsult/sign-prescription` | `POST` | **Protected (JWT)** | NMC-compliant cryptographic SHA-256 digital signature |
| `/api/security/audit-logs` | `GET` / `POST` | **Protected (JWT)** | Immutable ABDM/HIPAA SHA-256 audit log stream |

---

## 📄 License
MIT License. Created for clinical empowerment, patient privacy, and preventive healthcare.
