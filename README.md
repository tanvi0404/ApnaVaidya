# 🌿 ApnaVaidya (अपना वैद्य) — AI Healthcare Platform

> **Your Health, Understood.**  
> An AI-powered personal healthcare platform featuring a **White + Emerald Green + Caring Rose Pink** clinical design system, dynamic code-splitting, and a **Java 17 REST API Backend** running on port `8080` with atomic file-backed persistent storage.

---

## 🌟 Key Platform Features & Data Architecture

| Feature / Module | Backend Status | Architecture Details |
| :--- | :---: | :--- |
| **🧪 Medical Report Analysis & Neural OCR** | **Live & Persisted** | 5-stage diagnostic report extraction, persistent JSON table storage (`server/data/reports.json`), side-by-side longitudinal compare & Web Speech synthesis. |
| **💊 Medications & Pharmacovigilance** | **Live & Persisted** | Real-time adherence logging, pill inventory decrements saved to disk (`server/data/medications.json`), and drug-drug/drug-food interaction rules. |
| **🔒 HIPAA & GDPR Security Audit Vault** | **Live & Persisted** | SHA-256 block-hashed audit trail persisted to disk (`server/data/audit_logs.json`) tracking consent and patient record access. |
| **📊 What-If Lifestyle Scenario Simulator** | **Live REST Calculation** | Multivariate linear regression algorithms computing 36-month projected drops in HbA1c, LDL-C, SBP, and weight with 3-year SVG curves. |
| **🤖 Chikitsak AI Clinical Assistant** | **Live REST Calculation** | Multilingual clinical RAG engine (English, Hindi, Hinglish, Punjabi) with medical citation grounding and emergency red-flag triage. |
| **🫀 ASCVD & IDRS Risk Engines** | **Live REST Calculation** | 10-Year ASCVD Cardiovascular Risk & ICMR-INDIAB Indian Diabetes Risk Score calculations. |
| **🛡️ E-Prescriptions & Teleconsult** | **Live REST Calculation** | NMC-compliant cryptographic SHA-256 digital signature generator for e-prescriptions. |
| **🌿 Ayurvedic Prakriti & Herb Safety** | **Live REST Calculation** | Tri-Dosha Prakriti constitutional calculation engine and herb-drug safety matrix. |
| **🦠 Gut Microbiome & Chrono-Nutrition** | **Live REST Calculation** | Gut flora diversity score (79/100), SCFA gauges (Butyrate/Acetate/Propionate), and circadian fasting timer. |
| **🍃 AQI & Heat Exposome Shield** | **Live REST Calculation** | Indian city AQI and pollutant vulnerability index (Delhi, Mumbai, Bengaluru). |
| **🧬 Pharmacogenomics (PGx) Matcher** | **Live REST Calculation** | Precision CPIC Level drug-gene interaction guidelines (`CYP2C19`, `SLCO1B1`, `CYP2D6`, `MTHFR`). |
| **📄 Certified Health Dossier & Vault** | **Client & LocalStorage** | Multi-page printable clinical dossier and encrypted backup/restore. |

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite 5 (Dynamic Code-Splitting with `React.lazy`), Tailwind CSS, Lucide Icons, Web Speech API.
- **Backend**: Java 17 (OpenJDK), Multi-threaded `com.sun.net.httpserver.HttpServer` REST API Engine.
- **Storage Layer**: `DatabaseManager` providing atomic persistent JSON storage in `server/data/`.
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
You can run the backend using either standard `javac` or Maven:

#### Option A: Direct Java 17 Compilation (Zero external dependencies)
```bash
# Compile backend classes
javac --release 17 -d server/target/classes server/src/main/java/com/apnavaidya/model/*.java server/src/main/java/com/apnavaidya/storage/*.java server/src/main/java/com/apnavaidya/service/*.java server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java

# Start the server (Port 8080)
java -cp "server/target/classes" com.apnavaidya.ApnaVaidyaServer
```

#### Option B: Maven
```bash
cd server
mvn compile exec:java
```

### 4. Run the Automated Test Suite
```bash
# Compile and run backend clinical tests
javac --release 17 -d server/target/classes server/src/main/java/com/apnavaidya/model/*.java server/src/main/java/com/apnavaidya/storage/*.java server/src/main/java/com/apnavaidya/service/*.java server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java server/src/test/java/com/apnavaidya/ApnaVaidyaTest.java
java -cp "server/target/classes" com.apnavaidya.ApnaVaidyaTest
```

### 5. Launch the React Frontend
```bash
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 🔌 Java REST API Endpoints

| Endpoint | Method | Functionality |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check & system uptime probe |
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
| `/api/security/audit-logs` | `GET` / `POST` | Immutable HIPAA/GDPR audit log stream (Disk Persisted) |

---

## 📄 License
MIT License. Created for clinical empowerment and preventive health.
