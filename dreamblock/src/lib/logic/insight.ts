import type { Dream, InsightSummary, DailyMode, ResistanceArchetype } from "../types";
import { hasKeyword } from "./archetypes";

// ── Philosophy lines ──────────────────────────────────────────────────────────

const PHILOSOPHY: string[] = [
  "The reward for a good deed is the opportunity to do another good deed.",
  "Fail fast. Failure is fuel.",
  "One step at a time.",
  "Walk to the end of the road. Look left, right, or straight. If it's a dead end, turn around — then plan your next step.",
  "Faith is taking the next step before you can see the whole map.",
];

function pickPhilosophy(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return PHILOSOPHY[Math.abs(hash) % PHILOSOPHY.length];
}

// ── SEEN: reveals the hidden psychological pattern ────────────────────────────
// Principle: interpret and reframe, never echo. Every SEEN must reveal
// something the user has not already articulated themselves.

const SEEN_BY_ARCHETYPE: Record<ResistanceArchetype, string> = {
  "Fear of Visibility":
    "The work exists in a protected version in your head — where it can still be good, where no one can misunderstand it, and where you can remain the person who might do this. Sharing collapses that possibility space. Your resistance isn't about laziness or conventional fear of failure. It's about preserving optionality: the dream that hasn't been tested can't yet be a disappointment. The pattern isn't 'I can't do this.' It's 'I can't let go of the unbeaten version of it.'",
  "Perfectionist Freeze":
    "The standard keeps moving — not because you demand quality, but because the finish line is doing a specific job. As long as the work isn't done, it can't be judged. The perfectionism isn't about the output. It's a permission structure: by never reaching 'ready,' you never have to find out what happens when you give it everything and it still doesn't land the way you hoped. The bar isn't real. It's managed.",
  "Overwhelm Fog":
    "The problem isn't motivation or capability — it's that you're trying to make every decision at once. The brain cannot navigate a destination it can't fully picture, so it locks. What presents as overwhelm is almost always a decision-avoidance loop: you can't start because you haven't fully decided, and you can't decide because the stakes of the whole project are mentally loaded onto each individual choice. You don't need the full map. You need the next ten meters.",
  "Identity Conflict":
    "Part of you is waiting to become someone else before you start — but there's a layer beneath that. Pursuing this means others will witness the transition. People who know you as someone who talks about this dream will now see you attempt it. That renegotiation of identity in other people's eyes is part of what's in the way, alongside the internal uncertainty. The identity doesn't come before the action. It forms through it.",
  "Fear of Success":
    "Even with success guaranteed, you'd still hesitate. That's significant information. This isn't ambivalence about the dream — the dream is usually genuinely wanted. What's resisted is everything the success would rearrange: the expectations, the changed relationships, the version of yourself you'd have to maintain, the life that would reorganise around an outcome you chose. Failure is safe because it changes nothing. Success changes everything.",
  "Shame Loop":
    "There's a data point from the past — a failed attempt, criticism that landed wrong, a comparison that calcified — that's been treated as a verdict. Shame doesn't stay attached to the original event; it generalises. It stops being 'that didn't work' and becomes 'I'm someone this doesn't work for.' The loop keeps this dream feeling pre-failed. You're not assessing the current attempt. You're re-running the old one.",
  "Consistency Collapse":
    "Motivation is highest at the start and lowest in the middle — and most systems are built for high motivation. When motivation drops to its natural baseline, there's nothing structural holding the habit in place. This is read as a character failure. It isn't. Willpower depletes. Systems don't. The question that matters isn't 'why do I keep stopping?' It's 'what would make returning the path of least resistance?' That's a design problem, not a discipline problem.",
  "Misalignment":
    "The dream has accumulated weight it wasn't meant to carry. What may have started as genuine desire has become entangled with identity, with proving something, with what pursuing this would say about you — or what not pursuing it would mean. The daily work feels hollow not because the dream is wrong but because the reasons for it have shifted. The outer form may be right. The inner driver needs examining.",
};

// ── Interpretive signal from "Other" free-text fields ────────────────────────
// Principle: use other fields as signals, never quote them back directly.

