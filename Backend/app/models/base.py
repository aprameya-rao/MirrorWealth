# app/models/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    Central declarative base. All SQLAlchemy models will inherit from this.
    """
    pass