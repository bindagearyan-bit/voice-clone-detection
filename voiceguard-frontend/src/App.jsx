import React from 'react';
import { VoiceGuardProvider, useVoiceGuard } from './context/VoiceGuardContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { HomePage } from './components/pages/HomePage';
import { DialerPage } from './components/pages/DialerPage';
import { ProtectedCallPage } from './components/pages/ProtectedCallPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { AboutPage } from './components/pages/AboutPage';
import { AudioLabPage } from './components/pages/AudioLabPage';
import { LoginPage } from './components/pages/LoginPage';
import { HighRiskAlertModal } from './components/common/HighRiskAlertModal';
import { CallSummaryModal } from './components/common/CallSummaryModal';
import { CallDetailModal } from './components/common/CallDetailModal';
import { PermissionsModal } from './components/common/PermissionsModal';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

const AppContent = () => {
  const { currentRoute, currentUser } = useVoiceGuard();

  // If user is not authenticated, show attractive Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/home':
        return <HomePage />;
      case '/dialer':
        return <DialerPage />;
      case '/audiolab':
      case '/upload':
        return <AudioLabPage />;
      case '/calls':
        return <ProtectedCallPage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/history':
        return <HistoryPage />;
      case '/settings':
        return <SettingsPage />;
      case '/about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Dark Navy Sidebar */}
      <Sidebar />

      {/* Main Light Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100 overflow-y-auto">
        {/* Top Header Bar */}
        <TopHeader />

        {/* Dynamic Page Workspace Content */}
        <main className="flex-1 pb-20 md:pb-12">
          {renderCurrentPage()}
        </main>

        {/* Global Modals & Drawers */}
        <PermissionsModal />
        <HighRiskAlertModal />
        <CallSummaryModal />
        <CallDetailModal />

        {/* Desktop Footer */}
        <footer className="hidden md:flex px-8 py-4 bg-white border-t border-slate-200 text-xs font-mono text-slate-500 items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">VoiceGuard AI</span>
            <span>•</span>
            <span>Real-Time Voice Threat Protection</span>
          </div>
        </footer>

        {/* Sleek Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 flex items-center justify-around py-2 px-1">
          <button
            onClick={() => navigateTo('/home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${currentRoute === '/home' ? 'text-cyan-400 font-bold' : 'hover:text-white'}`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-mono">Home</span>
          </button>

          <button
            onClick={() => navigateTo('/dialer')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${currentRoute === '/dialer' ? 'text-emerald-400 font-bold' : 'hover:text-white'}`}
          >
            <span className="text-lg">📞</span>
            <span className="text-[10px] font-mono">Dialer</span>
          </button>

          <button
            onClick={() => navigateTo('/audiolab')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${currentRoute === '/audiolab' ? 'text-cyan-400 font-bold' : 'hover:text-white'}`}
          >
            <span className="text-lg">🔬</span>
            <span className="text-[10px] font-mono">Lab</span>
          </button>

          <button
            onClick={() => navigateTo('/history')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${currentRoute === '/history' ? 'text-blue-400 font-bold' : 'hover:text-white'}`}
          >
            <span className="text-lg">📋</span>
            <span className="text-[10px] font-mono">History</span>
          </button>

          <button
            onClick={() => navigateTo('/settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${currentRoute === '/settings' ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
          >
            <span className="text-lg">⚙️</span>
            <span className="text-[10px] font-mono">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <VoiceGuardProvider>
      <AppContent />
    </VoiceGuardProvider>
  );
}
