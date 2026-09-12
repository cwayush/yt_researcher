import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin, type HtmlTagDescriptor } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { SITE, THEME_COLORS, THEME_STORAGE_KEY } from "./src/config/site";

const themeBootScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) || "system";
    var dark =
      stored === "dark" ||
      (stored === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {
    // Storage unavailable, keep the light default.
  }
})();
`.trim();

// Builds the document head from src/config/site.ts.
function htmlMetadata(): Plugin {
  return {
    name: "html-metadata",
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: "meta",
          attrs: { name: "description", content: SITE.description },
          injectTo: "head",
        },
        {
          tag: "link",
          attrs: { rel: "icon", type: "image/svg+xml", href: SITE.favicon },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: { name: "theme-color", content: THEME_COLORS.light },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            media: "(prefers-color-scheme: light)",
            content: THEME_COLORS.light,
          },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            media: "(prefers-color-scheme: dark)",
            content: THEME_COLORS.dark,
          },
          injectTo: "head",
        },
        ...SITE.fonts.preconnect.map((href): HtmlTagDescriptor => ({
          tag: "link",
          attrs: href.includes("gstatic")
            ? { rel: "preconnect", href, crossorigin: "" }
            : { rel: "preconnect", href },
          injectTo: "head",
        })),
        {
          tag: "link",
          attrs: { rel: "stylesheet", href: SITE.fonts.stylesheet },
          injectTo: "head",
        },
        { tag: "script", children: themeBootScript, injectTo: "head" },
      ];

      return {
        html: html.replace(/<title>[\s\S]*?<\/title>/, `<title>${SITE.title}</title>`),
        tags,
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), htmlMetadata()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
});
