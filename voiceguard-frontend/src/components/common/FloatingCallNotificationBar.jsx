import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneOff, 
  Radio, 
  Activity, 
  ChevronRight, 
  PhoneCall,
  Lock,
  Zap
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const FloatingCallNotificationBar = () => {
  const { 
    callState, 
    activeCall, 
    callTimer, 
    liveRiskScore, 
    liveRiskLevel, 
    liveReason,
    endCall,
    navigateTo,
    currentRoute
  } = useVoiceGuard();

  const [isExpanded, setIsExpanded] = useState(false);

  // Sync with native Browser Web Notification & MediaSession
  useEffect(() => {
    if (callState === 'monitoring' && activeCall) {
      // 1. Update document title with live risk
      const isHigh = liveRiskScore >= 80;
      document.title = `${isHigh ? '🚨 AI SUSPECTED' : '🛡️ SHIELD ACTIVE'} [${liveRiskScore}%] • VoiceGuard`;

      // 2. Push / Update Native OS Notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          // Native notification tag prevents spamming multiple notifications
          new Notification('VoiceGuard AI • Call Shield Active', {
            body: `● REC ON | Risk: ${liveRiskScore}% (${liveRiskLevel}) | Caller: ${activeCall.callerNumber || 'Unknown'} | Status: ${liveReason || 'Monitoring'}`,
            icon: '/favicon.ico',
            tag: 'voiceguard-active-call-shield',
            silent: true
          });
        } catch (e) {
          // Ignore notification constructor error on some mobile browsers
        }
      }

      // 3. Android / iOS MediaSession Lockscreen & Notification Pill
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: `VoiceGuard: ${liveRiskScore}% Spoof Risk (${liveRiskLevel})`,
            artist: `● REC ON • ${activeCall.callerNumber || 'Protected Call'}`,
            album: liveReason || 'Live 16kHz Deepfake Acoustic Shield'
          });
        } catch (e) {
          // Ignore
        }
      }
    } else {
      document.title = 'VoiceGuard AI — Real-Time Deepfake Detection';
    }
  }, [callState, activeCall, liveRiskScore, liveRiskLevel, liveReason, callTimer]);

  if (callState !== 'monitoring' && callState !== 'incoming') {
    return null;
  }

  const isHigh = liveRiskLevel === 'HIGH' || liveRiskScore >= 80;
  const isModerate = liveRiskLevel === 'MODERATE' || (liveRiskScore >= 50 && liveRiskScore < 80);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-2 sm:top-4 left-2 right-2 sm:left-auto sm:right-6 sm:w-auto sm:min-w-[420px] max-w-lg z-50 animate-bounce-short">
      <div 
        className={`rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isHigh 
            ? 'bg-red-950/90 border-red-500/80 shadow-red-900/40 text-white ring-2 ring-red-500/50 animate-pulse'
            : isModerate
            ? 'bg-amber-950/90 border-amber-500/80 shadow-amber-900/30 text-white'
            : 'bg-slate-900/95 border-emerald-500/60 shadow-slate-950/50 text-white'
        }`}
      >
        {/* Top Notification Pill Bar */}
        <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
          {/* Status & Recording Indicator */}
          <div 
            onClick={() => navigateTo('/calls')}
            className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
          >
            {/* Live Pulsing REC Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 font-mono text-[10px] font-extrabold uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>REC ON</span>
            </div>

            {/* Caller Number & Timer */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono truncate text-slate-100">
                  {activeCall?.callerNumber || 'Unknown Caller'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {formatTimer(callTimer)}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-300 truncate">
                {liveReason || (isHigh ? '⚠️ AI Voice Clone Suspected' : 'Shield Active • Voice Natural')}
              </p>
            </div>
          </div>

          {/* Spoof Risk Gauge Pill */}
          <div 
            onClick={() => navigateTo('/calls')}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isHigh
                ? 'bg-red-600 border-red-400 text-white font-black'
                : isModerate
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 font-bold'
                : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 font-bold'
            }`}
          >
            {isHigh ? (
              <ShieldAlert className="w-3.5 h-3.5 text-white animate-spin" />
            ) : isModerate ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <div className="text-right">
              <div className="text-[9px] font-mono uppercase tracking-tighter opacity-80 leading-none">
                Spoof Risk
              </div>
              <div className="text-xs font-mono font-extrabold leading-tight">
                {liveRiskScore}%
              </div>
            </div>
          </div>

          {/* Quick Hangup / End Call Button */}
          <button
            onClick={() => endCall(isHigh)}
            title="End Protected Call"
            className="p-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white transition-all shadow-lg shrink-0 cursor-pointer flex items-center justify-center"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Mini Telemetry Bar (Shown on Mobile Tap) */}
        {currentRoute !== '/calls' && (
          <div 
            onClick={() => navigateTo('/calls')}
            className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800 text-[10px] font-mono text-cyan-400 flex items-center justify-between cursor-pointer hover:bg-slate-950"
          >
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              Tap to open full Forensic Shield screen
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
};
