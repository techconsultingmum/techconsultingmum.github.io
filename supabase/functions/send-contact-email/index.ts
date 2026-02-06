import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Webhook URL stored server-side only
const WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL") || "https://mogim.app.n8n.cloud/webhook/agenticai-lead-form";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  "https://agenticailab.in",
  "https://www.agenticailab.in",
  "https://agenticailab.com",
  "https://www.agenticailab.com",
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

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  message: string;
  formType: string;
  budget?: string;
  timeline?: string;
  serviceInterest?: string;
  problemStatement?: string;
  website?: string; // Honeypot field - should be empty
}

// Input validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.length <= 20;
}

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateAndSanitizeInput(data: ContactEmailRequest): { 
  valid: boolean; 
  errors: string[]; 
  sanitized: ContactEmailRequest;
  isBot: boolean;
} {
  const errors: string[] = [];
  
  // Honeypot check - if website field is filled, it's likely a bot
  if (data.website && data.website.trim().length > 0) {
    console.warn("Honeypot triggered - likely bot submission");
    return { valid: false, errors: ["Invalid submission"], sanitized: data, isBot: true };
  }
  
  // Validate required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push("Name is required");
  } else if (data.name.trim().length === 0 || data.name.length > 100) {
    errors.push("Name must be between 1 and 100 characters");
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push("Email is required");
  } else if (!validateEmail(data.email)) {
    errors.push("Invalid email format or too long");
  }
  
  if (!data.message || typeof data.message !== 'string') {
    errors.push("Message is required");
  } else if (data.message.trim().length === 0 || data.message.length > 5000) {
    errors.push("Message must be between 1 and 5000 characters");
  }
  
  if (!data.formType || typeof data.formType !== 'string') {
    errors.push("Form type is required");
  } else if (data.formType.length > 50) {
    errors.push("Form type is too long");
  }
  
  // Validate optional fields
  if (data.phone && !validatePhone(data.phone)) {
    errors.push("Invalid phone format");
  }
  
  if (data.company && (typeof data.company !== 'string' || data.company.length > 100)) {
    errors.push("Company name must be less than 100 characters");
  }
  
  if (data.jobTitle && (typeof data.jobTitle !== 'string' || data.jobTitle.length > 100)) {
    errors.push("Job title must be less than 100 characters");
  }
  
  if (data.industry && (typeof data.industry !== 'string' || data.industry.length > 100)) {
    errors.push("Industry must be less than 100 characters");
  }
  
  if (data.budget && (typeof data.budget !== 'string' || data.budget.length > 50)) {
    errors.push("Budget selection is invalid");
  }
  
  if (data.timeline && (typeof data.timeline !== 'string' || data.timeline.length > 50)) {
    errors.push("Timeline selection is invalid");
  }
  
  if (data.serviceInterest && (typeof data.serviceInterest !== 'string' || data.serviceInterest.length > 100)) {
    errors.push("Service interest is invalid");
  }
  
  if (data.problemStatement && (typeof data.problemStatement !== 'string' || data.problemStatement.length > 1000)) {
    errors.push("Problem statement must be less than 1000 characters");
  }
  
  // Sanitize all inputs for HTML email rendering
  const sanitized: ContactEmailRequest = {
    name: sanitizeHtml((data.name || '').trim().slice(0, 100)),
    email: (data.email || '').trim().slice(0, 255).toLowerCase(),
    phone: data.phone ? sanitizeHtml(data.phone.trim().slice(0, 20)) : undefined,
    company: data.company ? sanitizeHtml(data.company.trim().slice(0, 100)) : undefined,
    jobTitle: data.jobTitle ? sanitizeHtml(data.jobTitle.trim().slice(0, 100)) : undefined,
    industry: data.industry ? sanitizeHtml(data.industry.trim().slice(0, 100)) : undefined,
    message: sanitizeHtml((data.message || '').trim().slice(0, 5000)),
    formType: sanitizeHtml((data.formType || '').trim().slice(0, 50)),
    budget: data.budget ? sanitizeHtml(data.budget.trim().slice(0, 50)) : undefined,
    timeline: data.timeline ? sanitizeHtml(data.timeline.trim().slice(0, 50)) : undefined,
    serviceInterest: data.serviceInterest ? sanitizeHtml(data.serviceInterest.trim().slice(0, 100)) : undefined,
    problemStatement: data.problemStatement ? sanitizeHtml(data.problemStatement.trim().slice(0, 1000)) : undefined,
  };
  
  return { valid: errors.length === 0, errors, sanitized, isBot: false };
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  
  if (!record || now > record.resetTime) {
    // Create new rate limit window
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false; // Rate limited
  }
  
  record.count++;
  return true;
}

async function sendToWebhook(payload: Record<string, unknown>): Promise<void> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.warn(`Webhook returned status ${response.status}`);
    } else {
      console.log("Webhook notification sent successfully");
    }
  } catch (error) {
    // Fire and forget - don't fail the main request
    console.error("Webhook error (non-blocking):", error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
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
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const rawData = await req.json();
    
    // Validate and sanitize input
    const { valid, errors, sanitized, isBot } = validateAndSanitizeInput(rawData);
    
    // Silently accept but don't process bot submissions (honeypot)
    if (isBot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    if (!valid) {
      console.warn("Validation failed:", errors);
      return new Response(
        JSON.stringify({ error: "Invalid input. Please check your form data." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { name, email, phone, company, jobTitle, industry, message, formType, budget, timeline, serviceInterest, problemStatement } = sanitized;

    console.log("Received contact form submission:", { 
      name: name.slice(0, 20) + "...", 
      emailDomain: email.split("@")[1], 
      formType 
    });

    // Send to n8n webhook (fire and forget)
    sendToWebhook({
      name,
      email,
      phone: phone || null,
      company: company || null,
      jobTitle: jobTitle || null,
      industry: industry || null,
      budget: budget || null,
      timeline: timeline || null,
      serviceInterest: serviceInterest || null,
      problemStatement: problemStatement || null,
      message,
      formType,
      submittedAt: new Date().toISOString(),
      source: 'agenticailab.in',
    });

    // Send notification email to the business
    const notificationEmail = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["tech.consulting.mum@gmail.com"],
      subject: `New ${formType} Request from ${name}`,
      html: `
        <h2>New ${formType} Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${jobTitle ? `<p><strong>Job Title:</strong> ${jobTitle}</p>` : ''}
        ${industry ? `<p><strong>Industry:</strong> ${industry}</p>` : ''}
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        ${serviceInterest ? `<p><strong>Service Interest:</strong> ${serviceInterest}</p>` : ''}
        ${problemStatement ? `<p><strong>Problem Statement:</strong></p><p>${problemStatement}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Sent from your website contact form</em></p>
      `,
    });

    console.log("Notification email sent:", notificationEmail.data?.id || "success");

    // Send confirmation email to the user
    const confirmationEmail = await resend.emails.send({
      from: "AgenticAI Lab <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your ${formType.toLowerCase()} request and will get back to you within 24 hours.</p>
        <p>Here's a summary of your message:</p>
        <blockquote style="background: #f9f9f9; padding: 15px; border-left: 3px solid #333;">
          ${message}
        </blockquote>
        <p>Best regards,<br>The AgenticAI Lab Team</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail.data?.id || "success");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    // Log full error details server-side for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error in send-contact-email function:", {
      message: errorMessage,
      stack: errorStack,
    });
    
    // Return generic error message to client - never expose internal details
    return new Response(
      JSON.stringify({ error: "Unable to send message. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
