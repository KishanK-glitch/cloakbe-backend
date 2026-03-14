from pydantic import BaseModel
import datetime

class BoxSelectRequest(BaseModel):
    user_id: int
    terminal_id: int
    box_id: int
    duration_hours: int

class PickupRequest(BaseModel):
    order_id: int
    pickup_code: str

class OrderResponse(BaseModel):
    id: int
    user_id: int
    box_id: int
    terminal_id: int
    start_time: datetime.datetime
    end_time: datetime.datetime
    pickup_code: str
    price: float
    status: str

    model_config = {"from_attributes": True}
