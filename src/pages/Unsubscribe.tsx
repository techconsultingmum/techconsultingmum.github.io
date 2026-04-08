// src/pages/Unsubscribe.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [message, setMessage] = useState(
    "Processing your unsubscribe request..."
  );

  useEffect(() => {
    if (email) {
      const apiUrl = `https://licimis.app.n8n.cloud/webhook/Newsletter?action=unsubscribe&Email=${encodeURIComponent(email)}`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then(() => {
          setMessage(
            "You have been unsubscribed successfully. You may now close this tab.
            Cheers,
            The AgenticAI Lab Team
            © 2026 AgenticAI Lab. All rights reserved."
          );
        })
        .catch(() => {
          setMessage(
            "There was an error unsubscribing. Please close this tab and try again later."
          );
        });
    } else {
      setMessage(
        "Email not provided. Cannot process unsubscribe request."
      );
    }
  }, [email]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#1a73e8" }}>{message}</h1>
    </div>
  );
};

export default UnsubscribePage;
