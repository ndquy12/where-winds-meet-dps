import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"

import { stat } from "../../../../engine/effects/effect"

export const qiImbalance = defineClassBuff({
  id: BUFF.qiImbalance,
  name: "Qi Imbalance",
  affectsAll: true,
  duration: 15,
  buffAppliesOnCastEnd: true,
  summary: "During Boss exhausted, All DMG +8%, Attribute DMG +8%",
  effects: (ctx) => {
    return ctx.self.reachesEvent && ctx.phase === "exhausted" ? [stat("allDamageBoost", 0.08), stat("attributeDamageBoost", 0.08)] : []
  },
})
