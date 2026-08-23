/**
 * Comprehensive End-to-End Test Suite for ApnaVaidya Java 17 Backend REST API
 */

const BASE_URL = 'http://localhost:8080/api';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Full ApnaVaidya System & API Test Suite');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('1. Health Check Endpoint (/api/health)', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'UP') throw new Error(`Unexpected status: ${data.status}`);
  });

  // 2. Demo Login
  let demoToken = '';
  await test('2. Demo User Authentication (user-arjun)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'arjun.sharma@apnavaidya.in', password: 'Demo@123' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.token) throw new Error('Failed to get token');
    demoToken = data.token;
  });

  // 3. User Registration with Custom Age 20
  const testUserEmail = `testuser_${Date.now()}@apnavaidya.in`;
  let userToken = '';
  let userId = '';
  await test('3. New User Registration with Age 20 (/api/auth/register)', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Tanvi Sharma',
        email: testUserEmail,
        mobile: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
        password: 'SecurePassword@2026',
        age: 20,
        gender: 'Female',
        place: 'Bengaluru',
        address: 'Indiranagar 100ft Road',
        bloodGroup: 'O+',
        dietPreference: 'Vegetarian'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.token || data.user.age !== 20) {
      throw new Error(`Invalid register response or age != 20: ${JSON.stringify(data)}`);
    }
    userToken = data.token;
    userId = data.user.id;
  });

  // 4. Login with newly registered user
  await test('4. Login with Newly Registered User (/api/auth/login)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testUserEmail, password: 'SecurePassword@2026' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.token || data.user.age !== 20) {
      throw new Error(`Age mismatch or failed login: ${JSON.stringify(data)}`);
    }
  });

  // 5. Invalid credentials rejection
  await test('5. Security: Reject Invalid Password with 401', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testUserEmail, password: 'WrongPassword' })
    });
    if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
  });

  // 6. Unauthorized access rejection
  await test('6. Security: Reject Protected Request Without Token with 401', async () => {
    const res = await fetch(`${BASE_URL}/profiles`);
    if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
  });

  // 7. Family Profile CRUD (Create, Read, Delete with age 20)
  let createdProfileId = '';
  await test('7. Family Profiles CRUD (/api/profiles)', async () => {
    // Read initial
    const getRes = await fetch(`${BASE_URL}/profiles`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!getRes.ok) throw new Error(`Get profiles status ${getRes.status}`);

    // Create new profile with age 20
    const postRes = await fetch(`${BASE_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        name: 'Aarav Sharma',
        relationship: 'Brother',
        age: 20,
        gender: 'Male',
        bloodGroup: 'B+',
        weight: '65 kg',
        bmi: 21.5,
        avatarInitials: 'AS',
        avatarColor: 'emerald',
        dietPreference: 'Vegetarian'
      })
    });
    if (!postRes.ok) throw new Error(`Create profile status ${postRes.status}`);
    const postData = await postRes.json();
    if (!postData.success || !postData.id) throw new Error('Create profile failed');
    createdProfileId = postData.id;

    // Delete created profile
    const delRes = await fetch(`${BASE_URL}/profiles?id=${createdProfileId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!delRes.ok) throw new Error(`Delete profile status ${delRes.status}`);
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Delete profile failed');
  });

  // 8. Medications CRUD (Create, Read, Adherence Toggle, Delete)
  let createdMedId = '';
  await test('8. Medications CRUD (/api/medications)', async () => {
    // Create new medication
    const postRes = await fetch(`${BASE_URL}/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        name: 'CoQ10 Ubiquinol 100mg',
        genericName: 'Ubiquinol',
        dosage: '100 mg',
        frequency: 'Once Daily',
        timing: 'Morning',
        foodInstruction: 'With breakfast',
        prescribedFor: 'Mitochondrial Energy',
        doctorName: 'Dr. Neha Verma',
        remainingDays: 30,
        totalPills: 30,
        remainingPills: 30
      })
    });
    if (postRes.status !== 201) throw new Error(`Create med status ${postRes.status}`);
    const medData = await postRes.json();
    createdMedId = medData.id;

    // Read medications
    const getRes = await fetch(`${BASE_URL}/medications`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!getRes.ok) throw new Error(`Get meds status ${getRes.status}`);
    const medsList = await getRes.json();
    if (!medsList.some(m => m.id === createdMedId)) throw new Error('Created med not found in list');

    // Toggle adherence status
    const toggleRes = await fetch(`${BASE_URL}/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ medId: createdMedId })
    });
    if (!toggleRes.ok) throw new Error(`Toggle med status ${toggleRes.status}`);

    // Delete medication
    const delRes = await fetch(`${BASE_URL}/medications?id=${createdMedId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!delRes.ok) throw new Error(`Delete med status ${delRes.status}`);
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Delete med failed');
  });

  // 9. Medical Reports CRUD (Create, Read, Delete)
  let createdReportId = '';
  await test('9. Medical Reports CRUD (/api/reports)', async () => {
    // Add report
    const postRes = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        title: 'Routine Health Checkup Panel',
        labName: 'Apollo Diagnostics',
        category: 'Routine Biochemistry',
        testDate: '2026-08-23',
        ocrConfidence: '99.8%',
        overallSummary: 'All biomarker metrics within target parameters.'
      })
    });
    if (postRes.status !== 201) throw new Error(`Create report status ${postRes.status}`);
    const repData = await postRes.json();
    createdReportId = repData.id;

    // Read reports
    const getRes = await fetch(`${BASE_URL}/reports`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!getRes.ok) throw new Error(`Get reports status ${getRes.status}`);
    const repsList = await getRes.json();
    if (!repsList.some(r => r.id === createdReportId)) throw new Error('Created report not found in list');

    // Delete report
    const delRes = await fetch(`${BASE_URL}/reports?id=${createdReportId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!delRes.ok) throw new Error(`Delete report status ${delRes.status}`);
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Delete report failed');
  });

  // 10. Clinical Risk Calculators (ASCVD, IDRS with age 20)
  await test('10. Clinical Risk Calculators (/api/risk/ascvd, /api/risk/idrs)', async () => {
    // ASCVD with Age 20
    const ascvdRes = await fetch(`${BASE_URL}/risk/ascvd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        age: 20,
        gender: 'Female',
        totalChol: 180,
        hdlChol: 55,
        systolicBp: 110,
        smoker: false,
        diabetic: false
      })
    });
    if (!ascvdRes.ok) throw new Error(`ASCVD status ${ascvdRes.status}`);
    const ascvdData = await ascvdRes.json();
    if (typeof ascvdData.riskPercent !== 'number' || ascvdData.riskPercent < 0) {
      throw new Error(`Invalid ASCVD result: ${JSON.stringify(ascvdData)}`);
    }

    // IDRS with Age 20
    const idrsRes = await fetch(`${BASE_URL}/risk/idrs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        age: 20,
        waist: 72,
        activity: 'Regular Vigorous Exercise',
        familyHistory: 'No Diabetes'
      })
    });
    if (!idrsRes.ok) throw new Error(`IDRS status ${idrsRes.status}`);
    const idrsData = await idrsRes.json();
    if (typeof idrsData.score !== 'number' || idrsData.score < 0) {
      throw new Error(`Invalid IDRS result: ${JSON.stringify(idrsData)}`);
    }
  });

  // 11. Vascular Age & ePWV Engine
  await test('11. Vascular Age & Arterial Stiffness (/api/vascular/age)', async () => {
    const res = await fetch(`${BASE_URL}/vascular/age`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        chronologicalAge: 20,
        systolicBp: 115,
        diastolicBp: 75,
        totalChol: 175,
        hdlChol: 58,
        restingHr: 62,
        smoker: false
      })
    });
    if (!res.ok) throw new Error(`Vascular status ${res.status}`);
    const data = await res.json();
    if (data.chronologicalAge !== 20 || typeof data.estimatedVascularAge !== 'number') {
      throw new Error(`Invalid vascular data: ${JSON.stringify(data)}`);
    }
  });

  // 12. Longevity & Biological Age Composite
  await test('12. Longevity & Biological Age Engine (/api/longevity/score)', async () => {
    const res = await fetch(`${BASE_URL}/longevity/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        chronologicalAge: 20,
        systolicBp: 110,
        totalChol: 170,
        hdlChol: 60,
        hba1c: 5.1,
        fastingGlucose: 85,
        restingHr: 60,
        weeklyExerciseMins: 200,
        sleepHours: 8.0,
        smoker: false
      })
    });
    if (!res.ok) throw new Error(`Longevity status ${res.status}`);
    const data = await res.json();
    if (typeof data.compositeScore !== 'number' || typeof data.estimatedBiologicalAge !== 'number') {
      throw new Error(`Invalid longevity data: ${JSON.stringify(data)}`);
    }
  });

  // 13. Chikitsak AI Chat & Emergency Triage
  await test('13. Chikitsak AI Chat & Emergency Red Flag Intercept (/api/chat/ask)', async () => {
    // Normal query
    const chatRes = await fetch(`${BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        userMessage: 'What are healthy lifestyle habits for cardiovascular longevity at age 20?',
        language: 'en',
        profileName: 'Tanvi',
        profileAge: 20,
        profileGender: 'Female',
        reportContext: 'All biomarkers normal'
      })
    });
    if (!chatRes.ok) throw new Error(`Chat status ${chatRes.status}`);
    const chatData = await chatRes.json();
    if (!chatData.replyText || chatData.replyText.length === 0) throw new Error('Empty chat response');

    // Emergency red-flag query
    const emergRes = await fetch(`${BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        userMessage: 'I have severe sudden crushing chest pain radiating to left arm and shortness of breath',
        language: 'en',
        profileName: 'Tanvi',
        profileAge: 20,
        profileGender: 'Female'
      })
    });
    if (!emergRes.ok) throw new Error(`Emergency chat status ${emergRes.status}`);
    const emergData = await emergRes.json();
    if (!emergData.isEmergency || !emergData.replyText.includes('108')) {
      throw new Error(`Emergency intercept failed: ${JSON.stringify(emergData)}`);
    }
  });

  // 14. Drug Interaction (DDI) Safety Engine
  await test('14. Drug Interaction Safety Engine (/api/medications/interaction)', async () => {
    const res = await fetch(`${BASE_URL}/medications/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        drugs: ['Atorvastatin', 'Clarithromycin']
      })
    });
    if (!res.ok) throw new Error(`Interaction status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.warnings) || data.warnings.length === 0 || !data.warnings[0].includes('HIGH SEVERITY')) {
      throw new Error(`Failed to detect known high-severity DDI: ${JSON.stringify(data)}`);
    }
  });

  // 15. E-Prescription & SHA-256 Signature
  await test('15. Cryptographic E-Prescription Signature (/api/teleconsult/sign-prescription)', async () => {
    const res = await fetch(`${BASE_URL}/teleconsult/sign-prescription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        doctorName: 'Dr. A. K. Sharma',
        regNumber: 'MCI-48291',
        patientName: 'Tanvi Sharma',
        diagnosis: 'Cardiometabolic Health Optimization & Preventive Baseline'
      })
    });
    if (!res.ok) throw new Error(`Prescription sign status ${res.status}`);
    const data = await res.json();
    if (!data.digitalSignature || !data.digitalSignature.startsWith('0x')) {
      throw new Error(`Invalid signature format: ${JSON.stringify(data)}`);
    }
  });

  // 16. Chained Audit Logs Verification
  await test('16. Chained Security Audit Ledger (/api/security/audit-logs)', async () => {
    // Post new audit event
    const postRes = await fetch(`${BASE_URL}/security/audit-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        eventType: 'PATIENT_PROFILE_ACCESS',
        details: 'Patient accessed personal health records with verified credentials'
      })
    });
    if (!postRes.ok) throw new Error(`Post audit status ${postRes.status}`);

    // Read audit logs
    const getRes = await fetch(`${BASE_URL}/security/audit-logs`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!getRes.ok) throw new Error(`Get audit status ${getRes.status}`);
    const logs = await getRes.json();
    if (!Array.isArray(logs) || logs.length === 0 || !logs[0].blockHash) {
      throw new Error(`Invalid audit log ledger stream: ${JSON.stringify(logs)}`);
    }
  });

  // 17. Ayurvedic Prakriti & Organ Heatmap
  await test('17. Ayurvedic Tri-Dosha & 7-Organ Heatmap (/api/ayurveda/prakriti, /api/organs/heatmap)', async () => {
    // Prakriti
    const prakRes = await fetch(`${BASE_URL}/ayurveda/prakriti`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ bodyFrame: 'slender', skinType: 'dry', climatePref: 'warm' })
    });
    if (!prakRes.ok) throw new Error(`Prakriti status ${prakRes.status}`);

    // Organ Heatmap
    const organRes = await fetch(`${BASE_URL}/organs/heatmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ sbp: 115, hba1c: 5.1, ldl: 90, alt: 22, cr: 0.8, egfr: 110, vitd: 45 })
    });
    if (!organRes.ok) throw new Error(`Organ heatmap status ${organRes.status}`);
    const organData = await organRes.json();
    if (typeof organData.overallOrganVitality !== 'number' || typeof organData.heartScore !== 'number') {
      throw new Error(`Expected organ vitality scores, got: ${JSON.stringify(organData)}`);
    }
  });

  console.log('====================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
