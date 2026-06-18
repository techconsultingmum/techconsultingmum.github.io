import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  "https://agenticailab.in",
  "https://www.agenticailab.in",
  "https://agenticailab.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

const LOVABLE_PREVIEW_PATTERN = /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.lovable\.app$/;

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    LOVABLE_PREVIEW_PATTERN.test(origin)
  ) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
}

const NEWSLETTER_WEBHOOK = "https://miwibav.app.n8n.cloud/webhook/Newsletter";
const WEBHOOK_TIMEOUT_MS = 8000;
const WEBHOOK_MAX_ATTEMPTS = 3;

// Simple in-memory rate limiting (per-IP, sliding window)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  // Opportunistic cleanup
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap) if (now > v.resetTime) rateLimitMap.delete(k);
  }
  const record = rateLimitMap.get(clientIp);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

function validateEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 255) return false;
  // RFC-5322-ish pragmatic check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function log(level: "info" | "warn" | "error", requestId: string, event: string, data: Record<string, unknown> = {}) {
  const payload = { level, requestId, event, ts: new Date().toISOString(), ...data };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callNewsletterWebhook(
  email: string,
  action: "subscribe" | "unsubscribe",
  requestId: string,
): Promise<{ ok: boolean; status: number }> {
  const params = new URLSearchParams();
  params.set("email", email);
  params.set("Email", email);
  params.set("action", action);
  const url = `${NEWSLETTER_WEBHOOK}?${params.toString()}`;

  let lastStatus = 0;
  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt++) {
    const startedAt = Date.now();
    try {
      const response = await fetchWithTimeout(
        url,
        { method: "GET", headers: { "Accept": "application/json" } },
        WEBHOOK_TIMEOUT_MS,
      );
      const durationMs = Date.now() - startedAt;
      lastStatus = response.status;
      // Drain body to avoid resource leaks
      try { await response.text(); } catch { /* ignore */ }

      if (response.ok) {
        log("info", requestId, "newsletter.webhook.success", { action, attempt, status: response.status, durationMs });
        return { ok: true, status: response.status };
      }
      if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
        log("error", requestId, "newsletter.webhook.client_error", { action, attempt, status: response.status, durationMs });
        return { ok: false, status: response.status };
      }
      log("warn", requestId, "newsletter.webhook.retryable_status", { action, attempt, status: response.status, durationMs });
    } catch (err) {
      const isAbort = (err as Error)?.name === "AbortError";
      log("warn", requestId, isAbort ? "newsletter.webhook.timeout" : "newsletter.webhook.network_error", {
        action, attempt, durationMs: Date.now() - startedAt, error: (err as Error)?.message,
      });
    }
    if (attempt < WEBHOOK_MAX_ATTEMPTS) {
      const backoff = Math.min(1500, 250 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 150);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  log("error", requestId, "newsletter.webhook.exhausted", { action, attempts: WEBHOOK_MAX_ATTEMPTS, lastStatus });
  return { ok: false, status: lastStatus || 502 };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  const jsonHeaders = { "Content-Type": "application/json", ...corsHeaders };
  const requestId = crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: jsonHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("cf-connecting-ip") ||
                     "unknown";

    if (!checkRateLimit(clientIp)) {
      log("warn", requestId, "newsletter.rate_limited", { clientIp });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: jsonHeaders },
      );
    }

    const body = await req.json().catch(() => null) as
      | { email?: unknown; action?: unknown } | null;

    if (!body || typeof body.email !== "string" || !validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: jsonHeaders },
      );
    }

    const action: "subscribe" | "unsubscribe" =
      body.action === "unsubscribe" ? "unsubscribe" : "subscribe";
    const email = body.email.trim().toLowerCase();

    log("info", requestId, "newsletter.received", { action, emailDomain: email.split("@")[1] });

    const result = await callNewsletterWebhook(email, action, requestId);

    if (!result.ok) {
      return new Response(
        JSON.stringify({
          error: action === "unsubscribe"
            ? "We couldn't process your unsubscribe right now. Please try again shortly."
            : "We couldn't complete your subscription right now. Please try again shortly.",
          requestId,
        }),
        { status: 502, headers: jsonHeaders },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        action,
        message: action === "unsubscribe"
          ? "You have been unsubscribed successfully."
          : "Subscribed successfully!",
        requestId,
      }),
      { status: 200, headers: jsonHeaders },
    );
  } catch (error) {
    log("error", requestId, "newsletter.unhandled_error", { error: (error as Error)?.message });
    return new Response(
      JSON.stringify({ error: "Unable to process request. Please try again later.", requestId }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
