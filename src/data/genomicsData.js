export const PHARMACOGENOMIC_PROFILES = {
  'user-arjun': {
    profileName: 'Arjun Sharma',
    cyp2c19: { genotype: '*1/*1', phenotype: 'Normal (Extensive) Metabolizer', risk: 'LOW' },
    slco1b1: { genotype: '*1/*5', phenotype: 'Intermediate Statin Transporter Function', risk: 'MODERATE' },
    cyp2d6: { genotype: '*1/*2', phenotype: 'Normal Metabolizer', risk: 'LOW' },
    mthfr: { genotype: 'C677T Heterozygous (CT)', phenotype: 'Reduced Folate Methylation (~35% lower conversion)', risk: 'MODERATE' }
  }
};

export const PGX_DRUG_GENE_DATABASE = [
  {
    id: 'pgx-atorvastatin',
    drugName: 'Atorvastatin / Rosuvastatin (Statins)',
    primaryGene: 'SLCO1B1 (OATP1B1 Transporter)',
    patientGenotype: '*1/*5 (c.521T>C)',
    phenotype: 'Intermediate Function',
    clinicalRisk: 'MODERATE',
    fdaCpicGuideline: 'CPIC Level A Recommendation',
    clinicalImplication: 'Reduced hepatic uptake of statins leads to higher systemic plasma concentrations, mildly elevating risk of statin-associated muscle symptoms (SAMS).',
    actionableRecommendation: 'Start with low-to-moderate dose (e.g. Atorvastatin 10-20 mg). If muscle soreness develops, switch to Rosuvastatin 5mg or Pravastatin which utilize alternative renal/hepatic clearance pathways.'
  },
  {
    id: 'pgx-clopidogrel',
    drugName: 'Clopidogrel (Plavix — Antiplatelet)',
    primaryGene: 'CYP2C19 (Phase 1 Bioactivation)',
    patientGenotype: '*1/*1 (Wild Type)',
    phenotype: 'Normal Metabolizer',
    clinicalRisk: 'SAFE',
    fdaCpicGuideline: 'CPIC Level A Recommendation',
    clinicalImplication: 'Standard prodrug bioactivation efficiency. Normal platelet inhibition achieved.',
    actionableRecommendation: 'Standard recommended dosing (75 mg daily) is fully effective.'
  },
  {
    id: 'pgx-metoprolol',
    drugName: 'Metoprolol (Beta-1 Blocker)',
    primaryGene: 'CYP2D6 (Hepatic Hydroxylation)',
    patientGenotype: '*1/*2',
    phenotype: 'Normal Metabolizer',
    clinicalRisk: 'SAFE',
    fdaCpicGuideline: 'CPIC Level B Recommendation',
    clinicalImplication: 'Standard rate of metoprolol oxidation with predictable heart-rate and blood pressure reduction.',
    actionableRecommendation: 'Maintain standard titration based on resting heart rate target (60-70 bpm).'
  },
  {
    id: 'pgx-folate',
    drugName: 'Folic Acid vs L-Methylfolate',
    primaryGene: 'MTHFR (C677T & A1298C)',
    patientGenotype: 'C677T Heterozygous (CT)',
    phenotype: 'Reduced MTHFR Enzyme Activity (~35%)',
    clinicalRisk: 'MODERATE',
    fdaCpicGuideline: 'Epigenetic Clinical Guideline',
    clinicalImplication: 'Inefficient conversion of synthetic dietary folic acid into bioactive 5-MTHF. Can lead to sub-optimal homocysteine clearance.',
    actionableRecommendation: 'Prioritize bioactive L-5-Methyltetrahydrofolate (5-MTHF) and natural leafy dark greens over synthetic folic acid supplements.'
  },
  {
    id: 'pgx-metformin',
    drugName: 'Metformin (Biguanide)',
    primaryGene: 'SLC22A1 (OCT1 Transporter)',
    patientGenotype: 'High-Function Alleles',
    phenotype: 'Normal Hepatic Transporter',
    clinicalRisk: 'SAFE',
    fdaCpicGuideline: 'Clinical Pharmacogenetics Standard',
    clinicalImplication: 'Robust hepatic cellular uptake. Standard glycemic lowering and AMPK activation expected.',
    actionableRecommendation: 'Standard therapeutic dosing after meals (500-1000 mg BD).'
  }
];

export const MTHFR_METHYLATION_CYCLE = {
  geneName: 'MTHFR (Methylenetetrahydrofolate Reductase)',
  patientVariant: 'C677T Heterozygous (CT Polymorphism)',
  biologicalPathway: 'Converts 5,10-Methylenetetrahydrofolate into 5-Methyltetrahydrofolate (5-MTHF), the primary methyl donor for remethylating toxic Homocysteine into essential Methionine.',
  keyCoFactors: [
    { name: 'L-5-MTHF (Active Folate)', role: 'Direct bioactive methyl donor bypassing mutated MTHFR enzyme step.' },
    { name: 'Methylcobalamin (Active B12)', role: 'Essential co-factor for Methionine Synthase enzyme in homocysteine remethylation.' },
    { name: 'P-5-P (Active B6 / Pyridoxal-5-Phosphate)', role: 'Directs excess homocysteine into the transsulfuration pathway to synthesize Glutathione (master antioxidant).' },
    { name: 'Betaine (TMG) & Choline', role: 'Provides alternative BHMT liver pathway for homocysteine detoxification.' }
  ]
};
