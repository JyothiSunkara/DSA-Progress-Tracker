from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.problem_model import Problem
from app.models.user_model import User
from app.schemas.problem_schema import ProblemCreate, ProblemResponse
from app.utils.auth import get_current_user


router = APIRouter(prefix="/problems", tags=["Problems"])

@router.post("/", response_model=ProblemResponse)
def create_problem(
    problem: ProblemCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    new_problem = Problem(
        title = problem.title,
        difficulty = problem.difficulty,
        link = problem.link,
        topic_id = problem.topic_id,
        user_id=current_user.id
    )

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    return new_problem

@router.get("/", response_model=list[ProblemResponse])
def get_problems(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Problem).filter(
        Problem.user_id == current_user.id
    ).all()

@router.put("/{problem_id}/toggle")
def toggle_problem_status(
    problem_id: int,
    db: Session = Depends(get_db),
):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    problem.is_solved = not problem.is_solved

    db.commit()
    db.refresh(problem)

    return problem