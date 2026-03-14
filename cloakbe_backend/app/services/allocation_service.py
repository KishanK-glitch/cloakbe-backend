from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from fastapi import HTTPException
from app.database import models
from app.enums.box_status import BoxStatus
from app.enums.order_status import OrderStatus
from app.utils.time_utils import get_current_time
import datetime
import random
import string
from app.services import pricing_service
from app.utils.notification_mock import NotificationMock

def generate_pickup_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def allocate_box(db: Session, user_id: int, terminal_id: int, box_id: int, duration_hours: int) -> models.Order:
    try:
        # Enforce an immediate write lock on SQLite to prevent race conditions during box allocation
        try:
            db.execute(text("BEGIN IMMEDIATE"))
        except OperationalError:
            # If DB is locked by another immediate transaction, return 409
            db.rollback()
            raise HTTPException(status_code=409, detail="Box was just taken")
        
        box = db.query(models.Box).filter(models.Box.id == box_id).first()
        
        if not box:
            raise HTTPException(status_code=404, detail="Box not found")
            
        if box.terminal_id != terminal_id:
            raise HTTPException(status_code=400, detail="Box does not belong to specified terminal")

        if box.status != BoxStatus.EMPTY_CLOSED.value:
            # 409 Conflict when box is literally not available immediately upon selection
            raise HTTPException(status_code=409, detail="Box was just taken")

        box.status = BoxStatus.BOOKED.value

        price = pricing_service.calculate_initial_price(box.box_type, duration_hours)

        pickup_code = generate_pickup_code()
        
        start_time = get_current_time()
        end_time = start_time + datetime.timedelta(hours=duration_hours)
        
        order = models.Order(
            user_id=user_id,
            box_id=box_id,
            terminal_id=terminal_id,
            start_time=start_time,
            end_time=end_time,
            pickup_code=pickup_code,
            price=price,
            status=OrderStatus.RESERVED.value
        )
        
        db.add(order)
        db.commit()
        db.refresh(order)
        
        # User and Terminal lookup for exact SMS formatting
        user = db.query(models.User).filter(models.User.id == user_id).first()
        terminal = db.query(models.Terminal).filter(models.Terminal.id == terminal_id).first()
        
        phone = user.phone_number if user else "Unknown Phone"
        location = terminal.location if terminal else "Unknown Location"
        
        # Exact SMS Simulation format required by PRD via NotificationMock
        NotificationMock.send_order_confirmation(
            phone=phone,
            order_id=order.id,
            box_name=box.identifier,
            access_code=order.pickup_code,
            terminal_location=location
        )
        
        return order
        
    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise e
