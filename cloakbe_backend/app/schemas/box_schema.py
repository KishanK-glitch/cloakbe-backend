from pydantic import BaseModel

class BoxResponse(BaseModel):
    id: int
    terminal_id: int
    identifier: str
    box_type: str
    status: str

    model_config = {"from_attributes": True}
