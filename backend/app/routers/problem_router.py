from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.problem_model import Problem
from app.schemas.problem_schema import ProblemCreate, ProblemResponse

router = APIRouter(prefix="/problems", tags=["Problems"])

@router.post("/", response_model=ProblemResponse)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    new_problem = Problem(
        title = problem.title,
        difficulty = problem.difficulty,
        link = problem.link,
        topic_id = problem.topic_id
    )

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    return new_problem

@router.get("/", response_model=list[ProblemResponse])
def get_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()