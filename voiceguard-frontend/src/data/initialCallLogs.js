export const INITIAL_CALL_LOGS = [
  {
    id: "call_20250118_143052",
    phoneNumber: "+91 98234 11092",
    callerTag: "Unknown (Claims SBI Bank)",
    riskScore: 89,
    riskLevel: "HIGH",
    isFake: true,
    reason: "No breathing detected, spectral artifacts present, flat pitch",
    modelUsed: "VoiceGuard-v1.2 (Neural Core)",
    timestamp: "2025-01-18 14:30:52",
    durationSec: 38,
    chunksAnalyzed: 19,
    status: "Auto-Blocked",
    actionTaken: "Reported to National Cyber Crime Portal (1930)",
    sha256: "9f83a2c4e1b859d073f32c694a4805e197d22384a56a68f0efd914371ef82d61",
    audioUrl: "https://supabase-storage.local/chunks/call_20250118_143052.wav",
    topFeatures: {
      spectralArtifacts: 91,
      breathingAbsence: 97,
      microNoise: 8,
      pitchJitter: 9,
      temporalConsistency: 95
    }
  },
  {
    id: "call_20250118_112015",
    phoneNumber: "+91 70112 84920",
    callerTag: "Unknown (AI Clone Ransom)",
    riskScore: 95,
    riskLevel: "HIGH",
    isFake: true,
    reason: "Synthesized emotional pitch modulation, zero micro-tremor in vocal tract",
    modelUsed: "VoiceGuard-v1.2",
    timestamp: "2025-01-18 11:20:15",
    durationSec: 24,
    chunksAnalyzed: 12,
    status: "User Terminated",
    actionTaken: "Flagged & Blocked",
    sha256: "a1b2c3d4e5f6789012345678abcdef1234567890abcdef1234567890abcdef12",
    audioUrl: "https://supabase-storage.local/chunks/call_20250118_112015.wav",
    topFeatures: {
      spectralArtifacts: 95,
      breathingAbsence: 98,
      microNoise: 7,
      pitchJitter: 10,
      temporalConsistency: 97
    }
  },
  {
    id: "call_20250117_184510",
    phoneNumber: "+91 98110 54321",
    callerTag: "Aarav Sharma",
    riskScore: 12,
    riskLevel: "LOW",
    isFake: false,
    reason: "Natural inhalation sound at 0.4s, organic pitch modulation present",
    modelUsed: "VoiceGuard-v1.2",
    timestamp: "2025-01-17 18:45:10",
    durationSec: 142,
    chunksAnalyzed: 71,
    status: "Normal Call",
    actionTaken: "Whitelisted",
    sha256: "3389bc21a4de981204857efcb1294871923847aefbcde9123847592837461928",
    audioUrl: "https://supabase-storage.local/chunks/call_20250117_184510.wav",
    topFeatures: {
      spectralArtifacts: 8,
      breathingAbsence: 5,
      microNoise: 88,
      pitchJitter: 82,
      temporalConsistency: 18
    }
  },
  {
    id: "call_20250116_091522",
    phoneNumber: "+91 88002 91100",
    callerTag: "Delhi Traffic Police Bot",
    riskScore: 82,
    riskLevel: "HIGH",
    isFake: true,
    reason: "Robotic harmonic structure, TTS synthesis boundary detected",
    modelUsed: "VoiceGuard-v1.2",
    timestamp: "2025-01-16 09:15:22",
    durationSec: 18,
    chunksAnalyzed: 9,
    status: "Auto-Blocked",
    actionTaken: "Reported to Telecom DND Registry",
    sha256: "7749abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    audioUrl: "https://supabase-storage.local/chunks/call_20250116_091522.wav",
    topFeatures: {
      spectralArtifacts: 84,
      breathingAbsence: 95,
      microNoise: 14,
      pitchJitter: 12,
      temporalConsistency: 91
    }
  }
];
