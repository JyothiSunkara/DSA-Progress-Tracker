from fastapi import FastAPI
from app.database.database import Base, engine

from app.models import user_model
from app.models import topic_model
from app.routers import user_router

app = FastAPI(title="DSA_Progress_Tracker API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"Message" : "DSA Progress Tracker API running 🚀"}

app.include_router(user_router.router)
