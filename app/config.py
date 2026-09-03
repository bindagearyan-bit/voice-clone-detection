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
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
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
