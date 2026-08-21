export const INDIAN_CITIES_AQI = [
  {
    id: 'city-delhi',
    name: 'Delhi NCR',
    aqi: 284,
    status: 'POOR / UNHEALTHY',
    statusColor: 'rose',
    pm25: 134, // ug/m3
    pm10: 218,
    no2: 48,
    o3: 38,
    temp: 34, // Celsius
    humidity: 68, // %
    uvIndex: 7.2,
    clinicalWarning: 'Severe particulate load ($PM_{2.5}$). High risk of endothelial microvascular inflammation and bronchospasm.'
  },
  {
    id: 'city-mumbai',
    name: 'Mumbai',
    aqi: 142,
    status: 'MODERATE',
    statusColor: 'amber',
    pm25: 56,
    pm10: 112,
    no2: 32,
    o3: 24,
    temp: 32,
    humidity: 82,
    uvIndex: 8.5,
    clinicalWarning: 'Elevated humidity with moderate particulate suspension. High wet-bulb thermal strain.'
  },
  {
    id: 'city-bengaluru',
    name: 'Bengaluru',
    aqi: 68,
    status: 'SATISFACTORY / GOOD',
    statusColor: 'emerald',
    pm25: 22,
    pm10: 48,
    no2: 18,
    o3: 20,
    temp: 26,
    humidity: 62,
    uvIndex: 6.0,
    clinicalWarning: 'Optimal air quality for outdoor aerobic cardio and natural ventilation.'
  },
  {
    id: 'city-hyderabad',
    name: 'Hyderabad',
    aqi: 115,
    status: 'MODERATE',
    statusColor: 'amber',
    pm25: 42,
    pm10: 92,
    no2: 28,
    o3: 22,
    temp: 30,
    humidity: 70,
    uvIndex: 7.8,
    clinicalWarning: 'Mild particulate elevation; sensitive groups should limit intense outdoor workouts during rush hours.'
  },
  {
    id: 'city-kolkata',
    name: 'Kolkata',
    aqi: 198,
    status: 'MODERATE-POOR',
    statusColor: 'rose',
    pm25: 88,
    pm10: 164,
    no2: 39,
    o3: 30,
    temp: 33,
    humidity: 78,
    uvIndex: 8.0,
    clinicalWarning: 'High particulate and nitrogen dioxide exposure. Protect vulnerable elderly and pediatric airways.'
  },
  {
    id: 'city-chennai',
    name: 'Chennai',
    aqi: 88,
    status: 'SATISFACTORY',
    statusColor: 'emerald',
    pm25: 30,
    pm10: 64,
    no2: 20,
    o3: 25,
    temp: 33,
    humidity: 80,
    uvIndex: 9.1,
    clinicalWarning: 'High coastal humidity and UV Index. Ensure frequent electrolyte hydration.'
  }
];

export const POLLUTANT_REFERENCE_STANDARDS = [
  { name: 'PM2.5 (Fine Particulate)', standard: '< 30 µg/m³ (NAAQS)', impact: 'Infiltrates deep into alveoli and enters blood circulation, promoting systemic plaque inflammation.' },
  { name: 'PM10 (Coarse Particulate)', standard: '< 60 µg/m³ (NAAQS)', impact: 'Irritates upper respiratory tract, inducing cough, wheezing, and allergic rhinitis flare-ups.' },
  { name: 'NO2 (Nitrogen Dioxide)', standard: '< 40 µg/m³ (NAAQS)', impact: 'Combustion byproduct that increases airway responsiveness in asthma and hyper-reactive lung diseases.' },
  { name: 'Ozone (O3 Ground-level)', standard: '< 100 µg/m³ (NAAQS)', impact: 'Potent oxidizing agent that blunts forced expiratory volume (FEV1) and damages bronchial cilia.' }
];

export const CLINICAL_EXPOSOME_PROTOCOLS = [
  {
    title: 'N95 / FFP2 Respiratory Barrier',
    icon: 'Shield',
    rationale: 'Filters >= 95% of airborne particulates down to 0.3 microns, preventing microvascular platelet activation.',
    action: 'Wear snug-fitting N95 mask when AQI exceeds 150 during daily commutes.'
  },
  {
    title: 'Indoor HEPA Air Purification',
    icon: 'Wind',
    rationale: 'Maintains particulate PM2.5 levels below 15 µg/m³ inside living and sleeping zones for nocturnal airway recovery.',
    action: 'Run True HEPA filtration in bedrooms during nighttime sleep with sealed windows.'
  },
  {
    title: 'Ayurvedic & Clinical Airway Clearance (Jala Neti & Steam)',
    icon: 'Droplets',
    rationale: 'Isotonic saline nasal wash clears adhered particulate crusts and restores mucociliary clearance velocity.',
    action: 'Perform evening warm saline rinse or eucalyptus steam inhalation after high exposure days.'
  },
  {
    title: 'Dietary Antioxidant Defense (Sulforaphane & Curcumin)',
    icon: 'Zap',
    rationale: 'Upregulates Nrf2 phase-II detox pathways to neutralize free radicals from inhaled environmental hydrocarbons.',
    action: 'Consume broccoli sprouts, turmeric with black pepper (curcumin+piperine), and amla (Vitamin C).'
  }
];

export function CALCULATE_HEAT_INDEX(tempC, humidity) {
  // Formula for Heat Index approximation (Rothfusz regression)
  const T = (tempC * 9/5) + 32; // Fahrenheit
  const R = humidity;
  
  let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (R * 0.094));
  
  if (HI >= 80) {
    HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R
      - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R
      + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  }

  const feelsLikeC = Math.round((HI - 32) * 5/9);
  
  let riskLevel = 'LOW';
  let hydrationRec = '2.5 - 3.0 Liters daily with regular water intake.';
  let advisory = 'Comfortable climatic conditions for outdoor activities.';

  if (feelsLikeC >= 41) {
    riskLevel = 'DANGER / HEAT EXHAUSTION';
    hydrationRec = '3.5 - 4.2 Liters + 1 Sachet WHO-ORS or Coconut Water. Electrolyte loss is rapid.';
    advisory = 'High risk of heat cramps and heat exhaustion. Avoid direct sun between 11:30 AM and 4:00 PM.';
  } else if (feelsLikeC >= 35) {
    riskLevel = 'EXTREME CAUTION';
    hydrationRec = '3.0 - 3.8 Liters with lemon water + pinch of pink Himalayan salt.';
    advisory = 'Heat fatigue is possible with prolonged physical exertion and humidity.';
  } else if (feelsLikeC >= 29) {
    riskLevel = 'CAUTION';
    hydrationRec = '2.8 - 3.2 Liters daily.';
    advisory = 'Slight thermal strain; stay well hydrated during workouts.';
  }

  return {
    feelsLikeC,
    riskLevel,
    hydrationRec,
    advisory
  };
}
