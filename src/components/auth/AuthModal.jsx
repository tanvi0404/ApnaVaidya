import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  HeartPulse, 
  ShieldAlert, 
  Salad, 
  Stethoscope,
  Info,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { FAMILY_PROFILES } from '../../data/mockData';
import { loginUserBackend, registerUserBackend } from '../../services/apiClient';

export default function AuthModal({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regStep, setRegStep] = useState(1); // 1: Credentials, 2: Demographics & Place, 3: Clinical & Emergency
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    age: '',
    gender: 'Male',
    place: '',
    address: '',
    pincode: '',
    bloodGroup: 'B+',
    weight: '68 kg',
    height: '172 cm',
    emergencyContactName: '',
    emergencyContactPhone: '',
    conditions: [],
    allergies: [],
    dietPreference: 'Vegetarian'
  });

  const conditionOptions = [
    'Hypertension',
    'Type 2 Diabetes',
    'Hypothyroidism',
    'Asthma / Bronchitis',
    'High Cholesterol (Dyslipidemia)',
    'Allergic Rhinitis',
    'None (Healthy)'
  ];

  const allergyOptions = [
    'Penicillin / Amoxicillin',
    'Sulfa Drugs',
    'Peanuts',
    'Shellfish',
    'Dust / Pollen',
    'Lactose Intolerance',
    'No Known Allergies'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const dietOptions = [
    'Vegetarian',
    'Pure Vegetarian (No Onion/Garlic)',
    'Non-Vegetarian',
    'Eggetarian',
    'Vegan',
    'Jain Diet'
  ];

  const handleToggleCondition = (cond) => {
    if (cond === 'None (Healthy)') {
      setRegData(prev => ({ ...prev, conditions: ['None (Healthy)'] }));
      return;
    }
    setRegData(prev => {
      const filtered = prev.conditions.filter(c => c !== 'None (Healthy)');
      return {
        ...prev,
        conditions: filtered.includes(cond)
          ? filtered.filter(c => c !== cond)
          : [...filtered, cond]
      };
    });
  };

  const handleToggleAllergy = (allg) => {
    if (allg === 'No Known Allergies') {
      setRegData(prev => ({ ...prev, allergies: ['No Known Allergies'] }));
      return;
    }
    setRegData(prev => {
      const filtered = prev.allergies.filter(a => a !== 'No Known Allergies');
      return {
        ...prev,
        allergies: filtered.includes(allg)
          ? filtered.filter(a => a !== allg)
          : [...filtered, allg]
      };
    });
  };

  const handleDemoLogin = (profile) => {
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: profile.id,
        name: profile.name,
        email: `${profile.id.replace('user-', '')}@apnavaidya.in`,
        mobile: '+91 98765 43210',
        activeProfileId: profile.id,
        isDemo: true
      };
      onLogin(user, profile, true);
      setLoading(false);
    }, 400);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginIdentifier || !loginPassword) {
      setErrorMsg('Please enter your email/mobile number and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUserBackend({ identifier: loginIdentifier, password: loginPassword });
      if (res && res.success) {
        // Find matching profile from custom saved profiles or default mock profiles
        let customList = [];
        try {
          const savedCustom = localStorage.getItem('apnavaidya_custom_profiles');
          if (savedCustom) customList = JSON.parse(savedCustom);
        } catch (_) {}

        const matched = (customList && customList.length > 0 && customList.find(p => 
          p.name.toLowerCase().includes(loginIdentifier.toLowerCase()) || 
          p.id.toLowerCase().includes(loginIdentifier.toLowerCase())
        )) || FAMILY_PROFILES.find(p => 
          p.name.toLowerCase().includes(loginIdentifier.toLowerCase()) || 
          p.id.toLowerCase().includes(loginIdentifier.toLowerCase())
        );

        const isDemo = Boolean(FAMILY_PROFILES.some(p => 
          p.name.toLowerCase().includes(loginIdentifier.toLowerCase()) || 
          p.id.toLowerCase().includes(loginIdentifier.toLowerCase())
        ));

        const profileToUse = matched || {
          id: res.user.id || `user-${Date.now()}`,
          name: res.user.name,
          relationship: 'Self (Account Owner)',
          age: (res.user.age !== undefined && res.user.age !== null && Number(res.user.age) > 0) ? Number(res.user.age) : 25,
          gender: res.user.gender || 'Male',
          bloodGroup: res.user.bloodGroup || 'B+',
          avatarColor: 'from-brand-green-600 to-teal-700',
          avatarInitials: res.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AV',
          weight: '68 kg',
          height: '170 cm',
          bmi: 23.5,
          conditions: [],
          allergies: [],
          goals: ['General Health Optimization'],
          dietPreference: 'Vegetarian'
        };

        onLogin(res.user, profileToUse, isDemo);
      } else {
        setErrorMsg(res?.error || 'Invalid credentials. Please check and retry.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to login service. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regData.name || !regData.mobile || !regData.age || !regData.place) {
      setErrorMsg('Please complete all mandatory clinical & demographic fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUserBackend(regData);
      if (res && res.success) {
        // Create matching profile object
        const initials = regData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AV';
        const heightM = (parseFloat(regData.height) || 170) / 100;
        const weightKg = parseFloat(regData.weight) || 68;
        const calculatedBmi = Number((weightKg / (heightM * heightM)).toFixed(1)) || 22.5;

        const newProfile = {
          id: res.user.id || `user-${Date.now()}`,
          name: regData.name,
          relationship: 'Self (Account Owner)',
          age: Number(regData.age) || 30,
          gender: regData.gender || 'Male',
          bloodGroup: regData.bloodGroup || 'B+',
          avatarColor: regData.gender === 'Female' ? 'from-rose-500 to-pink-600' : 'from-brand-green-600 to-teal-700',
          avatarInitials: initials,
          weight: `${weightKg} kg`,
          height: `${regData.height || '170 cm'}`,
          bmi: calculatedBmi,
          conditions: regData.conditions.filter(c => c !== 'None (Healthy)'),
          allergies: regData.allergies.filter(a => a !== 'No Known Allergies'),
          goals: ['General Health Optimization', 'Preventive Longevity'],
          dietPreference: regData.dietPreference,
          place: regData.place,
          address: regData.address,
          mobile: regData.mobile,
          emergencyContact: {
            name: regData.emergencyContactName || 'Family Member',
            phone: regData.emergencyContactPhone || regData.mobile
          },
          lifestyle: {
            nutrition: 'Good',
            activity: 'Active (Walking & Cardio)',
            sleep: '7.5 hrs (Restful)',
            hydration: '2.5 L / 3.0 L'
          }
        };

        onLogin(res.user, newProfile, false);
      } else {
        setErrorMsg(res?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Error creating account. Running with offline profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-brand-green-950 to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-green-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-pink-500/15 blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="text-center mb-6 z-10 space-y-2">
        <div className="inline-flex items-center justify-center gap-2.5 p-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>India's Clinical-Grade AI Health Companion</span>
          <Sparkles className="w-3.5 h-3.5 text-brand-pink-400" />
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white p-1 shadow-xl border border-white/30 overflow-hidden">
            <img src="/logo.png" alt="ApnaVaidya Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Apna<span className="text-emerald-400">Vaidya</span>
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mx-auto">
          Your Health, Understood. Secure Indian Electronic Health Records, Multilingual Clinical AI & Family Vault.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fadeIn">
        
        {/* Top Tab Bar (Login vs Register) */}
        <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 border-b border-slate-200">
          <button
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            className={`py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-white text-brand-green-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Log In to Account</span>
          </button>
          
          <button
            onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
            className={`py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'bg-white text-brand-pink-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>New Patient Registration</span>
          </button>
        </div>

        {/* Error Alert (if any) */}
        {errorMsg && (
          <div className="m-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ------------------- MODE 1: LOGIN ------------------- */}
        {authMode === 'login' ? (
          <div className="p-6 sm:p-8 space-y-6">
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number or Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. arjun@apnavaidya.in or 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-brand-green-700 font-semibold cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary-green py-3 text-sm font-bold shadow-soft-green flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Health Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Banner */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Quick Evaluator & Demo Access
                </span>
                <span className="badge-green text-[10px] font-bold">1-Click Sign-In</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FAMILY_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleDemoLogin(profile)}
                    className="p-2.5 bg-slate-50 hover:bg-brand-green-50/70 border border-slate-200 hover:border-brand-green-300 rounded-2xl flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${profile.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                        {profile.avatarInitials}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-brand-green-950 truncate">
                          {profile.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {profile.relationship} • {profile.age}y ({profile.gender})
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-green-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              Don't have an ApnaVaidya account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-brand-pink-600 font-extrabold hover:underline"
              >
                Register as a New Patient
              </button>
            </div>

          </div>
        ) : (
          /* ------------------- MODE 2: REGISTER & ONBOARDING QUESTIONNAIRE ------------------- */
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between relative pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  regStep === 1 ? 'bg-brand-pink-500 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  1
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">Credentials</span>
              </div>
              
              <div className="h-0.5 w-12 bg-slate-200" />

              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  regStep === 2 ? 'bg-brand-pink-500 text-white' : regStep > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                }`}>
                  2
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">Demographics & City</span>
              </div>

              <div className="h-0.5 w-12 bg-slate-200" />

              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  regStep === 3 ? 'bg-brand-pink-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  3
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">Health Profile</span>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* STEP 1: Account Credentials */}
              {regStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-green-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Step 1: Patient Identity & Security</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number (+91) *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={regData.mobile}
                          onChange={(e) => setRegData({ ...regData, mobile: e.target.value.replace(/\D/g, '') })}
                          placeholder="9876543210"
                          className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="vikram@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!regData.name || !regData.mobile || !regData.password) {
                          setErrorMsg('Please fill in your name, mobile, and password.');
                          return;
                        }
                        setErrorMsg('');
                        setRegStep(2);
                      }}
                      className="btn-primary-pink text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
                    >
                      <span>Continue to Demographics</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Demographics, City & Address */}
              {regStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-green-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Step 2: Demographics & Residential Location</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={120}
                        value={regData.age}
                        onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                        placeholder="e.g. 34"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Biological Gender *
                      </label>
                      <select
                        value={regData.gender}
                        onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Blood Group *
                      </label>
                      <select
                        value={regData.bloodGroup}
                        onChange={(e) => setRegData({ ...regData, bloodGroup: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                      >
                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        City / Place *
                      </label>
                      <input
                        type="text"
                        required
                        value={regData.place}
                        onChange={(e) => setRegData({ ...regData, place: e.target.value })}
                        placeholder="e.g. Bengaluru, New Delhi, Mumbai"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regData.pincode}
                        onChange={(e) => setRegData({ ...regData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 560001"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Residential Address (for Home Lab Tests & Emergency Dispatch)
                    </label>
                    <textarea
                      rows={2}
                      value={regData.address}
                      onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                      placeholder="House/Flat No., Street, Area, Landmark"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink-500/20 focus:border-brand-pink-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="btn-outline-white text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!regData.age || !regData.place) {
                          setErrorMsg('Please specify your age and city.');
                          return;
                        }
                        setErrorMsg('');
                        setRegStep(3);
                      }}
                      className="btn-primary-pink text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
                    >
                      <span>Continue to Clinical Baseline</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Clinical Baseline, Allergies & Emergency */}
              {regStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-green-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
                    <span>Step 3: Clinical Baseline, Allergies & Emergency Contact</span>
                  </div>

                  {/* Pre-existing Conditions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Known Medical Conditions (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {conditionOptions.map(cond => {
                        const isSelected = regData.conditions.includes(cond);
                        return (
                          <button
                            type="button"
                            key={cond}
                            onClick={() => handleToggleCondition(cond)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-brand-pink-500 text-white shadow-soft-pink'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{cond}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drug/Food Allergies */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Known Allergies
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {allergyOptions.map(allg => {
                        const isSelected = regData.allergies.includes(allg);
                        return (
                          <button
                            type="button"
                            key={allg}
                            onClick={() => handleToggleAllergy(allg)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{allg}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Diet Preference */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Dietary Preference
                    </label>
                    <select
                      value={regData.dietPreference}
                      onChange={(e) => setRegData({ ...regData, dietPreference: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none"
                    >
                      {dietOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Emergency Contact */}
                  <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-900">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>SOS Emergency Contact</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={regData.emergencyContactName}
                        onChange={(e) => setRegData({ ...regData, emergencyContactName: e.target.value })}
                        placeholder="Emergency Contact Name"
                        className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                      />
                      <input
                        type="tel"
                        maxLength={10}
                        value={regData.emergencyContactPhone}
                        onChange={(e) => setRegData({ ...regData, emergencyContactPhone: e.target.value.replace(/\D/g, '') })}
                        placeholder="Emergency Phone (+91)"
                        className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="btn-outline-white text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary-green py-2.5 px-6 text-xs sm:text-sm font-extrabold shadow-soft-green flex items-center gap-2"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete Registration & Open Vault</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-brand-green-700 font-extrabold hover:underline"
              >
                Log In
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-emerald-200/60 text-[11px] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>End-to-End Encrypted • HIPAA & ABDM/NDHM Architecture Standard</span>
      </div>

    </div>
  );
}
