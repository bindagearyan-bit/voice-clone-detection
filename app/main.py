import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch



from app.routers import auth, http_detection, ws_detection
from app.services.ai_engine import get_ai_engine

# Configure logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("voice_fraud_detection")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager for pre-loading the Hugging Face model on startup.
    """
    logger.info("Initializing Voice Fraud Detection server...")
    try:
        get_ai_engine()
        logger.info("AI Deepfake Detection Model pre-loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to pre-load AI Engine model on startup: {e}")
    yield
    logger.info("Shutting down Voice Fraud Detection server...")


app = FastAPI(
    title="Voice Clone & Audio Deepfake Detection API",
    version="1.0.0",
    description="Real-Time AI Voice Clone and Audio Deepfake Detection System Backend",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(ws_detection.router)
app.include_router(http_detection.router)


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Health check endpoint returning system status and GPU availability.
    """
    return {
        "status": "healthy",
        "cuda_available": torch.cuda.is_available()
    }


if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

