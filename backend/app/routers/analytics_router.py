from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, Integer

from app.database.dependencies import get_db
from app.models.attempt_model import Attempt
from app.models.problem_model import Problem
from app.models.topic_model import Topic

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# weak topics
@router.get("/weak-topics")
def get_weak_topics(db: Session = Depends(get_db)):
    
    results = (
        db.query(
            Topic.name,
            func.count(Attempt.id).label("total"),
            func.sum(func.cast(Attempt.is_solved, Integer)).label("solved")
        )
        .join(Problem, Problem.topic_id == Topic.id)
        .join(Attempt, Attempt.problem_id == Problem.id)
        .group_by(Topic.name)
        .all()
    )

    output = []

    for topic, total, solved in results:
        accuracy = (solved / total) * 100 if total > 0 else 0

        if accuracy < 60:
            output.append({
                "topic": topic,
                "accuracy": round(accuracy, 2)
            })

    return output

#strong topics
@router.get("/strong-topics")
def get_strong_topics(db: Session = Depends(get_db)):

    results = (
        db.query(
            Topic.name,
            func.count(Attempt.id).label("total"),
            func.sum(func.cast(Attempt.is_solved, Integer)).label("solved")
        )
        .join(Problem, Problem.topic_id == Topic.id)
        .join(Attempt, Attempt.problem_id == Problem.id)
        .group_by(Topic.id, Topic.name)
        .all()
    )

    output = []
    for topic, total, solved in results:
        accuracy = (solved / total) * 100 if total > 0 else 0

        if accuracy >= 60:
            output.append(
                {
                    "topic" : topic,
                    "accuracy" : round(accuracy, 2)
                }
            )

        #key difference
    output.sort(key=lambda x: x["accuracy"], reverse=True)
    return output
    

# overall stats
@router.get("/overall-stats")
def get_overall_stats(db: Session = Depends(get_db)):
    
    total_attempts = db.query(Attempt).count()

    total_solved = db.query(Attempt).filter(Attempt.is_solved == True).count()

    accuracy = (total_solved / total_attempts) * 100 if total_attempts > 0 else 0

    return {
        "total_attempts": total_attempts,
        "total_solved": total_solved,
        "accuracy": round(accuracy, 2)
    }

#recommendatations
@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    
    # Step 1: Calculate topic accuracy
    results = (
        db.query(
            Topic.id,
            Topic.name,
            func.count(Attempt.id).label("total"),
            func.sum(func.cast(Attempt.is_solved, Integer)).label("solved")
        )
        .join(Problem, Problem.topic_id == Topic.id)
        .join(Attempt, Attempt.problem_id == Problem.id)
        .group_by(Topic.id)
        .all()
    )

    topic_accuracy = []

    for topic_id, name, total, solved in results:
        accuracy = (solved / total) * 100 if total > 0 else 0

        topic_accuracy.append({
            "topic_id": topic_id,
            "name": name,
            "accuracy": accuracy
        })

    # Step 2: Sort by weakest topics
    topic_accuracy.sort(key=lambda x: x["accuracy"])

    # Step 3: Pick top 2 weak topics
    weak_topics = topic_accuracy[:2]

    recommendations = []

    solved_problem_ids = (
        db.query(Attempt.problem_id)
        .filter(Attempt.is_solved == True)
        .subquery()
    )

    for topic in weak_topics:
        problems = (
            db.query(Problem)
            .filter(Problem.topic_id == topic["topic_id"])
            .filter(~Problem.id.in_(solved_problem_ids))  # 🔥 exclude solved
            .limit(3)
            .all()
        )

        for problem in problems:
            recommendations.append({
                "title": problem.title,
                "topic": topic["name"],
                "difficulty": problem.difficulty
            })

    return recommendations