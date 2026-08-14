import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"
import { BUFF } from "../buffs/ids"
export const spearQ0HitCancel = defineSkill({
  id: SKILL.spearQ0HitCancel,
  classId: CLASS_ID,
  name: "SpearQ[0-Hit-Cancel]",
  tags: [WEAPON.spear, ATTUNE.spearQ],
  skillType: "weapon",
  weaponOrAttribute: "Spear",
  attributeAttack: "Bellstrike",
  hits: [hit(0, { frame: 0, physMultiplier: 0, attributeMultiplier: 0, physFixed: 0, attributeFixed: 0 })],
  castFrames: 6,
  castTag: CAST.spearQ0HitCancel,
  triggersBuffs: [BUFF.mountainsMight, BUFF.jadeware],
  receives: [BUFF.affinityDamageUpSpear],
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
