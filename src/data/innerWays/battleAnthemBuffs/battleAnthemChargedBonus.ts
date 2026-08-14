import { defineClassBuff } from "../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../skills/buffs/ids"
import { stat } from "../../../engine/effects/effect"

export const battleAnthemChargedBonus = defineClassBuff({
  id: BUFF.battleAnthemChargedBonus,
  name: "Battle Anthem",
  requires: { param: PARAM.battleAnthem },
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +15%, current endurance (max 10%)",
  effects: (ctx) => {
    return ctx.self.reachesEvent ? [stat("allDamageBoost", 0.25)] : []
  },
})
