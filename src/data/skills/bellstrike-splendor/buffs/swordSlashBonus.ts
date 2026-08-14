import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { CAST } from "../../ids"
import { stat } from "../../../../engine/effects/effect"

export const swordSlashBonus = defineClassBuff({
  id: BUFF.swordSlashBonus,
  name: "Sword Slash Bonus",
  triggeredBy: [
    CAST.swordHeavyCharged,
    CAST.swordHeavyCharged2Hit,
    CAST.swordHeavyChargedStart,
    CAST.energySurge,
    CAST.swordSpecial,
    CAST.swordSpecial2nd,
    CAST.swordSpecialDeflect,
  ],
  duration: 8,
  maxStacks: 3,
  stacksPerHit: true,
  summary: "+10.0% all/stack, max +30.0% all",
  effects: (ctx) => (ctx.self.stacks > 0 ? [stat("allDamageBoost", 0.1 * ctx.self.stacks)] : []),
})
