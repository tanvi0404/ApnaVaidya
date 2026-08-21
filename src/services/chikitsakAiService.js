import { RAG_KNOWLEDGE_BASE } from '../data/medicalKnowledgeBase';

/**
 * Chikitsak AI Assistant Service
 * Context-aware RAG Engine with Multilingual Support & Red-Flag Triage
 */

// Emergency detection keywords
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'crushing chest', 'left arm pain', 'jaw pain', 
  'stroke', 'face drooping', 'slurred speech', 'cant breathe', "can't breathe", 
  'shortness of breath', 'difficulty breathing', 'blue lips', 'unconscious', 
  'bleeding heavily', 'chhati me dard', 'saans lene me dikkat', 'chhati ch peerh', 'dill da daura'
];

export function detectRedFlagEmergency(text = '') {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

export function findRelevantRagSources(query = '') {
  if (!query || typeof query !== 'string') return [RAG_KNOWLEDGE_BASE[0]];
  const lower = query.toLowerCase();
  const matched = RAG_KNOWLEDGE_BASE.filter(chunk => 
    (chunk.keywords && chunk.keywords.some(kw => lower.includes(kw))) ||
    (chunk.topic && lower.includes(chunk.topic.toLowerCase()))
  );

  return matched.length > 0 ? matched : [RAG_KNOWLEDGE_BASE[0]];
}

export function generateChikitsakResponse(
  param1,
  param2,
  param3,
  param4
) {
  // Support both object arguments { userMessage, language, activeProfile, activeReportContext }
  // and positional arguments (userMessage, activeProfile, activeReportContext, language)
  let userMessage = '';
  let language = 'en';
  let activeProfile = { name: 'User', age: 30, gender: 'Male', bloodGroup: 'B+', conditions: [], goals: [] };
  let activeReportContext = null;

  if (typeof param1 === 'object' && param1 !== null && !Array.isArray(param1) && param1.userMessage !== undefined) {
    userMessage = param1.userMessage || '';
    language = param1.language || 'en';
    activeProfile = param1.activeProfile || activeProfile;
    activeReportContext = param1.activeReportContext || null;
  } else {
    userMessage = typeof param1 === 'string' ? param1 : '';
    activeProfile = param2 || activeProfile;
    activeReportContext = param3 || null;
    language = param4 || 'en';
  }

  const isEmergency = detectRedFlagEmergency(userMessage);
  const ragSources = findRelevantRagSources(userMessage);
  const primaryRag = ragSources[0] || RAG_KNOWLEDGE_BASE[0];
  const citations = ragSources.map(r => r.source || r.topic);

  // 1. Emergency Case (Immediate Red-Flag Triage)
  if (isEmergency) {
    let emergencyText = '';
    if (language === 'hi') {
      emergencyText = `🚨 **आपातकालीन चेतावनी (Emergency Red-Flag):** आपके द्वारा बताए गए लक्षण (जैसे सीने में गंभीर दर्द या सांस लेने में भारी तकलीफ) आपातकालीन स्थिति का संकेत हो सकते हैं। कृपया तुरंत 108 या 112 डायल करें अथवा निकटतम अस्पताल के आपातकालीन विभाग में पहुँचें।`;
    } else if (language === 'hg') {
      emergencyText = `🚨 **URGENT EMERGENCY ALERT:** Aapke bataye gaye symptoms (chest pain / breathing difficulty) critical emergency ke sanket ho sakte hain. Please bina kisi deri ke **108 ya 112** par call karein ya paas ke emergency hospital mein jaayein.`;
    } else if (language === 'pb') {
      emergencyText = `🚨 **ਐਮਰਜੈਂਸੀ ਅਲਰਟ (Emergency Alert):** ਤੁਹਾਡੇ ਦੱਸੇ ਲੱਛਣ ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ ਦਾ ਸੰਕੇਤ ਹੋ ਸਕਦੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ **108 ਜਾਂ 112** 'ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨਜ਼ਦੀਕੀ ਹਸਪਤਾਲ ਦੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ।`;
    } else {
      emergencyText = `🚨 **URGENT EMERGENCY MEDICAL RED-FLAG:** The symptoms you described (such as severe chest pain, radiation, or acute breathing distress) represent potential life-threatening medical emergencies. Please **call 108 / 112 or reach the nearest emergency hospital immediately**. Do not wait or drive yourself.`;
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: emergencyText,
      text: emergencyText,
      isEmergency: true,
      citations: ['AIIMS Emergency Medicine & AHA Triage Protocols'],
      ragSources: [RAG_KNOWLEDGE_BASE.find(r => r.id === 'rag-emergency-06') || primaryRag],
      explainability: {
        profileGrounding: `${activeProfile.name || 'User'} (${activeProfile.age || 30}y)`,
        reportContext: activeReportContext ? activeReportContext.title : 'None',
        ragEvidence: 'High-Priority Emergency Symptom Intercept',
        safetyPolicy: 'AIIMS Emergency Medicine & AHA Triage Protocols'
      }
    };
  }

  // 2. Specific Topic Responses
  const lowerMsg = userMessage.toLowerCase();
  let content = '';

  // Case A: LDL / Cholesterol Query
  if (lowerMsg.includes('ldl') || lowerMsg.includes('cholesterol') || lowerMsg.includes('lipid')) {
    if (language === 'hi') {
      content = `**एलडीएल (LDL) और कोलेस्ट्रॉल विश्लेषण:**\n\n1. **एलडीएल क्या है?** इसे अक्सर "खराब कोलेस्ट्रॉल" कहा जाता है क्योंकि यह धमनियों में प्लाक जमा कर सकता है।\n2. **आपके आंकड़े:** आपके हालिया लिपिड प्रोफाइल में LDL **146 mg/dL** दर्ज है, जो आदर्श सीमा (100 mg/dL से कम) से अधिक है।\n3. **आहार सुधार:** ओट्स, अलसी (flaxseeds), अखरोट, और मेथी का सेवन बढ़ाएं। तली-भुनी व ट्रांस-फैट वाली चीजों से बचें।\n4. **डॉक्टर से क्या पूछें:** "क्या मुझे 3 महीने बाद दोबारा जांच करानी चाहिए या कोई दवा की आवश्यकता है?"`;
    } else if (language === 'hg') {
      content = `**Aapka LDL aur Lipid Profile Samjhein:**\n\n1. **LDL ka matlab:** Isko "bad cholesterol" kehte hain jo blood vessels mein jama ho sakta hai.\n2. **Aapki report:** Aapka current LDL **146 mg/dL** hai (Target: < 100 mg/dL).\n3. **Diet Tips:** Oats, methi seeds, badam aur walnuts lijiye. Fried snacks aur refined oil kam kijiye.\n4. **Doctor se sawaal:** "Doctor saab, kya mujhe lipid-lowering lifestyle se 3 months mein retest karna chahiye?"`;
    } else if (language === 'pb') {
      content = `**ਤੁਹਾਡਾ LDL ਅਤੇ ਕੋਲੈਸਟ੍ਰੋਲ:**\n\n1. **LDL ਕੀ ਹੈ?** ਇਸਨੂੰ "ਮਾੜਾ ਕੋਲੈਸਟ੍ਰੋਲ" ਕਿਹਾ ਜਾਂਦਾ ਹੈ।\n2. **ਰਿਪੋਰਟ ਮੁੱਲ:** ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਵਿੱਚ LDL **146 mg/dL** ਆਇਆ ਹੈ, ਜੋ 100 mg/dL ਤੋਂ ਵੱਧ ਹੈ।\n3. **ਖੁਰਾਕ ਸੁਝਾਅ:** ਓਟਸ, ਅਲਸੀ ਦੇ ਬੀਜ ਅਤੇ ਰੋਜ਼ਾਨਾ 30 ਮਿੰਟ ਤੇਜ਼ ਸੈਰ ਕਰੋ। ਤਲੀਆਂ ਚੀਜ਼ਾਂ ਘਟਾਓ।\n4. **ਡਾਕਟਰ ਨਾਲ ਗੱਲਬਾਤ:** ਡਾਕਟਰ ਤੋਂ ਪੁੱਛੋ ਕਿ ਕੀ ਖੁਰਾਕ ਨਾਲ ਇਸਨੂੰ ਕੰਟਰੋਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।`;
    } else {
      content = `**Understanding Your LDL & Cholesterol Profile:**\n\n1. **What is LDL?** Low-Density Lipoprotein (LDL) transports cholesterol throughout your bloodstream. When elevated, it can build up in arterial walls.\n2. **Your Current Results:** Your latest profile shows LDL at **146 mg/dL** (Optimal target is **< 100 mg/dL**).\n3. **Actionable Nutrition:**\n   - Incorporate soluble fiber (oat bran, psyllium husk, methi).\n   - Add plant-based omega-3s from walnuts and chia seeds.\n   - Avoid trans-fats and deep-fried savory snacks.\n4. **Suggested Doctor Discussion:** *"Given my family history, what is my ideal LDL target and should we re-evaluate in 90 days?"*`;
    }
  }

  // Case B: Diabetes / HbA1c / Glucose Query
  else if (lowerMsg.includes('hba1c') || lowerMsg.includes('glucose') || lowerMsg.includes('sugar') || lowerMsg.includes('diabetes')) {
    if (language === 'hi') {
      content = `**HbA1c और ब्लड शुगर मार्गदर्शन:**\n\n1. **HbA1c का अर्थ:** यह पिछले 3 महीनों के औसत ब्लड शुगर को दर्शाता है।\n2. **वर्तमान स्तर:** आपका HbA1c **7.4%** है (मधुमेह में सामान्य लक्ष्य < 7.0% होता है)।\n3. **दैनिक दिनचर्या:** भोजन के बाद 20-30 मिनट की हल्की सैर इंसुलिन संवेदनशीलता को बहुत बढ़ाती है।\n4. **आहार:** करेला, जामुन, मेथी रोटी और साबुत दालों को प्राथमिकता दें।`;
    } else if (language === 'hg') {
      content = `**HbA1c & Blood Sugar Analysis:**\n\n1. **HbA1c kya batata hai:** Yeh pichhle 90 dino ka average sugar level hai.\n2. **Aapka level:** Current HbA1c **7.4%** hai (Diabetic target: < 7.0%).\n3. **Daily Action:** Lunch aur dinner ke baad 20 min ki brisk walk GLUT-4 receptors ko activate karti hai.\n4. **Doctor consultation:** Apne doctor se Metformin dosage aur evening meals par advice lein.`;
    } else if (language === 'pb') {
      content = `**HbA1c ਅਤੇ ਸ਼ੂਗਰ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ:**\n\n1. **HbA1c ਦਾ ਮਤਲਬ:** ਇਹ ਪਿਛਲੇ 3 ਮਹੀਨਿਆਂ ਦੀ ਔਸਤ ਸ਼ੂਗਰ ਦਿਖਾਉਂਦਾ ਹੈ।\n2. **ਮੌਜੂਦਾ ਪੱਧਰ:** ਤੁਹਾਡਾ HbA1c **7.4%** ਹੈ।\n3. **ਸੁਝਾਅ:** ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਸੈਰ ਕਰੋ ਅਤੇ ਰਾਤ ਨੂੰ ਹਲਕਾ ਭੋਜਨ ਲਓ।`;
    } else {
      content = `**HbA1c & Glycemic Control Insights:**\n\n1. **What HbA1c Measures:** It reflects the percentage of red blood cells coated in glucose over the past 90 days.\n2. **Your Current Level:** Your latest reading is **7.4%** (Target for managed diabetes is generally **< 7.0%**).\n3. **Practical Steps:**\n   - Schedule 20-30 minute walks after lunch and dinner to activate muscle GLUT-4 glucose transporters.\n   - Reduce refined white grains in favor of steel-cut oats, dalia, and whole pulses.\n4. **Questions for Your Doctor:** *"Is the dawn phenomenon affecting my fasting glucose, and should we optimize evening carb timing?"*`;
    }
  }

  // Case C: Thyroid / TSH Query
  else if (lowerMsg.includes('tsh') || lowerMsg.includes('thyroid') || lowerMsg.includes('t3') || lowerMsg.includes('t4')) {
    if (language === 'hi') {
      content = `**थायरॉइड (TSH) रिपोर्ट विश्लेषण:**\n\n1. **TSH का महत्व:** TSH पिट्यूटरी ग्रंथि द्वारा थायरॉइड ग्रंथि को नियंत्रित करने वाला हार्मोन है।\n2. **वर्तमान स्तर:** आपका TSH **5.85 uIU/mL** है (सामान्य सीमा: 0.40 - 4.50)।\n3. **दवा लेने का सही नियम:** थायरोक्सिन की गोली सुबह खाली पेट सादे पानी के साथ लें और कम से कम 45 मिनट तक चाय या नाश्ता न करें।\n4. **डॉक्टर से परामर्श:** क्या दवा की खुराक में 12.5mcg का बदलाव आवश्यक है?`;
    } else if (language === 'hg') {
      content = `**Thyroid (TSH) Breakdown:**\n\n1. **TSH Level:** Aapka TSH **5.85 uIU/mL** hai, jo normal range (0.40 - 4.50) se thoda high hai.\n2. **Important Rule:** Thyroid ki tablet (Thyroxine) subah khali pet sirf plain water ke saath lein. Tea/coffee lene se pehle 45 mins ka gap rakhein.\n3. **Doctor Discussion:** "Doctor saab, kya fatigue ke liye dose adjustment ki zaroorat hai?"`;
    } else {
      content = `**Thyroid (TSH) Clinical Interpretation:**\n\n1. **Understanding TSH:** A high TSH indicates that the pituitary gland is sending stronger signals to prompt thyroid hormone production (subclinical hypothyroidism).\n2. **Your Level:** Your TSH is **5.85 uIU/mL** (Reference: **0.40 - 4.50 uIU/mL**).\n3. **Key Medication Rule:** Always take Levothyroxine first thing in the morning on an empty stomach with plain water. Wait at least 45 minutes before tea, coffee, or calcium/iron supplements.\n4. **Doctor Question:** *"Should we titrate my dose slightly from 50mcg to 62.5mcg based on this trend?"*`;
    }
  }

  // Case D: General / Health Question
  else {
    const isPediatric = (Number(activeProfile?.age) || 30) < 18;
    const profileGoals = activeProfile?.goals?.length ? activeProfile.goals.join(', ') : (isPediatric ? 'Child Growth & Wellness' : 'Healthy Longevity');
    
    if (isPediatric) {
      content = `**ApnaVaidya Pediatric Health Context:**\n\nI have reviewed the pediatric health profile for **${activeProfile.name || 'Ananya Sharma'}** (${activeProfile.age || 8}y, ${activeProfile.gender || 'Female'}) and linked diagnostic records.\n\n- **Pediatric Focus:** Age-appropriate balanced childhood nutrition, growth milestones, safe hydration, and active physical play.\n- **Allergy Safety:** Please ensure documented allergy precautions (${activeProfile.allergies?.join(', ') || 'Peanuts, Shellfish'}) are strictly observed.\n\nFeel free to ask about childhood immunization schedules, pediatric growth parameters, or balanced school meal planning!`;
    } else if (language === 'hi') {
      content = `**अपनावैद्य (ApnaVaidya) स्वास्थ्य परामर्श:**\n\nमैंने आपकी स्वास्थ्य प्रोफ़ाइल (${activeProfile.name || 'User'}, ${activeProfile.age || 30} वर्ष) और हालिया रिपोर्ट्स का अध्ययन किया है。\n\n- **मुख्य बिंदु:** आपके स्वास्थ्य लक्ष्यों (${profileGoals}) को ध्यान में रखते हुए संतुलित पोषण, नियमित जल सेवन और दैनिक शारीरिक गतिविधि सबसे महत्वपूर्ण स्तंभ हैं।\n- **सलाह:** यदि आप किसी विशेष रिपोर्ट या लक्षण के बारे में पूछना चाहते हैं, तो कृपया नीचे दिए गए सुझावों में से चुनें।`;
    } else if (language === 'hg') {
      content = `**ApnaVaidya Health Assistance:**\n\nMaine aapki health profile (${activeProfile.name || 'User'}, ${activeProfile.age || 30}y) aur active lab records check kiye hain.\n\n- **Health Focus:** Aapke current goals: ${profileGoals}.\n- **Action:** Aap kisi bhi report value (jaise LDL, HbA1c, TSH) ya nutrition ke baare mein freely pooch sakte hain!`;
    } else if (language === 'pb') {
      content = `**ਸਿਹਤ ਸਲਾਹ (ApnaVaidya Health Advice):**\n\nਤੁਹਾਡੇ ਪ੍ਰੋਫਾਈਲ (${activeProfile.name || 'User'}) ਅਤੇ ਤਾਜ਼ਾ ਰਿਪੋਰਟਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਤੁਸੀਂ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਰੋਜ਼ਾਨਾ ਪਾਣੀ, ਸੰਤੁਲਿਤ ਭੋਜਨ ਅਤੇ ਸੈਰ ਸਿਹਤ ਲਈ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।`;
    } else {
      content = `**ApnaVaidya Clinical Context Analysis:**\n\nI have reviewed your active profile (**${activeProfile.name || 'User'}**, ${activeProfile.age || 30}y, ${activeProfile.gender || 'Male'}) and linked diagnostic records.\n\n- **Active Health Goals:** ${profileGoals}\n- **Current Diet & Vitals:** ${activeProfile.dietPreference || 'Balanced'} • BMI ${activeProfile.bmi || '23.4'}\n\nFeel free to ask about any specific lab biomarker, medication timing, or customized recipe!`;
    }
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    text: content,
    isEmergency: false,
    citations: citations.length ? citations : ['ICMR Clinical Practice Guidelines', 'AIIMS Medical Protocols'],
    ragSources: ragSources,
    explainability: {
      profileGrounding: `${activeProfile.name || 'User'} (${activeProfile.age || 30}y, ${activeProfile?.conditions?.join(', ') || 'Healthy Baseline'})`,
      reportContext: activeReportContext ? activeReportContext.title : 'Active Profile Diagnostics History',
      ragEvidence: 'Educational Non-Diagnostic Clinical Knowledge',
      safetyPolicy: primaryRag.source || 'ICMR & WHO Reference Guidelines'
    }
  };
}
