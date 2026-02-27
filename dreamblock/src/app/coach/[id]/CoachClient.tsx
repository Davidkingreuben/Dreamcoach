"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getDream, getDailyCheckIns, getCheckInByDate, saveDailyCheckIn,
  getStreakWithGrace, getWeeklySummaries, getDueWeeklySummary, saveWeeklySummary,
  getBadges, awardBadge, checkAndAwardStreakBadges, checkAndAwardLongTermBadges,
  getPersonalBest, updatePersonalBest, getRollingGraceDaysRemaining,
  getRollingGraceDaysUsed, tryApplyGraceDay, getDreamXP, addXP,
  getContextualQuote, logEvent,
} from "@/lib/storage";
import { generateWeeklyPattern } from "@/lib/logic/insight";
import type { Dream, DailyCheckIn, WeeklySummary, Badge, DailyMode, HardReason, MoodLevel } from "@/lib/types";

type Tab = "today" | "history" | "milestones";
type CheckStep = "did" | "action" | "hard" | "mode" | "statement" | "done";

const MODE_OPTIONS: { value: DailyMode; label: string; desc: string }[] = [
  { value: "do",               label: "Do",               desc: "Execute a task"      },
  { value: "plan",             label: "Plan",             desc: "Map next steps"      },
  { value: "ask",              label: "Ask",              desc: "Seek help or info"   },
  { value: "learn",            label: "Learn",            desc: "Research or study"   },
  { value: "reduce_friction",  label: "Reduce Friction",  desc: "Remove a blocker"    },
  { value: "rest",             label: "Rest",             desc: "Intentional pause"   },
];
const HARD_OPTIONS: { value: HardReason; label: string }[] = [
  { value: "fear",          label: "Fear"               },
  { value: "perfectionism", label: "Perfectionism"      },
  { value: "unclear",       label: "Unclear next step"  },
  { value: "energy",        label: "Low energy"         },
  { value: "time",          label: "No time"            },
  { value: "distraction",   label: "Too distracted"     },
  { value: "other",         label: "Something else"     },
];

