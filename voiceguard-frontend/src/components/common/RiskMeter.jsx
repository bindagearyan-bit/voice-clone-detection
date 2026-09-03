import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export const RiskMeter = ({ score = 15, level = 'LOW', size = 200, showLabel = true }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let strokeColor = '#16a34a'; // Safe Green
  let glowColor = 'rgba(22, 163, 74, 0.2)';
  let bgTrack = '#e2e8f0';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusText = 'LOW SPOOF RISK';
  let Icon = ShieldCheck;

  if (level === 'HIGH' || score >= 80) {
    strokeColor = '#dc2626'; // Danger Red
    glowColor = 'rgba(220, 38, 38, 0.25)';
    badgeBg = 'bg-red-50 text-red-700 border-red-200';
    statusText = 'HIGH SPOOF RISK';
    Icon = ShieldAlert;
  } else if (level === 'MODERATE' || (score >= 40 && score < 80)) {
    strokeColor = '#d97706'; // Warning Amber
    glowColor = 'rgba(217, 119, 6, 0.25)';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    statusText = 'MODERATE SPOOF RISK';
    Icon = AlertTriangle;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center rounded-full transition-all duration-700"
        style={{
          width: size,
          height: size,
          boxShadow: `0 8px 30px ${glowColor}`
        }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgTrack}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Risk Gauge */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <Icon className="w-6 h-6 mb-1 transition-colors duration-300" style={{ color: strokeColor }} />
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
              {score}
            </span>
            <span className="text-lg font-bold ml-0.5 text-slate-400 font-mono">%</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-slate-500 mt-0.5">
            Spoof Risk
          </span>
        </div>
      </div>

      {showLabel && (
        <div className={`mt-3.5 px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm transition-all duration-300 ${badgeBg}`}>
          <span className={`w-2 h-2 rounded-full ${level === 'HIGH' ? 'bg-red-500 animate-ping' : level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {statusText}
        </div>
      )}
    </div>
  );
};
