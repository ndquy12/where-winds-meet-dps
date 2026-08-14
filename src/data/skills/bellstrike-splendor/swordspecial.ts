import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"
import { BUFF } from "../buffs/ids"
export const swordSpecial = defineSkill({
  id: SKILL.swordSpecial,
  classId: CLASS_ID,
  name: "SwordSpecial",
  tags: [WEAPON.sword, ATTUNE.swordSpecial],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [hit(0, { frame: 0, physMultiplier: 1.767, attributeMultiplier: 2.6505, physFixed: 409, attributeFixed: 228 })],
  castFrames: 24,
  castTag: CAST.swordSpecial,
  triggersBuffs: [BUFF.swordSlashBonus],
  receives: [BUFF.qiStruggleEnhancement, BUFF.affinityDamageUpNameless, BUFF.swordSlashBonus],
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
