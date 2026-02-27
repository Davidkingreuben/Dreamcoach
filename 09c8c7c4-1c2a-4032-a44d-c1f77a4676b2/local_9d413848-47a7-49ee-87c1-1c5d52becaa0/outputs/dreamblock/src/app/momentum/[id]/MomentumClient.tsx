"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDream, getMomentumData, getStreakWithGrace, getPersonalBest,
  getRollingGraceDaysRemaining, getDreamXP, getContextualQuote,
} from "@/lib/storage";
import type { Dream, MomentumPoint, MomentumLayer } from "@/lib/types";

const W = 340, H = 200;
const PAD_T = 16, PAD_R = 16, PAD_B = 32, PAD_L = 32;
const IW = W - PAD_L - PAD_R;
const IH = H - PAD_T - PAD_B;

function scoreColor(score: number) {
  if (score >= 7) return "rgba(74,200,130,1)";
  if (score >= 4) return "rgba(230,170,60,1)";
  return "rgba(140,140,160,1)";
}

export default function MomentumClient({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const [dream, setDream] = useState<Dream | null>(null);
  const [points, setPoints] = useState<MomentumPoint[]>([]);
  const [layer, setLayer] = useState<MomentumLayer>("all");
  const [selected, setSelected] = useState<MomentumPoint | null>(null);
  const [streak, setStreak] = useState(0);
  const [pb, setPb] = useState(0);
  const [graceDaysLeft, setGraceDaysLeft] = useState(3);
  const [xpTotal, setXpTotal] = useState(0);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const d = getDream(dreamId);
    if (!d) { router.push("/dashboard"); return; }
    setDream(d);
    setPoints(getMomentumData(dreamId));
    const s = getStreakWithGrace(dreamId);
    setStreak(s);
    setPb(getPersonalBest(dreamId)?.best_streak ?? 0);
    setGraceDaysLeft(getRollingGraceDaysRemaining(dreamId));
    setXpTotal(getDreamXP(dreamId).total);
    const ctx = s === 0 ? "restart" : s >= 7 ? "consistent" : "general";
    setQuote(getContextualQuote(dreamId, ctx));
  }, [dreamId, router]);

  if (!dream) return null;

  const filtered = layer === "actions"
    ? points.filter((p) => p.tiny_action_done)
    : layer === "resistance"
    ? points.filter((p) => p.hard_reason !== "")
    : points;

  const n = filtered.length;
  const xAt = (i: number) => PAD_L + (n <= 1 ? IW / 2 : (i / (n - 1)) * IW);
  const yAt = (s: number) => PAD_T + IH - (s / 10) * IH;

  const pathD = n > 1
    ? filtered.map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(p.score).toFixed(1)}`).join(" ")
    : "";

  const resilientDates = new Set(
    filtered
      .filter((p, i) => {
        if (i === 0) return false;
        const gap = (new Date(p.date).getTime() - new Date(filtered[i - 1].date).getTime()) / 86400000;
        return gap >= 2 && p.score >= 5;
      })
      .map((p) => p.date)
  );

  const avg = points.length > 0
    ? (points.reduce((a, b) => a + b.score, 0) / points.length).toFixed(1)
    : "—";

  const LAYERS: { id: MomentumLayer; label: string }[] = [
    { id: "all", label: "All" },
    { id: "actions", label: "Actions" },
    { id: "resistance", label: "Resistance" },
    { id: "weekly", label: "Weekly" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", color: "var(--db-text)", paddingBottom: 120 }}>
      <div style={{ padding: "20px 20px 0" }}>
        <button onClick={() => router.push(`/coach/${dreamId}`)} style={{ background: "none", border: "none", color: "var(--db-sub)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 12 }}>
          ← Back
        </button>
        <div style={{ fontSize: 11, color: "var(--db-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Dream Momentum</div>
        <div style={{ fontSize: 17, fontWeight: 600 }}>{dream.title}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", margin: "16px 20px", background: "var(--db-surface)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--db-border)" }}>
        {[
          { label: "Streak", value: `${streak}d` },
          { label: "Best", value: `${pb}d` },
          { label: "Grace", value: `${graceDaysLeft}/3` },
          { label: "XP", value: String(xpTotal) },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "12px 8px", textAlign: "center", borderRight: i < 3 ? "1px solid var(--db-border)" : "none" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "var(--db-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Layer Tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 20px", marginBottom: 16 }}>
        {LAYERS.map((l) => (
          <button key={l.id} onClick={() => setLayer(l.id)} style={{
            flex: 1, padding: "7px 0", borderRadius: 8,
            background: layer === l.id ? "var(--db-text)" : "var(--db-surface)",
            color: layer === l.id ? "var(--db-bg)" : "var(--db-sub)",
            border: "1px solid var(--db-border)", fontSize: 11, cursor: "pointer",
            fontWeight: layer === l.id ? 700 : 400,
          }}>{l.label}</button>
        ))}
      </div>

      {/* SVG Graph */}
      <div style={{ margin: "0 20px", background: "var(--db-surface)", borderRadius: 14, border: "1px solid var(--db-border)", paddingTop: 12, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--db-muted)", fontSize: 13 }}>
            No data for this filter yet.
          </div>
        ) : (
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
            {[0, 2.5, 5, 7.5, 10].map((v) => (
              <line key={v} x1={PAD_L} x2={W - PAD_R} y1={yAt(v)} y2={yAt(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}
            {[0, 5, 10].map((v) => (
              <text key={v} x={PAD_L - 4} y={yAt(v) + 4} textAnchor="end" fill="rgba(240,240,245,0.28)" fontSize={8} fontFamily="monospace">{v}</text>
            ))}
            {pathD && n > 1 && (
              <path d={`${pathD} L ${xAt(n - 1).toFixed(1)} ${yAt(0)} L ${xAt(0).toFixed(1)} ${yAt(0)} Z`} fill="rgba(74,200,130,0.06)" />
            )}
            {pathD && <path d={pathD} fill="none" stroke="rgba(74,200,130,0.4)" strokeWidth={1.5} strokeLinejoin="round" />}
            {filtered.map((p, i) => {
              const cx = xAt(i), cy = yAt(p.score);
              const sel = selected?.date === p.date;
              const res = resilientDates.has(p.date);
              return (
                <g key={p.date} onClick={() => setSelected(sel ? null : p)} style={{ cursor: "pointer" }}>
                  {res && <circle cx={cx} cy={cy} r={10} fill="rgba(155,100,220,0.15)" stroke="rgba(155,100,220,0.5)" strokeWidth={1} />}
                  {p.grace_day_used && <circle cx={cx} cy={cy} r={8} fill="none" stroke="rgba(230,170,60,0.7)" strokeWidth={1.5} strokeDasharray="2,2" />}
                  {p.is_restart && !res && <circle cx={cx} cy={cy} r={8} fill="none" stroke="rgba(155,100,220,0.5)" strokeWidth={1} />}
                  <circle cx={cx} cy={cy} r={sel ? 6 : 4} fill={scoreColor(p.score)} stroke={sel ? "var(--db-text)" : "none"} strokeWidth={sel ? 2 : 0} />
                  {(i === 0 || i === n - 1 || i % 7 === 0) && (
                    <text x={cx} y={H - PAD_B + 14} textAnchor="middle" fill="rgba(240,240,245,0.28)" fontSize={7} fontFamily="monospace">
                      {p.date.slice(5)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, padding: "8px 16px 12px", flexWrap: "wrap" }}>
          {[
            { style: { background: "rgba(74,200,130,1)" }, label: "Strong 7–10" },
            { style: { background: "rgba(230,170,60,1)" }, label: "Steady 4–6" },
            { style: { background: "rgba(140,140,160,1)" }, label: "Quiet 0–3" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", ...l.style }} />
              <span style={{ fontSize: 10, color: "var(--db-muted)" }}>{l.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px dashed rgba(230,170,60,0.7)" }} />
            <span style={{ fontSize: 10, color: "var(--db-muted)" }}>Grace</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(155,100,220,0.7)" }} />
            <span style={{ fontSize: 10, color: "var(--db-muted)" }}>Return</span>
          </div>
        </div>
      </div>

      {/* Selected Detail */}
      {selected && (
        <div style={{ margin: "12px 20px 0", background: "var(--db-surface)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--db-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--db-muted)", marginBottom: 2 }}>{selected.date}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor(selected.score) }}>
                {selected.score}<span style={{ fontSize: 12, color: "var(--db-sub)", fontWeight: 400 }}>/10</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--db-muted)", cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
          {resilientDates.has(selected.date) && (
            <div style={{ background: "rgba(155,100,220,0.1)", borderRadius: 8, padding: "8px 12px", marginBottom: 8, fontSize: 12, color: "rgba(155,100,220,1)", borderLeft: "3px solid rgba(155,100,220,0.5)" }}>
              This return mattered more than a perfect streak.
            </div>
          )}
          {selected.grace_day_used && <div style={{ fontSize: 11, color: "rgba(230,170,60,0.8)", marginBottom: 6 }}>Grace Day used — streak protected.</div>}
          {selected.note && <div style={{ fontSize: 13, color: "var(--db-text)", marginBottom: 4 }}>&ldquo;{selected.note}&rdquo;</div>}
          {selected.hard_reason && <div style={{ fontSize: 11, color: "var(--db-sub)" }}>Hard: {selected.hard_reason}</div>}
          {selected.daily_mode && <div style={{ fontSize: 11, color: "var(--db-muted)", marginTop: 4 }}>Mode: {selected.daily_mode}</div>}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ margin: "12px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Total Check-ins", value: String(points.length), color: "var(--db-text)" },
          { label: "Avg Momentum", value: avg, color: scoreColor(parseFloat(avg) || 0) },
          { label: "Returns", value: String(points.filter((p) => p.is_restart).length), color: "rgba(155,100,220,1)" },
          { label: "Days Moved", value: String(points.filter((p) => p.tiny_action_done).length), color: "rgba(74,200,130,1)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--db-surface)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--db-border)" }}>
            <div style={{ fontSize: 11, color: "var(--db-muted)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {quote && (
        <div style={{ margin: "16px 20px 0", padding: "14px 16px", background: "var(--db-surface)", borderRadius: 12, border: "1px solid var(--db-border)", borderLeft: "3px solid rgba(74,200,130,0.4)" }}>
          <div style={{ fontSize: 13, color: "var(--db-sub)", lineHeight: 1.55, fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</div>
        </div>
      )}

      <div style={{ padding: "24px 20px 0" }}>
        <button onClick={() => router.push(`/coach/${dreamId}`)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "var(--db-surface)", border: "1px solid var(--db-border)", color: "var(--db-text)", fontSize: 14, cursor: "pointer" }}>
          Back to Daily Coach
        </button>
      </div>
    </div>
  );
}
