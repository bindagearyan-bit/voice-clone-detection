from datetime import datetime, timezone
import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.config import settings
from app.database import get_supabase
from app.schemas.detection import (
    AudioFileAnalysisResponse,
    CallSummaryResponse,
    ChunkAnalysisResult,
    DetectionResponse
)
from app.services.ai_engine import get_ai_engine
from app.services.audio_processor import preprocess_audio

logger = logging.getLogger("voice_fraud_detection")
router = APIRouter(tags=["HTTP Detection"])


@router.post("/analyze-chunk", response_model=DetectionResponse)
async def analyze_chunk(
    call_id: str = Form(...),
    chunk_id: str = Form(...),
    phone_number: str = Form(...),
    file: UploadFile = File(...)
):
    """
    HTTP fallback endpoint to analyze a single audio chunk uploaded as multipart/form-data.
    """
    try:
        audio_bytes = await file.read()
        audio_array = preprocess_audio(audio_bytes)
        ai_engine = get_ai_engine()
        result = ai_engine.predict(audio_array)

        timestamp_str = datetime.now(timezone.utc).isoformat()

        response = DetectionResponse(
            chunk_id=chunk_id,
            call_id=call_id,
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            color=result["color"],
            is_fake=result["is_fake"],
            reason=result["reason"],
            confidence=result["confidence"],
            timestamp=timestamp_str
        )

        supabase = get_supabase()
        if supabase is not None:
            try:
                log_data = {
                    "call_id": call_id,
                    "chunk_id": chunk_id,
                    "phone_number": phone_number,
                    "risk_score": result["risk_score"],
                    "risk_level": result["risk_level"],
                    "color": result["color"],
                    "is_fake": result["is_fake"],
                    "aasist_score": result["fake_probability"],
                    "reason": result["reason"],
                    "model_used": settings.MODEL_ID,
                    "created_at": timestamp_str
                }
                supabase.table("call_logs").insert(log_data).execute()
            except Exception as db_err:
                logger.error(f"Failed to log chunk to Supabase call_logs: {db_err}")

        return response

    except Exception as e:
        logger.error(f"Error processing audio chunk HTTP upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Audio processing error: {str(e)}"
        )


