from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base
from app.models import User, Project, Site

from app.routes import auth,projects, sites


app = FastAPI(
    title="Darukaa.Earth API",
    description="Carbon and Biodiversity Project Management API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    projects.router,
    prefix="/api/projects",
    tags=["Projects"]
)
app.include_router(
    sites.router,
    prefix="/api",
    tags=["Sites"]
)

@app.get("/")
def root():
    return {
        "message": "Darukaa.Earth API is running"
    }


@app.get("/health")
def health():

    try:

        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:

        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }