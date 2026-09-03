// Web Audio API and Simulation Utility for SIH AI Voice Spoof Guard

let audioCtx = null;
let analyser = null;
let micStream = null;

export const initAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const startMicrophoneCapture = async (onFrequencyData) => {
  try {
    const ctx = initAudioContext();
    if (!ctx) return false;

    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const source = ctx.createMediaStreamSource(micStream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLoop = () => {
      if (!micStream) return;
      analyser.getByteFrequencyData(dataArray);
      if (onFrequencyData) {
        onFrequencyData(dataArray);
      }
      requestAnimationFrame(updateLoop);
    };

    updateLoop();
    return true;
  } catch (err) {
    console.warn("Microphone access not granted or unavailable, using simulation fallback:", err);
    return false;
  }
};

export const stopMicrophoneCapture = () => {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
};

// Play Warning Alert Beep (Step 8 in workflow)
export const playWarningBeep = (isHighRisk = true) => {
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isHighRisk ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(isHighRisk ? 880 : 440, ctx.currentTime); // A5 or A4
    if (isHighRisk) {
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.3);
    }

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.log("Audio beep playback not supported:", e);
  }
};

// Trigger Device Vibration (Step 8 in workflow: Long Buzz)
export const triggerVibration = (pattern = [300, 150, 300, 150, 600]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // ignore
    }
  }
};
