import type { DreamClassification, DreamIntake, ResistanceAnswers, RealityAnswers } from "../types";
import { determineArchetype } from "./archetypes";

export const CLASSIFICATION_INFO: Record<DreamClassification, {
  subtitle: string;
  action: "pursue" | "defer" | "reshape" | "release";
  color: string;
  bg: string;
  icon: string;
  description: string;
}> = {
  "Viable & Aligned": {
    subtitle: "The path is clear. The block is internal.",
    action: "pursue",
    color: "#4A8C6E",
    bg: "rgba(74,140,110,0.10)",
    icon: "◆",
    description: "Your dream is real, it matters deeply, and the primary obstacle is psychological — not circumstantial. The work now is to move despite resistance, not to wait until it disappears.",
  },
  "Viable but Misaligned": {
    subtitle: "Right dream, wrong season.",
    action: "defer",
    color: "#7B8F6E",
    bg: "rgba(123,143,110,0.10)",
    icon: "◇",
    description: "This is real and achievable — but your current life doesn't have the structural conditions to support it. Deferring consciously is a form of respect for both the dream and your reality.",
  },
  "Symbolic / Transformable": {
    subtitle: "The dream points to something real. The form needs reshaping.",
    action: "reshape",
    color: "#7B6E8F",
    bg: "rgba(123,110,143,0.10)",
    icon: "○",
    description: "What you're chasing isn't the thing itself — it's what it represents: meaning, expression, identity, freedom. Those things are achievable. The specific version you're imagining may not be.",
  },
  "Unrealistic in Current Form": {
    subtitle: "Honesty is freedom. Releasing isn't failure.",
    action: "release",
    color: "#8F6E6E",
    bg: "rgba(143,110,110,0.10)",
    icon: "×",
    description: "The version of this dream you're holding cannot be reconciled with your actual life. Naming that clearly is not defeat — it's the beginning of redirecting your energy somewhere it can go.",
  },
};

export function classifyDream(
  intake: DreamIntake,
  resistance: ResistanceAnswers,
  reality: RealityAnswers
): DreamClassification {
  const archetype = determineArchetype(resistance);

  if (reality.physical_constraint === "impossible") return "Unrealistic in Current Form";
  if (reality.physical_constraint === "significant" && reality.time_realistic === "none" && reality.willing_to_commit === false) return "Unrealistic in Current Form";
  if (reality.time_realistic === "none" && reality.willing_to_commit === false) return "Unrealistic in Current Form";

  if (archetype === "Misalignment") return "Symbolic / Transformable";
  if (reality.without_reward === false) return "Symbolic / Transformable";
  if (intake.importance <= 4 && intake.pain <= 4) return "Symbolic / Transformable";

  if (reality.time_realistic === "none" && reality.willing_to_commit === true) return "Viable but Misaligned";
  if (reality.time_realistic === "little" && intake.importance < 7) return "Viable but Misaligned";
  if (reality.responsibility_conflict === true && intake.importance < 7) return "Viable but Misaligned";

  return "Viable & Aligned";
}
