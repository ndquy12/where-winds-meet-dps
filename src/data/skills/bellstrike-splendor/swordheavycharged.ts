import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE, PROP } from "../ids"

export const swordHeavyCharged = defineSkill({
  id: SKILL.swordHeavyCharged,
  classId: CLASS_ID,
  name: "SwordHeavyCharged",
  tags: [PROP.isCharged, WEAPON.sword, "attack:heavy", ATTUNE.swordHeavyCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [
    hit(0, { frame: 0, physMultiplier: 1.5676333333333332, attributeMultiplier: 2.2483, physFixed: 362, attributeFixed: 202 }),
    hit(1, { frame: 46, physMultiplier: 1.5676333333333332, attributeMultiplier: 2.2483, physFixed: 362, attributeFixed: 202 }),
    hit(2, { frame: 92, physMultiplier: 1.5676333333333332, attributeMultiplier: 2.2483, physFixed: 362, attributeFixed: 202 }),
  ],
  castFrames: 140,
  castTag: CAST.swordHeavyCharged,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
