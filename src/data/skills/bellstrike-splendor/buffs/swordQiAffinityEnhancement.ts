import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { stat } from "../../../../engine/effects/effect"

export const swordQiAffinityEnhancement = defineClassBuff({
  id: BUFF.swordQiAffinityEnhancement,
  name: "Sword Qi Affinity Enhancement",
  alwaysActive: true,
  duration: 9999,
  summary: "affinityDamageBoost up to +18% (at 1500 Max Phys) against targets with Qi <40% or in Qi Imbalance",
  effects: (ctx) => {
    return ctx.self.reachesEvent && ctx.phase !== "normal" ? [stat("affinityDamageBoost", 0.18)] : []
  },
})
