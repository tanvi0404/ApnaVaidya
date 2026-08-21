import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import EmergencyModal from './components/layout/EmergencyModal';
import NotificationDrawer from './components/layout/NotificationDrawer';
import ReportUploadModal from './components/reports/ReportUploadModal';
import ReportAnalysisView from './components/reports/ReportAnalysisView';
import HealthDashboard from './components/dashboard/HealthDashboard';
import NutritionView from './components/nutrition/NutritionView';
import ExerciseView from './components/exercise/ExerciseView';
import ChikitsakChat from './components/chat/ChikitsakChat';
import MedicationManager from './components/medications/MedicationManager';
import DoctorsView from './components/doctors/DoctorsView';
import HealthVaultView from './components/vault/HealthVaultView';
import SymptomCheckerView from './components/wellness/SymptomCheckerView';
import WomensHealthView from './components/wellness/WomensHealthView';
import SleepWellnessView from './components/wellness/SleepWellnessView';
import SecurityAuditView from './components/security/SecurityAuditView';
import HealthTimelineView from './components/timeline/HealthTimelineView';
import WearablesView from './components/wearables/WearablesView';
import DocumentSummarizerView from './components/summarizer/DocumentSummarizerView';
import VerifiedFeedView from './components/feed/VerifiedFeedView';
import ClinicalRiskCalculatorsView from './components/risk/ClinicalRiskCalculatorsView';
import LabPackagesView from './components/packages/LabPackagesView';
import FullHealthDossierModal from './components/dossier/FullHealthDossierModal';
import MicronutrientsView from './components/micronutrients/MicronutrientsView';
import EmergencyFirstAidView from './components/emergency/EmergencyFirstAidView';
import ClinicalConvertersView from './components/converters/ClinicalConvertersView';
import VascularGlucoseView from './components/vascular/VascularGlucoseView';
import LongevityView from './components/longevity/LongevityView';
import BiomarkerKnowledgeGraphView from './components/graph/BiomarkerKnowledgeGraphView';
import PharmacogenomicsView from './components/genomics/PharmacogenomicsView';
import TeleconsultClaimView from './components/teleconsult/TeleconsultClaimView';
import OrganHeatmapView from './components/organs/OrganHeatmapView';
import MicrobiomeChronoView from './components/microbiome/MicrobiomeChronoView';
import EnvironmentalExposomeView from './components/exposome/EnvironmentalExposomeView';
import AyurvedaDoshaView from './components/ayurveda/AyurvedaDoshaView';
import WhatIfSimulatorView from './components/simulation/WhatIfSimulatorView';

import { FAMILY_PROFILES, INITIAL_NOTIFICATIONS } from './data/mockData';
import { PRELOADED_REPORTS } from './data/reportsData';
import { fetchReportsFromBackend } from './services/apiClient';
import { 
  Sparkles, 
  UploadCloud, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Heart, 
  FileText, 
  Bot, 
  ArrowRight,
  Pill,
  Stethoscope, 
  FolderLock, 
  Moon, 
  HeartHandshake, 
  ShieldCheck, 
  Calendar, 
  Watch, 
  FileCheck, 
  BookOpen, 
  HeartPulse, 
  TestTube2, 
  Printer, 
  Sun,
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
  Sliders
} from 'lucide-react';

