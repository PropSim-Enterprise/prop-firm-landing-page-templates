// Writes one HTML page per template (templates/<id>/index.html), the gallery
// cards in index.html and public/sitemap.xml, from each template's manifest.
// Run it after adding or renaming a template:  npm run pages
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE = "https://propsim-enterprise.github.io/prop-firm-landing-page-templates";
const ROOT = path.resolve(import.meta.dirname, "..");

const field = (src, name) => src.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1];
const list = (src, name) =>
  [...(src.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map(
    (m) => m[1],
  );

/** Every manifest*.ts under src/templates, in gallery order (dark first, then by name). */
function readManifests() {
  const dir = path.join(ROOT, "src/templates");
  const files = readdirSync(dir).flatMap((t) =>
    readdirSync(path.join(dir, t))
      .filter((f) => /^manifest.*\.ts$/.test(f))
      .map((f) => readFileSync(path.join(dir, t, f), "utf8")),
  );
  return files
    .map((src) => ({
      id: field(src, "id"),
      name: field(src, "name"),
      description: src.match(/description:\s*"([^"]+)"/)?.[1],
      tags: list(src, "tags"),
      tone: field(src, "tone"),
      swatch: list(src, "swatch"),
    }))
    .sort((a, b) => a.tone.localeCompare(b.tone) || a.name.localeCompare(b.name));
}

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const style = (m) => m.tags.filter((t) => t !== m.tone).map(cap).join(", ");

function templatePage(m) {
  const title = `${m.name} Prop Firm Landing Page Template (Free, ${cap(m.tone)}) | PropSim`;
  const url = `${SITE}/templates/${m.id}/`;
  return `<!doctype html>
<html lang="en" data-template="${m.id}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(`Free ${m.tone} prop firm landing page template. ${m.description}`)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(m.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og/${m.id}.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="app"></div>
    <noscript>
      <h1>${esc(m.name)}: a free prop firm landing page template</h1>
      <p>${esc(m.description)}</p>
      <p><a href="../../">See all free prop firm landing page templates</a></p>
    </noscript>
    <script type="module" src="../../site/main.tsx"></script>
  </body>
</html>
`;
}

function card(m) {
  const dots = m.swatch.map((c) => `<i style="background:${c}"></i>`).join("");
  const tags = m.tags.map((t) => `<li>${t}</li>`).join("");
  return `        <article class="card">
          <a class="card-shot" href="templates/${m.id}/"><img src="site/img/${m.id}.webp" alt="${esc(`${m.name} prop firm landing page template: ${m.tone}, ${style(m).toLowerCase()} design`)}" width="1280" height="800" loading="lazy" /></a>
          <div class="card-body">
            <div class="card-head"><h3><a href="templates/${m.id}/">${esc(m.name)}</a></h3><span class="swatch" aria-hidden="true">${dots}</span></div>
            <p>${esc(m.description)}</p>
            <ul class="tags">${tags}</ul>
            <a class="card-link" href="templates/${m.id}/">Live demo <span aria-hidden="true">→</span></a>
          </div>
        </article>`;
}

function sitemap(manifests) {
  const urls = ["", ...manifests.map((m) => `templates/${m.id}/`)]
    .map((p) => `  <url><loc>${SITE}/${p}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const manifests = readManifests();
for (const m of manifests) {
  const dir = path.join(ROOT, "templates", m.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), templatePage(m));
}

const indexPath = path.join(ROOT, "index.html");
const index = readFileSync(indexPath, "utf8").replace(
  /(<!-- cards:start -->)[\s\S]*?([ \t]*<!-- cards:end -->)/,
  `$1\n${manifests.map(card).join("\n")}\n$2`,
);
writeFileSync(indexPath, index);
writeFileSync(path.join(ROOT, "public/sitemap.xml"), sitemap(manifests));
console.log(`Wrote ${manifests.length} template pages, the gallery cards and sitemap.xml.`);
