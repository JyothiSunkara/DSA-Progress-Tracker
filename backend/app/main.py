from fastapi import FastAPI
from app.database.database import Base, engine

from app.utils.seed_data import seed_topics
from app.models import user_model, topic_model, problem_model, attempt_model
from app.routers import topic_router, problem_router, attempt_router, analytics_router, auth_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="DSA_Progress_Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
seed_topics()

@app.get("/")
def root():
    return {"Message" : "DSA Progress Tracker API running 🚀"}

app.include_router(topic_router.router)
app.include_router(problem_router.router)
app.include_router(attempt_router.router)
app.include_router(analytics_router.router)
app.include_router(auth_router.router)

