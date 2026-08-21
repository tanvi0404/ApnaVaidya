import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Sparkles, 
  Heart, 
  Info, 
  Droplet, 
  Activity, 
  CheckCircle2,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Flame,
  Sun
} from 'lucide-react';
import { WOMENS_HEALTH_DATA } from '../../data/wellnessData';

export default function WomensHealthView({ activeProfile = {}, onSelectProfile = () => {} }) {
  const profileId = activeProfile?.id || 'default';
  const data = WOMENS_HEALTH_DATA[profileId] || WOMENS_HEALTH_DATA['default'];
  
  const [loggedSymptoms, setLoggedSymptoms] = useState(() => {
    return (data?.commonSymptoms || []).slice(0, 2);
  });

  const toggleSymptom = (sym) => {
    setLoggedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  // If user is viewing a Male profile, show helpful guidance and 1-click profile switch
  if (activeProfile?.gender !== 'Female') {
    return (
      <div className="card-white p-8 text-center space-y-5 max-w-lg mx-auto my-12 border-rose-200 bg-rose-50/40 animate-fadeIn">
        <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-soft-pink">
          <HeartHandshake className="w-7 h-7" />
        </div>
        
        <div>
          <span className="badge-pink text-[10px] font-bold uppercase tracking-wider">
            Biological Gender Profile Notice
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display mt-1">
            Women's Health & Hormonal Rhythm
          </h3>
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
            You are currently viewing the profile of <strong className="text-slate-900">{activeProfile?.name || 'User'}</strong> ({activeProfile?.gender || 'Male'}).
            This clinical module (menstrual tracking, ovulation forecasts, and estrogen/progesterone balance) is designed for female biological profiles in your family vault.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onSelectProfile('user-sunita')}
            className="btn-primary-pink text-xs py-2 px-4 shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch to Sunita Sharma (Mother • 58y)</span>
          </button>
        </div>
      </div>
    );
  }

  const isPostMenopausal = activeProfile?.age >= 50;
  const isPediatric = activeProfile?.age < 18;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/50 to-pink-50/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" /> WOMEN'S HEALTH & HORMONAL WELLNESS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name} ({activeProfile.age}y)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              {data.stage || 'Hormonal & Biological Wellness'}
            </h2>
          </div>

          <span className="badge-green text-xs font-bold">
            {isPostMenopausal ? 'Post-Menopause Phase' : isPediatric ? 'Pediatric Stage' : 'Regular 28-Day Rhythm'}
          </span>
        </div>
      </div>

      {/* Cycle Status & Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Phase Card */}
        <div className="card-white p-6 bg-gradient-to-br from-rose-500 to-brand-pink-600 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-100 font-extrabold block">
              Current Clinical Phase
            </span>
            <h3 className="text-2xl font-extrabold font-display mt-1">
              {data.currentPhase || 'Hormonal Equilibrium'}
            </h3>
            <p className="text-xs text-rose-100 mt-2 leading-relaxed">
              {data.phaseDescription}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-rose-100">
            <span>{isPostMenopausal ? 'Menopause Status:' : 'Next Period Due:'}</span>
            <strong className="text-white text-sm">{data.nextPeriodDate}</strong>
          </div>
        </div>

        {/* Fertile Window / Bone & Thyroid Health */}
        <div className="card-white p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            {isPostMenopausal ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Bone Mineral & Thyroid Focus
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5 text-brand-pink-500" />
                Ovulation & Fertile Forecast
              </>
            )}
          </h4>

          {isPostMenopausal ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">DEXA Bone Screening:</span>
                <p className="text-emerald-800">
                  Recommended annual DEXA scan to screen for osteopenia/osteoporosis.
                </p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs">
                <span className="font-bold text-rose-900 block mb-0.5">Thyroid Axis (TSH):</span>
                <p className="text-rose-800">
                  TSH 5.85 uIU/mL — maintain strict morning empty-stomach Thyroxine protocol.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Estimated Ovulation</span>
                <span className="badge-pink text-[10px] font-bold">Day 14</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">
                {data.ovulationDate || 'Mid-Cycle'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Fertile Window: {data.fertileWindow}
              </p>
            </div>
          )}

          {data.cycleLengthDays > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Typical Cycle Metrics:</span>
              <div className="flex justify-between text-slate-500">
                <span>Average Length:</span>
                <strong className="text-slate-800">{data.cycleLengthDays} Days</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Period Duration:</span>
                <strong className="text-slate-800">{data.periodDurationDays} Days</strong>
              </div>
            </div>
          )}
        </div>

        {/* Hormonal Nutrition & Energy */}
        <div className="card-white p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink-500" />
            Hormone-Sync Nutrition
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block mb-0.5">Recommended Foods:</span>
              <p className="text-emerald-800 font-medium">
                {(data.recommendedFoods || []).join(' • ')}
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block mb-0.5">Hydration & Electrolytes:</span>
              <p className="text-amber-800 font-medium">
                Increase magnesium-rich foods (pumpkin seeds, spinach) and drink warm ginger-cumin water.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Symptom Logger */}
      <div className="card-white p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-brand-pink-500" />
          {isPostMenopausal ? 'Log Daily Menopausal & Thyroid Symptoms' : 'Log Daily Hormonal & Premenstrual Symptoms'}
        </h4>

        <div className="flex flex-wrap gap-2.5">
          {(data.commonSymptoms || []).map((sym) => {
            const isLogged = loggedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isLogged
                    ? 'bg-rose-500 text-white shadow-soft-pink'
                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                {isLogged ? <CheckCircle2 className="w-4 h-4" /> : <Droplet className="w-3.5 h-3.5" />}
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Hormone Panels (if present) */}
      {data.hormonePanels && data.hormonePanels.length > 0 && (
        <div className="card-white p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Active Clinical Hormone & Biomarker Panels
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.hormonePanels.map((panel, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{panel.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    panel.status.includes('High') || panel.status.includes('Deficiency')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {panel.status}
                  </span>
                </div>
                <div className="text-base font-extrabold text-slate-800 font-display">
                  {panel.value}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {panel.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
