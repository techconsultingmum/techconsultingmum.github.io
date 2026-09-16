import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const RECIPIENT = "support@agenticailab.in";
const FALLBACK_RECIPIENT = "tech.consulting.mum@gmail.com";

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

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "rtf", "txt"];

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
      return new Response(
        JSON.stringify({ error: "Too many applications submitted. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (str(body.website)) {
      // Honeypot: pretend success without sending.
      return new Response(JSON.stringify({ success: true, requestId }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const jobTitle = str(body.jobTitle);
    const jobSlug = str(body.jobSlug);
    const name = str(body.name);
    const email = str(body.email);
    const phone = str(body.phone);
    const location = str(body.location);
    const linkedin = str(body.linkedin);
    const portfolio = str(body.portfolio);
    const experience = str(body.experience);
    const noticePeriod = str(body.noticePeriod);
    const expectedSalary = str(body.expectedSalary);
    const coverLetter = str(body.coverLetter);

    const resumeName = str(body.resumeName);
    const resumeType = str(body.resumeType) || "application/octet-stream";
    const resumeBase64 = str(body.resumeBase64);

    const errors: string[] = [];
    if (!jobTitle || jobTitle.length > 150) errors.push("A valid job title is required.");
    if (name.length < 2 || name.length > 100) errors.push("A valid full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) errors.push("A valid email address is required.");
    if (!/^[\d\s\-+()]{7,20}$/.test(phone)) errors.push("A valid phone number is required.");
    if (experience.length > 50) errors.push("Experience value is invalid.");
    if (coverLetter.length > 5000) errors.push("Cover letter must be under 5000 characters.");
    if (!resumeBase64 || !resumeName) errors.push("A resume file is required.");

    const extension = resumeName.split(".").pop()?.toLowerCase() ?? "";
    if (resumeName && !ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push("Resume must be a PDF, DOC, DOCX, RTF or TXT file.");
    }

    const approxBytes = Math.floor((resumeBase64.length * 3) / 4);
    if (approxBytes > MAX_RESUME_BYTES) errors.push("Resume must be smaller than 5MB.");

    if (errors.length) {
      return new Response(JSON.stringify({ error: errors.join(" ") }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rows: Array<[string, string]> = [
      ["Position", jobTitle],
      ["Full name", name],
      ["Email", email],
      ["Phone", phone],
      ["Location", location],
      ["LinkedIn", linkedin],
      ["Portfolio / GitHub", portfolio],
      ["Years of experience", experience],
      ["Notice period", noticePeriod],
      ["Expected compensation", expectedSalary],
    ].filter(([, v]) => v.length > 0) as Array<[string, string]>;

    const html = `
      <h2>New job application: ${escapeHtml(jobTitle)}</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
        ${
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="border:1px solid #ddd;font-weight:bold">${escapeHtml(k)}</td><td style="border:1px solid #ddd">${
              escapeHtml(v)
            }</td></tr>`,
        )
        .join("")
    }
      </table>
      ${coverLetter ? `<h3>Cover letter</h3><p style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${escapeHtml(coverLetter)}</p>` : ""}
      <p style="color:#888;font-size:12px">Submitted ${new Date().toISOString()} · ref ${requestId}${jobSlug ? ` · /careers/${escapeHtml(jobSlug)}` : ""}</p>
    `;

    const payload = (to: string[]) => ({
      from: "Careers <onboarding@resend.dev>",
      to,
      reply_to: email,
      subject: `Job Application — ${jobTitle} — ${name}`,
      html,
      attachments: [
        {
          filename: resumeName,
          content: resumeBase64,
          content_type: resumeType,
        },
      ],
    } as Record<string, unknown>);

    let sent = await resend.emails.send(payload([RECIPIENT]));

    // Until the sending domain is verified, Resend only allows delivery to the
    // account owner address. Fall back so applications are never lost.
    const firstError = (sent as { error?: { message?: string } })?.error;
    if (firstError && /only send testing emails/i.test(firstError.message ?? "")) {
      log("warn", requestId, "application.fallback_recipient", {});
      sent = await resend.emails.send(payload([FALLBACK_RECIPIENT]));
    }

    if ((sent as { error?: unknown })?.error) {
      log("error", requestId, "application.email_failed", { detail: JSON.stringify((sent as { error: unknown }).error) });
      return new Response(
        JSON.stringify({ error: "We couldn't submit your application right now. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    log("info", requestId, "application.sent", { jobSlug, hasResume: true });

    return new Response(JSON.stringify({ success: true, requestId }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    log("error", requestId, "application.unhandled", { error: (e as Error)?.message });
    return new Response(JSON.stringify({ error: "Unexpected server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
