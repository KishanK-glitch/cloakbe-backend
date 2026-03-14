from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.order_schema import PickupRequest, BoxSelectRequest, OrderResponse
from app.services.pickup_service import process_pickup
from app.services.allocation_service import allocate_box

router = APIRouter()

@router.post("/create", response_model=OrderResponse)
def create_order(request: BoxSelectRequest, db: Session = Depends(get_db)):
    try:
        # Assuming JWT validation is done via dependencies in a real app or handled implicitly
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

@router.post("/pickup")
def pickup_order(request: PickupRequest, db: Session = Depends(get_db)):
    try:
        result = process_pickup(db, request.order_id, request.pickup_code)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
