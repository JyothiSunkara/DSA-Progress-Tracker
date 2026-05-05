from fastapi import FastAPI
from app.database.database import Base, engine

from app.utils.seed_data import seed_topics
from app.models import user_model, topic_model, problem_model, attempt_model
from app.routers import user_router, topic_router, problem_router, attempt_router, analytics_router

app = FastAPI(title="DSA_Progress_Tracker API")

Base.metadata.create_all(bind=engine)
seed_topics()

@app.get("/")
def root():
    return {"Message" : "DSA Progress Tracker API running 🚀"}

app.include_router(user_router.router)
app.include_router(topic_router.router)
app.include_router(problem_router.router)
app.include_router(attempt_router.router)
app.include_router(analytics_router.router)

