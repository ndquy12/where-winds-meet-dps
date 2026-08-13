import { defineClass } from "../../../definitions/classes/classDef"
import { CLASS_ID, SKILLS } from "../../skills/bellstrike-splendor"
import { withUniversalSkills } from "../../../definitions/skills/universalSkills"
import { DEBUFFS } from "../../skills/bellstrike-splendor/debuffs"
import { qiImbalance } from "../../skills/bellstrike-splendor/buffs/qiImbalance"
import { swordQiAffinityEnhancement } from "../../skills/bellstrike-splendor/buffs/swordQiAffinityEnhancement"
import { affinityDamageUpSpear } from "../../skills/bellstrike-splendor/buffs/affinityDamageUpSpear"
import { rotationPoolFor } from "../../../definitions/rotations/registry"
import { BELLSTRIKE_SPLENDOR_POOL } from "./retunementPool"

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
  dingYinTags: ["Sword Charge Boost"],
  weapons: ["Sword", "Spear"],
  critBoostWeaponTypes: [],
  skills: withUniversalSkills(CLASS_ID, "Bellstrike", SKILLS),
  debuffs: DEBUFFS,
  ...rotationPoolFor(CLASS_ID),
  retunementPool: BELLSTRIKE_SPLENDOR_POOL,
  classBuffDefs: [qiImbalance, swordQiAffinityEnhancement, affinityDamageUpSpear],
  gateBuffs: [],
  mechanics: [],
  skillBehaviors: [],
  displayGates: [],
  poisonExtensions: [],
})
