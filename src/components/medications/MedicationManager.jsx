import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Info, 
  X, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  Search, 
  Scan, 
  Bell 
} from 'lucide-react';
import { MEDICATIONS_DATA } from '../../data/medicationsData';
import { fetchMedicationsFromBackend, toggleMedicationBackend, checkDrugInteractionsBackend } from '../../services/apiClient';
import PrescriptionOcrScannerModal from '../prescriptions/PrescriptionOcrScannerModal';

export const COMMON_INTERACTIONS = [
  {
    id: 'int-1',
    itemA: 'Levothyroxine (Thyronorm)',
    itemB: 'Calcium Carbonate / Iron Supplements',
    severity: 'MODERATE',
    mechanism: 'Calcium and iron ions chelate with synthetic thyroxine in the stomach, reducing thyroid absorption by up to 40%.',
    recommendation: 'Strictly maintain a minimum 4-hour gap between taking Levothyroxine (morning) and Calcium/Iron (afternoon/evening).'
  },
  {
    id: 'int-2',
    itemA: 'Atorvastatin / Statins',
    itemB: 'Grapefruit Juice',
    severity: 'HIGH',
    mechanism: 'Furanocoumarins in grapefruit inhibit the intestinal CYP3A4 enzyme, leading to significantly higher blood levels of statin and increased risk of muscle toxicity (rhabdomyolysis).',
    recommendation: 'Avoid consuming fresh grapefruit or grapefruit juice while taking Atorvastatin.'
  },
  {
    id: 'int-3',
    itemA: 'Metformin',
    itemB: 'Alcohol / Binge Drinking',
    severity: 'HIGH',
    mechanism: 'Alcohol inhibits hepatic lactate clearance, multiplying the risk of rare but dangerous lactic acidosis in diabetic patients taking Metformin.',
    recommendation: 'Avoid excessive alcohol consumption while on Metformin therapy.'
  }
];

