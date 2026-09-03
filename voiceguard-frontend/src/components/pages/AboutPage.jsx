import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Lock, 
  Sparkles, 
  ArrowDown, 
  CheckCircle2, 
  FileText,
  Server,
  Zap
} from 'lucide-react';

export const AboutPage = () => {
  const flowSteps = [
    { title: 'Unknown Call', desc: 'Incoming call received from an unverified caller number.' },
    { title: 'Audio Capture', desc: 'Microphone captures incoming audio stream upon user answer.' },
    { title: '2-Second Chunks', desc: 'Real-time audio buffer slices stream into 16kHz WAV windows.' },
    { title: 'Backend Transmission', desc: 'Low-latency WebSocket transmits payload to FastAPI service.' },
    { title: 'VoiceGuard Neural Model', desc: 'Deep Neural Core extracts spectral, pitch & harmonic features.' },
    { title: 'Spoof Score', desc: 'Outputs probability score (0–100%) for synthetic characteristics.' },
    { title: 'Risk Calculation', desc: 'Applies thresholding logic: Low (<40%), Moderate, High (>80%).' },
    { title: 'User Alert', desc: 'Updates dynamic risk meter and displays safety guidance.' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
          Architecture & Framework
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          About VoiceGuard AI
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          VoiceGuard uses AI-based audio analysis to identify acoustic characteristics associated with synthetic, cloned, or manipulated speech in real time during unknown calls.
        </p>
      </div>

      {/* Visual Technical Flowchart */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              End-to-End Spoof Detection Architecture Flow
            </h3>
            <p className="text-xs text-slate-500">
              Low-latency continuous 2-second audio analysis lifecycle
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {flowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 relative hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-extrabold text-[11px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono mt-1">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars Grid: Mission, Technology, Privacy, Responsible AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-mono">
            Mission: Protecting Digital Voice Identity
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            With the rapid rise of real-time voice cloning and generative audio tools, voice phishing (vishing) and financial deception have become critical cybersecurity threats. VoiceGuard provides accessible real-time defense directly on unknown calls.
          </p>
        </div>

        {/* Technology */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-mono">
            Technology: VoiceGuard Acoustic Transformer Framework
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            VoiceGuard leverages Spectro-Temporal Neural Attention models, examining high-frequency harmonic grids, phase anomalies, and pitch quantization characteristic of neural vocoders (e.g. HiFi-GAN, DiffWave, FastSpeech).
          </p>
        </div>

        {/* Privacy */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-mono">
            Privacy First Architecture
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            VoiceGuard processes audio in ephemeral 2-second buffers. Audio features are converted to numerical embeddings for spoof score evaluation, and raw recordings are not permanently stored unless explicitly requested by the user.
          </p>
        </div>

        {/* Responsible AI */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-mono">
            Responsible AI & Transparent Risk
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            VoiceGuard evaluates acoustic spoof probability without making absolute declarations of fraud. Users receive clear evidence indicators and are advised to verify callers independently through trusted channels.
          </p>
        </div>
      </div>
    </div>
  );
};
