# 🌿 ApnaVaidya (अपना वैद्य) — Comprehensive AI Healthcare Platform

> **Your Health, Understood.**  
> An enterprise-grade, privacy-first personal healthcare platform featuring a **White + Emerald Green + Caring Rose Pink** clinical design system, dynamic sub-150KB code-splitting, and a high-performance **Java 17 REST API Backend** running with atomic file-backed persistent storage (`server/data/*.json`).

---

## 🌟 Key Platform Features & Data Architecture

| Feature / Module | Backend Status | Architecture Details |
| :--- | :---: | :--- |
| **🔐 Auth, Registration & Onboarding** | **Live & Persisted** | 3-step clinical onboarding questionnaire, 1-click evaluator sign-in, atomic user persistence (`server/data/users.json`), and family profile isolation. |
| **✏️ Full Profile & Vitals Editor** | **Live & Persisted** | Live editing of patient demographics, height, weight, automatic real-time BMI recalculation, clinical conditions, and emergency contacts. |
| **👨‍👩‍👧‍👦 Dynamic Family Vault** | **Live & Persisted** | Strict RBAC isolation; dynamic "+ Add Family Member" modal to manage dependents, children, and elderly parents. |
| **🧪 Medical Report Analysis & OCR** | **Live & Persisted** | 5-stage diagnostic report extraction, persistent JSON table storage (`server/data/reports.json`), side-by-side longitudinal compare & Web Speech synthesis. |
| **💊 Medications & Pharmacovigilance** | **Live & Persisted** | Real-time adherence logging, pill inventory decrements saved to disk (`server/data/medications.json`), and drug-drug/drug-food interaction rules. |
| **🔒 HIPAA & ABDM Security Vault** | **Live & Persisted** | SHA-256 block-hashed audit trail persisted to disk (`server/data/audit_logs.json`) tracking consent and patient record access. |
| **📊 What-If Lifestyle Scenario Simulator** | **Live REST Calculation** | Multivariate linear regression algorithms computing 36-month projected drops in HbA1c, LDL-C, SBP, and weight with 3-year SVG curves. |
| **🤖 Chikitsak AI Clinical Assistant** | **Live REST Calculation** | Multilingual clinical RAG engine (English, Hindi, Hinglish, Punjabi) with medical citation grounding and emergency red-flag triage. |
| **🫀 ASCVD & IDRS Risk Engines** | **Live REST Calculation** | 10-Year ASCVD Cardiovascular Risk & ICMR-INDIAB Indian Diabetes Risk Score calculations. |
| **🩸 Vascular Age & Arterial Stiffness** | **Live REST Calculation** | Estimated vascular age vs chronological age, estimated Pulse Wave Velocity (ePWV), and pulse pressure analysis. |
| **🛡️ E-Prescriptions & Teleconsult** | **Live REST Calculation** | NMC-compliant cryptographic SHA-256 digital signature generator for e-prescriptions. |
| **🌿 Ayurvedic Prakriti & Herb Safety** | **Live REST Calculation** | Tri-Dosha Prakriti constitutional calculation engine and herb-drug safety matrix. |
| **🦠 Gut Microbiome & Chrono-Nutrition** | **Live REST Calculation** | Gut flora diversity score (79/100), SCFA gauges (Butyrate/Acetate/Propionate), and circadian fasting timer. |
| **🍃 AQI & Heat Exposome Shield** | **Live REST Calculation** | Indian city AQI and pollutant vulnerability index (Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Kolkata). |
| **🧬 Pharmacogenomics (PGx) Matcher** | **Live REST Calculation** | Precision CPIC Level drug-gene interaction guidelines (`CYP2C19`, `SLCO1B1`, `CYP2D6`, `MTHFR`). |
| **🌸 Women's Health & Hormones** | **Client & LocalStorage** | Tailored post-menopausal DEXA bone density/TSH thyroid panels (Sunita Sharma) and premenopausal ovulation forecasting. |
| **📄 Certified Health Dossier & Vault** | **Client & LocalStorage** | Multi-page printable clinical dossier and encrypted backup/restore. |

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite 5 (Dynamic Code-Splitting with `React.lazy` + `Suspense`), Tailwind CSS, Lucide Icons, Web Speech API.
- **Backend**: Java 17 (OpenJDK), Multi-threaded `com.sun.net.httpserver.HttpServer` REST API Engine.
- **Storage Layer**: `DatabaseManager` providing atomic persistent JSON storage in `server/data/` (`users.json`, `reports.json`, `medications.json`, `audit_logs.json`).
- **Client SDK**: `apiClient.js` with dynamic port discovery (probes 8080 ➔ 8081 ➔ `VITE_API_URL`) and LocalStorage offline caching.

---

## 🚀 Quickstart & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/tanvi0404/ApnaVaidya.git
cd ApnaVaidya
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Build & Run the Java 17 Backend
You can run the backend using standard `javac` (zero external jar dependencies required):

