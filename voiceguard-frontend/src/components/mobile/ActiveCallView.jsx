import React, { useState } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Pause, 
  Play, 
  Lock, 
  FileText,
  Share2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { RadialRiskGauge } from './RadialRiskGauge';
import { LiveAudioWave } from './LiveAudioWave';

export const ActiveCallView = () => {
  const {
    activeCaller,
    callTimer,
    riskScore,
    riskLevel,
    isFakeVoice,
    riskReason,
    latestChunk,
    consecutiveHighRiskCount,
    autoBlockPrompt,
    micFrequencyData,
    endCall,
    blockAndReportCall,
  } = useCall();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isHeld, setIsHeld] = useState(false);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isHighRisk = riskLevel === 'HIGH' || riskScore >= 80;
  const isModerateRisk = riskLevel === 'MODERATE' || (riskScore >= 40 && riskScore < 80);

  return (
    <div className="flex flex-col h-full justify-between p-4 relative overflow-y-auto">
      {/* ⚠️ HIGH RISK EMERGENCY OVERLAY BANNER (Step 8 in workflow) */}
      {isHighRisk && (
        <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-red-950/90 via-red-900/90 to-red-950/90 border-2 border-red-500 shadow-glow-danger animate-pulse-glow text-left">
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
            <span>⚠️ CRITICAL: AI VOICE DETECTED</span>
          </div>
          <p className="text-[12px] font-bold text-white mt-1 leading-snug">
            DO NOT SHARE OTP, ATM PIN, CVV OR TRANSFER ANY FUNDS!
          </p>
          <div className="mt-2 flex items-center justify-between pt-1 border-t border-red-800/60">
            <span className="text-[10px] text-red-300 font-mono">
              Consecutive AI Chunks: {consecutiveHighRiskCount}
            </span>
            <button
              onClick={blockAndReportCall}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[11px] font-bold shadow transition-all"
            >
              Block & Report Now
            </button>
          </div>
        </div>
      )}

      {/* Auto-suggest Call Block Alert if 3 consecutive high-risk chunks (Step 9) */}
      {autoBlockPrompt && !isHighRisk && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>3 Consecutive Fake Chunks detected!</span>
          </div>
          <button
            onClick={blockAndReportCall}
            className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px] rounded"
          >
            Auto-Block
          </button>
        </div>
      )}

      {/* Top Header: Caller Info & Call Duration */}
      <div className="text-center space-y-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyber-card border border-cyber-border text-[11px] font-mono text-cyber-muted">
          <Radio className="w-3 h-3 text-cyber-teal animate-pulse" />
          <span>LIVE CALL • {formatTime(callTimer)}</span>
        </div>
        <h2 className="text-lg font-bold text-white font-mono tracking-tight">
          {activeCaller.number}
        </h2>
        <p className="text-xs text-cyber-muted truncate max-w-[260px] mx-auto">
          {activeCaller.name}
        </p>
      </div>

      {/* Circular Radial Risk Gauge (Step 4 & Step 5) */}
      <div className="my-1 flex flex-col items-center justify-center">
        <RadialRiskGauge
          score={riskScore}
          level={riskLevel}
          size={160}
        />
      </div>

      {/* 2-Second Live Chunk & Speech Transcript (Step 2, 3, 7) */}
      <div className="my-2 space-y-2">
        {/* Real-time Waveform */}
        <LiveAudioWave
          isActive={true}
          isFake={isHighRisk}
          frequencyData={micFrequencyData}
          height={40}
        />

        {/* Live Chunk Diagnostics pill */}
        <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border/80 shadow-neumorph-inset text-left">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyber-muted mb-1">
            <span className="text-cyber-cyan font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
              {latestChunk ? `${latestChunk.chunkId} [${latestChunk.timeRange}]` : 'Chunk Initializing...'}
            </span>
            <span className="text-cyber-lightMuted font-mono">
              FastAPI + VoiceGuard (~800ms)
            </span>
          </div>

          <p className="text-[11px] text-cyber-text font-medium italic border-l-2 border-cyber-teal/60 pl-2 py-0.5 bg-cyber-card/40 rounded-r">
            "{latestChunk ? latestChunk.transcript : 'Listening to caller audio stream...'}"
          </p>

          <div className="mt-2 text-[10px] text-cyber-muted flex items-start gap-1">
            <Info className="w-3 h-3 text-cyber-cyan mt-0.5 shrink-0" />
            <span className="text-cyber-lightMuted font-mono">
              <strong className="text-white">Reason:</strong> {riskReason}
            </span>
          </div>
        </div>
      </div>

      {/* In-Call Actions Grid (Neumorphic Buttons) */}
      <div className="pt-2 space-y-3">
        <div className="grid grid-cols-4 gap-2 px-1">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all text-[10px] font-medium ${
              isMuted
                ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan shadow-glow-cyan'
                : 'neumorph-button text-cyber-muted hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all text-[10px] font-medium ${
              isSpeaker
                ? 'bg-cyber-teal/20 border border-cyber-teal text-cyber-teal shadow-glow-teal'
                : 'neumorph-button text-cyber-muted hover:text-white'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Speaker</span>
          </button>

          {/* Hold */}
          <button
            onClick={() => setIsHeld(!isHeld)}
            className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all text-[10px] font-medium ${
              isHeld
                ? 'bg-cyber-warning/20 border border-cyber-warning text-cyber-warning'
                : 'neumorph-button text-cyber-muted hover:text-white'
            }`}
          >
            {isHeld ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isHeld ? 'Unhold' : 'Hold'}</span>
          </button>

          {/* Block & Report */}
          <button
            onClick={blockAndReportCall}
            className="p-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-medium neumorph-button text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-red-400" />
            <span>Block</span>
          </button>
        </div>

        {/* End Call Button */}
        <div className="flex justify-center pt-1">
          <button
            onClick={() => endCall(false)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
