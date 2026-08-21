import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  Download, 
  ShieldCheck, 
  UploadCloud, 
  Search, 
  Dna, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Lock,
  Tag,
  Syringe,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { HEALTH_VAULT_ITEMS, FAMILY_HEREDITARY_HISTORY, VACCINATION_RECORDS } from '../../data/vaultData';

export default function HealthVaultView({ activeProfile }) {
  const [activeSubTab, setActiveSubTab] = useState('documents'); // 'documents' | 'vaccines' | 'hereditary'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vaultItems, setVaultItems] = useState(
    HEALTH_VAULT_ITEMS.filter(item => item.profileId === activeProfile.id || item.profileId === 'user-arjun')
  );

  const categories = ['ALL', 'Lab Report', 'Prescription', 'Insurance Policy', 'Discharge Summary'];
  const profileVaccines = VACCINATION_RECORDS[activeProfile.id] || VACCINATION_RECORDS['user-arjun'];

  const filteredItems = vaultItems.filter(item => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-teal-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <FolderLock className="w-3.5 h-3.5 text-brand-green-600" /> ENCRYPTED PERSONAL HEALTH RECORD
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Personal Health Vault & Records
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Sub-tabs toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveSubTab('documents')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSubTab === 'documents'
                    ? 'bg-brand-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveSubTab('vaccines')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSubTab === 'vaccines'
                    ? 'bg-brand-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vaccine Tracker
              </button>
              <button
                onClick={() => setActiveSubTab('hereditary')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSubTab === 'hereditary'
                    ? 'bg-brand-green-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hereditary Risk
              </button>
            </div>

            <button
              onClick={() => alert('Secure file added to encrypted health vault!')}
              className="btn-primary-green text-xs"
            >
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'documents' && (
        /* Document Organizer & Search */
        <div className="card-white p-6 space-y-4">
          
          {/* Search and Categories */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display">
                Stored Clinical Documents & Insurance Policies
              </h3>
              <p className="text-xs text-slate-500">
                Zero-knowledge encrypted client-side health records
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[200px] w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search documents, policies, bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-brand-green-300'
                }`}
              >
                {cat === 'ALL' ? 'All Documents' : cat}
              </button>
            ))}
          </div>

          {/* Vault Items List */}
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="py-4 hover:bg-slate-50/70 p-3 rounded-2xl transition-all flex items-center justify-between gap-4 flex-wrap group"
              >
                <div className="flex items-start gap-3 min-w-[240px] flex-1">
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-green-900 transition-colors">
                        {item.title}
                      </h4>
                      <span className="badge-neutral text-[10px]">{item.category}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span>Issuer: <strong className="text-slate-700">{item.issuer}</strong></span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="text-slate-400">{item.fileSize} ({item.fileType})</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Downloading decrypted copy of "${item.title}"...`)}
                    className="btn-outline-white text-xs py-1.5 px-3"
                    title="Download Decrypted File"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {activeSubTab === 'vaccines' && (
        /* Vaccine & Immunization Tracker View */
        <div className="card-white p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display flex items-center gap-2">
                <Syringe className="w-4 h-4 text-emerald-600" />
                Vaccination & Immunization Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Adult & routine vaccination schedule tracking for {activeProfile.name}
              </p>
            </div>

            <button
              onClick={() => alert('New vaccine record entry saved!')}
              className="btn-secondary-green text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Log Vaccine
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {profileVaccines.map((vac) => {
              const isCompleted = vac.status === 'COMPLETED';
              const isDue = vac.status === 'DUE';

              return (
                <div key={vac.id} className="py-4 flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 min-w-[240px] flex-1">
                    <div className={`p-2.5 rounded-xl font-bold mt-0.5 flex-shrink-0 ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      <Syringe className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-bold text-slate-900">{vac.name}</strong>
                        <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isDue
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {vac.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                        <span>Last Dose: <strong>{vac.lastGiven}</strong></span>
                        <span>•</span>
                        <span>Due Date: <strong>{vac.dueDate}</strong></span>
                        <span>•</span>
                        <span>{vac.dose}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1.5">
                        {vac.notes}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => alert(`Vaccination status updated for ${vac.name}!`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isCompleted ? 'btn-outline-white' : 'btn-primary-green'
                      }`}
                    >
                      {isCompleted ? 'View Certificate' : 'Mark Administered'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'hereditary' && (
        /* Hereditary Medical History & Genetic Awareness */
        <div className="card-white p-6 bg-gradient-to-br from-white via-brand-pink-50/20 to-brand-green-50/30 border-emerald-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-brand-pink-500 to-rose-600 text-white rounded-xl shadow-xs">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Family Medical History & Hereditary Risk Context
                </h3>
                <p className="text-xs text-slate-500">
                  AI contextualizes your diagnostic report thresholds based on documented genetic risk factors.
                </p>
              </div>
            </div>

            <span className="badge-pink text-xs font-bold">
              3 Conditions Documented
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
            {FAMILY_HEREDITARY_HISTORY.map((item, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.relation}
                  </span>
                  <span className="badge-pink text-[10px]">
                    {item.riskLevel}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {item.condition}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  💡 {item.aiContextImpact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
