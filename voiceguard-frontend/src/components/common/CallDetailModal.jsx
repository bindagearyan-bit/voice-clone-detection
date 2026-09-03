import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Layers, 
  Cpu, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const CallDetailModal = () => {
  const { selectedCallDetail, isDetailDrawerOpen, setIsDetailDrawerOpen } = useVoiceGuard();

  if (!isDetailDrawerOpen || !selectedCallDetail) return null;

  const isHigh = selectedCallDetail.riskLevel === 'HIGH';
  const isModerate = selectedCallDetail.riskLevel === 'MODERATE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHigh ? 'bg-red-500/20 text-red-400' : isModerate ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isHigh ? <ShieldAlert className="w-5 h-5" /> : isModerate ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                FORENSIC DOSSIER • {selectedCallDetail.id}
              </span>
              <h2 className="text-lg font-bold tracking-tight">
                {selectedCallDetail.phoneNumber}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setIsDetailDrawerOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5" id="printable-detail">
          {/* Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-mono">Classification Status:</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedCallDetail.classification}
              </h3>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${isHigh ? 'bg-red-100 text-red-700 border border-red-200' : isModerate ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                {selectedCallDetail.statusLabel}
              </span>
            </div>

            <div className="flex gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-w-[70px]">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Spoof Risk</span>
                <span className={`text-lg font-bold font-mono ${isHigh ? 'text-red-600' : 'text-emerald-600'}`}>
                  {selectedCallDetail.riskScore}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-w-[70px]">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Confidence</span>
                <span className="text-lg font-bold font-mono text-slate-800">
                  {selectedCallDetail.confidence}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-w-[70px]">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Chunks</span>
                <span className="text-lg font-bold font-mono text-blue-600">
                  {selectedCallDetail.chunksAnalyzed}
                </span>
              </div>
            </div>
          </div>

          {/* Call Metadata Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Date & Time</span>
              <span className="font-bold text-slate-800">{selectedCallDetail.timestamp}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Duration</span>
              <span className="font-bold text-slate-800">{selectedCallDetail.durationSec} seconds</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Audio Format</span>
              <span className="font-bold text-slate-800">16kHz mono WAV</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Model Pipeline</span>
              <span className="font-bold text-blue-600">{selectedCallDetail.modelUsed || 'VoiceGuard-v1.2'}</span>
            </div>
          </div>

          {/* Indicators */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase font-mono">
              Acoustic Evidence Indicators (VoiceGuard Backend)
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {selectedCallDetail.indicators?.map((ind, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isHigh ? 'text-red-500' : 'text-emerald-600'}`} />
                  <span className="text-slate-700 leading-tight">{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Recommendation if present */}
          {selectedCallDetail.safetyWarning && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-mono space-y-1">
              <span className="font-bold text-red-800 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                Safety Recommendation:
              </span>
              <p className="text-red-900 font-medium">
                {selectedCallDetail.safetyWarning}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            VoiceGuard Forensic Telemetry Ledger
          </span>
          <button
            onClick={() => setIsDetailDrawerOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
