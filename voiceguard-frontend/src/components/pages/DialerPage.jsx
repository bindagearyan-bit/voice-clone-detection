import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  PhoneOff, 
  Users, 
  Clock, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Plus, 
  Delete, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Mic, 
  Fingerprint, 
  ArrowUpRight, 
  Activity, 
  Info,
  UserPlus,
  UploadCloud
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';
import { DEMO_SCENARIOS } from '../../data/demoScenarios';

export const DialerPage = () => {
  const { 
    callHistory, 
    contacts, 
    addContact, 
    startProtectedCall, 
    viewCallDetails, 
    callState,
    selectedScenarioId,
    setSelectedScenarioId,
    navigateTo
  } = useVoiceGuard();

  const [activeTab, setActiveTab] = useState('dialpad'); // 'dialpad' | 'contacts' | 'recents'
  const [dialedNumber, setDialedNumber] = useState('');
  const [contactsSearch, setContactsSearch] = useState('');
  const [contactsFilter, setContactsFilter] = useState('ALL'); // 'ALL' | 'ENROLLED' | 'FAMILY' | 'WORK'
  const [recentsFilter, setRecentsFilter] = useState('ALL'); // 'ALL' | 'THREATS' | 'INCOMING' | 'OUTGOING'
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    phoneNumber: '',
    relationship: 'Family',
    category: 'Family',
    isEnrolledVoice: true
  });

  // Dialpad buttons definitions
  const keypadButtons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  const handleKeyPress = (num) => {
    if (dialedNumber.length < 15) {
      setDialedNumber((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedNumber('');
  };

  const handleInitiateCall = (targetNumber = dialedNumber, callerLabel = 'Direct Outbound Call') => {
    const finalNumber = targetNumber || dialedNumber || '+91 98110 54321';
    startProtectedCall({
      phoneNumber: finalNumber,
      callerLabel: callerLabel,
      scenarioId: selectedScenarioId,
      isOutgoing: true,
      launchNativeDialer: true
    });
  };

  // Contacts filtering
  const filteredContacts = (contacts || []).filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(contactsSearch.toLowerCase()) ||
      c.phoneNumber.includes(contactsSearch) ||
      c.relationship.toLowerCase().includes(contactsSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (contactsFilter === 'ENROLLED') return c.isEnrolledVoice;
    if (contactsFilter === 'FAMILY') return c.category === 'Family';
    if (contactsFilter === 'WORK') return c.category === 'Work';
    return true;
  });

  // Recents filtering
  const filteredRecents = (callHistory || []).filter((call) => {
    if (recentsFilter === 'THREATS') return call.riskLevel === 'HIGH';
    return true;
  });

  // Handle Add Contact Submit
  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!newContactForm.name || !newContactForm.phoneNumber) return;

    addContact({
      name: newContactForm.name,
      phoneNumber: newContactForm.phoneNumber,
      relationship: newContactForm.relationship,
      category: newContactForm.category,
      isEnrolledVoice: newContactForm.isEnrolledVoice,
      voiceprintId: newContactForm.isEnrolledVoice ? `vp_vec_${Date.now().toString().slice(-6)}` : null,
      embeddingConfidence: newContactForm.isEnrolledVoice ? 99.2 : 0,
      enrolledDate: newContactForm.isEnrolledVoice ? 'Just now' : null,
      lastSpoke: 'Just now',
      avatarBg: 'bg-indigo-600',
      initials: newContactForm.name.slice(0, 2).toUpperCase(),
      note: 'Added via VoiceGuard Phone App.'
    });

    setIsAddContactModalOpen(false);
    setNewContactForm({
      name: '',
      phoneNumber: '',
      relationship: 'Family',
      category: 'Family',
      isEnrolledVoice: true
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header with Phone App Title & Navigation Subtabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
              Protected Telephony Engine
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              ● Live AI Shield Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            VoiceGuard Phone & Dialer
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Place verified calls, search trusted contacts, and inspect real-time intercepted speech forensics.
          </p>
        </div>

        {/* 3 Main View Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 shadow-inner text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('dialpad')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dialpad'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Dialpad</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contacts & Vault</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700">
              {contacts?.length || 6}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('recents')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'recents'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Recent Calls</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-300 text-slate-800">
              {callHistory?.length || 4}
            </span>
          </button>

          <button
            onClick={() => navigateTo('/audiolab')}
            className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200"
          >
            <UploadCloud className="w-4 h-4 text-cyan-600" />
            <span>Audio Lab (WAV)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DIALPAD VIEW                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'dialpad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Phone Keypad Container (7 cols) */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-6 flex flex-col items-center max-w-md mx-auto w-full">
            {/* Display Screen */}
            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between min-h-[64px]">
              <div className="overflow-x-auto whitespace-nowrap font-mono text-2xl font-extrabold text-slate-900 tracking-wider">
                {dialedNumber ? (
                  <span>{dialedNumber}</span>
                ) : (
                  <span className="text-slate-300 text-lg font-normal">Enter phone number...</span>
                )}
              </div>

              {dialedNumber && (
                <button
                  onClick={handleBackspace}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  title="Backspace"
                >
                  <Delete className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 3x4 Touch Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3.5 w-full">
              {keypadButtons.map((btn) => (
                <button
                  key={btn.num}
                  onClick={() => handleKeyPress(btn.num)}
                  className="h-16 rounded-2xl bg-slate-50 hover:bg-blue-50 active:scale-95 border border-slate-200 hover:border-blue-300 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-sm"
                >
                  <span className="text-xl font-bold font-mono text-slate-800 group-hover:text-blue-600">
                    {btn.num}
                  </span>
                  {btn.letters && (
                    <span className="text-[9px] font-mono text-slate-400 group-hover:text-blue-500 tracking-wider">
                      {btn.letters}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Shield Status Badge */}
            <div className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-xs font-mono text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>VoiceGuard Shield Armed (16kHz Live Monitoring)</span>
            </div>

            {/* Call Buttons Action Row */}
            <div className="w-full flex items-center gap-3">
              {dialedNumber && (
                <button
                  onClick={handleClear}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                onClick={() => handleInitiateCall(dialedNumber || '+91 98110 54321', dialedNumber ? `Dialed: ${dialedNumber}` : 'Aarav Sharma')}
                className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-sm font-mono flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Call with VoiceGuard Shield</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Speed Dial & Simulator Scenarios (5 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Speed Dial Known Contacts */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-600" />
                  Speed Dial & Voice Vault
                </h3>
                <span className="text-[11px] font-mono text-slate-400">1-Click Call</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(contacts || []).slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setDialedNumber(c.phoneNumber);
                      handleInitiateCall(c.phoneNumber, c.name);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${c.avatarBg} text-white font-bold font-mono text-xs flex items-center justify-center shrink-0`}>
                        {c.initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                          {c.name}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500 truncate">
                          {c.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Call Simulation Scenarios */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  SIMULATION TEST SCENARIO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-cyan-300 border border-cyan-500/30">
                  Demo Ready
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Choose the voice profile type to evaluate when placing the outbound/inbound test call:
              </p>

              <div className="space-y-2 font-mono text-xs">
                {DEMO_SCENARIOS.map((sc) => {
                  const isSelected = selectedScenarioId === sc.id;
                  const isHigh = sc.expectedRiskLevel === 'HIGH';
                  const isMod = sc.expectedRiskLevel === 'MODERATE';
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenarioId(sc.id);
                        setDialedNumber(sc.callerNumber);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-950/80 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-bold block">{sc.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {sc.callerNumber} • {sc.expectedRiskLevel} RISK TARGET
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isHigh ? 'bg-red-950 text-red-400 border border-red-500/30' : isMod ? 'bg-amber-950 text-amber-400 border border-amber-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                        {isHigh ? 'AI CLONE' : isMod ? 'MODERATE' : 'REAL HUMAN'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CONTACTS & TRUSTED VOICE VAULT VIEW                                    */}
      {/* ========================================================================= */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {/* Top Search & Filter Bar */}
          <div className="p-4 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={contactsSearch}
                onChange={(e) => setContactsSearch(e.target.value)}
                placeholder="Search contact name, phone number, or relationship..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              {['ALL', 'ENROLLED', 'FAMILY', 'WORK'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setContactsFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                    contactsFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'ENROLLED' ? '🛡️ Voice Vault Enrolled' : filter}
                </button>
              ))}

              <button
                onClick={() => setIsAddContactModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 ml-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Contact & Enroll Voice</span>
              </button>
            </div>
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${contact.avatarBg} text-white font-bold font-mono text-sm flex items-center justify-center shadow-sm`}>
                        {contact.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 font-mono">
                          {contact.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {contact.relationship}
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                      {contact.category}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-bold text-slate-800">{contact.phoneNumber}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Voiceprint:</span>
                      {contact.isEnrolledVoice ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Enrolled ({contact.embeddingConfidence}%)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                          Not Enrolled
                        </span>
                      )}
                    </div>
                  </div>

                  {contact.note && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      "{contact.note}"
                    </p>
                  )}
                </div>

                {/* Call Button */}
                <button
                  onClick={() => handleInitiateCall(contact.phoneNumber, contact.name)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer mt-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call with AI Shield</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RECENT CALLS VIEW                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'recents' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-card-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Call Log & Telemetry History
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecentsFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  recentsFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Calls ({callHistory?.length || 0})
              </button>
              <button
                onClick={() => setRecentsFilter('THREATS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  recentsFilter === 'THREATS'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                🔴 AI Threats Intercepted
              </button>
            </div>
          </div>

          {/* Calls List */}
          <div className="space-y-3">
            {filteredRecents.map((call) => {
              const isHigh = call.riskLevel === 'HIGH';
              const isMod = call.riskLevel === 'MODERATE';
              return (
                <div
                  key={call.id}
                  className="p-4 md:p-5 rounded-3xl bg-white border border-slate-200 shadow-card-subtle hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-2xl ${isHigh ? 'bg-red-100 text-red-600' : isMod ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isHigh ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : isMod ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <PhoneIncoming className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 font-mono">
                          {call.phoneNumber}
                        </h4>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${isHigh ? 'bg-red-50 text-red-700 border border-red-200' : isMod ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {call.riskScore}% {isHigh ? 'AI VOICE SUSPECTED' : isMod ? 'MODERATE' : 'NATURAL'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {call.callerTag} • {call.timestamp} • {call.durationSec}s ({call.chunksAnalyzed} Chunks Sliced)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                    <button
                      onClick={() => viewCallDetails(call.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all cursor-pointer"
                    >
                      View Forensic Report
                    </button>
                    <button
                      onClick={() => handleInitiateCall(call.phoneNumber, call.callerTag)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Redial</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD CONTACT & ENROLL VOICE MODAL                                          */}
      {/* ========================================================================= */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl max-w-md w-full space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  Enroll New Contact & Voice
                </h3>
              </div>
              <button
                onClick={() => setIsAddContactModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Contact Name</label>
                <input
                  type="text"
                  required
                  value={newContactForm.name}
                  onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newContactForm.phoneNumber}
                  onChange={(e) => setNewContactForm({ ...newContactForm, phoneNumber: e.target.value })}
                  placeholder="e.g. +91 98332 10992"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Category</label>
                <select
                  value={newContactForm.category}
                  onChange={(e) => setNewContactForm({ ...newContactForm, category: e.target.value, relationship: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Family">Family</option>
                  <option value="Work">VIP / Work / Management</option>
                  <option value="Bank">Bank Official</option>
                  <option value="Personal">Personal Friend</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  <span>Biometric Voice Enrollment</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  VoiceGuard will extract a 192-dimensional acoustic embedding for this contact to prevent future voice-clone impersonation.
                </p>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newContactForm.isEnrolledVoice}
                    onChange={(e) => setNewContactForm({ ...newContactForm, isEnrolledVoice: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-900">Enroll Voice Vault Profile</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  Save & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
