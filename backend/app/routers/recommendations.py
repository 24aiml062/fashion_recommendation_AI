from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import UserProfile, UserBodyProfile
from app.schemas.schemas import (
    RecommendationRequest, RecommendationResponse,
    WardrobeItemSchema, OutfitSlots, AvatarConfig
)
from app.services import wardrobe_service
from app.services.gemini_service import recommend_outfit
from app.services.avatar_service import get_avatar_config

router = APIRouter(tags=["Recommendations"])


@router.post("/recommend-outfit", response_model=RecommendationResponse,
             summary="Generate an AI outfit recommendation")
def recommend(request: RecommendationRequest, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    if not profile:
        raise HTTPException(400, "Please complete your profile before getting recommendations.")

    body_profile = db.query(UserBodyProfile).filter(UserBodyProfile.id == 1).first()
    if not body_profile:
        raise HTTPException(400, "Please complete body analysis before getting recommendations.")

    raw_items = wardrobe_service.get_all_wardrobe_items_raw(db)
    if not raw_items:
        raise HTTPException(400, "Your wardrobe is empty. Please upload clothing items first.")

    # Convert ORM objects → Pydantic schemas before passing to Gemini.
    # This is the ONLY place this conversion happens — do not add a second
    # call site that passes raw ORM objects into recommend_outfit().
    pydantic_items = [WardrobeItemSchema.model_validate(item) for item in raw_items]

    try:
        result = recommend_outfit(pydantic_items, profile, body_profile,
                                  request.occasion, request.weather)
    except RuntimeError:
        raise HTTPException(503, "AI service is currently unavailable. Please try again.")

    if "error" in result:
        raise HTTPException(503, "AI service is currently unavailable. Please try again.")

    avatar_config = get_avatar_config(body_profile.body_type,
                                      body_profile.skin_tone,
                                      body_profile.hair_style)

    outfit_data = result.get("outfit", {})
    return RecommendationResponse(
        outfit=OutfitSlots(
            top=outfit_data.get("top"),
            bottom=outfit_data.get("bottom"),
            footwear=outfit_data.get("footwear"),
            accessory=outfit_data.get("accessory"),
        ),
        missing_items=result.get("missing_items", []),
        explanation=result.get("explanation", []),
        avatar=AvatarConfig(
            body_type=avatar_config["body_type"],
            skin_tone=body_profile.skin_tone,
            hair_style=body_profile.hair_style,
        ),
    )
