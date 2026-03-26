# app/core/security.py
import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

# --- JWT Configuration ---
# You can generate a random secret key later by running this in your terminal:
# openssl rand -hex 32
SECRET_KEY = "a_very_secret_key_that_you_will_change_later" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Checks if a plain text password matches the hashed version."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Takes a plain text password and scrambles it into a secure hash."""
    return pwd_context.hash(password)

# --- Token Generation ---
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Creates a signed JSON Web Token with an expiration date."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        
    # Add the expiration time to the payload under the standard 'exp' key
    to_encode.update({"exp": expire})
    
    # Cryptographically sign the token using your secret key
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt