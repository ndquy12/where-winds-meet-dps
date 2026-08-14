import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { CAST } from "../../ids"
import { stat } from "../../../../engine/effects/effect"

export const qiImbalance = defineClassBuff({
  id: BUFF.qiImbalance,
  name: "Qi Imbalance",
  triggeredBy: [CAST.spearQ, CAST.swordQ],
  duration: 15,
  buffAppliesOnCastEnd: true,
  summary: "allDamageBoost +8%, attributeDamageBoost +8% during the qi break window",
  effects: (ctx) => {
    return ctx.self.reachesEvent ? [stat("allDamageBoost", 0.08), stat("attributeDamageBoost", 0.08)] : []
  },
})
