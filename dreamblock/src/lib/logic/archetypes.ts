import type { ResistanceArchetype, ResistanceAnswers, StuckPhase, StuckPoint } from "../types";

export const ARCHETYPE_INFO: Record<ResistanceArchetype, {
  icon: string;
  tagline: string;
  description: string;
  color: string;
  bg: string;
  why: string;
  protects: string;
  confuses: string;
  cheats: string[];
}> = {
  "Fear of Visibility": {
    icon: "◉",
    tagline: "You can create. You can't be seen.",
    description: "Your work exists — but sharing it triggers something primal. Visibility feels like exposure, not expression.",
    color: "#8B7ED8",
    bg: "rgba(139,126,216,0.10)",
    why: "Visibility transfers control. Once the work is public, others can define it before you can. The protection mechanism developed because exposure, at some point, felt genuinely threatening — not metaphorically, but in a way the nervous system logged as dangerous.",
    protects: "It protects the possibility space — the dream that hasn't been tested can't yet be a disappointment, and the version of you who 'might do this' remains intact.",
    confuses: "Most people confuse this with perfectionism, because the behaviour looks identical: not finishing, not sharing, raising the bar. The difference is where the resistance peaks — perfectionism stalls at completion; this pattern stalls specifically at exposure.",
    cheats: [
      "Share with one trusted person before any public audience — specificity of audience changes everything",
      "Release a fragment rather than the whole project; a piece carries less identity weight than the full thing",
      "Label the first version explicitly temporary ('draft', 'early version') — reversibility reduces the psychological stakes",
      "Separate the creative session from the sharing decision entirely — decide to share at a different time, in a different headspace",
      "Write the description or caption before you release anything — framing the work yourself first gives you back some control over how it lands",
    ],
  },
  "Perfectionist Freeze": {
    icon: "◌",
    tagline: "Nothing is ever ready enough.",
    description: "You raise the bar every time you get close. Perfection isn't a standard — it's a delay mechanism.",
    color: "#5B9BD5",
    bg: "rgba(91,155,213,0.10)",
    why: "The moving standard isn't about quality — it's a permission structure. As long as the work isn't done, it can't be judged. The bar rises because reaching it has too high a cost: finding out that you gave everything and it still wasn't enough.",
    protects: "It protects against the specific devastation of full effort followed by failure — if you never truly finish, you can never truly fail.",
    confuses: "This looks like high standards and professional rigour. It isn't. High standards produce finished work. This produces perpetual revision. The tell is whether the standard is stable — perfectionism's standard is always moving.",
    cheats: [
      "Set a fixed timer and stop when it rings, complete or not — the constraint forces a completion decision",
      "Define 'good enough to proceed' in one sentence before you begin the session, not after",
      "Create a deliberately rough version and call it the 'ugly draft' — make ugliness the explicit goal",
      "List every standard you're holding and circle only the ones the audience will actually notice",
      "Give yourself permission to publish version 0.9 — not 1.0; the decimal lets the perfectionism breathe",
    ],
  },
  "Overwhelm Fog": {
    icon: "≋",
    tagline: "The scope swallows you before you begin.",
    description: "You see the whole mountain, not the next step. The gap between where you are and where you want to be feels uncrossable.",
    color: "#6B8FC5",
    bg: "rgba(107,143,197,0.10)",
    why: "The paralysis is decision avoidance dressed as scope overwhelm. You're trying to hold the entire project in working memory at once, which the brain cannot do — so it locks. The fog isn't a lack of capability; it's a lack of a defined next physical action.",
    protects: "It protects you from making the wrong first decision — which feels catastrophic when the stakes of the whole project are mentally loaded onto that single choice.",
    confuses: "This is regularly mistaken for laziness, low motivation, or personality. It's none of those. It's almost always the absence of one specific thing: a clear next physical action expressed as a verb and an object.",
    cheats: [
      "Write only the next physical action — verb + object only ('open file', 'email X', 'write first sentence') — nothing more",
      "Spend one session listing everything you think needs to happen, then circle only the first three — don't act yet",
      "Find the one decision that, once made, makes all adjacent decisions obvious — make that one first and only that one",
      "Shrink the scope until it feels almost embarrassingly small, then do that version; you can expand later",
      "Give the project a temporary working name to reduce the psychological weight of the real title",
    ],
  },
  "Identity Conflict": {
    icon: "⟁",
    tagline: "Who am I to do this?",
    description: "This dream doesn't fit the self-concept you currently inhabit. Pursuing it means becoming someone different — and that's terrifying.",
    color: "#9B7AAE",
    bg: "rgba(155,122,174,0.10)",
    why: "The self-concept doesn't yet include 'person who does this.' But there's a secondary layer: pursuing this means others will witness the transition — people who know you as someone who talks about this will now see you attempt it. That renegotiation of identity in others' eyes is part of what's in the way, not just the internal uncertainty.",
    protects: "It protects the current stable identity from disruption — even when that identity is genuinely limiting and you know it.",
    confuses: "This is consistently misread as imposter syndrome. They overlap, but imposter syndrome is about competence ('I don't know enough'); identity conflict is about self-concept ('I'm not the kind of person who does this').",
    cheats: [
      "Take one private action on this that no one else sees — identity shifts through private actions before public ones",
      "Separate 'I am a [musician/writer/entrepreneur]' from 'I do [music/writing/business]' — start with the verb, not the noun",
      "Find one person with a similar background to yours who does this — study specifically how they made the transition, not the outcome",
      "Do the work inside a bounded container (a class, a challenge, a side project) where the identity shift is temporary and low-stakes",
      "Write 'A person who does [this] for real would...' and complete it without filtering — then identify one thing on that list you can do this week",
    ],
  },
  "Fear of Success": {
    icon: "◈",
    tagline: "What changes if this actually works?",
    description: "Failure is familiar. Success would reorganize your life, relationships, and identity in ways you haven't fully faced.",
    color: "#5EAA8B",
    bg: "rgba(94,170,139,0.10)",
    why: "This isn't ambivalence about the dream — the dream is usually genuinely wanted. What's resisted are the renegotiations success would require: new responsibilities, changed relationships, a different version of yourself to maintain, expectations you didn't sign up for. The current life, even if constrained, is known and navigable.",
    protects: "It protects the known configuration of life and relationships from the uncertain reorganization that real success would demand.",
    confuses: "This is almost always felt as ambivalence or 'not being ready.' People rarely frame it as fear of success to themselves. The tell is the hesitation that persists even when failure has been removed from the equation.",
    cheats: [
      "Write the realistic version of your life post-success — including what gets harder, not just better — name it directly",
      "Take the smallest reversible action available: not a commitment, just a low-stakes experiment with an opt-out",
      "Identify the specific relationship or life structure you're most afraid success would disrupt — speak to that one thing directly",
      "Give yourself permission to succeed quietly first, before it becomes visible or public — private wins count",
      "Separate 'wanting the dream' from 'wanting everything that comes with the dream' — you don't need to resolve the second to begin",
    ],
  },
  "Shame Loop": {
    icon: "⊙",
    tagline: "Past attempts haunt this one.",
    description: "You've tried before and it didn't work. Now shame sits at the entrance. The past is preventing the present.",
    color: "#C47A5A",
    bg: "rgba(196,122,90,0.10)",
    why: "A past attempt, early criticism, or painful comparison became evidence — and shame doesn't stay attached to the original event. It generalises. It stops being 'that attempt failed' and becomes 'I am someone who fails at this.' The loop isn't about what happened. It's about what you decided what happened meant.",
    protects: "It protects you from adding more evidence to the existing story — if you don't try again, the case can't get worse.",
    confuses: "People carrying this pattern often believe they're being realistic about their chances based on prior data. They're not. They're running a biased data set: every failure is counted, every partial success is discounted.",
    cheats: [
      "Write what actually happened in the past attempt — separate the facts from the interpretation you attached to them",
      "Identify the one specific moment that crystallised the shame — and ask honestly whether that was a verdict or just one event",
      "Take one small action that directly contradicts the shame narrative — something undeniable, even if tiny",
      "Find evidence that runs counter to your current story about yourself in this area — it exists; you've been filtering it out",
      "Find someone who has failed publicly in your domain and kept going — the feeling of being uniquely disqualified is one of shame's primary tools",
    ],
  },
  "Consistency Collapse": {
    icon: "⊿",
    tagline: "You start strong. You can't sustain.",
    description: "Initial energy is real — but something breaks at the 2-week mark. This is about systems, not willpower.",
    color: "#5AACBA",
    bg: "rgba(90,172,186,0.10)",
    why: "Motivation is highest at the start and lowest in the middle — and the system is usually designed for high motivation. When motivation drops to baseline levels, there's nothing structural holding the habit in place. This isn't a character issue; it's an environment design issue.",
    protects: "It keeps the emotional cost of inconsistency low — you never build high enough to have something significant to lose.",
    confuses: "This is almost universally interpreted as lack of discipline or willpower. It's neither. Willpower is a resource that depletes. Systems are structures that work at zero willpower. The question is never 'how do I want this more?' It's 'how do I make returning the path of least resistance?'",
    cheats: [
      "Identify the exact moment you typically stop — and design a specific, pre-decided response for just that one moment",
      "Reduce the minimum viable session to something embarrassingly small: 5 minutes counts; 2 minutes counts; opening the file counts",
      "Set the starting conditions for the next session before you finish the current one (open file, set out materials, write first line)",
      "Attach the habit to something already reliable in your schedule — don't rely on willpower to initiate",
      "Track return rate rather than consistency rate — how quickly you come back after a miss is the real metric",
    ],
  },
  "Misalignment": {
    icon: "⊗",
    tagline: "This may not actually be your dream.",
    description: "Something about this draws you, but you're not sure it's really yours. It might be borrowed desire, or a symbol of something else entirely.",
    color: "#A08B5A",
    bg: "rgba(160,139,90,0.10)",
    why: "The dream has become entangled with something it wasn't meant to carry — a specific identity, a message to someone from the past, an old wound that needs proving. The desire underneath is real. The specific form it's attached to may not be the right container for it.",
    protects: "It protects the real underlying need from being examined directly — which would require owning what you actually want, separate from what you've told yourself and others you want.",
    confuses: "This is usually felt as laziness, ambivalence, or 'not being ready.' The real signal is hollow energy — the work produces obligation and weight rather than pull. Genuine misalignment tends to feel like carrying something for someone else.",
    cheats: [
      "Ask honestly: if no one would ever know you pursued this, would you still want to? The answer is usually immediate and telling",
      "Identify the specific feeling you're actually chasing — then ask whether this dream is the only way to get there",
      "Write about what this dream represents to you beyond the work itself — what would it prove, and to whom",
      "Try one adjacent version of this with lower stakes and compare the internal experience — notice what feels lighter",
      "Give yourself permission to want something different from what you've been declaring — the permission itself is often clarifying",
    ],
  },
};

