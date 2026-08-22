import { describe, it, expect } from 'vitest';
import { parseBiomarkersFromText, analyzeUploadedFile } from '../ocrReportService';

describe('ApnaVaidya OCR & Biomarker Parsing Service', () => {
  it('correctly extracts glycemic panel biomarkers from text', () => {
    const rawReport = `
      MAX HEALTHCARE INSTITUTE
      Patient: Arjun Sharma | Age: 52 | Gender: Male
      -----------------------------------------------
      HbA1c (Glycated Hemoglobin) : 6.8 % (Normal: 4.0 - 5.6)
      Fasting Blood Glucose: 138 mg/dL (Normal: 70 - 99)
      Postprandial Glucose: 185 mg/dL (Normal: 80 - 140)
    `;

    const biomarkers = parseBiomarkersFromText(rawReport);
    expect(biomarkers.length).toBe(3);

    const hba1c = biomarkers.find(b => b.name.includes('HbA1c'));
    expect(hba1c).toBeDefined();
    expect(hba1c.value).toBe(6.8);
    expect(hba1c.status).toBe('HIGH');
    expect(hba1c.unit).toBe('%');

    const fbg = biomarkers.find(b => b.name.includes('Fasting'));
    expect(fbg).toBeDefined();
    expect(fbg.value).toBe(138);
    expect(fbg.status).toBe('HIGH');
  });

  it('correctly extracts lipid profile biomarkers and evaluates reference ranges', () => {
    const rawReport = `
      NABL DIAGNOSTIC LAB
      Lipid Profile:
      Total Cholesterol: 215 mg/dL
      LDL-C: 146 mg/dL
      HDL-C: 44 mg/dL
      Triglycerides: 168 mg/dL
      Serum Creatinine: 1.0 mg/dL
    `;

    const biomarkers = parseBiomarkersFromText(rawReport);
    expect(biomarkers.length).toBe(5);

    const ldl = biomarkers.find(b => b.name.includes('LDL'));
    expect(ldl).toBeDefined();
    expect(ldl.value).toBe(146);
    expect(ldl.status).toBe('HIGH');

    const creat = biomarkers.find(b => b.name.includes('Creatinine'));
    expect(creat).toBeDefined();
    expect(creat.value).toBe(1.0);
    expect(creat.status).toBe('NORMAL');
  });

  it('returns truthful empty biomarker list when document has no lab entities', () => {
    const nonLabText = 'This is just a grocery receipt: Apples, Milk, Bread, Butter.';
    const biomarkers = parseBiomarkersFromText(nonLabText);
    expect(biomarkers.length).toBe(0);

    const analyzed = analyzeUploadedFile('Receipt.txt', 'user-arjun', nonLabText);
    expect(analyzed.parameters.length).toBe(0);
    expect(analyzed.status).toBe('Needs Review');
    expect(analyzed.summary.overallStatus).toBe('No Structured Biomarkers Detected in Text Layer');
  });
});
