import { defineSkill, hit } from "../../../definitions/skills/skillDef"
import { CLASS_ID, SKILL } from "./ids"
import { CAST, WEAPON, ATTUNE } from "../ids"
import { BUFF } from "../buffs/ids"
export const swordHeavyChargedPrepull = defineSkill({
  id: SKILL.swordHeavyChargedPrepull,
  classId: CLASS_ID,
  name: "SwordHeavyCharged[Prepull]",
  breakdownName: "SwordHeavyCharged",
  tags: [WEAPON.sword, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  castTag: CAST.swordHeavyChargedPrepull,
  castFrames: 89,
  receives: [BUFF.battleAnthemChargedBonus, BUFF.swordMorphChargedBonus, BUFF.qiStruggleEnhancement, BUFF.swordQiAffinityEnhancement, BUFF.affinityDamageUpNameless, BUFF.swordSlashBonus],
  triggerable: true,
  hits: [
    hit(0, {
      frame: 0,
      physMultiplier: 0,
      attributeMultiplier: 0,
      physFixed: 0,
      attributeFixed: 0,
    }),
  ],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
})
