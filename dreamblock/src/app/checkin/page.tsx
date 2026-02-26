"use client";
import { useState } from "react";
import Link from "next/link";
import { saveCheckin } from "@/lib/storage";

const T = { bg: "var(--db-bg)", surface: "var(--db-surface)", border: "var(--db-border)", text: "var(--db-text)", sub: "var(--db-sub)", muted: "var(--db-muted)" };

const EMOTIONS = ["Fear", "Shame", "Overwhelm", "Frustration", "Numbness", "Excitement"];
const STUCK_POINTS = ["Starting", "Consistency", "Finishing", "Sharing", "Committing"];

export default function CheckInPage() {
  const [form, setForm] = useState({ avoided: "", resistance_showed: "", emotion: "", stuck_point: "", tiny_step: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    saveCheckin({ ...form, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, maxWidth: 430, margin: "0 auto" }}>
        <p style={{ fontSize: 22, fontWeight: 300, color: T.text, marginBottom: 12 }}>Noted.</p>
        <p style={{ fontSize: 14, color: T.sub, textAlign: "center", marginBottom: 32, lineHeight: 1.6 }}>Naming resistance is the first move.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/check" style={{ padding: "14px 20px", borderRadius: 12, background: T.text, color: "#050510", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>New check →</Link>
          <Link href="/" style={{ padding: "14px 20px", borderRadius: 12, background: "transparent", color: T.sub, fontSize: 14, textDecoration: "none", border: "1px solid rgba(255,255,255,0.07)" }}>Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ padding: "calc(env(safe-area-inset-top,0px)+20px) 24px 20px" }}>
        <Link href="/" style={{ fontSize: 13, color: T.muted, textDecoration: "none" }}>← Back</Link>
        <h1 style={{ fontSize: 26, fontWeight: 300, color: T.text, marginTop: 16, letterSpacing: "-0.02em" }}>Daily Check-In</h1>
        <p style={{ fontSize: 14, color: T.sub, marginTop: 6 }}>A few honest questions. No performance required.</p>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 28 }}>

        {[
          { field: "avoided", label: "What did you avoid today?", placeholder: "Be specific. Not 'working on my project' — the exact action." },
          { field: "resistance_showed", label: "Where did resistance show up?", placeholder: "What happened, what did you do instead, what thought appeared?" },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted, fontWeight: 500, marginBottom: 10 }}>{label}</p>
            <textarea
              value={(form as Record<string, string>)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder={placeholder}
              style={{ width: "100%", background: T.surface, color: T.text, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", minHeight: 100, resize: "none" }}
            />
          </div>
        ))}

        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted, fontWeight: 500, marginBottom: 10 }}>Strongest emotion</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOTIONS.map((e) => (
              <button key={e} onClick={() => setForm({ ...form, emotion: e })}
                style={{ padding: "10px 18px", borderRadius: 100, minHeight: 44, border: `1px solid ${form.emotion === e ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.07)"}`, background: form.emotion === e ? "rgba(255,255,255,0.08)" : "transparent", color: form.emotion === e ? T.text : T.sub, fontSize: 14, cursor: "pointer" }}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted, fontWeight: 500, marginBottom: 10 }}>Where did you get stuck?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STUCK_POINTS.map((s) => (
              <button key={s} onClick={() => setForm({ ...form, stuck_point: s })}
                style={{ padding: "10px 18px", borderRadius: 100, minHeight: 44, border: `1px solid ${form.stuck_point === s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.07)"}`, background: form.stuck_point === s ? "rgba(255,255,255,0.08)" : "transparent", color: form.stuck_point === s ? T.text : T.sub, fontSize: 14, cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.muted, fontWeight: 500, marginBottom: 10 }}>What tiny step feels possible?</p>
          <textarea
            value={form.tiny_step}
            onChange={(e) => setForm({ ...form, tiny_step: e.target.value })}
            placeholder="The smallest, most concrete next move."
            style={{ width: "100%", background: T.surface, color: T.text, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", minHeight: 80, resize: "none" }}
          />
        </div>
      </div>

      <div style={{ padding: "16px 24px", paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 20px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <button onClick={handleSubmit} disabled={!form.avoided.trim()}
          style={{ width: "100%", padding: "18px", borderRadius: 16, minHeight: 56, background: form.avoided.trim() ? T.text : "rgba(255,255,255,0.1)", color: form.avoided.trim() ? "#050510" : T.muted, fontSize: 16, fontWeight: 600, border: "none", cursor: form.avoided.trim() ? "pointer" : "not-allowed" }}>
          Save Check-In
        </button>
      </div>
    </main>
  );
}
