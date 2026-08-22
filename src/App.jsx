import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import EmergencyModal from './components/layout/EmergencyModal';
import NotificationDrawer from './components/layout/NotificationDrawer';
import ReportUploadModal from './components/reports/ReportUploadModal';
import FullHealthDossierModal from './components/dossier/FullHealthDossierModal';
import AuthModal from './components/auth/AuthModal';
import AddFamilyMemberModal from './components/layout/AddFamilyMemberModal';
import EditProfileModal from './components/layout/EditProfileModal';

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
  FolderLock,
  Edit3
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

function normalizeProfile(p) {
  if (!p) return FAMILY_PROFILES[0];
  const initials = p.avatarInitials || (p.name ? p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'AV');
  const avatarColor = p.avatarColor || (p.gender === 'Female' ? 'from-rose-500 to-pink-600' : 'from-brand-green-600 to-teal-700');
  return {
    ...p,
    id: p.id || `user-${Date.now()}`,
    name: p.name || 'Patient',
    relationship: p.relationship || 'Self (Account Owner)',
    age: Number(p.age) || 30,
    gender: p.gender || 'Male',
    bloodGroup: p.bloodGroup || 'B+',
    avatarInitials: initials,
    avatarColor: avatarColor,
    height: p.height || '170 cm',
    weight: p.weight || '68 kg',
    bmi: p.bmi || 23.5,
    conditions: Array.isArray(p.conditions) ? p.conditions : [],
    allergies: Array.isArray(p.allergies) ? p.allergies : [],
    goals: Array.isArray(p.goals) ? p.goals : ['General Health Optimization'],
    dietPreference: p.dietPreference || 'Vegetarian',
    lifestyle: p.lifestyle || {
      nutrition: 'Good',
      activity: 'Active (Walking & Cardio)',
      sleep: '7.5 hrs (Restful)',
      hydration: '2.5 L / 3.0 L'
    }
  };
}

