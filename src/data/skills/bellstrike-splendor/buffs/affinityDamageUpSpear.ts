import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { stat } from "../../../../engine/effects/effect"


// Endurance is not tracked by the engine, so only the Long-Wind-active half
// of the source condition ("during Long Wind, or below 60% Endurance") is
// modeled.
export const affinityDamageUpSpear = defineClassBuff({
  id: BUFF.affinityDamageUpSpear,
  name: "Affinity DMG UP",
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "affinityDamageBoost +18% while Long Wind is active",
  effects: (ctx) => {
    return ctx.self.reachesEvent ? [stat("affinityDamageBoost", 0.18)] : []
  },
})
