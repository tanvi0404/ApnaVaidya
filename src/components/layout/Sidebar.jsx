import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Bot, 
  Salad, 
  Dumbbell, 
  Pill, 
  Stethoscope, 
  FolderLock, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Moon, 
  HeartHandshake, 
  Calendar, 
  Watch, 
  FileCheck, 
  BookOpen, 
  HeartPulse, 
  TestTube2, 
  Sun,
  ShieldAlert,
  Scale,
  TrendingUp,
  Dna,
  Network,
  FlaskConical,
  Video,
  Layers,
  Utensils,
  Wind,
  Leaf,
  Sliders,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  activeProfile,
  reportsCount = 5,
  pendingMedsCount = 1,
  mobileOpen = false,
  onCloseMobile = () => {}
}) {
  const coreNavItems = [
    { id: 'dashboard', label: 'Health Dashboard', icon: LayoutDashboard, badge: null, color: 'green' },
    { id: 'reports', label: 'Medical Reports & OCR', icon: FileSpreadsheet, badge: `${reportsCount} Reports`, color: 'green' },
    { id: 'simulation', label: 'What-If Lifestyle Simulator', icon: Sliders, badge: '3-Yr Curve', color: 'green' },
    { id: 'ayurveda', label: 'Ayurveda & Herb Safety', icon: Leaf, badge: 'Prakriti', color: 'green' },
    { id: 'exposome', label: 'AQI & Heat Exposome Shield', icon: Wind, badge: 'Air & Heat', color: 'green' },
    { id: 'organs', label: 'Organ Health Heatmap', icon: Layers, badge: 'Full Body', color: 'green' },
    { id: 'microbiome', label: 'Gut Microbiome & Fasting', icon: Utensils, badge: 'SCFA / Clock', color: 'green' },
    { id: 'teleconsult', label: 'Insurance & Teleconsult', icon: Video, badge: 'HD Room / TPA', color: 'green' },
    { id: 'graph', label: 'Biomarker Knowledge Graph', icon: Network, badge: 'Cross-Talk', color: 'green' },
    { id: 'chat', label: 'Chikitsak AI Assistant', icon: Bot, badge: 'RAG Rationale', color: 'pink' },
    { id: 'genomics', label: 'Pharmacogenomics (PGx)', icon: FlaskConical, badge: 'Drug-Gene', color: 'green' },
    { id: 'longevity', label: 'Longevity & Healthspan', icon: Dna, badge: 'Age Velocity', color: 'green' },
    { id: 'vascular', label: 'Vascular & Glucose Curves', icon: TrendingUp, badge: 'ePWV / GLUT-4', color: 'pink' },
    { id: 'risk', label: 'Clinical Risk Calculators', icon: HeartPulse, badge: 'ASCVD/IDRS', color: 'pink' },
    { id: 'packages', label: 'Diagnostic Packages', icon: TestTube2, badge: 'NABL Labs', color: 'green' },
    { id: 'nutrition', label: 'Nutrition & Recipes', icon: Salad, badge: null, color: 'green' },
    { id: 'exercise', label: 'Exercise & Movement', icon: Dumbbell, badge: null, color: 'green' },
    { id: 'medications', label: 'Medications & Adherence', icon: Pill, badge: pendingMedsCount > 0 ? `${pendingMedsCount} Due` : null, badgeType: 'pink', color: 'pink' },
    { id: 'doctors', label: 'Doctor Visit Summary', icon: Stethoscope, badge: 'Prep PDF', color: 'green' }
  ];

  const clinicalToolItems = [
    { id: 'emergency', label: 'Emergency & First-Aid', icon: ShieldAlert, badge: '108 / CPR', color: 'pink' },
    { id: 'converters', label: 'Unit Converter & GI Index', icon: Scale, badge: 'SI ↔ mg/dL', color: 'green' },
    { id: 'micronutrients', label: 'Micronutrients & Vitamins', icon: Sun, badge: 'Sunlight', color: 'green' }
  ];

  const specializedNavItems = [
    { id: 'timeline', label: 'Health Timeline', icon: Calendar, badge: 'History', color: 'green' },
    { id: 'wearables', label: 'Wearable Biometrics', icon: Watch, badge: 'Live Sync', color: 'green' },
    { id: 'summarizer', label: 'Document Summarizer', icon: FileCheck, badge: 'OPD / Discharge', color: 'green' },
    { id: 'vault', label: 'Health Vault & Records', icon: FolderLock, badge: null, color: 'green' },
    { id: 'feed', label: 'Doctor-Reviewed Feed', icon: BookOpen, badge: null, color: 'green' },
    { id: 'symptoms', label: 'Symptom Checker', icon: Activity, badge: 'Triage', color: 'pink' },
    { id: 'womens_health', label: "Women's Health", icon: HeartHandshake, badge: 'Hormones', color: 'pink' },
    { id: 'wellness', label: 'Sleep & Daily Habits', icon: Moon, badge: null, color: 'green' },
    { id: 'security', label: 'Security & Audit Vault', icon: ShieldCheck, badge: 'HIPAA/GDPR', color: 'green' }
  ];

  const renderNavGroup = (title, items) => (
    <div className="space-y-1">
      <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl font-semibold text-xs transition-all text-left group ${
                isActive
                  ? 'bg-brand-green-50 text-brand-green-950 font-extrabold border border-brand-green-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                <div className={`p-1.5 rounded-xl transition-colors flex-shrink-0 ${
                  isActive 
                    ? 'bg-brand-green-600 text-white shadow-xs' 
                    : 'text-slate-400 group-hover:text-slate-700 bg-slate-100 group-hover:bg-brand-green-50'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  item.badgeType === 'pink' || item.color === 'pink'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 lg:sticky lg:top-16 w-80 bg-white border-r border-[#E3ECE6] flex flex-col shrink-0 h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Active Profile Header Pill */}
        <div className="p-3.5 border-b border-slate-100 bg-gradient-to-r from-brand-green-50/70 to-brand-pink-50/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${activeProfile.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0`}>
              {activeProfile.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-extrabold text-slate-900 truncate">
                  {activeProfile.name}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white text-brand-green-800 border border-brand-green-200 flex-shrink-0">
                  {activeProfile.relationship}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {activeProfile.age}y • {activeProfile.bloodGroup} • {activeProfile.weight}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 p-2.5 space-y-4 overflow-y-auto custom-scrollbar">
          {renderNavGroup('Core Modules', coreNavItems)}
          {renderNavGroup('Clinical & Emergency Tools', clinicalToolItems)}
          {renderNavGroup('Specialized Care & Vault', specializedNavItems)}
        </div>

        {/* Educational Disclaimer Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 m-2 rounded-2xl text-[11px] text-slate-500 leading-tight shrink-0">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
            <Sparkles className="w-3 h-3 text-brand-green-600" />
            <span>Educational Guidance</span>
          </div>
          <p className="text-[10px] text-slate-500">
            ApnaVaidya provides informational health analysis. Always consult a clinician for medical decisions.
          </p>
        </div>

      </aside>
    </>
  );
}
