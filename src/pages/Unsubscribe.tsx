// src/pages/Unsubscribe.tsx
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Status = "idle" | "loading" | "success" | "error" | "missing";

function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length > 0 && v.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const rawEmail = searchParams.get("email") ?? searchParams.get("Email");
  const email = rawEmail?.trim() ?? "";

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Processing your unsubscribe request...");
  const [attempt, setAttempt] = useState(0);

  const run = useCallback(async () => {
    if (!email) {
      setStatus("missing");
      setMessage("We couldn't find an email in this link.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("The email in this link doesn't look valid.");
      return;
    }
    setStatus("loading");
    setMessage("Processing your unsubscribe request...");
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email, action: "unsubscribe" },
      });
      if (error || !data?.success) {
        const msg =
          (data as { error?: string } | null)?.error ||
          error?.message ||
          "There was a problem unsubscribing you.";
        setStatus("error");
        setMessage(msg);
        return;
      }
      setStatus("success");
      setMessage("You have been unsubscribed successfully.");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "There was a problem unsubscribing you. Please try again."
      );
    }
  }, [email]);

  useEffect(() => {
    void run();
  }, [run, attempt]);

  const Icon =
    status === "success" ? CheckCircle :
    status === "error" ? XCircle :
    status === "missing" ? AlertCircle :
    status === "loading" ? Loader2 : Mail;

  const tone =
    status === "success" ? "text-emerald-500 bg-emerald-500/10"
    : status === "error" ? "text-destructive bg-destructive/10"
    : status === "missing" ? "text-amber-500 bg-amber-500/10"
    : "text-primary bg-primary/10";

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-background px-4 py-12"
    >
      <section
        className="text-center max-w-md mx-auto w-full"
        aria-live="polite"
        aria-busy={status === "loading"}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${tone}`}
          aria-hidden="true"
        >
          <Icon className={`w-8 h-8 ${status === "loading" ? "animate-spin" : ""}`} />
        </div>

        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
          {status === "success" && "You're unsubscribed"}
          {status === "loading" && "Unsubscribing..."}
          {status === "error" && "We couldn't complete that"}
          {status === "missing" && "Missing unsubscribe link"}
        </h1>

        <p className="text-muted-foreground" role="status">
          {message}
        </p>

        {email && (status === "success" || status === "loading" || status === "error") && (
          <p className="mt-2 text-sm text-muted-foreground">
            Email: <span className="font-medium text-foreground break-all">{email}</span>
          </p>
        )}

        {status === "error" && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Try again
            </button>
            <a
              href="mailto:support@agenticailab.in?subject=Unsubscribe%20help"
              className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact support
            </a>
          </div>
        )}

        {status === "missing" && (
          <p className="mt-4 text-sm text-muted-foreground">
            Please use the unsubscribe link from our newsletter email, or contact{" "}
            <a href="mailto:support@agenticailab.in" className="text-primary hover:underline">
              support@agenticailab.in
            </a>{" "}
            for assistance.
          </p>
        )}

        {status === "success" && (
          <div className="mt-8 space-y-1 text-muted-foreground">
            <p>Wishing you all the best,</p>
            <p className="font-semibold text-foreground">The AgenticAI Lab Team</p>
            <p className="text-xs">© {new Date().getFullYear()} AgenticAI Lab. All rights reserved.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default UnsubscribePage;
