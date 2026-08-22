import { PRELOADED_REPORTS } from '../data/reportsData';

/**
 * ApnaVaidya Real Clinical OCR & Multi-Format Laboratory Ingestion Engine
 * Handles:
 * 1. Digital Text Reports (.txt, .csv, .json)
 * 2. Multi-Page Digital PDF Lab Documents (.pdf)
 * 3. Scanned Lab Receipts & Photos (.png, .jpg, .jpeg, .webp) via Tesseract Neural OCR
 * 4. Biomedical Entity Extraction & Reference Interval Evaluation
 */

export const OCR_STAGES = [
  { step: 1, label: 'Document Stream Ingestion & Decoding', duration: 400 },
  { step: 2, label: 'Neural OCR & Text Layer Extraction (PDF/Image)', duration: 800 },
  { step: 3, label: 'Clinical Biomarker Entity Recognition & Parsing', duration: 500 },
  { step: 4, label: 'ICMR / ADA Reference Range Cross-Evaluation', duration: 450 },
  { step: 5, label: 'Generating Actionable EHR Insights & AI Summary', duration: 500 }
];

// Clinical Biomarker Regex Pattern Definitions
const BIOMARKER_PATTERNS = [
  {
    id: 'hba1c',
    name: 'Glycated Hemoglobin (HbA1c)',
    regex: /(?:hba1c|glycated\s*hemoglobin|glycohemoglobin|a1c)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: '%',
    minNormal: 4.0,
    maxNormal: 5.6,
    category: 'Glycemic',
    meaning: '3-month average blood glucose concentration attached to hemoglobin.',
    tip: 'Incorporate low glycemic index foods (whole grains, green vegetables) and 30m daily brisk walking.'
  },
  {
    id: 'fbg',
    name: 'Fasting Blood Glucose',
    regex: /(?:fasting\s*(?:blood\s*)?(?:glucose|sugar)|fbg|glucose\s*(?:-\s*)?fasting)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 70,
    maxNormal: 99,
    category: 'Glycemic',
    meaning: 'Blood glucose level after overnight 8-10 hour fast.',
    tip: 'Avoid simple sugars, late-night carbohydrates, and maintain regular sleep.'
  },
  {
    id: 'ppbg',
    name: 'Postprandial Blood Glucose (PPBG)',
    regex: /(?:postprandial|post\s*meal|ppbg|glucose\s*pp|pp\s*glucose)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 80,
    maxNormal: 140,
    category: 'Glycemic',
    meaning: 'Blood glucose level 2 hours after a standardized meal.',
    tip: 'Post-meal walking and fiber pre-loading significantly dampen postprandial glucose spikes.'
  },
  {
    id: 'cholesterol_total',
    name: 'Total Cholesterol',
    regex: /(?:total\s*cholesterol|cholesterol\s*(?:-\s*)?total)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 125,
    maxNormal: 200,
    category: 'Lipid Profile',
    meaning: 'Total circulating cholesterol encompassing HDL, LDL, and VLDL particles.',
    tip: 'Reduce saturated and trans-fats; incorporate walnuts, flaxseeds, and soluble fiber.'
  },
  {
    id: 'ldl',
    name: 'LDL-C (Low-Density Lipoprotein)',
    regex: /(?:ldl(?:-c)?|low\s*density\s*lipoprotein)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 50,
    maxNormal: 100,
    category: 'Lipid Profile',
    meaning: 'Atherogenic lipoprotein responsible for arterial wall plaque formation.',
    tip: 'Daily aerobic exercise (Zone-2 cardio) and dietary plant sterols help reduce LDL.'
  },
  {
    id: 'hdl',
    name: 'HDL-C (High-Density Lipoprotein)',
    regex: /(?:hdl(?:-c)?|high\s*density\s*lipoprotein)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 40,
    maxNormal: 60,
    category: 'Lipid Profile',
    meaning: 'Protective cholesterol transporting lipids from arteries back to the liver.',
    tip: 'Regular exercise and healthy monounsaturated fats (olive oil, mustard oil) support HDL.'
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    regex: /(?:triglycerides?|tg|serum\s*triglycerides)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 50,
    maxNormal: 150,
    category: 'Lipid Profile',
    meaning: 'Fat particles circulating in blood used for cellular energy storage.',
    tip: 'Limit refined flour, sugar-sweetened beverages, and alcohol.'
  },
  {
    id: 'creatinine',
    name: 'Serum Creatinine',
    regex: /(?:serum\s*creatinine|creatinine)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 0.6,
    maxNormal: 1.2,
    category: 'Renal Function',
    meaning: 'Breakdown product of creatine phosphate from muscle metabolism cleared by kidneys.',
    tip: 'Ensure adequate 2.5-3L daily hydration and avoid unnecessary NSAID painkiller overuse.'
  },
  {
    id: 'tsh',
    name: 'Thyroid Stimulating Hormone (TSH)',
    regex: /(?:tsh|thyroid\s*stimulating\s*hormone)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'uIU/mL',
    minNormal: 0.45,
    maxNormal: 4.5,
    category: 'Thyroid Panel',
    meaning: 'Pituitary hormone regulating thyroid gland triiodothyronine (T3) and thyroxine (T4) output.',
    tip: 'Adequate dietary selenium, zinc, and stress management support thyroid axis balance.'
  },
  {
    id: 'hb',
    name: 'Hemoglobin',
    regex: /(?<!glycated\s*|glyco\s*)(?:\bhemoglobin\b|\bhb\b(?:\s*level)?)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'g/dL',
    minNormal: 12.0,
    maxNormal: 16.5,
    category: 'Complete Blood Count (CBC)',
    meaning: 'Iron-containing oxygen-transport metalloprotein in red blood cells.',
    tip: 'Include iron-rich foods (spinach, beetroot, jaggery, lentils) paired with Vitamin C.'
  },
  {
    id: 'wbc',
    name: 'Total Leukocyte Count (WBC)',
    regex: /(?:total\s*leukocyte\s*count|tlc|wbc(?:\s*count)?)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'cells/mcL',
    minNormal: 4000,
    maxNormal: 11000,
    category: 'Complete Blood Count (CBC)',
    meaning: 'Total circulating white blood cells essential for immune defense.',
    tip: 'Elevated WBC often reflects acute immune response, infection, or bodily inflammation.'
  },
  {
    id: 'platelets',
    name: 'Platelet Count',
    regex: /(?:platelet\s*count|platelets)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'lakh/mcL',
    minNormal: 1.5,
    maxNormal: 4.5,
    category: 'Complete Blood Count (CBC)',
    meaning: 'Cell fragments essential for normal blood clotting and vascular repair.',
    tip: 'Maintain adequate micronutrient intake and avoid unmonitored anticoagulants.'
  },
  {
    id: 'vitd',
    name: 'Vitamin D3 (25-OH)',
    regex: /(?:vitamin\s*d(?:3)?|25-oh\s*vitamin\s*d|vit\s*d3?)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'ng/mL',
    minNormal: 30,
    maxNormal: 100,
    category: 'Vitamins & Bone',
    meaning: 'Steroid hormone precursor critical for calcium absorption and immune regulation.',
    tip: '20 minutes of morning sun exposure and dietary fortification (milk, eggs, mushrooms).'
  },
  {
    id: 'vitb12',
    name: 'Vitamin B12 (Cobalamin)',
    regex: /(?:vitamin\s*b12|vit\s*b12|cyanocobalamin)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'pg/mL',
    minNormal: 200,
    maxNormal: 900,
    category: 'Vitamins & Bone',
    meaning: 'Essential vitamin for neurological function, DNA synthesis, and RBC production.',
    tip: 'Crucial for vegetarians/vegans; incorporate fortified nutritional yeast or doctor-guided B12.'
  },
  {
    id: 'uric_acid',
    name: 'Serum Uric Acid',
    regex: /(?:uric\s*acid|serum\s*uric\s*acid)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'mg/dL',
    minNormal: 3.5,
    maxNormal: 7.2,
    category: 'Metabolic Panel',
    meaning: 'End product of purine nucleotide degradation filtered by the renal system.',
    tip: 'Drink 2.5-3 liters of water daily. Moderate intake of high-purine foods.'
  },
  {
    id: 'alt_sgpt',
    name: 'SGPT / ALT (Alanine Aminotransferase)',
    regex: /(?:sgpt|alt|alanine\s*aminotransferase)[^0-9\n\r]*?[\s:=-]\s*([0-9.]+)/i,
    unit: 'U/L',
    minNormal: 7,
    maxNormal: 56,
    category: 'Liver Function (LFT)',
    meaning: 'Key enzyme released into bloodstream upon hepatocellular stress or injury.',
    tip: 'Limit refined sugars, avoid alcohol, and maintain a healthy body mass index.'
  }
];

