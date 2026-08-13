import { defineClassBuff } from "../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../skills/buffs/ids"
import { PROP } from "../../skills/ids"
import { stat } from "../../../engine/effects/effect"
import { matchesScope } from "../../../engine/scope"
import { propKeyOf } from "../../../engine/buffs/tags"

const SCOPE = { affectsProperty: propKeyOf(PROP.isCharged) }

export const battleAnthemChargedBonus = defineClassBuff({
  id: BUFF.battleAnthemChargedBonus,
  name: "Battle Anthem",
  requires: { param: PARAM.battleAnthem },
  affectsProperty: SCOPE.affectsProperty,
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "allDamageBoost +15%, current endurance (max 10%)",
  effects: (ctx) => {
    if (ctx.event.kind !== "damage" || !matchesScope(ctx.event.tags, SCOPE)) return []
    return [stat("allDamageBoost", 0.25)]
  },
})
