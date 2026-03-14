from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import time

from app.database.db import get_db
from app.schemas.order_schema import PickupRequest, BoxSelectRequest, OrderResponse
from app.services.pickup_service import process_pickup
from app.services.allocation_service import allocate_box
from app.services.pricing_service import calculate_final_price
from app.database import models
from app.enums.order_status import OrderStatus
from app.enums.box_status import BoxStatus
from app.controllers.auth_controller import otp_store


class RecoverOrderRequest(BaseModel):
    phone_number: str
    otp: str

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

@router.get("/validate")
def validate_pickup_code(pickup_code: str, db: Session = Depends(get_db)):
    try:
        order = db.query(models.Order).filter(models.Order.pickup_code == pickup_code).first()
        if not order:
            raise HTTPException(status_code=404, detail="Invalid pickup code")
        
        if order.status != OrderStatus.ACTIVE.value:
            raise HTTPException(status_code=400, detail="Order not active")
        
        # Calculate current price
        box = db.query(models.Box).filter(models.Box.id == order.box_id).first()
        current_price = calculate_final_price(box.box_type, order.start_time, order.end_time)
        current_price = max(20, current_price)  # Minimum ₹20
        
        return {
            "order_id": order.id,
            "locker_id": box.identifier if box else "Unknown",
            "price": current_price
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recover")
def recover_order(request: RecoverOrderRequest, db: Session = Depends(get_db)):
    try:
        phone = request.phone_number
        otp = request.otp

        if phone not in otp_store:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        record = otp_store[phone]
        if time.time() - record["time"] > 300:
            del otp_store[phone]
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        if record["otp"] != otp:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        # consume OTP once verified
        del otp_store[phone]

        user = db.query(models.User).filter(models.User.phone_number == phone).first()
        if not user:
            raise HTTPException(status_code=404, detail="No active bookings found for this number.")

        order = (
            db.query(models.Order)
            .filter(models.Order.user_id == user.id, models.Order.status == OrderStatus.ACTIVE.value)
            .order_by(models.Order.start_time.desc())
            .first()
        )

        if not order:
            raise HTTPException(status_code=404, detail="No active bookings found for this number.")

        box = db.query(models.Box).filter(models.Box.id == order.box_id).first()
        price = calculate_final_price(box.box_type, order.start_time, order.end_time)
        price = max(20, price)

        return {
            "order_id": order.id,
            "price": price,
            "locker_id": box.identifier if box else "Unknown",
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{order_id}/complete")
def complete_order(order_id: int, db: Session = Depends(get_db)):
    try:
        order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if order.status != OrderStatus.ACTIVE.value:
            raise HTTPException(status_code=400, detail="Order not active")
        
        # Calculate final price
        box = db.query(models.Box).filter(models.Box.id == order.box_id).first()
        final_price = calculate_final_price(box.box_type, order.start_time, order.end_time)
        final_price = max(20, final_price)  # Minimum ₹20
        
        # Update order
        order.price = final_price
        order.status = OrderStatus.COMPLETED.value
        
        # Update box
        box.status = BoxStatus.EMPTY_CLOSED.value
        
        db.commit()
        
        # Mock hardware unlock
        print(f"[HARDWARE MOCK] Box {box.identifier} UNLOCKED for Pickup")
        
        return {"message": "Order completed", "final_price": final_price}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/active-by-phone")
def get_active_order_by_phone(request: RecoverOrderRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(models.User).filter(models.User.phone_number == request.phone_number).first()
        if not user:
            raise HTTPException(status_code=404, detail="No active bookings found for this number.")

        order = (
            db.query(models.Order)
            .filter(models.Order.user_id == user.id, models.Order.status == OrderStatus.ACTIVE.value)
            .order_by(models.Order.start_time.desc())
            .first()
        )

        if not order:
            raise HTTPException(status_code=404, detail="No active bookings found for this number.")

        box = db.query(models.Box).filter(models.Box.id == order.box_id).first()
        price = calculate_final_price(box.box_type, order.start_time, order.end_time)
        price = max(20, price)

        return {
            "order_id": order.id,
            "price": price,
            "locker_id": box.identifier if box else "Unknown",
        }
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
