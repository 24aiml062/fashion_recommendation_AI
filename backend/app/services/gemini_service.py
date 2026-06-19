from google import genai
from google.genai import types
import os
import json
import re
import logging
import PIL.Image
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger("gemini_service")

# New SDK: create a client, not a module-level configure call
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.5-flash"

VALID_CATEGORIES = {"Top", "Bottom", "Footwear", "Accessory"}


def load_image(image_path: str) -> PIL.Image.Image:
    return PIL.Image.open(image_path)


def safe_parse(response_text: str) -> dict:
    """
    Strip markdown fences from both ends before JSON parsing.
    Tolerates trailing/leading newlines and whitespace around the fence.
    """
    try:
        text = response_text.strip()
        text = re.sub(r"^```(?:json)?\s*\n?", "", text)
        text = re.sub(r"\n?\s*```\s*$", "", text)
        return json.loads(text.strip())
    except Exception:
        logger.warning("Failed to parse Gemini response as JSON: %r", response_text[:500])
        return {"error": "Failed to parse AI response", "raw": response_text}


def normalize_category(category: str) -> str:
    """
    Normalises Gemini's category output to the expected enum.
    Falls back to "Other" instead of silently losing the item.
    """
    if not category:
        return "Other"
    normalized = category.strip().capitalize()
    return normalized if normalized in VALID_CATEGORIES else "Other"


# Retry up to 3 times with exponential backoff (covers 429 rate limits & transient errors)
gemini_retry = retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(Exception),
    reraise=True,
)


@gemini_retry
def _generate_text(prompt: str) -> str:
    """Call Gemini with a text-only prompt."""
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )
    return response.text


@gemini_retry
def _generate_with_image(prompt: str, img: PIL.Image.Image) -> str:
    """Call Gemini with a text prompt + PIL image."""
    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt, img],
    )
    return response.text


def analyze_clothing(image_path: str) -> dict:
    try:
        img = load_image(image_path)
        prompt = (
            "Analyze this image carefully. It may contain one or multiple clothing items or a full outfit on a person.\n"
            "Identify EVERY distinct clothing item visible: tops, bottoms, jackets, outerwear, footwear, accessories.\n"
            "Return ONLY a valid JSON object with exactly this structure:\n"
            '{\n'
            '  "items": [\n'
            '    {\n'
            '      "category": "Top" | "Bottom" | "Footwear" | "Accessory",\n'
            '      "item_name": "descriptive name e.g. Blue Denim Jacket",\n'
            '      "color": "primary color",\n'
            '      "pattern": "Solid" | "Striped" | "Checkered" | "Floral" | "Printed" | "Other",\n'
            '      "style": "Casual" | "Formal" | "Ethnic" | "Streetwear" | "Minimalist" | "Sportswear"\n'
            '    }\n'
            '  ]\n'
            '}\n'
            "Rules:\n"
            "- A jacket or outerwear worn open over a top counts as a separate Top item.\n"
            "- Include ALL visible items — do not skip bottoms, shoes, or layered pieces.\n"
            "- If only one item is visible, return an array with one object.\n"
            "Do not include any explanation, markdown, or code fences. Return raw JSON only."
        )
        text = _generate_with_image(prompt, img)
        result = safe_parse(text)

        # Normalise categories in all items
        if "items" in result and isinstance(result["items"], list):
            for item in result["items"]:
                if "category" in item:
                    item["category"] = normalize_category(item["category"])
            return result

        # Fallback: if Gemini returned the old single-item shape, wrap it
        if "category" in result:
            result["category"] = normalize_category(result["category"])
            return {"items": [result]}

        return {"error": "Unexpected response shape", "raw": text}

    except Exception as e:
        raise RuntimeError(f"Gemini clothing analysis failed: {str(e)}")


def analyze_body(image_path: str) -> dict:
    try:
        img = load_image(image_path)
        prompt = (
            "Analyze the person in this image. "
            "Return ONLY a valid JSON object with exactly these keys:\n"
            '{\n'
            '  "body_type": "Slim" | "Average" | "Athletic" | "Curvy" | "Plus-size",\n'
            '  "skin_tone": "Fair" | "Light" | "Medium" | "Tan" | "Dark",\n'
            '  "hair_style": "short description e.g. Short Black Hair, Long Wavy Brown Hair"\n'
            '}\n'
            "Do not include any explanation, markdown, or code fences. Return raw JSON only."
        )
        text = _generate_with_image(prompt, img)
        return safe_parse(text)
    except Exception as e:
        raise RuntimeError(f"Gemini body analysis failed: {str(e)}")


def recommend_outfit(
    wardrobe_items: list,
    profile,
    body_profile,
    occasion: str,
    weather: str,
) -> dict:
    """
    wardrobe_items: list of WardrobeItemSchema instances (Pydantic, not ORM).
    Call WardrobeItemSchema.model_validate(orm_item) before passing here.
    """
    try:
        items_json = json.dumps([item.model_dump() for item in wardrobe_items], indent=2)
        prompt = f"""You are a professional fashion stylist AI.

User Profile:
- Gender: {profile.gender}
- Style Preference: {profile.style_preference}
- Favorite Colors: {profile.favorite_colors}
- Budget: {profile.budget}

Body Profile:
- Body Type: {body_profile.body_type}
- Skin Tone: {body_profile.skin_tone}

Occasion: {occasion}
Weather: {weather}

Available Wardrobe Items:
{items_json}

Task:
1. Select the best outfit from the available wardrobe items only.
2. Identify any missing items that would improve the outfit.
3. Provide a clear explanation of why you chose this outfit.

Return ONLY a valid JSON object with exactly these keys:
{{
  "outfit": {{
    "top": "item name or null",
    "bottom": "item name or null",
    "footwear": "item name or null",
    "accessory": "item name or null"
  }},
  "missing_items": ["item 1", "item 2"],
  "explanation": ["reason 1", "reason 2", "reason 3"]
}}
Do not include any explanation outside the JSON. Return raw JSON only."""
        text = _generate_text(prompt)
        return safe_parse(text)
    except Exception as e:
        raise RuntimeError(f"Gemini outfit recommendation failed: {str(e)}")
