import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Heart, 
  ShieldCheck, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Users,
  AlertCircle
} from 'lucide-react';

export default function AddFamilyMemberModal({ isOpen, onClose, onAddMember }) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [dietPreference, setDietPreference] = useState('Vegetarian');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const relationshipOptions = [
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
    'High Cholesterol',
    'None (Healthy)'
  ];

  const allergyOptions = [
    'Penicillin',
    'Sulfa Drugs',
    'Peanuts',
    'Shellfish',
    'Dust / Pollen',
    'No Known Allergies'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleToggleCondition = (cond) => {
    if (cond === 'None (Healthy)') {
      setConditions(['None (Healthy)']);
      return;
    }
    const filtered = conditions.filter(c => c !== 'None (Healthy)');
    setConditions(filtered.includes(cond) ? filtered.filter(c => c !== cond) : [...filtered, cond]);
  };

  const handleToggleAllergy = (allg) => {
    if (allg === 'No Known Allergies') {
      setAllergies(['No Known Allergies']);
      return;
    }
    const filtered = allergies.filter(a => a !== 'No Known Allergies');
    setAllergies(filtered.includes(allg) ? filtered.filter(a => a !== allg) : [...filtered, allg]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !age) {
      setErrorMsg('Please provide a name and age for the family member.');
      return;
    }

    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'FM';
    const avatarColor = gender === 'Female' 
      ? (Number(age) < 18 ? 'from-pink-400 to-rose-400' : 'from-rose-500 to-pink-600')
      : (Number(age) >= 60 ? 'from-rose-500 to-red-600' : 'from-brand-green-600 to-teal-700');

    const newMemberProfile = {
      id: `user-fam-${Date.now()}`,
      name: name.trim(),
      relationship,
      age: Number(age),
      gender,
      bloodGroup,
      avatarColor,
      avatarInitials: initials,
      weight: Number(age) < 18 ? '28 kg' : '65 kg',
      height: Number(age) < 18 ? '130 cm' : '165 cm',
      bmi: Number(age) < 18 ? 16.5 : 23.8,
      conditions: conditions.filter(c => c !== 'None (Healthy)'),
      allergies: allergies.filter(a => a !== 'No Known Allergies'),
      goals: ['Routine Family Preventive Care', 'Health Vitality'],
      dietPreference,
      lifestyle: {
        nutrition: 'Good',
        activity: 'Active',
        sleep: '7.5 hrs (Restful)',
        hydration: '2.2 L / 2.5 L'
      }
    };

    onAddMember(newMemberProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-brand-green-50 to-emerald-50/50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-green-600 text-white rounded-xl shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Add Family Member to Vault
              </h3>
              <p className="text-xs text-slate-500">
                Create a distinct clinical record and RBAC profile
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

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Member Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pooja Singh"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 26"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Diet Preference
              </label>
              <select
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain Diet">Jain Diet</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Medical Conditions (if any)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conditionOptions.map(cond => {
                const isSelected = conditions.includes(cond);
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
                const isSelected = allergies.includes(allg);
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
              <span>Add Member Profile</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
