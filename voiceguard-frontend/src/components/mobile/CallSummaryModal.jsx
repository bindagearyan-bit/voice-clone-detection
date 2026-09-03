import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Share2, 
  Download, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  Lock,
  PhoneForwarded,
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const CallSummaryModal = () => {
  const { 
    callSummaryData, 
    triggerIncomingCall, 
    setIncidentReportModalOpen,
    setCurrentTab
  } = useCall();

  if (!callSummaryData) return null;

  const isFake = callSummaryData.averageRisk >= 60;

  return (
    <div className="flex flex-col h-full justify-between p-5 text-center animate-fadeIn overflow-y-auto">
      {/* Header Result Badge */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-center">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center p-4 border-2 shadow-lg transition-all ${
              isFake 
                ? 'bg-red-950/80 border-red-500 text-red-400 shadow-glow-danger' 
                : 'bg-emerald-950/80 border-cyber-teal text-cyber-teal shadow-glow-teal'
            }`}
          >
            {isFake ? (
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            ) : (
              <ShieldCheck className="w-10 h-10" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white font-mono">
            {callSummaryData.decision}
          </h2>
          <p className="text-xs font-mono text-cyber-muted">
            Call ID: {callSummaryData.callId}
          </p>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-3 gap-2 my-4">
        {/* Metric 1: Risk */}
        <div className="p-3 rounded-2xl bg-cyber-card border border-cyber-border shadow-neumorph text-center">
          <span className="text-[10px] font-mono text-cyber-muted uppercase block">
            Avg Risk
          </span>
          <span className={`text-xl font-bold font-mono ${isFake ? 'text-cyber-danger' : 'text-cyber-teal'}`}>
            {callSummaryData.averageRisk}%
          </span>
        </div>

        {/* Metric 2: Duration */}
        <div className="p-3 rounded-2xl bg-cyber-card border border-cyber-border shadow-neumorph text-center">
          <span className="text-[10px] font-mono text-cyber-muted uppercase block">
            Duration
          </span>
          <span className="text-xl font-bold font-mono text-white">
            {callSummaryData.totalDuration}
          </span>
        </div>

        {/* Metric 3: Chunks */}
        <div className="p-3 rounded-2xl bg-cyber-card border border-cyber-border shadow-neumorph text-center">
          <span className="text-[10px] font-mono text-cyber-muted uppercase block">
            Chunks
          </span>
          <span className="text-xl font-bold font-mono text-cyber-cyan">
            {callSummaryData.chunksAnalyzed}
          </span>
        </div>
      </div>

      {/* Forensic Findings Box */}
      <div className="p-3 rounded-2xl bg-cyber-surface border border-cyber-border/80 shadow-neumorph-inset text-left space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyber-muted">Forensic Reason</span>
          <span className="text-cyber-teal flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            VoiceGuard-v1.2
          </span>
        </div>
        <p className="text-xs text-cyber-text leading-relaxed font-mono">
          {callSummaryData.reason}
        </p>

        <div className="pt-2 border-t border-cyber-border/60 flex items-center justify-between text-[11px] font-mono text-cyber-muted">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-cyber-cyan" />
            Supabase Saved
          </span>
          <span className="text-cyber-lightMuted truncate max-w-[140px]">
            SHA256: {callSummaryData.sha256.substring(0, 10)}...
          </span>
        </div>
      </div>

      {/* Post-Call Actions */}
      <div className="space-y-2 pt-2">
        {/* Generate Cyber Crime Report */}
        <button
          onClick={() => setIncidentReportModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyber-cyan/30 to-blue-600/30 hover:from-cyber-cyan/40 hover:to-blue-600/40 border border-cyber-cyan/50 text-cyber-cyan font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Export Cyber Crime / Bank Report</span>
        </button>

        {/* Action Row */}
        <div className="flex gap-2">
          <button
            onClick={() => triggerIncomingCall()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyber-card hover:bg-cyber-cardElevated border border-cyber-border text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyber-teal" />
            <span>Test Again</span>
          </button>

          <button
            onClick={() => setCurrentTab('logs')}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyber-card hover:bg-cyber-cardElevated border border-cyber-border text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>View Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
