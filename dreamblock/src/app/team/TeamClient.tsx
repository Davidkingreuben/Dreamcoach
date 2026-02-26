"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getDreams,
  getTeams,
  getTeamByCode,
  saveTeam,
  deleteTeam,
  generateTeamCode,
  saveTeamSignal,
} from "@/lib/storage";
import type { Dream, DreamTeam, TeamMember, TeamSignal, SharingLevel } from "@/lib/types";

// ── Theme ──────────────────────────────────────────────────────────────────────

const T = {
  bg: "var(--db-bg)",
  surface: "var(--db-surface)",
  border: "var(--db-border)",
  text: "var(--db-text)",
  sub: "var(--db-sub)",
  muted: "var(--db-muted)",
};

// ── Emoji picker pool ──────────────────────────────────────────────────────────

const EMOJIS = ["🌱", "🔥", "⚡", "🌙", "🌊", "🦋", "🪐", "🌿", "💡", "🎯", "🌄", "✦"];

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ChipBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: selected ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
        background: selected ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)",
        color: selected ? T.text : T.sub,
        fontSize: 13,
        cursor: "pointer",
        textAlign: "left" as const,
        width: "100%",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

type View =
  | "list"
  | "create-step1"
  | "create-step2"
  | "create-step3"
  | "created"
  | "join"
  | "team-detail";

