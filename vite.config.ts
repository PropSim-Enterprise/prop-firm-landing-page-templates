import { readdirSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// One HTML page per template (templates/<id>/index.html) plus the gallery.
const pages = Object.fromEntries(
  readdirSync("templates").map((id) => [id, `templates/${id}/index.html`]),
);

export default defineConfig({
  // Relative asset paths, so the build works on GitHub Pages, Netlify or any folder.
  base: "./",
  plugins: [react()],
  build: { rollupOptions: { input: { index: "index.html", ...pages } } },
});
