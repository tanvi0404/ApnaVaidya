# 🌿 ApnaVaidya (अपना वैद्य) — Comprehensive AI Healthcare Platform

> **Your Health, Understood.**  
> An enterprise-grade, privacy-first personal healthcare platform featuring a **White + Emerald Green + Caring Rose Pink** clinical design system, dynamic on-demand code-splitting, an on-device Neural OCR ingestion engine (`pdfjs-dist` + `tesseract.js`), and a high-performance **Java 17 REST API Backend** running with AES-256 GCM encrypted persistence, SQL schema migrations, and an immutable SHA-256 audit ledger.

[![CI Workflow](https://github.com/tanvi0404/ApnaVaidya/actions/workflows/ci.yml/badge.svg)](https://github.com/tanvi0404/ApnaVaidya/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/Tests-27%2F27%20Passed-emerald.svg)](https://github.com/tanvi0404/ApnaVaidya)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Key Platform Features & Technical Architecture

| Feature / Module | Backend Security & Storage | Technical Architecture Details |
| :--- | :---: | :--- |
| **🔐 Enterprise Auth & JWT Tokens** | **HMAC-SHA256 JWT + Salted SHA-256** | Salted SHA-256 password hashing with 1,000 rounds of key stretching, 16-byte random salt per user, constant-time signature verification, and 7-day token expiration. |
| **🔒 100% Endpoint Shielding & CORS** | **20/20 Endpoints Protected** | All 20 clinical, biometrics, simulation, and intelligence routes enforce `isAuthorized()` Bearer validation. Origin-restricted CORS allowlist prevents cross-site request forgery. |
| **📄 Neural OCR & Multi-Format Ingestion** | **pdfjs-dist + tesseract.js** | Extracts digital PDF text layers and performs on-device neural optical character recognition on scanned images (`.png`, `.jpg`, `.jpeg`, `.webp`) with regex entity extraction across 16 clinical biomarkers. |
| **🤖 Chikitsak AI & Multi-Model RAG** | **Gemini 1.5 / OpenAI / Ollama** | Zero-latency emergency red-flag triage (<1ms, AIIMS/AHA) + Multi-Model LLM Gateway with robust JSON parsing + Dynamic Indian Clinical RAG grounded in ICMR & Harrison's guidelines across 4 languages (EN, HI, HG, PB). |
| **🗄️ Relational Database & Migrations** | **SchemaMigrator + Repositories** | Automatic startup DDL schema migrations for 6 core tables (`users`, `family_profiles`, `medical_reports`, `medications`, `audit_logs`, `clinical_prescriptions`) backed by thread-safe repositories. |
| **🛡️ AES-256 GCM Cryptographic Vault** | **Authenticated Encryption at Rest** | Sensitive PII and health credentials stored encrypted at rest using AES-256 GCM with 12-byte random IVs (`enc_aes256:`), externalized via `VAULT_ENCRYPTION_KEY`. |
| **📊 What-If Lifestyle Scenario Simulator** | **Live Multivariate Engine** | Longitudinal risk modeling projecting 36-month trajectories in HbA1c, LDL-C, SBP, and weight with SVG curve visualizers. |
| **🫀 ASCVD & IDRS Clinical Risk Engines** | **ACC/AHA & ICMR-INDIAB** | Computes 10-Year ASCVD Cardiovascular Risk and Indian Diabetes Risk Score (0-100) with category-stratified preventive recommendations. |
| **💊 Medications & Pharmacovigilance** | **Thread-Safe Repository** | Real-time dosage adherence tracking, pill countdown inventory, and automated drug-drug / drug-food contraindication checks. |
| **🌿 Ayurvedic Prakriti & Herb Safety** | **Charaka Samhita Rules Engine** | Constitutional Tri-Dosha distribution (Vata/Pitta/Kapha percentage) and Ayurvedic Ahara & Dinacharya lifestyle guidance. |
| **🧬 Pharmacogenomics (PGx) Matcher** | **CPIC Guidelines** | Clinical Pharmacogenetics Implementation Consortium (CPIC) drug-gene matching for `CYP2C19`, `SLCO1B1`, `CYP2D6`, and `MTHFR`. |
| **⏳ Longevity & Biological Aging** | **Multi-Biomarker Composite** | Biological age vs chronological age, aging velocity coefficient, and personalized longevity levers. |
| **📜 Immutable Security Audit Trail** | **SHA-256 Cryptographic Ledger** | Immutable append-only audit trail recording user logins, document uploads, and EHR consent events with tamper-evident block hashes. |

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, `pdfjs-dist`, `tesseract.js`, Web Speech API.
- **Testing**: Vitest 4, React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), JSDOM.
- **Backend Engine**: Java 17 (OpenJDK), Multi-threaded `com.sun.net.httpserver.HttpServer`, `ReentrantReadWriteLock` concurrency, `java.security` cryptography.
- **Storage Layer**: Relational Repository Layer (`UserRepository`, `MedicalReportRepository`, `MedicationRepository`), SQL DDL Migrator (`SchemaMigrator.java`), AES-256 GCM Cryptographic Vault.
- **Deployment**: Docker, Docker Compose, Render (`render.yaml`), Vercel (`vercel.json`), Netlify (`netlify.toml`).

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/tanvi0404/ApnaVaidya.git
cd ApnaVaidya
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Run the Automated Full-Stack Test Suite
```bash
npm run test:all
```
*Executes both the Java 17 backend suite (16 tests) and Vitest frontend suite (11 tests) — **27/27 Passing (100% Green)**.*

### 4. Start the Application
- **Option A (Standard Development)**:
  ```bash
  # Terminal 1: Start Java 17 Backend
  npm run start:server

  # Terminal 2: Start Vite Frontend
  npm run dev
  ```
- **Option B (1-Click Docker)**:
  ```bash
  docker compose up --build -d
  ```

Open **`http://localhost:5173/`** in your browser.

---

## 🧪 Automated Testing Matrix (`npm run test:all`)

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
  ✓ [PASS] Cryptographic Password Hashing: Salted SHA-256 Verified
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

 RUN  v4.1.11 C:/Users/tanvi/Desktop/ApnaVaidya

 ✓ src/services/__tests__/securityAuth.test.js (2 tests)
 ✓ src/services/__tests__/ocrReportService.test.js (3 tests)
 ✓ src/utils/__tests__/clinicalCalculators.test.js (3 tests)
 ✓ src/components/chat/__tests__/ChikitsakChat.test.jsx (3 tests)

 Test Files  4 passed (4)
      Tests  11 passed (11)
==================================================
🏁 Grand Total: 27/27 Tests Passing (100% Green)
==================================================
```

---

## 🔌 API Route Reference (23 Endpoints)

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | System status and port discovery probe |
| `/api/auth/login` | `POST` | Public | Authenticates user credentials & returns HMAC-SHA256 JWT |
| `/api/auth/register` | `POST` | Public | Registers user with salted password hash & AES-256 encryption |
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

## 🔒 Security & Privacy Best Practices

- **Zero-Knowledge Field Encryption**: Passwords, salts, blood groups, and addresses are encrypted at rest with AES-256 GCM (`DatabaseManager.encryptField`).
- **Cryptographic Key Externalization**: `JWT_SECRET` and `VAULT_ENCRYPTION_KEY` are externalized via environment variables.
- **Demo Mode Isolation**: Demo accounts (`Demo@123`) showcase pre-seeded datasets, while registered accounts begin with a **100% clean slate** for real health records.
- **On-Device OCR Execution**: PDF and image text layers are extracted directly in the browser, ensuring diagnostic documents never leave the client unnecessarily.

---

## 📄 License
MIT License. Created for clinical empowerment, patient privacy, and preventive healthcare.
