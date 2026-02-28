"""
FuturDialk V4 — Core Configuration
Loads all environment variables via Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "FuturDialk"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True

    # PostgreSQL
    DATABASE_URL: str

    # MongoDB
    MONGODB_URL: str

    # MinIO
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "FuturDialk_minio"
    MINIO_SECRET_KEY: str = "FuturDialk_minio_pwd_2026"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # JWT
    JWT_SECRET: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Encryption
    ENCRYPTION_KEY: str = "change-me"

    # AI — OpenRouter (unified gateway for all LLM models)
    OPENROUTER_API_KEY: Optional[str] = None
    # OpenAI direct (fallback for Whisper audio only)
    OPENAI_API_KEY: Optional[str] = None

    # WhatsApp
    WHATSAPP_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_ID: Optional[str] = None

    # Email
    RESEND_API_KEY: Optional[str] = None

    # PostHog
    POSTHOG_API_KEY: Optional[str] = None

    # URLs
    BACKEND_URL: str = "http://localhost:8089"
    FRONTEND_URL: str = "http://localhost:3089"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
