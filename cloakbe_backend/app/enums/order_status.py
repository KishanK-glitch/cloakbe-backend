import enum

class OrderStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    RESERVED = "RESERVED"
    READY_FOR_PICKUP = "READY_FOR_PICKUP"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"