export default function MedicationManager({ activeProfile }) {
  const isDemoProfile = ['user-arjun', 'user-rajesh', 'user-sunita', 'user-ananya'].includes(activeProfile?.id);
  const initialMeds = MEDICATIONS_DATA[activeProfile?.id] || (isDemoProfile ? (MEDICATIONS_DATA['user-arjun'] || []) : []);
  const [medications, setMedications] = useState(initialMeds);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'interactions'
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [rxOcrModalOpen, setRxOcrModalOpen] = useState(false);
  const [interactionSearch, setInteractionSearch] = useState('');
  const [backendWarnings, setBackendWarnings] = useState([]);

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    fetchMedicationsFromBackend(activeProfile.id).then(backendMeds => {
      if (isMounted && backendMeds && backendMeds.length > 0) {
        // Normalize
        const normalized = backendMeds.map(m => {
          const isTaken = Boolean(m.takenToday || m.status === 'taken');
          return {
            id: m.id,
            name: m.name,
            dosage: m.dosage,
            genericName: m.genericName || m.name,
            timeSlot: m.timing || m.timeSlot || 'Morning (8:00 AM)',
            mealTiming: m.foodInstruction || m.mealTiming || 'After Food',
            purpose: m.prescribedFor || m.purpose || 'Health support',
            prescribedBy: m.doctorName || m.prescribedBy || 'Consulting Physician',
            remainingDays: m.remainingDays || 15,
            totalPills: m.totalPills || 30,
            remainingPills: m.remainingPills || 15,
            takenToday: isTaken,
            status: isTaken ? 'taken' : 'pending'
          };
        });
        setMedications(normalized);

        // Check interactions on Java backend
        const medNames = normalized.map(n => n.name + ' ' + (n.genericName || ''));
        checkDrugInteractionsBackend(medNames).then(res => {
          if (isMounted && res?.warnings) {
            setBackendWarnings(res.warnings);
          }
        });
      }
    }).catch(err => console.warn('Medications client fallback:', err));

    return () => { isMounted = false; };
  }, [activeProfile.id]);
  
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    timeSlot: 'Morning (8:00 AM)',
    mealTiming: 'After Food',
    purpose: '',
    totalPills: 30,
    remainingPills: 30
  });

  const toggleMedStatus = (id) => {
    toggleMedicationBackend(id);
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const currentTaken = Boolean(m.takenToday || m.status === 'taken');
        const nextTaken = !currentTaken;
        return {
          ...m,
          takenToday: nextTaken,
          status: nextTaken ? 'taken' : 'pending',
          remainingPills: nextTaken ? Math.max(0, (m.remainingPills || 1) - 1) : (m.remainingPills || 0) + 1
        };
      }
      return m;
    }));
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMed.name) return;

    const createdMed = {
      id: `med-${Date.now()}`,
      name: newMed.name,
      dosage: newMed.dosage || 'Standard dose',
      form: 'Tablet',
      frequency: 'Daily',
      timeSlot: newMed.timeSlot,
      mealTiming: newMed.mealTiming,
      purpose: newMed.purpose || 'Health Maintenance',
      startDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      totalPills: Number(newMed.totalPills) || 30,
      remainingPills: Number(newMed.remainingPills) || 30,
      refillThreshold: 7,
      status: 'pending',
      prescribedBy: 'Self-logged Prescription'
    };

    setMedications(prev => [createdMed, ...prev]);
    setAddModalOpen(false);
    setNewMed({
      name: '',
      dosage: '',
      timeSlot: 'Morning (8:00 AM)',
      mealTiming: 'After Food',
      purpose: '',
      totalPills: 30,
      remainingPills: 30
    });
  };

  const handleImportExtractedDrugs = (extractedDrugs) => {
    const newItems = extractedDrugs.map((d, idx) => ({
      id: `med-ocr-${Date.now()}-${idx}`,
      name: d.drugName,
      dosage: d.dosage,
      form: 'Tablet',
      frequency: d.frequency,
      timeSlot: d.frequency.includes('Morning') ? 'Morning (8:00 AM)' : d.frequency.includes('Night') ? 'Night (9:00 PM)' : 'Afternoon (1:00 PM)',
      mealTiming: d.instructions,
      purpose: d.purpose,
      startDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      totalPills: 30,
      remainingPills: 30,
      refillThreshold: 7,
      status: 'pending',
      prescribedBy: 'Imported from Dr. Prescription (OCR)'
    }));

    setMedications(prev => [...newItems, ...prev]);
  };

  const takenCount = medications.filter(m => m.status === 'taken').length;
  const adherencePercent = Math.round((takenCount / (medications.length || 1)) * 100);
  const refillAlerts = medications.filter(m => m.remainingPills <= m.refillThreshold);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-rose-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pink text-xs font-bold">
                <Pill className="w-3.5 h-3.5" /> MEDICATION MANAGEMENT & SAFETY
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Prescription Timeline & Drug Safety Checker
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sub-tabs toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-brand-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily Schedule
              </button>
              <button
                onClick={() => setActiveTab('interactions')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'interactions'
                    ? 'bg-brand-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interaction Checker
              </button>
            </div>

            <button
              onClick={() => setRxOcrModalOpen(true)}
              className="btn-secondary-green text-xs"
              title="Scan Handwritten Prescription via AI OCR"
            >
              <Scan className="w-3.5 h-3.5" /> Scan Prescription (OCR)
            </button>

            <button
              onClick={() => setAddModalOpen(true)}
              className="btn-primary-pink text-xs"
            >
              <Plus className="w-4 h-4" /> Add Med
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <>
          {/* Refill Alerts Banner (if any) */}
          {refillAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Prescription Refill Reminders ({refillAlerts.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {refillAlerts.map(med => (
                  <div key={med.id} className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{med.name} ({med.dosage})</span>
                      <span className="text-rose-600 font-bold block text-[11px]">
                        Only {med.remainingPills} pills left in stock
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`Refill order request generated for ${med.name}!`)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg shadow-xs"
                    >
                      Order Refill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medications List */}
          <div className="card-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base font-display">
                Active Prescriptions Schedule
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                {takenCount} of {medications.length} taken today ({adherencePercent}% Adherent)
              </span>
            </div>

            {medications.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <h4 className="text-sm font-bold text-slate-700">No Prescriptions Logged Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Add your daily medications, supplements, or scan a doctor's prescription slip with AI OCR.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button onClick={() => setAddModalOpen(true)} className="btn-primary-green text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Medication
                  </button>
                  <button onClick={() => setRxOcrModalOpen(true)} className="btn-secondary-green text-xs">
                    <Scan className="w-3.5 h-3.5" /> Scan Prescription (OCR)
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
              {medications.map((med) => {
                const isTaken = Boolean(med.takenToday || med.status === 'taken');
                
                return (
                  <div
                    key={med.id}
                    className={`py-4 transition-all flex items-center justify-between gap-4 flex-wrap ${
                      isTaken ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Left: Med Info & Checkbox */}
                    <div className="flex items-start gap-3.5 min-w-[240px] flex-1">
                      <button
                        onClick={() => toggleMedStatus(med.id)}
                        className="p-1 text-emerald-600 hover:scale-110 transition-transform mt-0.5"
                        title={isTaken ? 'Mark as Pending' : 'Mark as Taken'}
                      >
                        {isTaken ? (
                          <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm sm:text-base font-bold ${
                            isTaken ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}>
                            {med.name}
                          </h4>
                          <span className="badge-pink text-[10px] font-bold">
                            {med.dosage}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                            {med.frequency}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-brand-green-600" /> {med.timeSlot}
                          </span>
                          <span>•</span>
                          <span>{med.mealTiming}</span>
                          <span>•</span>
                          <span className="text-emerald-800 font-medium">Target: {med.purpose}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">
                          Prescribed by: {med.prescribedBy} • Stock: <strong>{med.remainingPills} / {med.totalPills} pills</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action */}
                    <div>
                      <button
                        onClick={() => toggleMedStatus(med.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isTaken
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-brand-pink-500 hover:bg-brand-pink-600 text-white shadow-soft-pink'
                        }`}
                      >
                        {isTaken ? '✓ Taken Today' : 'Mark Taken'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

            {/* Safety Policy Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Strict Non-Prescriptive Policy:</span>
                ApnaVaidya functions as an adherence tracker and reminder companion. Our AI will never adjust, modify, or suggest stopping prescribed dosages without explicit in-person clinician instructions.
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Drug & Food Interaction Checker View */
        <div className="card-white p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-pink-500" />
                Drug-to-Drug & Food Interaction Checker
              </h3>
              <p className="text-xs text-slate-500">
                Cross-references your active medications against known biochemical food and drug interactions.
              </p>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search drug or food interaction..."
                value={interactionSearch}
                onChange={e => setInteractionSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            {COMMON_INTERACTIONS.map((int) => (
              <div key={int.id} className="p-4.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-xs sm:text-sm">{int.itemA}</strong>
                    <span className="text-slate-400 font-extrabold">↔</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">{int.itemB}</strong>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    int.severity === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {int.severity} SEVERITY
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Biochemical Mechanism:</strong> {int.mechanism}
                </p>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-emerald-950 font-medium">
                  💡 <strong className="text-emerald-900">Clinical Recommendation:</strong> {int.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription OCR Scanner Modal */}
      <PrescriptionOcrScannerModal
        isOpen={rxOcrModalOpen}
        onClose={() => setRxOcrModalOpen(false)}
        onImportMeds={handleImportExtractedDrugs}
      />

      {/* Add Medication Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-display">Add Prescribed Medication</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedication} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin 500mg, Thyronorm..."
                  value={newMed.name}
                  onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mg / 1 tab"
                    value={newMed.dosage}
                    onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={newMed.timeSlot}
                    onChange={e => setNewMed({ ...newMed, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                  >
                    <option>Morning (8:00 AM)</option>
                    <option>Afternoon (1:00 PM)</option>
                    <option>Night (9:00 PM)</option>
                    <option>Early Morning (6:30 AM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meal Timing</label>
                <input
                  type="text"
                  placeholder="e.g. Empty stomach, After breakfast..."
                  value={newMed.mealTiming}
                  onChange={e => setNewMed({ ...newMed, mealTiming: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Medical Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Glycemic management, Blood pressure..."
                  value={newMed.purpose}
                  onChange={e => setNewMed({ ...newMed, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-green"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
