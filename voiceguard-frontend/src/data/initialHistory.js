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
    chunksAnalyzed: 6,
    confidence: 92,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Spectral anomalies detected in higher harmonics (4–6 kHz)',
      'Unnatural fundamental pitch (F0) quantization',
      'Abnormal temporal consistency across phoneme boundaries'
    ],
    safetyWarning: 'Potential Voice Scam — Do not share OTPs, PINs, or transfer funds.',
    chunks: [
      {
        chunkId: 'chunk_001',
        chunkNumber: 1,
        timeRange: '0–2s',
        riskScore: 86,
        riskLevel: 'HIGH',
        confidence: 92,
        reason: 'Neural vocoder phase discontinuity & flat pitch contour detected',
        isFake: true,
        acousticMetrics: { mean_f0: 132, flatness: 0.042, jitter: 0.002 }
      },
      {
        chunkId: 'chunk_002',
        chunkNumber: 2,
        timeRange: '2–4s',
        riskScore: 91,
        riskLevel: 'HIGH',
        confidence: 94,
        reason: 'Missing natural glottal pulses and zero micro-tremors in vocal tract',
        isFake: true,
        acousticMetrics: { mean_f0: 133, flatness: 0.048, jitter: 0.001 }
      },
      {
        chunkId: 'chunk_003',
        chunkNumber: 3,
        timeRange: '4–6s',
        riskScore: 94,
        riskLevel: 'HIGH',
        confidence: 96,
        reason: 'Linear spectrogram artifacts; zero acoustic breath pause before urgency claim',
        isFake: true,
        acousticMetrics: { mean_f0: 134, flatness: 0.051, jitter: 0.001 }
      },
      {
        chunkId: 'chunk_004',
        chunkNumber: 4,
        timeRange: '6–8s',
        riskScore: 88,
        riskLevel: 'HIGH',
        confidence: 91,
        reason: 'Synthesized phoneme transition on banking security keywords',
        isFake: true,
        acousticMetrics: { mean_f0: 131, flatness: 0.039, jitter: 0.003 }
      },
      {
        chunkId: 'chunk_005',
        chunkNumber: 5,
        timeRange: '8–10s',
        riskScore: 92,
        riskLevel: 'HIGH',
        confidence: 95,
        reason: 'Repeated robotic spectral signature in 4–6 kHz bands',
        isFake: true,
        acousticMetrics: { mean_f0: 132, flatness: 0.044, jitter: 0.002 }
      },
      {
        chunkId: 'chunk_006',
        chunkNumber: 6,
        timeRange: '10–12s',
        riskScore: 85,
        riskLevel: 'HIGH',
        confidence: 89,
        reason: 'Abnormal phase coherence across continuous speech bursts',
        isFake: true,
        acousticMetrics: { mean_f0: 133, flatness: 0.038, jitter: 0.003 }
      }
    ]
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
    chunksAnalyzed: 4,
    confidence: 96,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Neural voice clone synthesis signature identified',
      'Missing natural vocal tract resonance and dynamic pitch jitter'
    ],
    safetyWarning: 'Potential Voice Scam — Verify caller through an independent trusted channel.',
    chunks: [
      {
        chunkId: 'chunk_001',
        chunkNumber: 1,
        timeRange: '0–2s',
        riskScore: 92,
        riskLevel: 'HIGH',
        confidence: 95,
        reason: 'Instant onset of high-frequency vocoder synthesis artifacts',
        isFake: true,
        acousticMetrics: { mean_f0: 165, flatness: 0.055, jitter: 0.001 }
      },
      {
        chunkId: 'chunk_002',
        chunkNumber: 2,
        timeRange: '2–4s',
        riskScore: 96,
        riskLevel: 'HIGH',
        confidence: 98,
        reason: 'Unnatural formant alignment typical of diffusion voice clone models',
        isFake: true,
        acousticMetrics: { mean_f0: 166, flatness: 0.061, jitter: 0.001 }
      },
      {
        chunkId: 'chunk_003',
        chunkNumber: 3,
        timeRange: '4–6s',
        riskScore: 95,
        riskLevel: 'HIGH',
        confidence: 96,
        reason: 'Robotic pitch quantization without human larynx micro-vibrations',
        isFake: true,
        acousticMetrics: { mean_f0: 164, flatness: 0.058, jitter: 0.002 }
      },
      {
        chunkId: 'chunk_004',
        chunkNumber: 4,
        timeRange: '6–8s',
        riskScore: 93,
        riskLevel: 'HIGH',
        confidence: 94,
        reason: 'Synthesized voice spectrum confirmed across all mel-frequency filterbanks',
        isFake: true,
        acousticMetrics: { mean_f0: 165, flatness: 0.052, jitter: 0.002 }
      }
    ]
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
    chunksAnalyzed: 3,
    confidence: 88,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Some suspicious acoustic characteristics detected',
      'Slight pitch irregularity observed in phoneme transitions'
    ],
    safetyWarning: 'Exercise caution and verify caller before sharing personal data.',
    chunks: [
      {
        chunkId: 'chunk_001',
        chunkNumber: 1,
        timeRange: '0–2s',
        riskScore: 62,
        riskLevel: 'MODERATE',
        confidence: 85,
        reason: 'Slight compression noise with moderate pitch variance',
        isFake: false,
        acousticMetrics: { mean_f0: 142, flatness: 0.028, jitter: 0.008 }
      },
      {
        chunkId: 'chunk_002',
        chunkNumber: 2,
        timeRange: '2–4s',
        riskScore: 68,
        riskLevel: 'MODERATE',
        confidence: 88,
        reason: 'Automated robocall transmission harmonics detected',
        isFake: false,
        acousticMetrics: { mean_f0: 140, flatness: 0.031, jitter: 0.006 }
      },
      {
        chunkId: 'chunk_003',
        chunkNumber: 3,
        timeRange: '4–6s',
        riskScore: 65,
        riskLevel: 'MODERATE',
        confidence: 86,
        reason: 'Borderline spectral consistency; inconclusive organic larynx signal',
        isFake: false,
        acousticMetrics: { mean_f0: 143, flatness: 0.029, jitter: 0.007 }
      }
    ]
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
    chunksAnalyzed: 4,
    confidence: 94,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Low spoof risk — acoustic properties align with natural human speech',
      'Natural vocal micro-variations and organic pitch jitter present'
    ],
    safetyWarning: null,
    chunks: [
      {
        chunkId: 'chunk_001',
        chunkNumber: 1,
        timeRange: '0–2s',
        riskScore: 14,
        riskLevel: 'LOW',
        confidence: 95,
        reason: 'Organic vocal tract resonance and natural phoneme micro-tremors verified',
        isFake: false,
        acousticMetrics: { mean_f0: 152, flatness: 0.012, jitter: 0.019 }
      },
      {
        chunkId: 'chunk_002',
        chunkNumber: 2,
        timeRange: '2–4s',
        riskScore: 18,
        riskLevel: 'LOW',
        confidence: 94,
        reason: 'Natural breathing pause & authentic vocal fold vibration dynamics',
        isFake: false,
        acousticMetrics: { mean_f0: 148, flatness: 0.015, jitter: 0.021 }
      },
      {
        chunkId: 'chunk_003',
        chunkNumber: 3,
        timeRange: '4–6s',
        riskScore: 12,
        riskLevel: 'LOW',
        confidence: 96,
        reason: 'Consistent organic harmonic structure across spectral sub-bands',
        isFake: false,
        acousticMetrics: { mean_f0: 155, flatness: 0.011, jitter: 0.024 }
      },
      {
        chunkId: 'chunk_004',
        chunkNumber: 4,
        timeRange: '6–8s',
        riskScore: 16,
        riskLevel: 'LOW',
        confidence: 93,
        reason: 'Human conversational cadence and organic pitch modulation confirmed',
        isFake: false,
        acousticMetrics: { mean_f0: 150, flatness: 0.014, jitter: 0.018 }
      }
    ]
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
    chunksAnalyzed: 3,
    confidence: 95,
    modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
    indicators: [
      'Low spoof risk — natural vocal tract resonance'
    ],
    safetyWarning: null,
    chunks: [
      {
        chunkId: 'chunk_001',
        chunkNumber: 1,
        timeRange: '0–2s',
        riskScore: 11,
        riskLevel: 'LOW',
        confidence: 96,
        reason: 'Authentic organic vocal resonance and continuous harmonic envelope',
        isFake: false,
        acousticMetrics: { mean_f0: 124, flatness: 0.010, jitter: 0.022 }
      },
      {
        chunkId: 'chunk_002',
        chunkNumber: 2,
        timeRange: '2–4s',
        riskScore: 15,
        riskLevel: 'LOW',
        confidence: 94,
        reason: 'Natural glottal pulse timing with organic micro-pitch variations',
        isFake: false,
        acousticMetrics: { mean_f0: 128, flatness: 0.012, jitter: 0.025 }
      },
      {
        chunkId: 'chunk_003',
        chunkNumber: 3,
        timeRange: '4–6s',
        riskScore: 10,
        riskLevel: 'LOW',
        confidence: 97,
        reason: 'Biological vocal prosody confirmed; no AI neural vocoder artifacts',
        isFake: false,
        acousticMetrics: { mean_f0: 126, flatness: 0.009, jitter: 0.020 }
      }
    ]
  }
];

