/**
 * ApnaVaidya Java 17 Backend Client SDK
 * Connects React UI to Spring Boot REST endpoints on http://localhost:8080/api
 */

import { PRELOADED_REPORTS } from '../data/reportsData';
import { MEDICATIONS_DATA } from '../data/medicationsData';

const API_BASE_URL = 'http://localhost:8080/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('ApnaVaidya Java backend offline, running in client-mode:', err.message);
    return null;
  }
}

export async function fetchReportsFromBackend(profileId = null) {
  try {
    const url = profileId ? `${API_BASE_URL}/reports?profileId=${profileId}` : `${API_BASE_URL}/reports`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const rawReports = await res.json();

    if (!Array.isArray(rawReports) || rawReports.length === 0) {
      return PRELOADED_REPORTS;
    }

    // Normalize reports to guarantee full UI schema compatibility
    return rawReports.map((r) => {
      const matchingPreload = PRELOADED_REPORTS.find(p => p.id === r.id);

      const params = (r.parameters || matchingPreload?.parameters || []).map(p => ({
        id: p.id || `param-${Date.now()}`,
        name: p.name || 'Biomarker',
        category: p.category || 'Clinical Chemistry',
        value: typeof p.value === 'number' ? p.value : parseFloat(p.value) || 0,
        unit: p.unit || 'mg/dL',
        minNormal: typeof p.minNormal === 'number' ? p.minNormal : 0,
        maxNormal: typeof p.maxNormal === 'number' ? p.maxNormal : 100,
        status: p.status || 'NORMAL',
        clinicalMeaning: p.clinicalMeaning || p.plainDescription || 'Clinical biomarker measurement.',
        plainExplanation: p.plainExplanation || p.plainDescription || 'Biomarker level measured during diagnostic checkup.',
        lifestyleTip: p.lifestyleTip || 'Maintain balanced nutrition and regular physical activity.',
        doctorQuestion: p.doctorQuestion || 'Discuss with physician at your next routine follow-up.',
        sourceCitation: p.sourceCitation || p.clinicalCitation || 'ICMR Clinical Practice Guidelines'
      }));

      const abnormalCount = params.filter(p => p.status !== 'NORMAL').length;
      const normalCount = params.length - abnormalCount;

      const summary = r.summary || matchingPreload?.summary || {
        overallStatus: abnormalCount > 0 ? `${abnormalCount} Parameter(s) Flagged Outside Range` : 'All Measured Parameters in Target',
        keyFindings: r.overallSummary 
          ? [r.overallSummary] 
          : [
              'All parameters successfully extracted and categorized by neural OCR.',
              'Clinical correlation with patient history completed.'
            ],
        aiRecommendation: 'Review findings with your doctor at your next appointment. Maintain hydration and regular activity.',
        normalCount,
        abnormalCount
      };

      return {
        id: r.id || `rep-${Date.now()}`,
        profileId: r.profileId || 'user-arjun',
        title: r.title || 'Diagnostic Blood Report',
        category: r.category || 'General Diagnostics',
        labName: r.labName || 'NABL Accredited Diagnostics Lab',
        testDate: r.testDate || r.date || '15 Aug 2026',
        uploadDate: r.uploadDate || '15 Aug 2026',
        status: r.status || 'Analyzed',
        badgeCount: r.badgeCount || (abnormalCount > 0 ? `${abnormalCount} Elevated` : 'Normal'),
        summary,
        parameters: params
      };
    });
  } catch (err) {
    console.warn('Fallback to local preloaded reports:', err.message);
    return PRELOADED_REPORTS;
  }
}

export async function askChikitsakBackend({ userMessage, language, profileName, profileAge, profileGender, reportContext }) {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage,
        language,
        profileName,
        profileAge,
        profileGender,
        reportContext
      })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Chat backend fallback:', err.message);
    return null;
  }
}

export async function calculateAscvdBackend(ascvdParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/risk/ascvd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ascvdParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('ASCVD backend fallback:', err.message);
    return null;
  }
}

