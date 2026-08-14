import { defineClass } from "../../../definitions/classes/classDef"
import { CLASS_ID, SKILLS } from "../../skills/bellstrike-splendor"
import { withUniversalSkills } from "../../../definitions/skills/universalSkills"
import { DEBUFFS } from "../../skills/bellstrike-splendor/debuffs"
import { qiImbalance } from "../../skills/bellstrike-splendor/buffs/qiImbalance"
import { swordQiAffinityEnhancement } from "../../skills/bellstrike-splendor/buffs/swordQiAffinityEnhancement"
import { affinityDamageUpSpear } from "../../skills/bellstrike-splendor/buffs/affinityDamageUpSpear"
import { swordSlashBonus } from "../../skills/bellstrike-splendor/buffs/swordSlashBonus"
import { qiStruggleEnhancement } from "../../skills/bellstrike-splendor/buffs/qiStruggleEnhancement"
import { rotationPoolFor } from "../../../definitions/rotations/registry"
import { BELLSTRIKE_SPLENDOR_POOL } from "./retunementPool"
import { BELLSTRIKE_SPLENDOR_GRADUATION_BUILD } from "./graduationBuild"

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
  weapons: ["Sword", "Spear"],
  critBoostWeaponTypes: [],
  skills: withUniversalSkills(CLASS_ID, "Bellstrike", SKILLS),
  debuffs: DEBUFFS,
  ...rotationPoolFor(CLASS_ID),
  retunementPool: BELLSTRIKE_SPLENDOR_POOL,
  classBuffDefs: [
    qiImbalance,
    swordQiAffinityEnhancement,
    affinityDamageUpSpear,
    swordSlashBonus,
    qiStruggleEnhancement,
  ],
  gateBuffs: [],
  mechanics: [],
  skillBehaviors: [],
  displayGates: [],
  poisonExtensions: [],
  graduationBuild: BELLSTRIKE_SPLENDOR_GRADUATION_BUILD
})
