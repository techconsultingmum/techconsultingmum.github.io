import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://agenticailab.in",
  "https://www.agenticailab.in",
  "https://agenticailab.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];
const LOVABLE_PREVIEW_PATTERN = /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.(lovable\.app|lovableproject\.com|sandbox\.lovable\.dev)$/;

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && (ALLOWED_ORIGINS.includes(origin) || LOVABLE_PREVIEW_PATTERN.test(origin))
      ? origin
      : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };
}

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets";
const SPREADSHEET_ID = "13M0ms0wi2-nLBOh8RHSVyIyGvh51SFlgxfAFsMxBYsc";
const RANGE = "A1:Z500";
const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10000;

let cache: { at: number; payload: unknown } | null = null;

interface Article {
  id: string;
  date: string;
  day: string;
  topic: string;
  audience: string;
  language: string;
  title: string;
  excerpt: string;
  content: string;
  url: string | null;
  likes: number;
  comments: number;
}

function toTitle(content: string, topic: string, day: string): string {
  const firstLine = content.split("\n").map((l) => l.trim()).find(Boolean);
  if (firstLine) return firstLine.replace(/^#+\s*/, "").slice(0, 120);
  return `${topic || "Update"} — ${day || ""}`.trim();
}

function buildArticles(values: string[][]): Article[] {
  if (!values?.length) return [];
  const headers = values[0].map((h) => String(h || "").trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name.toLowerCase());
  const iDate = idx("Date");
  const iDay = idx("Day");
  const iTopic = idx("Topic");
  const iAudience = idx("Audience");
  const iLanguage = idx("Language");
  const iContent = idx("Content");
  const iUrn = idx("LinkedInPostURN");
  const iLikes = idx("Likes");
  const iComments = idx("Comments");

  const cell = (row: string[], i: number) => (i >= 0 ? String(row[i] ?? "").trim() : "");

  return values
    .slice(1)
    .map((row, n): Article | null => {
      const content = cell(row, iContent);
      const urn = cell(row, iUrn);
      if (!content && !urn) return null;
      const withoutTags = content.replace(/(^|\s)#[\p{L}\d_]+/gu, " ").replace(/\s+/g, " ").trim();
      return {
        id: urn || `row-${n + 2}`,
        date: cell(row, iDate),
        day: cell(row, iDay),
        topic: cell(row, iTopic).replace(/_/g, " "),
        audience: cell(row, iAudience),
        language: cell(row, iLanguage) || "en",
        title: toTitle(content, cell(row, iTopic).replace(/_/g, " "), cell(row, iDay)),
        excerpt: withoutTags.slice(0, 260),
        content,
        url: urn ? `https://www.linkedin.com/feed/update/${urn}/` : null,
        likes: Number(cell(row, iLikes)) || 0,
        comments: Number(cell(row, iComments)) || 0,
      };
    })
    .filter((a): a is Article => a !== null)
    .reverse();
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
    });

  try {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) return json(cache.payload);

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const sheetsKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    if (!lovableKey || !sheetsKey) {
      console.error("linkedin-articles: missing connector credentials");
      return json({ error: "Article source is not configured." }, 503);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let resp: Response;
    try {
      resp = await fetch(`${GATEWAY_URL}/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`, {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": sheetsKey,
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!resp.ok) {
      const details = await resp.text();
      console.error(`linkedin-articles: gateway failed [${resp.status}]: ${details}`);
      return json({ error: "Could not load articles.", status: resp.status, details }, resp.status);
    }

    const data = await resp.json();
    const articles = buildArticles(data?.values ?? []);
    const payload = { articles, count: articles.length, updatedAt: new Date().toISOString() };
    cache = { at: Date.now(), payload };
    return json(payload);
  } catch (err) {
    console.error("linkedin-articles: unexpected error", err);
    return json({ error: "Could not load articles right now." }, 500);
  }
});