function getOtherSignalInterpretation(dream: Dream): string {
  if (dream.emotion_other?.trim()) {
    const t = dream.emotion_other.trim();
    if (hasKeyword(t, ["anxious", "anxiety", "panic", "nervous"])) return "The anxiety pattern here activates before there's anything concrete to be anxious about — which usually means it's running on anticipation, not evidence.";
    if (hasKeyword(t, ["shame", "embarrass", "humiliat", "worthless"])) return "The shame layer here runs below the surface — it's not just about this dream, it's about what this dream says about who you are.";
    if (hasKeyword(t, ["overwhelm", "too much", "drown", "exhaust", "burnout"])) return "The overwhelm has a specific texture — it isn't general busyness, it's the weight of this particular thing feeling larger than what can be held.";
    if (hasKeyword(t, ["numb", "hollow", "empty", "flat", "disconnect"])) return "The emotional flatness around this dream is worth attending to — numbness around something that matters is usually a protection response, not genuine indifference.";
    if (hasKeyword(t, ["confus", "uncertain", "unsure", "unclear"])) return "The uncertainty here isn't a lack of knowledge. It usually signals two competing needs pulling in opposite directions beneath the surface.";
    return "The emotional signature here is more layered than standard categories can hold — which usually means it's operating below the level where it can be reasoned with directly.";
  }

  if (dream.first_thought_other?.trim()) {
    const t = dream.first_thought_other.trim();
    if (hasKeyword(t, ["money", "financial", "afford", "cost", "resource"])) return "The practical constraint is real — but it's worth examining whether it's the primary block or whether it's also providing psychological cover for something that feels harder to name.";
    if (hasKeyword(t, ["not good enough", "not ready", "not skilled", "impostor", "fraud"])) return "The readiness requirement will keep moving — the version of you that feels ready doesn't exist yet, and it won't until after you've started.";
    if (hasKeyword(t, ["time", "busy", "no time", "too much on"])) return "Time is real, but it's also the most socially acceptable reason for not pursuing something. The question worth sitting with is what's underneath the time constraint.";
    return "The specific thought that interrupts this carries more weight than its surface content — which usually means it's protecting something specific.";
  }

  if (dream.stuck_point_other?.trim()) {
    const t = dream.stuck_point_other.trim();
    if (hasKeyword(t, ["start", "begin", "first", "initiat"])) return "The block at initiation suggests the problem isn't readiness — it's the cognitive load of holding the full project on a single first step.";
    if (hasKeyword(t, ["finish", "complet", "done", "end", "final"])) return "The pattern of difficulty at completion often has less to do with the work and more to do with what completion makes unavoidable.";
    return "The specific point where you get stuck is more diagnostic than it might appear — where resistance concentrates usually points directly at what's being protected.";
  }

  if (dream.protecting_other?.trim()) {
    const t = dream.protecting_other.trim();
    if (hasKeyword(t, ["relationship", "family", "partner", "friend"])) return "When the resistance is protecting relationships, it's often because success would require renegotiating dynamics that have been stable for a long time.";
    if (hasKeyword(t, ["money", "income", "financial", "stability"])) return "Financial protection is a legitimate concern — and it can also become the fixed frame through which every reason-not-to is filtered.";
    return "What you identified as needing protection is worth understanding carefully — resistance always protects something real, even when the protection is no longer necessary.";
  }

  return "";
}

function getSeen(dream: Dream): string {
  const archetype = dream.archetype as ResistanceArchetype;
  const base = SEEN_BY_ARCHETYPE[archetype] || "You've been carrying this longer than you needed to. The resistance makes sense given everything it's protecting you from. Understanding what it's protecting is the first real step.";
  const prefix = getOtherSignalInterpretation(dream);
  return prefix ? `${prefix} ${base}` : base;
}

// ── HELD: validates why the pattern exists ────────────────────────────────────

