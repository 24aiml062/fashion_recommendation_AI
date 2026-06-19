from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import UserProfile
from app.schemas.schemas import UserProfileCreate, UserProfileResponse

router = APIRouter(tags=["Profile"])


def upsert_profile(db: Session, data: UserProfileCreate) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    if profile:
        for key, value in data.model_dump().items():
            setattr(profile, key, value)
    else:
        profile = UserProfile(id=1, **data.model_dump())
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/profile", response_model=UserProfileResponse, summary="Create or update user profile")
def create_profile(data: UserProfileCreate, db: Session = Depends(get_db)):
    return upsert_profile(db, data)


@router.put("/profile", response_model=UserProfileResponse, summary="Update user profile")
def update_profile(data: UserProfileCreate, db: Session = Depends(get_db)):
    return upsert_profile(db, data)


@router.get("/profile", response_model=UserProfileResponse, summary="Get user profile")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    if not profile:
        raise HTTPException(404, "Profile not found. Please create your profile first.")
    return profile
