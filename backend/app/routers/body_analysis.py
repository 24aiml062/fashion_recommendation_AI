from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import UserBodyProfile
from app.schemas.schemas import UserBodyProfileResponse
from app.services.gemini_service import analyze_body
from app.services.image_utils import validate_and_save_image

router = APIRouter(tags=["Body Analysis"])


@router.post("/analyze-user", response_model=UserBodyProfileResponse,
             summary="Upload selfie and analyze body profile")
async def analyze_user(file: UploadFile = File(...), db: Session = Depends(get_db)):
    image_path = await validate_and_save_image(file)

    try:
        result = analyze_body(image_path)
    except RuntimeError as e:
        import logging
        logging.getLogger("body_analysis").error("Gemini error: %s", str(e))
        raise HTTPException(503, f"AI service error: {str(e)}")

    if "error" in result:
        raise HTTPException(503, "AI service is currently unavailable. Please try again.")

    profile = db.query(UserBodyProfile).filter(UserBodyProfile.id == 1).first()
    if profile:
        profile.body_type = result.get("body_type", "Average")
        profile.skin_tone = result.get("skin_tone", "Medium")
        profile.hair_style = result.get("hair_style", "Short Hair")
    else:
        profile = UserBodyProfile(
            id=1,
            body_type=result.get("body_type", "Average"),
            skin_tone=result.get("skin_tone", "Medium"),
            hair_style=result.get("hair_style", "Short Hair"),
        )
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/body-profile", response_model=UserBodyProfileResponse,
            summary="Get stored body profile")
def get_body_profile(db: Session = Depends(get_db)):
    profile = db.query(UserBodyProfile).filter(UserBodyProfile.id == 1).first()
    if not profile:
        raise HTTPException(404, "Body profile not found. Please complete body analysis first.")
    return profile
