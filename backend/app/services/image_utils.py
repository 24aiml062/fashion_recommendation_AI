from fastapi import UploadFile, HTTPException
from PIL import Image
import io, uuid, os

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


async def validate_and_save_image(file: UploadFile) -> str:
    """Validate, resize, and save image. Returns relative path e.g. 'uploads/abc.jpg'."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only JPG, PNG, and WebP images are allowed.")

    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(400, "Image must be under 5MB.")

    try:
        img = Image.open(io.BytesIO(contents))
        img.verify()                       # PATCH: reject corrupt/non-image payloads early
        img = Image.open(io.BytesIO(contents))  # re-open after verify() invalidates the handle
    except Exception:
        raise HTTPException(400, "The uploaded file is not a valid image.")

    img = img.convert("RGB")               # PATCH: handles PNG/WebP with alpha channel before JPEG save
    img.thumbnail((1024, 1024), Image.LANCZOS)

    filename = f"{uuid.uuid4().hex}.jpg"
    save_path = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    img.save(save_path, "JPEG", quality=85)

    return save_path
