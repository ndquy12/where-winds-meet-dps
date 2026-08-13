import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF } from "../../buffs/ids"
import { stat } from "../../../../engine/effects/effect"
import { matchesScope } from "../../../../engine/scope"

const SCOPE = { affectsWeaponTypes: ["Spear"] }

// Endurance is not tracked by the engine, so only the Long-Wind-active half
// of the source condition ("during Long Wind, or below 60% Endurance") is
// modeled.
export const affinityDamageUpSpear = defineClassBuff({
  id: BUFF.affinityDamageUpSpear,
  name: "Affinity DMG UP (Spear)",
  affectsWeaponTypes: SCOPE.affectsWeaponTypes,
  triggeredBy: [],
  alwaysActive: true,
  duration: 9999,
  summary: "affinityDamageBoost +18% while Long Wind is active",
  effects: (ctx) => {
    if (ctx.event.kind !== "damage" || !matchesScope(ctx.event.tags, SCOPE)) return []
    if (!ctx.status.isActive(BUFF.mountainsMight)) return []
    return [stat("affinityDamageBoost", 0.18)]
  },
})
