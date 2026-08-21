export const RAG_KNOWLEDGE_BASE = [
  {
    id: 'rag-lipid-01',
    topic: 'Lipid Profile & Atherosclerosis',
    keywords: ['ldl', 'cholesterol', 'triglycerides', 'hdl', 'heart', 'arteries', 'lipid'],
    title: 'ICMR Guidelines for Management of Dyslipidemia in Indian Adults (2024)',
    source: 'Indian Council of Medical Research (ICMR) & Cardiology Society of India',
    summary: 'Elevated LDL-C (> 100 mg/dL) accelerates arterial atheroma formation. For South Asian populations with higher atherogenic risk, lifestyle interventions including replacing saturated fats with monounsaturated oils (mustard, olive, sesame) and consuming 30-40g soluble fiber daily are first-line strategies.',
    evidenceLevel: 'Grade A Clinical Consensus'
  },
  {
    id: 'rag-diabetes-02',
    topic: 'Glycemic Target & Glycosylated Hemoglobin',
    keywords: ['hba1c', 'glucose', 'sugar', 'diabetes', 'fasting', 'insulin', 'karela', 'metformin'],
    title: 'ADA Standards of Care in Diabetes & RSSDI Consensus (2025)',
    source: 'American Diabetes Association (ADA) & RSSDI',
    summary: 'HbA1c reflects non-enzymatic glycosylation of hemoglobin over approximately 90-120 days. A target of < 7.0% reduces microvascular complications (retinopathy, nephropathy, neuropathy). Post-meal brisk walks activate GLUT-4 transporters independently of insulin.',
    evidenceLevel: 'Level 1 Clinical Evidence'
  },
  {
    id: 'rag-thyroid-03',
    topic: 'Thyroid Hormones & Hypothyroidism',
    keywords: ['tsh', 'thyroid', 't3', 't4', 'levothyroxine', 'eltroxin', 'fatigue', 'weight gain'],
    title: 'Clinical Practice Guidelines for Hypothyroidism in Adults',
    source: 'American Thyroid Association (ATA) & Indian Thyroid Society',
    summary: 'Serum TSH is the most sensitive marker for thyroid gland status. Elevated TSH with normal Free T4 indicates subclinical hypothyroidism. Thyroxine should be taken strictly on an empty stomach with water, waiting 45 minutes before food or coffee.',
    evidenceLevel: 'Grade A Recommendation'
  },
  {
    id: 'rag-renal-04',
    topic: 'Renal Function & Creatinine Filtration',
    keywords: ['creatinine', 'kft', 'kidney', 'egfr', 'urea', 'proteinuria', 'renal'],
    title: 'KDIGO 2024 Clinical Practice Guideline for the Evaluation of Chronic Kidney Disease',
    source: 'Kidney Disease: Improving Global Outcomes (KDIGO)',
    summary: 'Serum creatinine is a metabolic waste product filtered by glomeruli. In adults with hypertension or diabetes, preserving renal function requires blood pressure control (< 130/80 mmHg), adequate hydration, and limiting NSAID analgesics.',
    evidenceLevel: 'Grade A Guideline'
  },
  {
    id: 'rag-hematology-05',
    topic: 'Hemoglobin & Complete Blood Count',
    keywords: ['hemoglobin', 'hb', 'cbc', 'anemia', 'platelets', 'wbc', 'iron'],
    title: 'WHO Guidelines on Diagnostic Criteria for Anemias & Hematology',
    source: 'World Health Organization (WHO) & AIIMS Clinical Pathology',
    summary: 'Normal hemoglobin ranges for adult males are 13.0-17.0 g/dL, and for adult females 12.0-15.5 g/dL. Dietary iron from legumes, green leaves, and ascorbic acid (vitamin C) enhances intestinal non-heme iron absorption.',
    evidenceLevel: 'Global Standard'
  },
  {
    id: 'rag-emergency-06',
    topic: 'Acute Coronary Syndrome & Stroke Red-Flags',
    keywords: ['chest pain', 'heart attack', 'left arm pain', 'crushing pain', 'stroke', 'face drooping', 'breathlessness', 'breathing difficulty', 'unconscious', 'fainting'],
    title: 'Emergency Medical Triage Protocol & Urgent Red-Flag Directives',
    source: 'AIIMS Emergency Medicine & AHA Guidelines for CPR/ECC',
    summary: 'Severe retrosternal chest pain with radiation, sudden unilateral numbness or facial asymmetry, or severe respiratory distress represent life-threatening emergencies requiring immediate hospital emergency department dispatch. Digital applications must not provide routine advice.',
    evidenceLevel: 'Emergency Critical Directive'
  }
];
