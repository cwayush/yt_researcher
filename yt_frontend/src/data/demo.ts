import { QAPair, VideoMeta } from "@/types";

export const demoVideo: VideoMeta = {
  id: "rag-from-scratch",
  url: "https://www.youtube.com/watch?v=rag-from-scratch",
  title: "Building RAG Systems From Scratch",
  channel: "AI Engineering Channel",
  summary:
    "A deep dive on building Retrieval-Augmented Generation systems end to end: ingestion and document quality, chunking strategy, dense and keyword retrieval, hybrid fusion with RRF, cross-encoder reranking, and the confidence checks that keep a system from answering when the evidence is thin.",
  duration: "42:18",
  durationSeconds: 2538,
  language: "English",
  thumbnail:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop&auto=format",
  publishedAt: "2024-03-15",
  questionCount: 12,
  lastResearched: "2 hours ago",
  isIndexed: true,
};

export const demoQAPairs: QAPair[] = [
  {
    id: "q1",
    question: "What is RAG?",
    answer:
      "RAG, or Retrieval-Augmented Generation, is a technique that combines language models with information retrieval. Before generating an answer, the system retrieves relevant information from an external knowledge source and injects it into the model's context window.\n\nThis allows the model to answer using retrieved evidence rather than relying solely on its internal training knowledge. The key advantage is that the knowledge base can be updated at any time without retraining the model.",
    evidence: [
      {
        id: "e1-1",
        startTimestamp: "02:14",
        endTimestamp: "02:48",
        startSeconds: 134,
        endSeconds: 168,
        text: "RAG stands for Retrieval-Augmented Generation. At its core, it's a technique that combines the power of language models with the precision of information retrieval.",
        relevance: "High",
        relevanceScore: 0.92,
      },
      {
        id: "e1-2",
        startTimestamp: "08:42",
        endTimestamp: "09:16",
        startSeconds: 522,
        endSeconds: 556,
        text: "RAG retrieves relevant information before generation, allowing the model to answer using retrieved evidence rather than internal knowledge alone. This is the fundamental promise of the architecture.",
        relevance: "High",
        relevanceScore: 0.88,
      },
    ],
  },
  {
    id: "q2",
    question: "Why does the speaker prefer RAG over fine-tuning?",
    answer:
      "The speaker argues that RAG has a critical operational advantage over fine-tuning: knowledge remains external and updateable. With fine-tuning, new information requires retraining the model, which is expensive and slow. With RAG, you simply add documents to the index and the system immediately has access to them.\n\nFine-tuning encodes knowledge into model weights, which are static after training. RAG externalizes that knowledge, making it dynamic, auditable, and traceable back to source documents.",
    evidence: [
      {
        id: "e2-1",
        startTimestamp: "10:03",
        endTimestamp: "10:31",
        startSeconds: 603,
        endSeconds: 631,
        text: "This is fundamentally different from fine-tuning, where you modify the model weights. Fine-tuning encodes knowledge into parameters, so it can't be updated without retraining.",
        relevance: "High",
        relevanceScore: 0.94,
      },
      {
        id: "e2-2",
        startTimestamp: "10:31",
        endTimestamp: "11:05",
        startSeconds: 631,
        endSeconds: 665,
        text: "RAG keeps knowledge external and updateable. You can add new documents to the index today and the system knows about them immediately. That's a massive operational advantage.",
        relevance: "High",
        relevanceScore: 0.91,
      },
    ],
  },
  {
    id: "q3",
    question: "What are the limitations of RAG?",
    answer:
      "The speaker identifies two primary limitations. First, RAG retrieves what is semantically similar to the query, not necessarily what is logically required to answer it. Multi-hop reasoning, where an answer depends on chaining multiple pieces of evidence, remains difficult.\n\nSecond, RAG is bounded by what exists in the index. If the answer isn't in the corpus, even a perfect retriever cannot surface it. The system is only as good as the documents you've ingested.",
    evidence: [
      {
        id: "e3-1",
        startTimestamp: "31:05",
        endTimestamp: "31:44",
        startSeconds: 1865,
        endSeconds: 1904,
        text: "A common limitation is that RAG retrieves what's similar to the query, not what's logically necessary to answer it. Multi-hop reasoning, where the answer requires chaining evidence, remains hard.",
        relevance: "High",
        relevanceScore: 0.89,
      },
      {
        id: "e3-2",
        startTimestamp: "41:30",
        endTimestamp: "42:05",
        startSeconds: 2490,
        endSeconds: 2525,
        text: "The honest limitation of all RAG systems is that they are bounded by what's in the index. If the answer isn't in your corpus, even the best retriever can't find it.",
        relevance: "High",
        relevanceScore: 0.87,
      },
    ],
  },
  {
    id: "q4",
    question: "What does the speaker say about chunking?",
    answer:
      'The speaker calls chunking strategy "one of the most underrated aspects of RAG quality" and warns that "poor chunking is the silent killer of RAG performance."\n\nFixed-size chunking is the simplest approach but destroys semantic coherence. The speaker recommends semantic chunking, which uses sentence transformers to detect topic shifts and cut at natural boundaries. The result is measurably better retrieval because each chunk contains a coherent unit of meaning.',
    evidence: [
      {
        id: "e4-1",
        startTimestamp: "14:22",
        endTimestamp: "16:08",
        startSeconds: 862,
        endSeconds: 968,
        text: "Chunking strategy is one of the most underrated aspects of RAG quality. How you split documents determines what the retrieval system can find. Poor chunking is the silent killer of RAG performance.",
        relevance: "High",
        relevanceScore: 0.95,
      },
      {
        id: "e4-2",
        startTimestamp: "17:44",
        endTimestamp: "18:05",
        startSeconds: 1064,
        endSeconds: 1085,
        text: "Semantic chunking respects natural boundaries in the text. We use sentence transformers to detect when the topic shifts significantly, then cut there. The results are measurably better.",
        relevance: "High",
        relevanceScore: 0.9,
      },
    ],
  },
  {
    id: "q5",
    question: "How does hybrid retrieval work?",
    answer:
      "Hybrid retrieval combines dense embedding search with sparse keyword search (BM25) to leverage the strengths of both.\n\nDense retrieval handles synonyms and conceptual paraphrases, while BM25 excels at exact keyword matching. The system merges results using Reciprocal Rank Fusion (RRF), which normalizes and combines ranking positions rather than raw scores.",
    evidence: [
      {
        id: "e5-1",
        startTimestamp: "18:05",
        endTimestamp: "19:33",
        startSeconds: 1085,
        endSeconds: 1173,
        text: "Dense retrieval uses embedding similarity: we encode both the query and chunks into the same vector space, then find nearest neighbors. It handles synonyms and paraphrases well.",
        relevance: "High",
        relevanceScore: 0.91,
      },
      {
        id: "e5-2",
        startTimestamp: "22:31",
        endTimestamp: "25:17",
        startSeconds: 1351,
        endSeconds: 1517,
        text: "Hybrid retrieval combines both signals using Reciprocal Rank Fusion. Instead of averaging scores, which have different scales, we fuse the rank positions. It's elegant and robust.",
        relevance: "High",
        relevanceScore: 0.93,
      },
    ],
  },
];

