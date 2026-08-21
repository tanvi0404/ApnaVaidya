import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  Activity, 
  Info, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TrendChart({ biomarkers = [] }) {
  const safeBiomarkers = Array.isArray(biomarkers) && biomarkers.length > 0 ? biomarkers : [];
  const [selectedBiomarkerId, setSelectedBiomarkerId] = useState(safeBiomarkers[0]?.id || '');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Sync selected biomarker when biomarkers change (profile switch)
  React.useEffect(() => {
    if (safeBiomarkers.length > 0 && !safeBiomarkers.some(b => b.id === selectedBiomarkerId)) {
      setSelectedBiomarkerId(safeBiomarkers[0].id);
    }
  }, [safeBiomarkers, selectedBiomarkerId]);

  if (safeBiomarkers.length === 0) {
    return (
      <div className="card-white p-8 text-center text-slate-500">
        <Activity className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="text-sm font-medium">No trend history available for this profile yet.</p>
      </div>
    );
  }

  const activeBiomarker = safeBiomarkers.find(b => b.id === selectedBiomarkerId) || safeBiomarkers[0];
  const history = activeBiomarker?.history || [];

  if (!activeBiomarker || history.length === 0) {
    return (
      <div className="card-white p-8 text-center text-slate-500">
        <Activity className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="text-sm font-medium">No biomarker data points recorded yet.</p>
      </div>
    );
  }

  // Chart dimensions & math
  const width = 600;
  const height = 240;
  const paddingX = 50;
  const paddingY = 35;

  const minNormal = typeof activeBiomarker.minNormal === 'number' ? activeBiomarker.minNormal : 0;
  const maxNormal = typeof activeBiomarker.maxNormal === 'number' ? activeBiomarker.maxNormal : 100;

  const values = history.map(h => h.value);
  const minVal = Math.min(...values, minNormal);
  const maxVal = Math.max(...values, maxNormal);
  const valMargin = (maxVal - minVal) * 0.25 || 1;
  const chartMin = Math.max(0, minVal - valMargin);
  const chartMax = maxVal + valMargin;
  const chartSpan = chartMax - chartMin || 1;

  const getY = (val) => {
    return height - paddingY - ((val - chartMin) / chartSpan) * (height - 2 * paddingY);
  };

  const getX = (idx) => {
    return paddingX + (idx / (history.length - 1 || 1)) * (width - 2 * paddingX);
  };

  const points = history.map((h, idx) => ({
    x: getX(idx),
    y: getY(h.value),
    date: h.date,
    value: h.value,
    status: h.status
  }));

  // Path string
  const pathString = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Shaded area under path
  const areaString = points.length > 0 
    ? `${pathString} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  // Normal range zone band
  const normalYTop = getY(maxNormal);
  const normalYBottom = getY(minNormal);
  const normalBandHeight = Math.abs(normalYBottom - normalYTop);

  const isImproving = activeBiomarker.changeType === 'improving';
  const isWorsening = activeBiomarker.changeType === 'worsening';

  return (
    <div className="card-white p-6 space-y-6">
      
      {/* Header & Biomarker Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-green text-xs font-bold">
              <Activity className="w-3 h-3 text-brand-green-600" /> LONGITUDINAL BIOMARKER TRENDS
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Historical Shift Analytics</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display mt-1">
            {activeBiomarker.name} Trajectory
          </h3>
        </div>

        {/* Delta Change Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
            isImproving
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : isWorsening
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {isImproving ? (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            ) : isWorsening ? (
              <TrendingUp className="w-4 h-4 text-rose-600" />
            ) : (
              <Minus className="w-4 h-4 text-slate-500" />
            )}
            <span>{activeBiomarker.changeDelta}</span>
          </div>
        </div>
      </div>

      {/* Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {biomarkers.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setSelectedBiomarkerId(b.id);
              setHoveredPointIndex(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              (selectedBiomarkerId === b.id || (!selectedBiomarkerId && b.id === biomarkers[0].id))
                ? 'bg-brand-green-700 text-white border-brand-green-700 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50/50 hover:border-brand-green-300'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* SVG Interactive Trend Chart */}
      <div className="relative bg-gradient-to-b from-slate-50/80 to-white p-4 rounded-2xl border border-slate-200/80">
        
        {/* Chart Top Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-2 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-green-600 inline-block" />
              <strong className="text-slate-800">Your Test Values ({activeBiomarker.unit})</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-2 rounded bg-emerald-200/70 border border-emerald-400 inline-block" />
              <span>Standard Target Range ({activeBiomarker.minNormal} - {activeBiomarker.maxNormal})</span>
            </span>
          </div>

          <div className="text-xs font-bold text-slate-700">
            Current: <span className="text-brand-green-700 font-extrabold">{activeBiomarker.currentValue} {activeBiomarker.unit}</span>
          </div>
        </div>

        {/* Responsive SVG Graphic */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-56 select-none"
          >
            <defs>
              {/* Green Gradient for Area Under Curve */}
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Reference Target Range Band (Shaded Green) */}
            <rect
              x={paddingX}
              y={normalYTop}
              width={width - 2 * paddingX}
              height={normalBandHeight}
              fill="#D1FAE5"
              fillOpacity="0.5"
              rx="4"
            />
            <line
              x1={paddingX}
              y1={normalYTop}
              x2={width - paddingX}
              y2={normalYTop}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.6"
            />
            <line
              x1={paddingX}
              y1={normalYBottom}
              x2={width - paddingX}
              y2={normalYBottom}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Area Fill */}
            <path
              d={areaString}
              fill="url(#trendGradient)"
            />

            {/* Main Trend Line */}
            <path
              d={pathString}
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Horizontal Grid lines */}
            {[chartMin, (chartMin + chartMax) / 2, chartMax].map((v, i) => (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={getY(v)}
                  x2={width - paddingX}
                  y2={getY(v)}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingX - 8}
                  y={getY(v) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontWeight="600"
                >
                  {Math.round(v)}
                </text>
              </g>
            ))}

            {/* Data Points on Line */}
            {points.map((pt, idx) => {
              const isHovered = hoveredPointIndex === idx;
              const isHigh = pt.status === 'HIGH';
              const isLow = pt.status === 'LOW';

              return (
                <g key={idx}>
                  {/* Outer circle halo */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 8 : 6}
                    fill={isHigh ? '#E11D48' : isLow ? '#D97706' : '#059669'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-150 shadow-md"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />

                  {/* Date label at bottom */}
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isHovered ? '#0F172A' : '#64748B'}
                  >
                    {pt.date}
                  </text>

                  {/* Value tag above point */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill={isHigh ? '#E11D48' : isLow ? '#D97706' : '#047857'}
                  >
                    {pt.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Tooltip Details */}
        {hoveredPointIndex !== null && (
          <div className="mt-2 p-3 bg-white rounded-xl border border-brand-green-200 shadow-md text-xs flex items-center justify-between animate-fadeIn">
            <span className="font-bold text-slate-800">
              📅 {points[hoveredPointIndex].date}: {points[hoveredPointIndex].value} {activeBiomarker.unit}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
              points[hoveredPointIndex].status === 'NORMAL'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-rose-50 text-rose-700'
            }`}>
              {points[hoveredPointIndex].status === 'NORMAL' ? 'Within Reference' : 'Outside Reference Target'}
            </span>
          </div>
        )}
      </div>

      {/* AI Longitudinal Shift Explanation (Core USP) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-green-50/70 via-white to-brand-pink-50/50 border border-brand-green-200 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-green-600 text-white rounded-lg shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-pink-300" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm font-display">
            AI Clinical Trend Interpretation
          </h4>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeBiomarker.aiTrendInsight}
        </p>

        <div className="p-3 bg-white/90 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span><strong>Physician Guidance:</strong> {activeBiomarker.guidance}</span>
        </div>
      </div>

    </div>
  );
}
