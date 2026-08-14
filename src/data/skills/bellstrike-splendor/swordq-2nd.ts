import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"

export const swordQ2nd = defineSkill({
  id: SKILL.swordQ2nd,
  classId: CLASS_ID,
  name: "SwordQ[2nd]",
  tags: [WEAPON.sword, ATTUNE.swordQ],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [hit(0, { frame: 0, physMultiplier: 1.025, attributeMultiplier: 1.5375, physFixed: 179, attributeFixed: 103 })],
  castFrames: 26,
  castTag: CAST.swordQ2nd,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
