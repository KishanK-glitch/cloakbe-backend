from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database import models
from app.enums.box_status import BoxStatus
from app.enums.order_status import OrderStatus

def process_pickup(db: Session, order_id: int, pickup_code: str) -> dict:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.pickup_code != pickup_code:
        raise HTTPException(status_code=400, detail="Invalid pickup code")
        
    if order.status == OrderStatus.COMPLETED.value:
        raise HTTPException(status_code=400, detail="Order already completed")
        
    print(f"Locker {order.box_id} opened successfully")
    
    order.status = OrderStatus.COMPLETED.value
    
    box = db.query(models.Box).filter(models.Box.id == order.box_id).first()
    if box:
        box.status = BoxStatus.EMPTY_CLOSED.value
        
    db.commit()
    return {"message": "Pickup successful, locker opened"}
