import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE, PROP } from "../ids"

export const energySurge = defineSkill({
  id: SKILL.energySurge,
  classId: CLASS_ID,
  name: "EnergySurge",
  tags: [PROP.isCharged, WEAPON.sword, "attack:heavy", ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [
    hit(0, { frame: 0, physMultiplier: 1.5676333333333332, attributeMultiplier: 2.2483, physFixed: 362, attributeFixed: 202 }),
    hit(1, { frame: 17, physMultiplier: 1.5676333333333332, attributeMultiplier: 2.2483, physFixed: 362, attributeFixed: 202 }),
    hit(2, { frame: 34, physMultiplier: 1.5676333333333332, attributeMultiplier: 2.2483, physFixed: 362, attributeFixed: 202 }),
  ],
  castFrames: 51,
  castTag: CAST.energySurge,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
