import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowDown, 
  Smartphone, 
  Mic, 
  Send, 
  Cpu, 
  ShieldAlert, 
  Database, 
  Radio, 
  Bell, 
  Repeat, 
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const PipelineFlow = () => {
  const [activeStep, setActiveStep] = useState(4); // Default to AI Engine step

  const steps = [
    {
      step: 1,
      title: 'STEP 1: Call Starts',
      subtitle: 'Phone A initiates WebRTC call to Phone B',
      icon: Smartphone,
      color: 'teal',
      details: [
        'Phone A initiates WebRTC peer-to-peer audio connection to Phone B',
        'Phone B app auto-answers or user accepts',
        'App UI displays caller number: "+91-98XXXXXX"',
        'Risk Meter initializes: "Analyzing... ⏳"',
      ],
      tag: 'Client WebRTC',
    },
    {
      step: 2,
      title: 'STEP 2: Audio Recording & 2s Chunking',
      subtitle: 'Automatic audio capture in 2-second windows',
      icon: Mic,
      color: 'cyan',
      details: [
        'Phone B microphone captures incoming raw audio stream',
        'App audio buffer automatically slices stream into 2-second windows',
        'Chunk 1: [0-2s] "Hello, I am calling from..."',
        'Chunk 2: [2-4s] "...SBI Bank regarding your..."',
        'Chunk 3: [4-6s] "...credit card payment verification..."',
      ],
      tag: 'Audio Slicing',
    },
    {
      step: 3,
      title: 'STEP 3: Send Chunk to Backend (Real-Time)',
      subtitle: '16kHz WAV converted and transmitted via WebSocket',
      icon: Send,
      color: 'cyan',
      details: [
        'App converts 2-second audio to 16kHz mono WAV format',
        'Payload formatted with chunk_id, call_id, base64 audio_data, and timestamp',
        'Transmitted over secure low-latency WebSocket connection to FastAPI',
      ],
      tag: 'WebSocket Protocol',
    },
    {
      step: 4,
      title: 'STEP 4: Backend Processes (VoiceGuard Neural Core)',
      subtitle: 'Feature Extraction & Graph Neural Network Analysis',
      icon: Cpu,
      color: 'danger',
      details: [
        'FastAPI validates audio stream and filters out background silence',
        'Feature Extraction: Dynamic F0 Pitch contour, Spectrogram harmonics, Spectral Rolloff, Centroid & Jitter',
        'VoiceGuard Deep Neural Model evaluates 5 key anomalies:',
        '  • Spectral Artifacts (neural vocoder horizontal lines)',
        '  • Breathing Pattern (Real: 3-4s | AI: None)',
        '  • Micro-noise (Throat friction vs synthetic clean voice)',
        '  • Pitch Jitter (Organic vocal tremor vs flat quantization)',
        '  • Temporal Consistency (Cadence irregularity vs robotic pattern)',
        'Output: Spoof Score = 0.89 (89% probability fake)',
      ],
      tag: 'AI Core (VoiceGuard-v1)',
    },
    {
      step: 5,
      title: 'STEP 5: Risk Calculation & Decision Logic',
      subtitle: 'Thresholding engine converts score into actionable severity',
      icon: ShieldAlert,
      color: 'danger',
      details: [
        'if spoof_score > 0.80: HIGH RISK (89% FAKE) -> "No breathing detected, spectral artifacts present, flat pitch"',
        'elif spoof_score > 0.40: MODERATE RISK (65%) -> "Slight pitch irregularity, monitor call"',
        'else: LOW RISK (15% HUMAN) -> "Natural breathing, micro-variations present"',
      ],
      tag: 'Risk Engine',
    },
    {
      step: 6,
      title: 'STEP 6: Save to Database (Supabase)',
      subtitle: 'Immutable forensic logging with SHA-256 audio hash',
      icon: Database,
      color: 'teal',
      details: [
        'Backend inserts record into Supabase call_logs table',
        'Stores call_id, chunk_id, phone_number, risk_score, reason, and audio storage URL',
        'Computes SHA-256 hash for legal and banking cyber fraud evidence',
      ],
      tag: 'Database Persistence',
    },
    {
      step: 7,
      title: 'STEP 7: Send Result Back to Phone B',
      subtitle: 'Low-latency JSON response delivered in ~800ms',
      icon: Radio,
      color: 'cyan',
      details: [
        'Backend emits JSON verdict back to Phone B over WebSocket',
        'Transmits risk_score, risk_level, is_fake flag, reason, and confidence (0.92)',
        'Total round-trip time from speech to verdict: ~800ms',
      ],
      tag: 'WebSocket Response',
    },
    {
      step: 8,
      title: 'STEP 8: Phone B Shows Alert (UI Update)',
      subtitle: 'Dynamic risk meter color change & emergency overlay',
      icon: Bell,
      color: 'danger',
      details: [
        'App updates Radial Risk Meter: Green → Yellow → Crimson Red',
        'Displays "⚠️ HIGH RISK - 89% FAKE"',
        'Displays reason: "No breathing detected, AI voice suspected"',
        'Haptic engine vibrates phone (long buzz)',
        'Displays critical banner: "⚠️ AI VOICE DETECTED - DO NOT SHARE OTP"',
        'Plays warning alert beep',
      ],
      tag: 'Active Alerting',
    },
    {
      step: 9,
      title: 'STEP 9: Continuous Monitoring',
      subtitle: 'Repeats every 2 seconds until call ends',
      icon: Repeat,
      color: 'warning',
      details: [
        'Process repeats for Chunk 2, Chunk 3... in continuous 2-second windows',
        'Each chunk analyzed independently with live waveform visualizer',
        'If 3 consecutive chunks show HIGH risk → Auto-suggest instant call block',
      ],
      tag: 'Streaming Pipeline',
    },
    {
      step: 10,
      title: 'STEP 10: Call Ends - Forensic Summary',
      subtitle: 'Comprehensive post-call report and police export',
      icon: FileCheck,
      color: 'teal',
      details: [
        'App calculates total duration, total chunks evaluated, average risk %',
        'Final verdict logged: "AI Voice Detected - Call Blocked"',
        'Full incident report saved to History',
        '1-click export to National Cyber Crime Portal (1930) and issuing Bank',
      ],
      tag: 'Forensic Report',
    },
  ];

  return (
    <div className="neumorph-card p-6 rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyber-card border border-cyber-border text-cyber-teal shadow-glow-teal">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              SIH Architecture: 10-Step Voice Spoof Detection Pipeline
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                WAY 1 - General Spoof Detection
              </span>
            </h2>
            <p className="text-xs text-cyber-muted">
              End-to-end journey of an intercepted voice stream from WebRTC to VoiceGuard Neural Engine & Cyber Crime reporting
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyber-lightMuted bg-cyber-surface px-3 py-1.5 rounded-xl border border-cyber-border">
          10 Pipeline Stages
        </span>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isSelected = activeStep === s.step;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyber-cardElevated border-cyber-teal shadow-glow-teal scale-102'
                  : 'bg-cyber-surface border-cyber-border/60 hover:border-cyber-border hover:bg-cyber-card'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-cyber-cyan">
                  STEP {s.step}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyber-teal' : 'text-cyber-muted'}`} />
              </div>
              <p className="text-[11px] font-bold text-white truncate">
                {s.title.replace(`STEP ${s.step}: `, '')}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Showcase Card */}
      {(() => {
        const current = steps.find((s) => s.step === activeStep) || steps[0];
        const Icon = current.icon;
        return (
          <div className="p-5 rounded-3xl bg-cyber-surface border border-cyber-border shadow-neumorph-inset space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyber-card border border-cyber-border text-cyber-cyan shadow-glow-cyan">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyber-teal/20 text-cyber-teal font-bold">
                      {current.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono mt-0.5">
                    {current.title}
                  </h3>
                  <p className="text-xs text-cyber-muted">{current.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  className="px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-border text-xs text-cyber-muted hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStep((prev) => Math.min(10, prev + 1))}
                  disabled={activeStep === 10}
                  className="px-3 py-1.5 rounded-xl bg-cyber-teal hover:bg-cyber-tealDark text-cyber-bg font-bold text-xs disabled:opacity-30 cursor-pointer"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Detailed Points */}
            <div className="space-y-2 font-mono text-xs">
              {current.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-cyber-card/60 border border-cyber-border/40 text-cyber-text flex items-start gap-2.5"
                >
                  <ChevronRight className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
