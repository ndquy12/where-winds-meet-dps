import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { ATTUNE, PROP } from "../../ids"
import { stat } from "../../../../engine/effects/effect"
import { matchesScope } from "../../../../engine/scope"

const SCOPE = { affects: [PROP.isCharged, ATTUNE.swordSpecial] }

export const qiStruggleEnhancement = defineClassBuff({
  id: BUFF.qiStruggleEnhancement,
  name: "Qi Struggle Enhancement",
  affects: SCOPE.affects,
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +20% (Sword Special/Sword Charge)",
  effects: (ctx) => {
    if (ctx.event.kind !== "damage" || !matchesScope(ctx.event.tags, SCOPE)) return []
    return [stat("allDamageBoost", 0.2)]
  },
})
