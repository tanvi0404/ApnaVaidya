export const MICRONUTRIENTS_DATA = [
  {
    id: 'micro-vit-d',
    name: 'Vitamin D3 (25-Hydroxy)',
    category: 'Fat-Soluble Vitamin',
    currentValue: 18.4,
    unit: 'ng/mL',
    minOptimal: 30.0,
    maxOptimal: 70.0,
    status: 'DEFICIENT',
    physiologicalRole: 'Calcium absorption, bone mineralization, immune defense modulation, and serotonin regulation.',
    correlatedSymptoms: ['Persistent morning lethargy', 'Deep bone/shin aches', 'Frequent respiratory infections', 'Low mood / SAD'],
    dietarySources: {
      vegetarian: ['Fortified Cow Milk / Curd', 'Sun-Exposed White Button Mushrooms', 'Fortified Plant Milks'],
      vegan: ['UV-Treated Mushrooms', 'Fortified Soya / Almond Milk', 'Fortified Breakfast Cereals'],
      nonVeg: ['Egg Yolks (Pasture-Raised)', 'Wild Salmon / Mackerel', 'Cod Liver Oil']
    },
    supplementProtocol: 'Clinical loading dose: Cholecalciferol 60,000 IU oral capsule once weekly for 8 weeks with a fatty meal, followed by 60,000 IU once monthly maintenance.'
  },
  {
    id: 'micro-vit-b12',
    name: 'Vitamin B12 (Cobalamin)',
    category: 'Water-Soluble Vitamin',
    currentValue: 215,
    unit: 'pg/mL',
    minOptimal: 300,
    maxOptimal: 950,
    status: 'BORDERLINE_LOW',
    physiologicalRole: 'Myelin sheath maintenance, neurological nerve conduction, and red blood cell DNA synthesis.',
    correlatedSymptoms: ['Brain fog / memory lapses', 'Tingling / pins-and-needles in toes', 'Tongue soreness (glossitis)', 'Post-workout fatigue'],
    dietarySources: {
      vegetarian: ['Paneer (Cottage Cheese)', 'Greek Yogurt / Probiotic Dahi', 'Fortified Nutritional Yeast', 'Cow Milk'],
      vegan: ['Fortified Nutritional Yeast (Nooch)', 'Fortified Soy Milk', 'Fortified Cereals'],
      nonVeg: ['Eggs', 'Chicken Liver', 'Salmon / Tuna', 'Lean Mutton']
    },
    supplementProtocol: 'Methylcobalamin 1500 mcg sublingual tablet daily for 30 days to bypass gastrointestinal intrinsic factor limitations.'
  },
  {
    id: 'micro-ferritin',
    name: 'Serum Ferritin (Iron Reserve)',
    category: 'Essential Mineral',
    currentValue: 48,
    unit: 'ng/mL',
    minOptimal: 40,
    maxOptimal: 200,
    status: 'OPTIMAL',
    physiologicalRole: 'Intracellular protein storage for iron; essential for cellular respiration and hemoglobin synthesis.',
    correlatedSymptoms: ['None at current baseline reserves'],
    dietarySources: {
      vegetarian: ['Spinach (Palak) with Lemon Juice (Vit C)', 'Roasted Garden Cress Seeds (Aliv/Halim)', 'Black Raisins', 'Beetroot'],
      vegan: ['Lentils (Moong/Masoor)', 'Pumpkin Seeds', 'Spirulina', 'Pomegranate'],
      nonVeg: ['Chicken Breast', 'Egg Yolks', 'Fish Fillet']
    },
    supplementProtocol: 'Maintain dietary non-heme iron paired with Vitamin C (lemon/amla) to enhance bioavailability by up to 300%.'
  },
  {
    id: 'micro-calcium',
    name: 'Serum Calcium',
    category: 'Essential Mineral',
    currentValue: 9.4,
    unit: 'mg/dL',
    minOptimal: 8.8,
    maxOptimal: 10.2,
    status: 'OPTIMAL',
    physiologicalRole: 'Neuromuscular signaling, cardiac muscle contraction, and skeletal structural density.',
    correlatedSymptoms: ['None at current baseline'],
    dietarySources: {
      vegetarian: ['White Sesame Seeds (Til)', 'Curd & Paneer', 'Ragi (Finger Millet)', 'Almonds'],
      vegan: ['Ragi / Nachni Rotis', 'Sesame Seeds (Til Laddoo)', 'Tofu (Calcium-set)', 'Kale / Mustard Greens'],
      nonVeg: ['Canned Sardines with bones', 'Dairy products']
    },
    supplementProtocol: 'Adequate dietary intake via Ragi and Sesame seeds; prioritize Vitamin D co-factors for optimal intestinal uptake.'
  }
];

export const SUNLIGHT_GUIDELINES = {
  optimalTimeWindow: '08:00 AM - 10:00 AM (Early Morning Sun)',
  recommendedDurationMinutes: 18,
  uvIndexTarget: 'UV Index 3 to 5',
  mechanism: '7-Dehydrocholesterol in the dermal layer absorbs UVB photons (290-315 nm), synthesizing Previtamin D3 which isomerizes into active Cholecalciferol.',
  bestPractices: [
    'Expose arms, forearms, and legs without sunscreen for 15-20 minutes.',
    'Early morning light is rich in beneficial Near-Infrared (NIR) spectrum which stimulates mitochondrial ATP.',
    'Avoid midday intense scorching sun (UV Index > 8) without eye protection.'
  ]
};
