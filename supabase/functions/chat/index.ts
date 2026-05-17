import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  "https://agenticailab.in",
  "https://www.agenticailab.in",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Include Lovable preview domains
const LOVABLE_PREVIEW_PATTERN = /^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.lovable\.app$/;

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    LOVABLE_PREVIEW_PATTERN.test(origin)
  ) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
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
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

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

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                       req.headers.get("cf-connecting-ip") ||
                       "unknown";

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
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
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
    return new Response(JSON.stringify({ error: "Unexpected server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