export default function App() {
  const [activeProfile, setActiveProfile] = useState(FAMILY_PROFILES[0]);
  const [activeTab, setActiveTab] = useState('simulation'); // Focus on What-If Simulator for review
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [healthDossierModalOpen, setHealthDossierModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [reportUploadModalOpen, setReportUploadModalOpen] = useState(false);
  const [reportsList, setReportsList] = useState(PRELOADED_REPORTS);
  const [activeChatContext, setActiveChatContext] = useState(null);

  // Sync initial reports from Java backend
  React.useEffect(() => {
    fetchReportsFromBackend().then(backendReports => {
      if (backendReports && Array.isArray(backendReports) && backendReports.length > 0) {
        setReportsList(backendReports);
      }
    }).catch(err => console.warn('Using client-preloaded reports:', err));
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleSelectNotification = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
      setNotificationsOpen(false);
    }
  };

  const handleReportAnalyzed = (newReport) => {
    setReportsList(prev => [newReport, ...prev]);
    setActiveTab('reports');
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Lab Report Analyzed by AI',
      message: `${newReport.title} successfully parsed into structured medical data.`,
      timestamp: 'Just now',
      type: 'report_ready',
      unread: true,
      actionTab: 'reports'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleNavigateToChatWithContext = (report, parameter = null) => {
    setActiveChatContext({ report, parameter });
    setActiveTab('chat');
  };

  // Filter reports relevant for active profile
  const profileReports = reportsList.filter(r => r.profileId === activeProfile.id);
  const displayedReports = profileReports.length > 0 ? profileReports : reportsList;

  return (
    <div className="min-h-screen bg-[#FAFCFA] text-slate-900 flex flex-col font-sans selection:bg-brand-green-100 selection:text-brand-green-900">
      
      {/* Top Navbar */}
      <Navbar
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfile}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onOpenUpload={() => setReportUploadModalOpen(true)}
        unreadCount={unreadCount}
        onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
        activeLanguage={activeLanguage}
        onChangeLanguage={setActiveLanguage}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Full-Width Layout */}
      <div className="flex-1 flex w-full">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeProfile={activeProfile}
          reportsCount={displayedReports.length}
          pendingMedsCount={2}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-x-hidden min-w-0">
          
          {/* Top Quick Status Bar */}
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-white to-rose-50/80 border border-[#E3ECE6] flex items-center justify-between flex-wrap gap-3 shadow-xs print:hidden">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${activeProfile.avatarColor} text-white flex items-center justify-center font-extrabold text-xs shadow-xs`}>
                {activeProfile.avatarInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 font-display">
                    {activeProfile.name}
                  </h1>
                  <span className="badge-green text-[10px] font-bold py-0.2">
                    {activeProfile.relationship}
                  </span>
                  <span className="badge-pink text-[10px] py-0.2 hidden sm:inline-flex">
                    {activeProfile.bloodGroup}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {activeProfile.age}y • {activeProfile.gender} • {activeProfile.weight} • BMI {activeProfile.bmi}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHealthDossierModalOpen(true)}
                className="btn-outline-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                title="Print full clinical summary dossier"
              >
                <Printer className="w-3.5 h-3.5 text-brand-green-600" />
                <span className="hidden sm:inline">Health Dossier (PDF)</span>
              </button>
              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="btn-secondary-pink text-xs py-1.5 px-3"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Emergency SOS
              </button>
              <button
                onClick={() => setReportUploadModalOpen(true)}
                className="btn-primary-green text-xs py-1.5 px-3.5"
              >
                <UploadCloud className="w-3.5 h-3.5" /> Upload Report
              </button>
            </div>
          </div>

          {/* Core Module View Router */}
          {activeTab === 'dashboard' && (
            <HealthDashboard
              activeProfile={activeProfile}
              reports={displayedReports}
              onSelectTab={setActiveTab}
              onOpenUpload={() => setReportUploadModalOpen(true)}
              onOpenEmergency={() => setEmergencyModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportAnalysisView
              reports={displayedReports}
              activeProfile={activeProfile}
              onOpenUpload={() => setReportUploadModalOpen(true)}
              onNavigateToChatWithContext={handleNavigateToChatWithContext}
              onNavigateToDoctors={() => setActiveTab('doctors')}
            />
          )}

          {activeTab === 'simulation' && (
            <WhatIfSimulatorView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'ayurveda' && (
            <AyurvedaDoshaView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'exposome' && (
            <EnvironmentalExposomeView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'microbiome' && (
            <MicrobiomeChronoView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'organs' && (
            <OrganHeatmapView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'teleconsult' && (
            <TeleconsultClaimView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'graph' && (
            <BiomarkerKnowledgeGraphView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'genomics' && (
            <PharmacogenomicsView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'chat' && (
            <ChikitsakChat
              activeProfile={activeProfile}
              activeChatContext={activeChatContext}
              onClearChatContext={() => setActiveChatContext(null)}
              onOpenEmergency={() => setEmergencyModalOpen(true)}
            />
          )}

          {activeTab === 'longevity' && (
            <LongevityView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencyFirstAidView
              activeProfile={activeProfile}
              onOpenEmergency={() => setEmergencyModalOpen(true)}
            />
          )}

          {activeTab === 'vascular' && (
            <VascularGlucoseView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'converters' && (
            <ClinicalConvertersView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'micronutrients' && (
            <MicronutrientsView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'packages' && (
            <LabPackagesView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'risk' && (
            <ClinicalRiskCalculatorsView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'exercise' && (
            <ExerciseView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'medications' && (
            <MedicationManager
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorsView
              activeProfile={activeProfile}
              reports={displayedReports}
            />
          )}

          {activeTab === 'timeline' && (
            <HealthTimelineView
              activeProfile={activeProfile}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'wearables' && (
            <WearablesView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'summarizer' && (
            <DocumentSummarizerView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'vault' && (
            <HealthVaultView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'feed' && (
            <VerifiedFeedView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'symptoms' && (
            <SymptomCheckerView
              activeProfile={activeProfile}
              onOpenEmergency={() => setEmergencyModalOpen(true)}
              onNavigateToDoctors={() => setActiveTab('doctors')}
            />
          )}

          {activeTab === 'womens_health' && (
            <WomensHealthView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'wellness' && (
            <SleepWellnessView
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'security' && (
            <SecurityAuditView
              activeProfile={activeProfile}
            />
          )}

        </main>
      </div>

      {/* Full Health Dossier Modal (Print / PDF) */}
      <FullHealthDossierModal
        isOpen={healthDossierModalOpen}
        onClose={() => setHealthDossierModalOpen(false)}
        activeProfile={activeProfile}
        reports={displayedReports}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Report Upload & OCR Modal */}
      <ReportUploadModal
        isOpen={reportUploadModalOpen}
        onClose={() => setReportUploadModalOpen(false)}
        activeProfile={activeProfile}
        onReportAnalyzed={handleReportAnalyzed}
      />
    </div>
  );
}