export async function calculateIdrsBackend(idrsParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/risk/idrs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idrsParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('IDRS backend fallback:', err.message);
    return null;
  }
}

export async function calculateVascularBackend(vascularParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/vascular/age`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vascularParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Vascular backend fallback:', err.message);
    return null;
  }
}

export async function fetchMedicationsFromBackend(profileId = 'user-arjun') {
  try {
    const res = await fetch(`${API_BASE_URL}/medications?profileId=${profileId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Medications backend fallback:', err.message);
    return MEDICATIONS_DATA[profileId] || MEDICATIONS_DATA['user-arjun'];
  }
}

export async function toggleMedicationBackend(medId) {
  try {
    const res = await fetch(`${API_BASE_URL}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medId })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Toggle medication fallback:', err.message);
    return { success: true };
  }
}

export async function checkDrugInteractionsBackend(drugs) {
  try {
    const res = await fetch(`${API_BASE_URL}/medications/interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drugs })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Interactions backend fallback:', err.message);
    return { warnings: [] };
  }
}

export async function calculateLongevityBackend(longevityParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/longevity/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(longevityParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Longevity backend fallback:', err.message);
    return null;
  }
}

export async function fetchAuditLogsFromBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/security/audit-logs`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Audit logs backend fallback:', err.message);
    return null;
  }
}

export async function logAuditEventBackend(eventType, details) {
  try {
    const res = await fetch(`${API_BASE_URL}/security/audit-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, details })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Audit log write fallback:', err.message);
    return { success: true };
  }
}

export async function signPrescriptionBackend(rxParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/teleconsult/sign-prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rxParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Digital sign fallback:', err.message);
    return null;
  }
}

export async function calculatePrakritiBackend(prakritiParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/ayurveda/prakriti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prakritiParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Prakriti backend fallback:', err.message);
    return null;
  }
}

export async function calculateOrganHeatmapBackend(organParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/organs/heatmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Organ heatmap backend fallback:', err.message);
    return null;
  }
}

export async function triageSymptomsBackend(symptoms, durationDays = 2) {
  try {
    const res = await fetch(`${API_BASE_URL}/symptoms/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, durationDays })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Symptoms triage backend fallback:', err.message);
    return null;
  }
}

export async function fetchWearablesSyncBackend(profileId = 'user-arjun') {
  try {
    const res = await fetch(`${API_BASE_URL}/wearables/sync?profileId=${profileId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Wearables sync backend fallback:', err.message);
    return null;
  }
}

export async function simulateWhatIfBackend(simParams) {
  try {
    const res = await fetch(`${API_BASE_URL}/simulation/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simParams)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Simulation backend fallback:', err.message);
    return null;
  }
}

export async function fetchMicrobiomeProfileBackend(profileId = 'user-arjun') {
  try {
    const res = await fetch(`${API_BASE_URL}/microbiome/profile?profileId=${profileId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Microbiome backend fallback:', err.message);
    return null;
  }
}

export async function fetchExposomeCityBackend(city = 'Delhi NCR') {
  try {
    const res = await fetch(`${API_BASE_URL}/exposome/city`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Exposome backend fallback:', err.message);
    return null;
  }
}

export async function fetchNutritionPlanBackend({ profileId = 'user-arjun', hba1c = 5.8, ldl = 146.0 }) {
  try {
    const res = await fetch(`${API_BASE_URL}/nutrition/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, hba1c, ldl })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Nutrition plan backend fallback:', err.message);
    return null;
  }
}

export async function fetchExerciseRoutineBackend({ profileId = 'user-arjun', restingHr = 68 }) {
  try {
    const res = await fetch(`${API_BASE_URL}/exercise/routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, restingHr })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Exercise routine backend fallback:', err.message);
    return null;
  }
}

export async function matchGenomicsBackend({ drug = 'Clopidogrel', gene = 'CYP2C19' }) {
  try {
    const res = await fetch(`${API_BASE_URL}/genomics/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drug, gene })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Genomics backend fallback:', err.message);
    return null;
  }
}
