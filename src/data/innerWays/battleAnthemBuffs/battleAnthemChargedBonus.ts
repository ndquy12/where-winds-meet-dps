import { defineClassBuff } from "../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../skills/buffs/ids"
import { PROP } from "../../skills/ids"
import { stat } from "../../../engine/effects/effect"

export const battleAnthemChargedBonus = defineClassBuff({
  id: BUFF.battleAnthemChargedBonus,
  name: "Battle Anthem",
  affects: [PROP.isCharged],
  requires: { param: PARAM.battleAnthem },
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +15%, current endurance (max 10%)",
  effects: (ctx) => {
    if (ctx.event.kind !== "damage") return []
    return [stat("allDamageBoost", 0.25)]
  },
})
