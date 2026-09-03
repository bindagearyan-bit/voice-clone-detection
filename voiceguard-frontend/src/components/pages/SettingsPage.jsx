import React from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Lock, 
  Sliders, 
  Server, 
  Trash2, 
  RotateCcw, 
  Info,
  Smartphone,
  Cpu
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const SettingsPage = () => {
  const { settings, setSettings, setCallHistory } = useVoiceGuard();

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all call history logs?')) {
      setCallHistory([]);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            Configuration Panel
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            VoiceGuard Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Customize real-time voice monitoring thresholds, alerts, and privacy rules
          </p>
        </div>

        <button
          onClick={() => {
            setSettings({
              realtimeMonitoring: true,
              unknownCallerProtection: true,
              highRiskAlerts: true,
              consecutiveHighRiskThreshold: 3,
              pushNotifications: true,
              warningSound: true,
              hapticVibration: true,
              threatAlertsOnly: false,
              audioRetention: 'hashes_only',
              theme: 'light',
            });
          }}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: PROTECTION */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              Real-Time Voice Protection
            </h3>
          </div>

          <div className="space-y-3.5">
            {/* Toggle 1: Real-time monitoring */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Real-Time Voice Monitoring</h4>
                <p className="text-[11px] text-slate-500">Automatically slice incoming audio into 2s chunks</p>
              </div>
              <input
                type="checkbox"
                checked={settings.realtimeMonitoring}
                onChange={(e) => updateSetting('realtimeMonitoring', e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Toggle 2: Unknown Caller Protection */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Unknown Caller Auto-Scan</h4>
                <p className="text-[11px] text-slate-500">Prioritize calls from unregistered numbers</p>
              </div>
              <input
                type="checkbox"
                checked={settings.unknownCallerProtection}
                onChange={(e) => updateSetting('unknownCallerProtection', e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Toggle 3: High-Risk Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Emergency Threat Overlay</h4>
                <p className="text-[11px] text-slate-500">Display full warning screen on high spoof score</p>
              </div>
              <input
                type="checkbox"
                checked={settings.highRiskAlerts}
                onChange={(e) => updateSetting('highRiskAlerts', e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Slider: Consecutive Threshold */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Consecutive High-Risk Chunks:</span>
                <span className="font-bold text-blue-600">{settings.consecutiveHighRiskThreshold} Chunks (6s)</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={settings.consecutiveHighRiskThreshold}
                onChange={(e) => updateSetting('consecutiveHighRiskThreshold', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: NOTIFICATIONS */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              Alerts & Sensory Feedback
            </h3>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Push Notifications</h4>
                <p className="text-[11px] text-slate-500">Receive alerts when calls finish or threats are found</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Audible Warning Chimes</h4>
                <p className="text-[11px] text-slate-500">Play subtle warning tones in earpiece on high risk</p>
              </div>
              <input
                type="checkbox"
                checked={settings.warningSound}
                onChange={(e) => updateSetting('warningSound', e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Haptic Vibration Pulse</h4>
                <p className="text-[11px] text-slate-500">Vibrate phone on potential synthetic voice</p>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticVibration}
                onChange={(e) => updateSetting('hapticVibration', e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: PRIVACY & DATA */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              Privacy & Audio Retention
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">Audio Data Policy</label>
              <select
                value={settings.audioRetention}
                onChange={(e) => updateSetting('audioRetention', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
              >
                <option value="hashes_only">Store Cryptographic Hashes Only (Recommended)</option>
                <option value="do_not_store">Zero Storage (Discard audio immediately)</option>
                <option value="7_days">Retain Raw WAV for 7 Days (Forensics)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={clearHistory}
                className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Call History Database</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: SYSTEM & TELEMETRY */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              System & Model Information
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-600">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Model Pipeline:</span>
              <span className="font-bold text-slate-900">VoiceGuard-v1.2 (Neural Core)</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">WebSocket Endpoint:</span>
              <span className="font-bold text-blue-600">ws://localhost:8000/ws/audio-stream</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Version:</span>
              <span className="font-bold text-slate-900">v1.2.0-SIH-Edition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
