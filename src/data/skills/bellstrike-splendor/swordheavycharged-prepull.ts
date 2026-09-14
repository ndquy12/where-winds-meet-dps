import { defineSkill } from "../../../definitions/skills/skillDef"
import { BUFF } from "../buffs/ids"
import { ATTACK, ATTUNE, CAST, PROP, WEAPON } from "../ids"
import { SKILL } from "./ids"
import { NAMELESS_SWORD_RECEIVES } from "./receives"

// This use for charged time prepull. No hits
export const swordHeavyChargedPrepull = defineSkill({
  id: SKILL.swordHeavyChargedPrepull,
  classId: "bellstrikeSplendor",
  name: "SwordHeavyCharged[Prepull]",
  breakdownName: "Vagrant Sword",
  tags: [PROP.isCharged, WEAPON.sword, ATTACK.heavy, ATTUNE.swordCharged],
  skillType: "weapon",
  weaponOrAttribute: "Sword",
  attributeAttack: "Bellstrike",
  castTag: CAST.swordHeavyChargedPrepull,
  triggersBuffs: [BUFF.swordSlashDamageBoost],
  receives: [
    BUFF.mistwillowLightBuff,
    BUFF.mistwillowBuff,
    BUFF.swordSlashDamageBoost,
    BUFF.swordEnergyEnhancement,
    BUFF.swordEnergyHpDamage,
    BUFF.swordMorphEnduranceBoost,
    BUFF.battleAnthemChargedDamage,
    BUFF.battleAnthemEnduranceBoost,
    ...NAMELESS_SWORD_RECEIVES,
  ],
  castFrames: 51,
  triggerable: true,
  hits: [],
  createdAt: "2026-08-15T00:00:00.000Z",
  updatedAt: "2026-08-15T00:00:00.000Z",
})
