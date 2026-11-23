import logging
from typing import Optional
import urllib.parse
from app.config import settings

try:
    # pyrefly: ignore [missing-import]
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None

try:
    import psycopg2
except ImportError:
    psycopg2 = None


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


def get_postgres_connection(use_direct: bool = False):
    """
    Returns a direct psycopg2 connection to Postgres using DATABASE_URL or DIRECT_URL.
    - DATABASE_URL: Shared transaction-mode pooler (IPv4, pgbouncer port 6543)
    - DIRECT_URL: Shared session-mode pooler (port 5432, used for migrations/DDL)
    Sanitizes ORM-specific query parameters (such as 'pgbouncer=true') to ensure standard libpq compatibility.
    """
    if psycopg2 is None:
        raise ImportError("psycopg2 is not installed in the environment.")

    raw_url = settings.DIRECT_URL if use_direct else (settings.DATABASE_URL or settings.DIRECT_URL)
    if not raw_url:
        raise ValueError("Neither DATABASE_URL nor DIRECT_URL is configured in settings.")

    try:
        parsed = urllib.parse.urlsplit(raw_url)
        # Filter out ORM-specific query parameters not recognized by libpq/psycopg2
        query_params = urllib.parse.parse_qsl(parsed.query)
        libpq_params = [(k, v) for k, v in query_params if k.lower() not in ("pgbouncer",)]
        clean_query = urllib.parse.urlencode(libpq_params)
        clean_url = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, clean_query, parsed.fragment))
        return psycopg2.connect(clean_url)
    except Exception as e:
        logger.error(f"Failed to connect to Postgres: {e}")
        raise

