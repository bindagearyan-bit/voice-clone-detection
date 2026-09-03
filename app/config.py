import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except (ImportError, ModuleNotFoundError):
    try:
        from pydantic import BaseSettings
        SettingsConfigDict = None
    except (ImportError, ModuleNotFoundError):
        from pydantic import BaseModel as BaseSettings
        SettingsConfigDict = None


class Settings(BaseSettings):
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://jhvcvwwbojxnthvuzxwu.supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodmN2d3dib2p4bnRodnV6eHd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE5Njg3MSwiZXhwIjoyMTAzNzcyODcxfQ.Kxj84Mn0wBjyyxvUSgT3zq8I5SeBY2wgsLjvFbOwRdU"
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY") or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodmN2d3dib2p4bnRodnV6eHd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE5Njg3MSwiZXhwIjoyMTAzNzcyODcxfQ.Kxj84Mn0wBjyyxvUSgT3zq8I5SeBY2wgsLjvFbOwRdU"
    MODEL_ID: str = "mo-thecreator/Deepfake-audio-detection"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    if SettingsConfigDict is not None:
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore"
        )
    else:
        class Config:
            env_file = ".env"
            env_file_encoding = "utf-8"
            extra = "ignore"


settings = Settings()

