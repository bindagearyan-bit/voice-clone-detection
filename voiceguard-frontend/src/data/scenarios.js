export const SCENARIOS = [
  {
    id: "pd_friend_call",
    title: "PD (+91 9226793292)",
    tag: "Friend / Verified",
    callerName: "PD",
    callerNumber: "+91 9226793292",
    claimedIdentity: "Verified Friend",
    targetVulnerability: "None (Safe)",
    expectedOutcome: "LOW RISK (Genuine Human Voice)",
    description: "Authentic human conversation with organic pitch variation and natural cadence.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "Hey bro, are we still meeting up this evening after work?",
        spoofScore: 0.10,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.95,
        reason: "Natural inhalation sound, organic pitch modulation present",
        features: {
          spectralArtifacts: 6,
          breathingAbsence: 4,
          microNoise: 90,
          pitchJitter: 85,
          temporalConsistency: 16
        },
        mfccDelta: [2.9, 1.8, -1.0, 3.8, 2.4],
        f0Hz: 125.4
      },
      {
        chunkId: "chunk_002",
        timeRange: "2-4s",
        transcript: "Let me know the location so I can head over directly.",
        spoofScore: 0.12,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.96,
        reason: "Organic throat micro-vibrations, healthy pitch jitter",
        features: {
          spectralArtifacts: 5,
          breathingAbsence: 3,
          microNoise: 92,
          pitchJitter: 88,
          temporalConsistency: 14
        },
        mfccDelta: [2.5, 1.6, -0.8, 3.2, 2.0],
        f0Hz: 126.1
      }
    ]
  },
  {
    id: "kush_friend_call",
    title: "KUSH (+91 9022831590)",
    tag: "Friend / Verified",
    callerName: "KUSH",
    callerNumber: "+91 9022831590",
    claimedIdentity: "Verified Friend",
    targetVulnerability: "None (Safe)",
    expectedOutcome: "LOW RISK (Genuine Human Voice)",
    description: "Authentic human conversation with dynamic natural speech characteristics.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "Yo, did you check out the new update we pushed to the repo?",
        spoofScore: 0.08,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.96,
        reason: "Natural breath pause, zero spectral vocoder artifacts",
        features: {
          spectralArtifacts: 4,
          breathingAbsence: 2,
          microNoise: 94,
          pitchJitter: 89,
          temporalConsistency: 12
        },
        mfccDelta: [2.4, 1.5, -0.7, 3.0, 1.9],
        f0Hz: 130.2
      },
      {
        chunkId: "chunk_002",
        timeRange: "2-4s",
        transcript: "It looks super clean, test it out whenever you get a minute.",
        spoofScore: 0.11,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.97,
        reason: "Organic vocal tract resonance and natural cadence",
        features: {
          spectralArtifacts: 5,
          breathingAbsence: 3,
          microNoise: 91,
          pitchJitter: 86,
          temporalConsistency: 15
        },
        mfccDelta: [2.7, 1.8, -0.9, 3.4, 2.1],
        f0Hz: 129.8
      }
    ]
  },
  {
    id: "aaradhya_friend_call",
    title: "AARADHYA (+91 9004352394)",
    tag: "Friend / Verified",
    callerName: "AARADHYA",
    callerNumber: "+91 9004352394",
    claimedIdentity: "Verified Friend",
    targetVulnerability: "None (Safe)",
    expectedOutcome: "LOW RISK (Genuine Human Voice)",
    description: "Authentic human conversation with organic diaphragm breath intakes, natural micro-tremor, and variable pitch contour.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "Hey bro! Just following up on the project discussion we had yesterday...",
        spoofScore: 0.11,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.95,
        reason: "Natural inhalation sound at 0.4s, organic pitch modulation present",
        features: {
          spectralArtifacts: 8,
          breathingAbsence: 5,
          microNoise: 88,
          pitchJitter: 82,
          temporalConsistency: 18
        },
        mfccDelta: [3.2, 2.1, -1.2, 4.0, 2.8],
        f0Hz: 124.6
      },
      {
        chunkId: "chunk_002",
        timeRange: "2-4s",
        transcript: "...let me know what time suits you for a quick sync this afternoon.",
        spoofScore: 0.13,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.96,
        reason: "Organic throat micro-vibrations, healthy pitch jitter (84%)",
        features: {
          spectralArtifacts: 5,
          breathingAbsence: 3,
          microNoise: 92,
          pitchJitter: 86,
          temporalConsistency: 14
        },
        mfccDelta: [2.8, 1.9, -0.9, 3.5, 2.2],
        f0Hz: 128.2
      }
    ]
  },
  {
    id: "unknown_scam_call",
    title: "Unknown (+91 88002 91100)",
    tag: "Scam / Robocall",
    callerName: "Unknown (+91 88002 91100)",
    callerNumber: "+91 88002 91100",
    claimedIdentity: "Suspicious Caller",
    targetVulnerability: "Fake Arrest Threat & Instant Extortion",
    expectedOutcome: "HIGH RISK (AI Voice Detected)",
    description: "Automated generative voice system threatening instant court summons if fine is not cleared immediately.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "This is automated urgent notice regarding an unauthorized transaction...",
        spoofScore: 0.84,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.91,
        reason: "Monotonic pitch curve, unnatural phoneme transitions",
        features: {
          spectralArtifacts: 82,
          breathingAbsence: 96,
          microNoise: 16,
          pitchJitter: 10,
          temporalConsistency: 91
        },
        mfccDelta: [11.2, 7.8, -3.9, 14.1, 8.9],
        f0Hz: 145.0
      },
      {
        chunkId: "chunk_002",
        timeRange: "2-4s",
        transcript: "...press 1 now to connect with our fraud prevention unit immediately.",
        spoofScore: 0.92,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.95,
        reason: "TTS engine cadence detected; zero organic breath pauses",
        features: {
          spectralArtifacts: 87,
          breathingAbsence: 97,
          microNoise: 10,
          pitchJitter: 8,
          temporalConsistency: 94
        },
        mfccDelta: [13.1, 8.6, -3.4, 16.0, 10.4],
        f0Hz: 145.2
      }
    ]
  }
];
