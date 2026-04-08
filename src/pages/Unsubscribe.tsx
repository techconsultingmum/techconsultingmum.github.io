// src/pages/Unsubscribe.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [message, setMessage] = useState(
    "Processing your unsubscribe request..."
  );

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (email) {
      const apiUrl = `https://licimis.app.n8n.cloud/webhook/Newsletter?action=unsubscribe&Email=${encodeURIComponent(
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#1a73e8",
      }}
    >
      <h1>{message}</h1>

      {status === "success" && (
        <div style={{ marginTop: "20px", fontSize: "16px", color: "#333" }}>
          <p>Cheers,</p>
          <p><strong>The AgenticAI Lab Team</strong></p>
          <p>© 2026 AgenticAI Lab. All rights reserved.</p>
        </div>
      )}
    </div>
  );
};

export default UnsubscribePage;
