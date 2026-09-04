/**
 * Realistic Demo Scenarios for VoiceGuard
 * Supports dynamic LOW, MODERATE, and HIGH risk detection flows
 */

export const DEMO_SCENARIOS = [
  {
    id: 'pd_friend_call',
    title: 'PD (+91 9226793292)',
    callerNumber: '+91 9226793292',
    callerLabel: 'PD',
    expectedRiskLevel: 'LOW',
    finalRiskScore: 11,
    confidence: 96,
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
        transcript: 'Hey bro, are we still meeting up this evening after work?',
        riskScore: 10,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.95,
        reason: 'Voice appears natural — organic vocal micro-variations present',
        evidence: 'Normal biological pitch jitter'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 15,
        timeRange: '2–4s',
        transcript: 'Let me know the location so I can head over directly.',
        riskScore: 12,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.96,
        reason: 'Low spoof risk — harmonic envelope consistent with human speech',
        evidence: 'Healthy vocal cord dispersion'
      }
    ]
  },
  {
    id: 'kush_friend_call',
    title: 'KUSH (+91 9022831590)',
    callerNumber: '+91 9022831590',
    callerLabel: 'KUSH',
    expectedRiskLevel: 'LOW',
    finalRiskScore: 9,
    confidence: 97,
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
        transcript: 'Yo, did you check out the new update we pushed to the repo?',
        riskScore: 8,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.96,
        reason: 'Voice appears natural — organic vocal micro-variations present',
        evidence: 'Normal biological pitch jitter'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 15,
        timeRange: '2–4s',
        transcript: 'It looks super clean, test it out whenever you get a minute.',
        riskScore: 11,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.97,
        reason: 'Low spoof risk — harmonic envelope consistent with human speech',
        evidence: 'Healthy vocal cord dispersion'
      }
    ]
  },
  {
    id: 'aaradhya_friend_call',
    title: 'AARADHYA (+91 9004352394)',
    callerNumber: '+91 9004352394',
    callerLabel: 'AARADHYA',
    expectedRiskLevel: 'LOW',
    finalRiskScore: 12,
    confidence: 95,
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
        riskScore: 11,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.94,
        reason: 'Voice appears natural — organic vocal micro-variations present',
        evidence: 'Normal biological pitch jitter'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 15,
        timeRange: '2–4s',
        transcript: '...let me know what time suits you for a quick sync this afternoon.',
        riskScore: 13,
        riskLevel: 'LOW',
        isFake: false,
        confidence: 0.95,
        reason: 'Low spoof risk — harmonic envelope consistent with human speech',
        evidence: 'Healthy vocal cord dispersion'
      }
    ]
  },
  {
    id: 'unknown_scam_call',
    title: 'Unknown (+91 88002 91100)',
    callerNumber: '+91 88002 91100',
    callerLabel: 'Unknown Caller',
    expectedRiskLevel: 'HIGH',
    finalRiskScore: 92,
    confidence: 94,
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
        transcript: 'Hello, this is automated urgent alert regarding your account security...',
        riskScore: 68,
        riskLevel: 'MODERATE',
        isFake: true,
        confidence: 0.88,
        reason: 'Synthetic speech characteristics emerging in vocal tract formants',
        evidence: 'Pitch flatness index > 0.78'
      },
      {
        chunkId: 'chunk_02',
        chunkNumber: 2,
        totalChunks: 22,
        timeRange: '2–4s',
        transcript: '...suspicious activity detected, press 1 now or transfer funds immediately.',
        riskScore: 92,
        riskLevel: 'HIGH',
        isFake: true,
        confidence: 0.95,
        reason: 'AI-generated voice suspected — neural vocoder spectral artifacts detected',
        evidence: 'DiffWave/HiFi-GAN vocoder phase signature identified'
      }
    ]
  }
];
