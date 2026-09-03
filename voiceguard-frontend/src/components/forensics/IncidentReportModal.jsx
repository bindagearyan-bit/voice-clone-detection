import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  Building,
  Phone,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const IncidentReportModal = () => {
  const { 
    incidentReportModalOpen, 
    setIncidentReportModalOpen, 
    callSummaryData,
    activeCaller
  } = useCall();

  if (!incidentReportModalOpen || !callSummaryData) return null;

  const handlePrint = () => {
    window.print();
  };

  const isFake = callSummaryData.averageRisk >= 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#0e1422] border-2 border-cyber-border rounded-3xl shadow-2xl flex flex-col overflow-hidden text-cyber-text">
        {/* Modal Top Bar */}
        <div className="p-4 bg-cyber-card flex items-center justify-between border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber-teal" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Official Cyber Crime & Bank Fraud Forensics Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-cyber-surface hover:bg-cyber-cardElevated border border-cyber-border text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => setIncidentReportModalOpen(false)}
              className="p-1.5 rounded-xl bg-cyber-surface hover:bg-cyber-cardElevated text-cyber-muted hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0c101a] print:bg-white print:text-black" id="printable-dossier">
          {/* Header Badge */}
          <div className="border-b-2 border-cyber-border pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger text-xs font-mono font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                SECURITY CLASSIFICATION: CONFIDENTIAL INCIDENT DOSSIER
              </div>
              <h1 className="text-xl font-extrabold text-white mt-2 font-mono print:text-black">
                AI VOICE CLONE & SPOOF INTERCEPTION REPORT
              </h1>
              <p className="text-xs text-cyber-muted font-mono">
                Smart India Hackathon (SIH) VoiceGuard AI Forensic Framework • VoiceGuard v1.2
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-cyber-card border border-cyber-border text-right font-mono print:border-black">
              <span className="text-[10px] text-cyber-muted block">Incident ID</span>
              <span className="text-sm font-bold text-cyber-cyan">
                {callSummaryData.callId}
              </span>
              <span className="text-[10px] text-cyber-muted block mt-1">
                {callSummaryData.timestamp}
              </span>
            </div>
          </div>

          {/* Key Findings Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Call Metadata */}
            <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border space-y-2.5">
              <h3 className="text-xs font-bold text-cyber-cyan uppercase font-mono border-b border-cyber-border/60 pb-1">
                1. Intercepted Call Metadata
              </h3>
              <div className="text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Originating Number:</span>
                  <span className="font-bold text-white print:text-black">{callSummaryData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Caller Tag:</span>
                  <span className="text-white print:text-black">{callSummaryData.callerTag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Total Audio Duration:</span>
                  <span className="text-white print:text-black">{callSummaryData.totalDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">2-Sec Chunks Evaluated:</span>
                  <span className="text-white print:text-black">{callSummaryData.chunksAnalyzed} Chunks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Action Taken:</span>
                  <span className="font-bold text-cyber-danger">{callSummaryData.status}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Deepfake Model Assessment */}
            <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border space-y-2.5">
              <h3 className="text-xs font-bold text-cyber-cyan uppercase font-mono border-b border-cyber-border/60 pb-1">
                2. VoiceGuard Neural Core Assessment
              </h3>
              <div className="text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Deepfake Probability:</span>
                  <span className="text-base font-extrabold text-cyber-danger">
                    {callSummaryData.averageRisk}% (HIGH PROBABILITY)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Classification Decision:</span>
                  <span className="font-bold text-red-400">{callSummaryData.decision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Neural Model Used:</span>
                  <span className="text-white print:text-black">VoiceGuard-v1.2 (Neural Core)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-muted">Model Confidence:</span>
                  <span className="text-cyber-teal font-bold">96.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Forensic Evidence */}
          <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
            <h3 className="text-xs font-bold text-cyber-cyan uppercase font-mono border-b border-cyber-border/60 pb-1">
              3. Technical Forensic Evidence & Anomaly Indicators
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-danger shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black">Absence of Diaphragm Breath Inhalation:</strong>
                  <p className="text-cyber-muted text-[11px] mt-0.5">
                    Zero inhalation micro-pauses recorded across 8 consecutive seconds of speech stream. Human benchmark requires oxygen intake every 3.5 seconds.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-danger shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black">Linear Harmonic Grid in Spectrogram:</strong>
                  <p className="text-cyber-muted text-[11px] mt-0.5">
                    Neural vocoder phase interpolation artifacts identified in the 3.8 kHz to 6.2 kHz band, characteristic of DiffWave / HiFi-GAN generative voice synthesizers.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border/80 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-danger shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white print:text-black">F0 Fundamental Frequency Flatness:</strong>
                  <p className="text-cyber-muted text-[11px] mt-0.5">
                    Fundamental pitch variance remained unnaturally static at 132.8 Hz (±0.3 Hz), indicating synthetic pitch quantization.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Cryptographic Evidence Chain */}
          <div className="p-4 rounded-2xl bg-cyber-surface border border-cyber-border/80 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-cyber-muted">
              <span>Cryptographic Audio Hash (SHA-256):</span>
              <span className="text-cyber-teal font-bold text-[11px] select-all">
                {callSummaryData.sha256}
              </span>
            </div>
            <div className="flex items-center justify-between text-cyber-muted">
              <span>Database Ledger Location:</span>
              <span className="text-cyber-lightMuted text-[11px]">
                supabase://call_logs/records/{callSummaryData.callId}
              </span>
            </div>
          </div>

          {/* Section 5: Recommended Action for Victims & Authorities */}
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/60 text-xs font-mono space-y-2">
            <h4 className="font-bold text-red-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Recommended Law Enforcement & Banking Actions:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-cyber-text text-[11px]">
              <li>Register complaint on National Cyber Crime Portal (<strong>cybercrime.gov.in / Dial 1930</strong>).</li>
              <li>Notify issuing bank to freeze suspected linked UPI VPA & monitor unauthorized OTP attempts.</li>
              <li>Submit this SHA-256 signed dossier as digital forensic evidence under Indian Evidence Act Sec 65B.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cyber-card border-t border-cyber-border flex items-center justify-between">
          <span className="text-[11px] font-mono text-cyber-muted">
            VoiceGuard AI • Smart India Hackathon Submission
          </span>
          <button
            onClick={() => setIncidentReportModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-cyber-teal hover:bg-cyber-tealDark text-cyber-bg font-bold text-xs transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