/**
 * Extract text from Digital PDF files using PDF.js (Loaded on demand)
 */
export async function extractTextFromPdf(file) {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      } catch (_) {}
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map(item => item.str).join(' ');
      fullText += pageStrings + '\n';
    }

    if (fullText.trim().length > 20) {
      return fullText;
    }

    // Fallback: If scanned image in PDF
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    return await extractTextFromImage(canvas);
  } catch (err) {
    console.warn('PDF text extraction notice:', err.message);
    return '';
  }
}

/**
 * Extract text from Image files using Tesseract.js (Loaded on demand)
 */
export async function extractTextFromImage(fileOrCanvas, onProgress = null) {
  let worker = null;
  try {
    const { createWorker } = await import('tesseract.js');
    worker = await createWorker('eng', 1, {
      logger: m => {
        if (typeof onProgress === 'function' && m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });

    const ret = await worker.recognize(fileOrCanvas);
    await worker.terminate();
    return ret.data.text || '';
  } catch (err) {
    console.error('Tesseract OCR notice:', err.message);
    if (worker) {
      try { await worker.terminate(); } catch (_) {}
    }
    return '';
  }
}

/**
 * Multi-format universal text extractor (Text, CSV, PDF, Image)
 */
export async function extractTextFromFile(file, onProgress = null) {
  if (!file) return '';

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  // 1. Plain Text / CSV / JSON
  if (fileType.includes('text') || fileType.includes('json') || fileType.includes('csv') || fileName.endsWith('.txt') || fileName.endsWith('.csv') || fileName.endsWith('.json')) {
    return await file.text();
  }

  // 2. Digital PDF Document
  if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
    return await extractTextFromPdf(file);
  }

  // 3. Scanned Image / Photo (PNG, JPG, JPEG, WEBP)
  if (fileType.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')) {
    return await extractTextFromImage(file, onProgress);
  }

  // Default fallback
  try {
    return await file.text();
  } catch (_) {
    return '';
  }
}

/**
 * Extract structured clinical biomarkers from text stream
 */
export function parseBiomarkersFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const extracted = [];

  for (const def of BIOMARKER_PATTERNS) {
    const match = text.match(def.regex);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) {
        let status = 'NORMAL';
        if (val > def.maxNormal) status = 'HIGH';
        else if (val < def.minNormal) status = 'LOW';

        extracted.push({
          id: `param-${def.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: def.name,
          category: def.category,
          value: val,
          unit: def.unit,
          minNormal: def.minNormal,
          maxNormal: def.maxNormal,
          status,
          clinicalMeaning: def.meaning,
          plainExplanation: status === 'NORMAL'
            ? `${def.name} is in the optimal clinical target range (${val} ${def.unit}).`
            : `${def.name} is ${status.toLowerCase()} at ${val} ${def.unit} (normal reference: ${def.minNormal} - ${def.maxNormal} ${def.unit}).`,
          lifestyleTip: def.tip,
          doctorQuestion: status === 'NORMAL'
            ? 'Optimal reading confirmed.'
            : `What dietary or therapeutic adjustments are recommended for my ${status.toLowerCase()} ${def.name}?`,
          sourceCitation: 'ICMR National Guidelines & Harrison\'s Internal Medicine'
        });
      }
    }
  }

  return extracted;
}

/**
 * Main Async OCR Ingestion & Analysis Function
 */
export async function analyzeUploadedFileAsync(fileOrPresetName, activeProfileId, rawTextContent = null, onProgress = null) {
  let text = rawTextContent || '';
  const isFileObject = typeof fileOrPresetName === 'object' && fileOrPresetName !== null && typeof fileOrPresetName.arrayBuffer === 'function';
  const name = isFileObject ? fileOrPresetName.name : (typeof fileOrPresetName === 'string' ? fileOrPresetName : 'Diagnostic Report');

  // If File object passed without pre-extracted text, run multi-format extractor
  if (isFileObject && (!text || text.trim().length === 0)) {
    text = await extractTextFromFile(fileOrPresetName, onProgress);
  }

  // If text was extracted, parse clinical biomarkers
  if (text && typeof text === 'string' && text.trim().length > 0) {
    const parsedParams = parseBiomarkersFromText(text);
    if (parsedParams.length > 0) {
      const abnormal = parsedParams.filter(p => p.status !== 'NORMAL');
      return {
        id: `rep-${Date.now()}`,
        profileId: activeProfileId,
        title: name,
        category: 'Diagnostic Investigation',
        labName: 'Extracted via ApnaVaidya Neural OCR Engine',
        testDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Analyzed',
        badgeCount: abnormal.length > 0 ? `${abnormal.length} Out of Range` : 'All Optimal',
        summary: {
          overallStatus: abnormal.length > 0 ? 'Actionable Findings Detected' : 'All Primary Biomarkers Optimal',
          keyFindings: [
            `Successfully extracted ${parsedParams.length} laboratory biomarkers directly from document text.`,
            abnormal.length > 0
              ? `${abnormal.length} parameter(s) (${abnormal.map(p => p.name).join(', ')}) indicate values outside reference intervals.`
              : 'All evaluated biochemical parameters demonstrate physiological equilibrium.'
          ],
          aiRecommendation: abnormal.length > 0
            ? 'Review the elevated parameters with your primary physician. Adhere to low glycemic and heart-healthy dietary advice.'
            : 'Maintain current nutrition, physical activity, and hydration routines.',
          normalCount: parsedParams.length - abnormal.length,
          abnormalCount: abnormal.length
        },
        parameters: parsedParams
      };
    }
  }

  // Check if preset matches standard verified reports
  const match = PRELOADED_REPORTS.find(r => 
    r.title.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(r.title.toLowerCase())
  );

  if (match) {
    return {
      ...match,
      id: `rep-${Date.now()}`,
      profileId: activeProfileId,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }

  // Truthful response when document has no recognizable lab biomarker entities
  return {
    id: `rep-${Date.now()}`,
    profileId: activeProfileId,
    title: name,
    category: 'Diagnostic Investigation',
    labName: 'Custom Upload / Scanned Document',
    testDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Needs Review',
    badgeCount: 'Review Required',
    summary: {
      overallStatus: 'No Structured Biomarkers Detected in Text Layer',
      keyFindings: [
        `Ingested document '${name}'.`,
        'No standard biochemical reference markers (e.g. HbA1c, LDL, FBG, TSH, Creatinine) were detected in the OCR text layer.',
        'To test full diagnostic analysis, upload a clear diagnostic lab report (PDF, image scan, TXT/CSV) or select one of the preloaded clinical panels.'
      ],
      aiRecommendation: 'Please ensure your uploaded report includes standard test names and numerical values, or test with our preloaded lab panels.',
      normalCount: 0,
      abnormalCount: 0
    },
    parameters: []
  };
}

// Synchronous wrapper for backward compatibility
export function analyzeUploadedFile(fileOrPresetName, activeProfileId, rawTextContent = null) {
  const isFileObject = typeof fileOrPresetName === 'object' && fileOrPresetName !== null && typeof fileOrPresetName.arrayBuffer === 'function';
  const name = isFileObject ? fileOrPresetName.name : (typeof fileOrPresetName === 'string' ? fileOrPresetName : 'Diagnostic Report');

  if (rawTextContent && typeof rawTextContent === 'string' && rawTextContent.trim().length > 0) {
    const parsedParams = parseBiomarkersFromText(rawTextContent);
    if (parsedParams.length > 0) {
      const abnormal = parsedParams.filter(p => p.status !== 'NORMAL');
      return {
        id: `rep-${Date.now()}`,
        profileId: activeProfileId,
        title: name,
        category: 'Diagnostic Investigation',
        labName: 'Extracted via ApnaVaidya Neural OCR Engine',
        testDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Analyzed',
        badgeCount: abnormal.length > 0 ? `${abnormal.length} Out of Range` : 'All Optimal',
        summary: {
          overallStatus: abnormal.length > 0 ? 'Actionable Findings Detected' : 'All Primary Biomarkers Optimal',
          keyFindings: [
            `Successfully extracted ${parsedParams.length} laboratory biomarkers directly from document text.`,
            abnormal.length > 0
              ? `${abnormal.length} parameter(s) (${abnormal.map(p => p.name).join(', ')}) indicate values outside reference intervals.`
              : 'All evaluated biochemical parameters demonstrate physiological equilibrium.'
          ],
          aiRecommendation: abnormal.length > 0
            ? 'Review the elevated parameters with your primary physician. Adhere to low glycemic and heart-healthy dietary advice.'
            : 'Maintain current nutrition, physical activity, and hydration routines.',
          normalCount: parsedParams.length - abnormal.length,
          abnormalCount: abnormal.length
        },
        parameters: parsedParams
      };
    }
  }

  const match = PRELOADED_REPORTS.find(r => 
    r.title.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(r.title.toLowerCase())
  );

  if (match) {
    return {
      ...match,
      id: `rep-${Date.now()}`,
      profileId: activeProfileId,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }

  return {
    id: `rep-${Date.now()}`,
    profileId: activeProfileId,
    title: name,
    category: 'Diagnostic Investigation',
    labName: 'Custom Upload / Scanned Document',
    testDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Needs Review',
    badgeCount: 'Review Required',
    summary: {
      overallStatus: 'No Structured Biomarkers Detected in Text Layer',
      keyFindings: [
        `Ingested document '${name}'.`,
        'No standard biochemical reference markers were detected.',
        'To test full diagnostic analysis, upload a clear lab report or choose a preloaded clinical panel.'
      ],
      aiRecommendation: 'Please ensure your uploaded report includes standard test names and numerical values.',
      normalCount: 0,
      abnormalCount: 0
    },
    parameters: []
  };
}
