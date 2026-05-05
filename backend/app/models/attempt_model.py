from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime
from datetime import datetime
from app.database.database import Base

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index= True)

    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))

    is_solved = Column(Boolean, default=False)
    time_taken = Column(Integer) # in minutes

    attempted_at = Column(DateTime, default=datetime.utcnow)
