def get_avatar_config(body_type: str, skin_tone: str, hair_style: str) -> dict:
    skin_colors = {
        "Fair": "#FDDBB4",
        "Light": "#F5C89A",
        "Medium": "#D4956A",
        "Tan": "#B07842",
        "Dark": "#6B3F2A"
    }
    return {
        "body_type": body_type.lower().replace("-", "_"),   # e.g. "plus_size"
        "skin_color": skin_colors.get(skin_tone, "#D4956A"),
        "hair_style": hair_style.lower()
    }
