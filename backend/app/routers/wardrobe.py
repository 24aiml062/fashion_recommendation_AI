from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.schemas import WardrobeItemResponse, WardrobeGroupedResponse, WardrobeItemUpdate
from app.services import wardrobe_service
from app.services.gemini_service import analyze_clothing
from app.services.image_utils import validate_and_save_image

router = APIRouter(tags=["Wardrobe"])


@router.post("/upload-clothing", response_model=List[WardrobeItemResponse],
             summary="Upload a clothing image — detects and saves all visible items")
async def upload_clothing(file: UploadFile = File(...), db: Session = Depends(get_db)):
    image_path = await validate_and_save_image(file)

    try:
        result = analyze_clothing(image_path)
    except RuntimeError as e:
        import logging
        logging.getLogger("wardrobe").error("Gemini error: %s", str(e))
        raise HTTPException(503, f"AI service error: {str(e)}")

    if "error" in result:
        raise HTTPException(503, "AI service is currently unavailable. Please try again.")

    items_data = result.get("items", [])
    if not items_data:
        raise HTTPException(503, "AI service is currently unavailable. Please try again.")

    # Save every detected item — all share the same uploaded image
    saved = []
    for item in items_data:
        saved.append(wardrobe_service.save_wardrobe_item(
            db=db,
            image_path=image_path,
            category=item.get("category", "Other"),
            item_name=item.get("item_name", "Unknown Item"),
            color=item.get("color", "Unknown"),
            pattern=item.get("pattern", "Solid"),
            style=item.get("style", "Casual"),
        ))

    return saved


@router.get("/wardrobe", response_model=WardrobeGroupedResponse,
            summary="Get all wardrobe items grouped by category")
def get_wardrobe(db: Session = Depends(get_db)):
    return wardrobe_service.get_all_wardrobe_items(db)


@router.put("/wardrobe/{item_id}", response_model=WardrobeItemResponse,
            summary="Edit a wardrobe item's details (e.g. fix a misclassified category)")
def edit_wardrobe_item(item_id: int, data: WardrobeItemUpdate, db: Session = Depends(get_db)):
    """PATCH: new endpoint. Lets a user correct an AI misclassification without
    deleting and re-uploading the photo."""
    updated = wardrobe_service.update_wardrobe_item(
        db, item_id, data.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(404, "Wardrobe item not found.")
    return updated


@router.delete("/wardrobe/{item_id}", summary="Delete a wardrobe item by ID")
def delete_wardrobe_item(item_id: int, db: Session = Depends(get_db)):
    deleted = wardrobe_service.delete_wardrobe_item(db, item_id)
    if not deleted:
        raise HTTPException(404, "Wardrobe item not found.")
    return {"message": "Item deleted successfully."}
