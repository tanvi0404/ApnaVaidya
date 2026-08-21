import React, { useState } from 'react';
import { 
  Watch, 
  Activity, 
  Heart, 
  Flame, 
  Moon, 
  RefreshCw, 
  CheckCircle2, 
  BatteryCharging, 
  Sparkles, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { WEARABLES_DATA } from '../../data/advancedData';
import { fetchWearablesSyncBackend } from '../../services/apiClient';

export default function WearablesView({ activeProfile }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState(null);

  const deviceData = WEARABLES_DATA[activeProfile.id] || WEARABLES_DATA['user-arjun'];
  const metrics = liveMetrics || deviceData.metrics;

  const handleSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    fetchWearablesSyncBackend(activeProfile.id).then(res => {
      setIsSyncing(false);
      setSyncSuccess(true);
      if (res) {
        setLiveMetrics({
          heartRate: `${res.restingHeartRate} bpm`,
          hrv: `${res.hrvMs} ms`,
          vo2Max: `${res.vo2Max} mL/kg/min`,
          steps: res.dailySteps.toLocaleString(),
          sleep: `${Math.floor(res.sleepScore / 10)}h ${res.sleepScore % 60}m`,
          spo2: `${res.spo2Percent}%`
        });
      }
      setTimeout(() => setSyncSuccess(false), 2500);
    }).catch(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="card-white p-5 bg-gradient-to-r from-white via-teal-50/40 to-emerald-50/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-green text-xs font-bold">
                <Watch className="w-3.5 h-3.5 text-teal-600" /> LIVE WEARABLE BIOMETRICS
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">{deviceData.device}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-1">
              Continuous Vitals & Activity Integration
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="btn-primary-green text-xs flex items-center gap-2 shadow-soft-green"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Vitals...' : syncSuccess ? '✓ Synced Just Now' : 'Sync Device Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Device Connection Status Card */}
      <div className="card-white p-4 bg-slate-900 text-white flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-emerald-400">
            <Watch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-sm">{deviceData.device}</strong>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-300 font-bold uppercase">{deviceData.syncStatus}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Last synced: {deviceData.lastSync} • Battery: {deviceData.battery}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Encrypted BLE & HealthKit Stream</span>
        </div>
      </div>

      {/* Live Biometric Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Metric 1: Daily Steps */}
        <div className="card-white p-5 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Daily Movement</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{metrics.steps.percentage}% Goal</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{metrics.steps.current.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-semibold">/ {metrics.steps.goal.toLocaleString()} steps</span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${metrics.steps.percentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Resting Heart Rate */}
        <div className="card-white p-5 border-l-4 border-l-rose-500 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Resting Heart Rate</span>
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">{metrics.restingHeartRate.status}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 flex items-center gap-1.5">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
              {metrics.restingHeartRate.current}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{metrics.restingHeartRate.unit}</span>
          </div>

          <p className="text-[11px] text-slate-500">
            Optimal baseline: {metrics.restingHeartRate.optimal} bpm
          </p>
        </div>

        {/* Metric 3: Heart Rate Variability (HRV) */}
        <div className="card-white p-5 border-l-4 border-l-teal-500 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Heart Rate Variability (HRV)</span>
            <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{metrics.heartRateVariability.status}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-teal-700">{metrics.heartRateVariability.current}</span>
            <span className="text-xs text-slate-500 font-semibold">{metrics.heartRateVariability.unit}</span>
          </div>

          <p className="text-[11px] text-slate-500">
            Autonomous nervous system recovery is optimal.
          </p>
        </div>

        {/* Metric 4: Blood Oxygen (SpO2) */}
        <div className="card-white p-5 border-l-4 border-l-brand-green-600 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Blood Oxygen (SpO2)</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{metrics.spo2.status}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-green-700">{metrics.spo2.current}</span>
            <span className="text-xs text-slate-500 font-semibold">{metrics.spo2.unit}</span>
          </div>

          <p className="text-[11px] text-slate-500">
            Normal arterial oxygen saturation (&gt; 95%).
          </p>
        </div>

        {/* Metric 5: Active Calories Burned */}
        <div className="card-white p-5 border-l-4 border-l-amber-500 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Active Burn</span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">{metrics.activeCalories.percentage}% Goal</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-900">{metrics.activeCalories.current}</span>
            <span className="text-xs text-slate-500 font-semibold">/ {metrics.activeCalories.goal} {metrics.activeCalories.unit}</span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
              style={{ width: `${metrics.activeCalories.percentage}%` }}
            />
          </div>
        </div>

        {/* Metric 6: Sleep Duration */}
        <div className="card-white p-5 border-l-4 border-l-brand-pink-400 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Sleep Duration</span>
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">{metrics.sleepDuration.percentage}% Target</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-800">{metrics.sleepDuration.current}</span>
            <span className="text-xs text-slate-500 font-semibold">{metrics.sleepDuration.unit}</span>
          </div>

          <p className="text-[11px] text-slate-500">
            Target: {metrics.sleepDuration.goal} hrs uninterrupted sleep.
          </p>
        </div>

      </div>

      {/* Heart Rate Intensity Zones */}
      <div className="card-white p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base font-display flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Today's Heart Rate Intensity Zones
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deviceData.heartRateZones.map((zone, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{zone.name}</span>
                <span className="badge-green text-[10px]">{zone.range}</span>
              </div>
              <div className="text-lg font-extrabold text-brand-green-800">{zone.duration}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
