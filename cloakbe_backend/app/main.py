from fastapi import FastAPI

from app.controllers import auth_controller, terminal_controller, box_controller, order_controller
from app.database.db import engine
from app.database import models
import time
import secrets
import requests

app = FastAPI(title="Cloakbe Smart Locker System")
from fastapi.middleware.cors import CORSMiddleware


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Wide open for the local hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# CREATE DATABASE TABLES
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cloakbe backend MVP."}

app.include_router(auth_controller.router, prefix="/auth", tags=["Auth"])
app.include_router(terminal_controller.router, prefix="/terminals", tags=["Terminals"])
app.include_router(box_controller.router, prefix="/boxes", tags=["Boxes"])
app.include_router(order_controller.router, prefix="/orders", tags=["Orders"])