export const CLINICAL_CONVERTERS = [
  {
    id: 'conv-glucose',
    name: 'Blood Glucose / Sugar',
    conventionalUnit: 'mg/dL (US / India)',
    siUnit: 'mmol/L (UK / Europe / Canada)',
    convToSi: (val) => (val / 18.0182).toFixed(2),
    siToConv: (val) => (val * 18.0182).toFixed(0),
    defaultVal: 100,
    normalConventional: '70 - 99 mg/dL',
    normalSi: '3.9 - 5.5 mmol/L',
    notes: 'Standard conversion factor is 18.0. Fasting norm: 70-99 mg/dL (3.9-5.5 mmol/L).'
  },
  {
    id: 'conv-cholesterol',
    name: 'Total Cholesterol & LDL / HDL',
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    convToSi: (val) => (val / 38.67).toFixed(2),
    siToConv: (val) => (val * 38.67).toFixed(0),
    defaultVal: 200,
    normalConventional: '< 200 mg/dL',
    normalSi: '< 5.2 mmol/L',
    notes: 'Factor is 38.67 for cholesterol molecules (molecular weight 386.65 g/mol).'
  },
  {
    id: 'conv-triglycerides',
    name: 'Serum Triglycerides',
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    convToSi: (val) => (val / 88.57).toFixed(2),
    siToConv: (val) => (val * 88.57).toFixed(0),
    defaultVal: 150,
    normalConventional: '< 150 mg/dL',
    normalSi: '< 1.7 mmol/L',
    notes: 'Factor is 88.57 for triacylglycerol structure.'
  },
  {
    id: 'conv-hba1c',
    name: 'HbA1c Glycated Hemoglobin',
    conventionalUnit: '% (NGSP / DCCT)',
    siUnit: 'mmol/mol (IFCC)',
    convToSi: (val) => ((val - 2.15) * 10.929).toFixed(1),
    siToConv: (val) => ((val / 10.929) + 2.15).toFixed(1),
    defaultVal: 6.5,
    normalConventional: '< 5.7% (Normal), 5.7 - 6.4% (Prediabetes)',
    normalSi: '< 39 mmol/mol (Normal), 39 - 47 mmol/mol (Prediabetes)',
    notes: 'IFCC international standardized equation: IFCC = (NGSP - 2.15) * 10.929.'
  },
  {
    id: 'conv-creatinine',
    name: 'Serum Creatinine (Renal Function)',
    conventionalUnit: 'mg/dL',
    siUnit: 'µmol/L',
    convToSi: (val) => (val * 88.4).toFixed(1),
    siToConv: (val) => (val / 88.4).toFixed(2),
    defaultVal: 1.0,
    normalConventional: '0.7 - 1.3 mg/dL (Male), 0.6 - 1.1 mg/dL (Female)',
    normalSi: '62 - 115 µmol/L (Male), 53 - 97 µmol/L (Female)',
    notes: 'Multiplication factor is 88.4.'
  },
  {
    id: 'conv-vit-d',
    name: 'Vitamin D3 (25-OH)',
    conventionalUnit: 'ng/mL',
    siUnit: 'nmol/L',
    convToSi: (val) => (val * 2.496).toFixed(1),
    siToConv: (val) => (val / 2.496).toFixed(1),
    defaultVal: 30.0,
    normalConventional: '30.0 - 70.0 ng/mL',
    normalSi: '75.0 - 175.0 nmol/L',
    notes: 'Multiplication factor is 2.496.'
  },
  {
    id: 'conv-vit-b12',
    name: 'Vitamin B12 (Cobalamin)',
    conventionalUnit: 'pg/mL',
    siUnit: 'pmol/L',
    convToSi: (val) => (val * 0.738).toFixed(1),
    siToConv: (val) => (val / 0.738).toFixed(0),
    defaultVal: 400,
    normalConventional: '300 - 950 pg/mL',
    normalSi: '221 - 701 pmol/L',
    notes: 'Multiplication factor is 0.738.'
  }
];

export const INDIAN_GLYCEMIC_FOODS = [
  {
    id: 'food-1',
    name: 'Moong Dal (Cooked with Jeera)',
    category: 'Pulses & Lentils',
    gi: 29,
    giCategory: 'LOW',
    servingSize: '1 Bowl (150g)',
    carbsPerServing: 18,
    gl: 5.2,
    glCategory: 'LOW',
    impactTip: 'High soluble fiber and resistant starch blunt post-meal glucose absorption.'
  },
  {
    id: 'food-2',
    name: 'Chana / Chickpeas (Boiled / Chaat)',
    category: 'Pulses & Lentils',
    gi: 28,
    giCategory: 'LOW',
    servingSize: '1 Bowl (150g)',
    carbsPerServing: 22,
    gl: 6.1,
    glCategory: 'LOW',
    impactTip: 'Excellent protein-fiber ratio. Ideal afternoon snack for glycemic stability.'
  },
  {
    id: 'food-3',
    name: 'Ragi (Finger Millet) Roti',
    category: 'Millets & Breads',
    gi: 54,
    giCategory: 'LOW',
    servingSize: '1 Medium Roti (40g)',
    carbsPerServing: 24,
    gl: 12.9,
    glCategory: 'MEDIUM',
    impactTip: 'Rich in polyphenols and calcium. Much lower insulin spike than refined wheat maida.'
  },
  {
    id: 'food-4',
    name: 'Steel-Cut Rolled Oats with Seeds',
    category: 'Breakfast Cereals',
    gi: 52,
    giCategory: 'LOW',
    servingSize: '1 Bowl (150g cooked)',
    carbsPerServing: 26,
    gl: 13.5,
    glCategory: 'MEDIUM',
    impactTip: 'Beta-glucan forms a protective viscous gel in digestive tract.'
  },
  {
    id: 'food-5',
    name: 'Polished White Basmati Rice',
    category: 'Grains & Rice',
    gi: 73,
    giCategory: 'HIGH',
    servingSize: '1 Medium Bowl (150g)',
    carbsPerServing: 42,
    gl: 30.6,
    glCategory: 'HIGH',
    impactTip: 'High glycemic load. Pair with 2 bowls of dal and salad to lower overall meal GI.'
  },
  {
    id: 'food-6',
    name: 'Karela (Bitter Gourd) Sabzi',
    category: 'Vegetables',
    gi: 15,
    giCategory: 'LOW',
    servingSize: '1 Cup (100g)',
    carbsPerServing: 4,
    gl: 0.6,
    glCategory: 'LOW',
    impactTip: 'Contains charantin and polypeptide-p (plant insulin analogue).'
  },
  {
    id: 'food-7',
    name: 'Indian Alphonso Mango',
    category: 'Fruits',
    gi: 56,
    giCategory: 'MEDIUM',
    servingSize: '1/2 Fruit (100g)',
    carbsPerServing: 15,
    gl: 8.4,
    glCategory: 'LOW',
    impactTip: 'Moderate GI. Consume whole slices (never juiced) alongside a handful of walnuts.'
  },
  {
    id: 'food-8',
    name: 'Samosa / Fried Maida Snacks',
    category: 'Snacks & Sweets',
    gi: 78,
    giCategory: 'HIGH',
    servingSize: '1 Piece (80g)',
    carbsPerServing: 32,
    gl: 24.9,
    glCategory: 'HIGH',
    impactTip: 'Refined flour and trans-fat combination delays gastric emptying while spiking delayed insulin.'
  }
];
