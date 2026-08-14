import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"

export const swordSpecial2nd = defineSkill({
  id: SKILL.swordSpecial2nd,
  classId: CLASS_ID,
  name: "SwordSpecial[2nd]",
  tags: [WEAPON.sword, ATTUNE.swordSpecial],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [hit(0, { frame: 0, physMultiplier: 1.767, attributeMultiplier: 2.6505, physFixed: 356, attributeFixed: 202 })],
  castFrames: 24,
  castTag: CAST.swordSpecial2nd,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
