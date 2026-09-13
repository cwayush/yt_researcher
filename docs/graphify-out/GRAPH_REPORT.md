# Graph Report - yt_researcher  (2026-09-13)

## Corpus Check
- 176 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 891 nodes · 2128 edges · 59 communities (35 shown, 2 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 148 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Backend: Retrieval Pipeline
- Frontend: API Client + Mappers
- Backend: Index State
- Backend: Chunking
- Backend: Transcript Ingestion
- Frontend: App Layout
- Backend: Vector Store (Qdrant)
- Backend: API Layer
- Frontend: Video Player UI
- Frontend: Other
- Backend: Application Services
- Frontend: UI Primitives
- Frontend: Frontend Lib
- Frontend: Other
- Backend: Pydantic Models
- Frontend: UI Primitives
- Frontend: App Layout
- Misc
- Frontend: Other
- Frontend: Research Panel UI
- Backend: Config
- Backend: Retrieval Pipeline
- Backend: Embeddings
- Frontend: How It Works UI
- Frontend: Landing Page UI
- Frontend: Frontend Lib
- Frontend: Other
- Frontend: Landing Page UI
- Frontend: App Layout
- Backend: Other
- Backend: Other
- Frontend: Other
- Frontend: Landing Page UI
- Frontend: Other
- Frontend: UI Primitives
- Frontend: Other
- Backend: Other

## God Nodes (most connected - your core abstractions)
1. `RetrievedChunk` - 45 edges
2. `cn()` - 43 edges
3. `ParentChunk` - 29 edges
4. `react` - 28 edges
5. `IndexingService` - 27 edges
6. `PostgresIndexStateStore` - 27 edges
7. `Sentence` - 25 edges
8. `TranscriptService` - 23 edges
9. `VectorStore` - 23 edges
10. `compilerOptions` - 23 edges

## Surprising Connections (you probably didn't know these)
- `BM25Retriever` --uses--> `RetrievedChunk`  [INFERRED]
  yt_backend/src/retrieval/keyword/bm25.py → yt_backend/src/models/retrieval.py
- `ParentExpander` --uses--> `RetrievedChunk`  [INFERRED]
  yt_backend/src/retrieval/parent/expander.py → yt_backend/src/models/retrieval.py
- `QdrantVectorStore` --uses--> `RetrievedChunk`  [INFERRED]
  yt_backend/src/vectorstore/qdrant.py → yt_backend/src/models/retrieval.py
- `get_retrieval_pipeline()` --uses--> `RerankerConfidenceChecker`  [INFERRED]
  yt_backend/src/container.py → yt_backend/src/retrieval/confidence/checker.py
- `get_retrieval_pipeline()` --uses--> `ContextBuilder`  [INFERRED]
  yt_backend/src/container.py → yt_backend/src/retrieval/context/builder.py

## Import Cycles
- None detected.

## Communities (59 total, 2 thin omitted)

### Community 0 - "Backend: Retrieval Pipeline"
Cohesion: 0.06
Nodes (42): Depends, post, query_video(), Retrieval API route - thin HTTP layer. Accepts a question about an already-…, get_generation_service(), get_retrieval_service(), GenerationProvider, ABC (+34 more)

### Community 1 - "Frontend: API Client + Mappers"
Cohesion: 0.06
Nodes (53): VideoPlayer(), VideoPlayerProps, useDataReset(), getSnapshot(), historyStore, listeners, subscribe(), useHistory() (+45 more)

### Community 2 - "Backend: Index State"
Cohesion: 0.05
Nodes (46): datetime, DeclarativeBase, Depends, post, Reset API route - thin HTTP layer. Development-only. Parses the confirmation…, reset_data(), Base, ParentChunkRecord (+38 more)

### Community 3 - "Backend: Chunking"
Cohesion: 0.08
Nodes (32): T, Chunker, ABC, Convert input data into chunks., Base interface for chunking strategies. Concrete chunkers implement the chunk()…, ChildChunker, Splits each parent into smaller sentence-aware retrieval chunks. Child chunks…, HierarchicalChunker (+24 more)

### Community 4 - "Backend: Transcript Ingestion"
Cohesion: 0.07
Nodes (37): ABC, Abstract base class for transcript providers. Defines the interface that all…, Abstract transcript provider interface. Any concrete implementation must be…, Fetch the raw transcript for the given video ID. Args: video_id: The YouTube…, TranscriptProvider, src/ingestion package., YouTube transcript provider. Fetches raw transcripts from YouTube using the…, Concrete TranscriptProvider backed by youtube-transcript-api. Fetches the… (+29 more)

### Community 5 - "Frontend: App Layout"
Cohesion: 0.13
Nodes (20): react, react-router-dom, App(), ProcessingScreen, AppLayout(), Logo(), LogoProps, Navbar() (+12 more)

### Community 6 - "Backend: Vector Store (Qdrant)"
Cohesion: 0.12
Nodes (11): EmbeddedChunk, EmbeddedResponse, BaseModel, Response containing hierarchical chunks with Embeddings., BaseModel, VectorStoreResult, ABC, VectorStore (+3 more)

### Community 7 - "Backend: API Layer"
Cohesion: 0.14
Nodes (21): Exception, exception_handler, get, JSONResponse, Request, health_check(), invalid_youtube_url_handler(), YouTube Researcher API — application entry point. Registers: - FastAPI… (+13 more)

### Community 8 - "Frontend: Video Player UI"
Cohesion: 0.14
Nodes (20): class-variance-authority, lucide-react, WorkspaceScreen, HistoryCard(), HistoryCardProps, Badge(), BadgeProps, badgeVariants (+12 more)

### Community 9 - "Frontend: Other"
Cohesion: 0.08
Nodes (24): compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+16 more)

