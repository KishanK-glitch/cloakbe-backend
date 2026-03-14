from pydantic import BaseModel
from typing import List
from app.schemas.box_schema import BoxResponse

class TerminalResponse(BaseModel):
    id: int
    name: str
    location: str
    layout_rows: int
    layout_cols: int
    status: str

    model_config = {"from_attributes": True}

class TerminalLayoutResponse(BaseModel):
    terminal: TerminalResponse
    boxes: List[BoxResponse]

    model_config = {"from_attributes": True}
