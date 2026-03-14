import datetime
from app.utils.time_utils import get_current_time

RATES = {
    "SMALL": 50,
    "MEDIUM": 80,
    "LARGE": 120
}

OVERTIME_PENALTY_PER_HOUR = 20

def calculate_initial_price(box_type: str, duration_hours: int) -> float:
    rate = RATES.get(box_type.upper(), 50)
    return float(rate * duration_hours)

def calculate_overtime_penalty(end_time: datetime.datetime, current_time: datetime.datetime = None) -> float:
    if current_time is None:
        current_time = get_current_time()
        
    if current_time <= end_time:
        return 0.0
        
    overtime_duration = current_time - end_time
    overtime_hours = overtime_duration.total_seconds() / 3600.0
    
    import math
    return float(math.ceil(overtime_hours) * OVERTIME_PENALTY_PER_HOUR)

def get_final_price(initial_price: float, end_time: datetime.datetime) -> float:
    penalty = calculate_overtime_penalty(end_time)
    return initial_price + penalty
