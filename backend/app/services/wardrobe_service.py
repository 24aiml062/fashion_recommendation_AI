import os
from sqlalchemy.orm import Session
from app.models.models import WardrobeItem
from app.schemas.schemas import WardrobeItemResponse

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")  # PATCH: from env, not hardcoded


def build_image_url(image_path: str) -> str:
    """Convert relative path like 'uploads/abc.jpg' to full URL."""
    return f"{BASE_URL}/{image_path}"


def save_wardrobe_item(
    db: Session,
    image_path: str,
    category: str,
    item_name: str,
    color: str,
    pattern: str,
    style: str,
) -> WardrobeItemResponse:
    item = WardrobeItem(
        image_path=image_path,
        category=category,
        item_name=item_name,
        color=color,
        pattern=pattern,
        style=style,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return WardrobeItemResponse(
        id=item.id,
        image_url=build_image_url(item.image_path),
        category=item.category,
        item_name=item.item_name,
        color=item.color,
        pattern=item.pattern,
        style=item.style,
    )


def get_all_wardrobe_items(db: Session) -> dict:
    """Return items grouped by category. PATCH: unmapped categories go to 'other'
    instead of being silently dropped."""
    items = db.query(WardrobeItem).all()

    def to_response(item: WardrobeItem) -> WardrobeItemResponse:
        return WardrobeItemResponse(
            id=item.id,
            image_url=build_image_url(item.image_path),
            category=item.category,
            item_name=item.item_name,
            color=item.color,
            pattern=item.pattern,
            style=item.style,
        )

    category_map = {
        "Top": "tops",
        "Bottom": "bottoms",
        "Footwear": "footwear",
        "Accessory": "accessories",
    }

    grouped = {"tops": [], "bottoms": [], "footwear": [], "accessories": [], "other": []}
    for item in items:
        key = category_map.get(item.category, "other")   # PATCH: default to "other"
        grouped[key].append(to_response(item))
    return grouped


def update_wardrobe_item(db: Session, item_id: int, updates: dict) -> WardrobeItemResponse | None:
    """
    PATCH: new function supporting PUT /wardrobe/{id}.
    Allows correcting a misclassified item (e.g. Gemini tagged a hoodie as
    'Streetwear' but user wants 'Casual') without delete-and-reupload.
    `updates` is a dict of only the fields the user wants to change
    (from WardrobeItemUpdate.model_dump(exclude_unset=True)).
    """
    item = db.query(WardrobeItem).filter(WardrobeItem.id == item_id).first()
    if not item:
        return None
    for key, value in updates.items():
        if value is not None:
            setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return WardrobeItemResponse(
        id=item.id,
        image_url=build_image_url(item.image_path),
        category=item.category,
        item_name=item.item_name,
        color=item.color,
        pattern=item.pattern,
        style=item.style,
    )


def delete_wardrobe_item(db: Session, item_id: int) -> bool:
    """
    Delete item from DB and remove image file from disk.
    Returns True if deleted, False if not found.
    """
    item = db.query(WardrobeItem).filter(WardrobeItem.id == item_id).first()
    if not item:
        return False

    if item.image_path and os.path.exists(item.image_path):
        os.remove(item.image_path)

    db.delete(item)
    db.commit()
    return True


def get_all_wardrobe_items_raw(db: Session) -> list:
    """Return raw ORM objects — used internally for Gemini recommendation."""
    return db.query(WardrobeItem).all()
