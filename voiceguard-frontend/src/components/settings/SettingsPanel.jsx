import React from 'react';
import { 
  Settings, 
  Sliders, 
  Bell, 
  Vibrate, 
  Server, 
  ShieldCheck, 
  RotateCcw,
  Zap,
  Volume2
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const SettingsPanel = () => {
  const { settings, setSettings } = useCall();

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetDefaults = () => {
    setSettings({
      highRiskThreshold: 80,
      moderateRiskThreshold: 40,
      autoBlockAfterHighChunks: 3,
      soundAlertsEnabled: true,
      hapticFeedbackEnabled: true,
      webSocketLatencyMs: 820,
      modelName: 'VoiceGuard-v1.2 (Neural Core)',
    });
  };

  return (
    <div className="neumorph-card p-6 rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyber-card border border-cyber-border text-cyber-cyan shadow-glow-cyan">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              VoiceGuard Engine & Model Settings
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal">
                Config
              </span>
            </h2>
            <p className="text-xs text-cyber-muted">
              Configure detection thresholds, alerting triggers, and backend telemetry
            </p>
          </div>
        </div>

        <button
          onClick={resetDefaults}
          className="px-3 py-1.5 rounded-xl bg-cyber-surface hover:bg-cyber-cardElevated border border-cyber-border text-xs font-mono text-cyber-muted hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: AI Model Thresholds */}
        <div className="p-4 rounded-2xl bg-cyber-surface border border-cyber-border space-y-4">
          <h3 className="text-xs font-bold text-cyber-cyan uppercase font-mono flex items-center gap-2 border-b border-cyber-border/60 pb-2">
            <Sliders className="w-4 h-4" />
            Detection & Risk Thresholds
          </h3>

          {/* High Risk Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyber-muted">High Risk (Deepfake) Threshold:</span>
              <span className="font-bold text-cyber-danger">{settings.highRiskThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={settings.highRiskThreshold}
              onChange={(e) => updateSetting('highRiskThreshold', Number(e.target.value))}
              className="w-full accent-cyber-danger cursor-pointer h-2 bg-cyber-bg rounded-lg"
            />
            <span className="text-[10px] text-cyber-muted block">
              Scores above {settings.highRiskThreshold}% trigger emergency screen overlay & buzz.
            </span>
          </div>

          {/* Moderate Risk Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyber-muted">Moderate Risk (Warning) Threshold:</span>
              <span className="font-bold text-cyber-warning">{settings.moderateRiskThreshold}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={settings.moderateRiskThreshold}
              onChange={(e) => updateSetting('moderateRiskThreshold', Number(e.target.value))}
              className="w-full accent-cyber-warning cursor-pointer h-2 bg-cyber-bg rounded-lg"
            />
            <span className="text-[10px] text-cyber-muted block">
              Scores between {settings.moderateRiskThreshold}% - {settings.highRiskThreshold}% mark the call as suspicious.
            </span>
          </div>

          {/* Consecutive Chunks to Auto-Block */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyber-muted">Consecutive Fake Chunks to Auto-Block:</span>
              <span className="font-bold text-white">{settings.autoBlockAfterHighChunks} Chunks (6s)</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              value={settings.autoBlockAfterHighChunks}
              onChange={(e) => updateSetting('autoBlockAfterHighChunks', Number(e.target.value))}
              className="w-full accent-cyber-teal cursor-pointer h-2 bg-cyber-bg rounded-lg"
            />
          </div>
        </div>

        {/* Section 2: Alerts & Sensory Feedback */}
        <div className="p-4 rounded-2xl bg-cyber-surface border border-cyber-border space-y-4">
          <h3 className="text-xs font-bold text-cyber-cyan uppercase font-mono flex items-center gap-2 border-b border-cyber-border/60 pb-2">
            <Bell className="w-4 h-4" />
            Alerts & Sensory Feedback
          </h3>

          {/* Audio Beep Alert Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-card border border-cyber-border/80">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyber-teal" />
                Audible Warning Beeps
              </span>
              <p className="text-[11px] text-cyber-muted">
                Play subtle warning tones in earpiece on fake voice detection
              </p>
            </div>
            <button
              onClick={() => updateSetting('soundAlertsEnabled', !settings.soundAlertsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundAlertsEnabled ? 'bg-cyber-teal' : 'bg-cyber-border'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.soundAlertsEnabled ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Haptic Vibration Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-card border border-cyber-border/80">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Vibrate className="w-4 h-4 text-cyber-cyan" />
                Haptic Vibration Buzz
              </span>
              <p className="text-[11px] text-cyber-muted">
                Trigger long alert pulse when deepfake voice threshold is exceeded
              </p>
            </div>
            <button
              onClick={() => updateSetting('hapticFeedbackEnabled', !settings.hapticFeedbackEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.hapticFeedbackEnabled ? 'bg-cyber-cyan' : 'bg-cyber-border'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.hapticFeedbackEnabled ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Backend API Details */}
          <div className="p-3 rounded-xl bg-cyber-card/60 border border-cyber-border/80 text-xs font-mono space-y-1 text-cyber-muted">
            <div className="flex justify-between">
              <span>Model Pipeline:</span>
              <span className="text-cyber-teal font-bold">{settings.modelName}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Latency:</span>
              <span className="text-cyber-cyan font-bold">~{settings.webSocketLatencyMs}ms (Real-Time)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
