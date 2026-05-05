from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.attempt_model import Attempt
from app.schemas.attempt_schema import AttemptCreate, AttemptResponse

router = APIRouter(prefix="/attempts", tags=["Attempts"])

@router.post("/", response_model=AttemptResponse)
def create_attempt(attempt: AttemptCreate, db: Session = Depends(get_db)):
    new_attempt = Attempt(
        user_id = attempt.user_id,
        problem_id = attempt.problem_id,
        is_solved = attempt.is_solved,
        time_taken = attempt.time_taken
    )

    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    return new_attempt

@router.get("/", response_model=list[AttemptResponse])
def get_attempts(db: Session = Depends(get_db)):
    return db.query(Attempt).all()