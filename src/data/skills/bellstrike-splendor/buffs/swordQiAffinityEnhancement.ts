import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { PROP } from "../../ids"
import { stat } from "../../../../engine/effects/effect"
import { matchesScope } from "../../../../engine/scope"
import { propKeyOf } from "../../../../engine/buffs/tags"

const SCOPE = { affectsProperty: propKeyOf(PROP.isCharged) }

export const swordQiAffinityEnhancement = defineClassBuff({
  id: BUFF.swordQiAffinityEnhancement,
  name: "Sword Qi Affinity Enhancement",
  affectsProperty: SCOPE.affectsProperty,
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "affinityDamageBoost up to +18% (at 1500 Max Phys) against targets with Qi <40% or in Qi Imbalance",
  effects: (ctx) => {
    if (ctx.event.kind !== "damage" || !matchesScope(ctx.event.tags, SCOPE)) return []
    if (!ctx.status.isActive(BUFF.qiImbalance)) return []
    return [stat("affinityDamageBoost", 0.18)]
  },
})
