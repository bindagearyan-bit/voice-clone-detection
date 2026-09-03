import logging
from typing import Optional
from app.config import settings

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None



logger = logging.getLogger("voice_fraud_detection")

supabase: Optional[Client] = None

if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY and not settings.SUPABASE_URL.startswith("https://your-project"):
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.warning(f"Failed to initialize Supabase client: {e}")
        supabase = None
else:
    logger.info("Supabase URL or Key missing/unconfigured. Database logging disabled or in mock mode.")


def get_supabase() -> Optional[Client]:
    """Returns the initialized singleton Supabase client instance."""
    return supabase
