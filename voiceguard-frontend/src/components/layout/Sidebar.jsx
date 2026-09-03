import React from 'react';
import { 
  Home, 
  Phone,
  PhoneCall, 
  UploadCloud,
  Bell, 
  History, 
  Settings, 
  Info, 
  ShieldCheck, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight,
  Radio,
  ChevronRight,
  LogOut,
  UserCheck,
  X
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const Sidebar = () => {
  const { 
    currentUser,
    logoutUser,
    currentRoute, 
    navigateTo, 
    unreadCount, 
    demoModeActive, 
    setDemoModeActive, 
    callState,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useVoiceGuard();

  const navLinks = [
    {
      id: '/home',
      label: 'HOME',
      icon: Home,
      badge: null,
    },
    {
      id: '/audiolab',
      label: 'AUDIO LAB (WAV)',
      icon: UploadCloud,
      badge: 'TESTER',
      badgeColor: 'bg-cyan-600 text-white animate-pulse',
    },
    {
      id: '/dialer',
      label: 'DIALER & PHONE',
      icon: Phone,
      badge: 'KEYPAD',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: '/calls',
      label: 'UNKNOWN CALLS',
      icon: PhoneCall,
      badge: callState === 'monitoring' ? 'ACTIVE' : null,
      badgeColor: 'bg-red-500 text-white animate-pulse',
    },
    {
      id: '/notifications',
      label: 'NOTIFICATIONS',
      icon: Bell,
      badge: unreadCount > 0 ? String(unreadCount) : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: '/history',
      label: 'HISTORY',
      icon: History,
      badge: null,
    },
    {
      id: '/settings',
      label: 'SETTINGS',
      icon: Settings,
      badge: null,
    },
    {
      id: '/about',
      label: 'ABOUT VOICEGUARD',
      icon: Info,
      badge: null,
    },
  ];

  const handleLinkClick = (id) => {
    navigateTo(id);
    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden animate-fadeIn"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg text-sidebar-text border-r border-sidebar-border flex flex-col justify-between shrink-0 select-none min-h-screen transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:w-64 md:z-auto
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Brand Section & Mobile Close Button */}
        <div className="p-5 border-b border-sidebar-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 font-mono">
                VoiceGuard
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                  AI
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                AI Voice Threat Protection
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5 sidebar-scroll overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Core Navigation
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentRoute === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/20 text-white border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="tracking-wide">{link.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {link.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </div>

      {/* Bottom Status & Demo Mode Control */}
      <div className="p-4 border-t border-sidebar-border/60 bg-sidebar-card/60 space-y-3">
        {/* Protection Active Badge */}
        <div className="p-2.5 rounded-xl bg-sidebar-card border border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold text-white">
              PROTECTION ACTIVE
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            VOICEGUARD
          </span>
        </div>

        {/* Demo Mode Toggle */}
        <div className="p-2.5 rounded-xl bg-sidebar-card border border-sidebar-border flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold text-slate-200 block">
              Demo Mode
            </span>
            <span className="text-[10px] text-slate-400 block">
              Simulated 2s stream
            </span>
          </div>

          <button
            onClick={() => setDemoModeActive(!demoModeActive)}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${demoModeActive ? 'text-blue-400 hover:text-blue-300' : 'text-slate-500 hover:text-slate-400'}`}
            title="Toggle Demo Mode"
          >
            {demoModeActive ? (
              <ToggleRight className="w-6 h-6" />
            ) : (
              <ToggleLeft className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* User Account & Logout */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-sidebar-card border border-sidebar-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="min-w-0 truncate">
                <span className="text-xs font-mono font-bold text-slate-200 block truncate">
                  {currentUser.name || 'User'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {currentUser.email || 'active session'}
                </span>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Sign Out / Switch User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  </>
  );
};

