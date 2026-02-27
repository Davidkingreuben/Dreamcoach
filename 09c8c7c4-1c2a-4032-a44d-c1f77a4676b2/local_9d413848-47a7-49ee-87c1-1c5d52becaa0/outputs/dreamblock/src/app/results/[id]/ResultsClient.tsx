"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDream } from "@/lib/storage";
import { ARCHETYPE_INFO } from "@/lib/logic/archetypes";
import { CLASSIFICATION_INFO } from "@/lib/logic/classification";
import type { Dream } from "@/lib/types";
import ShareButton from "@/components/ShareButton";

const T = {
  bg: "var(--db-bg)", surface: "var(--db-surface)",
  border: "var(--db-border)", text: "var(--db-text)",
  sub: "var(--db-sub)", muted: "var(--db-muted)",
};

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 10 }}>{children}</p>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: 13, color: T.muted, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 14, color: T.text, flex: 1, textAlign: "right" as const }}>{value}</span>
    </div>
  );
}

const emotionLabels: Record<string, string> = { fear: "Fear", shame: "Shame", overwhelm: "Overwhelm", boredom: "Boredom", excite_crash: "Excitement, then crash", numbness: "Numbness", other: "Other", not_sure: "Not sure" };
const thoughtLabels: Record<string, string> = { not_enough: "Not good enough", judgment: "People will judge me", no_start: "Don't know where to start", too_late: "It's too late", wont_matter: "It won't matter", other: "Other", not_sure: "Not sure" };
const stuckLabels: Record<string, string> = { starting: "Starting", consistency: "Staying consistent", finishing: "Finishing things", publishing: "Putting it out there", promoting: "Promoting / sharing", committing: "Committing at all", other: "Other", not_sure: "Not sure" };
const protectLabels: Record<string, string> = { comfort: "My comfort zone", identity: "My sense of who I am", relationships: "My relationships", control: "A feeling of control", certainty: "Certainty / predictability", other: "Other", not_sure: "Not sure" };
const wantLabels: Record<string, string> = { status: "Status / recognition", identity: "Identity — being someone who does this", process: "The daily process itself", meaning: "Meaning and expression", output: "The finished product", other: "Other" };

