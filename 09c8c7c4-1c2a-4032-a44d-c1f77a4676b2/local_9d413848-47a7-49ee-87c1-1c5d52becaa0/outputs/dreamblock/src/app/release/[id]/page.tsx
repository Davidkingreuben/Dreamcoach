"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDream, awardBadge, logEvent } from "@/lib/storage";

const REFLECTIONS = [
  { prompt: "This dream taught me...", placeholder: "What did carrying this reveal about you?" },
  { prompt: "I no longer need to carry...", placeholder: "What belief, pressure, or expectation can you set down?" },
  { prompt: "The energy freed goes to...", placeholder: "Where does this attention flow now?" },
];

export default function ReleasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [released, setReleased] = useState(false);

  function handleRelease() {
    updateDream(params.id, {
      status: "released",
      released_at: new Date().toISOString(),
      release_reflection: {
        taught_me: answers[0],
        no_longer_carry: answers[1],
        energy_goes_to: answers[2],
      },
    });
    awardBadge(params.id, "dream_released");
    logEvent("dream_released", params.id);
    setReleased(true);
  }

  if (step === -1) return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", color: "var(--db-text)", display: "flex", flexDirection: "column", padding: "40px 24px", maxWidth: 430, margin: "0 auto" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--db-sub)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 40, alignSelf: "flex-start" }}>
        ← Back
      </button>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 11, color: "var(--db-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Dream Release</div>
        <div style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>Some dreams are meant to be released, not pursued.</div>
        <div style={{ fontSize: 14, color: "var(--db-sub)", lineHeight: 1.7, marginBottom: 12 }}>
          Releasing a dream isn&apos;t failure. It&apos;s clarity. It&apos;s choosing to put down what no longer fits — so you can carry what does.
        </div>
        <div style={{ fontSize: 13, color: "var(--db-muted)", lineHeight: 1.6, marginBottom: 40 }}>
          Three short reflections. When you&apos;re done, this dream will be marked as released — with intention, not abandonment.
        </div>
      </div>
      <button onClick={() => setStep(0)} style={{ width: "100%", padding: "16px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid var(--db-border)", color: "var(--db-text)", fontSize: 15, cursor: "pointer" }}>
        Begin Release →
      </button>
    </div>
  );

  if (released) return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", color: "var(--db-text)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>✧</div>
      <div style={{ fontSize: 22, fontWeight: 300, marginBottom: 12 }}>Released.</div>
      <div style={{ fontSize: 14, color: "var(--db-sub)", lineHeight: 1.7, marginBottom: 8, maxWidth: 300 }}>
        This dream is complete — not because you finished it, but because you chose to let it go with intention.
      </div>
      <div style={{ fontSize: 12, color: "var(--db-muted)", lineHeight: 1.6, marginBottom: 40, maxWidth: 280 }}>
        The energy you were holding is now free.
      </div>
      <button onClick={() => router.push("/dashboard")} style={{ padding: "14px 32px", borderRadius: 12, background: "none", border: "1px solid var(--db-border)", color: "var(--db-sub)", fontSize: 14, cursor: "pointer" }}>
        Return to Dashboard
      </button>
    </div>
  );

  const current = REFLECTIONS[step];
  const canContinue = answers[step].trim().length > 5;
  const isLast = step === REFLECTIONS.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", color: "var(--db-text)", display: "flex", flexDirection: "column", padding: "40px 24px", maxWidth: 430, margin: "0 auto" }}>
      <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "none", color: "var(--db-sub)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 40, alignSelf: "flex-start" }}>
        ← Back
      </button>
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {REFLECTIONS.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= step ? "var(--db-text)" : "var(--db-border)" }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: "var(--db-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
        Reflection {step + 1} of {REFLECTIONS.length}
      </div>
      <div style={{ fontSize: 20, fontWeight: 400, marginBottom: 24, lineHeight: 1.4 }}>{current.prompt}</div>
      <textarea
        value={answers[step]}
        onChange={(e) => {
          const updated = [...answers];
          updated[step] = e.target.value;
          setAnswers(updated);
        }}
        placeholder={current.placeholder}
        rows={5}
        style={{ width: "100%", background: "var(--db-surface)", border: "1px solid var(--db-border)", borderRadius: 12, padding: "16px", color: "var(--db-text)", fontSize: 15, lineHeight: 1.6, resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 24 }}
      />
      <button
        onClick={() => { if (isLast) handleRelease(); else setStep(step + 1); }}
        disabled={!canContinue}
        style={{
          width: "100%", padding: "16px", borderRadius: 14,
          background: canContinue ? (isLast ? "rgba(255,255,255,0.06)" : "rgba(74,200,130,0.1)") : "rgba(255,255,255,0.03)",
          border: `1px solid ${canContinue ? (isLast ? "rgba(255,255,255,0.12)" : "rgba(74,200,130,0.2)") : "var(--db-border)"}`,
          color: canContinue ? "var(--db-text)" : "var(--db-muted)",
          fontSize: 15, cursor: canContinue ? "pointer" : "default",
        }}
      >
        {isLast ? "Release this dream ✧" : "Continue →"}
      </button>
    </div>
  );
}
