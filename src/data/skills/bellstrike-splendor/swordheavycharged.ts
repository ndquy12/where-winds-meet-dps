import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"
import { BUFF } from "../buffs/ids"
export const swordHeavyCharged = defineSkill({
  id: SKILL.swordHeavyCharged,
  classId: CLASS_ID,
  name: "SwordHeavyCharged",
  breakdownName: "SwordHeavyCharged",
  tags: [WEAPON.sword, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  castTag: CAST.swordHeavyCharged,
  castFrames: 140,
  triggersBuffs: [BUFF.swordSlashBonus],
  receives: [BUFF.battleAnthemChargedBonus, BUFF.swordMorphChargedBonus, BUFF.qiStruggleEnhancement, BUFF.swordQiAffinityEnhancement, BUFF.affinityDamageUpNameless, BUFF.swordSlashBonus],
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
    hit(2, {
      frame: 140,
      physMultiplier: 1.8292,
      attributeMultiplier: 2.7438,
      physFixed: 506,
      attributeFixed: 276,
    }),
  ],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