export const STUCK_PHASE_MAP: Record<string, StuckPhase> = {
  starting: "First-Step Resistance",
  committing: "Preparation",
  consistency: "Momentum",
  finishing: "Pre-Publish Panic",
  publishing: "Pre-Publish Panic",
  promoting: "Pre-Publish Panic",
};

// ── Free-text "Other" keyword helpers ────────────────────────────────────────

export function hasKeyword(text: string | undefined, keywords: string[]): boolean {
  if (!text || !text.trim()) return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function resolveOtherSignal(answers: ResistanceAnswers): ResistanceArchetype | null {
  const {
    emotion, emotion_other,
    first_thought, first_thought_other,
    stuck_point, stuck_point_other,
    protecting, protecting_other,
  } = answers;

  const isOther = (val: string) => val === "other" || val.split(",").includes("other");

  if (isOther(emotion) && emotion_other) {
    if (hasKeyword(emotion_other, ["fear", "anxious", "anxiety", "panic", "terrified", "scared", "afraid"])) return "Fear of Visibility";
    if (hasKeyword(emotion_other, ["shame", "embarrass", "humiliat", "judged", "rejection"])) return "Shame Loop";
    if (hasKeyword(emotion_other, ["overwhelm", "burnout", "too much", "exhaust", "drown"])) return "Overwhelm Fog";
    if (hasKeyword(emotion_other, ["bored", "numb", "hollow", "empty", "detach", "flat"])) return "Misalignment";
  }

  if (isOther(first_thought) && first_thought_other) {
    if (hasKeyword(first_thought_other, ["money", "financial", "afford", "cost", "resource", "fund"])) return "Overwhelm Fog";
    if (hasKeyword(first_thought_other, ["not good enough", "not ready", "not skilled", "not qualified", "impostor"])) return "Perfectionist Freeze";
    if (hasKeyword(first_thought_other, ["judge", "embarrass", "seen", "expos", "public", "ridicule", "laugh"])) return "Fear of Visibility";
    if (hasKeyword(first_thought_other, ["too late", "missed", "behind", "past it", "age"])) return "Shame Loop";
    if (hasKeyword(first_thought_other, ["point", "matter", "who cares", "worth it", "meaningless"])) return "Misalignment";
  }

  if (isOther(stuck_point) && stuck_point_other) {
    if (hasKeyword(stuck_point_other, ["start", "begin", "initiat", "first step"])) return "Overwhelm Fog";
    if (hasKeyword(stuck_point_other, ["finish", "complet", "done", "final", "end"])) return "Perfectionist Freeze";
    if (hasKeyword(stuck_point_other, ["share", "publish", "post", "release", "show", "put out"])) return "Fear of Visibility";
    if (hasKeyword(stuck_point_other, ["consist", "habit", "sustain", "keep going", "stick with", "maintain"])) return "Consistency Collapse";
  }

  if (isOther(protecting) && protecting_other) {
    if (hasKeyword(protecting_other, ["identity", "who i am", "sense of self", "image", "ego"])) return "Identity Conflict";
    if (hasKeyword(protecting_other, ["comfort", "safe", "familiar", "routine", "stability"])) return "Fear of Success";
    if (hasKeyword(protecting_other, ["relationship", "family", "friend", "partner", "marriage"])) return "Fear of Success";
    if (hasKeyword(protecting_other, ["money", "income", "financial", "afford", "job", "career"])) return "Overwhelm Fog";
  }

  return null;
}

export function determineArchetype(answers: ResistanceAnswers): ResistanceArchetype {
  const { emotion, first_thought, stuck_point, protecting, guaranteed_hesitate } = answers;

  if (protecting === "identity") return "Identity Conflict";
  if (emotion === "shame") return "Shame Loop";
  if (emotion === "boredom" || emotion === "numbness") return "Misalignment";
  if ((stuck_point === "publishing" || stuck_point === "promoting") && (emotion === "fear" || first_thought === "judgment")) return "Fear of Visibility";
  if (first_thought === "not_enough" || stuck_point === "finishing") return "Perfectionist Freeze";
  if (first_thought === "judgment") return "Fear of Visibility";
  if (emotion === "overwhelm" || first_thought === "no_start" || stuck_point === "starting") return "Overwhelm Fog";
  if (guaranteed_hesitate === "yes" && protecting === "comfort") return "Fear of Success";
  if (stuck_point === "consistency") return "Consistency Collapse";
  if (first_thought === "too_late") return "Shame Loop";
  if (first_thought === "wont_matter") return "Misalignment";

  // Keyword fallback: only fires when base button logic finds no match
  const otherSignal = resolveOtherSignal(answers);
  if (otherSignal) return otherSignal;

  return "Perfectionist Freeze";
}

export function determineStuckPhase(stuckPoint: StuckPoint | ""): StuckPhase {
  return STUCK_PHASE_MAP[stuckPoint] || "Dormancy";
}

// ── Archetype disagreement helpers ───────────────────────────────────────────

function scoreArchetypeFromAnswers(archetype: ResistanceArchetype, answers: ResistanceAnswers): number {
  const { emotion, first_thought, stuck_point, protecting, guaranteed_hesitate } = answers;
  let score = 0;

  switch (archetype) {
    case "Fear of Visibility":
      if (emotion === "fear") score += 2;
      if (first_thought === "judgment") score += 4;
      if (stuck_point === "publishing" || stuck_point === "promoting") score += 3;
      if (guaranteed_hesitate === "yes") score += 2;
      if (protecting === "control") score += 1;
      break;
    case "Perfectionist Freeze":
      if (first_thought === "not_enough") score += 4;
      if (stuck_point === "finishing") score += 3;
      if (emotion === "fear") score += 1;
      if (protecting === "identity") score += 1;
      break;
    case "Overwhelm Fog":
      if (emotion === "overwhelm") score += 4;
      if (first_thought === "no_start") score += 3;
      if (stuck_point === "starting") score += 3;
      break;
    case "Identity Conflict":
      if (protecting === "identity") score += 5;
      if (first_thought === "not_enough") score += 2;
      if (guaranteed_hesitate === "yes") score += 1;
      break;
    case "Fear of Success":
      if (guaranteed_hesitate === "yes") score += 3;
      if (protecting === "comfort") score += 2;
      if (protecting === "relationships") score += 2;
      if (protecting === "certainty") score += 1;
      break;
    case "Shame Loop":
      if (emotion === "shame") score += 5;
      if (first_thought === "too_late") score += 3;
      if (protecting === "identity") score += 1;
      break;
    case "Consistency Collapse":
      if (stuck_point === "consistency") score += 5;
      if (emotion === "excite_crash") score += 3;
      if (stuck_point === "finishing") score += 1;
      break;
    case "Misalignment":
      if (emotion === "boredom" || emotion === "numbness") score += 4;
      if (first_thought === "wont_matter") score += 4;
      if (protecting === "certainty") score += 1;
      break;
  }

  return score;
}

/** Returns the next most-probable archetypes (excluding the primary) */
export function getAlternativeArchetypes(
  primary: ResistanceArchetype,
  answers: ResistanceAnswers,
  count = 3,
): ResistanceArchetype[] {
  const ALL: ResistanceArchetype[] = [
    "Fear of Visibility", "Perfectionist Freeze", "Overwhelm Fog",
    "Identity Conflict", "Fear of Success", "Shame Loop",
    "Consistency Collapse", "Misalignment",
  ];

  return ALL
    .filter((a) => a !== primary)
    .map((a) => ({ archetype: a, score: scoreArchetypeFromAnswers(a, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.archetype);
}

/** Explains why the system selected this archetype, using answer signals without quoting */
export function getArchetypeReasoning(archetype: ResistanceArchetype, answers: ResistanceAnswers): string {
  const { emotion, first_thought, stuck_point, protecting, guaranteed_hesitate } = answers;

  const signals: string[] = [];

  if (emotion === "fear") signals.push("fear as the dominant emotional response");
  if (emotion === "shame") signals.push("shame surfacing when you engage with this");
  if (emotion === "overwhelm") signals.push("overwhelm when facing the scope");
  if (emotion === "boredom" || emotion === "numbness") signals.push("emotional flatness or disconnection around the work");
  if (emotion === "excite_crash") signals.push("energy that peaks and then collapses");
  if (first_thought === "judgment") signals.push("concern about how others will react");
  if (first_thought === "not_enough") signals.push("a persistent sense of not being ready or qualified");
  if (first_thought === "no_start") signals.push("difficulty knowing where to begin");
  if (first_thought === "too_late") signals.push("a feeling that the window has already passed");
  if (first_thought === "wont_matter") signals.push("doubt about whether this will matter or be received");
  if (stuck_point === "publishing" || stuck_point === "promoting") signals.push("stalling specifically at the moment of exposure");
  if (stuck_point === "finishing") signals.push("difficulty reaching completion");
  if (stuck_point === "consistency") signals.push("a pattern of strong starts that don't sustain");
  if (stuck_point === "starting") signals.push("difficulty initiating at all");
  if (protecting === "identity") signals.push("protecting your current sense of who you are");
  if (protecting === "comfort") signals.push("protecting your current stability and routine");
  if (protecting === "relationships") signals.push("concern about how this affects people close to you");
  if (protecting === "control") signals.push("protecting a sense of control over how you're perceived");
  if (guaranteed_hesitate === "yes") signals.push("hesitation that persists even when success is guaranteed — which means the obstacle isn't the outcome");

  const top = signals.slice(0, 3);
  const list = top.length > 1
    ? top.slice(0, -1).join(", ") + ", and " + top[top.length - 1]
    : top[0] || "the overall pattern of your responses";

  const archetypeContext: Record<ResistanceArchetype, string> = {
    "Fear of Visibility": "These signals cluster around exposure specifically — not failure, not incompetence, but the moment of being seen.",
    "Perfectionist Freeze": "These signals point to an internally-constructed barrier — the work may be ready, but the internal standard for 'ready enough' keeps shifting.",
    "Overwhelm Fog": "These signals suggest the paralysis happens at the entry point — when trying to hold the whole picture — rather than at any specific stage.",
    "Identity Conflict": "These signals are most closely tied to protecting a current self-concept — not protecting against failure, but against the change that moving forward would require.",
    "Fear of Success": "These signals suggest the hesitation persists even when failure is removed from the equation — the obstacle lives in what success would rearrange.",
    "Shame Loop": "These signals suggest a historical reference point is shaping the present — a story from before that is influencing how this attempt feels.",
    "Consistency Collapse": "These signals point to a systems gap rather than a motivation gap — the struggle is with sustaining, not with caring.",
    "Misalignment": "These signals suggest emotional flatness or disconnection that isn't explained by the other patterns — pointing to a possible mismatch between the form of the dream and what's actually being sought.",
  };

  return `This pattern emerged from: ${list}. ${archetypeContext[archetype]}`;
}
