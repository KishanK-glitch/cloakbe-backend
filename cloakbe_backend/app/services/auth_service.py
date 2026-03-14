import logging

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.database import models
from app.services import otp_service
from app.utils import otp_generator, jwt_utils

logger = logging.getLogger(__name__)


def initiate_login(db: Session, phone_number: str):
    otp = otp_generator.generate_otp()
    otp_service.create_or_update_otp(db, phone_number, otp)
    logger.info("Generated OTP for phone %s", phone_number)


def verify_and_login(db: Session, phone_number: str, otp: str) -> str:

    is_valid = otp_service.verify_otp(db, phone_number, otp)

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(models.User).filter(
        models.User.phone_number == phone_number
    ).first()

    if not user:
        user = models.User(phone_number=phone_number, is_verified=True)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.is_verified:
        user.is_verified = True
        db.commit()
        db.refresh(user)

    token = jwt_utils.create_access_token({"sub": str(user.id)})

    return token