import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RadialRiskGauge = ({ score = 0, level = 'ANALYZING', size = 180 }) => {
  // SVG calculation for circular gauge
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Determine dynamic colors matching reference image & risk levels
  let strokeColor = '#00e5a3'; // Safe Teal
  let glowColor = 'rgba(0, 229, 163, 0.5)';
  let bgArcColor = '#1a2337';
  let badgeText = 'SAFE (HUMAN)';
  let badgeBg = 'bg-cyber-teal/10 border-cyber-teal/30 text-cyber-teal';
  let IconComponent = ShieldCheck;

  if (level === 'HIGH' || score >= 80) {
    strokeColor = '#ff3366'; // Danger Red
    glowColor = 'rgba(255, 51, 102, 0.7)';
    badgeText = '⚠️ HIGH RISK (FAKE AI)';
    badgeBg = 'bg-cyber-danger/20 border-cyber-danger/40 text-cyber-danger';
    IconComponent = ShieldAlert;
  } else if (level === 'MODERATE' || (score >= 40 && score < 80)) {
    strokeColor = '#ffb300'; // Warning Amber
    glowColor = 'rgba(255, 179, 0, 0.5)';
    badgeText = 'SUSPICIOUS (MONITOR)';
    badgeBg = 'bg-cyber-warning/20 border-cyber-warning/40 text-cyber-warning';
    IconComponent = AlertTriangle;
  } else if (level === 'ANALYZING' && score === 0) {
    strokeColor = '#00d2ff';
    glowColor = 'rgba(0, 210, 255, 0.4)';
    badgeText = 'ANALYZING... ⏳';
    badgeBg = 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Outer Neumorphic circular glow container */}
      <div 
        className="relative flex items-center justify-center rounded-full p-2"
        style={{
          width: size,
          height: size,
          background: 'radial-gradient(circle, #151d2e 0%, #0d121c 100%)',
          boxShadow: `inset 4px 4px 10px #06090e, inset -4px -4px 10px #1c273c, 0 0 25px ${glowColor}`
        }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgArcColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Risk Gauge Circle */}
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
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <IconComponent 
            className="w-5 h-5 mb-1 transition-colors duration-300"
            style={{ color: strokeColor }}
          />
          <div className="flex items-baseline">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {score}
            </span>
            <span className="text-sm font-semibold ml-0.5 text-cyber-muted">%</span>
          </div>
          <span className="text-[10px] tracking-wider uppercase font-mono font-medium text-cyber-muted mt-0.5">
            SPOOF PROB
          </span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border flex items-center gap-1.5 shadow-sm transition-all duration-300 ${badgeBg}`}>
        <span className={`w-2 h-2 rounded-full ${level === 'HIGH' ? 'bg-cyber-danger animate-ping' : level === 'MODERATE' ? 'bg-cyber-warning' : 'bg-cyber-teal'}`}></span>
        {badgeText}
      </div>
    </div>
  );
};