export default function TeamClient() {
  const [view, setView] = useState<View>("list");
  const [teams, setTeams] = useState<DreamTeam[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<DreamTeam | null>(null);
  const [loading, setLoading] = useState(true);

  // Create flow state
  const [createName, setCreateName] = useState("");
  const [createDreamId, setCreateDreamId] = useState("");
  const [createMyName, setCreateMyName] = useState("");
  const [createSharing, setCreateSharing] = useState<SharingLevel>("streak_only");
  const [createdTeam, setCreatedTeam] = useState<DreamTeam | null>(null);

  // Join flow state
  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinDreamTitle, setJoinDreamTitle] = useState("");
  const [joinSharing, setJoinSharing] = useState<SharingLevel>("streak_only");
  const [joinError, setJoinError] = useState("");

  // Signal state
  const [signalSent, setSignalSent] = useState<string | null>(null);

  useEffect(() => {
    setTeams(getTeams());
    setDreams(getDreams());
    setLoading(false);
  }, []);

  function refreshTeams() {
    setTeams(getTeams());
  }

  // ── Create team ──────────────────────────────────────────────────────────────

  function handleCreate() {
    const code = generateTeamCode();
    const myMemberId = crypto.randomUUID();
    const dream = dreams.find((d) => d.id === createDreamId);

    const me: TeamMember = {
      id: myMemberId,
      name: createMyName || "You",
      emoji: randomEmoji(),
      dream_title: dream?.title || "My dream",
      is_me: true,
      sharing_level: createSharing,
      joined_at: new Date().toISOString(),
    };

    const team: DreamTeam = {
      id: crypto.randomUUID(),
      code,
      name: createName || "Dream Team",
      my_dream_id: createDreamId,
      my_member_id: myMemberId,
      sharing_level: createSharing,
      privacy_locked: false,
      members: [me],
      signals: [],
      created_at: new Date().toISOString(),
    };

    saveTeam(team);
    setCreatedTeam(team);
    refreshTeams();
    setView("created");
  }

  // ── Join team ──────────────────────────────────────────────────────────────

  function handleJoin() {
    setJoinError("");
    const existing = getTeamByCode(joinCode.toUpperCase().trim());
    if (!existing) {
      setJoinError("No team found with that code. Check it and try again.");
      return;
    }
    const myMemberId = crypto.randomUUID();
    const me: TeamMember = {
      id: myMemberId,
      name: joinName || "A dreamer",
      emoji: randomEmoji(),
      dream_title: joinDreamTitle || "My dream",
      is_me: true,
      sharing_level: joinSharing,
      joined_at: new Date().toISOString(),
    };
    const updated: DreamTeam = {
      ...existing,
      my_member_id: myMemberId,
      sharing_level: joinSharing,
      members: [...existing.members, me],
    };
    saveTeam(updated);
    refreshTeams();
    setSelectedTeam(updated);
    setView("team-detail");
  }

  // ── Send signal ──────────────────────────────────────────────────────────────

  function handleSignal(team: DreamTeam, didSomething: boolean) {
    const signal: TeamSignal = {
      id: crypto.randomUUID(),
      team_id: team.id,
      member_id: team.my_member_id,
      date: todayStr(),
      did_something: didSomething,
      is_restart: false,
      created_at: new Date().toISOString(),
    };
    saveTeamSignal(signal);
    setSignalSent(team.id);
    refreshTeams();
    setTimeout(() => setSignalSent(null), 3000);
  }

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.6)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </main>
    );
  }

  // ── VIEWS ─────────────────────────────────────────────────────────────────────

  // ── Created screen ──
  if (view === "created" && createdTeam) {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", padding: "calc(env(safe-area-inset-top,0px) + 24px) 24px 24px" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 24 }}>Dream Team · Created</p>
        <p style={{ fontSize: 26, fontWeight: 300, color: T.text, marginBottom: 8, lineHeight: 1.3 }}>Your team is ready.</p>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 32, lineHeight: 1.6 }}>
          Share the invite code with your Dream-Mate. They&apos;ll enter it in the Join screen.
        </p>

        {/* Invite code */}
        <div style={{ background: "rgba(139,126,216,0.10)", border: "1px solid rgba(139,126,216,0.25)", borderRadius: 16, padding: "24px", textAlign: "center" as const, marginBottom: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#8B7ED8", fontWeight: 600, marginBottom: 8 }}>Invite Code</p>
          <p style={{ fontSize: 36, fontWeight: 200, letterSpacing: "0.25em", color: T.text, margin: 0 }}>{createdTeam.code}</p>
        </div>

        <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>
          No leaderboards. No rankings. Just two people holding each other accountable — privately.
        </p>

        <button
          onClick={() => { setSelectedTeam(createdTeam); setView("team-detail"); }}
          style={{ width: "100%", padding: "18px", borderRadius: 16, background: T.text, color: "#050510", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10 }}
        >
          Go to your team →
        </button>
        <button
          onClick={() => setView("list")}
          style={{ width: "100%", padding: "12px", borderRadius: 16, background: "transparent", color: T.muted, fontSize: 13, border: "none", cursor: "pointer" }}
        >
          Back
        </button>
      </main>
    );
  }

  // ── Join screen ──
  if (view === "join") {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 24px) 24px 0" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 16 }}>Join a Dream Team</p>
          <p style={{ fontSize: 22, fontWeight: 300, color: T.text, lineHeight: 1.3 }}>Enter your invite code.</p>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Invite code</p>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. AB12CD"
              maxLength={6}
              style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: T.text, fontSize: 18, letterSpacing: "0.2em", textAlign: "center" as const, outline: "none", boxSizing: "border-box" as const }}
            />
            {joinError && <p style={{ fontSize: 13, color: "#C47A5A", marginTop: 8 }}>{joinError}</p>}
          </div>
          <div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Your name (shown to team)</p>
            <input
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder="e.g. Jordan"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const }}
            />
          </div>
          <div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Your dream (one line)</p>
            <input
              value={joinDreamTitle}
              onChange={(e) => setJoinDreamTitle(e.target.value)}
              placeholder="e.g. Write my first novel"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const }}
            />
          </div>
          <div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>What do you want to share with your team?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {([
                ["private", "Nothing — just knowing someone else is working"],
                ["streak_only", "My streak only"],
                ["tiny_action", "My daily tiny action"],
                ["weekly_summary", "My weekly summary"],
              ] as [SharingLevel, string][]).map(([v, l]) => (
                <ChipBtn key={v} label={l} selected={joinSharing === v} onClick={() => setJoinSharing(v)} />
              ))}
            </div>
          </div>
          <button
            onClick={handleJoin}
            disabled={joinCode.length < 4}
            style={{ width: "100%", padding: "18px", borderRadius: 16, background: joinCode.length < 4 ? "rgba(255,255,255,0.08)" : T.text, color: joinCode.length < 4 ? T.muted : "#050510", fontSize: 16, fontWeight: 600, border: "none", cursor: joinCode.length < 4 ? "not-allowed" : "pointer" }}
          >
            Join team →
          </button>
          <button
            onClick={() => setView("list")}
            style={{ width: "100%", padding: "12px", borderRadius: 16, background: "transparent", color: T.muted, fontSize: 13, border: "none", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </main>
    );
  }

  // ── Create flow ──
  if (view === "create-step1") {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 24px) 24px 0" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 16 }}>Create · 1 of 3</p>
          <p style={{ fontSize: 22, fontWeight: 300, color: T.text, lineHeight: 1.3, marginBottom: 24 }}>Give your team a name.</p>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="e.g. The Night Shift, Studio Sessions..."
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: T.text, fontSize: 15, outline: "none", boxSizing: "border-box" as const }}
          />
          <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            Your team has 1–5 people. No leaderboards, no rankings — just quiet accountability.
          </p>
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <button
              onClick={() => setView("create-step2")}
              style={{ width: "100%", padding: "18px", borderRadius: 16, background: T.text, color: "#050510", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10 }}
            >
              Continue →
            </button>
            <button onClick={() => setView("list")} style={{ width: "100%", padding: "12px", borderRadius: 16, background: "transparent", color: T.muted, fontSize: 13, border: "none", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      </main>
    );
  }

  if (view === "create-step2") {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 24px) 24px 0" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 16 }}>Create · 2 of 3</p>
          <p style={{ fontSize: 22, fontWeight: 300, color: T.text, lineHeight: 1.3, marginBottom: 24 }}>Which dream is this team for?</p>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {dreams.length === 0 ? (
            <div style={{ textAlign: "center" as const, padding: "40px 0" }}>
              <p style={{ fontSize: 14, color: T.muted, marginBottom: 16 }}>No dreams yet.</p>
              <Link href="/check" style={{ fontSize: 14, color: T.text, textDecoration: "none" }}>Start an assessment first →</Link>
            </div>
          ) : (
            dreams.filter((d) => d.status === "active").map((d) => (
              <ChipBtn
                key={d.id}
                label={`${d.title} · ${d.category}`}
                selected={createDreamId === d.id}
                onClick={() => setCreateDreamId(d.id)}
              />
            ))
          )}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <button
              onClick={() => setView("create-step3")}
              disabled={!createDreamId}
              style={{ width: "100%", padding: "18px", borderRadius: 16, background: !createDreamId ? "rgba(255,255,255,0.08)" : T.text, color: !createDreamId ? T.muted : "#050510", fontSize: 16, fontWeight: 600, border: "none", cursor: !createDreamId ? "not-allowed" : "pointer", marginBottom: 10 }}
            >
              Continue →
            </button>
            <button onClick={() => setView("create-step1")} style={{ width: "100%", padding: "12px", borderRadius: 16, background: "transparent", color: T.muted, fontSize: 13, border: "none", cursor: "pointer" }}>← Back</button>
          </div>
        </div>
      </main>
    );
  }

  if (view === "create-step3") {
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 24px) 24px 0" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 16 }}>Create · 3 of 3</p>
          <p style={{ fontSize: 22, fontWeight: 300, color: T.text, lineHeight: 1.3, marginBottom: 24 }}>Your name and privacy.</p>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Your name (shown to team)</p>
            <input
              value={createMyName}
              onChange={(e) => setCreateMyName(e.target.value)}
              placeholder="e.g. Alex"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: T.text, fontSize: 14, outline: "none", boxSizing: "border-box" as const }}
            />
          </div>
          <div>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>What do you want to share?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {([
                ["private", "Nothing — just knowing someone else is working"],
                ["streak_only", "My streak only"],
                ["tiny_action", "My daily tiny action"],
                ["weekly_summary", "My weekly summary"],
              ] as [SharingLevel, string][]).map(([v, l]) => (
                <ChipBtn key={v} label={l} selected={createSharing === v} onClick={() => setCreateSharing(v)} />
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
            You can change your privacy level or leave the team at any time.
          </p>
          <div>
            <button
              onClick={handleCreate}
              style={{ width: "100%", padding: "18px", borderRadius: 16, background: T.text, color: "#050510", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10 }}
            >
              Create team →
            </button>
            <button onClick={() => setView("create-step2")} style={{ width: "100%", padding: "12px", borderRadius: 16, background: "transparent", color: T.muted, fontSize: 13, border: "none", cursor: "pointer" }}>← Back</button>
          </div>
        </div>
      </main>
    );
  }

  // ── Team detail ──
  if (view === "team-detail" && selectedTeam) {
    const todaySig = selectedTeam.signals.find(
      (s) => s.member_id === selectedTeam.my_member_id && s.date === todayStr()
    );
    return (
      <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 20px) 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 4 }}>Dream Team</p>
          <p style={{ fontSize: 20, fontWeight: 300, color: T.text }}>{selectedTeam.name}</p>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.muted, background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 6, letterSpacing: "0.1em" }}>{selectedTeam.code}</span>
            <span style={{ fontSize: 11, color: T.muted }}>{selectedTeam.members.length} member{selectedTeam.members.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Today's signal */}
          {!todaySig ? (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 12 }}>Send today&apos;s signal</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleSignal(selectedTeam, true)}
                  style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(74,140,110,0.15)", border: "1px solid rgba(74,140,110,0.3)", color: "#4A8C6E", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  ✓ Took my step
                </button>
                <button
                  onClick={() => handleSignal(selectedTeam, false)}
                  style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: T.muted, fontSize: 13, cursor: "pointer" }}
                >
                  · Checked in honest
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(74,140,110,0.10)", border: "1px solid rgba(74,140,110,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#4A8C6E", fontWeight: 500, margin: 0 }}>
                {todaySig.did_something ? "✓ Signal sent — you moved today." : "· Honest check-in sent."}
              </p>
            </div>
          )}

          {signalSent === selectedTeam.id && (
            <div style={{ background: "rgba(74,140,110,0.10)", border: "1px solid rgba(74,140,110,0.2)", borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#4A8C6E", margin: 0 }}>Signal sent. Your team-mate knows you showed up.</p>
            </div>
          )}

          {/* Members */}
          <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 12 }}>The team</p>
          {selectedTeam.members.map((m) => {
            const todayMemberSig = selectedTeam.signals.find(
              (s) => s.member_id === m.id && s.date === todayStr()
            );
            return (
              <div key={m.id} style={{ background: T.surface, borderRadius: 14, padding: "14px 16px", marginBottom: 8, display: "flex", gap: 14, alignItems: "center", border: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 24 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.text, fontWeight: 500, margin: 0 }}>
                    {m.name} {m.is_me ? "(you)" : ""}
                  </p>
                  <p style={{ fontSize: 12, color: T.muted, margin: "2px 0 0" }}>{m.dream_title}</p>
                </div>
                {todayMemberSig ? (
                  <span style={{ fontSize: 13, color: todayMemberSig.did_something ? "#4A8C6E" : T.muted }}>
                    {todayMemberSig.did_something ? "✓" : "·"}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>—</span>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: 24, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: 0 }}>
              No leaderboards. No rankings. This is accountability, not competition.
            </p>
          </div>

          <button
            onClick={() => { deleteTeam(selectedTeam.id); refreshTeams(); setView("list"); }}
            style={{ width: "100%", padding: "12px", borderRadius: 12, background: "transparent", color: "rgba(196,122,90,0.6)", fontSize: 12, border: "none", cursor: "pointer", marginTop: 12 }}
          >
            Leave this team
          </button>
        </div>

        <div style={{ padding: "12px 24px", paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 12px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <button onClick={() => setView("list")} style={{ fontSize: 13, color: T.muted, background: "none", border: "none", cursor: "pointer" }}>← All teams</button>
        </div>
      </main>
    );
  }

  // ── LIST view ──────────────────────────────────────────────────────────────

  return (
    <main style={{ background: T.bg, minHeight: "100dvh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ padding: "calc(env(safe-area-inset-top,0px) + 20px) 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500, marginBottom: 4 }}>Dream Coach</p>
        <p style={{ fontSize: 22, fontWeight: 300, color: T.text }}>Dream Team</p>
        <p style={{ fontSize: 13, color: T.muted, marginTop: 4, lineHeight: 1.5 }}>
          Quiet accountability. 1–5 people. No leaderboards.
        </p>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {teams.length > 0 ? (
          <>
            <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.muted, fontWeight: 500 }}>Your teams</p>
            {teams.map((team) => {
              const todaySig = team.signals.find(
                (s) => s.member_id === team.my_member_id && s.date === todayStr()
              );
              return (
                <div
                  key={team.id}
                  onClick={() => { setSelectedTeam(team); setView("team-detail"); }}
                  style={{ background: T.surface, borderRadius: 16, padding: "16px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: T.text, margin: 0 }}>{team.name}</p>
                      <p style={{ fontSize: 12, color: T.muted, margin: "4px 0 0" }}>
                        {team.members.length} member{team.members.length !== 1 ? "s" : ""} · {team.code}
                      </p>
                    </div>
                    {todaySig ? (
                      <span style={{ fontSize: 13, color: "#4A8C6E" }}>✓ today</span>
                    ) : (
                      <span style={{ fontSize: 12, color: T.muted }}>no signal →</span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div style={{ paddingTop: 20 }}>
            <div style={{ background: T.surface, borderRadius: 16, padding: "20px", marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: T.sub, lineHeight: 1.65, margin: 0 }}>
                Dreams move faster with someone who knows you&apos;re working. A Dream Team is 1–5 people holding each other accountable — no comparison, no pressure, just shared motion.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: teams.length > 0 ? 8 : 0 }}>
          <button
            onClick={() => setView("create-step1")}
            style={{ width: "100%", padding: "18px", borderRadius: 16, background: T.text, color: "#050510", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Create a team →
          </button>
          <button
            onClick={() => setView("join")}
            style={{ width: "100%", padding: "16px", borderRadius: 16, background: "rgba(255,255,255,0.05)", color: T.sub, fontSize: 15, fontWeight: 500, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}
          >
            Join with a code
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 24px", paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 12px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Link href="/dashboard" style={{ fontSize: 13, color: T.muted, textDecoration: "none" }}>← All dreams</Link>
      </div>
    </main>
  );
}
