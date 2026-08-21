import React, { useState } from 'react';
import { 
  Wind, 
  Sun, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Zap, 
  Info,
  Clock
} from 'lucide-react';
import { 
  INDIAN_CITIES_AQI, 
  POLLUTANT_REFERENCE_STANDARDS, 
  CLINICAL_EXPOSOME_PROTOCOLS,
  CALCULATE_HEAT_INDEX
} from '../../data/exposomeData';
import { fetchExposomeCityBackend } from '../../services/apiClient';

export default function EnvironmentalExposomeView({ activeProfile }) {
  const [selectedCityId, setSelectedCityId] = useState('city-delhi');
  const [activeSubTab, setActiveSubTab] = useState('aqi'); // 'aqi' | 'heat'
  const [backendExposome, setBackendExposome] = useState(null);

  const currentCity = INDIAN_CITIES_AQI.find(c => c.id === selectedCityId) || INDIAN_CITIES_AQI[0];
  const heatIndexResult = CALCULATE_HEAT_INDEX(currentCity.temp, currentCity.humidity);

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    fetchExposomeCityBackend(currentCity.name).then(res => {
      if (isMounted && res) {
        setBackendExposome(res);
      }
    }).catch(err => console.warn('Exposome client fallback:', err));

    return () => { isMounted = false; };
  }, [currentCity.name]);

  // Determine patient vulnerability multiplier
  const isVulnerable = activeProfile.age >= 60 || activeProfile.id === 'user-rajesh';

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & City Switcher */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Wind className="w-3.5 h-3.5 text-emerald-600" /> ENVIRONMENTAL EXPOSOME & AQI SHIELD
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Air Quality, Thermal Strain & Respiratory Shield
            </h2>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-800 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer"
            >
              {INDIAN_CITIES_AQI.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name} (AQI {city.aqi})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveSubTab('aqi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'aqi'
                ? 'bg-brand-green-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Air Quality & Particulate Shield
          </button>
          <button
            onClick={() => setActiveSubTab('heat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'heat'
                ? 'bg-brand-green-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Heat Index & Hydration Vulnerability
          </button>
        </div>
      </div>

      {activeSubTab === 'aqi' ? (
        /* Air Quality & Particulate Shield Sub-View */
        <div className="space-y-6">
          
          {/* Top Live AQI Card */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl space-y-6 shadow-xl border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  currentCity.aqi > 200 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  currentCity.aqi > 100 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                    Live Ambient Air Quality • {currentCity.name}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                    Air Quality Index (AQI): {currentCity.aqi}
                  </h3>
                </div>
              </div>

              <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                currentCity.aqi > 200 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                currentCity.aqi > 100 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {currentCity.status}
              </span>
            </div>

            {/* Particulate Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PM 2.5 (Fine Particulate)</span>
                <div className="text-2xl font-black text-rose-400 mt-1">{currentCity.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                <span className="text-[10px] text-slate-400 block mt-0.5">NAAQS Safe: &lt; 30</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PM 10 (Coarse Dust)</span>
                <div className="text-2xl font-black text-amber-300 mt-1">{currentCity.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                <span className="text-[10px] text-slate-400 block mt-0.5">NAAQS Safe: &lt; 60</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">NO₂ (Nitrogen Dioxide)</span>
                <div className="text-2xl font-black text-teal-300 mt-1">{currentCity.no2} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                <span className="text-[10px] text-slate-400 block mt-0.5">NAAQS Safe: &lt; 40</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Ozone (O₃ Ground)</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">{currentCity.o3} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                <span className="text-[10px] text-slate-400 block mt-0.5">NAAQS Safe: &lt; 100</span>
              </div>
            </div>

            {/* Patient Clinical Vulnerability Alert */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-300 block">
                  Patient Health Multiplier for {activeProfile.name} ({activeProfile.age}y):
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {currentCity.clinicalWarning} Inhaled fine particulates (PM2.5) enter deep alveolar micro-vessels, triggering oxidative stress and systemic vascular resistance.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Clinical Exposome Action Protocols */}
          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                4-Pillar Clinical Air Quality Action Protocol
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-based respiratory barrier, airway clearance, and antioxidant protocols to shield organs from environmental toxins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLINICAL_EXPOSOME_PROTOCOLS.map((proto, idx) => (
                <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2 flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-xl bg-brand-green-100 text-brand-green-800 font-extrabold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">{proto.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {proto.rationale}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium">
                    <strong className="text-emerald-900 block mb-0.5">Recommended Action:</strong>
                    {proto.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Heat Index & Hydration Vulnerability Sub-View */
        <div className="space-y-6">
          
          {/* Thermal Strain Banner */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-3xl space-y-6 shadow-xl border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                    Climatic Heat Index & Wet-Bulb Strain • {currentCity.name}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                    Feels Like: {heatIndexResult.feelsLikeC}°C
                  </h3>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Risk: {heatIndexResult.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ambient Dry Temperature</span>
                <div className="text-3xl font-black text-white mt-1">{currentCity.temp}°C</div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Relative Humidity</span>
                <div className="text-3xl font-black text-teal-300 mt-1">{currentCity.humidity}%</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Impairs sweat evaporation</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Peak UV Radiation Index</span>
                <div className="text-3xl font-black text-amber-400 mt-1">{currentCity.uvIndex} <span className="text-xs font-normal text-slate-400">/ 11</span></div>
                <span className="text-[10px] text-slate-400 block mt-0.5">High UV Skin Exposure</span>
              </div>
            </div>

            {/* Hydration Guidance Card */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Droplets className="w-4 h-4" />
                <span>Target Electrolyte & Fluid Intake for {activeProfile.name}:</span>
              </div>
              <p className="text-slate-200 text-sm font-semibold">
                {heatIndexResult.hydrationRec}
              </p>
              <p className="text-slate-400 text-xs">
                {heatIndexResult.advisory}
              </p>
            </div>
          </div>

          {/* Traditional Indian Electrolyte Formulations */}
          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                Natural Indian Electrolyte Formulations
              </h3>
              <p className="text-xs text-slate-500">
                Replenishes potassium, sodium, and magnesium lost through evaporative thermal strain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">🌴 Tender Coconut Water</h4>
                <p className="text-xs text-slate-600">
                  Rich in bioavailable potassium (approx. 600mg per 250ml) and natural electrolytes without added sucrose.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">🥛 Spiced Chaas (Rock Salt + Cumin)</h4>
                <p className="text-xs text-slate-600">
                  Delivers sodium, calcium, and lactic cultures to cool the stomach and prevent muscle cramping.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">🍋 Shikanji with Pink Salt & Mint</h4>
                <p className="text-xs text-slate-600">
                  Provides Vitamin C and essential sodium to restore cellular osmotic pressure during high-heat hours.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
