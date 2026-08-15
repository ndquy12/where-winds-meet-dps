import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"

import { stat } from "../../../../engine/effects/effect"

export const qiImbalance = defineClassBuff({
  id: BUFF.qiImbalance,
  name: "Qi Imbalance",
  affectsAll: true,
  duration: 15,
  buffAppliesOnCastEnd: true,
  summary: "allDamageBoost +8%, attributeDamageBoost +8% during the qi break window",
  effects: (ctx) => {
    return ctx.self.reachesEvent && ctx.phase === "exhausted" ? [stat("allDamageBoost", 0.08), stat("attributeDamageBoost", 0.08)] : []
  },
})
