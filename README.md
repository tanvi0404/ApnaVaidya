# 🌿 ApnaVaidya (अपना वैद्य) — AI Healthcare Platform

> **Your Health, Understood.**
> An AI-powered personal healthcare platform with an ultra-clean **White + Emerald Green + Caring Rose Pink** clinical design system and a **Java 17 REST API Backend** running on port `8080`.

---

## 🌟 Key Platform Features

- **🧪 Medical Report Analysis & Neural OCR**: 5-stage diagnostic report extraction with side-by-side longitudinal parameter compare and speech synthesis.
- **🤖 Chikitsak AI Clinical Assistant**: Multilingual RAG assistant supporting English, Hindi, Hinglish, and Punjabi with citations and explainability.
- **📊 What-If Lifestyle & Metabolic Scenario Simulator**: Interactive sliders for walking, soluble fiber, sleep, and weight loss with real-time mathematical regression and a 3-year SVG trajectory curve.
- **🫀 Multi-Organ System Vitality Heatmap**: 7-organ interactive SVG anatomical map and prescription drug-nutrient depletion matrix (*Metformin ➔ B12, Statins ➔ CoQ10, PPIs ➔ Mg/Iron*).
- **🌿 Ayurvedic Prakriti & Herb-Drug Safety**: 5-pillar constitutional tri-dosha diagnostic (*Vata, Pitta, Kapha*), botanical-allopathic compatibility matrix, and Agni digestive tea therapeutics.
- **🦠 Gut Microbiome & Chrono-Nutrition**: Gut flora diversity metrics (79/100), SCFA gauges (Butyrate, Acetate, Propionate), Indian prebiotic fermented foods, and 13-hour circadian fasting timer.
- **🍃 AQI & Heat Exposome Shield**: Real-time city AQI tracker (Delhi, Mumbai, Bengaluru), particulate vulnerability index, and Wet-Bulb heat index calculator.
- **🛡️ Smart Health Insurance & Teleconsultation**: 6-point hospitalization claim scanner, cashless pre-auth radar, and virtual teleconsultation room with SHA-256 signed E-Prescriptions.
- **🧬 Pharmacogenomics (PGx) & Epigenetics**: Precision drug-gene compatibility matcher (`CYP2C19`, `SLCO1B1`, `CYP2D6`, `MTHFR`) with CPIC Level clinical guidelines.
- **🫀 Vascular Age & 180-Min Glucose Curves**: ePWV arterial stiffness calculator and post-meal GLUT-4 walking curve simulator.
- **💊 Medications & Pharmacovigilance**: Prescription schedules, inventory alerts, and drug-drug/drug-food interaction safety checks.
- **🚨 Emergency First-Aid Wizard**: 110 BPM adult CPR metronome, Stroke BE FAST, Choking Heimlich, and 24x7 ER hospital list.
- **📄 Printable Clinical Dossier & Encrypted Vault**: Multi-page certified clinical dossier and HIPAA/GDPR immutable audit log stream.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Web Speech API.
- **Backend**: Java 17 (OpenJDK), Multi-threaded `com.sun.net.httpserver.HttpServer` REST API Engine.
- **Color Palette**: Clinical White (`#FFFFFF`, `#FAFCFA`), Emerald Green (`#059669`, `#10B981`), Caring Rose Pink (`#F43F5E`, `#FFF1F2`).

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Java**: `OpenJDK 17` or higher (`java -version`)
- **Git**: Installed and configured

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/apna-vaidya.git
cd apna-vaidya
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Compile & Run the Java 17 Backend
```bash
# Compile Java backend classes
javac --release 17 -d server/target/classes server/src/main/java/com/apnavaidya/model/*.java server/src/main/java/com/apnavaidya/service/*.java server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java

# Launch the Java REST API server (Port 8080)
java -cp "server/target/classes" com.apnavaidya.ApnaVaidyaServer
```

### 5. Launch the React Frontend Dev Server
```bash
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 🔌 Java REST API Endpoints Overview

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check & system uptime |
| `/api/reports` | `GET` / `POST` | Lab reports & neural OCR data |
| `/api/simulation/what-if` | `POST` | What-If metabolic projections & 3-yr trajectory |
| `/api/chat/ask` | `POST` | Chikitsak AI multilingual RAG engine |
| `/api/risk/ascvd` | `POST` | 10-Year ASCVD Cardiovascular Risk |
| `/api/risk/idrs` | `POST` | Indian Diabetes Risk Score (IDRS) |
| `/api/vascular/age` | `POST` | Arterial vascular age & ePWV |
| `/api/medications` | `GET` / `POST` | Prescription schedule & pill logging |
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
| `/api/security/audit-logs` | `GET` / `POST` | Immutable HIPAA/GDPR audit log stream |

---

## 📄 License
MIT License. Created for AI-driven clinical empowerment and preventive health.
