// src/pages/Unsubscribe.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, CheckCircle, XCircle } from "lucide-react";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [message, setMessage] = useState(
    "Processing your unsubscribe request..."
  );

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (email) {
      const apiUrl = `https://kasewa.app.n8n.cloud/webhook/Newsletter?action=unsubscribe&Email=${encodeURIComponent(
        email
      )}`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then(() => {
          setMessage(
            "You have been unsubscribed successfully. You may now close this tab."
          );
          setStatus("success");
        })
        .catch(() => {
          setMessage(
            "There was an error unsubscribing. Please close this tab and try again later."
          );
          setStatus("error");
        });
    } else {
      setMessage("Email not provided. Cannot process unsubscribe request.");
      setStatus("error");
    }
  }, [email]);

  const StatusIcon = status === "success" ? CheckCircle : status === "error" ? XCircle : Mail;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <StatusIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
          {message}
        </h1>

        {status === "success" && (
          <div className="mt-8 space-y-2 text-muted-foreground">
            <p>Wishing you all the best,</p>
            <p className="font-semibold text-foreground">The AgenticAI Lab Team</p>
            <p className="text-sm">© {new Date().getFullYear()} AgenticAI Lab. All rights reserved.</p>
          </div>
        )}

        {status === "error" && email && (
          <p className="mt-4 text-sm text-muted-foreground">
            If the problem persists, please contact us at{" "}
            <a href="mailto:support@agenticailab.in" className="text-primary hover:underline">
              support@agenticailab.in
            </a>
          </p>
        )}

        {!email && (
          <p className="mt-4 text-sm text-muted-foreground">
            Please use the unsubscribe link from our newsletter email, or contact{" "}
            <a href="mailto:support@agenticailab.in" className="text-primary hover:underline">
              support@agenticailab.in
            </a>{" "}
            for assistance.
          </p>
        )}
      </div>
    </div>
  );
};

export default UnsubscribePage;
