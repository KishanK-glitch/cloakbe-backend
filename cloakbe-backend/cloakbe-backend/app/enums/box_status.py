import enum

class BoxStatus(str, enum.Enum):
    EMPTY_CLOSED = "EMPTY_CLOSED"
    BOOKED = "BOOKED"
    OCCUPIED = "OCCUPIED"
    OUT_OF_SERVICE = "OUT_OF_SERVICE"
