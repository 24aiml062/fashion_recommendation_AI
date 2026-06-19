from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database.database import Base, engine

# Import models before create_all so SQLAlchemy knows about all tables
import app.models.models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Fashion Copilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from app.routers import profile, body_analysis, wardrobe, recommendations
app.include_router(profile.router)
app.include_router(body_analysis.router)
app.include_router(wardrobe.router)
app.include_router(recommendations.router)
