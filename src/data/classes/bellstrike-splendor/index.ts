import { defineClass } from "../../../definitions/classes/classDef"
import { CLASS_ID, SKILLS } from "../../skills/bellstrike-splendor"
import { withUniversalSkills } from "../../../definitions/skills/universalSkills"
import { DEBUFFS } from "../../skills/bellstrike-splendor/debuffs"
import { mountainsMightBuffDef } from "../../skills/bellstrike-splendor/buffs/mountainsMight"
import { rotationPoolFor } from "../../../definitions/rotations/registry"
import { BELLSTRIKE_SPLENDOR_POOL } from "./retunementPool"

export const bellstrikeSplendor = defineClass({
  id: CLASS_ID,
  displayName: "Bellstrike Splendor",
  validated: false,
  spec: "bellstrike_splendor",
  primaryAttribute: "Bellstrike",
  attributeMultiplier: 51.5,
  classMindGroup: "swordHorizon",
  allowedMindMethods: ["wolfchasersArt", "insightfulStrike", "moraleChant", "bitterSeason"],
  dingYinTags: ["Bleed Boost"],
  weapons: ["Sword", "Spear"],
  critBoostWeaponTypes: [],
  skills: withUniversalSkills(CLASS_ID, "Bellstrike", SKILLS),
  debuffs: DEBUFFS,
  ...rotationPoolFor(CLASS_ID),
  retunementPool: BELLSTRIKE_SPLENDOR_POOL,
  classBuffDefs: [mountainsMightBuffDef],
  gateBuffs: [],
  mechanics: [],
  skillBehaviors: [],
  displayGates: [],
  poisonExtensions: [],
})
