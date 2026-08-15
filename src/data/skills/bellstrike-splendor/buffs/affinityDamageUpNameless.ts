import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { stat } from "../../../../engine/effects/effect"


// Endurance is not tracked by the engine, so only the Long-Wind-active half
// of the source condition ("during Long Wind, or below 60% Endurance") is
// modeled.
export const affinityDamageUpNameless = defineClassBuff({
  id: BUFF.affinityDamageUpNameless,
  name: "Affinity DMG UP",
  alwaysActive: true,
  duration: 9999,
  summary: "Affinity DMG +18% while Long Wind is active or below 60% Endurance",
  effects: (ctx) => {
    return ctx.self.reachesEvent && ctx.status.isActive(BUFF.mountainsMight)
      ? [stat("affinityDamageBoost", 0.18)]
      // Below 60% Endurance is not tracked by the engine
      // So the buff is modeled as only half effective when Long Wind is not active
      : [stat("affinityDamageBoost", 0.18 * 0.5)]
  },
})