export const suggestedQuestions: string[] = demoQAPairs.map((pair) => pair.question);

export const historyVideos: VideoMeta[] = [
  demoVideo,
  {
    id: "transformers-explained",
    url: "https://www.youtube.com/watch?v=transformers-explained",
    title: "Understanding Transformers",
    channel: "ML Explained",
    summary:
      "A ground-up explanation of the transformer architecture: self-attention, multi-head attention, positional encodings, and why the design parallelises so much better than the recurrent models it replaced.",
    duration: "28:42",
    durationSeconds: 1722,
    language: "English",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&auto=format",
    publishedAt: "2024-02-20",
    questionCount: 7,
    lastResearched: "Yesterday",
    isIndexed: true,
  },
  {
    id: "vector-databases",
    url: "https://www.youtube.com/watch?v=vector-databases",
    title: "Vector Databases in Production",
    channel: "Infra Engineering",
    summary:
      "What changes when a vector database goes to production: index selection and tuning, the recall-versus-latency trade-off, sharding and replication, metadata filtering, and keeping embeddings fresh as the corpus moves underneath you.",
    duration: "35:09",
    durationSeconds: 2109,
    language: "English",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop&auto=format",
    publishedAt: "2024-01-08",
    questionCount: 4,
    lastResearched: "3 days ago",
    isIndexed: true,
  },
];
