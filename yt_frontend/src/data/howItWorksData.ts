// Concise, project-specific explanations of the real engineering concepts
// behind the app. Kept out of components so the page renders purely from
// data, matching the pattern in data/content.ts.

export interface ConceptCard {
  id: string;
  title: string;
  description: string;
  benefit: string;
}

export interface ConceptGroup {
  id: string;
  title: string;
  intro: string;
  concepts: ConceptCard[];
}

export const HOW_IT_WORKS_GROUPS: ConceptGroup[] = [
  {
    id: "ingestion",
    title: "From Video to Index",
    intro:
      "Turning a raw transcript into something searchable, without redoing the work unnecessarily.",
    concepts: [
      {
        id: "transcript-ingestion",
        title: "Transcript Ingestion",
        description:
          "The video's caption track is fetched, cleaned of empty segments, and regrouped into real sentences using punctuation and pause boundaries.",
        benefit: "Produces well-formed sentences instead of raw, choppy caption fragments.",
      },
      {
        id: "parent-child-chunking",
        title: "Parent / Child Chunking",
        description:
          "Sentences are grouped into larger parent chunks, and each parent is split into smaller, overlapping child chunks.",
        benefit:
          "Children are optimized for retrieval while parents provide richer context to the LLM.",
      },
      {
        id: "embeddings",
        title: "Embeddings",
        description:
          "Every child chunk's text is converted into a vector that captures its meaning, so similar ideas end up close together in vector space.",
        benefit: "Enables searching by meaning, not just exact words.",
      },
      {
        id: "freshness",
        title: "Index Cache & 30-Day Freshness Check",
        description:
          "Indexed videos are trusted for a configured freshness window before their transcript is checked again.",
        benefit: "Avoids unnecessary transcript re-processing and re-embedding work.",
      },
      {
        id: "transcript-hash",
        title: "Transcript Hashing",
        description:
          "When a video's freshness window has passed, its transcript text is hashed and compared against the hash stored from the last successful index.",
        benefit: "Rebuild only when the searchable source content actually changed.",
      },
      {
        id: "safe-reindexing",
        title: "Safe Re-indexing",
        description:
          "New chunks and vectors are written before the old ones are cleaned up, and stale Qdrant vectors and the in-memory BM25 cache are only invalidated once the new index is safely committed.",
        benefit: "A failed rebuild doesn't destroy the previously working index.",
      },
    ],
  },
  {
    id: "data-stores",
    title: "Data Stores",
    intro: "Two purpose-built stores, each responsible for a different shape of data.",
    concepts: [
      {
        id: "qdrant",
        title: "Qdrant",
        description:
          "Stores child chunk vectors and their payload (text, timestamps, parent reference), filtered per video for both dense and keyword search.",
        benefit: "Fast similarity search, scoped cleanly to a single video at a time.",
      },
      {
        id: "postgres",
        title: "PostgreSQL",
        description:
          "Stores parent chunk text, each video's index state (status, transcript hash, timestamps), and video metadata.",
        benefit:
          "Durable source of truth for what's indexed and the richer text used to answer questions.",
      },
    ],
  },
  {
    id: "retrieval",
    title: "Hybrid Retrieval",
    intro: "Finding the right passages before the model ever writes an answer.",
    concepts: [
      {
        id: "dense-retrieval",
        title: "Dense Retrieval",
        description: "Finds semantically similar child chunks using vector similarity search.",
        benefit:
          "Catches relevant passages even when they don't share exact wording with the question.",
      },
      {
        id: "bm25",
        title: "BM25 Keyword Search",
        description:
          "Finds exact keyword matches by scoring chunks against the question's terms, built in-memory from the same data Qdrant stores.",
        benefit: "Catches precise terms — names, numbers, jargon — that semantic search can miss.",
      },
      {
        id: "hybrid-rrf",
        title: "Hybrid Retrieval & RRF",
        description:
          "Dense retrieval captures semantic similarity while BM25 catches exact terms. Reciprocal Rank Fusion combines both ranked result sets by position, not raw score, before reranking.",
        benefit: "Improves retrieval coverage across semantic and exact technical queries.",
      },
      {
        id: "reranking",
        title: "Cross-Encoder Reranking",
        description:
          "Scores each retrieved candidate against the question directly, rather than comparing pre-computed vectors, for a more precise final ordering.",
        benefit: "Improves final relevance ordering beyond what fast retrieval alone can achieve.",
      },
      {
        id: "confidence-gate",
        title: "Confidence Gate",
        description:
          "Weak evidence — a top reranked score below a configured minimum — causes the system to decline rather than forcing the model to answer.",
        benefit:
          "Reduces unsupported or made-up answers when a video simply doesn't cover the topic.",
      },
    ],
  },
  {
    id: "generation",
    title: "Grounded Generation",
    intro: "Answering only from what the video actually contains.",
    concepts: [
      {
        id: "parent-expansion",
        title: "Parent Expansion",
        description:
          "After reranking, each retrieved child's larger parent chunk is fetched from PostgreSQL to give the model more surrounding context.",
        benefit: "Precise retrieval without sacrificing the context needed to answer well.",
      },
      {
        id: "timestamp-evidence",
        title: "Timestamped Evidence",
        description:
          "The same reranked chunks used to build the answer's context are returned to the client as evidence, each with its timestamp in the source video.",
        benefit: "Every answer can be checked against the exact moment it came from.",
      },
      {
        id: "grounded-llm",
        title: "Grounded LLM Answer",
        description:
          "The model is prompted to answer strictly from the retrieved context, not from its own general knowledge.",
        benefit: "Keeps answers tied to what the video actually says.",
      },
    ],
  },
];
