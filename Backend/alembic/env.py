import asyncio
import os
from logging.config import fileConfig
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

# --------------------------------------------------
# 1. LOAD ENV VARIABLES (DO THIS FIRST)
# --------------------------------------------------
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Debug: confirm env is loaded
print("Loaded .env from:", env_path)
print("DB URL from env:", os.getenv("DATABASE_URL"))

# --------------------------------------------------
# 2. IMPORT MODELS (ENSURE METADATA IS POPULATED)
# --------------------------------------------------
import app.models
from app.models import Base

# Debug: confirm models are registered
print("Detected tables:", Base.metadata.tables.keys())

# --------------------------------------------------
# 3. ALEMBIC CONFIG
# --------------------------------------------------
config = context.config

# Set up logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# IMPORTANT:
# DO NOT use config.set_main_option("sqlalchemy.url", ...)
# because % in passwords breaks ConfigParser
# We will bypass it and directly use the engine

target_metadata = Base.metadata

# --------------------------------------------------
# 4. OFFLINE MODE (rarely used, but keep it)
# --------------------------------------------------
def run_migrations_offline() -> None:
    url = os.getenv("DATABASE_URL")

    print("Running OFFLINE migrations with URL:", url)

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# --------------------------------------------------
# 5. ONLINE MODE (this is what you use)
# --------------------------------------------------
def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    db_url = os.getenv("DATABASE_URL")

    print("Running ONLINE migrations with URL:", db_url)

    # Create engine manually (bypass config parsing issues)
    connectable = create_async_engine(
        db_url,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())

# --------------------------------------------------
# 6. ENTRYPOINT
# --------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()