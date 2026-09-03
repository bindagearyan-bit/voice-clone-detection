import React, { useEffect, useRef } from 'react';

export const LiveAudioWave = ({ isActive = true, isFake = false, frequencyData = null, height = 48 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isActive) {
        // Flatline idle state
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#27344e';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      const width = canvas.width;
      const h = canvas.height;
      const midY = h / 2;
      const numBars = 36;
      const barWidth = width / numBars - 2;

      // Color scheme based on fake/real
      const primaryColor = isFake ? '#ff3366' : '#00e5a3';
      const glowColor = isFake ? 'rgba(255, 51, 102, 0.4)' : 'rgba(0, 229, 163, 0.4)';

      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 6;
        if (frequencyData && frequencyData.length > 0) {
          const dataIdx = Math.floor((i / numBars) * frequencyData.length);
          const val = frequencyData[dataIdx] || 0;
          barHeight = Math.max(4, (val / 255) * (h * 0.85));
        } else {
          // Simulated organic or synthetic waveform
          const freq = isFake ? 0.35 : 0.18; // Synthetic = higher robotic frequency
          const noise = isFake ? (Math.random() > 0.8 ? 8 : 0) : Math.sin(phase * 2 + i) * 6;
          barHeight = Math.max(4, Math.abs(Math.sin(phase + i * freq)) * (h * 0.75) + noise);
        }

        const x = i * (barWidth + 2);
        const y = midY - barHeight / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isFake) {
          grad.addColorStop(0, '#ff3366');
          grad.addColorStop(1, '#ff6b8b');
        } else {
          grad.addColorStop(0, '#00e5a3');
          grad.addColorStop(1, '#00d2ff');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += isFake ? 0.12 : 0.07;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isFake, frequencyData]);

  return (
    <div className="w-full bg-[#0d121c] p-2.5 rounded-xl border border-cyber-border/40 shadow-neumorph-inset">
      <div className="flex items-center justify-between text-[11px] font-mono text-cyber-muted mb-1.5 px-1">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? (isFake ? 'bg-cyber-danger animate-pulse' : 'bg-cyber-teal animate-pulse') : 'bg-cyber-muted'}`} />
          {isActive ? (isFake ? 'SYNTHETIC SPECTRUM (16kHz WAV)' : 'ORGANIC VOICE STREAM (16kHz)') : 'AUDIO STREAM IDLE'}
        </span>
        <span className="text-cyber-lightMuted font-mono">
          {isActive ? (isFake ? 'CQCC / MFCC ANOMALY' : 'F0 JITTER NORMAL') : 'READY'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={height}
        className="w-full block"
      />
    </div>
  );
};
