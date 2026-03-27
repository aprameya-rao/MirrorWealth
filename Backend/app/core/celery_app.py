# app/core/celery_app.py
import os
import ssl  # <--- NEW IMPORT
from celery import Celery
from dotenv import load_dotenv
from celery.schedules import crontab


# Load environment variables from .env file
load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Celery app
celery_app = Celery(
    "mirror_wealth",
    broker=REDIS_URL,
    backend=REDIS_URL
)

is_secure = REDIS_URL.startswith('rediss://')

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Kolkata',
    enable_utc=True,
    
    # --- THE FIX: Use the native ssl.CERT_NONE object (no quotes!) ---
    broker_use_ssl={'ssl_cert_reqs': ssl.CERT_NONE} if is_secure else None,
    redis_backend_use_ssl={'ssl_cert_reqs': ssl.CERT_NONE} if is_secure else None,
)

celery_app.conf.beat_schedule = {
    'monitor-portfolio-drift-every-minute': {
        'task': 'app.worker.tasks.daily_drift_monitor', # The name of the task we are about to write
        # Run every 60 seconds for testing!
        # 'schedule': 10.0, 
        
        # PRO-TIP: When you are ready for production, comment out the line above 
        # and uncomment the line below to run it only after Indian markets close:
        'schedule': crontab(hour=15, minute=45, day_of_week='mon-fri'),
    },
}

# Tell Celery where to look for your tasks
celery_app.autodiscover_tasks(['app.worker'])