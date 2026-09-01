# YouTube Researcher

A backend tool that takes any YouTube video URL and turns its transcript into something actually useful — clean text, organized sentences, and smart chunks ready for AI-powered search and Q&A.

---

## What it does

You give it a YouTube link. It:

1. **Fetches the transcript** straight from YouTube (auto-captions or manual subtitles)
2. **Cleans it up** — removes noise, normalizes spacing, and drops empty segments
3. **Reconstructs sentences** — groups transcript fragments back into readable sentences using punctuation and natural speech pauses
4. **Chunks it intelligently** — splits the content into two levels: larger context blocks and smaller focused retrieval units, both token-aware

The result is structured, timestamp-preserved text ready to be embedded, searched, or queried with an LLM.

---

## Project Layout

```
yt_researcher/
├── yt_backend/         # Python backend (FastAPI)
│   ├── src/
│   │   ├── api/            # HTTP endpoints
│   │   ├── ingestion/      # Fetches transcripts from YouTube
│   │   ├── processing/     # Cleans text and reconstructs sentences
│   │   ├── chunking/       # Splits content into context and retrieval chunks
│   │   ├── models/         # Data shapes used throughout the pipeline
│   │   ├── services/       # Orchestrates the pipeline steps
│   │   ├── config/         # App settings and environment config
│   │   └── utility/        # Helpers (e.g. URL parsing)
│   └── main.py             # App entry point
│
└── yt_frontend/        # Frontend (coming soon)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API Framework | FastAPI |
| Data Validation | Pydantic v2 |
| Transcript Source | youtube-transcript-api |
| Token Counting | tiktoken (cl100k_base) |
| LLM / RAG (planned) | LangChain, LangGraph |
| Vector Search (planned) | FAISS |
| Package Manager | uv |
| Python | 3.13+ |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/cwayush/yt_researcher.git
cd yt_researcher
```

### 2. Set up environment

```bash
cd yt_backend
cp .env.example .env
# Fill in your API keys in .env
```

### 3. Install dependencies

```bash
pip install uv
uv sync
```

### 4. Run the server

```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive docs at `http://localhost:8000/docs`.

---

## API Usage

### Fetch and process a transcript

```
POST /api/v1/transcript
```

**Request body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "sentence_count": 42,
  "sentences": [
    {
      "text": "Never gonna give you up, never gonna let you down.",
      "start": 18.5,
      "end": 22.3,
      "index": 0,
      "source_segments": [0, 1, 2]
    }
  ]
}
```

**Error responses:**
- `400` — URL isn't a valid YouTube link
- `422` — Video exists but has no transcript available
- `404` — Video not found

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```env
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
GOOGLE_MODEL=gemini-2.0-flash
GROQ_API_KEY=your_key_here
HF_TOKEN=your_token_here
LANGCHAIN_API_KEY=your_key_here
LANGCHAIN_PROJECT=your_project_name
TAVILY_API_KEY=your_key_here
```

> Never commit your `.env` file. It's already in `.gitignore`.

---

## What's Coming Next

- [ ] Embeddings — convert chunks into vector representations
- [ ] Vector store — store and search chunks with FAISS
- [ ] Hybrid retrieval — combine vector search with keyword matching
- [ ] Reranking — refine search results before sending to the LLM
- [ ] Q&A generation — ask questions and get answers from any YouTube video
- [ ] Frontend interface

---

## License

MIT
