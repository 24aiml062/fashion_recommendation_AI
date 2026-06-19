# AI Fashion Copilot

AI-powered fashion recommendation app built with React + FastAPI + Gemini.

## Setup

1. Clone the repo
2. Add your Gemini API key to `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   BASE_URL=http://localhost:8000
   ```

## Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Open App

http://localhost:5173

## API Docs

http://localhost:8000/docs

## Notes

- Always run the backend from inside `backend/` — uploaded image paths are relative to this working directory.
- Gemini free-tier rate limits (15 req/min) are handled with automatic retry + backoff; if you upload many items in quick succession, uploads may take a few seconds longer rather than failing outright.
- The avatar on the Recommendations page reflects body type, skin tone, and hairstyle only — it does not visually render the recommended outfit.