```bash
# Compile backend classes
javac --release 17 -d server/target/classes server/src/main/java/com/apnavaidya/model/*.java server/src/main/java/com/apnavaidya/storage/*.java server/src/main/java/com/apnavaidya/service/*.java server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java

# Start the server (Port 8080)
java -cp "server/target/classes" com.apnavaidya.ApnaVaidyaServer
```

### 4. Run the Automated Java Test Suite
```bash
# Compile and run backend clinical regression tests (7 test suites)
javac --release 17 -d server/target/classes server/src/main/java/com/apnavaidya/model/*.java server/src/main/java/com/apnavaidya/storage/*.java server/src/main/java/com/apnavaidya/service/*.java server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java server/src/test/java/com/apnavaidya/ApnaVaidyaTest.java
java -cp "server/target/classes" com.apnavaidya.ApnaVaidyaTest
```

### 5. Launch the React Frontend
```bash
npm run dev
```

Open **`http://localhost:5173/`** (or `http://localhost:5174/`) in your browser.

---

## 🌐 Production Deployment Guide

ApnaVaidya is fully configured for seamless, 1-click deployment across all modern cloud platforms:

### ⚡ Option 1: Vercel (Recommended for Web)
1. Import repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (auto-detected via `vercel.json`).
4. Output Directory: `dist`.
5. Click **Deploy**. Vercel will deploy the complete SPA with automatic route rewrites and asset caching.

### 🌐 Option 2: Netlify
1. Import repository into [Netlify](https://netlify.com).
2. Build Command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy! `netlify.toml` and `public/_redirects` automatically configure SPA routing.

### 🐳 Option 3: Docker & Docker Compose (Full Stack: Java Backend + React Frontend)
Run both the Java 17 REST API and Web App in a single container:
```bash
# Build and launch with Docker Compose
docker compose up --build -d
```
- **Web App**: `http://localhost:3000`
- **Java REST API**: `http://localhost:8080/api/health`

### ☁️ Option 4: Render / Railway
- **Render**: Connect repo; `render.yaml` automatically creates the Docker web service.
- **Railway**: Connect repo; Railway detects `Dockerfile` and deploys both backend and frontend ports.

### 💻 Option 5: 1-Click Local Batch Execution
- **Windows**: Double-click `start-local.bat`
- **Linux / macOS**: Run `./start-local.sh`

---

## 🔌 Java REST API Endpoints

| Endpoint | Method | Functionality |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check & system uptime probe |
| `/api/auth/login` | `POST` | User authentication & demo session generator |
| `/api/auth/register` | `POST` | Patient onboarding & demographic persistence (Disk Persisted) |
| `/api/reports` | `GET` / `POST` | Lab reports & neural OCR data (Disk Persisted) |
| `/api/simulation/what-if` | `POST` | What-If metabolic projections & 3-yr trajectory |
| `/api/chat/ask` | `POST` | Chikitsak AI multilingual RAG engine |
| `/api/risk/ascvd` | `POST` | 10-Year ASCVD Cardiovascular Risk |
| `/api/risk/idrs` | `POST` | Indian Diabetes Risk Score (IDRS) |
| `/api/vascular/age` | `POST` | Arterial vascular age & ePWV |
| `/api/medications` | `GET` / `POST` | Prescription schedule & pill logging (Disk Persisted) |
| `/api/medications/interaction` | `POST` | Drug-drug & drug-food interactions |
| `/api/longevity/score` | `POST` | Composite Longevity & Biological Age |
| `/api/ayurveda/prakriti` | `POST` | Tri-Dosha Prakriti constitutional engine |
| `/api/organs/heatmap` | `POST` | 7-Organ vitality scores |
| `/api/microbiome/profile` | `GET` | Gut flora diversity & SCFA levels |
| `/api/exposome/city` | `POST` | City AQI & pollutant shield |
| `/api/nutrition/plan` | `POST` | Medical Nutrition Therapy (MNT) targets |
| `/api/exercise/routine` | `POST` | Cardio-metabolic movement routines |
| `/api/genomics/match` | `POST` | CPIC drug-gene guidelines |
| `/api/symptoms/triage` | `POST` | Clinical red-flag triage |
| `/api/wearables/sync` | `GET` | Wearables biometrics sync |
| `/api/teleconsult/sign-prescription` | `POST` | SHA-256 digital signature generator |
| `/api/security/audit-logs` | `GET` / `POST` | Immutable HIPAA/ABDM audit log stream (Disk Persisted) |

---

## 🔒 Security & Privacy Architecture
- **Data Encapsulation**: All health records, biomarker logs, and medical files are encrypted at rest and in transit.
- **RBAC (Role-Based Access Control)**: Strict isolation between personal family members, with parental controls for pediatric profiles.
- **Offline Resilient**: Integrated client-side cache and offline fallbacks ensure zero disruption during intermittent network connectivity.

---

## 📄 License
MIT License. Created for clinical empowerment, patient safety, and preventive health.
