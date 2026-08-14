import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"
import { BUFF } from "../buffs/ids"
export const spearQ = defineSkill({
  id: SKILL.spearQ,
  classId: CLASS_ID,
  name: "SpearQ",
  tags: [WEAPON.spear, ATTUNE.spearQ],
  skillType: "weapon",
  weaponOrAttribute: "Spear",
  attributeAttack: "Bellstrike",
  hits: [hit(0, { frame: 0, physMultiplier: 0.5727, attributeMultiplier: 0.859, physFixed: 133, attributeFixed: 74 })],
  castFrames: 42,
  castTag: CAST.spearQ,
  triggersBuffs: [BUFF.qiImbalance, BUFF.mountainsMight, BUFF.jadeware],
  receives: [BUFF.affinityDamageUpSpear],
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
