import React from 'react';
import { Phone, PhoneOff, ShieldAlert, Sparkles, User, AlertOctagon } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const IncomingCallView = () => {
  const { activeCaller, acceptCall, declineCall, currentScenario } = useCall();

  return (
    <div className="flex flex-col h-full justify-between p-6 text-center animate-fadeIn">
      {/* Top Banner */}
      <div className="space-y-2 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-[11px] font-mono text-cyber-cyan shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
          <span>VoiceGuard AI Active Protection</span>
        </div>

        <h2 className="text-xs font-semibold tracking-wider text-cyber-muted uppercase pt-2">
          Incoming Cellular / WebRTC Call
        </h2>
      </div>

      {/* Center Caller Profile */}
      <div className="flex flex-col items-center justify-center my-auto space-y-4">
        {/* Caller Avatar with glowing pulse */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-cardElevated to-cyber-surface border-2 border-cyber-border flex items-center justify-center shadow-neumorph">
            <User className="w-12 h-12 text-cyber-lightMuted" />
          </div>
          <span className="absolute bottom-0 right-0 p-1.5 bg-cyber-warning rounded-full border-2 border-cyber-bg shadow-glow-warning">
            <AlertOctagon className="w-4 h-4 text-cyber-bg" />
          </span>
        </div>

        {/* Caller Information */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
            {activeCaller.number}
          </h1>
          <p className="text-sm font-medium text-cyber-muted">
            {activeCaller.name}
          </p>
          <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-cyber-surface border border-cyber-borderSubtle text-[11px] font-mono text-cyber-lightMuted">
            Flag: {currentScenario.tag}
          </div>
        </div>

        {/* Real-time Pre-analysis notification */}
        <div className="w-full max-w-[280px] p-3 rounded-2xl bg-cyber-surface border border-cyber-border/80 shadow-neumorph-inset text-left space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-cyber-muted">Risk Engine</span>
            <span className="text-cyber-cyan font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
              Initializing... ⏳
            </span>
          </div>
          <p className="text-[10px] text-cyber-muted leading-tight">
            Auto-chunking 16kHz WAV stream will trigger upon answering. VoiceGuard AI model standing by.
          </p>
        </div>
      </div>

      {/* Call Answer & Reject Controls */}
      <div className="pt-4 pb-2 space-y-4">
        <div className="flex items-center justify-around px-4">
          {/* Decline Button */}
          <button
            onClick={declineCall}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
              <PhoneOff className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold text-cyber-muted group-hover:text-red-400">
              Decline
            </span>
          </button>

          {/* Accept Button */}
          <button
            onClick={acceptCall}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-teal to-emerald-600 flex items-center justify-center text-cyber-bg font-bold shadow-lg shadow-cyber-teal/40 group-hover:scale-105 group-active:scale-95 transition-all duration-200 animate-pulse">
              <Phone className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold text-cyber-teal group-hover:text-white">
              Answer & Analyze
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
