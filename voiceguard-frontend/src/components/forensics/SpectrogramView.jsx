import React, { useEffect, useRef } from 'react';
import { Activity, BarChart2, Radio, Sparkles } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const SpectrogramView = () => {
  const { callState, isFakeVoice, latestChunk } = useCall();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Draw background grid
      ctx.fillStyle = '#0a0e17';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#182236';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      if (callState === 'active') {
        const numColumns = 60;
        const colWidth = width / numColumns;

        for (let col = 0; col < numColumns; col++) {
          const x = col * colWidth;
          const isAi = isFakeVoice;

          // Generate frequency bins (low, mid, high frequencies)
          for (let row = 0; row < 18; row++) {
            const y = height - (row + 1) * (height / 18);
            const rowHeight = height / 18 - 1;

            let intensity;
            if (isAi) {
              // Synthetic Voice: creates unnatural rigid horizontal lines & high frequency cutoffs
              if (row === 8 || row === 12) {
                intensity = 0.9; // Harmonic streak artifact
              } else if (row > 14) {
                intensity = 0.05; // Vocoder high-freq cutoff
              } else {
                intensity = Math.sin(offset * 0.1 + col * 0.3) * 0.4 + 0.3;
              }
            } else {
              // Human Voice: rich natural frequency harmonics with organic dispersion
              intensity = Math.abs(Math.sin(offset * 0.05 + col * 0.15 + row * 0.4)) * 0.8 + 0.1;
            }

            if (intensity > 0.6) {
              ctx.fillStyle = isAi ? `rgba(255, 51, 102, ${intensity})` : `rgba(0, 229, 163, ${intensity})`;
            } else if (intensity > 0.3) {
              ctx.fillStyle = isAi ? `rgba(255, 179, 0, ${intensity})` : `rgba(0, 210, 255, ${intensity})`;
            } else {
              ctx.fillStyle = `rgba(28, 40, 64, ${intensity})`;
            }

            ctx.fillRect(x, y, colWidth - 1, rowHeight);
          }
        }

        offset += 1;
      } else {
        // Idle message
        ctx.fillStyle = '#4a5b78';
        ctx.font = '11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText('VoiceGuard 16kHz Spectrogram Standby', width / 2, height / 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [callState, isFakeVoice]);

  return (
    <div className="neumorph-card p-5 rounded-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyber-card border border-cyber-border text-cyber-cyan shadow-glow-cyan">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              16kHz Spectrogram & MFCC Waterfall
            </h3>
            <p className="text-[11px] text-cyber-muted">
              Frequency distribution & neural vocoder artifact detection
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-surface border border-cyber-border text-cyber-lightMuted">
          0 Hz – 8,000 Hz Nyquist
        </span>
      </div>

      {/* Spectrogram Canvas */}
      <div className="rounded-2xl overflow-hidden border border-cyber-border/80 shadow-neumorph-inset">
        <canvas
          ref={canvasRef}
          width={520}
          height={140}
          className="w-full block"
        />
      </div>

      {/* Spectral Artifact Indicator */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border/40 space-y-1">
          <span className="text-[10px] text-cyber-muted block">MFCC 40-Coefficients Delta</span>
          <span className={`font-bold ${isFakeVoice ? 'text-cyber-danger' : 'text-cyber-teal'}`}>
            {isFakeVoice ? 'High Cepstral Variance (+18.4 dB)' : 'Normal Formants (±3.2 dB)'}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border/40 space-y-1">
          <span className="text-[10px] text-cyber-muted block">F0 Fundamental Pitch Track</span>
          <span className={`font-bold ${isFakeVoice ? 'text-cyber-danger' : 'text-cyber-teal'}`}>
            {isFakeVoice ? 'Flat Monotonic (132.8 Hz ±0.3)' : 'Natural Dynamic Jitter (124.6 Hz)'}
          </span>
        </div>
      </div>
    </div>
  );
};
