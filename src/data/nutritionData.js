export const RECIPES_DATA = [
  {
    id: 'rec-1',
    title: 'Moong Dal & Palak Chilla',
    category: 'High Protein',
    cuisine: 'Indian',
    imageType: 'chilla',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: 2,
    calories: 220,
    macros: {
      protein: '14g',
      carbs: '28g',
      fats: '4g',
      fiber: '7g'
    },
    tags: ['High Protein', 'Diabetic-Friendly', 'Heart Healthy', 'Vegetarian', 'Gluten-Free'],
    description: 'Savory yellow moong lentils crepe blended with fresh baby spinach, ginger, and cumin. High in plant protein and soluble fiber.',
    healthBenefits: [
      'Low Glycemic Index prevents post-meal blood sugar spikes.',
      'Packed with folate, iron, and bioavailable plant protein.',
      'Supports healthy cholesterol regulation.'
    ],
    ingredients: [
      '1 cup Yellow Moong Dal (soaked for 2 hours)',
      '1 cup Fresh Spinach (Palak), finely chopped',
      '1 green chili & 1 inch ginger',
      '1/2 tsp Cumin seeds (Jeera)',
      '1/4 tsp Turmeric powder',
      '1 tsp Cold-pressed sesame or olive oil for cooking',
      'Pinch of Himalayan pink salt'
    ],
    instructions: [
      'Drain soaked moong dal and grind with ginger, green chili, and minimal water into a smooth batter.',
      'Fold in finely chopped fresh spinach, cumin seeds, turmeric, and pink salt.',
      'Heat a non-stick or cast iron skillet on medium flame and lightly brush with oil.',
      'Pour a ladle of batter and spread into a round crepe.',
      'Cook for 2-3 minutes until golden and crisp, flip and cook the other side.',
      'Serve hot with fresh mint coriander chutney.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Methi & Oats Diabetic Khichdi',
    category: 'Diabetic-Friendly',
    cuisine: 'Indian',
    imageType: 'khichdi',
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 2,
    calories: 290,
    macros: {
      protein: '12g',
      carbs: '42g',
      fats: '5g',
      fiber: '9g'
    },
    tags: ['Diabetic-Friendly', 'Low GI', 'Heart Healthy', 'High Fiber', 'Vegetarian'],
    description: 'A comforting, gut-healing one-pot meal made with steel-cut oats, yellow moong, and fresh fenugreek (methi) leaves.',
    healthBenefits: [
      'Fenugreek contains 4-hydroxyisoleucine which stimulates glucose-dependent insulin secretion.',
      'Beta-glucan fiber from oats slows digestion and prevents glucose spikes.',
      'Gentle on the stomach and promotes gut microbiome balance.'
    ],
    ingredients: [
      '1/2 cup Rolled or Steel-cut Oats',
      '1/2 cup Yellow Moong Dal',
      '1 cup Fresh Fenugreek (Methi) leaves, washed & chopped',
      '1/2 cup Diced carrots & French beans',
      '1 tsp Ghee or Olive oil',
      '1/2 tsp Mustard seeds & Cumin seeds',
      '1/4 tsp Asafoetida (Hing) & Turmeric',
      '3.5 cups Water',
      'Salt to taste'
    ],
    instructions: [
      'Wash moong dal and soak for 15 minutes with oats.',
      'In a pressure cooker or pot, heat 1 tsp ghee. Add mustard seeds, cumin, and hing.',
      'Add chopped methi leaves and sauté for 2 minutes to remove bitterness.',
      'Add carrots, beans, turmeric, soaked dal, and oats. Pour in 3.5 cups of water.',
      'Cook on medium flame for 3 whistles (or simmer in pot for 20 mins until soft).',
      'Garnish with fresh coriander and serve with homemade probiotic curd.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Walnut & Flaxseed Heart Salad',
    category: 'Heart Healthy',
    cuisine: 'Mediterranean-Indian',
    imageType: 'salad',
    prepTime: '12 mins',
    cookTime: '0 mins',
    servings: 2,
    calories: 240,
    macros: {
      protein: '9g',
      carbs: '18g',
      fats: '14g',
      fiber: '8g'
    },
    tags: ['Heart Healthy', 'Omega-3 Dense', 'Low Sodium', 'Keto-Friendly'],
    description: 'Crisp mixed salad with Persian cucumbers, pomegranate pearls, toasted walnuts, and a roasted flaxseed-lemon dressing.',
    healthBenefits: [
      'Rich in Alpha-Linolenic Acid (ALA Omega-3) to reduce vascular inflammation.',
      'Pomegranate polyphenols help reduce LDL oxidation.',
      'Zero refined sugars or saturated fats.'
    ],
    ingredients: [
      '2 cups Baby salad greens / Lettuce / Arugula',
      '1 Cucumber, diced',
      '1/2 cup Pomegranate arils',
      '1/4 cup Toasted walnut halves',
      '1 tbsp Roasted ground Flaxseeds',
      '1 tbsp Extra virgin olive oil',
      '1 tbsp Fresh lemon juice',
      'Cracked black pepper & oregano'
    ],
    instructions: [
      'In a large salad bowl, combine salad greens, cucumber cubes, and pomegranate arils.',
      'In a small bowl, whisk extra virgin olive oil, lemon juice, roasted flaxseed powder, and black pepper.',
      'Toss the dressing gently over the greens.',
      'Top with toasted crunchy walnut halves before serving.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Grilled Paneer & Quinoa Power Bowl',
    category: 'High Protein',
    cuisine: 'Fusion',
    imageType: 'bowl',
    prepTime: '15 mins',
    cookTime: '15 mins',
    servings: 2,
    calories: 380,
    macros: {
      protein: '22g',
      carbs: '36g',
      fats: '13g',
      fiber: '6g'
    },
    tags: ['High Protein', 'Vegetarian', 'Muscle Recovery', 'Low GI'],
    description: 'Herb-marinated low-fat paneer cubes grilled to perfection and served over fluffy tri-color quinoa and roasted bell peppers.',
    healthBenefits: [
      '22g complete protein with all 9 essential amino acids for lean muscle support.',
      'Low sodium and rich in magnesium for blood pressure regulation.',
      'Sustained complex carbohydrate energy release.'
    ],
    ingredients: [
      '150g Low-fat Paneer, cubed',
      '1 cup Cooked Quinoa',
      '1 Bell Pepper (Red/Yellow), sliced',
      '1/2 cup Steamed broccoli florets',
      '1 tsp Olive oil',
      '1 tsp Mixed Italian herbs & smoked paprika',
      '1 tbsp Lemon-tahini drizzle',
      'Pinch of black salt'
    ],
    instructions: [
      'Marinate paneer cubes with herbs, smoked paprika, lemon juice, and a drop of olive oil for 10 minutes.',
      'Pan-sear paneer and bell peppers on a grill pan for 4-5 minutes until golden brown.',
      'Arrange warm cooked quinoa in bowls as the base.',
      'Layer with grilled paneer, peppers, and steamed broccoli.',
      'Drizzle with lemon-tahini dressing and serve warm.'
    ]
  },
  {
    id: 'rec-5',
    title: 'Karela & Jamun Seed Morning Smoothie',
    category: 'Diabetic-Friendly',
    cuisine: 'Ayurvedic Wellness',
    imageType: 'smoothie',
    prepTime: '5 mins',
    cookTime: '0 mins',
    servings: 1,
    calories: 85,
    macros: {
      protein: '3g',
      carbs: '14g',
      fats: '1g',
      fiber: '5g'
    },
    tags: ['Diabetic-Friendly', 'Ayurvedic', 'Detox', 'Low Calorie'],
    description: 'Targeted blood sugar balancing tonic with tender bitter gourd, fresh cucumber, mint, and a touch of roasted cumin.',
    healthBenefits: [
      'Contains Charantin and Polypeptide-p with natural insulin-mimicking properties.',
      'Helps lower early-morning fasting glucose.',
      'Promotes liver bile secretion.'
    ],
    ingredients: [
      '1 small Bitter Gourd (Karela), deseeded and chopped',
      '1 Cucumber, peeled and chopped',
      '10-12 Fresh Mint leaves',
      '1/2 inch Ginger root',
      '1 tbsp Fresh lemon juice',
      '1/4 tsp Roasted cumin powder',
      '1 cup Chilled coconut water or filtered water'
    ],
    instructions: [
      'Add chopped karela, cucumber, ginger, mint leaves, and coconut water to a blender.',
      'Blend on high speed until completely smooth.',
      'Strain through a mesh strainer if desired, or consume with natural fiber.',
      'Stir in lemon juice and roasted cumin powder. Drink fresh on an empty stomach.'
    ]
  }
];

export const PROFILE_MEAL_PLANS = {
  'user-arjun': {
    targetCalories: 2100,
    goal: 'Cardiovascular Health & LDL Reduction',
    macros: { protein: '95g (20%)', carbs: '260g (50%)', fats: '65g (30%)', fiber: '38g' },
    schedule: [
      {
        mealType: 'Breakfast (8:30 AM)',
        name: 'Moong Dal & Palak Chilla with Mint Chutney',
        calories: 340,
        protein: '16g',
        recipeId: 'rec-1',
        notes: 'High plant protein, zero saturated fat.'
      },
      {
        mealType: 'Lunch (1:15 PM)',
        name: 'Grilled Paneer & Quinoa Power Bowl + Sprout Salad',
        calories: 580,
        protein: '28g',
        recipeId: 'rec-4',
        notes: 'Complex carbs and high soluble fiber to bind cholesterol.'
      },
      {
        mealType: 'Snack (5:00 PM)',
        name: 'Walnut & Flaxseed Trail Mix + Green Tea',
        calories: 210,
        protein: '7g',
        recipeId: 'rec-3',
        notes: 'Rich in Omega-3 ALA to protect heart endothelium.'
      },
      {
        mealType: 'Dinner (8:00 PM)',
        name: 'Methi Oats Khichdi with Steamed Vegetables',
        calories: 420,
        protein: '15g',
        recipeId: 'rec-2',
        notes: 'Light evening digestion, finished 3 hours before sleep.'
      }
    ]
  },
  'user-rajesh': {
    targetCalories: 1750,
    goal: 'Glycemic Control & Blood Pressure Regulation',
    macros: { protein: '80g (20%)', carbs: '190g (45%)', fats: '55g (35%)', fiber: '42g' },
    schedule: [
      {
        mealType: 'Morning Tonic (7:30 AM)',
        name: 'Karela & Jamun Seed Morning Smoothie',
        calories: 85,
        protein: '3g',
        recipeId: 'rec-5',
        notes: 'Helps regulate fasting blood sugar levels.'
      },
      {
        mealType: 'Breakfast (8:45 AM)',
        name: 'Methi Missi Roti with Low-Fat Curd',
        calories: 310,
        protein: '14g',
        recipeId: 'rec-1',
        notes: 'Low glycemic index, slow carb breakdown.'
      },
      {
        mealType: 'Lunch (1:30 PM)',
        name: 'Methi & Oats Diabetic Khichdi + Cucumber Salad',
        calories: 440,
        protein: '18g',
        recipeId: 'rec-2',
        notes: 'High beta-glucan fiber suppresses glucose spikes.'
      },
      {
        mealType: 'Snack (5:15 PM)',
        name: 'Roasted Chana & Makhana (Foxnuts)',
        calories: 160,
        protein: '8g',
        recipeId: 'rec-3',
        notes: 'Low sodium, crunchy healthy evening snack.'
      },
      {
        mealType: 'Dinner (7:45 PM)',
        name: 'Tofu & Vegetable Stir Fry in Olive Oil',
        calories: 360,
        protein: '22g',
        recipeId: 'rec-4',
        notes: 'Light dinner with negligible glycemic impact.'
      }
    ]
  },
  'user-sunita': {
    targetCalories: 1600,
    goal: 'Thyroid Metabolism & Bone Mineral Density',
    macros: { protein: '75g (20%)', carbs: '200g (50%)', fats: '50g (30%)', fiber: '32g' },
    schedule: [
      {
        mealType: 'Breakfast (9:00 AM — 45m post-Thyroxine)',
        name: 'Moong Dal & Palak Chilla with Sesame Seeds',
        calories: 320,
        protein: '15g',
        recipeId: 'rec-1',
        notes: 'Calcium and plant protein to nourish thyroid function.'
      },
      {
        mealType: 'Lunch (1:15 PM)',
        name: 'Grilled Paneer & Quinoa Bowl with Steamed Beans',
        calories: 480,
        protein: '24g',
        recipeId: 'rec-4',
        notes: 'Selenium-rich ingredients to support T4 to T3 conversion.'
      },
      {
        mealType: 'Snack (5:00 PM)',
        name: 'Walnut & Pomegranate Salad Bowl',
        calories: 220,
        protein: '6g',
        recipeId: 'rec-3',
        notes: 'Anti-inflammatory antioxidants for joint comfort.'
      },
      {
        mealType: 'Dinner (8:00 PM)',
        name: 'Methi Oats Khichdi with Amla Chutney',
        calories: 380,
        protein: '14g',
        recipeId: 'rec-2',
        notes: 'Gentle on evening metabolism.'
      }
    ]
  }
};
