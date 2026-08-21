export const PRAKRITI_QUESTIONS = [
  {
    id: 'q1',
    question: 'Physical Body Frame & Build',
    options: [
      { text: 'Thin, slender, prominent joints, difficulty gaining weight', dosha: 'VATA' },
      { text: 'Medium build, athletic, well-proportioned musculature', dosha: 'PITTA' },
      { text: 'Broad, sturdy, solid bone structure, tendency to gain weight', dosha: 'KAPHA' }
    ]
  },
  {
    id: 'q2',
    question: 'Skin Texture & Temperature',
    options: [
      { text: 'Dry, rough, cool to touch, easily chapped in winter', dosha: 'VATA' },
      { text: 'Warm, slightly oily, prone to redness, moles, or acne', dosha: 'PITTA' },
      { text: 'Thick, smooth, cool, oily, well-hydrated and radiant', dosha: 'KAPHA' }
    ]
  },
  {
    id: 'q3',
    question: 'Appetite & Digestive Pattern (Agni)',
    options: [
      { text: 'Variable, irregular hunger; tendency towards gas/bloating (Vishamagni)', dosha: 'VATA' },
      { text: 'Strong, intense hunger; easily irritable if meals are delayed (Tikshnagni)', dosha: 'PITTA' },
      { text: 'Slow, steady appetite; can skip meals easily without discomfort (Mandagni)', dosha: 'KAPHA' }
    ]
  },
  {
    id: 'q4',
    question: 'Sleep Quality & Dreams',
    options: [
      { text: 'Light, interrupted sleep; active dreams involving movement or flying', dosha: 'VATA' },
      { text: 'Moderate, sound sleep (6-7 hrs); vivid, colorful, passionate dreams', dosha: 'PITTA' },
      { text: 'Deep, heavy, prolonged sleep (8+ hrs); difficulty waking up in the morning', dosha: 'KAPHA' }
    ]
  },
  {
    id: 'q5',
    question: 'Response to Stress & Climate',
    options: [
      { text: 'Tendency towards anxiety, worry, restlessness; dislikes cold & wind', dosha: 'VATA' },
      { text: 'Tendency towards frustration, impatience, anger; dislikes heat & sun', dosha: 'PITTA' },
      { text: 'Calm, steady, resistant to stress; dislikes damp, cloudy, cold weather', dosha: 'KAPHA' }
    ]
  }
];

export const DOSHA_PROFILES = {
  'VATA': {
    name: 'Vata (Air + Ether)',
    element: 'Movement, Nerve Transmission, Circulation',
    primaryQualities: 'Light, Cold, Dry, Rough, Mobile',
    imbalanceSigns: 'Joint stiffness, dry skin, insomnia, anxiety, constipation',
    dietaryFocus: 'Warm, cooked, unctuous foods (ghee, sesame oil), root vegetables, warming spices (ginger, cinnamon, cardamom). Minimize raw dry salads.',
    lifestyleTip: 'Follow a consistent daily routine (*Dinacharya*), perform daily warm sesame oil massage (*Abhyanga*), and prioritize restful sleep.'
  },
  'PITTA': {
    name: 'Pitta (Fire + Water)',
    element: 'Metabolism, Digestion, Thermoregulation',
    primaryQualities: 'Hot, Sharp, Light, Slightly Oily',
    imbalanceSigns: 'Hyperacidity, inflammatory skin flare-ups, irritability, excessive body heat',
    dietaryFocus: 'Cooling, sweet, bitter, and astringent foods (cucumber, coconut water, ghee, fennel, coriander). Reduce deep-fried, chili, and sour foods.',
    lifestyleTip: 'Avoid direct midday sun, practice cooling Pranayama (*Sheetali / Sheetkari*), and spend time near water or green nature.'
  },
  'KAPHA': {
    name: 'Kapha (Earth + Water)',
    element: 'Structure, Lubrication, Cellular Immunity',
    primaryQualities: 'Heavy, Slow, Cool, Oily, Stable',
    imbalanceSigns: 'Weight gain, lethargy, morning sinus congestion, sluggish digestion',
    dietaryFocus: 'Light, warm, pungent, bitter foods (millets, moong dal, ginger, black pepper, turmeric). Reduce heavy dairy and refined sweets.',
    lifestyleTip: 'Engage in vigorous daily morning exercise, practice dry brushing (*Garshana*), and wake up before sunrise (6:00 AM).'
  }
};

