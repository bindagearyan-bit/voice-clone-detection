import React, { useState } from 'react';
import { 
  Mic, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Lock, 
  AlertCircle,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const PermissionsModal = () => {
  const { 
    currentUser, 
    showPermissionsModal, 
    completePermissionsFlow,
    addContact
  } = useVoiceGuard();

  const [step, setStep] = useState('mic'); // 'mic' | 'contacts' | 'complete'
  const [micStatus, setMicStatus] = useState(null); // 'granted' | 'denied' | 'once'
  const [contactsStatus, setContactsStatus] = useState(null); // 'granted' | 'denied'
  const [isRequestingBrowser, setIsRequestingBrowser] = useState(false);

  if (!showPermissionsModal) return null;

  // Handle Microphone Permission Action
  const handleMicDecision = async (decision) => {
    setMicStatus(decision);
    if (decision === 'granted' || decision === 'once') {
      setIsRequestingBrowser(true);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop immediate test track
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.warn('Browser mic prompt was declined or not supported:', err);
      } finally {
        setIsRequestingBrowser(false);
      }
    }
    // Proceed to Step 2 (Contacts)
    setStep('contacts');
  };

  // Handle Contacts Permission Action (with Native Mobile Contact Picker)
  const handleContactsDecision = async (decision) => {
    setContactsStatus(decision);
    if (decision === 'granted') {
      // Check for native mobile phone Contact Picker API (Chrome on Android)
      if ('contacts' in navigator && 'ContactsManager' in window) {
        try {
          const props = ['name', 'tel'];
          const selectedContacts = await navigator.contacts.select(props, { multiple: true });
          if (selectedContacts && selectedContacts.length > 0) {
            selectedContacts.forEach((c) => {
              const contactName = c.name && c.name[0] ? c.name[0] : 'Phone Contact';
              const contactPhone = c.tel && c.tel[0] ? c.tel[0] : '+91 98765 43210';
              if (addContact) {
                addContact({
                  name: contactName,
                  phoneNumber: contactPhone,
                  relationship: 'Trusted Contact',
                  category: 'Personal',
                  isEnrolledVoice: true,
                  voiceprintId: `vp_mobile_${Date.now().toString().slice(-6)}`,
                  embeddingConfidence: 99.0,
                  enrolledDate: 'Imported from Phone',
                  lastSpoke: 'Never',
                  avatarBg: 'bg-emerald-600',
                  initials: contactName.slice(0, 2).toUpperCase(),
                  note: 'Imported from mobile address book.'
                });
              }
            });
          }
        } catch (contactErr) {
          console.warn('Mobile contact picker dialog dismissed:', contactErr);
        }
      }
    }
    setStep('complete');
  };

  // Finish Onboarding
  const handleFinish = () => {
    completePermissionsFlow({
      microphone: micStatus === 'granted' || micStatus === 'once',
      contacts: contactsStatus === 'granted'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Mobile Device Dialog Container */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp text-slate-900 dark:text-white">
        {/* Top Mini Phone Speaker Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: MICROPHONE PERMISSION PROMPT                                      */}
        {/* ========================================================================= */}
        {step === 'mic' && (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Mic className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Permission Request 1 of 2
              </span>
              <h3 className="text-base font-extrabold tracking-tight">
                Allow "VoiceGuard AI" to access your Microphone?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                VoiceGuard needs microphone access during unknown calls to analyze 2-second voice chunks and protect you against AI voice clone scams.
              </p>
            </div>

            {/* Permission Action Buttons (Native Phone OS Style) */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleMicDecision('granted')}
                disabled={isRequestingBrowser}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                {isRequestingBrowser ? 'Prompting Browser...' : 'While using the app'}
              </button>

              <button
                type="button"
                onClick={() => handleMicDecision('once')}
                disabled={isRequestingBrowser}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold transition-all cursor-pointer"
              >
                Only this time
              </button>

              <button
                type="button"
                onClick={() => handleMicDecision('denied')}
                disabled={isRequestingBrowser}
                className="w-full py-2 px-4 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-mono text-xs font-medium transition-all cursor-pointer"
              >
                Don't allow
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CONTACTS PERMISSION PROMPT                                        */}
        {/* ========================================================================= */}
        {step === 'contacts' && (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Users className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Permission Request 2 of 2
              </span>
              <h3 className="text-base font-extrabold tracking-tight">
                Allow "VoiceGuard AI" to access your Contacts?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                VoiceGuard matches incoming calls with your contact list and stores trusted voiceprints in your secure Trusted Voice Vault.
              </p>
            </div>

            {/* Permission Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleContactsDecision('granted')}
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Allow Access
              </button>

              <button
                type="button"
                onClick={() => handleContactsDecision('denied')}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold transition-all cursor-pointer"
              >
                Don't allow
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: ONBOARDING COMPLETE SCREEN                                        */}
        {/* ========================================================================= */}
        {step === 'complete' && (
          <div className="p-6 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
                Protection Setup Complete!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Welcome <strong className="text-slate-800 dark:text-slate-200">{currentUser?.name || 'User'}</strong>! Your phone dialer, contacts vault, and real-time deepfake shield are ready.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Microphone:</span>
                <span className={`font-bold ${micStatus !== 'denied' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {micStatus !== 'denied' ? '✓ Protected' : 'Manual'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contacts Vault:</span>
                <span className={`font-bold ${contactsStatus === 'granted' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {contactsStatus === 'granted' ? '✓ Active' : 'Off'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Enter VoiceGuard App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
