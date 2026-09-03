import React, { useState } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  PhoneIncoming, 
  Mic, 
  MicOff, 
  Volume2, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Cpu, 
  Server, 
  ArrowRight, 
  Zap, 
  Activity, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  Flag
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';
import { RiskMeter } from '../common/RiskMeter';
import { LiveWaveform } from '../common/LiveWaveform';

export const ProtectedCallPage = () => {
  const { 
    callState, 
    callTimer, 
    activeCall, 
    currentScenario, 
    currentChunk, 
    processedChunks, 
    liveRiskScore, 
    liveRiskLevel, 
    liveConfidence, 
    liveReason, 
    liveEvidence, 
    startProtectedCall, 
    acceptCall, 
    declineCall, 
    endCall, 
    demoModeActive 
  } = useVoiceGuard();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isHighRisk = liveRiskLevel === 'HIGH' || liveRiskScore >= 80;
  const isModerateRisk = liveRiskLevel === 'MODERATE' || (liveRiskScore >= 40 && liveRiskScore < 80);

  const pipelineStages = [
    { label: 'Audio Captured', detail: 'Mic 16kHz' },
    { label: 'Chunk Created', detail: '2s Window' },
    { label: 'Backend Sent', detail: 'WebSocket' },
    { label: 'VoiceGuard AI', detail: 'Feature Ext.' },
    { label: 'Result Received', detail: '~800ms' },
    { label: 'Risk Updated', detail: `${liveRiskScore}%` },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Demo Mode Notice Banner */}
      {demoModeActive && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="font-bold">
              DEMO MODE — Simulated Protected Call
            </span>
            <span className="text-blue-600 hidden sm:inline">
              (Testing 2-second chunking and real-time VoiceGuard spoof score evaluation)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
            Simulated
          </span>
        </div>
      )}

      {/* Screen Router based on Call State */}
      {callState === 'idle' && (
        <div className="p-8 md:p-12 rounded-3xl bg-white border border-slate-200 shadow-card-subtle text-center space-y-6 max-w-2xl mx-auto my-8">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <PhoneCall className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
              Call Protection Standby
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Ready to Monitor Unknown Calls
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              When an unknown call arrives, VoiceGuard automatically segments incoming speech into 2-second audio windows and streams them to the VoiceGuard neural engine.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Demo Scenario:</span>
              <span className="font-bold text-slate-900">{currentScenario.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Caller Number:</span>
              <span className="font-bold text-blue-600">{currentScenario.callerNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expected Outcome:</span>
              <span className={`font-bold ${currentScenario.expectedRiskLevel === 'HIGH' ? 'text-red-600' : currentScenario.expectedRiskLevel === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {currentScenario.statusLabel}
              </span>
            </div>
          </div>

          <button
            onClick={() => startProtectedCall()}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer font-mono mx-auto"
          >
            <PhoneIncoming className="w-4 h-4" />
            <span>Simulate Incoming Unknown Call</span>
          </button>
        </div>
      )}

      {/* INCOMING UNKNOWN CALL VIEW */}
      {callState === 'incoming' && (
        <div className="p-8 md:p-12 rounded-3xl bg-white border border-slate-200 shadow-card-elevated text-center space-y-8 max-w-xl mx-auto my-6 animate-fadeIn">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>INCOMING UNKNOWN CALL</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight pt-2">
              {activeCall.callerNumber}
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              {activeCall.callerLabel}
            </p>
          </div>

          {/* Pre-monitoring info card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span>VoiceGuard Shield</span>
              <span className="text-emerald-600 font-bold">● Standby</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Upon answering, incoming voice audio will be automatically sliced into 2-second chunks for spoof detection.
            </p>
          </div>

          {/* Accept / Decline Buttons */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={declineCall}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-red-50 text-slate-600 group-hover:text-red-600 border border-slate-300 group-hover:border-red-300 flex items-center justify-center transition-all">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-red-600">
                Decline
              </span>
            </button>

            <button
              onClick={acceptCall}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center transition-all group-hover:scale-105">
                <PhoneCall className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700">
                Accept Call
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE CALL MONITORING VIEW (The core screen) */}
      {callState === 'monitoring' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Status Header */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  VoiceGuard is monitoring this call
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-mono">
                  {activeCall.callerNumber}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeCall.callerLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Duration</span>
                <span className="text-lg font-bold font-mono text-slate-900">{formatTimer(callTimer)}</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[150px]">
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold block">
                  ● Audio Monitoring Active
                </span>
                <span className="text-xs font-mono text-emerald-800 font-bold">
                  2s Chunking Engine
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid: Risk Meter + Real-Time Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Risk Meter (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Real-Time Spoof Risk Meter
              </span>

              <RiskMeter
                score={liveRiskScore}
                level={liveRiskLevel}
                size={220}
              />

              {/* Status Explanation text */}
              <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block">
                  VoiceGuard Neural Verdict
                </span>
                <p className={`text-xs font-bold font-mono ${isHighRisk ? 'text-red-700' : isModerateRisk ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {liveReason}
                </p>
              </div>
            </div>

            {/* Right: Real-Time Analysis & 2s Chunk Tracker (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Telemetry Stats Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Real-Time Audio Analysis Telemetry
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    VoiceGuard-v1.2
                  </span>
                </div>

                {/* 4 Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Current Chunk</span>
                    <span className="text-sm font-bold text-slate-900">
                      Chunk {String(currentChunk?.chunkNumber || 1).padStart(2, '0')} / {currentChunk?.totalChunks || 22}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Audio Format</span>
                    <span className="text-sm font-bold text-slate-900">2-sec WAV (16kHz)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Backend Link</span>
                    <span className="text-sm font-bold text-emerald-600">Connected</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Latency</span>
                    <span className="text-sm font-bold text-blue-600">~800 ms</span>
                  </div>
                </div>

                {/* Live Waveform */}
                <div className="space-y-1.5">
                  <LiveWaveform
                    isActive={true}
                    isHighRisk={isHighRisk}
                    height={46}
                  />
                </div>

                {/* Latest Chunk Speech Transcript */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Speech Transcript (Chunk {currentChunk?.chunkNumber || 1} [{currentChunk?.timeRange || '0–2s'}])</span>
                    <span className="text-slate-400">Confidence: {liveConfidence}%</span>
                  </div>
                  <p className="text-xs text-slate-800 italic font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                    "{currentChunk?.transcript || 'Listening to incoming caller speech stream...'}"
                  </p>
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-card-subtle flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isMuted ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isMuted ? 'Muted' : 'Mute'}</span>
                  </button>

                  <button
                    onClick={() => setIsSpeaker(!isSpeaker)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isSpeaker ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speaker</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => endCall(true)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-red-700 border border-red-200 font-bold text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Block & Report</span>
                  </button>

                  <button
                    onClick={() => endCall(false)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Pipeline Timeline Flow */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
              Continuous 2-Second Audio Processing Lifecycle
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {pipelineStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-600">
                      STAGE {idx + 1}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 font-mono leading-tight">
                    {stage.label}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {stage.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
