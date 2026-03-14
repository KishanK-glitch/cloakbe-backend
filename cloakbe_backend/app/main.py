from fastapi import FastAPI

from app.controllers import auth_controller, terminal_controller, box_controller, order_controller
from app.database.db import engine
from app.database import models
import time
import secrets
import requests
from fastapi import HTTPException
from pydantic import BaseModel
from app.llm_service import ask_ai

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

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_with_ai(request: ChatRequest):
    try:
        response = ask_ai(request.message)
        return {"response": response}
    except Exception as e:
        print(f"LLM Error: {e}")
        return {"response": "System busy, please try again later."}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cloakbe backend MVP."}

app.include_router(auth_controller.router, prefix="/auth", tags=["Auth"])
app.include_router(terminal_controller.router, prefix="/terminals", tags=["Terminals"])
app.include_router(box_controller.router, prefix="/boxes", tags=["Boxes"])
app.include_router(order_controller.router, prefix="/orders", tags=["Orders"])