import { PRELOADED_REPORTS } from '../data/reportsData';

/**
 * OCR Report Analysis Simulator
 * Multi-stage pipeline:
 * 1. Document Ingestion & Validation
 * 2. Optical Character Recognition (OCR Text extraction)
 * 3. Medical Entity Recognition (BioBERT/Clinical matcher)
 * 4. Reference Range Evaluation
 * 5. Plain-Language AI Summarization
 */

export const OCR_STAGES = [
  { step: 1, label: 'Document Ingestion & File Virus/Malware Validation', duration: 450 },
  { step: 2, label: 'High-Resolution OCR Text & Table Grid Extraction', duration: 650 },
  { step: 3, label: 'Medical Entity Recognition & Unit Normalization', duration: 550 },
  { step: 4, label: 'Standard Clinical Reference Range Cross-Check', duration: 500 },
  { step: 5, label: 'Generating Plain-Language AI Summary & Lifestyle Insights', duration: 600 }
];

export function analyzeUploadedFile(fileOrPresetName, activeProfileId) {
  // Check if preset matches
  const match = PRELOADED_REPORTS.find(r => 
    r.title.toLowerCase().includes(fileOrPresetName.toLowerCase()) || 
    fileOrPresetName.toLowerCase().includes(r.title.toLowerCase())
  );

  if (match) {
    return {
      ...match,
      id: `rep-${Date.now()}`,
      profileId: activeProfileId,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }

  // Generic fallback simulated report for custom uploads
  return {
    id: `rep-${Date.now()}`,
    profileId: activeProfileId,
    title: fileOrPresetName || 'Custom Lab Investigation',
    category: 'General Pathology',
    labName: 'Accredited Diagnostics Lab',
    testDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Analyzed',
    badgeCount: '1 Elevated',
    summary: {
      overallStatus: 'Report Analyzed Successfully',
      keyFindings: [
        'All primary biomarkers successfully identified and parsed into structured medical data.',
        '1 parameter indicates mild elevation relative to clinical baseline.',
        'Hydration and metabolic markers appear stable.'
      ],
      aiRecommendation: 'Keep up a balanced nutrient-dense diet and stay well hydrated. Discuss this report at your next clinician visit.',
      normalCount: 3,
      abnormalCount: 1
    },
    parameters: [
      {
        id: `param-${Date.now()}-1`,
        name: 'Serum Uric Acid',
        category: 'Metabolic',
        value: 7.6,
        unit: 'mg/dL',
        minNormal: 3.5,
        maxNormal: 7.2,
        status: 'HIGH',
        clinicalMeaning: 'Waste product formed from breakdown of purines in food and cells.',
        plainExplanation: 'Your uric acid is slightly high at 7.6 mg/dL. Staying hydrated helps your kidneys flush out excess uric acid.',
        lifestyleTip: 'Drink 2.5-3 liters of water daily. Limit red meat, purine-dense seafood, and sugary soft drinks.',
        doctorQuestion: 'Do I need any purine restriction or follow-up kidney evaluation?',
        sourceCitation: 'American College of Rheumatology & ICMR Protocols'
      },
      {
        id: `param-${Date.now()}-2`,
        name: 'Fasting Blood Glucose',
        category: 'Glycemic',
        value: 94,
        unit: 'mg/dL',
        minNormal: 70,
        maxNormal: 100,
        status: 'NORMAL',
        clinicalMeaning: 'Glucose level in bloodstream after overnight fasting.',
        plainExplanation: 'Fasting blood sugar is in an optimal, healthy range.',
        lifestyleTip: 'Maintain current dietary balance.',
        doctorQuestion: 'Optimal glycemic reading.',
        sourceCitation: 'ADA Guidelines'
      },
      {
        id: `param-${Date.now()}-3`,
        name: 'Serum Electrolytes (Sodium)',
        category: 'Electrolytes',
        value: 140,
        unit: 'mEq/L',
        minNormal: 135,
        maxNormal: 145,
        status: 'NORMAL',
        clinicalMeaning: 'Major extracellular electrolyte regulating fluid balance and blood pressure.',
        plainExplanation: 'Sodium levels are perfectly balanced.',
        lifestyleTip: 'Keep sodium in food balanced with natural potassium (bananas, coconut water).',
        doctorQuestion: 'Normal electrolytes.',
        sourceCitation: 'Clinical Chemistry Manual'
      },
      {
        id: `param-${Date.now()}-4`,
        name: 'Serum Calcium',
        category: 'Minerals',
        value: 9.4,
        unit: 'mg/dL',
        minNormal: 8.5,
        maxNormal: 10.5,
        status: 'NORMAL',
        clinicalMeaning: 'Essential mineral for strong bones, nerve transmission, and muscle contraction.',
        plainExplanation: 'Calcium levels are optimal at 9.4 mg/dL.',
        lifestyleTip: 'Ensure adequate Vitamin D3 synthesis from sunlight or nutrition to support calcium absorption.',
        doctorQuestion: 'Optimal bone mineral marker.',
        sourceCitation: 'Endocrine Society Guidelines'
      }
    ]
  };
}
