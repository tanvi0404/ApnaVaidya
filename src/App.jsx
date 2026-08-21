import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import EmergencyModal from './components/layout/EmergencyModal';
import NotificationDrawer from './components/layout/NotificationDrawer';
import ReportUploadModal from './components/reports/ReportUploadModal';
import FullHealthDossierModal from './components/dossier/FullHealthDossierModal';

// Code-split view components for optimal sub-150KB bundle performance
const HealthDashboard = lazy(() => import('./components/dashboard/HealthDashboard'));
const ReportAnalysisView = lazy(() => import('./components/reports/ReportAnalysisView'));
const WhatIfSimulatorView = lazy(() => import('./components/simulation/WhatIfSimulatorView'));
const AyurvedaDoshaView = lazy(() => import('./components/ayurveda/AyurvedaDoshaView'));
const EnvironmentalExposomeView = lazy(() => import('./components/exposome/EnvironmentalExposomeView'));
const OrganHeatmapView = lazy(() => import('./components/organs/OrganHeatmapView'));
const MicrobiomeChronoView = lazy(() => import('./components/microbiome/MicrobiomeChronoView'));
const TeleconsultClaimView = lazy(() => import('./components/teleconsult/TeleconsultClaimView'));
const BiomarkerKnowledgeGraphView = lazy(() => import('./components/graph/BiomarkerKnowledgeGraphView'));
const ChikitsakChat = lazy(() => import('./components/chat/ChikitsakChat'));
const PharmacogenomicsView = lazy(() => import('./components/genomics/PharmacogenomicsView'));
const LongevityView = lazy(() => import('./components/longevity/LongevityView'));
const VascularGlucoseView = lazy(() => import('./components/vascular/VascularGlucoseView'));
const ClinicalRiskCalculatorsView = lazy(() => import('./components/risk/ClinicalRiskCalculatorsView'));
const LabPackagesView = lazy(() => import('./components/packages/LabPackagesView'));
const NutritionView = lazy(() => import('./components/nutrition/NutritionView'));
const ExerciseView = lazy(() => import('./components/exercise/ExerciseView'));
const MedicationManager = lazy(() => import('./components/medications/MedicationManager'));
const DoctorsView = lazy(() => import('./components/doctors/DoctorsView'));
const EmergencyFirstAidView = lazy(() => import('./components/emergency/EmergencyFirstAidView'));
const ClinicalConvertersView = lazy(() => import('./components/converters/ClinicalConvertersView'));
const MicronutrientsView = lazy(() => import('./components/micronutrients/MicronutrientsView'));
const HealthTimelineView = lazy(() => import('./components/timeline/HealthTimelineView'));
const WearablesView = lazy(() => import('./components/wearables/WearablesView'));
const DocumentSummarizerView = lazy(() => import('./components/summarizer/DocumentSummarizerView'));
const HealthVaultView = lazy(() => import('./components/vault/HealthVaultView'));
const VerifiedFeedView = lazy(() => import('./components/feed/VerifiedFeedView'));
const SymptomCheckerView = lazy(() => import('./components/wellness/SymptomCheckerView'));
const WomensHealthView = lazy(() => import('./components/wellness/WomensHealthView'));
const SleepWellnessView = lazy(() => import('./components/wellness/SleepWellnessView'));
const SecurityAuditView = lazy(() => import('./components/security/SecurityAuditView'));

import { FAMILY_PROFILES, INITIAL_NOTIFICATIONS } from './data/mockData';
import { PRELOADED_REPORTS } from './data/reportsData';
import { fetchReportsFromBackend } from './services/apiClient';
import { 
  Sparkles, 
  UploadCloud, 
  ShieldAlert, 
  FileText, 
  Bot, 
  ArrowRight,
  Pill,
  Stethoscope, 
  FolderLock
} from 'lucide-react';

function ViewLoadingSkeleton() {
  return (
    <div className="card-white p-8 animate-pulse space-y-5">
      <div className="h-7 bg-emerald-100/70 rounded-2xl w-1/3"></div>
      <div className="h-4 bg-slate-100 rounded-xl w-2/3"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="h-28 bg-slate-50 border border-slate-100 rounded-2xl"></div>
        <div className="h-28 bg-slate-50 border border-slate-100 rounded-2xl"></div>
        <div className="h-28 bg-slate-50 border border-slate-100 rounded-2xl"></div>
      </div>
      <div className="h-44 bg-slate-50 border border-slate-100 rounded-3xl"></div>
    </div>
  );
}