function getHeld(dream: Dream): string {
  const years = dream.years_delayed || "a while";
  const delayedStr = years === "< 1 year" ? "less than a year" : years;
  const hesitate = dream.guaranteed_hesitate === "yes";
  const notTimeLeft = dream.willing_to_commit === false;
  const timeIssue = dream.time_realistic === "none" || dream.time_realistic === "little";
  const archetype = dream.archetype as ResistanceArchetype;

  // Archetype-specific HELD variations
  if (archetype === "Shame Loop") {
    return `You've carried this for ${delayedStr}. That's not evidence of weakness — it's evidence of how much the past attempt still costs you. Shame is one of the most energy-intensive psychological states to carry; the fact that you're here, willing to look at it again, is data that contradicts the story the shame is telling.`;
  }
  if (archetype === "Fear of Success") {
    return `You've carried this for ${delayedStr}, and the honest answer is: the hesitation makes sense. When success would genuinely change things — relationships, expectations, identity — it's not irrational to pause. The question isn't whether the hesitation is valid. It is. The question is whether what you'd gain is worth what you'd have to navigate.`;
  }
  if (archetype === "Misalignment") {
    return `You've carried this for ${delayedStr}. The fact that it's still here, despite the hollow feeling sometimes, suggests there's something real underneath that hasn't found its right form yet. That's not failure. That's a clarification process that takes time.`;
  }

  if (hesitate) {
    return `You've carried this for ${delayedStr}. That is not laziness — that is the weight of something that genuinely matters. And the fact that you'd still hesitate even if success were guaranteed? That honesty matters. It means the obstacle lives somewhere more personal than outcome anxiety. Most people never get this honest about what's actually in the way.`;
  }
  if (notTimeLeft) {
    return `You've carried this for ${delayedStr}, and you've been honest: the timeline feels too long to commit to right now. That's not giving up. That's clarity. Deferring consciously — knowing why — is completely different from avoiding unconsciously. You're here, which means some part of you still hasn't let go.`;
  }
  if (timeIssue) {
    return `You've carried this for ${delayedStr} and you're living a full life with real obligations. The time issue is genuine. The dream is also genuine. You don't have to choose one to honour the other right now — you just have to be honest about which one is getting your attention, one day at a time.`;
  }
  return `You've carried this for ${delayedStr}. That's not failure. That's the weight of something that still matters enough to bring you here. The fact that you did this assessment means some part of you hasn't let go — and that part deserves a fair hearing. Today isn't a verdict. It's just information.`;
}

// ── MOVED: tactical first action, calibrated to archetype + stuck point ───────

const MOVED_BY_STUCK: Record<string, { action: string; doorway: string; mode: DailyMode }> = {
  starting: {
    action: "Open a blank document or notebook page. Write the title of your dream at the top. Nothing else. Close it. That's the session. Three minutes maximum.",
    doorway: "Physically touch the object most associated with your dream — instrument, notebook, sketchbook, running shoes. Just touch it. That's it.",
    mode: "do",
  },
  consistency: {
    action: "Identify one specific time slot this week — not every day, just one — when you will spend 10 minutes on this. Write it down as a calendar appointment. Don't plan the work yet. Just schedule the slot.",
    doorway: "Set a recurring alarm on your phone labelled with your dream title. Just the alarm. Don't decide what to do with it yet.",
    mode: "plan",
  },
  finishing: {
    action: "Open whatever you last worked on. Read it, look at it, listen to it — don't edit. Just observe where you actually are. Set a timer for 10 minutes. When it goes off, stop.",
    doorway: "List the three things that would need to happen for this to be 'done.' Just the list. No action required.",
    mode: "do",
  },
  publishing: {
    action: "Send your work to one trusted person and ask only: 'Does this make sense?' That's the whole brief. One person. One question.",
    doorway: "Write the title or subject line of the post, upload, or send you're avoiding. Just the title. Nowhere to post it yet.",
    mode: "ask",
  },
  promoting: {
    action: "Find one person who has done something adjacent to your dream and read about how they started sharing. Just research — no action on your own work yet.",
    doorway: "Write one sentence about what you made and why it exists. For your eyes only.",
    mode: "learn",
  },
  committing: {
    action: "Write this down: 'If I do this for 30 days and it goes nowhere, I will have learned ____.' Fill in the blank. That's the commitment frame — not 'will it succeed' but 'what will I find out.'",
    doorway: "Write the answer to: 'What would trying look like if I wasn't trying to succeed — just trying to find out?' One sentence.",
    mode: "plan",
  },
};

