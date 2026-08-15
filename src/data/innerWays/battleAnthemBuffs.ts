import { defineClassBuff } from "../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../skills/buffs/ids"
import { stat } from "../../engine/effects/effect"

// Endurance consumed is not tracked by the engine, so the tier 6 0-10%
// scaling is approximated at its maximum.
export const battleAnthemChargedBonus = defineClassBuff({
  id: BUFF.battleAnthemChargedBonus,
  name: "Battle Anthem",
  requires: { param: PARAM.battleAnthem },
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +15% (+10% at tier 6, based on current endurance consumed, max 10%)",
  effects: (ctx) => {
    if (!ctx.self.reachesEvent) return []
    const bonus = ctx.build.paramTier(PARAM.battleAnthem) >= 6 ? 0.25 : 0.15
    return [stat("allDamageBoost", bonus)]
  },
})
