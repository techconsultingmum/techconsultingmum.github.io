import { useEffect, useState, FormEvent, ReactNode } from "react";
import { Loader2, CheckCircle2, MessageSquareHeart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Values = { name: string; phone: string; email: string; feedback: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", phone: "", email: "", feedback: "" };

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^[\d\s\-+()]{7,20}$/.test(values.phone.trim()))
    errors.phone = "Please enter a valid phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.feedback.trim().length < 5) errors.feedback = "Please share a little more detail.";
  return errors;
}

interface FeedbackDialogProps {
  children: ReactNode;
}

const FeedbackDialog = ({ children }: FeedbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setValues(EMPTY);
        setErrors({});
        setStatus("idle");
        setServerError(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Auto-close shortly after a successful submission
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => setOpen(false), 2000);
    return () => clearTimeout(t);
  }, [status]);

  const set = (key: keyof Values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError(null);

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      // Move focus to the first invalid field so keyboard and screen-reader
      // users land directly on the problem.
      const order: (keyof Values)[] = ["name", "phone", "email", "feedback"];
      const first = order.find((key) => nextErrors[key]);
      if (first) {
        const id = first === "feedback" ? "feedback-message" : `feedback-${first}`;
        requestAnimationFrame(() => document.getElementById(id)?.focus());
      }
      return;
    }

    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("send-feedback", {
        body: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          feedback: values.feedback.trim(),
        },
      });

      if (error) {
        let detail = "";
        try {
          detail = (await (error as { context?: Response }).context?.text?.()) || "";
          const parsed = detail ? JSON.parse(detail) : null;
          if (parsed?.error) detail = parsed.error;
        } catch {
          /* ignore parse issues */
        }
        throw new Error(detail || error.message || "Submission failed.");
      }
      if (data && (data as { error?: string }).error) {
        throw new Error((data as { error: string }).error);
      }

      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setServerError(
        err instanceof Error ? err.message : "We couldn't submit your feedback. Please try again.",
      );
    }
  };

  const submitting = status === "submitting";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-primary" aria-hidden="true" />
            Share your feedback
          </DialogTitle>
          <DialogDescription>
            Tell us what's working and what we can improve. We read every message.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center text-center gap-3 py-8"
          >
            <CheckCircle2 className="w-12 h-12 text-primary" aria-hidden="true" />
            <p className="text-lg font-semibold text-foreground">Thank you!</p>
            <p className="text-sm text-muted-foreground">
              Your feedback has been submitted. This window will close automatically.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="feedback-name">Your full name *</Label>
              <Input
                id="feedback-name"
                value={values.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Jane Doe"
                maxLength={100}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "feedback-name-error" : undefined}
                disabled={submitting}
              />
              {errors.name && (
                <p id="feedback-name-error" className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-phone">Your phone / mobile no. *</Label>
              <Input
                id="feedback-phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+91 98765 43210"
                maxLength={20}
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "feedback-phone-error" : undefined}
                disabled={submitting}
              />
              {errors.phone && (
                <p id="feedback-phone-error" className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-email">Your email *</Label>
              <Input
                id="feedback-email"
                type="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="jane@company.com"
                maxLength={255}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "feedback-email-error" : undefined}
                disabled={submitting}
              />
              {errors.email && (
                <p id="feedback-email-error" className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">What's your feedback? *</Label>
              <Textarea
                id="feedback-message"
                value={values.feedback}
                onChange={(e) => set("feedback")(e.target.value)}
                placeholder="Share your thoughts, suggestions, or issues..."
                rows={4}
                maxLength={2000}
                aria-invalid={Boolean(errors.feedback)}
                aria-describedby={errors.feedback ? "feedback-message-error" : undefined}
                disabled={submitting}
              />
              {errors.feedback && (
                <p id="feedback-message-error" className="text-xs text-destructive">
                  {errors.feedback}
                </p>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                tabIndex={-1}
                ref={(node) => node?.focus()}
                className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2"
              >
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                "Submit feedback"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
