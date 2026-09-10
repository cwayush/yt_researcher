// Landing page copy. Kept out of the components so wording can change
// without touching layout, and so the sections stay readable.

export const HOME_HERO = {
  title: "Understand any video.",
  intro: [
    "Long videos contain valuable information, but finding the exact moment you need shouldn't take an hour.",
    "Video Research turns a YouTube video into an interactive research workspace. Ask questions, discover relevant moments, and verify every answer against the original transcript.",
  ],
  inputHint: "Supports YouTube videos with available transcripts.",
  demoLink: "or try a demo video",
} as const;

export const HOME_SECTIONS = {
  explanation: {
    title: "Research a video, not just a summary.",
    description:
      "Instead of giving you another wall of generated text, Video Research keeps the original source close to every answer.",
  },
  howItWorks: {
    title: "From YouTube link to evidence.",
    description:
      "The system processes the transcript, creates searchable representations of the content, and retrieves the most relevant context when you ask a question.",
  },
  evidence: {
    title: "Don't just trust the answer. See where it came from.",
    description:
      "Video Research connects AI-generated answers back to the original video. Each response surfaces the transcript passages that support it, complete with timestamps you can open directly.",
  },
  ask: {
    title: "Ask the video anything.",
    description:
      "Don't scrub through 45 minutes looking for one sentence. Ask a question and let the system find the relevant context.",
    promptsLabel: "Start with a question",
  },
  grounded: {
    title: "Grounded in the video.",
    description:
      "When the video does not contain enough evidence, the system says so instead of inventing an answer.",
  },
} as const;

export const HOME_FEATURES = [
  {
    num: "01",
    heading: "Ask",
    body: "Ask natural-language questions about the video. No keywords, no scrubbing.",
  },
  {
    num: "02",
    heading: "Find",
    body: "Retrieve the most relevant parts of the transcript, ranked by semantic relevance.",
  },
  {
    num: "03",
    heading: "Verify",
    body: "See the exact evidence and timestamp behind every answer. Always.",
  },
] as const;

export const HOME_STEPS = [
  { num: "01", step: "Paste a video", desc: "Paste any supported YouTube URL." },
  {
    num: "02",
    step: "Build understanding",
    desc: "The transcript is processed and indexed for semantic search.",
  },
  { num: "03", step: "Ask a question", desc: "Ask anything about the content in plain language." },
  {
    num: "04",
    step: "Get grounded answers",
    desc: "The system retrieves relevant evidence before generating the response.",
  },
  {
    num: "05",
    step: "Jump to the source",
    desc: "Open the exact timestamp and inspect the surrounding transcript.",
  },
] as const;

export const HOME_QUESTION_PROMPTS = [
  "What is this video mainly about?",
  "What are the key ideas?",
  "What does the speaker say about RAG?",
  "What examples does the speaker give?",
] as const;

export const GROUNDED_EXAMPLES = {
  supported: {
    badge: "Supported",
    question: "What is this video about?",
    answer:
      "This video is a deep dive on building RAG systems from scratch, covering ingestion, chunking, retrieval, and evaluation.",
    evidenceLabel: "Evidence 01",
    timestamp: "00:00-02:14",
    quote: "Welcome to this deep dive on building RAG systems...",
  },
  insufficient: {
    badge: "Insufficient evidence",
    question: "What is the speaker's opinion on quantum computing?",
  },
} as const;

export const NO_EVIDENCE_COPY = {
  title: "Not enough evidence.",
  body: "I couldn't find enough evidence in this video to answer that reliably. Try asking about something discussed in the video.",
} as const;
