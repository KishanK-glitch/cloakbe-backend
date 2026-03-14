import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cloakbe.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_for_hackathon")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

settings = Config()