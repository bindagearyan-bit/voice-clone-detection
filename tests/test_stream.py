import argparse
import asyncio
import base64
import io
import json
import socket
import subprocess
import sys
import time
import numpy as np
import soundfile as sf
import websockets


def ensure_server_running(host: str = "127.0.0.1", port: int = 8000):
    """
    Checks if Uvicorn backend server is listening on port 8000.
    If not running, automatically launches it in the background so tests NEVER fail with connection errors!
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(1.0)
        if sock.connect_ex((host, port)) == 0:
            return  # Server is already running!

    print("[INFO] Uvicorn backend server is not running. Auto-starting backend server in background...")
    creationflags = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
    subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", str(port)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=creationflags
    )

    # Wait for server port to bind
    for _ in range(30):
        time.sleep(0.5)
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1.0)
            if sock.connect_ex((host, port)) == 0:
                print("[SUCCESS] Uvicorn backend server auto-started and ready on http://localhost:8000!\n")
                return
    print("⚠️ Server launch warming up; connecting to WebSocket...\n")


def generate_synthetic_audio(duration_sec: float = 6.0, sr: int = 16000) -> bytes:
    """Generates synthetic sine wave audio bytes for testing if no WAV file is supplied."""
    t = np.linspace(0, duration_sec, int(sr * duration_sec), endpoint=False)
    audio_data = 0.5 * np.sin(2 * np.pi * 440 * t)  # 440 Hz tone
    buffer = io.BytesIO()
    sf.write(buffer, audio_data, sr, format="WAV")
    return buffer.getvalue()


async def stream_audio(ws_url: str, wav_path: str = None, chunk_duration_sec: float = 2.0):
    sr = 16000
    if wav_path:
        import librosa
        print(f"Loading sample audio file from: {wav_path}")
        audio_data, sr = librosa.load(wav_path, sr=sr, mono=True)
    else:
        print("No input WAV file provided. Generating synthetic audio stream (6 seconds)...")
        audio_bytes = generate_synthetic_audio(duration_sec=6.0, sr=sr)
        import librosa
        audio_data, sr = librosa.load(io.BytesIO(audio_bytes), sr=sr, mono=True)

    samples_per_chunk = int(sr * chunk_duration_sec)
    total_samples = len(audio_data)
    chunks = [audio_data[i:i + samples_per_chunk] for i in range(0, total_samples, samples_per_chunk)]

    print(f"Prepared {len(chunks)} chunk(s) of {chunk_duration_sec}s each.")
    print(f"Connecting to WebSocket: {ws_url} ...")

    try:
        async with websockets.connect(ws_url) as websocket:
            print("WebSocket connected successfully.\n" + "=" * 65)

            for idx, chunk in enumerate(chunks, start=1):
                buf = io.BytesIO()
                sf.write(buf, chunk, sr, format="WAV")
                chunk_bytes = buf.getvalue()
                b64_audio = base64.b64encode(chunk_bytes).decode("utf-8")

                payload = {
                    "call_id": "test_call_999",
                    "chunk_id": f"chunk_{idx:03d}",
                    "phone_number": "+15550192834",
                    "audio_data": b64_audio
                }

                start_time = time.time()
                await websocket.send(json.dumps(payload))
                response_text = await websocket.recv()
                latency_ms = (time.time() - start_time) * 1000

                response = json.loads(response_text)
                print(f"[Chunk {idx}/{len(chunks)}] Latency: {latency_ms:.2f} ms")
                print(f"  Risk Score : {response.get('risk_score')}/100 [{response.get('risk_level')}] - {response.get('color')}")
                print(f"  Is Fake    : {response.get('is_fake')}")
                print(f"  Confidence : {response.get('confidence')}")
                print(f"  Reason     : {response.get('reason')}")
                print("-" * 65)
                await asyncio.sleep(0.2)

    except Exception as e:
        print(f"Connection failed or streaming error: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real-time 2s audio chunk WebSocket streaming test client")
    parser.add_argument("--url", default="ws://localhost:8000/ws/detect", help="Target WebSocket URL")
    parser.add_argument("--wav", default=None, help="Path to input .wav sample file (optional)")
    args = parser.parse_args()

    # Automatically start server if not running!
    ensure_server_running()

    asyncio.run(stream_audio(args.url, args.wav))
