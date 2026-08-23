# 🌿 ApnaVaidya (अपना वैद्य) — Personal AI Healthcare Platform

> **Your Health, Understood.**  
> A privacy-first personal healthcare decision-support platform featuring on-device Neural OCR (`pdfjs-dist` + `tesseract.js`), multilingual clinical AI assistant, and a high-performance **Java 17 REST API Backend** running with **PostgreSQL JDBC persistence**, AES-256 GCM encrypted health records, automated DDL migrations, and an immutable SHA-256 audit ledger.

[![CI Workflow](https://github.com/tanvi0404/ApnaVaidya/actions/workflows/ci.yml/badge.svg)](https://github.com/tanvi0404/ApnaVaidya/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/Tests-27%2F27%20Passed-059669.svg)](https://github.com/tanvi0404/ApnaVaidya)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20JSON%20Fallback-336791.svg)](https://www.postgresql.org/)
[![Security](https://img.shields.io/badge/Security-AES--256--GCM%20%2B%20PBKDF2-10B981.svg)](https://github.com/tanvi0404/ApnaVaidya)
[![Backend](https://img.shields.io/badge/Backend-Java%2017%20LTS-F43F5E.svg)](https://openjdk.org/projects/jdk/17/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%205-0284C7.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-64748B.svg)](https://opensource.org/licenses/MIT)

> ⚠️ **IMPORTANT CLINICAL & MEDICAL DISCLAIMER**  
> **ApnaVaidya is an educational and research healthcare decision-support platform.** It is not a certified diagnostic medical device and does not replace professional medical judgment, clinical diagnosis, prescription writing, or emergency medical services. The AI insights and risk estimators are designed to assist patient health literacy. **In case of a medical emergency, immediately call 108 or 112 (India) or visit the nearest hospital emergency department.**

---

## 🌐 Live Deployments

| Platform | Deployment Target | Role | Live Link |
| :--- | :--- | :--- | :--- |
| **⚡ Vercel** | **Edge CDN Web App** | React 18 Frontend UI & On-Device OCR | [`https://apnavaidya.vercel.app`](https://apnavaidya.vercel.app) |
| **🐳 Render** | **Docker Web Service** | Java 17 REST API + PostgreSQL | [`https://apna-vaidya.onrender.com`](https://apna-vaidya.onrender.com) |

---

## 📐 System Architecture

### 1. Cloud-Native Production Topology
```
┌────────────────────────────────────────────────────────────────────────┐
│               React 18 + Vite 5 Frontend SPA (Vercel)                  │
│       Tailwind CSS • Lucide Icons • On-Device Neural OCR Worker        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  HTTPS REST + HMAC-SHA256 JWT Bearer
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│           Java 17 High-Throughput REST Engine (Render / Docker)        │
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
│   • Encrypted Sensitive Data at Rest • Auto-migrates 6 tables on startup │
│   • Externalized Key (SHA-256)    │   • PostgreSQL JDBC + Fallback I/O │
│                                   │                                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                 JDBC Connection (PostgreSQL 16)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  PostgreSQL Production Database (Render)               │
│   users • family_profiles • medical_reports • medications • audit_logs │
│   [Local Dev Fallback: Atomic File-Backed JSON in server/data/*.json]  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Diagnostic Document & Clinical Data Pipeline
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
[PostgreSQL Relational Persistence + AES-256 GCM Vault + Immutable Audit Log]
```

---

## 🗄️ Database Architecture: Local vs. Production

ApnaVaidya utilizes a **Hybrid Relational Repository Architecture**:

1. **Production (PostgreSQL via JDBC)**:
   - When `DATABASE_URL` is configured (e.g. `postgresql://user:pass@host:5432/dbname`), `SchemaMigrator.java` automatically runs DDL migrations on startup to create and verify the 6 relational tables.
   - All repository operations (`UserRepository`, `MedicalReportRepository`, `MedicationRepository`, `ComprehensiveHealthService`) execute parameterized SQL PreparedStatements against PostgreSQL.
   - Sensitive fields (`passwordHash`, `salt`, `bloodGroup`, `address`) are transparently encrypted with **AES-256 GCM** before being written to PostgreSQL.

2. **Local Development (Zero-Config JSON Fallback)**:
   - If `DATABASE_URL` is empty, ApnaVaidya runs in local file-backed JSON mode under [`server/data/`](file:///c:/Users/tanvi/Desktop/ApnaVaidya/server/data/).
   - Thread safety is maintained via `ReentrantReadWriteLock` and atomic file renames.

### Relational Schema Overview (6 Tables)
* **`users`**: Patient accounts, emails, mobile numbers, and AES-256 encrypted credentials/demographics.
* **`family_profiles`**: Isolated family member records with constitutional metadata.
* **`medical_reports`**: Diagnostic lab reports, OCR summaries, and extracted biomarker JSON arrays.
* **`medications`**: Active prescriptions, dosages, frequencies, pill inventory, and daily adherence toggles.
* **`audit_logs`**: Immutable security logs with chained SHA-256 cryptographic hashes.
* **`clinical_prescriptions`**: NMC-compliant teleconsultation e-prescriptions with digital signatures.

---

## 🌟 Core Flagship Features

1. **🤖 Chikitsak AI Clinical Assistant**:
   - Zero-latency (<1ms) emergency red-flag triage (AIIMS/AHA).
   - Multi-Model LLM Gateway (Gemini 1.5, OpenAI GPT-4o, Ollama) with robust JSON parsing.
   - Dynamic Indian Clinical RAG grounded in ICMR & Harrison's guidelines across 4 languages (English, Hindi, Hinglish, Punjabi).

2. **📄 Medical Report OCR & Biomarker Extraction**:
   - On-device PDF text layer extraction (`pdfjs-dist`) and neural image OCR (`tesseract.js`).
   - Automatically identifies 16 clinical parameters (HbA1c, Lipid Profile, TSH, Fasting Glucose, Creatinine) and flags out-of-range biomarkers.

3. **🫀 Clinical Risk Assessment**:
   - ACC/AHA 10-Year ASCVD Cardiovascular Risk calculation.
   - ICMR-INDIAB Indian Diabetes Risk Score (0-100) with category-stratified preventive lifestyle guidance.

4. **💊 Prescription & Medication Intelligence**:
   - Real-time dosage schedule, pill countdown inventory, and adherence logging.
   - Automated drug-drug and drug-food contraindication checks.

5. **📊 What-If Lifestyle Scenario Simulator**:
   - Multivariate linear regression modeling projecting 36-month trajectories in HbA1c, LDL-C, SBP, and weight with 3-year SVG curves.

6. **👨‍👩‍👧‍👦 Family Health Vault & Clean Slate**:
   - Role-based profile isolation for parents, children, and dependents.
   - Demo accounts (`Demo@123`) showcase pre-seeded records; newly registered accounts start with an **uncluttered clean slate (0 reports, 0 meds)**.
   - Generates printable, multi-page Doctor-Ready Clinical Dossiers with digital verification signatures.

---

## 🧪 Additional Clinical Decision-Support Modules

* **🌿 Ayurvedic Prakriti Engine**: Tri-Dosha constitutional distribution (Vata/Pitta/Kapha percentage) and Ahara/Dinacharya lifestyle guidance.
* **🧬 Pharmacogenomics (PGx) Matcher**: CPIC Level precision drug-gene guidelines (`CYP2C19`, `SLCO1B1`, `CYP2D6`, `MTHFR`).
* **⏳ Longevity & Biological Aging**: Multi-biomarker composite biological age vs chronological age calculation.
* **🦠 Gut Microbiome & Chrono-Nutrition**: Gut flora diversity score, Short-Chain Fatty Acid (SCFA) gauges, and circadian fasting timer.
* **🍃 AQI & Heat Exposome Shield**: Indian city pollutant and heatwave vulnerability index (Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Kolkata).

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Production (Frontend) | URL of the Java backend REST API on Render | `https://apna-vaidya.onrender.com` |
| `DATABASE_URL` | Production (Backend) | PostgreSQL database connection string | `postgresql://user:pass@host:5432/apnavaidya` |
| `JWT_SECRET` | Production (Backend) | 256-bit secret key for HMAC-SHA256 JWT tokens | Auto-generated or custom random string |
| `VAULT_ENCRYPTION_KEY` | Production (Backend) | 256-bit secret key for AES-256 GCM encrypted fields | Auto-generated or custom random string |
| `ALLOWED_ORIGINS` | Production (Backend) | Comma-separated list of allowed frontend origins | `https://apnavaidya.vercel.app,http://localhost:5173` |
| `PORT` | Optional (Backend) | HTTP port to bind (auto-set by Render/Docker) | `8080` |
| `GEMINI_API_KEY` | Optional | Google Gemini 1.5 Pro / Flash API key | `AIzaSy...` |
| `OPENAI_API_KEY` | Optional | OpenAI GPT-4o API key | `sk-...` |

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/tanvi0404/ApnaVaidya.git
cd ApnaVaidya
npm install
```

### 2. Run with Docker Compose (PostgreSQL + Java Backend)
```bash
# Start PostgreSQL database and Java backend
docker compose up -d

# Start React Frontend
npm run dev
```

### 3. Run Locally Without Docker (Zero-Config JSON Mode)
```bash
# Terminal 1: Launch Java 17 REST API (Port 8080)
npm run start:server

# Terminal 2: Launch React Frontend (Port 5173)
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

### 4. Execute Full Automated Test Suite (27/27 Tests)
```bash
# Run Java 17 backend security & clinical test suite
npm run test:server

# Run React frontend Vitest suite
npm test

# Run all tests together
npm run test:all
```

---

## ☁️ Cloud Deployment Guide

### A. Deploy Java Backend on Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **PostgreSQL Database**:
   - Name: `apnavaidya-db`
   - Database: `apnavaidya`
   - User: `apnavaidya_user`
   - Plan: Free
3. Click **New +** ➔ **Web Service**:
   - Connect your GitHub repository: `tanvi0404/ApnaVaidya`
   - Environment: `Docker`
   - Dockerfile Path: `./Dockerfile`
   - Health Check Path: `/api/health`
4. In **Environment Variables**, configure:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Add from Database ➔ `apnavaidya-db` (Internal Database URL)
   - `JWT_SECRET`: Generate a random 32-character secret
   - `VAULT_ENCRYPTION_KEY`: Generate a random 32-character secret
   - `ALLOWED_ORIGINS`: `https://your-app.vercel.app,http://localhost:5173`
5. Click **Deploy Web Service**. Your backend will be live at `https://apna-vaidya.onrender.com`.

### B. Deploy React Frontend on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** ➔ **Project** ➔ Import `tanvi0404/ApnaVaidya`.
3. Framework Preset: **Vite** (Root Directory: `./`).
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://apna-vaidya.onrender.com` (Your Render backend URL)
5. Click **Deploy**. Vercel will build the SPA and deploy it globally with full PWA and caching support!

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