export default function CoachClient({ dreamId }: { dreamId: string }) {
  const router = useRouter();
  const [dream, setDream] = useState<Dream | null>(null);
  const [tab, setTab] = useState<Tab>("today");
  const [checkins, setCheckins] = useState<DailyCheckIn[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckIn | null>(null);
  const [streak, setStreak] = useState(0);
  const [pb, setPb] = useState(0);
  const [daysToBeatenPb, setDaysToBeatenPb] = useState<number | null>(null);
  const [graceDaysLeft, setGraceDaysLeft] = useState(3);
  const [graceDaysUsed, setGraceDaysUsed] = useState(0);
  const [graceAppliedDate, setGraceAppliedDate] = useState<string | null>(null);
  const [xpTotal, setXpTotal] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [pendingWeekly, setPendingWeekly] = useState<ReturnType<typeof getDueWeeklySummary>>(null);
  const [showWeekly, setShowWeekly] = useState(false);
  const [quote, setQuote] = useState("");
  // Form state
  const [step, setStep] = useState<CheckStep>("did");
  const [didSomething, setDidSomething] = useState<boolean | null>(null);
  const [tinyAction, setTinyAction] = useState("");
  const [hardReason, setHardReason] = useState<HardReason | "">("");
  const [easyVersion, setEasyVersion] = useState("");
  const [dailyMode, setDailyMode] = useState<DailyMode | "">("");
  const [stepStatement, setStepStatement] = useState("");
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const refreshData = useCallback(() => {
    const d = getDream(dreamId);
    if (!d) { router.push("/dashboard"); return; }
    setDream(d);
    const all = getDailyCheckIns(dreamId);
    setCheckins(all);
    setTodayCheckin(getCheckInByDate(dreamId, today));
    const s = getStreakWithGrace(dreamId);
    setStreak(s);
    const pbVal = getPersonalBest(dreamId)?.best_streak ?? 0;
    setPb(pbVal);
    setDaysToBeatenPb(pbVal > 0 && s < pbVal ? pbVal - s : null);
    setGraceDaysLeft(getRollingGraceDaysRemaining(dreamId));
    setGraceDaysUsed(getRollingGraceDaysUsed(dreamId));
    setXpTotal(getDreamXP(dreamId).total);
    setBadges(getBadges(dreamId));
    setWeeklySummaries(getWeeklySummaries(dreamId));
    setPendingWeekly(getDueWeeklySummary(dreamId));
    const ctx = s === 0 ? "restart" : s >= 7 ? "consistent" : s >= 3 ? "general" : "struggling";
    setQuote(getContextualQuote(dreamId, ctx));
  }, [dreamId, router, today]);

  useEffect(() => {
    if (!getDream(dreamId)) { router.push("/dashboard"); return; }
    const applied = tryApplyGraceDay(dreamId);
    if (applied) setGraceAppliedDate(applied);
    refreshData();
  }, [dreamId, router, refreshData]);

  function handleSubmitCheckin() {
    if (saving) return;
    setSaving(true);
    const isRestart = checkins.length > 0 &&
      (new Date(today).getTime() - new Date(checkins[checkins.length - 1].date).getTime()) / 86400000 >= 2;

    const checkin: DailyCheckIn = {
      id: crypto.randomUUID(), dream_id: dreamId, date: today,
      did_something: didSomething ?? false,
      tiny_action: tinyAction, hard_reason: hardReason,
      easy_version: easyVersion, daily_mode: dailyMode,
      step_statement: stepStatement, mood: 3 as MoodLevel,
      resistance_note: "", tiny_win: tinyAction,
      shared_with_team: false, created_at: new Date().toISOString(),
    };

    saveDailyCheckIn(checkin);
    logEvent("checkin_completed", dreamId);
    addXP(dreamId, "checkin");
    if (didSomething && tinyAction.length > 5) addXP(dreamId, "tiny_action");
    if (isRestart) addXP(dreamId, "restart");
    if (stepStatement.length > 10) addXP(dreamId, "reflection");

    const earned: Badge[] = [];
    if (checkins.length === 0) {
      [awardBadge(dreamId, "first_checkin"), awardBadge(dreamId, "first_step"), awardBadge(dreamId, "clarity_seeker")]
        .forEach((b) => { if (b) earned.push(b); });
    }
    if (!didSomething && hardReason) { const b = awardBadge(dreamId, "honest_moment"); if (b) earned.push(b); }
    if (isRestart) {
      const b = awardBadge(dreamId, "comeback"); if (b) earned.push(b);
      const days = (new Date(today).getTime() - new Date(checkins[checkins.length - 1]?.date || today).getTime()) / 86400000;
      if (days >= 7) { const b2 = awardBadge(dreamId, "returner"); if (b2) earned.push(b2); }
    }
    earned.push(...checkAndAwardStreakBadges(dreamId), ...checkAndAwardLongTermBadges(dreamId));
    if (updatePersonalBest(dreamId)) {
      logEvent("personal_best_set", dreamId);
      const b = awardBadge(dreamId, "personal_best"); if (b) earned.push(b);
    }
    if (!didSomething) {
      const yCheckin = getCheckInByDate(dreamId, new Date(Date.now() - 86400000).toISOString().slice(0, 10));
      if (yCheckin) { const b = awardBadge(dreamId, "fail_fast"); if (b) earned.push(b); }
    }
    if (earned.length > 0) setNewBadges(earned);
    setStep("done");
    setSaving(false);
    refreshData();
  }

  function resetForm() {
    setStep("did"); setDidSomething(null); setTinyAction(""); setHardReason("");
    setEasyVersion(""); setDailyMode(""); setStepStatement(""); setNewBadges([]);
  }

  if (!dream) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", color: "var(--db-text)", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0" }}>
        <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", color: "var(--db-sub)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 12 }}>← Dreams</button>
        <div style={{ fontSize: 11, color: "var(--db-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Daily Coach</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{dream.title}</div>
        <div style={{ fontSize: 12, color: "var(--db-sub)" }}>{dream.archetype} · {dream.classification}</div>
      </div>

      {graceAppliedDate && (
        <div style={{ margin: "12px 20px 0", background: "rgba(230,170,60,0.1)", border: "1px solid rgba(230,170,60,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "rgba(230,170,60,1)" }}>
          ✦ Grace Day used for {graceAppliedDate}. Your streak continues.
        </div>
      )}

      {/* Stats strip */}
      <div style={{ display: "flex", margin: "16px 20px 0", background: "var(--db-surface)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--db-border)" }}>
        {[
          { label: "Streak", value: `${streak}d`, click: true },
          { label: "Best",   value: `${pb}d`,     click: false },
          { label: "Grace",  value: `${graceDaysLeft}/3`, click: false },
          { label: "XP",     value: String(xpTotal), click: false },
        ].map((s, i) => (
          <button key={i}
            onClick={s.click ? () => router.push(`/momentum/${dreamId}`) : undefined}
            style={{ flex: 1, padding: "11px 4px", textAlign: "center", background: "none", border: "none", borderRight: i < 3 ? "1px solid var(--db-border)" : "none", cursor: s.click ? "pointer" : "default" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: i === 0 && streak > 0 ? "rgba(74,200,130,1)" : "var(--db-text)" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "var(--db-muted)", marginTop: 1 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {daysToBeatenPb !== null && daysToBeatenPb > 0 && (
        <div style={{ margin: "8px 20px 0", padding: "8px 12px", background: "var(--db-surface)", borderRadius: 8, border: "1px solid var(--db-border)", fontSize: 11, color: "var(--db-sub)" }}>
          ⚑ {daysToBeatenPb} more {daysToBeatenPb === 1 ? "day" : "days"} to beat your personal best
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", margin: "16px 20px 0", background: "var(--db-surface)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--db-border)" }}>
        {(["today", "history", "milestones"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 0", background: tab === t ? "rgba(255,255,255,0.08)" : "none",
            border: "none", color: tab === t ? "var(--db-text)" : "var(--db-muted)",
            fontSize: 12, cursor: "pointer", fontWeight: tab === t ? 600 : 400, textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "16px 20px 0" }}>

        {/* ── TODAY ── */}
        {tab === "today" && (
          <>
            {pendingWeekly && !showWeekly && (
              <div style={{ background: "rgba(91,155,213,0.08)", border: "1px solid rgba(91,155,213,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Week {pendingWeekly.weekNumber} Summary Ready</div>
                <div style={{ fontSize: 12, color: "var(--db-sub)", marginBottom: 10 }}>You showed up {pendingWeekly.checkins.length} times this week.</div>
                <button onClick={() => setShowWeekly(true)} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(91,155,213,0.2)", border: "1px solid rgba(91,155,213,0.3)", color: "var(--db-text)", fontSize: 12, cursor: "pointer" }}>View Summary</button>
              </div>
            )}
            {showWeekly && pendingWeekly && (
              <WeeklySummaryView data={pendingWeekly} dreamId={dreamId} dream={dream} onDone={() => { setShowWeekly(false); refreshData(); }} />
            )}
            {newBadges.length > 0 && step === "done" && (
              <div style={{ background: "rgba(74,200,130,0.06)", border: "1px solid rgba(74,200,130,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "rgba(74,200,130,1)" }}>Badge{newBadges.length > 1 ? "s" : ""} Earned</div>
                {newBadges.map((b) => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{b.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: "var(--db-sub)" }}>{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {todayCheckin && step !== "done" && (
              <div>
                <div style={{ background: "var(--db-surface)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--db-border)", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "rgba(74,200,130,1)", marginBottom: 6 }}>✓ Checked in today</div>
                  {todayCheckin.tiny_action && <div style={{ fontSize: 13, color: "var(--db-sub)" }}>&ldquo;{todayCheckin.tiny_action}&rdquo;</div>}
                  {todayCheckin.step_statement && <div style={{ fontSize: 12, color: "var(--db-muted)", marginTop: 6 }}>Tomorrow: {todayCheckin.step_statement}</div>}
                </div>
                <button onClick={() => router.push(`/momentum/${dreamId}`)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--db-surface)", border: "1px solid var(--db-border)", color: "var(--db-sub)", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span>View Momentum Graph</span><span>→</span>
                </button>
                {quote && <div style={{ padding: "12px 16px", background: "var(--db-surface)", borderRadius: 12, border: "1px solid var(--db-border)", borderLeft: "3px solid rgba(74,200,130,0.3)" }}><div style={{ fontSize: 12, color: "var(--db-sub)", lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</div></div>}
              </div>
            )}
            {step === "done" && (
              <div>
                <div style={{ background: "var(--db-surface)", borderRadius: 12, padding: "16px", border: "1px solid var(--db-border)", marginBottom: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>✓</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Check-in complete</div>
                  <div style={{ fontSize: 12, color: "var(--db-sub)" }}>Streak: {streak}d</div>
                  {graceDaysLeft < 3 && <div style={{ fontSize: 11, color: "rgba(230,170,60,0.8)", marginTop: 4 }}>{graceDaysLeft} grace {graceDaysLeft === 1 ? "day" : "days"} remaining</div>}
                </div>
                {quote && <div style={{ padding: "12px 16px", background: "var(--db-surface)", borderRadius: 12, border: "1px solid var(--db-border)", borderLeft: "3px solid rgba(74,200,130,0.3)", marginBottom: 14 }}><div style={{ fontSize: 12, color: "var(--db-sub)", lineHeight: 1.6, fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</div></div>}
                <button onClick={() => router.push(`/momentum/${dreamId}`)} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "var(--db-surface)", border: "1px solid var(--db-border)", color: "var(--db-text)", fontSize: 13, cursor: "pointer", marginBottom: 8 }}>View Momentum Graph →</button>
                <button onClick={resetForm} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "none", border: "1px solid var(--db-border)", color: "var(--db-muted)", fontSize: 12, cursor: "pointer" }}>Edit check-in</button>
              </div>
            )}
            {!todayCheckin && step !== "done" && (
              <CheckInForm
                step={step} setStep={setStep}
                didSomething={didSomething} setDidSomething={setDidSomething}
                tinyAction={tinyAction} setTinyAction={setTinyAction}
                hardReason={hardReason} setHardReason={setHardReason}
                easyVersion={easyVersion} setEasyVersion={setEasyVersion}
                dailyMode={dailyMode} setDailyMode={setDailyMode}
                stepStatement={stepStatement} setStepStatement={setStepStatement}
                onSubmit={handleSubmitCheckin} saving={saving}
                dream={dream} checkins={checkins}
              />
            )}
            {(todayCheckin || step === "done") && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => router.push(`/results/${dreamId}`)} style={{ padding: "12px 16px", borderRadius: 12, background: "none", border: "1px solid var(--db-border)", color: "var(--db-sub)", fontSize: 12, cursor: "pointer", textAlign: "left" }}>View Full Assessment →</button>
                <button onClick={() => router.push(`/release/${dreamId}`)} style={{ padding: "12px 16px", borderRadius: 12, background: "none", border: "1px solid var(--db-border)", color: "var(--db-muted)", fontSize: 12, cursor: "pointer", textAlign: "left" }}>Release This Dream</button>
              </div>
            )}
          </>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <div>
            {checkins.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 0", color: "var(--db-muted)", fontSize: 13 }}>No check-ins yet.</div>
              : [...checkins].reverse().slice(0, 30).map((c) => (
                <div key={c.id} style={{ background: "var(--db-surface)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--db-border)", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--db-sub)" }}>{c.date}</span>
                    <span style={{ fontSize: 11, color: c.did_something ? "rgba(74,200,130,1)" : "var(--db-muted)" }}>{c.did_something ? "✓ Moved" : "· Honest"}</span>
                  </div>
                  {c.tiny_action && <div style={{ fontSize: 13, color: "var(--db-text)", marginBottom: 2 }}>{c.tiny_action}</div>}
                  {c.hard_reason && <div style={{ fontSize: 11, color: "var(--db-muted)" }}>Hard: {c.hard_reason}</div>}
                  {c.step_statement && <div style={{ fontSize: 11, color: "var(--db-sub)", marginTop: 4, fontStyle: "italic" }}>Next: {c.step_statement}</div>}
                </div>
              ))
            }
            {checkins.length > 0 && (
              <button onClick={() => router.push(`/momentum/${dreamId}`)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "var(--db-surface)", border: "1px solid var(--db-border)", color: "var(--db-sub)", fontSize: 12, cursor: "pointer", marginTop: 8 }}>View Momentum Graph →</button>
            )}
          </div>
        )}

        {/* ── MILESTONES ── */}
        {tab === "milestones" && (
          <div>
            <div style={{ background: "var(--db-surface)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--db-border)", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--db-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>XP</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(74,200,130,1)", marginBottom: 4 }}>{xpTotal}</div>
              <div style={{ fontSize: 12, color: "var(--db-sub)" }}>Earned through check-ins, actions, and returns</div>
            </div>
            <div style={{ background: "var(--db-surface)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--db-border)", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--db-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Grace Days (rolling 30 days)</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: graceDaysUsed >= n ? "rgba(230,170,60,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${graceDaysUsed >= n ? "rgba(230,170,60,0.3)" : "var(--db-border)"}`, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{graceDaysUsed >= n ? "✦" : "○"}</div>
                    <div style={{ fontSize: 9, color: "var(--db-muted)", marginTop: 2 }}>{graceDaysUsed >= n ? "Used" : "Free"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--db-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Badges ({badges.length})</div>
            {badges.length === 0
              ? <div style={{ textAlign: "center", padding: "24px 0", color: "var(--db-muted)", fontSize: 13 }}>Complete your first check-in to earn badges.</div>
              : badges.map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--db-surface)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--db-border)", marginBottom: 8 }}>
                  <span style={{ fontSize: 22, minWidth: 32 }}>{b.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: "var(--db-sub)" }}>{b.description}</div>
                    <div style={{ fontSize: 10, color: "var(--db-muted)", marginTop: 2 }}>{b.earned_at.slice(0, 10)}</div>
                  </div>
                </div>
              ))
            }
            {weeklySummaries.length > 0 && (
              <>
                <div style={{ fontSize: 11, color: "var(--db-muted)", margin: "16px 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Weekly Summaries</div>
                {weeklySummaries.map((ws) => (
                  <div key={ws.id} style={{ background: "var(--db-surface)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--db-border)", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Week {ws.week_number}</div>
                    <div style={{ fontSize: 11, color: "var(--db-sub)", marginBottom: 4 }}>{ws.week_start} → {ws.week_end} · {ws.did_days}/{ws.checkin_count} days moved</div>
                    {ws.focus_next_week && <div style={{ fontSize: 12, color: "var(--db-text)", fontStyle: "italic" }}>&ldquo;{ws.focus_next_week}&rdquo;</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CheckInForm({
  step, setStep, didSomething, setDidSomething, tinyAction, setTinyAction,
  hardReason, setHardReason, easyVersion, setEasyVersion, dailyMode, setDailyMode,
  stepStatement, setStepStatement, onSubmit, saving, dream, checkins,
}: {
  step: CheckStep; setStep: (s: CheckStep) => void;
  didSomething: boolean | null; setDidSomething: (v: boolean) => void;
  tinyAction: string; setTinyAction: (v: string) => void;
  hardReason: HardReason | ""; setHardReason: (v: HardReason) => void;
  easyVersion: string; setEasyVersion: (v: string) => void;
  dailyMode: DailyMode | ""; setDailyMode: (v: DailyMode) => void;
  stepStatement: string; setStepStatement: (v: string) => void;
  onSubmit: () => void; saving: boolean;
  dream: Dream; checkins: DailyCheckIn[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const isRestart = checkins.length > 0 &&
    (new Date(today).getTime() - new Date(checkins[checkins.length - 1].date).getTime()) / 86400000 >= 2;

  const card = (children: React.ReactNode) => (
    <div style={{ background: "var(--db-surface)", borderRadius: 14, padding: "20px 18px", border: "1px solid var(--db-border)" }}>
      {isRestart && step === "did" && (
        <div style={{ marginBottom: 14, padding: "10px 12px", background: "rgba(155,100,220,0.08)", borderRadius: 8, border: "1px solid rgba(155,100,220,0.2)", fontSize: 12, color: "rgba(155,100,220,0.9)" }}>
          Welcome back. Restarting is the skill.
        </div>
      )}
      {children}
    </div>
  );

  if (step === "did") return card(
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Did you do something toward {dream.title} today?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => { setDidSomething(true); setStep("action"); }} style={{ padding: "14px", borderRadius: 10, background: "rgba(74,200,130,0.08)", border: "1px solid rgba(74,200,130,0.2)", color: "var(--db-text)", fontSize: 14, cursor: "pointer" }}>✓ Yes, I moved</button>
        <button onClick={() => { setDidSomething(false); setStep("hard"); }} style={{ padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--db-border)", color: "var(--db-sub)", fontSize: 14, cursor: "pointer" }}>· No — and that&apos;s honest</button>
      </div>
    </>
  );

  if (step === "action") return card(
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>What was your tiny action?</div>
      <div style={{ fontSize: 12, color: "var(--db-sub)", marginBottom: 14 }}>One sentence. What did you actually do?</div>
      <textarea value={tinyAction} onChange={(e) => setTinyAction(e.target.value)} placeholder="I spent 20 minutes on..." rows={2}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--db-border)", borderRadius: 8, padding: "10px 12px", color: "var(--db-text)", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
      <button onClick={() => setStep("mode")} disabled={!tinyAction.trim()}
        style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 10, background: tinyAction.trim() ? "rgba(74,200,130,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${tinyAction.trim() ? "rgba(74,200,130,0.3)" : "var(--db-border)"}`, color: tinyAction.trim() ? "var(--db-text)" : "var(--db-muted)", fontSize: 13, cursor: tinyAction.trim() ? "pointer" : "default" }}>
        Continue →
      </button>
    </>
  );

  if (step === "hard") return card(
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>What made it hard?</div>
      <div style={{ fontSize: 12, color: "var(--db-sub)", marginBottom: 14 }}>No penalty. Just naming it clearly.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HARD_OPTIONS.map((o) => (
          <button key={o.value} onClick={() => setHardReason(o.value)}
            style={{ padding: "11px 14px", borderRadius: 8, background: hardReason === o.value ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${hardReason === o.value ? "rgba(255,255,255,0.2)" : "var(--db-border)"}`, color: hardReason === o.value ? "var(--db-text)" : "var(--db-sub)", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
            {o.label}
          </button>
        ))}
      </div>
      {hardReason && (
        <>
          <div style={{ fontSize: 13, fontWeight: 500, margin: "14px 0 6px" }}>What would the easy version have been?</div>
          <textarea value={easyVersion} onChange={(e) => setEasyVersion(e.target.value)} placeholder="Just 5 minutes of..." rows={2}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--db-border)", borderRadius: 8, padding: "10px 12px", color: "var(--db-text)", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
          <button onClick={() => setStep("statement")}
            style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid var(--db-border)", color: "var(--db-text)", fontSize: 13, cursor: "pointer" }}>
            Continue →
          </button>
        </>
      )}
    </>
  );

  if (step === "mode") return card(
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>What was today&apos;s mode?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MODE_OPTIONS.map((o) => (
          <button key={o.value} onClick={() => setDailyMode(o.value)}
            style={{ padding: "11px 14px", borderRadius: 8, background: dailyMode === o.value ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${dailyMode === o.value ? "rgba(255,255,255,0.2)" : "var(--db-border)"}`, color: dailyMode === o.value ? "var(--db-text)" : "var(--db-sub)", fontSize: 13, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 500 }}>{o.label}</span>
            <span style={{ fontSize: 11, color: "var(--db-muted)" }}>{o.desc}</span>
          </button>
        ))}
      </div>
      {dailyMode && (
        <button onClick={() => setStep("statement")} style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 10, background: "rgba(74,200,130,0.1)", border: "1px solid rgba(74,200,130,0.2)", color: "var(--db-text)", fontSize: 13, cursor: "pointer" }}>Continue →</button>
      )}
    </>
  );

  if (step === "statement") return card(
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>What&apos;s one thing you&apos;ll do tomorrow?</div>
      <div style={{ fontSize: 12, color: "var(--db-sub)", marginBottom: 14 }}>Specific. Small. Doable even on a hard day.</div>
      <textarea value={stepStatement} onChange={(e) => setStepStatement(e.target.value)} placeholder="Tomorrow I'll..." rows={2}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--db-border)", borderRadius: 8, padding: "10px 12px", color: "var(--db-text)", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
      <button onClick={onSubmit} disabled={!stepStatement.trim() || saving}
        style={{ width: "100%", marginTop: 12, padding: "14px", borderRadius: 10, background: stepStatement.trim() ? "rgba(74,200,130,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${stepStatement.trim() ? "rgba(74,200,130,0.3)" : "var(--db-border)"}`, color: stepStatement.trim() ? "var(--db-text)" : "var(--db-muted)", fontSize: 14, cursor: stepStatement.trim() && !saving ? "pointer" : "default", fontWeight: 600 }}>
        {saving ? "Saving..." : "Complete Check-In ✓"}
      </button>
    </>
  );

  return null;
}

function WeeklySummaryView({ data, dreamId, dream, onDone }: {
  data: { weekNumber: number; weekStart: string; weekEnd: string; checkins: DailyCheckIn[] };
  dreamId: string; dream: Dream; onDone: () => void;
}) {
  const [focus, setFocus] = useState("");
  const [saving, setSaving] = useState(false);

  const didDays = data.checkins.filter((c) => c.did_something).length;
  const wins = data.checkins
    .map((c) => c.tiny_win || c.tiny_action)
    .filter((w): w is string => typeof w === "string" && w.length > 0);
const hardReasons = data.checkins
  .map((c) => c.hard_reason)
  .filter((h) => typeof h === "string" && h.length > 0);

const hardReasonsStr = hardReasons as string[];
const pattern = generateWeeklyPattern(
  data.checkins.length,
  didDays,
  hardReasonsStr
);

  function handleSave() {
    if (saving) return;
    setSaving(true);
    const ws: WeeklySummary = {
      id: crypto.randomUUID(), dream_id: dreamId,
      week_number: data.weekNumber, week_start: data.weekStart, week_end: data.weekEnd,
      checkin_count: data.checkins.length, did_days: didDays,
      tiny_wins: wins, friction_reducers: [], patterns: pattern,
      focus_next_week: focus, token_awarded: true,
      philosophy_line: dream.insight_summary?.philosophy_line ?? "",
      created_at: new Date().toISOString(),
    };
    saveWeeklySummary(ws);
    addXP(dreamId, "weekly_token");
    awardBadge(dreamId, "weekly_token");
    logEvent("weekly_summary_viewed", dreamId);
    setSaving(false);
    onDone();
  }

  return (
    <div style={{ background: "var(--db-surface)", borderRadius: 14, padding: "20px 18px", border: "1px solid rgba(91,155,213,0.2)", marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: "rgba(91,155,213,0.8)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Week {data.weekNumber}</div>
      <div style={{ fontSize: 13, color: "var(--db-sub)", marginBottom: 14 }}>{data.weekStart} → {data.weekEnd}</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{data.checkins.length}</div>
          <div style={{ fontSize: 10, color: "var(--db-muted)" }}>Check-ins</div>
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(74,200,130,1)" }}>{didDays}</div>
          <div style={{ fontSize: 10, color: "var(--db-muted)" }}>Days Moved</div>
        </div>
      </div>
      {wins.slice(0, 3).map((w, i) => (
        <div key={i} style={{ fontSize: 12, color: "var(--db-text)", marginBottom: 4, paddingLeft: 12, borderLeft: "2px solid rgba(74,200,130,0.3)" }}>&ldquo;{w}&rdquo;</div>
      ))}
      {pattern && (
        <div style={{ margin: "12px 0", padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, fontSize: 12, color: "var(--db-sub)", lineHeight: 1.5 }}>{pattern}</div>
      )}
      <div style={{ fontSize: 13, fontWeight: 500, margin: "14px 0 6px" }}>Focus for next week?</div>
      <textarea value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="One thing..." rows={2}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--db-border)", borderRadius: 8, padding: "10px 12px", color: "var(--db-text)", fontSize: 13, resize: "none", boxSizing: "border-box", outline: "none" }} />
      <button onClick={handleSave} disabled={saving}
        style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 10, background: "rgba(91,155,213,0.15)", border: "1px solid rgba(91,155,213,0.3)", color: "var(--db-text)", fontSize: 13, cursor: "pointer" }}>
        {saving ? "Saving..." : "Collect Weekly Token ✦"}
      </button>
    </div>
  );
}
