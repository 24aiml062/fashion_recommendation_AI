# atelier. — AI Fashion Copilot

An AI-powered personal stylist web app. Upload your clothes, analyse your body type, and get outfit recommendations for any occasion — all powered by Google Gemini.

**Live demo:** https://fashion-recommendation-ai.vercel.app  
**API:** https://fashion-recommendation-ai.onrender.com/docs

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Environment Variables](#environment-variables)
5. [API Reference](#api-reference)
6. [Frontend Architecture](#frontend-architecture)
7. [Avatar System](#avatar-system)
8. [Deployment](#deployment)
9. [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| Database | SQLite via SQLAlchemy |
| AI | Google Gemini (`gemini-2.5-flash`) |
| Image storage | Local `/backend/uploads/` (Render persistent disk in production) |
| Frontend host | Vercel |
| Backend host | Render |

---

## Project Structure

```
ai-fashion-copilot/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── database.py          # SQLAlchemy engine + session + Base
│   │   ├── models/
│   │   │   └── models.py            # ORM models: UserProfile, UserBodyProfile, WardrobeItem
│   │   ├── schemas/
│   │   │   └── schemas.py           # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── profile.py           # GET/POST/PUT /profile
│   │   │   ├── body_analysis.py     # POST /analyze-user, GET /body-profile
│   │   │   ├── wardrobe.py          # POST /upload-clothing, GET/PUT/DELETE /wardrobe
│   │   │   └── recommendations.py  # POST /recommend-outfit
│   │   ├── services/
│   │   │   ├── gemini_service.py    # All Gemini API calls + retry logic
│   │   │   ├── wardrobe_service.py  # Wardrobe DB operations
│   │   │   ├── image_utils.py       # Image validation, resize, save
│   │   │   └── avatar_service.py    # Body type → avatar config mapping
│   │   └── main.py                  # FastAPI app, CORS, static files, router registration
│   ├── uploads/                     # Uploaded images (gitignored except .gitkeep)
│   ├── .env                         # Local secrets (gitignored)
│   ├── .env.example                 # Template for required env vars
│   ├── .python-version              # Pins Python 3.11.9 for Render
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js               # All Axios API calls
│   │   ├── components/
│   │   │   ├── Avatar.jsx           # SVG body-double avatar
│   │   │   ├── BottomNav.jsx        # 4-tab bottom navigation
│   │   │   ├── ClosetRail.jsx       # Horizontal scrollable garment rail
│   │   │   ├── ClothingCard.jsx     # Wardrobe item card (edit, delete, drag)
│   │   │   ├── MirrorPanel.jsx      # Glassmorphism fitting room panel
│   │   │   ├── MissingItemCard.jsx  # Sage wishlist callout
│   │   │   ├── OccasionChips.jsx    # Reusable chip row (occasion + filters)
│   │   │   ├── OutfitCard.jsx       # Outfit slot pills
│   │   │   ├── PullTray.jsx         # Drag-and-drop garment tray
│   │   │   ├── SeamDivider.jsx      # Dashed rust <hr> divider
│   │   │   ├── SwipeDeck.jsx        # Tinder-style outfit swipe deck
│   │   │   └── WhyFitCard.jsx       # Numbered explanation list
│   │   ├── context/
│   │   │   └── AppDataContext.jsx   # Global profile/bodyProfile/wardrobe state
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with step navigator
│   │   │   ├── Profile.jsx          # User profile form
│   │   │   ├── BodyAnalysis.jsx     # Selfie upload + avatar preview
│   │   │   ├── Wardrobe.jsx         # Closet grid + pull tray
│   │   │   ├── Recommendations.jsx  # Occasion picker + fitting room result
│   │   │   └── Discover.jsx         # Swipe deck of outfit suggestions
│   │   ├── App.jsx                  # Router + Toaster + AppDataProvider
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind base + hide-scrollbar utility
│   ├── .env.local                   # Local frontend env (VITE_API_URL not set = use proxy)
│   ├── vercel.json                  # Vercel build config + SPA rewrite rule
│   ├── vite.config.js               # Vite + dev proxy to localhost:8000
│   ├── tailwind.config.js           # Atelier design tokens + custom animations
│   └── package.json
├── render.yaml                      # Render service definition
├── .gitignore
└── README.md
```

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Google Gemini API key — get one free at https://aistudio.google.com/app/apikey

### 1. Clone the repo

```bash
git clone https://github.com/24aiml062/fashion_recommendation_AI.git
cd fashion_recommendation_AI
```

### 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
```

Copy the env template and fill in your key:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```
GEMINI_API_KEY=AIzaSy...your_key_here
BASE_URL=http://localhost:8000
```

Start the backend (must be run from inside `backend/`):

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: http://localhost:5173

The Vite dev proxy automatically forwards all `/api/*` requests to `http://localhost:8000`, so no frontend env vars are needed locally.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `BASE_URL` | Yes | Full URL of this backend (used to build image URLs) |
| `CORS_ORIGINS` | No | Comma-separated list of allowed frontend origins. Defaults to `http://localhost:5173,http://localhost:3000` |

### Frontend (Vercel environment / `.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Production only | Full backend URL e.g. `https://fashion-recommendation-ai.onrender.com`. Omit in local dev — the Vite proxy handles it. |

---

## API Reference

All endpoints are prefixed with `/` (no prefix). In local dev the Vite proxy maps `/api/*` → `/*` on the backend.

### Profile

| Method | Path | Description |
|---|---|---|
| `GET` | `/profile` | Get saved profile |
| `POST` | `/profile` | Create profile |
| `PUT` | `/profile` | Update profile |

**Profile body:**
```json
{
  "name": "Alex",
  "gender": "Female",
  "style_preference": "Casual",
  "budget": 5000,
  "favorite_colors": "Black, White, Navy"
}
```

### Body Analysis

| Method | Path | Description |
|---|---|---|
| `POST` | `/analyze-user` | Upload a selfie (multipart `file`). Gemini detects body type, skin tone, hair style. |
| `GET` | `/body-profile` | Get stored body profile |

### Wardrobe

| Method | Path | Description |
|---|---|---|
| `POST` | `/upload-clothing` | Upload a clothing photo (multipart `file`). Gemini categorises and describes it. |
| `GET` | `/wardrobe` | Get all items grouped by category (`tops`, `bottoms`, `footwear`, `accessories`, `other`) |
| `PUT` | `/wardrobe/{id}` | Edit an item (partial update — any field optional) |
| `DELETE` | `/wardrobe/{id}` | Delete item from DB and disk |

**Image rules:** JPG / PNG / WebP only, max 5 MB. Resized to max 1024px before saving.

### Recommendations

| Method | Path | Description |
|---|---|---|
| `POST` | `/recommend-outfit` | Generate an outfit recommendation |

**Request:**
```json
{ "occasion": "College", "weather": "Hot" }
```

**Response:**
```json
{
  "outfit": { "top": "White Linen Shirt", "bottom": "Black Chinos", "footwear": "White Sneakers", "accessory": null },
  "missing_items": ["Belt"],
  "explanation": ["Light fabric suits hot weather", "..."],
  "avatar": { "body_type": "average", "skin_tone": "Medium", "hair_style": "short black hair" }
}
```

Valid occasions: `College`, `Wedding`, `Party`, `Interview`, `Office`, `Vacation`  
Valid weather: `Hot`, `Moderate`, `Cold`

### Error responses

| Status | Meaning |
|---|---|
| `400` | Missing prerequisite (no profile / no wardrobe / no body profile) |
| `404` | Item not found |
| `503` | Gemini API unavailable (after 3 retries with backoff) |

---

## Frontend Architecture

### State management

A single React Context (`AppDataContext`) loads `profile`, `bodyProfile`, and `wardrobe` once on app mount and exposes `refreshProfile()`, `refreshBodyProfile()`, `refreshWardrobe()`. Pages call the relevant refresh after a successful mutation so the UI stays in sync without a full reload.

### Routing

| Path | Page |
|---|---|
| `/` | Home |
| `/recommendations` | Outfit recommendations (main screen) |
| `/wardrobe` | Closet grid + upload |
| `/body-analysis` | Selfie upload + avatar |
| `/profile` | Profile form |
| `/discover` | Swipe deck |

Navigation is a fixed bottom tab bar (4 tabs: today / closet / mirror / profile).

### Design system — Atelier

The UI uses a custom Tailwind design system with a closet/fitting-room metaphor.

**Core tokens:**

| Token | Value | Role |
|---|---|---|
| `canvas` | `#FBF8F4` | Page background |
| `ink` | `#231F1C` | Primary text |
| `thread` | `#B5482E` | Primary accent (rust/clay) |
| `sage` | `#6B7A5E` | Secondary accent (tips, positive) |
| `muted` | `#A39C92` | Secondary text |
| `borderwarm` | `#E6DFD3` | All borders |

**Fonts:**
- `font-serif` (Fraunces) — headlines, wordmark
- `font-sans` (Inter) — body text, inputs
- `font-mono` (JetBrains Mono) — chips, badges, metadata

**Signature element:** a dashed rust `<hr>` (`SeamDivider`) used between every major section.

---

## Avatar System

The avatar is a body-double SVG — it reflects body type, skin tone, and hair style from the body analysis. It does **not** change based on the recommended outfit.

### How it works

1. User uploads a selfie → Gemini returns `body_type`, `skin_tone`, `hair_style`
2. Backend `avatar_service.py` converts these to render-ready values:
   - `body_type`: lowercased + hyphen→underscore (`Plus-size` → `plus_size`)
   - `skin_color`: mapped to a hex value (5 tones: Fair → Dark)
   - `hair_style`: lowercased string
3. Frontend `Avatar.jsx` renders a fully SVG avatar:
   - **Body shape**: 5 presets (slim / average / athletic / curvy / plus_size) with distinct shoulder, waist, hip proportions drawn with bezier curves
   - **Skin**: radial gradient using the skin hex
   - **Hair**: short cap / long strands / curly puffs — detected from keywords in the hair style string; color extracted from keywords (black, brown, blonde, red, grey)
   - **Face**: eyebrows, eyes with iris/pupil/shine, nose, lips
   - **Clothing**: terracotta shirt, navy trousers, dark shoes — fixed generic outfit

The avatar appears in two places: the **Body Analysis** page (after upload) and the **Recommendations** page (inside the MirrorPanel fitting room).

---

## Deployment

### Backend — Render

- **Runtime:** Python 3.11 (pinned via `backend/.python-version`)
- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Persistent disk** mounted at `/opt/render/project/src/backend` (1 GB) — keeps SQLite DB and uploaded images across deploys
- **Required env vars on Render:** `GEMINI_API_KEY`, `BASE_URL`, `CORS_ORIGINS`

### Frontend — Vercel

- **Framework:** Vite
- **Root directory:** `frontend`
- **Build:** `npm run build` → `dist/`
- **SPA rewrite:** all routes → `index.html` (configured in `vercel.json`)
- **Required env var on Vercel:** `VITE_API_URL` = your Render backend URL

### Re-deploying after code changes

```bash
git add .
git commit -m "your message"
git push
```

Both Render and Vercel auto-deploy on push to `main`.

---

## Known Limitations

- **Single user** — no authentication. All data (profile, wardrobe, body profile) is stored under a fixed `id=1`. Not suitable for multi-user use without adding auth.
- **SQLite** — fine for single-user local/demo use. For multi-user production, swap to PostgreSQL.
- **Render free tier cold starts** — the backend sleeps after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. Upgrade to a paid Render instance ($7/mo) for always-on behaviour.
- **Gemini free tier rate limits** — 15 requests/minute. Handled with automatic 3-attempt retry + exponential backoff. Uploading many items in quick succession may slow down but won't fail.
- **Image storage** — uploaded images live on Render's persistent disk. If the service is deleted or the disk is reset, images are lost. For production, use S3 or Cloudinary.
- **Wardrobe drag-to-pull tray** — currently a UI-only affordance. Dragged items appear in the tray but do not filter what gets sent to the recommendation API. The structure is in place to wire this up later.
