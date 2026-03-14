from sqlalchemy.orm import Session
from app.database import models
from app.utils.time_utils import get_otp_expiry_time, get_current_time

def create_or_update_otp(db: Session, phone: str, otp_code: str):
    token_record = db.query(models.OtpToken).filter(models.OtpToken.phone == phone).first()
    if token_record:
        token_record.otp = otp_code
        token_record.expires_at = get_otp_expiry_time()
    else:
        token_record = models.OtpToken(
            phone=phone,
            otp=otp_code,
            expires_at=get_otp_expiry_time()
        )
        db.add(token_record)
    db.commit()

def verify_otp(db: Session, phone: str, otp_code: str) -> bool:
    token_record = db.query(models.OtpToken).filter(models.OtpToken.phone == phone).first()
    if not token_record:
        return False
    if token_record.otp != otp_code:
        return False
    if token_record.expires_at < get_current_time():
        return False

    # Invalidate the OTP after successful verification
    db.delete(token_record)
    db.commit()
    return True