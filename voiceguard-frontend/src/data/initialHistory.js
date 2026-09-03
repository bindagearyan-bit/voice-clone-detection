export const INITIAL_CALL_HISTORY = [
  {
    id: 'call_20250118_143052',
    phoneNumber: '+91 98234 11092',
    callerTag: 'Unknown (Claims Bank Security)',
    riskScore: 89,
    maxRiskScore: 92,
    riskLevel: 'HIGH',
    classification: 'AI Voice Suspected',
    statusLabel: 'HIGH SPOOF RISK',
    timestamp: 'Today, 02:30 PM',
    durationSec: 44,
    chunksAnalyzed: 22,
    confidence: 92,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Spectral anomalies detected in higher harmonics (4–6 kHz)',
      'Unnatural fundamental pitch (F0) quantization',
      'Abnormal temporal consistency across phoneme boundaries'
    ],
    safetyWarning: 'Potential Voice Scam — Do not share OTPs, PINs, or transfer funds.'
  },
  {
    id: 'call_20250118_112015',
    phoneNumber: '+91 70112 84920',
    callerTag: 'Unknown Caller',
    riskScore: 94,
    maxRiskScore: 96,
    riskLevel: 'HIGH',
    classification: 'AI Voice Suspected',
    statusLabel: 'HIGH SPOOF RISK',
    timestamp: 'Today, 11:20 AM',
    durationSec: 26,
    chunksAnalyzed: 13,
    confidence: 96,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Neural voice clone synthesis signature identified',
      'Missing natural vocal tract resonance and dynamic pitch jitter'
    ],
    safetyWarning: 'Potential Voice Scam — Verify caller through an independent trusted channel.'
  },
  {
    id: 'call_20250117_184510',
    phoneNumber: '+91 88002 91100',
    callerTag: 'Unknown (Automated Notice)',
    riskScore: 65,
    maxRiskScore: 68,
    riskLevel: 'MODERATE',
    classification: 'Unusual Voice Characteristics',
    statusLabel: 'MODERATE SPOOF RISK',
    timestamp: 'Yesterday, 06:45 PM',
    durationSec: 18,
    chunksAnalyzed: 9,
    confidence: 88,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Some suspicious acoustic characteristics detected',
      'Slight pitch irregularity observed in phoneme transitions'
    ],
    safetyWarning: 'Exercise caution and verify caller before sharing personal data.'
  },
  {
    id: 'call_20250117_141022',
    phoneNumber: '+91 98110 54321',
    callerTag: 'Unknown Caller',
    riskScore: 15,
    maxRiskScore: 18,
    riskLevel: 'LOW',
    classification: 'Voice Appears Natural',
    statusLabel: 'LOW SPOOF RISK',
    timestamp: 'Yesterday, 02:10 PM',
    durationSec: 82,
    chunksAnalyzed: 41,
    confidence: 94,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Low spoof risk — acoustic properties align with natural human speech',
      'Natural vocal micro-variations and organic pitch jitter present'
    ],
    safetyWarning: null
  },
  {
    id: 'call_20250116_091522',
    phoneNumber: '+91 97654 32100',
    callerTag: 'Unknown Caller',
    riskScore: 12,
    maxRiskScore: 15,
    riskLevel: 'LOW',
    classification: 'Voice Appears Natural',
    statusLabel: 'LOW SPOOF RISK',
    timestamp: '16 Jan 2025, 09:15 AM',
    durationSec: 54,
    chunksAnalyzed: 27,
    confidence: 95,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Low spoof risk — natural vocal tract resonance'
    ],
    safetyWarning: null
  }
];