function getMoved(dream: Dream): { action: string; doorway: string; mode: DailyMode } {
  const stuck = dream.stuck_point;
  const archetype = dream.archetype;

  // Archetype + stuck-point specific overrides
  if (archetype === "Fear of Visibility" && stuck === "publishing") {
    return {
      action: "Write an honest caption for your work as if you were talking to one person who already gets it — not the public. Don't post it. Just write it. Five minutes.",
      doorway: "Name the specific fear underneath not posting. Write it in one sentence. Private. No action required.",
      mode: "do",
    };
  }
  if (archetype === "Fear of Visibility" && stuck === "promoting") {
    return {
      action: "Find one person whose work you respect who shares similar things publicly. Study one post or release they made. Just observe the texture of how they do it. Nothing on your own work yet.",
      doorway: "Write: 'If someone I trusted was going to share this for me, what would I want them to say about it?' One sentence.",
      mode: "learn",
    };
  }
  if (archetype === "Perfectionist Freeze" && stuck === "finishing") {
    return {
      action: "Set a timer for 10 minutes. Work on your piece with the intention of making it 5% worse on purpose. Ship the deliberately imperfect version of one small part.",
      doorway: "Write down three things that are already working about it. Three. Not what's missing — what's there.",
      mode: "do",
    };
  }
  if (archetype === "Overwhelm Fog" && stuck === "starting") {
    return {
      action: "Write the single smallest action that would count as 'touching' this dream today. The embarrassingly small one. Now do just that one thing.",
      doorway: "Open a note and type: 'The next physical action on my dream is:' Fill in the blank with a verb and object. ('Write opening line.' 'Send email to X.' 'Tune the guitar.')",
      mode: "do",
    };
  }
  if (archetype === "Shame Loop") {
    return {
      action: "Write two sentences: what you tried before, and one thing that was genuinely different about the circumstances then versus now. Not to minimise what happened — to update the data.",
      doorway: "Name the story you've been carrying about why it didn't work before. Write it in one sentence. Then ask: is this definitely true, or is it the most painful interpretation of what happened?",
      mode: "do",
    };
  }
  if (archetype === "Identity Conflict") {
    return {
      action: "Do one private action related to this dream that no one will see, judge, or know about. Not for an audience — just for you. Ten minutes or less.",
      doorway: "Write: 'The version of me who actually does this would...' and complete the sentence honestly. No filtering.",
      mode: "do",
    };
  }
  if (archetype === "Consistency Collapse") {
    return {
      action: "Identify the exact moment you typically stop and write it down. Then write what you'll do instead at that specific moment — not in general, at that exact point. That's the system change.",
      doorway: "Reduce the minimum: what's the version of this that takes 5 minutes or less and still counts as showing up? Define it. That's your floor for hard days.",
      mode: "plan",
    };
  }
  if (archetype === "Misalignment") {
    return {
      action: "Spend 10 minutes writing: 'What I actually want from this dream is...' Answer without using the dream itself in the answer. What feeling, state, or outcome is the real target?",
      doorway: "Ask yourself honestly: if no one would ever know you pursued this, would you still want to? Write the first answer that comes, before you reason around it.",
      mode: "do",
    };
  }

  return MOVED_BY_STUCK[stuck] || {
    action: "Take 10 minutes and do the first thing that comes to mind when you think about this dream. Not the right thing — just something. Fail fast.",
    doorway: "Write the name of the dream on a piece of paper. Put it somewhere you'll see it tomorrow morning.",
    mode: "do",
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateInsight(dream: Dream): InsightSummary {
  const seen = getSeen(dream);
  const held = getHeld(dream);
  const { action: moved, doorway: moved_doorway, mode: moved_mode } = getMoved(dream);
  const philosophy_line = pickPhilosophy(dream.id);

  return { seen, held, moved, moved_doorway, moved_mode, philosophy_line };
}

// ── Weekly pattern generator ──────────────────────────────────────────────────

export function generateWeeklyPattern(
  checkinCount: number,
  didDays: number,
  hardReasons: string[]
): string {
  if (checkinCount === 0) return "No check-ins this week. No penalty. Come back today. Restarting is the skill.";
  if (didDays === 0) return `You checked in ${checkinCount} time${checkinCount !== 1 ? "s" : ""} this week and were honest every time. That honesty is data, not failure.`;

  const rate = didDays / 7;
  const topReason = hardReasons.length > 0
    ? hardReasons.sort((a, b) =>
        hardReasons.filter((x) => x === b).length - hardReasons.filter((x) => x === a).length
      )[0]
    : null;

  const reasonPhrases: Record<string, string> = {
    fear: "Fear was the main friction this week.",
    perfectionism: "Perfectionism was the dominant block.",
    unclear: "Lack of clarity was the biggest obstacle.",
    energy: "Energy was the limiting factor.",
    time: "Time was tight this week.",
    distraction: "Distraction was the main friction.",
    other: "Something specific kept getting in the way.",
  };

  const reasonPhrase = topReason ? reasonPhrases[topReason] || "" : "";

  if (rate >= 0.7) return `Strong week — you showed up ${didDays} out of 7 days. ${reasonPhrase} The compounding is working.`;
  if (rate >= 0.4) return `Solid week — ${didDays} days of forward motion. ${reasonPhrase} Consistency isn't perfection. This counts.`;
  return `${didDays} day${didDays !== 1 ? "s" : ""} of movement this week. ${reasonPhrase} Coming back every week matters more than any single week's number.`;
}
