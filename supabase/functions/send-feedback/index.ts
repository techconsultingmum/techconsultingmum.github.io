import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://agenticailab.in",
  "https://www.agenticailab.in",
  "https://agenticailab.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

const PREVIEW_PATTERNS = [
  /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.lovable\.app$/,
  /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.lovableproject\.com$/,
  /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.sandbox\.lovable\.dev$/,
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin &&
      (ALLOWED_ORIGINS.includes(origin) || PREVIEW_PATTERNS.some((re) => re.test(origin)))
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
}

const FEEDBACK_WEBHOOK = "https://jawepah.app.n8n.cloud/webhook/feedback";
const WEBHOOK_TIMEOUT_MS = 8000;
const WEBHOOK_MAX_ATTEMPTS = 3;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap) if (now > v.resetTime) rateLimitMap.delete(k);
  }
  const rec = rateLimitMap.get(ip);
  if (!rec || now > rec.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (rec.count >= RATE_LIMIT_MAX) return false;
  rec.count++;
  return true;
}

function log(level: "info" | "warn" | "error", requestId: string, event: string, data: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, requestId, event, ts: new Date().toISOString(), ...data });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

async function postWithRetry(payload: Record<string, unknown>, requestId: string) {
  let lastError = "";
  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
    try {
      const res = await fetch(FEEDBACK_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        log("info", requestId, "feedback.webhook_ok", { attempt, status: res.status });
        return { ok: true as const };
      }
      lastError = `HTTP ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`;
      log("warn", requestId, "feedback.webhook_failed", { attempt, detail: lastError });
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    } catch (e) {
      clearTimeout(timer);
      lastError = (e as Error)?.message || "network error";
      log("warn", requestId, "feedback.webhook_error", { attempt, detail: lastError });
    }
    if (attempt < WEBHOOK_MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1)));
  }
  return { ok: false as const, error: lastError };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  const requestId = crypto.randomUUID();

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") || "unknown";

    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : "";

    const errors: string[] = [];
    if (name.length < 2 || name.length > 100) errors.push("A valid full name is required.");
    if (!/^[\d\s\-+()]{7,20}$/.test(phone)) errors.push("A valid phone number is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) errors.push("A valid email address is required.");
    if (feedback.length < 5 || feedback.length > 2000) errors.push("Feedback must be between 5 and 2000 characters.");

    if (errors.length) {
      return new Response(JSON.stringify({ error: errors.join(" ") }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const result = await postWithRetry(
      {
        name,
        phone,
        email,
        feedback,
        source: "agenticailab.in",
        submittedAt: new Date().toISOString(),
        requestId,
      },
      requestId,
    );

    if (!result.ok) {
      log("error", requestId, "feedback.failed", { detail: result.error });
      return new Response(
        JSON.stringify({ error: "We couldn't submit your feedback right now. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    return new Response(JSON.stringify({ success: true, message: "Feedback submitted" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    log("error", requestId, "feedback.unhandled", { error: (e as Error)?.message });
    return new Response(JSON.stringify({ error: "Unexpected server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
