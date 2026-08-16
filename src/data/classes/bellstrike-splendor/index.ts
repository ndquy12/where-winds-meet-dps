import { defineClass } from "../../../definitions/classes/classDef"
import { CLASS_ID, SKILLS } from "../../skills/bellstrike-splendor"
import { withUniversalSkills } from "../../../definitions/skills/universalSkills"
import { DEBUFFS } from "../../skills/bellstrike-splendor/debuffs"
import { qiImbalance } from "../../skills/bellstrike-splendor/buffs/qiImbalance"
import { swordQiAffinityEnhancement } from "../../skills/bellstrike-splendor/buffs/swordQiAffinityEnhancement"
import { affinityDamageUpNameless } from "../../skills/bellstrike-splendor/buffs/affinityDamageUpNameless"
import { swordSlashDamageBoost } from "../../skills/bellstrike-splendor/buffs/swordSlashDamageBoost"
import { qiStruggleEnhancement } from "../../skills/bellstrike-splendor/buffs/qiStruggleEnhancement"
import { rotationPoolFor } from "../../../definitions/rotations/registry"
import { BELLSTRIKE_SPLENDOR_POOL } from "./retunementPool"
import { BELLSTRIKE_SPLENDOR_GRADUATION_BUILD } from "./graduationBuild"
import { swordHeavyChargedBehavior } from "./behaviors"
import { SKILL } from "../../skills/bellstrike-splendor/ids"

export const bellstrikeSplendor = defineClass({
  id: CLASS_ID,
  displayName: "Bellstrike Splendor",
  validated: false,
  spec: "bellstrike_splendor",
  primaryAttribute: "Bellstrike",
  attributeMultiplier: 51.5,
  classMindGroup: "swordMorph",
  allowedMindMethods: [
    "mountainsMight",
    "battleAnthem",
    "insightfulStrike",
    "moraleChant",
    "bitterSeason",
  ],
  classSpecificAttunements: ["swordCharged"],
  weapons: ["namelessSword", "namelessSpear"],
  critBoostWeaponTypes: [],
  skills: withUniversalSkills(CLASS_ID, "Bellstrike", SKILLS),
  debuffs: DEBUFFS,
  ...rotationPoolFor(CLASS_ID),
  retunementPool: BELLSTRIKE_SPLENDOR_POOL,
  classBuffDefs: [
    qiImbalance,
    swordQiAffinityEnhancement,
    affinityDamageUpNameless,
    swordSlashDamageBoost,
    qiStruggleEnhancement,
  ],
  gateBuffs: [],
  mechanics: [],
  skillBehaviors: [
    { skillId: SKILL.swordHeavyCharged, factory: swordHeavyChargedBehavior },
    { skillId: SKILL.swordHeavyChargedStart, factory: swordHeavyChargedBehavior },
    { skillId: SKILL.swordHeavyCharged2Hit, factory: swordHeavyChargedBehavior },
  ],
  displayGates: [],
  poisonExtensions: [],
  graduationBuild: BELLSTRIKE_SPLENDOR_GRADUATION_BUILD
})
