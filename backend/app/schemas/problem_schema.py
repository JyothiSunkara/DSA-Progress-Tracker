from pydantic import BaseModel
from typing import Optional

class ProblemCreate(BaseModel):
    title : str
    difficulty : str
    link : Optional[str] = None
    topic_id : int

class ProblemResponse(BaseModel):
    id : int
    title : str
    difficulty : str
    link : Optional[str]
    topic_id : int
    is_solved: bool
    
    class Config:
        from_attributes = True