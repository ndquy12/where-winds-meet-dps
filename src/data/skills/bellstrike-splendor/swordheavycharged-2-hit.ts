import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"

export const swordHeavyCharged2Hit = defineSkill({
  id: SKILL.swordHeavyCharged2Hit,
  classId: CLASS_ID,
  name: "SwordHeavyCharged[2-Hit]",
  breakdownName: "SwordHeavyCharged",
  tags: [WEAPON.sword, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  castFrames: 117,
  castTag: CAST.swordHeavyCharged2Hit,
  triggerable: true,
  hits: [
    hit(0, {
      frame: 89,
      physMultiplier: 1.3066,
      attributeMultiplier: 1.9598,
      physFixed: 361,
      attributeFixed: 197,
    }),
    hit(1, {
      frame: 117,
      physMultiplier: 1.5679,
      attributeMultiplier: 2.3518,
      physFixed: 433,
      attributeFixed: 236,
    }),
  ],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
