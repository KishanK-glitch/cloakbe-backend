from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import models
from app.database.db import get_db
from app.schemas.terminal_schema import TerminalResponse, TerminalLayoutResponse

router = APIRouter()

@router.get("", response_model=List[TerminalResponse])
def get_terminals(db: Session = Depends(get_db)):
    terminals = db.query(models.Terminal).all()
    return terminals

@router.get("/{terminal_id}/layout", response_model=TerminalLayoutResponse)
def get_terminal_layout(terminal_id: int, db: Session = Depends(get_db)):
    terminal = db.query(models.Terminal).filter(models.Terminal.id == terminal_id).first()
    if not terminal:
        raise HTTPException(status_code=404, detail="Terminal not found")
    
    boxes = db.query(models.Box).filter(models.Box.terminal_id == terminal_id).all()
    
    return TerminalLayoutResponse(
        terminal=terminal,
        boxes=boxes
    )
