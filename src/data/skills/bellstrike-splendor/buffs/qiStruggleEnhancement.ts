import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { stat } from "../../../../engine/effects/effect"


export const qiStruggleEnhancement = defineClassBuff({
  id: BUFF.qiStruggleEnhancement,
  name: "Qi Struggle Enhancement",
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +20% (Sword Special/Sword Charge)",
  effects: (ctx) => {
    return ctx.self.reachesEvent ? [stat("allDamageBoost", 0.2)] : []
  },
})
