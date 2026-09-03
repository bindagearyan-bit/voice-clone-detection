import React from 'react';
import { 
  Bell, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Cpu, 
  Sliders,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';
import { DEMO_SCENARIOS } from '../../data/demoScenarios';

export const TopHeader = () => {
  const { 
    currentRoute, 
    navigateTo, 
    unreadCount, 
    selectedScenarioId, 
    setSelectedScenarioId, 
    startProtectedCall, 
    callState,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useVoiceGuard();

  const getPageTitle = () => {
    switch (currentRoute) {
      case '/home':
        return 'Security Command Dashboard';
      case '/dialer':
        return 'Protected Phone Dialer & Contacts Vault';
      case '/calls':
        return 'Unknown Calls Protection & Real-Time Monitor';
      case '/notifications':
        return 'Security Notifications & Threat Alerts';
      case '/history':
        return 'Unknown Calls History & Telemetry Ledger';
      case '/settings':
        return 'VoiceGuard Protection Settings';
      case '/about':
        return 'About VoiceGuard Neural Architecture';
      default:
        return 'Voice Threat Protection';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between gap-3 shrink-0 shadow-sm">
      {/* Title, Mobile Hamburger & Status */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold font-mono text-[10px] md:text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Protection Active
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Scenario Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono">
          <span className="text-slate-500 hidden sm:inline">Scenario:</span>
          <select
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value)}
            disabled={callState === 'monitoring' || callState === 'incoming'}
            className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
          >
            {DEMO_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id} className="bg-white text-slate-900">
                {sc.expectedRiskLevel === 'HIGH' ? '🔴' : sc.expectedRiskLevel === 'MODERATE' ? '🟡' : '🟢'} {sc.title}
              </option>
            ))}
          </select>
        </div>

        {/* Start Protected Call Button */}
        <button
          onClick={() => startProtectedCall()}
          disabled={callState === 'monitoring' || callState === 'incoming'}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{callState === 'monitoring' ? 'Call Active...' : 'Start Protected Call'}</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => navigateTo('/notifications')}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="View Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
