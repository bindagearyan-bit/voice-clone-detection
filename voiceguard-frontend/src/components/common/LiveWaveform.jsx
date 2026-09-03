import React, { useEffect, useRef } from 'react';

export const LiveWaveform = ({ isActive = true, isHighRisk = false, height = 44 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      if (!isActive) {
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      const numBars = 38;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const freq = isHighRisk ? 0.35 : 0.2;
        const noise = isHighRisk ? (Math.random() > 0.8 ? 8 : 0) : Math.sin(phase * 2 + i) * 4;
        const barHeight = Math.max(4, Math.abs(Math.sin(phase + i * freq)) * (h * 0.75) + noise);

        const x = i * (barWidth + 2);
        const y = midY - barHeight / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isHighRisk) {
          grad.addColorStop(0, '#dc2626');
          grad.addColorStop(1, '#f87171');
        } else {
          grad.addColorStop(0, '#2563eb');
          grad.addColorStop(1, '#06b6d4');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += isHighRisk ? 0.12 : 0.08;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isHighRisk]);

  return (
    <div className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1 px-1">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? (isHighRisk ? 'bg-red-500 animate-pulse' : 'bg-blue-600 animate-pulse') : 'bg-slate-400'}`} />
          {isActive ? (isHighRisk ? 'SYNTHETIC SPECTRUM (16kHz WAV)' : 'LIVE AUDIO STREAM (16kHz WAV)') : 'AUDIO MONITOR IDLE'}
        </span>
        <span className="text-slate-400 font-mono">
          {isActive ? 'VOICEGUARD FEATURE EXTRACTION ACTIVE' : 'STANDBY'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={340}
        height={height}
        className="w-full block"
      />
    </div>
  );
};