### Community 10 - "Backend: Application Services"
Cohesion: 0.15
Nodes (17): index_video(), Depends, post, Indexing API route - thin HTTP layer. Responsibilities: 1. Parse and validate…, IndexResponse, BaseModel, Response returned after a video is made searchable., Compute a SHA-256 fingerprint of the reconstructed transcript. Args: sentences:… (+9 more)

### Community 11 - "Frontend: UI Primitives"
Cohesion: 0.17
Nodes (17): TONE_BY_STATE, UrlInput(), handleChange(), UrlInputProps, UrlState, QuestionComposer(), QuestionComposerProps, controlClass (+9 more)

### Community 12 - "Frontend: Frontend Lib"
Cohesion: 0.16
Nodes (17): ICONS, LABELS, ThemeToggle(), EvidenceCardProps, RELEVANCE_VARIANTS, readStoredTheme(), resolve(), systemTheme() (+9 more)

### Community 13 - "Frontend: Other"
Cohesion: 0.11
Nodes (20): clsx, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, prettier (+12 more)

### Community 14 - "Backend: Pydantic Models"
Cohesion: 0.15
Nodes (18): get_chunks(), Depends, post, Chunking inspection route — thin HTTP layer. Exposes the parent/child chunks…, get_transcript(), Depends, post, Transcript API route - thin HTTP layer. Responsibilities: 1. Parse and validate… (+10 more)

### Community 15 - "Frontend: UI Primitives"
Cohesion: 0.17
Nodes (12): HistoryScreen, HistoryEmptyState(), HistoryEmptyStateProps, ResetDataDrawer(), ResetDataDrawerProps, ProcessingErrorStateProps, Button, ButtonProps (+4 more)

### Community 16 - "Frontend: App Layout"
Cohesion: 0.13
Nodes (12): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, PageContainer(), PageContainerProps, BAR_WIDTHS, RouteFallback(), ProcessingStages() (+4 more)

### Community 17 - "Misc"
Cohesion: 0.12
Nodes (16): description, devDependencies, concurrently, name, private, scripts, build, dev (+8 more)

### Community 18 - "Frontend: Other"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, prettier (+9 more)

### Community 19 - "Frontend: Research Panel UI"
Cohesion: 0.18
Nodes (12): AnswerLoading(), BAR_WIDTHS, AnswerText(), renderInline(), EvidenceCard(), ResearchEmptyState(), ResearchEntryCard(), ResearchEntryCardProps (+4 more)

### Community 20 - "Backend: Config"
Cohesion: 0.17
Nodes (11): BaseSettings, Run migrations in 'offline' mode. This configures the context with just a URL…, Run migrations in 'online' mode. In this scenario we need to create an Engine…, run_migrations_offline(), run_migrations_online(), get_settings(), Application configuration using pydantic-settings. Settings are loaded from…, Application settings loaded from environment variables. All fields with no… (+3 more)

### Community 21 - "Backend: Retrieval Pipeline"
Cohesion: 0.18
Nodes (7): BM25Okapi, Video title and channel from YouTube's public oEmbed endpoint. oEmbed needs no…, Fetches video metadata that the transcript API does not carry., YoutubeOEmbedProvider, BM25Retriever, Drop every cached keyword index, not just one video's., IndexingService — application service for indexing YouTube videos. Pipeline:…

### Community 22 - "Backend: Embeddings"
Cohesion: 0.17
Nodes (4): EmbeddingProvider, ABC, GoogleEmbeddingProvider, Google gemini embedding implementation. This class is responsible only for…

