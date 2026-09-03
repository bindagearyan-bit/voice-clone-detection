import React from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  PhoneOff, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  X,
  Flag
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const HighRiskAlertModal = () => {
  const { 
    isHighRiskAlertOpen, 
    setIsHighRiskAlertOpen, 
    liveRiskScore, 
    liveConfidence, 
    currentScenario,
    endCall,
    activeCall 
  } = useVoiceGuard();

  if (!isHighRiskAlertOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-red-500 shadow-2xl overflow-hidden text-slate-900">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[11px] font-bold">
                <AlertOctagon className="w-3.5 h-3.5" />
                SECURITY ALERT
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mt-1">
                AI VOICE DETECTED
              </h2>
              <p className="text-xs text-red-100 font-medium">
                High probability of synthetic voice
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHighRiskAlertOpen(false)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-center">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase block">
                Spoof Risk
              </span>
              <span className="text-2xl font-extrabold text-red-700 font-mono">
                {liveRiskScore}%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                Confidence
              </span>
              <span className="text-2xl font-extrabold text-slate-800 font-mono">
                {liveConfidence}%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-center">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase block">
                Status
              </span>
              <span className="text-xs font-extrabold text-red-700 font-mono block mt-1">
                HIGH SPOOF RISK
              </span>
            </div>
          </div>

          {/* Analysis Indicators (Backend-provided evidence) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Acoustic Evidence (VoiceGuard Analysis)
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {currentScenario.analysisIndicators.map((ind, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-[11px] leading-tight">{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Advisory */}
          <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
              <Lock className="w-4 h-4 text-red-600" />
              <span>Potential Voice Scam</span>
            </div>
            <ul className="space-y-1 text-xs text-red-900 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                Do not make payments or approve UPI/payment requests.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                Do not share OTPs, PINs, passwords or banking details.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                Verify the caller through an independent trusted channel.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* End Call */}
            <button
              onClick={() => endCall(true)}
              className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>

            {/* Verify Caller */}
            <button
              onClick={() => setIsHighRiskAlertOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-all cursor-pointer"
            >
              <span>Verify Caller</span>
            </button>

            {/* Report Call */}
            <button
              onClick={() => {
                alert('Call flagged & report logged to cyber security database.');
                endCall(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 text-red-400" />
              <span>Report Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
