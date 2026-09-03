import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  ShieldCheck, 
  PhoneIncoming, 
  Mic, 
  Sparkles, 
  Settings, 
  Play,
  Volume2,
  Lock
} from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { IncomingCallView } from './IncomingCallView';
import { ActiveCallView } from './ActiveCallView';
import { CallSummaryModal } from './CallSummaryModal';

export const PhoneFrame = () => {
  const { 
    callState, 
    triggerIncomingCall, 
    isLiveMicMode, 
    setIsLiveMicMode, 
    currentScenario 
  } = useCall();

  const [currentTime, setCurrentTime] = useState('20:05');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[360px] h-[720px] rounded-[48px] p-3 bg-gradient-to-b from-[#243047] via-[#151c2c] to-[#0d121c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-[#2d3b55] flex flex-col justify-between select-none">
      {/* Side phone hardware buttons simulation */}
      <div className="absolute -left-[7px] top-24 w-[3px] h-10 bg-[#3a4c6e] rounded-l-md" />
      <div className="absolute -left-[7px] top-38 w-[3px] h-12 bg-[#3a4c6e] rounded-l-md" />
      <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-[#3a4c6e] rounded-r-md" />

      {/* Internal Phone Screen Container */}
      <div className="relative w-full h-full rounded-[38px] bg-[#0c101a] overflow-hidden flex flex-col justify-between border border-white/5 shadow-inner">
        {/* Top Status Bar & Dynamic Island */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between z-20 text-xs font-semibold text-white/80">
          {/* Clock */}
          <span className="font-mono text-[13px]">{currentTime}</span>

          {/* Dynamic Island / Camera pill */}
          <div className="px-3 py-1 rounded-full bg-black/90 border border-white/10 flex items-center gap-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#182338] border border-[#2b3a55]" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-teal animate-pulse" />
          </div>

          {/* Network & Battery */}
          <div className="flex items-center gap-1.5 text-cyber-lightMuted">
            <Signal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-cyber-teal" />
          </div>
        </div>

        {/* Dynamic Screen View Router */}
        <div className="flex-1 overflow-hidden relative">
          {callState === 'idle' && (
            <div className="flex flex-col h-full justify-between p-6 text-center animate-fadeIn">
              {/* Top Banner */}
              <div className="space-y-2 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs font-mono text-cyber-teal shadow-glow-teal">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VoiceGuard AI Active</span>
                </div>
                <h1 className="text-xl font-bold text-white font-mono tracking-tight pt-2">
                  Ready to Intercept
                </h1>
                <p className="text-xs text-cyber-muted">
                  VoiceGuard 16kHz deepfake model is active. Incoming calls will be automatically analyzed every 2 seconds.
                </p>
              </div>

              {/* Center Card with Current Scenario Preview */}
              <div className="p-4 rounded-3xl neumorph-card text-left space-y-3 my-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
                    Selected Scenario
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-surface border border-cyber-border text-cyber-lightMuted">
                    {currentScenario.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    {currentScenario.title}
                  </h3>
                  <p className="text-xs font-mono text-cyber-teal font-semibold">
                    Caller: {currentScenario.callerNumber}
                  </p>
                  <p className="text-[11px] text-cyber-muted line-clamp-2">
                    {currentScenario.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-cyber-border/40 flex items-center justify-between text-[11px] font-mono text-cyber-muted">
                  <span>Target: {currentScenario.claimedIdentity}</span>
                </div>
              </div>

              {/* Launch Incoming Call Simulator Action */}
              <div className="space-y-3 pb-2">
                <button
                  onClick={() => triggerIncomingCall()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyber-teal to-emerald-600 hover:from-cyber-teal/90 hover:to-emerald-500 active:scale-98 text-cyber-bg font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyber-teal/30 transition-all cursor-pointer"
                >
                  <PhoneIncoming className="w-5 h-5" />
                  <span>Simulate Incoming Call</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-cyber-muted font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>WebRTC 16kHz + VoiceGuard-v1.2</span>
                </div>
              </div>
            </div>
          )}

          {callState === 'incoming' && <IncomingCallView />}
          {callState === 'active' && <ActiveCallView />}
          {(callState === 'ended' || callState === 'blocked') && <CallSummaryModal />}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="pb-2 pt-1 flex justify-center z-20">
          <div className="w-32 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
};
