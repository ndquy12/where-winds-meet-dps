import { defineClassBuff } from "../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../skills/buffs/ids"

import { stat } from "../../../engine/effects/effect"


export const swordMorphChargedBonus = defineClassBuff({
  id: BUFF.swordMorphChargedBonus,
  name: "Sword Morph T6",
  requires: { param: PARAM.swordMorph, minTier: 6 },
  alwaysActive: true,
  duration: 9999,
  summary: "All DMG +30%",
  effects: (ctx) => {
    return ctx.self.reachesEvent ? [stat("allDamageBoost", 0.3)] : []
  },
})
