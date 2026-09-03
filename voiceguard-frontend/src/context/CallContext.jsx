import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { INITIAL_CALL_LOGS } from '../data/initialCallLogs';
import { playWarningBeep, triggerVibration, startMicrophoneCapture, stopMicrophoneCapture } from '../utils/audioProcessor';

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  // Navigation / Presentation mode
  // 'mobile' | 'dashboard' | 'split' | 'logs' | 'architecture' | 'settings'
  const [currentTab, setCurrentTab] = useState('split'); 
  const [selectedScenarioId, setSelectedScenarioId] = useState(SCENARIOS[0].id);
  const [isLiveMicMode, setIsLiveMicMode] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micFrequencyData, setMicFrequencyData] = useState(new Uint8Array(64));

  // Call Lifecycle States: 'idle' | 'incoming' | 'active' | 'ended' | 'blocked'
  const [callState, setCallState] = useState('idle');
  const [callTimer, setCallTimer] = useState(0); // in seconds
  const [activeCallId, setActiveCallId] = useState(null);
  const [activeCaller, setActiveCaller] = useState({
    number: '+91 98234 11092',
    name: 'Unknown (Claims: SBI Card Security)',
    claimedIdentity: 'SBI Credit Card Division',
  });

  // Real-time 2s Chunking and VoiceGuard Engine State
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [processedChunks, setProcessedChunks] = useState([]);
  const [latestChunk, setLatestChunk] = useState(null);

  // Live Risk Meter Values
  const [riskScore, setRiskScore] = useState(0); // 0 - 100
  const [riskLevel, setRiskLevel] = useState('ANALYZING'); // 'LOW' | 'MODERATE' | 'HIGH' | 'ANALYZING'
  const [isFakeVoice, setIsFakeVoice] = useState(false);
  const [riskReason, setRiskReason] = useState('Analyzing voice spectral features...');
  const [modelConfidence, setModelConfidence] = useState(0.92);
  const [consecutiveHighRiskCount, setConsecutiveHighRiskCount] = useState(0);
  const [autoBlockPrompt, setAutoBlockPrompt] = useState(false);

  // VoiceGuard 5-Factor Feature Diagnostics
  const [features, setFeatures] = useState({
    spectralArtifacts: 0,
    breathingAbsence: 0,
    microNoise: 0,
    pitchJitter: 0,
    temporalConsistency: 0,
  });

  // Historical Call Logs Database (Supabase mock)
  const [callLogs, setCallLogs] = useState(INITIAL_CALL_LOGS);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState(null);
  const [incidentReportModalOpen, setIncidentReportModalOpen] = useState(false);
  const [callSummaryData, setCallSummaryData] = useState(null);

  // Settings & Thresholds
  const [settings, setSettings] = useState({
    highRiskThreshold: 80, // > 80% High Risk
    moderateRiskThreshold: 40, // > 40% Moderate Risk
    autoBlockAfterHighChunks: 3, // Auto-block suggestion threshold
    soundAlertsEnabled: true,
    hapticFeedbackEnabled: true,
    webSocketLatencyMs: 820,
    modelName: 'VoiceGuard-v1.2 (Neural Core)',
  });

  // Interval references
  const timerRef = useRef(null);
  const chunkStreamRef = useRef(null);

  // Active scenario reference
  const currentScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  // Start Incoming Call
  const triggerIncomingCall = (scenarioId = selectedScenarioId) => {
    const sc = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    setSelectedScenarioId(sc.id);
    setActiveCaller({
      number: sc.callerNumber,
      name: sc.callerName,
      claimedIdentity: sc.claimedIdentity,
    });
    const newCallId = `call_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_${Math.floor(100000 + Math.random() * 900000)}`;
    setActiveCallId(newCallId);
    setCallState('incoming');
    setCallTimer(0);
    setCurrentChunkIndex(0);
    setProcessedChunks([]);
    setLatestChunk(null);
    setRiskScore(0);
    setRiskLevel('ANALYZING');
    setIsFakeVoice(false);
    setRiskReason('Initializing 16kHz audio stream & VoiceGuard neural model...');
    setConsecutiveHighRiskCount(0);
    setAutoBlockPrompt(false);
  };

  // Accept / Answer Call (STEP 1 & STEP 2)
  const acceptCall = async () => {
    setCallState('active');
    setCallTimer(0);
    setCurrentChunkIndex(0);
    setProcessedChunks([]);

    if (isLiveMicMode) {
      const ok = await startMicrophoneCapture((data) => {
        setMicFrequencyData(new Uint8Array(data));
      });
      setMicActive(ok);
    }
  };

  // Reject / Decline Call
  const declineCall = () => {
    setCallState('idle');
    stopMicrophoneCapture();
    setMicActive(false);
  };

  // Terminate Call & Generate Summary (STEP 10)
  const endCall = (blocked = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (chunkStreamRef.current) clearInterval(chunkStreamRef.current);
    stopMicrophoneCapture();
    setMicActive(false);

    const totalChunks = processedChunks.length || 1;
    const avgRisk = Math.round(
      processedChunks.reduce((acc, c) => acc + (c.risk_score || c.spoofScore * 100), 0) / totalChunks
    ) || (blocked ? 89 : 15);

    const decision = blocked || avgRisk > settings.highRiskThreshold
      ? 'AI Voice Detected - Call Blocked'
      : avgRisk > settings.moderateRiskThreshold
      ? 'Suspicious Audio - Monitored'
      : 'Human Voice - Verified Clean';

    const summary = {
      callId: activeCallId || `call_${Date.now()}`,
      phoneNumber: activeCaller.number,
      callerTag: activeCaller.name,
      totalDuration: `${Math.max(callTimer, processedChunks.length * 2)}s`,
      chunksAnalyzed: processedChunks.length,
      averageRisk: avgRisk,
      decision,
      status: blocked ? 'Auto-Blocked' : 'User Ended',
      timestamp: new Date().toLocaleString(),
      isFake: avgRisk > 60,
      reason: riskReason,
      sha256: '9f83a2c4' + Math.random().toString(16).substring(2, 10) + 'efd914371ef82d61',
      chunks: processedChunks,
    };

    setCallSummaryData(summary);
    setCallState(blocked ? 'blocked' : 'ended');

    // Save to Database (STEP 6)
    const newLog = {
      id: summary.callId,
      phoneNumber: summary.phoneNumber,
      callerTag: summary.callerTag,
      riskScore: summary.averageRisk,
      riskLevel: summary.averageRisk >= settings.highRiskThreshold ? 'HIGH' : summary.averageRisk >= settings.moderateRiskThreshold ? 'MODERATE' : 'LOW',
      isFake: summary.isFake,
      reason: summary.reason,
      modelUsed: settings.modelName,
      timestamp: summary.timestamp,
      durationSec: Math.max(callTimer, processedChunks.length * 2),
      chunksAnalyzed: summary.chunksAnalyzed,
      status: summary.status,
      actionTaken: blocked ? 'Blocked & Logged to Cyber Crime DB' : 'Call Saved',
      sha256: summary.sha256,
      audioUrl: `https://supabase-storage.local/chunks/${summary.callId}.wav`,
      topFeatures: features,
    };

    setCallLogs((prev) => [newLog, ...prev]);
  };

  // Block & Report immediately
  const blockAndReportCall = () => {
    endCall(true);
  };

  // Timer effect when call is active
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Real-time 2-Second Chunk Processing Engine (STEP 2 to STEP 9)
  useEffect(() => {
    if (callState !== 'active') {
      if (chunkStreamRef.current) clearInterval(chunkStreamRef.current);
      return;
    }

    // Process chunk 1 immediately after 800ms
    const processNextChunk = (index) => {
      let chunkData;

      if (isLiveMicMode) {
        // Compute pseudo-live features from mic audio energy
        const avgEnergy = micFrequencyData.reduce((a, b) => a + b, 0) / (micFrequencyData.length || 1);
        const isMicVoiceSynthetic = avgEnergy > 120 && Math.random() > 0.6; // mic heuristic
        const liveScore = isMicVoiceSynthetic ? 0.85 + Math.random() * 0.1 : 0.15 + Math.random() * 0.15;
        
        chunkData = {
          chunkId: `chunk_mic_${index + 1}`,
          timeRange: `${index * 2}-${(index + 1) * 2}s`,
          transcript: `[Live Microphone Stream] Segment ${index + 1}...`,
          spoofScore: liveScore,
          riskLevel: liveScore >= 0.80 ? 'HIGH' : liveScore >= 0.40 ? 'MODERATE' : 'LOW',
          isFake: liveScore >= 0.60,
          confidence: 0.93,
          reason: liveScore >= 0.80 ? 'No breathing detected, spectral artifacts present' : 'Natural vocal tract micro-tremor detected',
          features: {
            spectralArtifacts: Math.round(liveScore * 95),
            breathingAbsence: Math.round(liveScore * 98),
            microNoise: Math.round((1 - liveScore) * 90),
            pitchJitter: Math.round((1 - liveScore) * 85),
            temporalConsistency: Math.round(liveScore * 92),
          },
          f0Hz: 130 + Math.random() * 15,
        };
      } else {
        const scenarioChunks = currentScenario.chunks;
        const targetChunk = scenarioChunks[index % scenarioChunks.length];
        chunkData = {
          ...targetChunk,
          chunkId: `chunk_${String(index + 1).padStart(3, '0')}`,
          timeRange: `${index * 2}-${(index + 1) * 2}s`,
        };
      }

      // STEP 5: Risk calculation & state update
      const score = Math.round(chunkData.spoofScore * 100);
      setRiskScore(score);
      setLatestChunk(chunkData);
      setFeatures(chunkData.features);
      setRiskReason(chunkData.reason);
      setModelConfidence(chunkData.confidence || 0.94);

      if (score >= settings.highRiskThreshold) {
        setRiskLevel('HIGH');
        setIsFakeVoice(true);
        setConsecutiveHighRiskCount((prev) => {
          const next = prev + 1;
          if (next >= settings.autoBlockAfterHighChunks) {
            setAutoBlockPrompt(true);
          }
          return next;
        });

        // STEP 8: Trigger Alert sound & vibration
        if (settings.soundAlertsEnabled) {
          playWarningBeep(true);
        }
        if (settings.hapticFeedbackEnabled) {
          triggerVibration();
        }
      } else if (score >= settings.moderateRiskThreshold) {
        setRiskLevel('MODERATE');
        setIsFakeVoice(false);
        setConsecutiveHighRiskCount(0);
      } else {
        setRiskLevel('LOW');
        setIsFakeVoice(false);
        setConsecutiveHighRiskCount(0);
      }

      // Append to processed chunk history
      setProcessedChunks((prev) => [...prev, chunkData]);
      setCurrentChunkIndex(index + 1);
    };

    // First chunk immediately
    const firstTimeout = setTimeout(() => {
      processNextChunk(0);
    }, 800);

    // Continuous 2-second interval loop (STEP 9)
    chunkStreamRef.current = setInterval(() => {
      setCurrentChunkIndex((prevIdx) => {
        processNextChunk(prevIdx);
        return prevIdx;
      });
    }, 2000);

    return () => {
      clearTimeout(firstTimeout);
      if (chunkStreamRef.current) clearInterval(chunkStreamRef.current);
    };
  }, [callState, selectedScenarioId, isLiveMicMode]);

  return (
    <CallContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedScenarioId,
        setSelectedScenarioId,
        currentScenario,
        isLiveMicMode,
        setIsLiveMicMode,
        micActive,
        micFrequencyData,
        callState,
        callTimer,
        activeCallId,
        activeCaller,
        currentChunkIndex,
        processedChunks,
        latestChunk,
        riskScore,
        riskLevel,
        isFakeVoice,
        riskReason,
        modelConfidence,
        consecutiveHighRiskCount,
        autoBlockPrompt,
        features,
        callLogs,
        setCallLogs,
        selectedLogForDetail,
        setSelectedLogForDetail,
        incidentReportModalOpen,
        setIncidentReportModalOpen,
        callSummaryData,
        setCallSummaryData,
        settings,
        setSettings,
        triggerIncomingCall,
        acceptCall,
        declineCall,
        endCall,
        blockAndReportCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
