/**
 * Realistic Demo Scenarios for VoiceGuard
 * Supports dynamic LOW, MODERATE, and HIGH risk detection flows
 */

export const DEMO_SCENARIOS = [
  {
    id: 'sbi_impersonation',
    title: 'PD (+91 9226793292)',
    callerNumber: '+91 9226793292',
    callerLabel: 'PD',
    expectedRiskLevel: 'HIGH',
    finalRiskScore: 89,
    confidence: 92,
    verdictTitle: 'AI VOICE DETECTED',
    verdictSubtitle: 'High probability of synthetic voice',
    statusLabel: 'HIGH SPOOF RISK',
    analysisIndicators: [
      'Spectral anomalies detected in higher harmonics (4–6 kHz)',
      'Unnatural fundamental pitch (F0) quantization & flat contour',
      'Abnormal temporal consistency across phoneme boundaries',
      'Missing organic acoustic micro-variations'
    ],
    safetyWarning: {
      heading: 'Potential Voice Scam',
      points: [
        'Do not make payments or approve UPI/payment requests.',
        'Do not share OTPs, PINs, passwords or banking details.',
        'Verify the caller through an independent trusted channel.'
      ]
    },
    chunks: [
      {
        chunkId: 'chunk_01',
        chunkNumber: 1,
        totalChunks: 22,
        timeRange: '0–2s',
        transcript: 'Hello, this is automated urgent alert from SBI Card Security...',
        riskScore: 42,
        riskLevel: 'MODERATE',
        isFake: false,
        confidence: 0.86,
        reason: 'Slight spectral irregularity detected, evaluating continuity',
        evidence: 'Initial harmonic variance'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 22,
        timeRange: '2–4s',
        transcript: '...your credit card transaction of 48,500 INR requires confirmation...',
        riskScore: 74,
        riskLevel: 'MODERATE',
        isFake: true,
        confidence: 0.89,
        reason: 'Synthetic speech characteristics emerging in vocal tract formants',
        evidence: 'Pitch flatness index > 0.78'
      },
      {
        chunkId: 'chunk_03',
        chunkNumber: 3,
        totalChunks: 22,
        timeRange: '4–6s',
        transcript: '...to cancel this unauthorized debit, please confirm your 6-digit OTP code now.',
        riskScore: 89,
        riskLevel: 'HIGH',
        isFake: true,
        confidence: 0.92,
        reason: 'AI-generated voice suspected — neural vocoder spectral artifacts detected',
        evidence: 'DiffWave/HiFi-GAN vocoder phase signature identified'
      },
      {
        chunkId: 'chunk_04',
        chunkNumber: 4,
        totalChunks: 22,
        timeRange: '6–8s',
        transcript: 'Sir, do not disconnect or your account will be permanently frozen.',
        riskScore: 92,
        riskLevel: 'HIGH',
        isFake: true,
        confidence: 0.95,
        reason: 'Unnatural temporal consistency & monotonic harmonic structure',
        evidence: 'CQCC cepstral boundary mismatch'
      }
    ]
  },
  {
    id: 'voice_clone_ransom',
    title: 'KUSH (+91 9022831590)',
    callerNumber: '+91 9022831590',
    callerLabel: 'KUSH',
    expectedRiskLevel: 'HIGH',
    finalRiskScore: 94,
    confidence: 96,
    verdictTitle: 'AI VOICE DETECTED',
    verdictSubtitle: 'High probability of synthetic voice',
    statusLabel: 'HIGH SPOOF RISK',
    analysisIndicators: [
      'Neural voice clone synthesis signature identified',
      'Missing natural vocal tract resonance and dynamic pitch jitter',
      'Spectral boundary artifacts in high-frequency spectrum',
      'Artificial cadence in emotional speech inflection'
    ],
    safetyWarning: {
      heading: 'Potential Voice Scam',
      points: [
        'Do not make payments or approve UPI/payment requests.',
        'Do not share OTPs, PINs, passwords or banking details.',
        'Verify the caller through an independent trusted channel.'
      ]
    },
    chunks: [
      {
        chunkId: 'chunk_01',
        chunkNumber: 1,
        totalChunks: 18,
        timeRange: '0–2s',
        transcript: 'Please help, my car had an accident near the expressway...',
        riskScore: 68,
        riskLevel: 'MODERATE',
        isFake: true,
        confidence: 0.88,
        reason: 'Artificial pitch modulation lacking organic vocal tremor',
        evidence: 'Formant bandwidth compression'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 18,
        timeRange: '2–4s',
        transcript: '...and the police need 20,000 immediately to release the vehicle...',
        riskScore: 94,
        riskLevel: 'HIGH',
        isFake: true,
        confidence: 0.96,
        reason: 'Deepfake voice suspected — repetitive phase envelope detected',
        evidence: 'Zero glottal micro-variation'
      }
    ]
  },
  {
    id: 'moderate_telemarketer',
    title: 'Unknown (+91 88002 91100)',
    callerNumber: '+91 88002 91100',
    callerLabel: 'Unknown',
    expectedRiskLevel: 'MODERATE',
    finalRiskScore: 65,
    confidence: 0.88,
    verdictTitle: 'UNUSUAL VOICE CHARACTERISTICS',
    verdictSubtitle: 'Moderate probability of automated or synthetic voice',
    statusLabel: 'MODERATE SPOOF RISK',
    analysisIndicators: [
      'Some suspicious acoustic characteristics detected',
      'Slight pitch irregularity observed in phoneme transitions',
      'Inconsistent background noise profile'
    ],
    safetyWarning: {
      heading: 'Exercise Caution',
      points: [
        'Stay cautious and independently verify the caller before making payments or sharing sensitive information.'
      ]
    },
    chunks: [
      {
        chunkId: 'chunk_01',
        chunkNumber: 1,
        totalChunks: 12,
        timeRange: '0–2s',
        transcript: 'Special pre-approved loan offer with zero documentation charges...',
        riskScore: 58,
        riskLevel: 'MODERATE',
        isFake: false,
        confidence: 0.85,
        reason: 'Monotonic cadence, possible text-to-speech telemarketing bot',
        evidence: 'Cadence variance below normal'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 12,
        timeRange: '2–4s',
        transcript: '...press 1 to speak with our relationship executive immediately.',
        riskScore: 65,
        riskLevel: 'MODERATE',
        isFake: false,
        confidence: 0.88,
        reason: 'Some acoustic irregularities detected, continue monitoring',
        evidence: 'Phoneme boundary jitter'
      }
    ]
  },
  {
    id: 'genuine_human_call',
    title: 'AARADHYA (+91 9004352394)',
    callerNumber: '+91 9004352394',
    callerLabel: 'AARADHYA',
    expectedRiskLevel: 'LOW',
    finalRiskScore: 15,
    confidence: 94,
    verdictTitle: 'VOICE APPEARS NATURAL',
    verdictSubtitle: 'Low probability of synthetic voice detected',
    statusLabel: 'LOW SPOOF RISK',
    analysisIndicators: [
      'Low spoof risk — acoustic properties align with natural human speech',
      'Healthy vocal micro-variations and organic pitch jitter present',
      'Natural frequency dispersion across all harmonic bands',
      'Zero synthetic phase or neural vocoder artifacts'
    ],
    safetyWarning: null,
    chunks: [
      {
        chunkId: 'chunk_01',
        chunkNumber: 1,
        totalChunks: 15,
        timeRange: '0–2s',
        transcript: 'Hi there! Just following up on the project discussion we had yesterday...',
        riskScore: 14,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.93,
        reason: 'Voice appears natural — organic vocal micro-variations present',
        evidence: 'Normal biological pitch jitter'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 15,
        timeRange: '2–4s',
        transcript: '...let me know what time suits you for a quick sync this afternoon.',
        riskScore: 15,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.94,
        reason: 'Low spoof risk — harmonic envelope consistent with human speech',
        evidence: 'Healthy vocal cord dispersion'
      }
    ]
  }
];

