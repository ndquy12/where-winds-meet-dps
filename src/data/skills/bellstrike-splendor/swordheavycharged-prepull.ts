import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE, PROP } from "../ids"

export const swordHeavyChargedPrepull = defineSkill({
  id: SKILL.swordHeavyChargedPrepull,
  classId: CLASS_ID,
  name: "SwordHeavyCharged[Prepull]",
  tags: [PROP.isCharged, WEAPON.sword, "attack:heavy", ATTUNE.swordHeavyCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [
    hit(0, { frame: 0, physMultiplier: 1.5674000000000001, attributeMultiplier: 2.3510666666666666, physFixed: 314.6666666666667, attributeFixed: 179 }),
    hit(1, { frame: 17, physMultiplier: 1.5674000000000001, attributeMultiplier: 2.3510666666666666, physFixed: 314.6666666666667, attributeFixed: 179 }),
    hit(2, { frame: 34, physMultiplier: 1.5674000000000001, attributeMultiplier: 2.3510666666666666, physFixed: 314.6666666666667, attributeFixed: 179 }),
  ],
  castFrames: 51,
  castTag: CAST.swordHeavyChargedPrepull,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
