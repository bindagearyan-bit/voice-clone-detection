import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Mic, 
  PhoneIncoming, 
  Activity, 
  Layers, 
  Cpu, 
  FileText
} from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { SCENARIOS } from '../../data/scenarios';

export const Header = () => {
  const { 
    selectedScenarioId, 
    setSelectedScenarioId, 
    isLiveMicMode, 
    setIsLiveMicMode, 
    callState, 
    triggerIncomingCall,
    settings
  } = useCall();

  return (
    <header className="neumorph-card p-4 rounded-3xl mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Logo and System Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-teal to-emerald-700 flex items-center justify-center text-cyber-bg shadow-glow-teal">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
                VoiceGuard AI
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/40">
                  SIH Edition
                </span>
              </h1>
            </div>
            <p className="text-xs text-cyber-muted flex items-center gap-2 mt-0.5">
              <span>Real-Time AI Voice & Cloned Spoof Detection</span>
              <span className="w-1 h-1 rounded-full bg-cyber-border" />
              <span className="text-cyber-cyan font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal animate-pulse" />
                VoiceGuard-v1.2 Active
              </span>
            </p>
          </div>
        </div>

        {/* Live Audio / Scenario Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Scenario Selector Dropdown */}
          <div className="flex items-center gap-2 bg-cyber-surface px-3 py-1.5 rounded-2xl border border-cyber-border shadow-neumorph-inset text-xs font-mono">
            <span className="text-cyber-muted text-[11px] hidden sm:inline">Scenario:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              disabled={callState === 'active' || callState === 'incoming'}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              {SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-cyber-card text-white">
                  {sc.title} ({sc.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Live Mic Toggle */}
          <button
            onClick={() => setIsLiveMicMode(!isLiveMicMode)}
            disabled={callState === 'active'}
            className={`px-3 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiveMicMode
                ? 'bg-cyber-cyan text-cyber-bg shadow-glow-cyan'
                : 'neumorph-button text-cyber-muted hover:text-white'
            }`}
            title="Switch to Real Microphone Input"
          >
            <Mic className="w-4 h-4" />
            <span>{isLiveMicMode ? 'Real Mic: ON' : 'Real Mic: OFF'}</span>
          </button>

          {/* Trigger Incoming Call Button */}
          <button
            onClick={() => triggerIncomingCall()}
            disabled={callState === 'active' || callState === 'incoming'}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyber-teal to-emerald-600 hover:from-cyber-teal/90 hover:to-emerald-500 active:scale-95 disabled:opacity-40 text-cyber-bg font-extrabold text-xs flex items-center gap-2 shadow-glow-teal transition-all cursor-pointer"
          >
            <PhoneIncoming className="w-4 h-4" />
            <span>{callState === 'active' ? 'Call In Progress...' : 'Simulate Call'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
