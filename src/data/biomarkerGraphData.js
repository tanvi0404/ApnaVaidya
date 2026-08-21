export const BIOMARKER_GRAPH_NODES = [
  {
    id: 'node-tsh',
    label: 'TSH (Thyroid)',
    value: '5.85 uIU/mL',
    status: 'HIGH', // HIGH, BORDERLINE, OPTIMAL
    category: 'Endocrine',
    x: 200,
    y: 110,
    r: 34,
    description: 'Elevated TSH indicates sluggish thyroid output (subclinical hypothyroidism). It reduces LDL receptor density on liver cells, slowing cholesterol clearance.',
    connectedTo: ['node-ldl', 'node-vitd', 'node-hba1c']
  },
  {
    id: 'node-ldl',
    label: 'LDL Cholesterol',
    value: '146 mg/dL',
    status: 'HIGH',
    category: 'Cardiometabolic',
    x: 420,
    y: 100,
    r: 38,
    description: 'Elevated atherogenic lipoprotein. High TSH and low soluble fiber exacerbate circulating LDL levels.',
    connectedTo: ['node-tsh', 'node-trig', 'node-bp']
  },
  {
    id: 'node-trig',
    label: 'Triglycerides',
    value: '178 mg/dL',
    status: 'HIGH',
    category: 'Lipid Reserve',
    x: 580,
    y: 170,
    r: 32,
    description: 'Circulating neutral fats driven by dietary refined carbohydrates and hepatic VLDL overproduction.',
    connectedTo: ['node-ldl', 'node-hdl', 'node-hba1c']
  },
  {
    id: 'node-hdl',
    label: 'HDL Cholesterol',
    value: '52 mg/dL',
    status: 'OPTIMAL',
    category: 'Cardioprotective',
    x: 520,
    y: 310,
    r: 30,
    description: 'Reverse cholesterol transporter carrying peripheral arterial lipids back to the liver for excretion.',
    connectedTo: ['node-trig', 'node-ldl']
  },
  {
    id: 'node-hba1c',
    label: 'HbA1c / Glucose',
    value: '7.4%',
    status: 'HIGH',
    category: 'Glycemic',
    x: 350,
    y: 260,
    r: 36,
    description: '90-day average glycemia. Insulin resistance promotes hepatic lipogenesis, increasing both triglycerides and small dense LDL particles.',
    connectedTo: ['node-trig', 'node-tsh', 'node-vitd', 'node-crp']
  },
  {
    id: 'node-vitd',
    label: 'Vitamin D3 (25-OH)',
    value: '18.4 ng/mL',
    status: 'DEFICIENT',
    category: 'Micronutrient',
    x: 170,
    y: 280,
    r: 32,
    description: 'Vitamin D receptors exist on pancreatic beta cells and thyroid tissue. Deficiency directly blunts insulin secretion and worsens TSH antibody regulation.',
    connectedTo: ['node-tsh', 'node-hba1c', 'node-b12']
  },
  {
    id: 'node-b12',
    label: 'Vitamin B12',
    value: '215 pg/mL',
    status: 'BORDERLINE',
    category: 'Neurovascular',
    x: 100,
    y: 190,
    r: 28,
    description: 'Suboptimal cobalamin impairs homocysteine methylation and mitochondrial ATP production, compounding perceived fatigue.',
    connectedTo: ['node-vitd', 'node-crp']
  },
  {
    id: 'node-bp',
    label: 'Systolic BP',
    value: '124 mmHg',
    status: 'OPTIMAL',
    category: 'Hemodynamic',
    x: 370,
    y: 390,
    r: 30,
    description: 'Arterial hemodynamic pressure. Controlled blood pressure protects endothelial integrity from circulating oxidized LDL.',
    connectedTo: ['node-ldl', 'node-crp']
  },
  {
    id: 'node-crp',
    label: 'hs-CRP (Inflammation)',
    value: '0.85 mg/L',
    status: 'OPTIMAL',
    category: 'Inflammatory',
    x: 230,
    y: 390,
    r: 28,
    description: 'Low-grade systemic inflammation marker. Optimal CRP demonstrates healthy baseline vascular endothelium.',
    connectedTo: ['node-hba1c', 'node-bp', 'node-b12']
  }
];

export const BIOCHEMICAL_INTERACTIONS = [
  {
    id: 'link-tsh-ldl',
    source: 'node-tsh',
    target: 'node-ldl',
    label: 'Hepatic Clearance Inhibition',
    relationship: 'High TSH down-regulates hepatic LDL-receptor expression, directly slowing cholesterol clearance from blood.'
  },
  {
    id: 'link-vitd-tsh',
    source: 'node-vitd',
    target: 'node-tsh',
    label: 'Immunomodulatory Synergism',
    relationship: 'Vitamin D3 deficiency impairs thyroid peroxidase regulation and immune tolerance.'
  },
  {
    id: 'link-hba1c-trig',
    source: 'node-hba1c',
    target: 'node-trig',
    label: 'Hepatic Lipogenesis Surge',
    relationship: 'Elevated glucose and insulin resistance trigger hepatic VLDL packaging, causing high triglycerides.'
  },
  {
    id: 'link-vitd-hba1c',
    source: 'node-vitd',
    target: 'node-hba1c',
    label: 'Beta-Cell Insulin Secretion',
    relationship: 'Vitamin D3 binds to pancreatic nuclear receptors; deficiency decreases glucose-stimulated insulin release.'
  },
  {
    id: 'link-ldl-bp',
    source: 'node-ldl',
    target: 'node-bp',
    label: 'Endothelial Shear Stress',
    relationship: 'Elevated LDL can deposit in vascular intima, increasing peripheral arterial stiffness over time.'
  }
];
