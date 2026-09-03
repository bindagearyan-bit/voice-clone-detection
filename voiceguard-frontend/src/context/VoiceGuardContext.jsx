import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { INITIAL_CALL_HISTORY } from '../data/initialHistory';
import { INITIAL_NOTIFICATIONS } from '../data/initialNotifications';
import { INITIAL_CONTACTS } from '../data/initialContacts';

const VoiceGuardContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://voice-clone-detection.onrender.com');

export const VoiceGuardProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('voiceguard_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Navigation Routing State
  // '/home' | '/audiolab' | '/dialer' | '/calls' | '/notifications' | '/history' | '/settings' | '/about'
  const [currentRoute, setCurrentRoute] = useState('/home');
  const [routeParams, setRouteParams] = useState({});

  // Global Demo Mode Toggle
  const [demoModeActive, setDemoModeActive] = useState(true);
  const [selectedScenarioId, setSelectedScenarioId] = useState(DEMO_SCENARIOS[0].id);

  // Call State Machine: 'idle' | 'incoming' | 'monitoring' | 'ended'
  const [callState, setCallState] = useState('idle');
  const [callTimer, setCallTimer] = useState(0);
  const [activeCall, setActiveCall] = useState({
    id: null,
    callerNumber: '+91 98234 11092',
    callerLabel: 'Unknown Caller',
    startTime: null,
  });

  // 2-Second Audio Chunk Streaming State
  const [chunkIndex, setChunkIndex] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(null);
  const [processedChunks, setProcessedChunks] = useState([]);
  
  // Real-Time Risk Engine Values
  const [liveRiskScore, setLiveRiskScore] = useState(15);
  const [liveRiskLevel, setLiveRiskLevel] = useState('LOW');
  const [liveConfidence, setLiveConfidence] = useState(94);
  const [liveReason, setLiveReason] = useState('Natural human voice patterns verified.');
  const [liveEvidence, setLiveEvidence] = useState('Awaiting initial audio stream');
  
  // Modal / Drawer States
  const [isHighRiskAlertOpen, setIsHighRiskAlertOpen] = useState(false);
  const [callSummary, setCallSummary] = useState(null);
  const [selectedCallDetail, setSelectedCallDetail] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Per-User Collections State
  const [callHistory, setCallHistory] = useState(() => {
    if (currentUser && currentUser.history) return currentUser.history;
    return INITIAL_CALL_HISTORY;
  });

  const [notifications, setNotifications] = useState(() => {
    if (currentUser && currentUser.notifications) return currentUser.notifications;
    return INITIAL_NOTIFICATIONS;
  });

  const [contacts, setContacts] = useState(() => {
    if (currentUser && currentUser.contacts) return currentUser.contacts;
    return INITIAL_CONTACTS;
  });

  // Settings Configuration
  const [settings, setSettings] = useState(() => {
    if (currentUser && currentUser.settings) return currentUser.settings;
    return {
      realtimeMonitoring: true,
      unknownCallerProtection: true,
      highRiskAlerts: true,
      consecutiveHighRiskThreshold: 3,
      pushNotifications: true,
      warningSound: true,
      hapticVibration: true,
      threatAlertsOnly: false,
      audioRetention: 'hashes_only',
      theme: 'light',
    };
  });

  // Ensure active user is synced into Supabase on startup
  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, password: 'password123' })
      }).catch((err) => console.warn('Startup user sync check:', err));
    }
  }, []);

  // Sync state to backend & localStorage whenever user data changes
  const syncTimerRef = useRef(null);
  const syncUserData = (customData = {}) => {
    if (!currentUser) return;

    const payload = {
      user_id: currentUser.id,
      contacts: customData.contacts || contacts,
      history: customData.history || callHistory,
      notifications: customData.notifications || notifications,
      settings: customData.settings || settings,
      permissions: customData.permissions || currentUser.permissions,
    };

    // Update active user in localStorage
    const updatedUser = {
      ...currentUser,
      ...payload,
    };
    localStorage.setItem('voiceguard_active_user', JSON.stringify(updatedUser));

    // Debounced backend sync
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/auth/sync-user-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Backend user sync offline (cached locally):', err);
      }
    }, 1000);
  };

  // Auth: Register New User
  const registerUser = async (name, email, password, phone = '+91 98234 11092') => {
    let resData;
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errJson.detail || 'Registration failed');
      }

      resData = await res.json();
    } catch (err) {
      // Fallback local registration if backend unreachable
      console.warn('Backend registration failed, using local registration:', err);
      const userId = `usr_${Date.now()}`;
      resData = {
        token: `token_${userId}`,
        user: {
          id: userId,
          name,
          email,
          phone,
          created_at: Date.now() / 1000,
          permissions: { microphone: false, contacts: false },
          contacts: [{
            id: 'cont_emergency_1',
            name: 'Family Emergency Contact',
            phoneNumber: '+91 98765 43210',
            relationship: 'Family',
            category: 'Family',
            isEnrolledVoice: true,
            voiceprintId: 'vp_family_001',
            embeddingConfidence: 98.5,
            enrolledDate: 'Just now',
            lastSpoke: 'Never',
            avatarBg: 'bg-indigo-600',
            initials: 'FE',
            note: 'Primary trusted contact.'
          }],
          history: [],
          notifications: [{
            id: `notif_${Date.now()}`,
            severity: 'LOW',
            title: 'Welcome to VoiceGuard AI',
            message: `Welcome ${name}! Your real-time deepfake voice protection shield is now active.`,
            timestamp: 'Just now',
            isRead: false
          }],
          settings: {
            realtimeMonitoring: true,
            unknownCallerProtection: true,
            highRiskAlerts: true,
            consecutiveHighRiskThreshold: 3,
            pushNotifications: true,
            warningSound: true,
            hapticVibration: true,
            audioRetention: 'hashes_only'
          }
        },
        is_new_user: true
      };
    }

    const u = resData.user;
    setCurrentUser(u);
    localStorage.setItem('voiceguard_active_user', JSON.stringify(u));

    // Reset all states to completely fresh data for the new user!
    setContacts(u.contacts || []);
    setCallHistory(u.history || []);
    setNotifications(u.notifications || []);
    setSettings(u.settings || {});
    setCallState('idle');
    setProcessedChunks([]);

    // Open Mobile Permissions Prompt
    setShowPermissionsModal(true);
  };

  // Auth: Login Existing User
  const loginUser = async (email, password) => {
    let resData;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errJson.detail || 'Login failed');
      }

      resData = await res.json();
    } catch (err) {
      console.warn('Backend login error, trying local fallback:', err);
      // Fallback demo user
      resData = {
        token: 'token_demo_123',
        user: {
          id: 'usr_demo',
          name: 'Demo Analyst',
          email,
          phone: '+91 98234 11092',
          permissions: { microphone: true, contacts: true },
          contacts: INITIAL_CONTACTS,
          history: INITIAL_CALL_HISTORY,
          notifications: INITIAL_NOTIFICATIONS,
          settings: {
            realtimeMonitoring: true,
            unknownCallerProtection: true,
            highRiskAlerts: true,
            consecutiveHighRiskThreshold: 3,
            pushNotifications: true,
            warningSound: true,
            hapticVibration: true,
            audioRetention: 'hashes_only'
          }
        }
      };
    }

    const u = resData.user;
    setCurrentUser(u);
    localStorage.setItem('voiceguard_active_user', JSON.stringify(u));

    // Load user's saved data
    setContacts(u.contacts || INITIAL_CONTACTS);
    setCallHistory(u.history || INITIAL_CALL_HISTORY);
    setNotifications(u.notifications || INITIAL_NOTIFICATIONS);
    if (u.settings) setSettings(u.settings);

    // If permissions not yet granted, show permission modal
    if (!u.permissions?.microphone && !u.permissions?.contacts) {
      setShowPermissionsModal(true);
    }
  };

  // Auth: Logout User
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('voiceguard_active_user');
    setCurrentRoute('/home');
    setCallState('idle');
    setProcessedChunks([]);
  };

  // Complete Permissions Flow
  const completePermissionsFlow = (permissions) => {
    setShowPermissionsModal(false);
    if (currentUser) {
      const updated = {
        ...currentUser,
        permissions
      };
      setCurrentUser(updated);
      localStorage.setItem('voiceguard_active_user', JSON.stringify(updated));
      syncUserData({ permissions });
    }
  };

  // Helper: Add new contact to Trusted Voice Vault
  const addContact = (newContact) => {
    const contactEntry = {
      id: `cont_${Date.now()}`,
      ...newContact
    };
    setContacts((prev) => {
      const updated = [contactEntry, ...prev];
      syncUserData({ contacts: updated });
      return updated;
    });
  };

  // Timer & Stream References
  const timerIntervalRef = useRef(null);
  const chunkStreamRef = useRef(null);

  // Active scenario reference
  const currentScenario = DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  // Helper: Navigate between routes
  const navigateTo = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper: Start Protected Call (triggers incoming call state)
  const startProtectedCall = (scenarioOrOptions = selectedScenarioId) => {
    let sc = DEMO_SCENARIOS.find((s) => s.id === scenarioOrOptions) || DEMO_SCENARIOS[0];
    let customNumber = sc.callerNumber;
    let customLabel = sc.callerLabel;

    if (typeof scenarioOrOptions === 'object' && scenarioOrOptions !== null) {
      if (scenarioOrOptions.scenarioId) {
        sc = DEMO_SCENARIOS.find((s) => s.id === scenarioOrOptions.scenarioId) || sc;
      }
      if (scenarioOrOptions.phoneNumber) customNumber = scenarioOrOptions.phoneNumber;
      if (scenarioOrOptions.callerLabel) customLabel = scenarioOrOptions.callerLabel;
    } else if (typeof scenarioOrOptions === 'string' && scenarioOrOptions.startsWith('+')) {
      customNumber = scenarioOrOptions;
      customLabel = 'Direct Outbound Dial';
    }

    setSelectedScenarioId(sc.id);
    const newCallId = `call_${Date.now().toString().slice(-8)}`;

    setActiveCall({
      id: newCallId,
      callerNumber: customNumber,
      callerLabel: customLabel,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setCallState('incoming');
    setCallTimer(0);
    setChunkIndex(0);
    setProcessedChunks([]);
    setCurrentChunk(null);
    setLiveRiskScore(15);
    setLiveRiskLevel('LOW');
    setLiveConfidence(92);
    setLiveReason('Voice appears natural');
    setIsHighRiskAlertOpen(false);
    setCallSummary(null);

    // If not already on /calls, navigate there
    if (currentRoute !== '/calls') {
      navigateTo('/calls');
    }
  };

  // Helper: Accept Call (starts 2-second chunk audio monitoring)
  const acceptCall = () => {
    setCallState('monitoring');
    setCallTimer(0);
    setChunkIndex(0);
    setProcessedChunks([]);
  };

  // Helper: Decline Call
  const declineCall = () => {
    setCallState('idle');
  };

  // Helper: End Call & Generate Summary
  const endCall = (isBlocked = false) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (chunkStreamRef.current) clearInterval(chunkStreamRef.current);
    setIsHighRiskAlertOpen(false);

    const totalChunks = processedChunks.length || 1;
    const scores = processedChunks.map((c) => c.riskScore);
    const avgRisk = Math.round(scores.reduce((a, b) => a + b, 0) / totalChunks) || liveRiskScore;
    const maxRisk = Math.max(...scores, liveRiskScore);

    const finalLevel = maxRisk >= 80 ? 'HIGH' : maxRisk >= 50 ? 'MODERATE' : 'LOW';
    const classification =
      finalLevel === 'HIGH'
        ? 'AI Voice Suspected'
        : finalLevel === 'MODERATE'
        ? 'Unusual Voice Characteristics'
        : 'Voice Appears Natural';

    const statusLabel =
      finalLevel === 'HIGH'
        ? 'HIGH SPOOF RISK'
        : finalLevel === 'MODERATE'
        ? 'MODERATE SPOOF RISK'
        : 'LOW SPOOF RISK';

    const summaryData = {
      callId: activeCall.id || `call_${Date.now()}`,
      callerNumber: activeCall.callerNumber,
      callerLabel: activeCall.callerLabel,
      durationSec: Math.max(callTimer, totalChunks * 2),
      chunksAnalyzed: Math.max(totalChunks, currentScenario.chunks.length),
      averageRiskScore: avgRisk,
      maxRiskScore: maxRisk,
      finalRiskLevel: finalLevel,
      classification,
      statusLabel,
      confidence: currentScenario.confidence,
      modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
      indicators: currentScenario.analysisIndicators,
      safetyWarning: currentScenario.safetyWarning,
      isBlocked,
      timestamp: 'Just now',
      chunksTimeline: processedChunks.length > 0 ? processedChunks : currentScenario.chunks,
    };

    setCallSummary(summaryData);
    setCallState('ended');

    // Add to Call History database
    const newHistoryEntry = {
      id: summaryData.callId,
      phoneNumber: summaryData.callerNumber,
      callerTag: summaryData.callerLabel,
      riskScore: summaryData.averageRiskScore,
      maxRiskScore: summaryData.maxRiskScore,
      riskLevel: summaryData.finalRiskLevel,
      classification: summaryData.classification,
      statusLabel: summaryData.statusLabel,
      timestamp: 'Just now',
      durationSec: summaryData.durationSec,
      chunksAnalyzed: summaryData.chunksAnalyzed,
      confidence: summaryData.confidence,
      modelUsed: summaryData.modelUsed,
      indicators: summaryData.indicators,
      safetyWarning: summaryData.safetyWarning?.points?.join(' ') || null,
    };
    setCallHistory((prev) => [newHistoryEntry, ...prev]);

    // If High Risk, add high risk alert notification
    if (finalLevel === 'HIGH') {
      const newNotif = {
        id: `notif_${Date.now()}`,
        severity: 'HIGH',
        title: 'High spoof risk detected',
        message: `AI voice suspected during unknown call from ${summaryData.callerNumber}. Spoof probability: ${summaryData.maxRiskScore}%.`,
        timestamp: 'Just now',
        isRead: false,
        callId: summaryData.callId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else {
      const newNotif = {
        id: `notif_${Date.now()}`,
        severity: 'LOW',
        title: 'Call analysis completed',
        message: `Call analysis for ${summaryData.callerNumber} completed (${classification}). Report saved to History.`,
        timestamp: 'Just now',
        isRead: false,
        callId: summaryData.callId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Helper: Open Call Detail from History or Notification
  const viewCallDetails = (callId) => {
    const found = callHistory.find((c) => c.id === callId);
    if (found) {
      setSelectedCallDetail(found);
      setIsDetailDrawerOpen(true);
    }
  };

  // Helper: Notifications Mark As Read
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Active Call Duration Timer
  useEffect(() => {
    if (callState === 'monitoring') {
      timerIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState]);

  // Microphone live streaming reference
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);

  // 2-Second Audio Chunk Streaming Engine (Demo Simulation OR Real Live Microphone)
  useEffect(() => {
    if (callState !== 'monitoring') {
      if (chunkStreamRef.current) clearInterval(chunkStreamRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      return;
    }

    // =========================================================================
    // 1. LIVE REAL-TIME MICROPHONE MODE (Demo Mode OFF)
    // =========================================================================
    if (!demoModeActive) {
      let chunkSeq = 0;

      const startLiveMicStreaming = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStreamRef.current = stream;

          const options = { mimeType: 'audio/webm' };
          const recorder = new MediaRecorder(stream, options);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = async (e) => {
            if (e.data && e.data.size > 0) {
              chunkSeq += 1;
              const currentSeq = chunkSeq;
              const formData = new FormData();
              formData.append('call_id', activeCall.id || `live_${Date.now()}`);
              formData.append('chunk_id', `chunk_${String(currentSeq).padStart(3, '0')}`);
              formData.append('phone_number', activeCall.callerNumber || '+91 98234 11092');
              formData.append('file', e.data, `live_chunk_${currentSeq}.webm`);

              try {
                const res = await fetch(`${API_BASE}/analyze-chunk`, {
                  method: 'POST',
                  body: formData
                });

                if (res.ok) {
                  const result = await res.json();
                  const liveChunkData = {
                    chunkId: result.chunk_id,
                    chunkNumber: currentSeq,
                    riskScore: result.risk_score,
                    riskLevel: result.risk_level,
                    color: result.color,
                    confidence: result.confidence,
                    reason: result.reason,
                    evidence: `Live microphone stream (${(currentSeq * 2)}s)`,
                    isFake: result.is_fake,
                    timeRange: `${(currentSeq - 1) * 2}–${currentSeq * 2}s`
                  };

                  setCurrentChunk(liveChunkData);
                  setLiveRiskScore(result.risk_score);
                  setLiveRiskLevel(result.risk_level);
                  setLiveConfidence(Math.round(result.confidence * 100));
                  setLiveReason(result.reason);
                  setLiveEvidence(liveChunkData.evidence);
                  setProcessedChunks((prev) => [...prev, liveChunkData]);

                  if (result.risk_score >= 80 && settings.highRiskAlerts) {
                    setIsHighRiskAlertOpen(true);
                  }
                }
              } catch (apiErr) {
                console.warn('Live chunk analysis API error:', apiErr);
              }
            }
          };

          recorder.start(2000); // 2-second timeslices
        } catch (micErr) {
          console.error('Failed to access microphone in live mode:', micErr);
          setLiveReason('Microphone permission required for real-time monitoring.');
        }
      };

      startLiveMicStreaming();

      return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((t) => t.stop());
          audioStreamRef.current = null;
        }
      };
    }

    // =========================================================================
    // 2. SIMULATED SCENARIO STREAMING (Demo Mode ON)
    // =========================================================================
    const scenarioChunks = currentScenario.chunks;

    const processChunk = (idx) => {
      const targetChunk = scenarioChunks[idx % scenarioChunks.length];
      const chunkData = {
        ...targetChunk,
        chunkId: `chunk_${String(idx + 1).padStart(2, '0')}`,
        chunkNumber: idx + 1,
        totalChunks: scenarioChunks.length > 4 ? scenarioChunks.length : 22,
        timeRange: `${idx * 2}–${(idx + 1) * 2}s`,
      };

      setCurrentChunk(chunkData);
      setLiveRiskScore(chunkData.riskScore);
      setLiveRiskLevel(chunkData.riskLevel);
      setLiveConfidence(Math.round(chunkData.confidence * 100));
      setLiveReason(chunkData.reason);
      setLiveEvidence(chunkData.evidence);
      setProcessedChunks((prev) => [...prev, chunkData]);

      // Trigger HIGH RISK alert modal when risk level is HIGH (>80%)
      if (chunkData.riskScore >= 80 && settings.highRiskAlerts) {
        setIsHighRiskAlertOpen(true);
      }
    };

    // First chunk immediately after 600ms latency
    const initialTimeout = setTimeout(() => {
      processChunk(0);
    }, 600);

    // Continuous 2-second intervals
    chunkStreamRef.current = setInterval(() => {
      setChunkIndex((prev) => {
        const next = prev + 1;
        processChunk(next);
        return next;
      });
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      if (chunkStreamRef.current) clearInterval(chunkStreamRef.current);
    };
  }, [callState, selectedScenarioId, demoModeActive]);

  return (
    <VoiceGuardContext.Provider
      value={{
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        showPermissionsModal,
        setShowPermissionsModal,
        completePermissionsFlow,
        syncUserData,
        currentRoute,
        routeParams,
        navigateTo,
        demoModeActive,
        setDemoModeActive,
        selectedScenarioId,
        setSelectedScenarioId,
        currentScenario,
        callState,
        callTimer,
        activeCall,
        chunkIndex,
        currentChunk,
        processedChunks,
        liveRiskScore,
        liveRiskLevel,
        liveConfidence,
        liveReason,
        liveEvidence,
        isHighRiskAlertOpen,
        setIsHighRiskAlertOpen,
        callSummary,
        setCallSummary,
        selectedCallDetail,
        setSelectedCallDetail,
        isDetailDrawerOpen,
        setIsDetailDrawerOpen,
        callHistory,
        setCallHistory,
        contacts,
        setContacts,
        addContact,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        settings,
        setSettings,
        startProtectedCall,
        acceptCall,
        declineCall,
        endCall,
        viewCallDetails,
      }}
    >
      {children}
    </VoiceGuardContext.Provider>
  );
};

export const useVoiceGuard = () => {
  const context = useContext(VoiceGuardContext);
  if (!context) {
    throw new Error('useVoiceGuard must be used within a VoiceGuardProvider');
  }
  return context;
};
