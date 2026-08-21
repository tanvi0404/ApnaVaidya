export const GUT_MICROBIOME_PROFILE = {
  overallGutScore: 79,
  status: 'Good Diversity with Moderate Dysbiosis',
  floraDiversityIndex: '7.8 / 10 (Shannon Diversity Index)',
  firmicutesBacteroidetesRatio: '1.4 : 1 (Normal Balanced Range)',
  vagusNerveTone: 'Optimal (Serotonin Precursor Synthesis 84%)',
  keystoneSpecies: [
    {
      name: 'Akkermansia muciniphila',
      level: 'Optimal (2.8%)',
      role: 'Mucosal Barrier Protection',
      clinicalImpact: 'Strengthens gut lining tight junctions, preventing endotoxin (LPS) leakage and promoting natural GLP-1 release.'
    },
    {
      name: 'Bifidobacterium longum',
      level: 'Moderate (4.2%)',
      role: 'Immune Regulation & SCFA',
      clinicalImpact: 'Ferments dietary prebiotic fibers into acetate and lactate, lowering colonic pH to inhibit pathogen colonization.'
    },
    {
      name: 'Faecalibacterium prausnitzii',
      level: 'High (7.1%)',
      role: 'Primary Butyrate Producer',
      clinicalImpact: 'Major source of butyrate fuel for colonocytes; exerts powerful anti-inflammatory effects across the gut lining.'
    }
  ],
  scfaMeters: [
    { name: 'Butyrate (Colonic Energy & Anti-Inflammatory)', level: 82, target: '> 75', status: 'OPTIMAL' },
    { name: 'Acetate (Lipid Metabolism & Appetite Regulation)', level: 76, target: '> 70', status: 'OPTIMAL' },
    { name: 'Propionate (Hepatic Gluconeogenesis Suppression)', level: 68, target: '> 65', status: 'NORMAL' }
  ]
};

export const INDIAN_PREBIOTIC_FERMENTED_FOODS = [
  {
    id: 'food-chaas',
    name: 'Spiced Probiotic Buttermilk (Chaas / Mattha)',
    category: 'Live Fermented Dairy',
    strains: 'Lactobacillus bulgaricus, Streptococcus thermophilus',
    clinicalBenefits: 'Provides billions of live lactic acid bacteria, aids gastric cooling, and restores post-meal digestive motility with roasted jeera (cumin).',
    servingTip: 'Drink 200ml after lunch with roasted cumin, rock salt, and mint.'
  },
  {
    id: 'food-kanji',
    name: 'Traditional Probiotic Kanji (Black Carrot / Beetroot Ferment)',
    category: 'Lacto-Fermented Botanical',
    strains: 'Wild Lactobacillus plantarum & leuconostoc',
    clinicalBenefits: 'Rich in anthocyanin antioxidants and natural organic acids that promote colonic Bifidobacteria proliferation.',
    servingTip: 'Drink 100ml mid-morning as an active microbial tonic.'
  },
  {
    id: 'food-idli',
    name: 'Fermented Lentil & Rice Batter (Idli / Dosa)',
    category: 'Fermented Grain-Legume',
    strains: 'Leuconostoc mesenteroides, Lactobacillus fermentum',
    clinicalBenefits: 'Fermentation breaks down phytic acid antinutrients by 60%, significantly enhancing bioavailability of zinc, iron, and B-vitamins.',
    servingTip: 'Pair steamed idlis with coconut chutney and vegetable sambar.'
  },
  {
    id: 'food-isabgol',
    name: 'Psyllium Husk (Isabgol) & Flax Seeds',
    category: 'Viscous Soluble Prebiotic',
    strains: 'Fuel for Butyrate-Producing Bacteria',
    clinicalBenefits: 'Forms a gel matrix that slows carbohydrate absorption, feeds Faecalibacterium, and binds intestinal bile acids to lower LDL.',
    servingTip: 'Take 1 tbsp (5g) in warm water 20 minutes before dinner.'
  }
];

export const CIRCADIAN_CHRONO_SCHEDULE = [
  {
    timeWindow: '7:30 AM - 9:00 AM',
    mealName: 'Circadian Breakfast Window',
    metabolicState: 'Peak Insulin Sensitivity & Cortisol Alignment',
    recommendedFocus: 'High-Protein & Complex Fiber (Besan Chilla, Eggs, Sprouts, Oats). Insulin receptors on skeletal muscle are most receptive.',
    clinicalRationale: 'Eating carbs early ensures immediate muscular glucose uptake without high insulin spikes.'
  },
  {
    timeWindow: '12:30 PM - 2:00 PM',
    mealName: 'Primary Digestive Lunch Window',
    metabolicState: 'Peak Gastric Acid & Digestive Enzyme Output (Agni)',
    recommendedFocus: 'Largest Meal of the Day (Dal, Subzi, Millets, Probiotic Chaas). Bile acid synthesis and digestive enzymes reach circadian peak.',
    clinicalRationale: 'Heavy foods are digested and metabolized with minimal postprandial glycemic variability.'
  },
  {
    timeWindow: '7:00 PM - 8:30 PM',
    mealName: 'Sunset Dinner Window',
    metabolicState: 'Melatonin Rise & Declining Insulin Secretion',
    recommendedFocus: 'Light, Low-GI & High-Protein (Grilled Paneer/Tofu, Vegetable Moong Soup). Finish at least 2.5 hours before sleep.',
    clinicalRationale: 'Eating late when melatonin is elevated induces nocturnal insulin resistance and impairs sleep slow-wave architecture.'
  },
  {
    timeWindow: '8:30 PM - 8:30 AM',
    mealName: '12-to-13 Hour Circadian Fasting Window',
    metabolicState: 'Cellular Autophagy & Migrating Motor Complex (MMC)',
    recommendedFocus: 'Water & Herbal Chamomile Tea only. Enables digestive tract housekeeping and cellular cleanup.',
    clinicalRationale: 'Allows the Migrating Motor Complex (MMC) to clear residual colonic debris and stimulate cellular autophagy.'
  }
];
