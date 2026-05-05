from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.dependencies import get_db
from app.models.topic_model import Topic
from app.schemas.topic_schema import TopicCreate, TopicResponse

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.post("/", response_model=TopicResponse)
def create_topic(topic: TopicCreate, db: Session = Depends(get_db)):
    new_topic = Topic(name=topic.name)

    try:
        db.add(new_topic)
        db.commit()
        db.refresh(new_topic)
        return new_topic
    
    except IntegrityError:
        db.rollback()
        raise HTTPException(staus_code=400, detail="Topic already exists!")
    

@router.get("/", response_model=list[TopicResponse])
def get_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()