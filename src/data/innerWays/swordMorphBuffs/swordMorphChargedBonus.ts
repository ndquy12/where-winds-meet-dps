import { defineClassBuff } from "../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../skills/buffs/ids"
import { PROP } from "../../skills/ids"
import { stat } from "../../../engine/effects/effect"


export const swordMorphChargedBonus = defineClassBuff({
  id: BUFF.swordMorphChargedBonus,
  name: "Sword Morph T6",
  requires: { param: PARAM.swordMorph, minTier: 6 },
  affects: [PROP.isCharged],
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +30%",
  effects: (ctx) => {
    if (ctx.event.kind !== "damage") return []
    return [stat("allDamageBoost", 0.3)]
  },
})
