import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE, ATTACK, PROP } from "../ids"

export const swordHeavyCharged2Hit = defineSkill({
  id: SKILL.swordHeavyCharged2Hit,
  classId: CLASS_ID,
  name: "SwordHeavyCharged[2-Hit]",
  tags: [PROP.isCharged, WEAPON.sword, ATTACK.heavy, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  hits: [
    hit(0, {
      frame: 0,
      physMultiplier: 1.3066,
      attributeMultiplier: 1.9598,
      physFixed: 361,
      attributeFixed: 197,
    }),
    hit(1, {
      frame: 17,
      physMultiplier: 1.5679,
      attributeMultiplier: 2.3518,
      physFixed: 433,
      attributeFixed: 236,
    }),
  ],
  castFrames: 117,
  castTag: CAST.swordHeavyCharged2Hit,
  triggerable: true,
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
