from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Terminal(Base):
    __tablename__ = "terminals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    layout_rows = Column(Integer, nullable=False)
    layout_cols = Column(Integer, nullable=False)
    status = Column(String, default="ACTIVE")

class Box(Base):
    __tablename__ = "boxes"
    id = Column(Integer, primary_key=True, index=True)
    terminal_id = Column(Integer, ForeignKey("terminals.id"), nullable=False)
    identifier = Column(String, nullable=False)
    box_type = Column(String, nullable=False)
    status = Column(String, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    box_id = Column(Integer, ForeignKey("boxes.id"), nullable=False)
    terminal_id = Column(Integer, ForeignKey("terminals.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    pickup_code = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String, nullable=False)

class OtpToken(Base):
    __tablename__ = "otp_tokens"
    phone = Column(String, primary_key=True, index=True)
    otp = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