@router.get("/call-summary/{call_id}", response_model=CallSummaryResponse)
async def get_call_summary(call_id: str):
    """
    Aggregates log history for call_id from Supabase call_logs, computes call summary,
    saves into call_sessions table, and returns summary details.
    """
    supabase = get_supabase()
    
    phone_number = "Unknown"
    total_chunks = 0
    avg_risk_score = 0
    max_risk_score = 0
    fake_count = 0
    start_time = datetime.now(timezone.utc).isoformat()
    end_time = datetime.now(timezone.utc).isoformat()

    if supabase is not None:
        try:
            res = supabase.table("call_logs").select("*").eq("call_id", call_id).order("created_at", desc=False).execute()
            logs = res.data if res else []

            if logs:
                total_chunks = len(logs)
                phone_number = logs[0].get("phone_number", "Unknown")
                risk_scores = [r.get("risk_score", 0) for r in logs]
                avg_risk_score = int(sum(risk_scores) / total_chunks)
                max_risk_score = max(risk_scores)
                fake_count = sum(1 for r in logs if r.get("is_fake"))
                start_time = logs[0].get("created_at", start_time)
                end_time = logs[-1].get("created_at", end_time)
        except Exception as db_err:
            logger.error(f"Failed to fetch logs for call_id {call_id} from Supabase: {db_err}")

    # Determine final verdict
    if avg_risk_score > 70 or fake_count >= 3:
        final_verdict = "FAKE"
    elif avg_risk_score > 40:
        final_verdict = "SUSPICIOUS"
    else:
        final_verdict = "REAL"

    summary_response = CallSummaryResponse(
        call_id=call_id,
        phone_number=phone_number,
        total_chunks=total_chunks,
        avg_risk_score=avg_risk_score,
        max_risk_score=max_risk_score,
        final_verdict=final_verdict,
        start_time=start_time,
        end_time=end_time
    )

    if supabase is not None:
        try:
            session_data = {
                "call_id": call_id,
                "phone_number": phone_number,
                "total_chunks": total_chunks,
                "avg_risk_score": avg_risk_score,
                "max_risk_score": max_risk_score,
                "final_verdict": final_verdict,
                "start_time": start_time,
                "end_time": end_time,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            supabase.table("call_sessions").upsert(session_data).execute()
        except Exception as db_err:
            logger.error(f"Failed to save session to Supabase call_sessions: {db_err}")

    return summary_response


@router.post("/analyze-file", response_model=AudioFileAnalysisResponse)
async def analyze_audio_file(
    file: UploadFile = File(...),
    chunk_duration_sec: float = Form(2.0),
    phone_number: str = Form("+91 98234 11092"),
    call_id: str = Form(None)
):
    """
    Accepts an audio file upload (.wav, .mp3, .ogg, etc.), splits it into sequential
    2.0-second chunks (16kHz mono), evaluates each chunk using the deepfake AI model,
    measures inference latency, and returns full chunk breakdowns and formatted terminal logs.
    """
    import io
    import time
    import librosa
    import numpy as np
    from pathlib import Path

    if not call_id:
        call_id = f"upload_{int(time.time() * 1000)}"

    try:
        audio_bytes = await file.read()
        file_size_bytes = len(audio_bytes)

        # Load with librosa at 16kHz mono
        buffer = io.BytesIO(audio_bytes)
        target_sr = 16000
        audio_array, sr = librosa.load(buffer, sr=target_sr, mono=True)
        audio_array = audio_array.astype(np.float32)

        total_samples = len(audio_array)
        duration_sec = float(total_samples / target_sr)

        samples_per_chunk = max(int(target_sr * chunk_duration_sec), 16000)
        
        # Split into chunks intelligently
        raw_chunks = []
        if total_samples <= samples_per_chunk:
            raw_chunks.append(audio_array)
        else:
            min_tail_samples = int(target_sr * 0.8) # 0.8s minimum
            for i in range(0, total_samples, samples_per_chunk):
                chunk = audio_array[i:i + samples_per_chunk]
                # If tail chunk is too short and we already have chunks, append to previous or keep if long enough
                if len(chunk) < min_tail_samples and len(raw_chunks) > 0:
                    # Append remaining tail to the last chunk
                    raw_chunks[-1] = np.concatenate([raw_chunks[-1], chunk])
                else:
                    raw_chunks.append(chunk)

        total_chunks = len(raw_chunks)
        ai_engine = get_ai_engine()
        chunk_results = []
        terminal_lines = [
            f"Loading sample audio file: {file.filename} ({duration_sec:.2f}s, {file_size_bytes} bytes)",
            f"Prepared {total_chunks} chunk(s) of {chunk_duration_sec:.1f}s each (16kHz mono).",
            "=" * 65
        ]

        total_latency_ms = 0.0

        for idx, chunk_data in enumerate(raw_chunks, start=1):
            # If chunk is shorter than 1.0s, tile it to reach 16000 samples for stable inference
            if len(chunk_data) < target_sr:
                repeats = int(np.ceil(target_sr / max(len(chunk_data), 1)))
                chunk_data = np.tile(chunk_data, repeats)[:target_sr]

            start_t = time.perf_counter()
            result = ai_engine.predict(chunk_data, sr=target_sr)
            latency_ms = round((time.perf_counter() - start_t) * 1000, 2)
            total_latency_ms += latency_ms

            start_sec = round((idx - 1) * chunk_duration_sec, 2)
            end_sec = round(min(idx * chunk_duration_sec, duration_sec), 2)
            if idx == total_chunks:
                end_sec = round(duration_sec, 2)
            chunk_id = f"chunk_{idx:03d}"

            term_line = (
                f"[Chunk {idx}/{total_chunks}] Latency: {latency_ms:.2f} ms\n"
                f"  Risk Score : {result['risk_score']}/100 [{result['risk_level']}] - {result['color']}\n"
                f"  Is Fake    : {result['is_fake']}\n"
                f"  Confidence : {result['confidence']:.4f}\n"
                f"  Reason     : {result['reason']}\n"
                f"{'-' * 65}"
            )
            terminal_lines.append(term_line)

            chunk_results.append(
                ChunkAnalysisResult(
                    chunk_index=idx,
                    chunk_id=chunk_id,
                    start_time_sec=start_sec,
                    end_time_sec=end_sec,
                    latency_ms=latency_ms,
                    risk_score=result["risk_score"],
                    risk_level=result["risk_level"],
                    color=result["color"],
                    is_fake=result["is_fake"],
                    confidence=result["confidence"],
                    reason=result["reason"],
                    acoustic_metrics=result.get("acoustic_metrics", {}),
                    terminal_line=term_line
                )
            )

        # Aggregate metrics across all chunks for final verdict
        scores = [c.risk_score for c in chunk_results]
        avg_risk_score = int(sum(scores) / len(scores)) if scores else 0
        max_risk_score = max(scores) if scores else 0
        fake_chunks = sum(1 for c in chunk_results if c.is_fake)
        fake_ratio = fake_chunks / max(total_chunks, 1)
        avg_latency_ms = round(total_latency_ms / max(total_chunks, 1), 2)

        # Final verdict based on weighted majority summary
        if avg_risk_score >= 60 or fake_ratio >= 0.5:
            final_verdict = "HIGH SPOOF RISK — AI CLONE DETECTED"
            final_color = "RED"
            overall_fake = True
        elif avg_risk_score >= 35 or fake_ratio >= 0.25:
            final_verdict = "SUSPICIOUS — MODERATE ANOMALIES"
            final_color = "YELLOW"
            overall_fake = False
        else:
            final_verdict = "AUTHENTIC — NATURAL HUMAN VOICE"
            final_color = "GREEN"
            overall_fake = False

        terminal_lines.append(
            f"\n[SUMMARY DOSSIER]\n"
            f"  Final Verdict  : {final_verdict} ({final_color})\n"
            f"  Avg Risk Score : {avg_risk_score}/100\n"
            f"  Peak Risk Score: {max_risk_score}/100\n"
            f"  Avg Latency    : {avg_latency_ms:.2f} ms / chunk\n"
            f"  Chunks Flagged : {fake_chunks}/{total_chunks}\n"
            f"{'=' * 65}"
        )

        full_terminal_output = "\n".join(terminal_lines)

        return AudioFileAnalysisResponse(
            filename=file.filename or "uploaded_audio.wav",
            file_size_bytes=file_size_bytes,
            duration_sec=round(duration_sec, 2),
            sample_rate=target_sr,
            total_samples=total_samples,
            total_chunks=total_chunks,
            chunk_duration_sec=chunk_duration_sec,
            avg_risk_score=avg_risk_score,
            max_risk_score=max_risk_score,
            final_verdict=final_verdict,
            final_color=final_color,
            is_fake=overall_fake,
            avg_latency_ms=avg_latency_ms,
            total_latency_ms=round(total_latency_ms, 2),
            terminal_output=full_terminal_output,
            chunks=chunk_results,
            timestamp=datetime.now(timezone.utc).isoformat()
        )

    except Exception as e:
        logger.error(f"Error analyzing uploaded audio file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Audio file analysis failed: {str(e)}"
        )


@router.get("/samples")
async def list_sample_audio_files():
    """
    Returns available pre-packaged sample wav files for quick testing.
    """
    from pathlib import Path
    root_dir = Path(__file__).resolve().parent.parent.parent
    sample_files = ["cloned_1.wav", "cloned_2.wav", "real_1.wav", "real_2.wav"]
    available = []

    for name in sample_files:
        f_path = root_dir / name
        if f_path.exists():
            size = f_path.stat().st_size
            label = "AI Cloned Voice" if "cloned" in name else "Authentic Human Voice"
            available.append({
                "filename": name,
                "label": f"{label} ({name})",
                "type": "cloned" if "cloned" in name else "real",
                "size_bytes": size,
                "url": f"/samples/{name}"
            })
    return {"samples": available}


@router.get("/samples/{filename}")
async def get_sample_audio_file(filename: str):
    """
    Serves the sample wav audio file.
    """
    from pathlib import Path
    from fastapi.responses import FileResponse
    root_dir = Path(__file__).resolve().parent.parent.parent
    f_path = root_dir / filename
    if not f_path.exists() or filename not in ["cloned_1.wav", "cloned_2.wav", "real_1.wav", "real_2.wav"]:
        raise HTTPException(status_code=404, detail="Sample audio file not found")
    return FileResponse(path=f_path, media_type="audio/wav", filename=filename)
