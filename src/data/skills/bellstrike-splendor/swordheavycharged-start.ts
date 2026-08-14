
import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"

export const swordHeavyChargedStart = defineSkill({
  id: SKILL.swordHeavyChargedStart,
  classId: CLASS_ID,
  name: "SwordHeavyCharged[Start]",
  breakdownName: "SwordHeavyCharged",
  tags: [WEAPON.sword, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  castFrames: 51,
  castTag: CAST.swordHeavyCharged,
  triggerable: true,
  hits: [
    hit(0, {
      frame: 0,
      physMultiplier: 1.3066,
      attributeMultiplier: 1.9598,
      physFixed: 361,
      attributeFixed: 197,
    }),
    hit(1, {
      frame: 28,
      physMultiplier: 1.5679,
      attributeMultiplier: 2.3518,
      physFixed: 433,
      attributeFixed: 236,
    }),
    hit(2, {
      frame: 51,
      physMultiplier: 1.8292,
      attributeMultiplier: 2.7438,
      physFixed: 506,
      attributeFixed: 276,
    }),
  ],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
