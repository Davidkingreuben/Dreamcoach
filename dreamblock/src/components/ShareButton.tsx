"use client";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "DREAMBLOCK", text: "Finally understand why you haven't started.", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleShare}
      style={{
        fontSize: 13, color: copied ? "#4A8C6E" : "var(--db-muted)",
        background: "none", border: "none", cursor: "pointer",
        padding: "8px 0", minHeight: 44, transition: "color 0.2s ease",
      }}>
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
