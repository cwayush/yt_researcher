// Document metadata. Injected into index.html at build time by the htmlMetadata plugin in vite.config.ts
export const THEME_STORAGE_KEY = "yt_researcher_theme_v1";

export const THEME_COLORS = {
  light: "#FFFFEB",
  dark: "#12130E",
} as const;

export const BRAND = {
  logo: "/logo.svg",
  youtubeIcon: "/youtube.svg",
} as const;

export const SITE = {
  lang: "en",
  title: "Video Research - Understand any video",
  description:
    "Turn a YouTube video into a research workspace. Ask questions in plain language and verify every answer against the transcript it came from.",
  favicon: BRAND.logo,
  fonts: {
    preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    stylesheet:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Figtree:wght@300;400;500;600;700&display=swap",
  },
} as const;
