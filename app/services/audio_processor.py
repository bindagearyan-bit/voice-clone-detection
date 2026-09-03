import base64
import io
import librosa
import numpy as np


def decode_base64_audio(base64_str: str) -> bytes:
    """
    Decodes a base64 string (with or without data URI prefix) into raw audio bytes.
    """
    if "," in base64_str:
        base64_str = base64_str.split(",", 1)[1]
    return base64.b64decode(base64_str)


def preprocess_audio(audio_bytes: bytes, target_sr: int = 16000) -> np.ndarray:
    """
    Loads raw audio bytes, resamples to target_sr (16kHz), ensures single mono channel,
    pads with zeros if < 0.5s (8,000 samples), and returns a float32 numpy array.
    """
    audio_buffer = io.BytesIO(audio_bytes)
    
    # librosa.load converts to single channel mono by default when mono=True
    y, sr = librosa.load(audio_buffer, sr=target_sr, mono=True)

    # Ensure float32 dtype
    y = y.astype(np.float32)

    min_samples = int(target_sr * 1.0)  # 1.0 second = 16000 samples
    if len(y) < min_samples:
        if len(y) > 0:
            repeats = int(np.ceil(min_samples / len(y)))
            y = np.tile(y, repeats)[:min_samples]
        else:
            y = np.zeros(min_samples, dtype=np.float32)

    return y
