"""
FuturDialk V4 — Database Connections
Async engines for PostgreSQL, MongoDB, MinIO, Redis.
"""

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from motor.motor_asyncio import AsyncIOMotorClient
from minio import Minio
import redis.asyncio as aioredis

from app.core.config import settings


# ── PostgreSQL (SQLAlchemy async) ─────────────────────────

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.APP_DEBUG,
    pool_size=20,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    """FastAPI dependency — yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


# ── MongoDB (Motor async) ────────────────────────────────

mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
mongo_db = mongo_client.FuturDialk


def get_mongo():
    """Returns the MongoDB database instance."""
    return mongo_db


# ── MinIO (S3-compatible) ─────────────────────────────────

minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False,  # HTTP for dev; HTTPS in production
)

MINIO_BUCKETS = [
    "FuturDialk-audio",
    "FuturDialk-images",
    "FuturDialk-recordings",
    "FuturDialk-documents",
]


async def init_minio():
    """Create buckets if they don't exist."""
    for bucket in MINIO_BUCKETS:
        if not minio_client.bucket_exists(bucket):
            minio_client.make_bucket(bucket)


# ── Redis (async) ─────────────────────────────────────────

redis_client = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


async def get_redis():
    """Returns the Redis client."""
    return redis_client
