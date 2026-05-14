from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    link = Column(String, nullable=False)
    is_solved = Column(Boolean, default=False)

    topic_id = Column(Integer, ForeignKey("topics.id")) 
    topic = relationship("Topic")

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")