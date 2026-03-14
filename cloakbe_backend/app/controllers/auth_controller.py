from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time
import secrets
from app.utils.notification_mock import NotificationMock

router = APIRouter()

# --- Shared State (Requirement 131: TokenTracker equivalent) ---
# In production, use Redis or a DB. For the demo, this works.
otp_store = {}

# --- Schemas ---
class LoginRequest(BaseModel):
    phone_number: str

class VerifyRequest(BaseModel):
    phone_number: str
    otp: str

# --- Endpoints ---

@router.post("/login")
async def login(request: LoginRequest):
    phone = request.phone_number
    
    # 1. Generate a secure 6-digit OTP [cite: 123, 127]
    otp = str(secrets.randbelow(900000) + 100000)
    
    # 2. Use NotificationMock to simulate SMS [cite: 123, 197]
    NotificationMock.send_otp(phone, otp)

    # 3. Store with timestamp [cite: 133, 134]
    # NOTE: Set to 300 for 5-minute expiry per PRD [cite: 127, 217]
    otp_store[phone] = {
        "otp": otp,
        "time": time.time()
    }
    
    return {"message": "OTP sent successfully"}

@router.post("/verify")
async def verify(req: VerifyRequest):
    phone = req.phone_number
    user_otp = req.otp

    # 1. Check if record exists 
    if phone not in otp_store:
        raise HTTPException(status_code=400, detail="OTP not requested or expired")
    
    saved_data = otp_store[phone]
    
    # 2. Enforce 5-minute expiration (300 seconds) [cite: 127, 217]
    if time.time() - saved_data["time"] > 300:
        del otp_store[phone]
        raise HTTPException(status_code=400, detail="OTP expired")
        
    # 3. Validate code 
    if saved_data["otp"] != user_otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    # 4. Clean up and return JWT token [cite: 123, 217]
    del otp_store[phone]
    return {
        "token": f"mock-jwt-token-{phone}", 
        "phone": phone,
        "message": "Authenticated successfully"
    }