export const HERB_DRUG_INTERACTIONS = [
  {
    id: 'herb-ashwa',
    herbName: 'Ashwagandha (Withania somnifera)',
    category: 'Adaptogen & Neuro-Endocrine',
    linkedAllopathicClass: 'Thyroid Hormones & Sedatives/Benzodiazepines',
    safetyLevel: 'MODERATE_MONITOR',
    clinicalMechanism: 'Ashwagandha naturally stimulates T3/T4 thyroid hormone synthesis and enhances central GABAergic signaling.',
    clinicalAdvice: 'If taking Levothyroxine or anti-anxiety medications, monitor thyroid levels and consult your physician before co-administering.'
  },
  {
    id: 'herb-guggulu',
    herbName: 'Shuddha Guggulu (Commiphora mukul)',
    category: 'Lipid & Anti-Inflammatory',
    linkedAllopathicClass: 'Blood Thinners (Aspirin, Warfarin, Clopidogrel) & Statins',
    safetyLevel: 'CAUTION_SPACING',
    clinicalMechanism: 'Contains guggulsterones with mild anti-platelet and thyroid-activating actions.',
    clinicalAdvice: 'Discontinue 2 weeks prior to elective surgeries. Take at least 3 hours apart from synthetic statins.'
  },
  {
    id: 'herb-triphala',
    herbName: 'Triphala (Amla + Haritaki + Bibhitaki)',
    category: 'Digestive & Gentle Colon Cleanser',
    linkedAllopathicClass: 'Metformin & Oral Hypoglycemic Agents',
    safetyLevel: 'SAFE_SYNERGISTIC',
    clinicalMechanism: 'Rich in polyphenols and tannins that enhance peripheral insulin sensitivity and modulate gut microbiota.',
    clinicalAdvice: 'Safe and supportive when taken at bedtime with warm water. Synergizes with lifestyle glycemic control.'
  },
  {
    id: 'herb-brahmi',
    herbName: 'Brahmi (Bacopa monnieri)',
    category: 'Medhya Rasayana (Nootropic)',
    linkedAllopathicClass: 'Antidepressants (SSRIs) & Sedatives',
    safetyLevel: 'SAFE_COGNITIVE',
    clinicalMechanism: 'Bacosides promote synaptic transmission and cholinergic neurotransmission with adaptogenic stress buffering.',
    clinicalAdvice: 'Safe for daily cognitive support. Take with a small amount of warm milk or ghee for optimal lipophilic absorption.'
  }
];

export const AGNI_THERAPEUTICS = [
  {
    type: 'Vishamagni (Irregular / Bloating Agni)',
    solution: 'Cumin-Coriander-Fennel (CCF) Warm Infusion',
    recipe: 'Boil 1/2 tsp each of Jeera, Dhaniya, and Saunf in 500ml water for 5 mins. Sip throughout the afternoon.',
    benefit: 'Soothes intestinal spasms and expels trapped digestive air without overheating.'
  },
  {
    type: 'Tikshnagni (Sharp / Acidic Agni)',
    solution: 'Fennel, Cardamom & Mint Cooling Digestive Tonic',
    recipe: 'Infuse crushed green cardamom and saunf in lukewarm water with fresh mint leaves.',
    benefit: 'Pacifies excess gastric heat (Pitta) and neutralizes burning esophageal sensations.'
  },
  {
    type: 'Mandagni (Sluggish / Heavy Agni)',
    solution: 'Fresh Ginger-Rock Salt Appetizer (*Adrak-Lavana*)',
    recipe: 'Chew a thin slice of fresh ginger sprinkled with pink rock salt and 2 drops of lemon 10 mins before meals.',
    benefit: 'Stimulates salivary amylase and gastric hydrochloric acid secretion to ignite digestion.'
  }
];
