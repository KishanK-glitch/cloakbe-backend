import datetime

from jose import jwt

from app.config import settings
from app.utils.time_utils import get_current_time


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = get_current_time() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt