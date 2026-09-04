import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  PhoneCall, 
  Activity, 
  Radio, 
  Zap, 
  Layers, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Server,
  Lock
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const HomePage = () => {
  const { 
    currentUser,
    startProtectedCall, 
    navigateTo, 
    callHistory, 
    viewCallDetails 
  } = useVoiceGuard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 22) return '🌆';
    return '🌙';
  };

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || '';

  const steps = [
    { num: '01', title: 'Unknown Call', desc: 'Call arrives from an unregistered number.' },
    { num: '02', title: 'Audio Captured', desc: 'Microphone stream captured upon answer.' },
    { num: '03', title: '2s Audio Chunks', desc: 'Slices audio into 16kHz WAV segments.' },
    { num: '04', title: 'AI Analysis', desc: 'VoiceGuard Neural Model extracts spectral & pitch dynamics.' },
    { num: '05', title: 'Spoof Risk', desc: 'Dynamic score generated in ~800ms.' },
    { num: '06', title: 'User Alert', desc: 'Instant warning if synthetic voice detected.' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Greeting & Status Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            AI Cyber Defense Hub
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>{getGreeting()}{userName ? `, ${userName}` : ''}</span>
            <span>{getGreetingIcon()}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Your voice is your identity. We protect it.
          </p>
        </div>

        {/* Protection Active Badge Card */}
        <div className="p-3.5 px-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">
              ● PROTECTION ACTIVE
            </span>
            <span className="text-[11px] text-slate-500">
              Real-Time VoiceGuard Shield
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl overflow-hidden">
        {/* Subtle background visual elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-cyan-300">
              <Zap className="w-3.5 h-3.5" />
              <span>VoiceGuard-v1.2 16kHz Deep Learning Engine</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              AI-Powered Voice Threat Detection
            </h2>

            <p className="text-sm md:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Detect AI-generated and cloned voices in real time during unknown calls. Safeguard against deepfake audio scams, unauthorized OTP extortions, and synthetic speech deception.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('/audiolab')}
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/40 transition-all cursor-pointer font-mono"
              >
                <Zap className="w-4 h-4" />
                <span>Upload & Test .WAV Audio</span>
              </button>

              <button
                onClick={() => navigateTo('/dialer')}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/40 transition-all cursor-pointer font-mono"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Open Phone Dialer</span>
              </button>

              <button
                onClick={() => startProtectedCall()}
                className="px-5 py-3 rounded-2xl bg-blue-600/80 hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer font-mono border border-blue-400/30"
              >
                <Activity className="w-4 h-4 text-cyan-300" />
                <span>Simulate Call</span>
              </button>

              <button
                onClick={() => navigateTo('/calls')}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-all cursor-pointer font-mono"
              >
                <span>Live Monitor</span>
              </button>
            </div>
          </div>

          {/* Glowing Shield & Voice Waveform Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative flex items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
              {/* Glowing Shield */}
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                <ShieldCheck className="w-16 h-16 stroke-[2.5]" />
              </div>

              {/* Orbital Mini Badges */}
              <div className="absolute -top-3 -right-3 p-2.5 rounded-xl bg-slate-900/90 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>2s Chunks</span>
              </div>

              <div className="absolute -bottom-3 -left-3 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>~800ms Latency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards (Dynamic Live Telemetry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Calls Monitored Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase">
              Calls Monitored
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {callHistory.length}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live Synced
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Total cellular & WebRTC protected calls</p>
        </div>

        {/* Stat 2: Threats Detected */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase">
              Threats Intercepted
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 font-mono">
              {callHistory.filter(c => c.riskLevel === 'HIGH' || c.riskScore >= 75).length}
            </span>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              High Spoof Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Synthetic AI voices intercepted</p>
        </div>

        {/* Stat 3: Calls Analyzed */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase">
              Audio Chunks Sliced
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {callHistory.reduce((acc, c) => acc + (c.chunksAnalyzed || c.chunks?.length || 1), 0)}
            </span>
            <span className="text-xs font-mono text-slate-500">2-second windows</span>
          </div>
          <p className="text-[11px] text-slate-400">16kHz audio spectral analysis</p>
        </div>

        {/* Stat 4: Protection Status */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase">
              Protection Status
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-700 font-mono">100% ACTIVE</span>
          </div>
          <p className="text-[11px] text-slate-400">VoiceGuard-v1.2 Neural Core (~65ms)</p>
        </div>
      </div>

      {/* Middle Grid: Recent Activity & Threat Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity (8 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Recent Unknown Call Activity
              </h3>
            </div>
            <button
              onClick={() => navigateTo('/history')}
              className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {callHistory.slice(0, 4).map((call) => {
              const isHigh = call.riskLevel === 'HIGH';
              const isModerate = call.riskLevel === 'MODERATE';
              return (
                <div
                  key={call.id}
                  onClick={() => viewCallDetails(call.id)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isHigh ? 'bg-red-100 text-red-600' : isModerate ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isHigh ? <ShieldAlert className="w-4 h-4" /> : isModerate ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-mono">
                        {call.phoneNumber}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {call.callerTag} • {call.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${isHigh ? 'bg-red-50 text-red-700 border border-red-200' : isModerate ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {call.riskScore}% {isHigh ? 'AI VOICE' : isModerate ? 'MODERATE' : 'NATURAL'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {call.durationSec}s • {call.chunksAnalyzed} Chunks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Overview & Model Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Threat Overview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              Threat Risk Distribution
            </h3>

            <div className="space-y-3">
              {/* Low Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-emerald-700 font-bold">Natural Voice (Low Spoof Risk)</span>
                  <span className="font-bold text-slate-800">72%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              {/* Moderate Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-700 font-bold">Moderate / Unusual Voice</span>
                  <span className="font-bold text-slate-800">18%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              {/* High Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-red-700 font-bold">AI Voice Suspected (High Risk)</span>
                  <span className="font-bold text-slate-800">10%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW VOICEGUARD PROTECTS YOU - 6-Step Visual Explanation */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            Automated Protection Lifecycle
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            How VoiceGuard Protects You
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            From the moment an unknown number rings to real-time deep learning verification
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 transition-all hover:border-blue-300 hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-mono font-extrabold text-xs flex items-center justify-center">
                {s.num}
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">
                {s.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
