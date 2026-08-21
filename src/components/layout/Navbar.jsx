import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  ShieldAlert, 
  Bell, 
  UploadCloud, 
  Users, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Languages,
  Activity,
  UserCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { FAMILY_PROFILES } from '../../data/mockData';

export default function Navbar({
  activeProfile,
  onSelectProfile,
  onOpenEmergency,
  onOpenUpload,
  unreadCount,
  onToggleNotifications,
  activeLanguage,
  onChangeLanguage,
  onToggleMobileSidebar,
  profiles = FAMILY_PROFILES,
  authUser = null,
  onLogout = () => {}
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'hg', label: 'Hinglish', native: 'Hinglish' },
    { code: 'pb', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3ECE6] shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-2">
          
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-green-500 to-brand-green-700 text-white shadow-soft-green flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-brand-pink-500 border-2 border-white flex items-center justify-center">
                <Heart className="w-2 h-2 text-white fill-current" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-brand-green-800 via-brand-green-700 to-slate-900 bg-clip-text text-transparent">
                  Apna<span className="text-brand-green-600">Vaidya</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-green-50 text-brand-green-700 border border-brand-green-200">
                  <Sparkles className="w-2.5 h-2.5 text-brand-pink-500" /> AI HEALTHCARE
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  ☕ Java 17 REST API: Online (Port 8080)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Your Health, Understood.
              </p>
            </div>
          </div>

          {/* Center / Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Multilingual Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-brand-green-50 border border-slate-200 hover:border-brand-green-300 transition-all"
                title="Change language"
              >
                <Languages className="w-3.5 h-3.5 text-brand-green-600" />
                <span className="uppercase font-bold">{activeLanguage}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Assistant Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                        activeLanguage === l.code
                          ? 'bg-brand-green-50 text-brand-green-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div>
                        <span>{l.label}</span>
                        <span className="ml-1 text-slate-400 font-normal">({l.native})</span>
                      </div>
                      {activeLanguage === l.code && <Check className="w-3.5 h-3.5 text-brand-green-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Family Profile Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-brand-green-400 shadow-xs transition-all text-left group"
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${activeProfile.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {activeProfile.avatarInitials}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {activeProfile.name}
                    <span className="text-[10px] font-semibold text-brand-green-700 bg-brand-green-50 px-1.5 py-0.2 rounded border border-brand-green-200">
                      {activeProfile.relationship}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Family Profiles
                    </span>
                    <span className="text-[10px] font-normal text-brand-green-700 bg-brand-green-50 px-1.5 py-0.5 rounded">
                      Strict RBAC
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          onSelectProfile(profile);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                          activeProfile.id === profile.id
                            ? 'bg-brand-green-50/80 border border-brand-green-200 text-brand-green-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${profile.avatarColor || 'from-emerald-600 to-teal-700'} text-white flex items-center justify-center font-bold text-xs`}>
                            {profile.avatarInitials || 'AV'}
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-slate-900">{profile.name}</div>
                            <div className="text-[11px] text-slate-500">{profile.relationship} • {profile.age}y</div>
                          </div>
                        </div>
                        {activeProfile.id === profile.id && (
                          <UserCheck className="w-4 h-4 text-brand-green-600" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                    <div className="text-[10px] text-slate-400 italic text-center">
                      End-to-End Encrypted Health Session
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Emergency SOS Button (Pink/Rose Vital Glow) */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 to-brand-pink-500 hover:from-rose-700 hover:to-brand-pink-600 shadow-soft-pink active:scale-95 transition-all"
              title="Immediate Emergency Red-Flag Assistance"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>SOS</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-brand-green-700 hover:bg-brand-green-50 border border-slate-200 transition-all"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-pink-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Upload Report Button (Vibrant Emerald CTA) */}
            <button
              onClick={onOpenUpload}
              className="hidden sm:inline-flex btn-primary-green text-xs sm:text-sm py-2 px-3.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Report</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
