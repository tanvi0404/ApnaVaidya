import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Heart, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Edit3
} from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, activeProfile, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    weight: '68 kg',
    height: '170 cm',
    mobile: '',
    place: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    conditions: [],
    allergies: [],
    dietPreference: 'Vegetarian'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state whenever activeProfile changes or modal opens
  useEffect(() => {
    if (activeProfile && isOpen) {
      setFormData({
        name: activeProfile.name || '',
        relationship: activeProfile.relationship || 'Self (Account Owner)',
        age: activeProfile.age || 30,
        gender: activeProfile.gender || 'Male',
        bloodGroup: activeProfile.bloodGroup || 'B+',
        weight: activeProfile.weight || '68 kg',
        height: activeProfile.height || '170 cm',
        mobile: activeProfile.mobile || '',
        place: activeProfile.place || '',
        address: activeProfile.address || '',
        emergencyContactName: activeProfile.emergencyContact?.name || '',
        emergencyContactPhone: activeProfile.emergencyContact?.phone || '',
        conditions: Array.isArray(activeProfile.conditions) ? activeProfile.conditions : [],
        allergies: Array.isArray(activeProfile.allergies) ? activeProfile.allergies : [],
        dietPreference: activeProfile.dietPreference || 'Vegetarian'
      });
      setSavedSuccess(false);
      setErrorMsg('');
    }
  }, [activeProfile, isOpen]);

  if (!isOpen) return null;

  const relationshipOptions = [
    'Self (Account Owner)',
    'Spouse',
    'Father',
    'Mother',
    'Son',
    'Daughter',
    'Brother',
    'Sister',
    'Grandparent',
    'Other Dependent'
  ];

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
      setFormData(prev => ({ ...prev, conditions: ['None (Healthy)'] }));
      return;
    }
    setFormData(prev => {
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
      setFormData(prev => ({ ...prev, allergies: ['No Known Allergies'] }));
      return;
    }
    setFormData(prev => {
      const filtered = prev.allergies.filter(a => a !== 'No Known Allergies');
      return {
        ...prev,
        allergies: filtered.includes(allg)
          ? filtered.filter(a => a !== allg)
          : [...filtered, allg]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      setErrorMsg('Name and age are required.');
      return;
    }

    const initials = formData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AV';
    const heightM = (parseFloat(formData.height) || 170) / 100;
    const weightKg = parseFloat(formData.weight) || 68;
    const calculatedBmi = Number((weightKg / (heightM * heightM)).toFixed(1)) || 22.5;

    const avatarColor = formData.gender === 'Female' 
      ? (Number(formData.age) < 18 ? 'from-pink-400 to-rose-400' : 'from-rose-500 to-pink-600')
      : (Number(formData.age) >= 60 ? 'from-rose-500 to-red-600' : 'from-brand-green-600 to-teal-700');

    const updatedProfile = {
      ...activeProfile,
      name: formData.name.trim(),
      relationship: formData.relationship,
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      avatarInitials: initials,
      avatarColor: activeProfile.avatarColor || avatarColor,
      weight: formData.weight.includes('kg') ? formData.weight : `${formData.weight} kg`,
      height: formData.height.includes('cm') ? formData.height : `${formData.height} cm`,
      bmi: calculatedBmi,
      mobile: formData.mobile,
      place: formData.place,
      address: formData.address,
      conditions: formData.conditions.filter(c => c !== 'None (Healthy)'),
      allergies: formData.allergies.filter(a => a !== 'No Known Allergies'),
      dietPreference: formData.dietPreference,
      emergencyContact: {
        name: formData.emergencyContactName || activeProfile.emergencyContact?.name || 'Emergency Contact',
        phone: formData.emergencyContactPhone || activeProfile.emergencyContact?.phone || formData.mobile
      }
    };

    onUpdateProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-brand-green-50 to-emerald-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-green-600 text-white rounded-xl shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Edit Health Profile & Demographics
              </h3>
              <p className="text-xs text-slate-500">
                Update clinical vitals, allergies, address and contact details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Basic Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relationship
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Demographics & Physical Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Weight
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g. 70 kg"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Contact, City & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number (+91)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Place
              </label>
              <input
                type="text"
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                placeholder="e.g. Bengaluru, New Delhi"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Flat No, Street, Area"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Diet Preference */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Dietary Preference
            </label>
            <select
              value={formData.dietPreference}
              onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
            >
              {dietOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Medical Conditions (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conditionOptions.map(cond => {
                const isSelected = formData.conditions.includes(cond);
                return (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => handleToggleCondition(cond)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      isSelected
                        ? 'bg-brand-pink-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{cond}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Known Drug/Food Allergies
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allergyOptions.map(allg => {
                const isSelected = formData.allergies.includes(allg);
                return (
                  <button
                    type="button"
                    key={allg}
                    onClick={() => handleToggleAllergy(allg)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
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

          {/* Emergency Contact */}
          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-900">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>SOS Emergency Contact</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                placeholder="Contact Name"
                className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-slate-900 focus:outline-none"
              />
              <input
                type="tel"
                maxLength={10}
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value.replace(/\D/g, '') })}
                placeholder="Phone (+91)"
                className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-white text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-green text-xs py-2 px-5 font-bold shadow-soft-green flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