export default function App() {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('apnavaidya_active_tab') || 'dashboard';
  });

  // Active Family Profile
  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem('apnavaidya_active_profile_id');
    return FAMILY_PROFILES.find(p => p.id === saved) || FAMILY_PROFILES[0];
  });

  // Global Language
  const [activeLanguage, setActiveLanguage] = useState(() => {
    return localStorage.getItem('apnavaidya_lang') || 'en';
  });

  // Global Modals and Drawers
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reportUploadModalOpen, setReportUploadModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Context passing for Chikitsak Chat
  const [activeChatContext, setActiveChatContext] = useState(null);

  // Persistent Notification list
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Electronic Medical Reports List
  const [reportsList, setReportsList] = useState(PRELOADED_REPORTS);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('apnavaidya_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('apnavaidya_active_profile_id', activeProfile.id);
  }, [activeProfile.id]);

  useEffect(() => {
    localStorage.setItem('apnavaidya_lang', activeLanguage);
  }, [activeLanguage]);

  // Sync Reports from Java 17 Backend
  useEffect(() => {
    let isMounted = true;
    fetchReportsFromBackend(activeProfile.id).then(reports => {
      if (isMounted && reports && reports.length > 0) {
        setReportsList(reports);
      }
    }).catch(err => {
      console.warn('Backend sync failed, using preloaded data:', err);
    });

    return () => { isMounted = false; };
  }, [activeProfile.id]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleSelectNotification = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
      setNotificationsOpen(false);
    }
  };

  const handleUploadReportComplete = (newReport) => {
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
                <p className="text-xs text-slate-500 font-medium">
                  {activeProfile.age} yrs • {activeProfile.gender} • {activeProfile.allergies.length > 0 ? `Allergies: ${activeProfile.allergies.join(', ')}` : 'No known allergies'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDossierModalOpen(true)}
                className="btn-outline-white text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
              >
                <FileText className="w-3.5 h-3.5 text-brand-green-600" />
                <span>Clinical Dossier</span>
              </button>

              <button
                onClick={() => setReportUploadModalOpen(true)}
                className="btn-primary-green text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Report</span>
              </button>
            </div>
          </div>

          {/* Tab Render Area with Suspense */}
          <Suspense fallback={<ViewLoadingSkeleton />}>
            {activeTab === 'dashboard' && (
              <HealthDashboard
                activeProfile={activeProfile}
                onNavigateToReports={() => setActiveTab('reports')}
                onNavigateToChat={() => setActiveTab('chat')}
                onNavigateToMeds={() => setActiveTab('medications')}
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
              <WhatIfSimulatorView activeProfile={activeProfile} />
            )}

            {activeTab === 'ayurveda' && (
              <AyurvedaDoshaView activeProfile={activeProfile} />
            )}

            {activeTab === 'exposome' && (
              <EnvironmentalExposomeView activeProfile={activeProfile} />
            )}

            {activeTab === 'organs' && (
              <OrganHeatmapView activeProfile={activeProfile} />
            )}

            {activeTab === 'microbiome' && (
              <MicrobiomeChronoView activeProfile={activeProfile} />
            )}

            {activeTab === 'teleconsult' && (
              <TeleconsultClaimView activeProfile={activeProfile} />
            )}

            {activeTab === 'graph' && (
              <BiomarkerKnowledgeGraphView activeProfile={activeProfile} />
            )}

            {activeTab === 'chat' && (
              <ChikitsakChat
                activeProfile={activeProfile}
                initialReportContext={activeChatContext?.report}
                initialParameter={activeChatContext?.parameter}
                globalLanguage={activeLanguage}
              />
            )}

            {activeTab === 'genomics' && (
              <PharmacogenomicsView activeProfile={activeProfile} />
            )}

            {activeTab === 'longevity' && (
              <LongevityView activeProfile={activeProfile} />
            )}

            {activeTab === 'vascular' && (
              <VascularGlucoseView activeProfile={activeProfile} />
            )}

            {activeTab === 'risk' && (
              <ClinicalRiskCalculatorsView activeProfile={activeProfile} />
            )}

            {activeTab === 'packages' && (
              <LabPackagesView activeProfile={activeProfile} />
            )}

            {activeTab === 'nutrition' && (
              <NutritionView activeProfile={activeProfile} />
            )}

            {activeTab === 'exercise' && (
              <ExerciseView activeProfile={activeProfile} />
            )}

            {activeTab === 'medications' && (
              <MedicationManager activeProfile={activeProfile} />
            )}

            {activeTab === 'doctors' && (
              <DoctorsView
                activeProfile={activeProfile}
                reports={displayedReports}
              />
            )}

            {activeTab === 'emergency' && (
              <EmergencyFirstAidView
                activeProfile={activeProfile}
                onCallEmergency={() => setEmergencyModalOpen(true)}
              />
            )}

            {activeTab === 'converters' && (
              <ClinicalConvertersView activeProfile={activeProfile} />
            )}

            {activeTab === 'micronutrients' && (
              <MicronutrientsView activeProfile={activeProfile} />
            )}

            {activeTab === 'timeline' && (
              <HealthTimelineView
                activeProfile={activeProfile}
                onSelectReport={() => setActiveTab('reports')}
              />
            )}

            {activeTab === 'wearables' && (
              <WearablesView activeProfile={activeProfile} />
            )}

            {activeTab === 'summarizer' && (
              <DocumentSummarizerView
                activeProfile={activeProfile}
                onNavigateToVault={() => setActiveTab('vault')}
              />
            )}

            {activeTab === 'vault' && (
              <HealthVaultView activeProfile={activeProfile} />
            )}

            {activeTab === 'feed' && (
              <VerifiedFeedView activeProfile={activeProfile} />
            )}

            {activeTab === 'symptoms' && (
              <SymptomCheckerView
                activeProfile={activeProfile}
                onNavigateToEmergency={() => setActiveTab('emergency')}
                onNavigateToDoctors={() => setActiveTab('doctors')}
              />
            )}

            {activeTab === 'womens_health' && (
              <WomensHealthView activeProfile={activeProfile} />
            )}

            {activeTab === 'wellness' && (
              <SleepWellnessView activeProfile={activeProfile} />
            )}

            {activeTab === 'security' && (
              <SecurityAuditView activeProfile={activeProfile} />
            )}
          </Suspense>

        </main>
      </div>

      {/* Global Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        activeProfile={activeProfile}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Report Upload Modal */}
      <ReportUploadModal
        isOpen={reportUploadModalOpen}
        onClose={() => setReportUploadModalOpen(false)}
        onUploadComplete={handleUploadReportComplete}
        activeProfile={activeProfile}
      />

      {/* Full Health Dossier Modal */}
      <FullHealthDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        activeProfile={activeProfile}
        reports={displayedReports}
      />

    </div>
  );
}
