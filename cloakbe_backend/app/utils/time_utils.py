import datetime

def get_current_time() -> datetime.datetime:
    return datetime.datetime.utcnow()

def get_otp_expiry_time() -> datetime.datetime:
    return get_current_time() + datetime.timedelta(minutes=5)
