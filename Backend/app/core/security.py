# app/core/security.py
from datetime import datetime, timedelta
import jwt
import bcrypt
import os

# Configuration 
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-development-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 Days

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compares a plain text password against the hashed database password."""
    # bcrypt requires bytes, so we encode the strings to utf-8
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    """Generates a secure bcrypt hash for a new password."""
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
    # Decode back to a string so it can be saved in the database
    return hashed_bytes.decode('utf-8')

def create_access_token(subject: str | int) -> str:
    """Generates the JWT token containing the user's ID."""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt