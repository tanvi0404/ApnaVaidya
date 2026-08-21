import React, { useState } from 'react';
import { 
  Dna, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Pill, 
  Zap, 
  Info, 
  Layers, 
  ArrowRight,
  GitCommit,
  FlaskConical
} from 'lucide-react';
import { 
  PHARMACOGENOMIC_PROFILES, 
  PGX_DRUG_GENE_DATABASE, 
  MTHFR_METHYLATION_CYCLE 
} from '../../data/genomicsData';
import { matchGenomicsBackend } from '../../services/apiClient';

export default function PharmacogenomicsView({ activeProfile }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL'); // 'ALL' | 'SAFE' | 'MODERATE'
  const [activeTab, setActiveTab] = useState('pgx'); // 'pgx' | 'methylation'
  const [backendMatches, setBackendMatches] = useState(null);

  const userPgx = PHARMACOGENOMIC_PROFILES[activeProfile.id] || PHARMACOGENOMIC_PROFILES['user-arjun'];

  // Sync with Java 17 Backend
  React.useEffect(() => {
    let isMounted = true;
    matchGenomicsBackend({ drug: 'Clopidogrel', gene: 'CYP2C19' }).then(res => {
      if (isMounted && res) {
        setBackendMatches(res);
      }
    }).catch(err => console.warn('Genomics client fallback:', err));

    return () => { isMounted = false; };
  }, [activeProfile.id]);

  const filteredDrugs = PGX_DRUG_GENE_DATABASE.filter(item => {
    const matchesSearch = item.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.primaryGene.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || item.clinicalRisk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Dna className="w-3.5 h-3.5 text-emerald-600" /> PHARMACOGENOMICS (PGX) & EPIGENETICS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{activeProfile.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Precision Drug-Gene Compatibility & Methylation Engine
            </h2>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('pgx')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'pgx'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Drug-Gene PGx Matcher
            </button>
            <button
              onClick={() => setActiveTab('methylation')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'methylation'
                  ? 'bg-brand-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MTHFR Methylation Navigator
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'pgx' ? (
        /* Drug-Gene PGx Matcher View */
        <div className="space-y-6">
          
          {/* Active Profile Genotype Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card-white p-4 space-y-1 border-l-4 border-l-emerald-600">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">CYP2C19 Genotype</span>
              <strong className="text-sm font-extrabold text-slate-900 block">{userPgx.cyp2c19.genotype}</strong>
              <span className="text-[11px] text-emerald-800 font-semibold">{userPgx.cyp2c19.phenotype}</span>
            </div>

            <div className="card-white p-4 space-y-1 border-l-4 border-l-amber-500">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">SLCO1B1 (Statin Transporter)</span>
              <strong className="text-sm font-extrabold text-slate-900 block">{userPgx.slco1b1.genotype}</strong>
              <span className="text-[11px] text-amber-900 font-semibold">{userPgx.slco1b1.phenotype}</span>
            </div>

            <div className="card-white p-4 space-y-1 border-l-4 border-l-emerald-600">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">CYP2D6 Genotype</span>
              <strong className="text-sm font-extrabold text-slate-900 block">{userPgx.cyp2d6.genotype}</strong>
              <span className="text-[11px] text-emerald-800 font-semibold">{userPgx.cyp2d6.phenotype}</span>
            </div>

            <div className="card-white p-4 space-y-1 border-l-4 border-l-amber-500">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">MTHFR Folate Gene</span>
              <strong className="text-sm font-extrabold text-slate-900 block">{userPgx.mthfr.genotype.split(' ')[0]}</strong>
              <span className="text-[11px] text-amber-900 font-semibold">Reduced Conversion</span>
            </div>
          </div>

          {/* Search & Risk Filter Controls */}
          <div className="card-white p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search drug (e.g. Atorvastatin, Clopidogrel, Folate)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green-400"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['ALL', 'SAFE', 'MODERATE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setRiskFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    riskFilter === cat
                      ? 'bg-brand-green-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All Drugs' : cat === 'SAFE' ? '✓ Standard Dosing' : '⚠️ Actionable / Adjusted'}
                </button>
              ))}
            </div>
          </div>

          {/* PGx Drug-Gene Interaction Cards */}
          <div className="space-y-4">
            {filteredDrugs.map((item) => {
              const isSafe = item.clinicalRisk === 'SAFE';

              return (
                <div
                  key={item.id}
                  className={`card-white p-6 space-y-4 border-l-4 transition-all ${
                    isSafe ? 'border-l-emerald-600' : 'border-l-amber-500 bg-amber-50/10'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                          {item.drugName}
                        </h3>
                        <span className="badge-neutral text-[10px] font-bold">
                          {item.primaryGene}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                        Patient Allele: <strong>{item.patientGenotype}</strong> • Phenotype: <strong>{item.phenotype}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        {item.fdaCpicGuideline}
                      </span>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                        isSafe
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      }`}>
                        {isSafe ? '✓ Standard Response' : '⚠️ Adjusted Recommendation'}
                      </span>
                    </div>
                  </div>

                  {/* Clinical Implication */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5">Biochemical & Pharmacokinetic Implication:</strong>
                    {item.clinicalImplication}
                  </div>

                  {/* Actionable Clinical Guidance */}
                  <div className={`p-4 rounded-2xl text-xs font-medium space-y-1 border ${
                    isSafe
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}>
                    <strong className={`block uppercase tracking-wider text-[10px] font-extrabold ${
                      isSafe ? 'text-emerald-900' : 'text-amber-900'
                    }`}>
                      💡 Clinician Pharmacogenomic Guidance:
                    </strong>
                    <p className="leading-relaxed">{item.actionableRecommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* MTHFR Methylation & Epigenetic Navigator View */
        <div className="space-y-6">
          
          {/* MTHFR Mechanism Banner */}
          <div className="card-white p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl space-y-4 shadow-xl border-emerald-900">
            <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                  Epigenetic 1-Carbon Metabolism
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  MTHFR C677T Enzyme Optimization Protocol
                </h3>
              </div>

              <span className="badge-pink text-xs font-bold">
                C677T Heterozygous (CT)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {MTHFR_METHYLATION_CYCLE.biologicalPathway}
            </p>

            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs text-emerald-300">
              💡 <strong>Key Takeaway:</strong> Because conversion of synthetic folic acid is ~35% slower in this genotype, supplying bio-identical methylated co-factors directly supports DNA methylation, neurotransmitter synthesis, and healthy cardiovascular homocysteine levels.
            </div>
          </div>

          {/* 4 Essential Bioactive Co-factors Grid */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Bioactive Methylation Co-factors (Bypassing Mutated Steps)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MTHFR_METHYLATION_CYCLE.keyCoFactors.map((cofactor, idx) => (
                <div key={idx} className="card-white p-5 space-y-2 border-l-4 border-l-emerald-600 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{cofactor.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {cofactor.role}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    High Bioavailability • Direct Cellular Utilization
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
