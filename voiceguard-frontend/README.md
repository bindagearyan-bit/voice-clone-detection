# VoiceGuard AI - Real-Time AI Voice & Cloned Spoof Detection Call Guard

> **Smart India Hackathon (SIH) Project Frontend**  
> *Problem Statement: Detecting AI Synthetic, Cloned, and Spoofed Voice in Real-Time Mobile Voice Calls.*

---

## 🎯 Key Features & Workflow Implementation

This frontend implements **Workflow: WAY 1 – Without Original Voice (General Spoof Detection)**:

1. **Step 1: WebRTC Call Starts**: Incoming call screen initializes with caller ID (+91-98XXXXXX) and starts background telemetry.
2. **Step 2: 2-Second Audio Chunking**: Automatically captures raw audio and splits into 2-second windows (`Chunk 1 [0-2s]`, `Chunk 2 [2-4s]`, etc.).
3. **Step 3: WebSocket Transmission**: 16kHz WAV payload is generated and sent to backend with full JSON contract inspection.
4. **Step 4: VoiceGuard Neural Acoustic Analysis**: Features extracted (16kHz Spectrogram, dynamic F0 Pitch contour, Spectral Centroid, Rolloff, Jitter) and evaluated for:
   - **Spectral Artifacts** (neural vocoder horizontal lines)
   - **Breathing Pattern Absence** (AI lacks human 3-4s breath intervals)
   - **Micro-noise / Glottal Pulse** (Lack of natural biological throat friction)
   - **Pitch Jitter** (Monotonic synthetic flat pitch vs organic jitter)
   - **Temporal Consistency** (Robotic consistency vs human prosody)
5. **Step 5: Risk Engine**: Dynamic scoring (>80% HIGH Red, >40% MODERATE Amber, <40% LOW Green).
6. **Step 6: Supabase Database Ledger**: Immutable record logged with cryptographic SHA-256 audio hash.
7. **Step 7 & 8: Real-Time Phone Alert**: Low latency response (~800ms) updates the animated **Radial Risk Gauge**, vibrates phone, plays warning beep, and triggers the `⚠️ AI VOICE DETECTED - DO NOT SHARE OTP` emergency banner.
8. **Step 9: Continuous Stream Monitoring**: Continuous 2s updates; auto-suggests instant call block on 3 consecutive fake chunks.
9. **Step 10: Cyber Crime Forensics Report**: Printable/downloadable official **Cyber Crime & Bank Fraud Dossier** with technical findings, SHA-256 evidence chain, and National Cyber Crime Portal (1930) reporting guidelines.

---

## 💻 Tech Stack & Design

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons
- **Design System**: Dark Cyber Neumorphism + Glassmorphism UI styled with radial glowing gauges, dark navy slate elevations, and pulsing danger states.
- **Audio Intelligence**: Web Audio API (`AudioContext`, `AnalyserNode`, Real Microphone mode + Canvas-based real-time frequency waveforms).

---

## 🚀 How to Run Locally

1. Open your terminal in this directory:
   ```bash
   cd C:\Users\rucha\.gemini\antigravity\scratch\voice-guard-sih
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 📱 Included SIH Demo Scenarios

- **Scenario 1**: *SBI Bank KYC Fraud (AI Cloned Voice)* — 89% Spoof probability
- **Scenario 2**: *AI Voice Clone Emergency / Ransom Scam* — 95% Spoof probability
- **Scenario 3**: *Delhi Traffic Police Robocall / Threat* — 82% Spoof probability
- **Scenario 4**: *Genuine Human Caller (Normal Friend)* — 12% Clean Human Voice
- **Live Mic Mode**: Connects directly to your laptop/phone microphone to test in real-time.
