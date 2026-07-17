import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { OG_IMAGE, SITE_URL, routes } from "./seo-routes.mjs";

const distDir = resolve("dist");
const indexPath = join(distDir, "index.html");
const baseHtml = readFileSync(indexPath, "utf8");

const escapeHtml = (value = "") =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function stripManagedHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/\s*<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/\s*<meta\s+property=["']og:(title|description|type|url|image|site_name)["'][^>]*>/gi, "")
    .replace(/\s*<meta\s+name=["']twitter:(card|title|description|image|site)["'][^>]*>/gi, "")
    .replace(/\s*<meta\s+property=["']article:[^"']+["'][^>]*>/gi, "")
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, "");
}

function jsonLdFor(route, canonical) {
  if (route.path === "/") {
    return [
      { "@context": "https://schema.org", "@type": "Organization", name: "AgenticAI Lab", url: `${SITE_URL}/`, logo: OG_IMAGE, email: "info@agenticailab.in", telephone: "+91-8652074439", sameAs: ["https://www.linkedin.com/company/agenticai-lab/", "https://x.com/AgenticAILab", "https://github.com/techconsultingmum"] },
      { "@context": "https://schema.org", "@type": "WebSite", name: "AgenticAI Lab", url: `${SITE_URL}/`, description: route.description },
    ];
  }

  if (route.type === "article") {
    return [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: route.title,
      description: route.description,
      image: OG_IMAGE,
      mainEntityOfPage: canonical,
      datePublished: route.article.publishedTime,
      dateModified: route.article.publishedTime,
      articleSection: route.article.section,
      author: { "@type": "Person", name: route.article.author },
      publisher: { "@type": "Organization", name: "AgenticAI Lab", logo: { "@type": "ImageObject", url: OG_IMAGE } },
    }];
  }

  return [{ "@context": "https://schema.org", "@type": "WebPage", name: route.title, description: route.description, url: canonical }];
}

function buildManagedHead(route) {
  const canonical = `${SITE_URL}${route.path}`;
  const title = route.title.includes("AgenticAI Lab") ? route.title : `${route.title} | AgenticAI Lab`;
  const ogType = route.type === "article" ? "article" : "website";
  const robots = route.noIndex ? `<meta name="robots" content="noindex, follow">\n    ` : "";
  const articleTags = route.type === "article"
    ? `<meta property="article:published_time" content="${route.article.publishedTime}">\n    <meta property="article:modified_time" content="${route.article.publishedTime}">\n    <meta property="article:author" content="${escapeHtml(route.article.author)}">\n    <meta property="article:section" content="${escapeHtml(route.article.section)}">\n    `
    : "";
  const schemas = jsonLdFor(route, canonical)
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n    ");

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(route.description)}">
    ${robots}<link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(route.description)}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="AgenticAI Lab">
    <meta property="og:image" content="${OG_IMAGE}">
    ${articleTags}<meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@AgenticAILab">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(route.description)}">
    <meta name="twitter:image" content="${OG_IMAGE}">
    ${schemas}
  `;
}

function writeRoute(route) {
  const managedHead = buildManagedHead(route);
  const html = stripManagedHead(baseHtml).replace(/<meta name="viewport"[^>]*>/i, (match) => `${match}${managedHead}`);
  const target = route.path === "/" ? indexPath : join(distDir, route.path, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}

for (const route of routes) writeRoute(route);
console.log(`Static route HTML generated for ${routes.length} routes.`);