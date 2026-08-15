import { DEFAULT_BEHAVIOR, type SkillBehaviorFactory } from "../../../engine/behavior"
import type { HitEffect } from "../../../engine/effects/effect"
import { forceOutcome } from "../../../engine/effects/effect"

export const swordHeavyChargedBehavior: SkillBehaviorFactory = () => {
  return {
    ...DEFAULT_BEHAVIOR,
    claimStatEffects(input, phase) {
      const effects = DEFAULT_BEHAVIOR.claimStatEffects(input, phase)
      if (phase === "exhausted") {
        if (input.hit.id === "hit-0" || input.hit.id === "hit-1") {
          effects.push(forceOutcome("precision") as HitEffect)
        } else if (input.hit.id === "hit-2") {
          effects.push(forceOutcome("affinity") as HitEffect)
        }
      }
      return effects
    }
  }
}
