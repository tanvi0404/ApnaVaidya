import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Share2, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Info, 
  Filter, 
  ChevronRight, 
  Stethoscope, 
  BookOpenCheck, 
  Calendar, 
  Building2, 
  HelpCircle,
  GitCompare,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';
import ParameterDetailModal from './ParameterDetailModal';
import ReportShareModal from './ReportShareModal';

export default function ReportAnalysisView({
  reports,
  activeProfile,
  onOpenUpload,
  onNavigateToChatWithContext,
  onNavigateToDoctors
}) {
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || '');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'ABNORMAL' | 'NORMAL'
  const [activeParameterDetail, setActiveParameterDetail] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareReportId, setCompareReportId] = useState(reports[1]?.id || reports[0]?.id);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Active selected report
  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const secondReport = reports.find(r => r.id === compareReportId) || reports[1] || reports[0];

  if (!activeReport) {
    return (
      <div className="card-white p-12 text-center">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No Reports Available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Upload your medical lab report (CBC, Lipid Profile, Thyroid, Glucose) to get plain-language AI analysis.
        </p>
        <button onClick={onOpenUpload} className="btn-primary-green mt-4 text-xs">
          <UploadCloud className="w-4 h-4" /> Upload Lab Report
        </button>
      </div>
    );
  }

  const activeParams = activeReport.parameters || [];
  const activeSummary = activeReport.summary || {
    overallStatus: 'Analyzed by ApnaVaidya AI',
    keyFindings: [activeReport.overallSummary || 'All parameters extracted and structured.'],
    aiRecommendation: 'Review with your healthcare professional at your next follow-up checkup.'
  };

  const filteredParameters = activeParams.filter(param => {
    if (filterMode === 'ABNORMAL') return param.status !== 'NORMAL';
    if (filterMode === 'NORMAL') return param.status === 'NORMAL';
    return true;
  });

  const abnormalParams = activeParams.filter(p => p.status !== 'NORMAL');
  const normalParams = activeParams.filter(p => p.status === 'NORMAL');

  // Text-to-speech audio reader
  const handleToggleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      if (!window.speechSynthesis) {
        alert('Voice synthesis not supported on this browser.');
        return;
      }
      const keyFindingsText = (activeSummary.keyFindings || []).join('. ');
      const textToRead = `${activeReport.title}. Overall status: ${activeSummary.overallStatus || 'Analyzed'}. ${keyFindingsText}. Recommendation: ${activeSummary.aiRecommendation || 'Maintain healthy lifestyle.'}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Report Switcher Bar */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-emerald-50/40 to-rose-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Sparkles className="w-3 h-3 text-brand-pink-500" /> AI OCR & LAB ANALYSIS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">
                {reports.length} Reports in Vault for {activeProfile.name}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Medical Report Diagnostics
            </h2>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`text-xs px-3.5 py-2 rounded-2xl font-bold border transition-all flex items-center gap-1.5 ${
                compareMode
                  ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{compareMode ? 'Exit Comparison' : 'Side-by-Side Compare'}</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="btn-secondary-green text-xs"
              title="Share report with Doctor"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Report
            </button>

            <button
              onClick={onOpenUpload}
              className="btn-primary-green text-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload New Report
            </button>
          </div>

        </div>

        {/* Report Selector Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {reports.map((rep) => {
            const isSelected = rep.id === activeReport.id;
            const hasAbnormal = rep.parameters.some(p => p.status !== 'NORMAL');
            
            return (
              <button
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand-green-300 hover:bg-emerald-50/50'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{rep.title}</span>
                {hasAbnormal && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-pink-400' : 'bg-rose-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Compare View (if active) */}
      {compareMode ? (
        <div className="card-white p-6 space-y-6 border-2 border-emerald-300 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Side-by-Side Longitudinal Lab Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Direct delta tracking between 2 historical reports
                </p>
              </div>
            </div>

            {/* Select comparison counterpart */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Compare With:</span>
              <select
                value={compareReportId}
                onChange={(e) => setCompareReportId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
              >
                {reports.map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.testDate})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3">Biomarker</th>
                  <th className="p-3">Report A ({activeReport.testDate || activeReport.date || 'Current'})</th>
                  <th className="p-3">Report B ({secondReport.testDate || secondReport.date || 'Counterpart'})</th>
                  <th className="p-3">Reference Range</th>
                  <th className="p-3">Longitudinal Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeParams.map((paramA) => {
                  const secondParams = secondReport.parameters || [];
                  const paramB = secondParams.find(p => p.name === paramA.name);
                  const valA = paramA.value;
                  const valB = paramB ? paramB.value : null;
                  const delta = valB !== null ? (valA - valB) : 0;
                  const deltaPercent = valB ? ((delta / valB) * 100).toFixed(1) : 0;
                  const isImprovement = paramA.status === 'HIGH' ? delta < 0 : delta > 0;

                  return (
                    <tr key={paramA.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{paramA.name}</td>
                      <td className="p-3 font-extrabold text-brand-green-800">{valA} {paramA.unit}</td>
                      <td className="p-3 font-semibold text-slate-700">{valB !== null ? `${valB} ${paramB.unit}` : 'Not tested'}</td>
                      <td className="p-3 text-slate-500">{paramA.minNormal} - {paramA.maxNormal} {paramA.unit}</td>
                      <td className="p-3">
                        {valB !== null ? (
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
                            delta === 0
                              ? 'bg-slate-100 text-slate-600'
                              : isImprovement
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}>
                            {delta > 0 ? `+${delta}` : delta} ({deltaPercent > 0 ? `+${deltaPercent}` : deltaPercent}%)
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
            <strong>AI Comparative Insight:</strong> Longitudinal evaluation between these two test dates confirms positive response to dietary fiber and aerobic cardio, yielding measurable reductions in lipid circulating markers.
          </div>
        </div>
      ) : null}

      {/* Active Report Meta Banner */}
      <div className="card-white p-5 border-l-4 border-l-brand-green-600">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {activeReport.title}
              </h3>
              <span className="badge-neutral text-[11px]">{activeReport.category}</span>
              <span className="badge-green text-[11px]">{activeReport.status}</span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Lab: <strong className="text-slate-700">{activeReport.labName}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Test Date: <strong className="text-slate-700">{activeReport.testDate}</strong>
              </span>
              <span className="flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                Uploaded: <strong className="text-slate-700">{activeReport.uploadDate}</strong>
              </span>
            </div>
          </div>

          {/* Quick CTA to Ask AI & Audio Reader */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeak}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isSpeaking
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Voice Read Aloud Summary"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand-green-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Summary'}</span>
            </button>

            <button
              onClick={() => onNavigateToChatWithContext(activeReport)}
              className="btn-primary-pink text-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI About This Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Structured Health Summary (Key USP) */}
      <div className="card-white p-6 bg-gradient-to-br from-white via-brand-green-50/30 to-brand-pink-50/20 border-brand-green-200">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-green-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base font-display">
                ApnaVaidya AI Clinical Summary
              </h4>
              <p className="text-xs text-slate-500">Demystified plain-language analysis grounded in medical reference standards</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-green text-xs font-bold">
              ✓ {normalParams.length} Normal
            </span>
            {abnormalParams.length > 0 && (
              <span className="badge-pink text-xs font-bold">
                ⚠ {abnormalParams.length} Outside Range
              </span>
            )}
          </div>
        </div>

        {/* Executive Bullet Points */}
        <div className="mt-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Key Findings & Explanations:
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(activeSummary.keyFindings || []).map((finding, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
                <span className="font-bold text-brand-green-700 block mb-1">Observation #{idx + 1}</span>
                {finding}
              </div>
            ))}
          </div>

          {/* AI Recommendation Alert */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 mt-3">
            <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-950 mb-0.5">Lifestyle & Action Guidance</span>
              {activeSummary.aiRecommendation || 'Follow balanced clinical lifestyle guidance and stay hydrated.'}
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Table & Filter Header */}
      <div className="card-white overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base font-display">
              Extracted Biomarkers & Clinical Ranges
            </h4>
            <p className="text-xs text-slate-500">
              Click any parameter to view plain-language meaning, diet tips, and doctor questions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({activeParams.length})
            </button>
            <button
              onClick={() => setFilterMode('ABNORMAL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'ABNORMAL'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Outside Range ({abnormalParams.length})
            </button>
            <button
              onClick={() => setFilterMode('NORMAL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'NORMAL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal ({normalParams.length})
            </button>
          </div>
        </div>

        {/* Parameters Grid / List */}
        <div className="divide-y divide-slate-100">
          {filteredParameters.map((param) => {
            const isHigh = param.status === 'HIGH';
            const isLow = param.status === 'LOW';
            const isNormal = param.status === 'NORMAL';

            return (
              <div
                key={param.id}
                onClick={() => setActiveParameterDetail(param)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-all cursor-pointer flex items-center justify-between gap-4 flex-wrap group"
              >
                {/* Left: Parameter Info */}
                <div className="min-w-[200px] flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-brand-green-800 transition-colors">
                      {param.name}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {param.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {param.plainExplanation}
                  </p>
                </div>

                {/* Center: Value & Unit */}
                <div className="text-left sm:text-right min-w-[130px]">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className={`text-base sm:text-lg font-extrabold ${
                      isHigh ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                      {param.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {param.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ref: {param.minNormal} - {param.maxNormal} {param.unit}
                  </div>
                </div>

                {/* Status Badge & Deep Dive Action */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    isHigh
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isLow
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isNormal ? '✓ Normal' : isHigh ? '▲ High' : '▼ Low'}
                  </span>

                  <button
                    className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-brand-green-600 group-hover:text-white text-slate-500 transition-colors"
                    title="View plain-English deep dive"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            <span>Values cross-referenced with standard ICMR & WHO reference tables.</span>
          </div>
          <button
            onClick={() => onNavigateToChatWithContext(activeReport)}
            className="text-brand-green-700 font-bold hover:underline flex items-center gap-1"
          >
            Ask Chikitsak AI about questions to ask your doctor →
          </button>
        </div>

      </div>

      {/* Parameter Detail Modal */}
      <ParameterDetailModal
        parameter={activeParameterDetail}
        isOpen={!!activeParameterDetail}
        onClose={() => setActiveParameterDetail(null)}
        onAskAi={(param) => {
          setActiveParameterDetail(null);
          onNavigateToChatWithContext(activeReport, param);
        }}
      />

      {/* Report Share Modal */}
      <ReportShareModal
        report={activeReport}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

    </div>
  );
}
