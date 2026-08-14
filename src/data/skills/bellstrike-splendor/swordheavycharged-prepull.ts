import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE, ATTACK, PROP } from "../ids"

export const swordHeavyChargedPrepull = defineSkill({
  id: SKILL.swordHeavyChargedPrepull,
  classId: CLASS_ID,
  name: "SwordHeavyCharged[Prepull]",
  tags: [PROP.isCharged, WEAPON.sword, ATTACK.heavy, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [
    hit(0, {
      frame: 0,
      physMultiplier: 0,
      attributeMultiplier: 0,
      physFixed: 0,
      attributeFixed: 0,
    }),
  ],
  castFrames: 89,
  castTag: CAST.swordHeavyChargedPrepull,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
