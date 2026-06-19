from pydantic import BaseModel
from typing import Optional, List


# ── User Profile ──────────────────────────────────────────────
class UserProfileCreate(BaseModel):
    name: str
    gender: str
    style_preference: str
    budget: float
    favorite_colors: str


class UserProfileResponse(BaseModel):
    id: int
    name: str
    gender: str
    style_preference: str
    budget: float
    favorite_colors: str

    class Config:
        from_attributes = True


# ── Body Profile ──────────────────────────────────────────────
class UserBodyProfileResponse(BaseModel):
    id: int
    body_type: str
    skin_tone: str
    hair_style: str

    class Config:
        from_attributes = True


# ── Wardrobe ──────────────────────────────────────────────────
class WardrobeItemResponse(BaseModel):
    id: int
    image_url: str
    category: str
    item_name: str
    color: str
    pattern: str
    style: str

    class Config:
        from_attributes = True


class WardrobeItemSchema(BaseModel):
    """Lightweight schema passed to Gemini recommend_outfit — has .model_dump()"""
    id: int
    category: str
    item_name: str
    color: str
    pattern: str
    style: str

    class Config:
        from_attributes = True


class WardrobeItemUpdate(BaseModel):
    """All fields optional — partial update for PUT /wardrobe/{id}"""
    category: Optional[str] = None
    item_name: Optional[str] = None
    color: Optional[str] = None
    pattern: Optional[str] = None
    style: Optional[str] = None


class WardrobeGroupedResponse(BaseModel):
    tops: List[WardrobeItemResponse]
    bottoms: List[WardrobeItemResponse]
    footwear: List[WardrobeItemResponse]
    accessories: List[WardrobeItemResponse]
    other: List[WardrobeItemResponse]   # NEW: fallback bucket, see patch notes


# ── Recommendations ───────────────────────────────────────────
class RecommendationRequest(BaseModel):
    occasion: str   # College | Wedding | Party | Interview | Office | Vacation
    weather: str    # Hot | Moderate | Cold


class OutfitSlots(BaseModel):
    top: Optional[str] = None
    bottom: Optional[str] = None
    footwear: Optional[str] = None
    accessory: Optional[str] = None


class AvatarConfig(BaseModel):
    body_type: str
    skin_tone: str
    hair_style: str


class RecommendationResponse(BaseModel):
    outfit: OutfitSlots
    missing_items: List[str]
    explanation: List[str]
    avatar: AvatarConfig