### Community 23 - "Frontend: How It Works UI"
Cohesion: 0.24
Nodes (9): HowItWorksScreen, HowItWorksCard(), HowItWorksCardProps, HowItWorksGroup(), HowItWorksGroupProps, Footer(), ConceptCard, ConceptGroup (+1 more)

### Community 24 - "Frontend: Landing Page UI"
Cohesion: 0.20
Nodes (9): EvidenceMockup(), FeatureGrid(), EvidenceSection(), StepList(), EVIDENCE_EXAMPLE, GROUNDED_EXAMPLES, HOME_FEATURES, HOME_STEPS (+1 more)

### Community 25 - "Frontend: Frontend Lib"
Cohesion: 0.22
Nodes (10): RetrievalDetailsPanel(), RetrievalDetailsPanelProps, APP_TAGLINE, FOOTER_LINKS, RETRIEVAL_DETAIL_LABELS, RETRIEVAL_PIPELINE_SUMMARY, WORKSPACE_LABELS, env (+2 more)

### Community 26 - "Frontend: Other"
Cohesion: 0.21
Nodes (9): @tailwindcss/vite, vite, @vitejs/plugin-react, YouTubeGlyph(), BRAND, SITE, THEME_COLORS, THEME_STORAGE_KEY (+1 more)

### Community 27 - "Frontend: Landing Page UI"
Cohesion: 0.27
Nodes (7): QuestionButton(), QuestionButtonProps, ResearchMockup(), AskAnythingSection(), EyebrowLabel(), EyebrowLabelProps, HOME_QUESTION_PROMPTS

### Community 28 - "Frontend: App Layout"
Cohesion: 0.38
Nodes (6): Section(), SectionProps, sectionVariants, SectionHeading(), SectionHeadingProps, HOME_SECTIONS

### Community 29 - "Backend: Other"
Cohesion: 0.29
Nodes (8): create_embeddings(), Depends, post, Embedding inspection route - thin HTTP layer. Runs a video through transcript →…, get_chunking_service(), get_embedding_service(), EmbeddingService, Application service responsible for converting child chunks into embedded…

### Community 30 - "Backend: Other"
Cohesion: 0.44
Nodes (9): get_index_state_store(), get_indexing_service(), get_keyword_retriever(), get_oembed_provider(), get_parent_store(), get_reset_service(), get_retrieval_pipeline(), get_vector_store() (+1 more)

### Community 31 - "Frontend: Other"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, format:check, lint, lint:fix, preview (+1 more)

### Community 32 - "Frontend: Landing Page UI"
Cohesion: 0.25
Nodes (7): HomeScreen, GroundedSection(), HeroSection(), HeroSectionProps, HowItWorksSection(), ProductExplanationSection(), HOME_HERO

### Community 33 - "Frontend: Other"
Cohesion: 0.25
Nodes (8): dependencies, class-variance-authority, clsx, lucide-react, react, react-dom, react-router-dom, tailwind-merge

### Community 34 - "Frontend: UI Primitives"
Cohesion: 0.43
Nodes (5): GroundedExamples(), NoEvidenceState(), Card(), CardProps, cardVariants

## Knowledge Gaps
- **123 isolated node(s):** `VideoPlayerProps`, `IndexingPhase`, `BackendVideoMetadata`, `UrlInputProps`, `UrlState` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 313 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Frontend: App Layout` to `Frontend: API Client + Mappers`, `Frontend: UI Primitives`, `Frontend: Video Player UI`, `Frontend: UI Primitives`, `Frontend: Frontend Lib`, `Frontend: Other`, `Frontend: UI Primitives`, `Frontend: App Layout`, `Frontend: Research Panel UI`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `PostgresIndexStateStore` connect `Backend: Index State` to `Backend: Application Services`, `Backend: Chunking`, `Backend: Retrieval Pipeline`, `Backend: Other`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `IndexingService` connect `Backend: Application Services` to `Backend: Retrieval Pipeline`, `Backend: Index State`, `Backend: Chunking`, `Backend: Transcript Ingestion`, `Backend: Vector Store (Qdrant)`, `Backend: API Layer`, `Backend: Pydantic Models`, `Backend: Retrieval Pipeline`, `Backend: Other`, `Backend: Other`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `RetrievedChunk` (e.g. with `ConfidenceChecker` and `RerankerConfidenceChecker`) actually correct?**
  _`RetrievedChunk` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `ParentChunk` (e.g. with `ChildChunker` and `ParentChunker`) actually correct?**
  _`ParentChunk` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `IndexingService` (e.g. with `index_video()` and `TranscriptNotAvailable`) actually correct?**
  _`IndexingService` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `VideoPlayerProps`, `IndexingPhase`, `BackendVideoMetadata` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._