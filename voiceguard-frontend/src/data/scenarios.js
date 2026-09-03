export const SCENARIOS = [
  {
    id: "sbi_kyc_scam",
    title: "SBI Bank KYC Fraud (AI Cloned Voice)",
    tag: "Banking Scam",
    callerName: "Unknown (Claims: SBI Card Security)",
    callerNumber: "+91 98234 11092",
    claimedIdentity: "SBI Credit Card Division",
    targetVulnerability: "OTP / Credit Card CVV Phishing",
    expectedOutcome: "HIGH RISK (AI Voice Detected)",
    description: "Fraudster uses low-latency real-time voice synthesis clone pretending to be an SBI representative urging immediate KYC update.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "Hello? I am calling from SBI Credit Card Security...",
        spoofScore: 0.88,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.92,
        reason: "No breathing detected, spectral artifacts present, flat pitch",
        features: {
          spectralArtifacts: 86,
          breathingAbsence: 95,
          microNoise: 14,
          pitchJitter: 12,
          temporalConsistency: 92
        },
        mfccDelta: [12.4, 8.2, -4.1, 15.6, 9.8],
        f0Hz: 132.4
      },
      {
        chunkId: "chunk_002",
        timeRange: "2-4s",
        transcript: "...regarding your card which will be blocked in 15 minutes...",
        spoofScore: 0.91,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.94,
        reason: "Unnatural glottal closure, zero micro-tremor in vocal tract",
        features: {
          spectralArtifacts: 91,
          breathingAbsence: 98,
          microNoise: 8,
          pitchJitter: 9,
          temporalConsistency: 95
        },
        mfccDelta: [14.1, 9.5, -3.2, 17.8, 11.2],
        f0Hz: 132.8
      },
      {
        chunkId: "chunk_003",
        timeRange: "4-6s",
        transcript: "...please confirm the 6-digit verification code sent on SMS now.",
        spoofScore: 0.94,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.96,
        reason: "Linear spectrogram streaks, zero breathing interval at 6.0s",
        features: {
          spectralArtifacts: 94,
          breathingAbsence: 99,
          microNoise: 5,
          pitchJitter: 7,
          temporalConsistency: 97
        },
        mfccDelta: [15.2, 10.8, -2.1, 19.4, 12.0],
        f0Hz: 133.1
      },
      {
        chunkId: "chunk_004",
        timeRange: "6-8s",
        transcript: "Sir do not disconnect or account will be permanently frozen.",
        spoofScore: 0.89,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.93,
        reason: "Robotic harmonic structure, CQCC cepstral boundary mismatch",
        features: {
          spectralArtifacts: 88,
          breathingAbsence: 96,
          microNoise: 12,
          pitchJitter: 11,
          temporalConsistency: 93
        },
        mfccDelta: [13.7, 8.9, -3.8, 16.4, 10.1],
        f0Hz: 132.5
      }
    ]
  },
  {
    id: "kidnap_ransom_clone",
    title: "AI Voice Clone Emergency / Ransom Scam",
    tag: "Voice Clone Attack",
    callerName: "Unknown (+91 70112 84920)",
    callerNumber: "+91 70112 84920",
    claimedIdentity: "Cloned Relative / College Friend",
    targetVulnerability: "Urgent UPI Fund Transfer Extortion",
    expectedOutcome: "CRITICAL RISK (Deepfake Voice)",
    description: "High-fidelity 3-second cloned voice of a family member fabricated from social media reel audio crying for emergency funds.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "Mom, please help me! My phone was stolen and police...",
        spoofScore: 0.93,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.95,
        reason: "Synthesized emotional pitch modulation lacking human diaphragm tremor",
        features: {
          spectralArtifacts: 93,
          breathingAbsence: 94,
          microNoise: 11,
          pitchJitter: 14,
          temporalConsistency: 96
        },
        mfccDelta: [16.8, 11.2, -5.4, 21.0, 14.2],
        f0Hz: 218.4
      },
      {
        chunkId: "chunk_002",
        timeRange: "2-4s",
        transcript: "...police have detained me near railway station. Send 50,000 on UPI...",
        spoofScore: 0.96,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.97,
        reason: "Zero vocal tract formants variation, repetitive phase envelope",
        features: {
          spectralArtifacts: 97,
          breathingAbsence: 99,
          microNoise: 6,
          pitchJitter: 8,
          temporalConsistency: 98
        },
        mfccDelta: [18.2, 12.7, -4.9, 23.5, 15.6],
        f0Hz: 219.0
      },
      {
        chunkId: "chunk_003",
        timeRange: "4-6s",
        transcript: "...do it right now to this scanner QR, please hurry!",
        spoofScore: 0.95,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.96,
        reason: "VoiceGuard Engine: Neural vocoder high-frequency cutoff detected",
        features: {
          spectralArtifacts: 95,
          breathingAbsence: 98,
          microNoise: 7,
          pitchJitter: 9,
          temporalConsistency: 97
        },
        mfccDelta: [17.5, 12.0, -5.1, 22.1, 14.9],
        f0Hz: 218.7
      }
    ]
  },
  {
    id: "traffic_challan_robocall",
    title: "Traffic Police / Digital Arrest Threat",
    tag: "Robocall Threat",
    callerName: "Unknown (+91 88002 91100)",
    callerNumber: "+91 88002 91100",
    claimedIdentity: "Cyber Crime Cell / Traffic HQ",
    targetVulnerability: "Fake Arrest Threat & Instant Extortion",
    expectedOutcome: "HIGH RISK (Text-to-Speech Engine)",
    description: "Automated generative voice system threatening instant court summons if fine is not cleared immediately.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "This is automated legal notice from Delhi Traffic Police...",
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
        transcript: "...your vehicle DL-04-XX has 3 pending non-bailable warrants...",
        spoofScore: 0.87,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.93,
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
      },
      {
        chunkId: "chunk_003",
        timeRange: "4-6s",
        transcript: "...press 1 now to speak with our duty officer immediately.",
        spoofScore: 0.81,
        riskLevel: "HIGH",
        isFake: true,
        confidence: 0.89,
        reason: "Synthetic boundary interpolation at phoneme juncture",
        features: {
          spectralArtifacts: 80,
          breathingAbsence: 93,
          microNoise: 19,
          pitchJitter: 14,
          temporalConsistency: 89
        },
        mfccDelta: [10.8, 7.2, -4.2, 13.5, 8.3],
        f0Hz: 144.8
      }
    ]
  },
  {
    id: "real_friend_call",
    title: "Genuine Human Caller (Normal Friend)",
    tag: "Legitimate Call",
    callerName: "Aarav Sharma",
    callerNumber: "+91 98110 54321",
    claimedIdentity: "College Friend",
    targetVulnerability: "None (Safe)",
    expectedOutcome: "LOW RISK (Genuine Human Voice)",
    description: "Authentic human conversation with organic diaphragm breath intakes, natural micro-tremor, and variable pitch contour.",
    chunks: [
      {
        chunkId: "chunk_001",
        timeRange: "0-2s",
        transcript: "Hey bro! Are you free this weekend? [sighs] Was thinking...",
        spoofScore: 0.12,
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
        transcript: "...we could grab coffee and finish that hackathon pitch deck.",
        spoofScore: 0.09,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.97,
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
      },
      {
        chunkId: "chunk_003",
        timeRange: "4-6s",
        transcript: "Let me know if 5 PM works for you, talk soon!",
        spoofScore: 0.14,
        riskLevel: "LOW",
        isFake: false,
        confidence: 0.94,
        reason: "Natural breath release at sentence end, zero spectral grid artifacts",
        features: {
          spectralArtifacts: 9,
          breathingAbsence: 7,
          microNoise: 85,
          pitchJitter: 79,
          temporalConsistency: 21
        },
        mfccDelta: [3.6, 2.4, -1.4, 4.3, 3.1],
        f0Hz: 122.9
      }
    ]
  }
];
