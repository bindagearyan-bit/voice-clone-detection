import React from 'react';
import { 
  Activity, 
  Wind, 
  Waves, 
  Zap, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu,
  Info
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const AASISTDiagnostics = () => {
  const { features, riskScore, riskLevel, latestChunk, settings } = useCall();

  const diagnosticItems = [
    {
      id: 'spectral',
      name: 'Spectral Artifacts (Vocoder Lines)',
      description: 'Neural vocoders (HiFi-GAN, FastSpeech2) leave linear harmonic grid traces.',
      value: features.spectralArtifacts,
      isAnomaly: features.spectralArtifacts > 50,
      icon: Activity,
      humanBenchmark: '< 15%',
      aiBenchmark: '> 75%',
    },
    {
      id: 'breathing',
      name: 'Breathing Interval Absence',
      description: 'Real humans breathe every 3-4s. AI TTS generates continuous synthetic audio.',
      value: features.breathingAbsence,
      isAnomaly: features.breathingAbsence > 50,
      icon: Wind,
      humanBenchmark: '< 10% absent',
      aiBenchmark: '> 85% absent',
    },
    {
      id: 'microNoise',
      name: 'Glottal Pulse & Throat Micro-noise',
      description: 'Organic vocal tract contains biological throat friction and micro-imperfections.',
      value: 100 - features.microNoise, // Inverted: low micro noise = high anomaly
      isAnomaly: features.microNoise < 35,
      icon: Waves,
      humanBenchmark: '> 70% present',
      aiBenchmark: '< 20% present',
    },
    {
      id: 'pitch',
      name: 'F0 Pitch Contour Jitter',
      description: 'Human vocal cords naturally wobble/jitter. Cloned voice pitch is unnaturally flat.',
      value: 100 - features.pitchJitter, // Inverted: low jitter = high anomaly
      isAnomaly: features.pitchJitter < 35,
      icon: Zap,
      humanBenchmark: '> 65% jitter',
      aiBenchmark: '< 15% flat',
    },
    {
      id: 'temporal',
      name: 'Temporal Harmonic Latency',
      description: 'Measures frame-to-frame phase continuity and neural synthesis cadence.',
      value: features.temporalConsistency,
      isAnomaly: features.temporalConsistency > 50,
      icon: Clock,
      humanBenchmark: 'Varies organically',
      aiBenchmark: 'Robotic consistency',
    },
  ];

  const isHighRisk = riskLevel === 'HIGH' || riskScore >= 80;

  return (
    <div className="neumorph-card p-5 rounded-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyber-card border border-cyber-border text-cyber-cyan shadow-glow-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              VoiceGuard-v1.2 Acoustic Neural Engine
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal">
                FastAPI 16kHz
              </span>
            </h3>
            <p className="text-[11px] text-cyber-muted">
              Real-time deep learning feature extraction on 2-second audio chunks
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-cyber-muted uppercase block">
            Composite Spoof Score
          </span>
          <span className={`text-xl font-bold font-mono ${isHighRisk ? 'text-cyber-danger animate-pulse' : 'text-cyber-teal'}`}>
            {riskScore}%
          </span>
        </div>
      </div>

      {/* 5-Factor Feature Diagnostics Grid */}
      <div className="space-y-3.5">
        {diagnosticItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="p-3 rounded-2xl bg-cyber-surface border border-cyber-border/60 shadow-neumorph-inset space-y-2 transition-all hover:border-cyber-border"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${item.isAnomaly ? 'bg-cyber-danger/20 text-cyber-danger' : 'bg-cyber-teal/20 text-cyber-teal'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-cyber-muted leading-tight block">
                      {item.description}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className={`text-sm font-extrabold ${item.isAnomaly ? 'text-cyber-danger' : 'text-cyber-teal'}`}>
                    {item.value}%
                  </span>
                  <span className="text-[10px] text-cyber-muted block">
                    {item.isAnomaly ? '⚠️ Anomaly' : '✓ Normal'}
                  </span>
                </div>
              </div>

              {/* Progress Bar with Benchmarks */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-cyber-bg overflow-hidden border border-cyber-border/40 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.isAnomaly
                        ? 'bg-gradient-to-r from-orange-500 to-cyber-danger'
                        : 'bg-gradient-to-r from-emerald-600 to-cyber-teal'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, item.value))}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-cyber-muted px-0.5">
                  <span>Human: {item.humanBenchmark}</span>
                  <span>Synthetic AI: {item.aiBenchmark}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-2xl bg-cyber-card/60 border border-cyber-border/40 text-[11px] text-cyber-muted font-mono flex items-start gap-2">
        <Info className="w-4 h-4 text-cyber-cyan mt-0.5 shrink-0" />
        <span>
          <strong>VoiceGuard Neural Core:</strong> Proprietary Graph Attention Network on raw audio waveforms & high-resolution spectrograms. Detects generative diffusion, vocoder harmonics & zero-shot cloning signatures.
        </span>
      </div>
    </div>
  );
};