export default function App() {
  // Authentication State
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('apnavaidya_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  // Dynamic Family Profiles (Preloaded for Demo or User's Own Family for Personal Accounts)
  const [familyProfiles, setFamilyProfiles] = useState(() => {
    try {
      const savedUser = localStorage.getItem('apnavaidya_auth_user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (user?.isDemo) {
        return FAMILY_PROFILES.map(normalizeProfile);
      }
      const custom = localStorage.getItem('apnavaidya_custom_profiles');
      const customList = custom ? JSON.parse(custom) : [];
      if (customList.length > 0) return customList.map(normalizeProfile);
      return user ? [normalizeProfile(user)] : FAMILY_PROFILES.map(normalizeProfile);
    } catch (_) {
      return FAMILY_PROFILES.map(normalizeProfile);
    }
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('apnavaidya_active_tab') || 'dashboard';
  });

  // Active Family Profile
  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem('apnavaidya_active_profile_id');
    const matched = familyProfiles.find(p => p.id === saved) || familyProfiles[0] || FAMILY_PROFILES[0];
    return normalizeProfile(matched);
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
  const [addFamilyModalOpen, setAddFamilyModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  // Context passing for Chikitsak Chat
  const [activeChatContext, setActiveChatContext] = useState(null);

  // Persistent Notification list
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Electronic Medical Reports List (Preloaded for Demo, Clean Slate for Real Accounts)
  const [reportsList, setReportsList] = useState(() => {
    try {
      const savedUser = localStorage.getItem('apnavaidya_auth_user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.isDemo) {
        return PRELOADED_REPORTS;
      }
      const savedReports = localStorage.getItem(`apnavaidya_reports_${user.id}`) || localStorage.getItem('apnavaidya_reports_all');
      return savedReports ? JSON.parse(savedReports) : [];
    } catch (_) {
      return PRELOADED_REPORTS;
    }
  });

  const handleLogin = (user, profile, isDemo = false) => {
    const sessionUser = { ...user, isDemo };
    setAuthUser(sessionUser);
    try {
      localStorage.setItem('apnavaidya_auth_user', JSON.stringify(sessionUser));
    } catch (_) {}

    if (isDemo) {
      const normList = FAMILY_PROFILES.map(normalizeProfile);
      setFamilyProfiles(normList);
      const safeProf = normalizeProfile(profile || FAMILY_PROFILES[0]);
      setActiveProfile(safeProf);
      setReportsList(PRELOADED_REPORTS);
      try {
        localStorage.setItem('apnavaidya_active_profile_id', safeProf.id);
        localStorage.removeItem('apnavaidya_custom_profiles');
      } catch (_) {}
    } else {
      const safeProf = normalizeProfile(profile || user);
      const userProfiles = [safeProf];
      setFamilyProfiles(userProfiles);
      try {
        localStorage.setItem('apnavaidya_custom_profiles', JSON.stringify(userProfiles));
        localStorage.setItem('apnavaidya_active_profile_id', safeProf.id);
      } catch (_) {}
      setActiveProfile(safeProf);
      // Clean slate or fetch real patient reports
      fetchReportsFromBackend(safeProf.id).then(reps => {
        setReportsList(Array.isArray(reps) ? reps : []);
      });
    }
  };

  const handleAddFamilyMember = (newMember) => {
    const safeMember = normalizeProfile(newMember);
    setFamilyProfiles(prev => {
      const updated = [...prev, safeMember];
      try {
        localStorage.setItem('apnavaidya_custom_profiles', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setActiveProfile(safeMember);
    try {
      localStorage.setItem('apnavaidya_active_profile_id', safeMember.id);
    } catch (_) {}
  };

  const handleUpdateProfile = (updatedProfile) => {
    const safeProf = normalizeProfile(updatedProfile);
    setFamilyProfiles(prev => {
      const updatedList = prev.map(p => p.id === safeProf.id ? safeProf : p);
      try {
        localStorage.setItem('apnavaidya_custom_profiles', JSON.stringify(updatedList));
      } catch (_) {}
      return updatedList;
    });
    setActiveProfile(safeProf);
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Profile Updated',
      message: `${safeProf.name}'s clinical parameters and demographics have been saved.`,
      timestamp: 'Just now',
      type: 'profile_updated',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('apnavaidya_auth_user');
      localStorage.removeItem('apnavaidya_custom_profiles');
      localStorage.removeItem('apnavaidya_active_profile_id');
    } catch (_) {}
    setAuthUser(null);
  };

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('apnavaidya_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeProfile?.id) {
      localStorage.setItem('apnavaidya_active_profile_id', activeProfile.id);
    }
  }, [activeProfile?.id]);

  useEffect(() => {
    localStorage.setItem('apnavaidya_lang', activeLanguage);
  }, [activeLanguage]);

  // Sync Reports from Java 17 Backend
  useEffect(() => {
    let isMounted = true;
    if (activeProfile?.id) {
      fetchReportsFromBackend(activeProfile.id).then(reports => {
        if (isMounted && reports && reports.length > 0) {
          setReportsList(reports);
        }
      }).catch(err => {
        console.warn('Backend sync:', err.message);
      });
    }

    return () => { isMounted = false; };
  }, [activeProfile?.id]);

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
  const profileReports = reportsList.filter(r => r && r.profileId === activeProfile?.id);
  const displayedReports = profileReports.length > 0 ? profileReports : reportsList;

  // Unauthenticated gateway gate
  if (!authUser) {
    return <AuthModal onLogin={handleLogin} />;
  }

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
        profiles={familyProfiles}
        authUser={authUser}
        onLogout={handleLogout}
        onOpenAddMember={() => setAddFamilyModalOpen(true)}
        onOpenEditProfile={() => setEditProfileModalOpen(true)}
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
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${activeProfile?.avatarColor || 'from-brand-green-600 to-teal-700'} text-white flex items-center justify-center font-extrabold text-xs shadow-xs`}>
                {activeProfile?.avatarInitials || 'AV'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 font-display">
                    {activeProfile?.name || 'Patient'}
                  </h1>
                  <span className="badge-green text-[10px] font-bold py-0.2">
                    {activeProfile?.relationship || 'Self'}
                  </span>
                  <span className="badge-pink text-[10px] py-0.2 hidden sm:inline-flex">
                    {activeProfile?.bloodGroup || 'B+'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {activeProfile?.age || 30} yrs • {activeProfile?.gender || 'Male'} • {(activeProfile?.allergies || []).length > 0 ? `Allergies: ${activeProfile.allergies.join(', ')}` : 'No known allergies'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditProfileModalOpen(true)}
                className="btn-outline-white text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                title="Edit Health Profile & Demographics"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-green-600" />
                <span>Edit Profile</span>
              </button>

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
              <WomensHealthView 
                activeProfile={activeProfile} 
                onSelectProfile={(profId) => {
                  const target = familyProfiles.find(p => p.id === profId);
                  if (target) setActiveProfile(target);
                }}
              />
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

      {/* Add Family Member Modal */}
      <AddFamilyMemberModal
        isOpen={addFamilyModalOpen}
        onClose={() => setAddFamilyModalOpen(false)}
        onAddMember={handleAddFamilyMember}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        activeProfile={activeProfile}
        onUpdateProfile={handleUpdateProfile}
      />

    </div>
  );
}
