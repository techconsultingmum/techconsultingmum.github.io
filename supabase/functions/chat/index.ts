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

// Include Lovable preview domains
const LOVABLE_PREVIEW_PATTERN = /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.lovable\.app$/;
const ALERT_TO = "support@agenticailab.in";
const ALERT_FROM = "AgenticAI Lab Alerts <onboarding@resend.dev>";
const alertThrottle = new Map<string, number>();
const ALERT_THROTTLE_MS = 15 * 60 * 1000;

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
  };
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin) || LOVABLE_PREVIEW_PATTERN.test(origin);
}

function log(level: "info" | "warn" | "error", event: string, data: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, event, ts: new Date().toISOString(), ...data });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

async function sendAlert(event: string, details: Record<string, unknown>) {
  const key = `${event}:${String(details.clientIp || details.origin || "unknown")}`;
  const now = Date.now();
  const last = alertThrottle.get(key) || 0;
  if (now - last < ALERT_THROTTLE_MS) return;
  alertThrottle.set(key, now);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: ALERT_FROM,
        to: [ALERT_TO],
        subject: `[AgenticAI Lab] ${event}`,
        html: `<pre>${JSON.stringify({ event, ...details }, null, 2)}</pre>`,
      }),
    });
  } catch (error) {
    log("warn", "alert.email_failed", { event, error: (error as Error)?.message });
  }
}

const SYSTEM_PROMPT = `You are AgenticAI Lab's AI assistant — a friendly, concise expert on AgenticAI Lab's services.

About AgenticAI Lab:
- Building the future of autonomous AI systems for enterprise transformation.
- Services: Agent Development, Multi-Agent Systems, AI Integration, Strategy Consulting.
- Contact: info@agenticailab.in, +91 8652074439.
- Website sections: Home, About, Case Studies, Careers, Blog, Contact, Get Started.

Guidelines:
- Keep replies short, helpful, and professional.
- Use markdown sparingly (lists, bold) where it improves clarity.
- For pricing, custom projects, or scheduling — direct users to /contact or /get-started.
- Never invent capabilities, clients, or pricing. If unsure, suggest contacting the team.
- Refuse unrelated, unsafe, or off-topic requests politely.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function isValidMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 40) return false;
  return value.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m as ChatMessage).role &&
      ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
      typeof (m as ChatMessage).content === "string" &&
      (m as ChatMessage).content.length > 0 &&
      (m as ChatMessage).content.length <= 4000,
  );
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 8; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// Short burst limiter to blunt cold-start resets
const burstMap = new Map<string, { count: number; resetTime: number }>();
const BURST_MAX = 4;
const BURST_WINDOW_MS = 60 * 1000; // 1 minute

function checkBurst(clientIp: string): boolean {
  const now = Date.now();
  const rec = burstMap.get(clientIp);
  if (!rec || now > rec.resetTime) {
    burstMap.set(clientIp, { count: 1, resetTime: now + BURST_WINDOW_MS });
    return true;
  }
  if (rec.count >= BURST_MAX) return false;
  rec.count++;
  return true;
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  const requestId = crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Enforce same-origin: block direct/scripted calls from disallowed origins
    // (browsers always send Origin on cross-origin fetch/XHR). This prevents
    // third-party sites and most bots from consuming the AI budget.
    if (!isAllowedOrigin(origin)) {
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                       req.headers.get("cf-connecting-ip") ||
                       "unknown";
      log("warn", "chat.forbidden_origin", { requestId, origin, clientIp });
      await sendAlert("chat.forbidden_origin", { requestId, origin, clientIp });
      return new Response(JSON.stringify({ error: "Forbidden origin." }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Require the project publishable/anon key so random callers without the
    // token cannot hit the endpoint. This is not a user auth boundary, but it
    // filters out drive-by abuse.
    const expectedKeys = [
      Deno.env.get("SUPABASE_ANON_KEY"),
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY"),
    ].filter((v): v is string => typeof v === "string" && v.length > 0);
    const authHeader = req.headers.get("authorization") || "";
    const bearer = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";
    const apiKeyHeader = req.headers.get("apikey")?.trim() || "";
    if (expectedKeys.length === 0 || (!expectedKeys.includes(bearer) && !expectedKeys.includes(apiKeyHeader))) {
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                       req.headers.get("cf-connecting-ip") ||
                       "unknown";
      log("warn", "chat.unauthorized", { requestId, origin, clientIp, hasBearer: Boolean(bearer), hasApikey: Boolean(apiKeyHeader) });
      await sendAlert("chat.unauthorized", { requestId, origin, clientIp, hasBearer: Boolean(bearer), hasApikey: Boolean(apiKeyHeader) });
      return new Response(JSON.stringify({ error: "Unauthorized." }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                       req.headers.get("cf-connecting-ip") ||
                       "unknown";

    // Burst + hourly rate limits
    if (!checkBurst(clientIp) || !checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      log("warn", "chat.rate_limited", { requestId, clientIp, origin });
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json().catch(() => null);
    if (!body || !isValidMessages(body.messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages payload." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...body.messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service unavailable. Please contact support." }),
          { status: 402, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      log("error", "chat.ai_gateway_error", { requestId, status: response.status, detail: errText.slice(0, 500) });
      return new Response(JSON.stringify({ error: "AI service error." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    log("error", "chat.unhandled_error", { requestId, error: (e as Error)?.message });
    return new Response(JSON.stringify({ error: "Unexpected server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
