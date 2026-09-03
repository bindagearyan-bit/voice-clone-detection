import React from 'react';
import { 
  Smartphone, 
  Activity, 
  Database, 
  GitCommit, 
  Settings,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const TabNav = () => {
  const { currentTab, setCurrentTab, callLogs, callState } = useCall();

  const tabs = [
    {
      id: 'split',
      label: 'Live Interception Station',
      icon: Smartphone,
      badge: callState === 'active' ? 'LIVE' : null,
      badgeColor: 'bg-cyber-danger text-white animate-pulse',
    },
    {
      id: 'forensics',
      label: 'Neural Acoustic Diagnostics',
      icon: Activity,
      badge: '5-Factor',
      badgeColor: 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/40',
    },
    {
      id: 'logs',
      label: 'Supabase Call Database',
      icon: Database,
      badge: String(callLogs.length),
      badgeColor: 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40',
    },
    {
      id: 'architecture',
      label: '10-Step Workflow Flowchart',
      icon: GitCommit,
      badge: 'SIH',
      badgeColor: 'bg-cyber-surface text-cyber-lightMuted border border-cyber-border',
    },
    {
      id: 'settings',
      label: 'Thresholds & Engine Config',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="mb-6 overflow-x-auto pb-1">
      <div className="flex items-center gap-2 p-1.5 rounded-3xl bg-[#111724] border border-cyber-border/80 shadow-neumorph-inset min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'neumorph-pill-active'
                  : 'text-cyber-muted hover:text-white hover:bg-cyber-card/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-bg' : 'text-cyber-lightMuted'}`} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-cyber-bg text-cyber-teal'
                      : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
