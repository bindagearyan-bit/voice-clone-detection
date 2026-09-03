from datetime import datetime, timezone
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from app.config import settings
from app.database import get_supabase
from app.schemas.detection import DetectionRequest, DetectionResponse
from app.services.ai_engine import get_ai_engine
from app.services.audio_processor import decode_base64_audio, preprocess_audio

logger = logging.getLogger("voice_fraud_detection")
router = APIRouter(tags=["WebSocket Detection"])


@router.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection accepted on /ws/detect.")
    
    ai_engine = get_ai_engine()
    supabase = get_supabase()

    try:
        while True:
            raw_json = await websocket.receive_json()
            
            try:
                request_data = DetectionRequest(**raw_json)
            except ValidationError as ve:
                await websocket.send_json({"error": "Invalid request schema", "details": ve.errors()})
                continue

            timestamp_str = datetime.now(timezone.utc).isoformat()

            # Process audio
            audio_bytes = decode_base64_audio(request_data.audio_data)
            audio_array = preprocess_audio(audio_bytes)

            # Inference
            result = ai_engine.predict(audio_array)

            response = DetectionResponse(
                chunk_id=request_data.chunk_id,
                call_id=request_data.call_id,
                risk_score=result["risk_score"],
                risk_level=result["risk_level"],
                color=result["color"],
                is_fake=result["is_fake"],
                reason=result["reason"],
                confidence=result["confidence"],
                timestamp=timestamp_str
            )

            # Log to Supabase call_logs table if configured
            if supabase is not None:
                try:
                    log_data = {
                        "call_id": request_data.call_id,
                        "chunk_id": request_data.chunk_id,
                        "phone_number": request_data.phone_number,
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

            # Send detection response over WebSocket
            await websocket.send_json(response.model_dump())

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected gracefully.")
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {e}")
        try:
            await websocket.close()
        except Exception:
            pass