export default function ResultsClient({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const [dream, setDream] = useState<Dream | null>(null);
  const [activeTab, setActiveTab] = useState<"assessment" | "steps" | "profile">("assessment");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const d = getDream(dreamId);
    setDream(d);
    setLoading(false);
  }, [dreamId]);

  if (loading) {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.6)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </main>
    );
  }

  if (!dream) {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }}>
        <p style={{ fontSize: 16, color: T.sub, textAlign: "center" as const }}>Assessment not found.</p>
        <p style={{ fontSize: 13, color: T.muted, textAlign: "center" as const }}>It may have been cleared from this browser.</p>
        <Link href="/check" style={{ fontSize: 14, color: T.text, textDecoration: "none", marginTop: 8 }}>Start a new assessment →</Link>
      </main>
    );
  }

  const archInfo = ARCHETYPE_INFO[dream.archetype as keyof typeof ARCHETYPE_INFO];
  const classInfo = CLASSIFICATION_INFO[dream.classification as keyof typeof CLASSIFICATION_INFO];
  const steps = Array.isArray(dream.micro_steps) ? dream.micro_steps : [];

  const tabs = [
    { id: "assessment" as const, label: "Assessment" },
    { id: "steps" as const, label: "Next Steps" },
    { id: "profile" as const, label: "Profile" },
  ];

  return (
    <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 20px) 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 4 }}>Dream Coach · Assessment</p>
            <p style={{ fontSize: 18, fontWeight: 300, color: T.text }}>{dream.title}</p>
            <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{dream.category} · Carried for {dream.years_delayed}</p>
          </div>
          <ShareButton />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "0 24px" }}>
        {tabs.map((t) => (
          <button
            key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: 1, padding: "14px 0", fontSize: 13, fontWeight: 500, color: activeTab === t.id ? T.text : T.sub, background: "transparent", border: "none", cursor: "pointer", borderBottom: `2px solid ${activeTab === t.id ? T.text : "transparent"}`, transition: "all 0.2s ease" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

        {/* ─── ASSESSMENT TAB ─── */}
        {activeTab === "assessment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {classInfo && (
              <div style={{ background: classInfo.bg, border: `1px solid ${classInfo.color}30`, borderRadius: 16, padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 18, color: classInfo.color, lineHeight: 1.4 }}>{classInfo.icon}</span>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 500, color: T.text, margin: 0 }}>{dream.classification}</p>
                    <p style={{ fontSize: 13, color: classInfo.color, marginTop: 4 }}>{classInfo.subtitle}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.65, margin: 0 }}>{classInfo.description}</p>
              </div>
            )}

            {archInfo && (
              <div>
                <Label>Your Resistance Archetype</Label>
                <div style={{ background: archInfo.bg, border: `1px solid ${archInfo.color}30`, borderRadius: 16, padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 18, color: archInfo.color }}>{archInfo.icon}</span>
                    <p style={{ fontSize: 16, fontWeight: 500, color: T.text, margin: 0 }}>{dream.archetype}</p>
                  </div>
                  <p style={{ fontSize: 13, color: archInfo.color, fontStyle: "italic", marginBottom: 8 }}>&ldquo;{archInfo.tagline}&rdquo;</p>
                  <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.65, margin: 0 }}>{archInfo.description}</p>
                </div>
                <p style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>Stuck phase: <span style={{ color: T.sub }}>{dream.stuck_phase}</span></p>
              </div>
            )}

            <div>
              <Label>Signal Scores</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Importance", value: dream.importance },
                  { label: "Pain of not doing", value: dream.pain },
                  { label: "Fear of doing", value: dream.fear },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: T.surface, borderRadius: 12, padding: "14px 10px", textAlign: "center" as const, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ fontSize: 26, fontWeight: 200, color: T.text, margin: 0 }}>{value}</p>
                    <p style={{ fontSize: 10, color: T.muted, marginTop: 4, lineHeight: 1.3 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Fantasy vs Essence</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ background: T.surface, borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>What you want most</p>
                  <p style={{ fontSize: 14, color: T.text }}>{dream.true_want_other || wantLabels[dream.true_want] || dream.true_want || "—"}</p>
                </div>
                <div style={{ background: T.surface, borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>Without external reward</p>
                  <p style={{ fontSize: 14, color: T.text }}>{dream.without_reward ? "Would still want it" : "External reward is the point"}</p>
                </div>
              </div>
            </div>

            <div style={{ background: T.surface, borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                ⚠️ This app provides structured self-reflection, not clinical or professional advice. If you&apos;re experiencing significant distress, please speak with a qualified professional.
              </p>
            </div>
          </div>
        )}

        {/* ─── NEXT STEPS TAB ─── */}
        {activeTab === "steps" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {classInfo?.action === "pursue" && (
              <>
                <div>
                  <Label>Grounded First Steps</Label>
                  <p style={{ fontSize: 13, color: T.muted }}>Calibrated to your {dream.archetype} pattern. Each under 30 minutes.</p>
                </div>
                {steps.map((s, i) => (
                  <div key={i} style={{ background: T.surface, borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace", paddingTop: 2, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                    <p style={{ fontSize: 14, color: T.text, lineHeight: 1.65, margin: 0 }}>{s}</p>
                  </div>
                ))}
              </>
            )}
            {classInfo?.action === "defer" && (
              <>
                <div><Label>Conscious Deferral</Label></div>
                <div style={{ background: T.surface, borderRadius: 16, padding: "18px" }}>
                  <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>The conditions aren&apos;t right. That&apos;s real. Deferring consciously — with a specific review date — is a form of respect for both the dream and your current life.</p>
                </div>
              </>
            )}
            {classInfo?.action === "reshape" && (
              <>
                <div><Label>Reshaping the Dream</Label></div>
                <div style={{ background: T.surface, borderRadius: 16, padding: "18px" }}>
                  <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>The version of this dream you&apos;re carrying may not be the version that&apos;s actually yours. What you want underneath it is real — the specific form may need to change.</p>
                </div>
              </>
            )}
            {classInfo?.action === "release" && (
              <>
                <div><Label>Closure Reflection</Label></div>
                <div style={{ background: T.surface, borderRadius: 16, padding: "18px" }}>
                  <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>Releasing a dream honestly is an act of self-knowledge, not self-defeat. Carrying something that doesn&apos;t fit costs energy and clarity.</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Label>Resistance Profile</Label>
              {archInfo && (
                <div style={{ background: T.surface, borderRadius: 14, padding: "16px" }}>
                  <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.7 }}>
                    Primary block: <span style={{ color: archInfo.color, fontWeight: 500 }}>{dream.archetype}</span>.{" "}
                    Stuck phase: <span style={{ color: T.text }}>{dream.stuck_phase}</span>.
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label>What You Reported</Label>
              <InfoRow label="Primary emotion" value={dream.emotion_other || emotionLabels[dream.emotion] || dream.emotion || "—"} />
              <InfoRow label="First thought" value={dream.first_thought_other || thoughtLabels[dream.first_thought] || dream.first_thought || "—"} />
              <InfoRow label="Where you get stuck" value={dream.stuck_point_other || stuckLabels[dream.stuck_point] || dream.stuck_point || "—"} />
              <InfoRow label="What you're protecting" value={dream.protecting_other || protectLabels[dream.protecting] || dream.protecting || "—"} />
              <InfoRow label="Hesitate even if success guaranteed" value={dream.guaranteed_hesitate === "yes" ? "Yes" : "No"} />
            </div>
            <div>
              <Label>Reality Signals</Label>
              <InfoRow label="Physical constraints" value={{ none: "None", minor: "Minor", significant: "Significant", impossible: "May be impossible" }[dream.physical_constraint] || dream.physical_constraint || "—"} />
              <InfoRow label="Time available" value={{ yes: "Yes — real time", some: "Some, with sacrifice", little: "Very little", none: "Not currently possible" }[dream.time_realistic] || dream.time_realistic || "—"} />
              <InfoRow label="Realistic timeline" value={dream.realistic_years || "—"} />
              <InfoRow label="Willing to commit" value={dream.willing_to_commit ? "Yes" : "No"} />
            </div>
          </div>
        )}
      </div>

      {/* Footer — Begin Coaching CTA */}
      <div style={{ padding: "16px 24px", paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 20px)", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 10, background: T.bg }}>
        <button
          onClick={() => router.push(`/coach/${dream.id}`)}
          style={{ width: "100%", padding: "18px", borderRadius: 16, minHeight: 56, background: T.text, color: "#050510", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          Begin Coaching →
        </button>
        <Link
          href="/check"
          style={{ display: "block", width: "100%", padding: "14px", borderRadius: 16, textAlign: "center" as const, background: "transparent", color: T.muted, fontSize: 13, textDecoration: "none" }}
        >
          Check another dream
        </Link>
      </div>
    </main>
  );
}
