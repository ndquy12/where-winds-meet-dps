
// Every string value is byte-identical to reference/classes/skills/bellstrike-rainbow/*.json
// and reference/classes/debuffsLibrary.json's bellstrikeSplendor entries — these
// tables pin those strings, they do not invent them.

export const CLASS_ID = "bellstrikeSplendor"

export const SKILL = {
  swordQ: "bellstrikeSplendor-swordq",
  swordQ2nd: "bellstrikeSplendor-swordq-2nd",
  swordSpecial: "bellstrikeSplendor-swordspecial",
  swordSpecial2nd: "bellstrikeSplendor-swordspecial-2nd",
  swordSpecialDeflect: "bellstrikeSplendor-swordspecial-deflect",
  swordHeavyCharged: "bellstrikeSplendor-swordheavycharged",
  swordHeavyChargedPrepull: "bellstrikeSplendor-swordheavycharged-prepull",
  swordHeavyCharged2Hit: "bellstrikeSplendor-swordheavycharged-2-hit",
  spearQ: "bellstrikeSplendor-spearq",
  spearQPrepull: "bellstrikeSplendor-spearq-prepull",
  spearQ0HitCancel: "bellstrikeSplendor-spearq-0-hit-cancel",
  energySurge: "bellstrikeSplendor-energysurge",
} as const

export const DEBUFF = {
  toadPoison: "debuff-bellstrikeSplendor-toad-poison",
  combustion: "debuff-bellstrikeSplendor-combustion",
  fluteRipple: "debuff-bellstrikeSplendor-flute-ripple",
  bleedTick: "debuff-bellstrikeSplendor-bleed-tick",
  bitterSeasonTick: "debuff-bellstrikeSplendor-bitter-season-tick",
} as const
