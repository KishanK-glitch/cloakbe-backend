from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.order_schema import BoxSelectRequest, OrderResponse
from app.services.allocation_service import allocate_box

router = APIRouter()

@router.post("/select", response_model=OrderResponse)
def select_box(request: BoxSelectRequest, db: Session = Depends(get_db)):
    try:
        order = allocate_box(
            db=db,
            user_id=request.user_id,
            terminal_id=request.terminal_id,
            box_id=request.box_id,
            duration_hours=request.duration_hours
        )
        return order
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
