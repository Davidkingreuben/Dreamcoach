"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDreams, getStreakWithGrace, getBadges, getDailyCheckIns,
  getPersonalBest, getRollingGraceDaysRemaining, getDreamXP, getTeams
} from "@/lib/storage";
import { CLASSIFICATION_INFO } from "@/lib/logic/classification";
import type { Dream, DreamTeam } from "@/lib/types";

type FilterTab = "active" | "released" | "all";

export default function DashboardClient() {
  const router = useRouter();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filter, setFilter] = useState<FilterTab>("active");
  const [teams, setTeams] = useState<DreamTeam[]>([]);

  useEffect(() => {
    setDreams(getDreams());
    setTeams(getTeams());
  }, []);

  const filtered = dreams.filter((d) => {
    if (filter === "active") return d.status === "active" || d.status === "paused";
    if (filter === "released") return d.status === "released";
    return true;
  });

  const activeDreams = dreams.filter((d) => d.status === "active" || d.status === "paused");
  const totalXP = dreams.reduce((sum, d) => sum + getDreamXP(d.id).total, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", color: "var(--db-text)", paddingBottom: 100 }}>
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ fontSize: 11, color: "var(--db-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Dream Coach</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Your Dreams</div>
        {totalXP > 0 && (
          <div style={{ fontSize: 12, color: "var(--db-muted)" }}>{totalXP} XP · {activeDreams.length} active</div>
        )}
      </div>

      {teams.length > 0 && (
        <div style={{ margin: "16px 20px 0", background: "var(--db-surface)", borderRadius: 12, padding: "12px 16px", border: "1px solid var(--db-border)" }}>
          <div style={{ fontSize: 11, color: "var(--db-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            Dream Team{teams.length > 1 ? "s" : ""}
          </div>
          {teams.map((t) => (
            <button key={t.id} onClick={() => router.push("/team")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", color: "var(--db-text)", cursor: "pointer", padding: "4px 0" }}>
              <span style={{ fontSize: 13 }}>{t.name}</span>
              <span style={{ fontSize: 11, color: "var(--db-sub)" }}>{t.members.length} member{t.members.length !== 1 ? "s" : ""} →</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", margin: "16px 20px 0", background: "var(--db-surface)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--db-border)" }}>
        {(["active", "released", "all"] as FilterTab[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flex: 1, padding: "9px 0",
            background: filter === f ? "rgba(255,255,255,0.08)" : "none",
            border: "none", color: filter === f ? "var(--db-text)" : "var(--db-muted)",
            fontSize: 12, cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--db-muted)", fontSize: 14 }}>
            {filter === "active" ? "No active dreams. Start a new one." : "No dreams here yet."}
          </div>
        ) : (
          filtered.map((d) => <DreamCard key={d.id} dream={d} onClick={() => router.push(`/coach/${d.id}`)} />)
        )}
        <button onClick={() => router.push("/check")} style={{ width: "100%", padding: "16px", borderRadius: 14, background: "none", border: "1px dashed rgba(255,255,255,0.12)", color: "var(--db-muted)", fontSize: 13, cursor: "pointer", marginTop: 12 }}>
          + Add a new dream
        </button>
        <button onClick={() => router.push("/team")} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "none", border: "1px solid var(--db-border)", color: "var(--db-sub)", fontSize: 12, cursor: "pointer", marginTop: 8 }}>
          Dream Team →
        </button>
      </div>
    </div>
  );
}

function DreamCard({ dream, onClick }: { dream: Dream; onClick: () => void }) {
  const [streak, setStreak] = useState(0);
  const [pb, setPb] = useState(0);
  const [graceDaysLeft, setGraceDaysLeft] = useState(3);
  const [xpTotal, setXpTotal] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [checkinCount, setCheckinCount] = useState(0);

  useEffect(() => {
    setStreak(getStreakWithGrace(dream.id));
    setPb(getPersonalBest(dream.id)?.best_streak ?? 0);
    setGraceDaysLeft(getRollingGraceDaysRemaining(dream.id));
    setXpTotal(getDreamXP(dream.id).total);
    setBadgeCount(getBadges(dream.id).length);
    setCheckinCount(getDailyCheckIns(dream.id).length);
  }, [dream.id]);

  const classInfo = (dream.classification in CLASSIFICATION_INFO)
    ? CLASSIFICATION_INFO[dream.classification as keyof typeof CLASSIFICATION_INFO]
    : null;
  const isReleased = dream.status === "released";

  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", background: "var(--db-surface)", borderRadius: 14,
      padding: "16px 18px", border: "1px solid var(--db-border)", marginBottom: 10,
      cursor: "pointer", display: "block",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {classInfo && <span style={{ width: 8, height: 8, borderRadius: "50%", background: classInfo.color, display: "inline-block", flexShrink: 0 }} />}
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--db-text)" }}>{dream.title}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--db-muted)" }}>
            {dream.category}{dream.archetype ? ` · ${dream.archetype}` : ""}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {isReleased
            ? <span style={{ fontSize: 11, color: "var(--db-muted)" }}>Released {dream.released_at?.slice(0, 10)}</span>
            : <span style={{ fontSize: 18, fontWeight: 700, color: streak > 0 ? "rgba(74,200,130,1)" : "var(--db-muted)" }}>
                {streak}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--db-muted)" }}>d</span>
              </span>
          }
        </div>
      </div>

      {!isReleased && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {pb > 0 && <span style={{ fontSize: 10, color: "var(--db-muted)" }}>PB <strong style={{ color: "var(--db-sub)" }}>{pb}d</strong></span>}
          {graceDaysLeft < 3 && <span style={{ fontSize: 10, color: "rgba(230,170,60,0.7)" }}>Grace <strong style={{ color: "rgba(230,170,60,0.9)" }}>{graceDaysLeft}/3</strong></span>}
          {xpTotal > 0 && <span style={{ fontSize: 10, color: "var(--db-muted)" }}>XP <strong style={{ color: "var(--db-sub)" }}>{xpTotal}</strong></span>}
          {badgeCount > 0 && <span style={{ fontSize: 10, color: "var(--db-muted)" }}>✦ {badgeCount}</span>}
          <span style={{ fontSize: 10, color: "var(--db-muted)", marginLeft: "auto" }}>{checkinCount} check-ins</span>
        </div>
      )}

      {isReleased && dream.release_reflection && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--db-muted)", fontStyle: "italic", lineHeight: 1.5 }}>
          &ldquo;{dream.release_reflection.taught_me}&rdquo;
        </div>
      )}
    </button>
  );
}
