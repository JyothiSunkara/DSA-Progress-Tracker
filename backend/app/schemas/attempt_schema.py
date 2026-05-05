from pydantic import BaseModel
from datetime import datetime

class AttemptCreate(BaseModel):
    user_id: int
    problem_id: int
    is_solved: bool
    time_taken: int

class AttemptResponse(BaseModel):
    id: int
    user_id: int
    problem_id: int
    is_solved: bool
    time_taken: int
    attempted_at: datetime

    class config:
        from_attributes = True