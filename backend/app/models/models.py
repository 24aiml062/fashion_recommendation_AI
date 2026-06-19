from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base


class UserProfile(Base):
    __tablename__ = "user_profile"
    id = Column(Integer, primary_key=True, index=True, default=1)
    name = Column(String)
    gender = Column(String)
    style_preference = Column(String)   # Casual | Formal | Streetwear | Minimalist | Ethnic
    budget = Column(Float)
    favorite_colors = Column(String)    # comma-separated e.g. "Black,White,Navy"


class UserBodyProfile(Base):
    __tablename__ = "user_body_profile"
    id = Column(Integer, primary_key=True, index=True, default=1)
    body_type = Column(String)          # Slim | Average | Athletic | Curvy | Plus-size
    skin_tone = Column(String)          # Fair | Light | Medium | Tan | Dark
    hair_style = Column(String)         # Short Black | Long Brown | etc.


class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"
    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String)         # relative path e.g. "uploads/shirt_1.jpg"
    category = Column(String)           # Top | Bottom | Footwear | Accessory | Other
    item_name = Column(String)
    color = Column(String)
    pattern = Column(String)            # Solid | Striped | Checkered | Floral | Printed | Other
    style = Column(String)              # Casual | Formal | Ethnic | Streetwear | etc.
