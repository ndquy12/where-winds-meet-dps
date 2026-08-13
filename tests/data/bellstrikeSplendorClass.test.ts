import { describe, expect, it } from "vitest"
import { BELLSTRIKE_SPLENDOR_POOL } from "../../src/data/classes/bellstrike-splendor/retunementPool"
import { rotationPoolFor } from "../../src/definitions/rotations/registry"
import { classDefinition, CLASS_IDS } from "../../src/definitions/classes/registry"

describe("bellstrikeSplendor retunement pool", () => {
  it("offers the same stat family as bellstrikeUmbra's weapons produce", () => {
    expect(BELLSTRIKE_SPLENDOR_POOL.stats).toEqual([
      "Affinity",
      "Max Phys",
      "Momentum",
      "Max Bellstrike",
      "Power",
      "Crit",
    ])
  })
})

describe("bellstrikeSplendor default rotation", () => {
  it("has one rotation with 6 sourced, castable steps", () => {
    const pool = rotationPoolFor("bellstrikeSplendor")
    expect(pool.rotations).toHaveLength(1)
    expect(pool.defaultRotationId).toBeTruthy()
    const rotation = pool.rotations[0]
    const skillIds = rotation.steps.map((step) => step.skillId)
    expect(skillIds).toEqual([
      "bellstrikeSplendor-spearq-prepull",
      "bellstrikeSplendor-swordheavycharged-prepull",
      "bellstrikeSplendor-swordq",
      "bellstrikeSplendor-energysurge",
      "bellstrikeSplendor-swordheavycharged",
      "bellstrikeSplendor-spearq",
    ])
  })
})

describe("bellstrikeSplendor class definition", () => {
  it("is registered in the class barrel", () => {
    expect(CLASS_IDS()).toContain("bellstrikeSplendor")
  })

  it("is unvalidated with the sourced spec and attribute", () => {
    const splendor = classDefinition("bellstrikeSplendor")!
    expect(splendor.validated).toBe(false)
    expect(splendor.spec).toBe("bellstrike_splendor")
    expect(splendor.primaryAttribute).toBe("Bellstrike")
    expect(splendor.attributeMultiplier).toBe(51.5)
  })

  it("carries the sourced weapons and dingYin tags", () => {
    const splendor = classDefinition("bellstrikeSplendor")!
    expect(splendor.weapons).toEqual(["Sword", "Spear"])
    expect(splendor.critBoostWeaponTypes).toEqual([])
    expect(splendor.dingYinTags).toEqual(["Bleed Boost"])
  })

  it("mirrors bellstrikeUmbra's mind group, flagged unsourced", () => {
    const splendor = classDefinition("bellstrikeSplendor")!
    expect(splendor.classMindGroup).toBe("swordHorizon")
    expect(splendor.allowedMindMethods).toEqual([
      "wolfchasersArt",
      "insightfulStrike",
      "moraleChant",
      "bitterSeason",
    ])
  })

  it("carries 12 own skills plus the universal pool, 5 debuffs, and Mountain's Might", () => {
    const splendor = classDefinition("bellstrikeSplendor")!
    expect(splendor.skills.length).toBeGreaterThanOrEqual(12)
    expect(splendor.debuffs).toHaveLength(5)
    expect(splendor.classBuffDefs.map((module) => module.id)).toEqual(["mountainsMight"])
  })

  it("has its own retunement pool and a resolvable default rotation", () => {
    const splendor = classDefinition("bellstrikeSplendor")!
    expect(splendor.retunementPool?.stats).toEqual([
      "Affinity",
      "Max Phys",
      "Momentum",
      "Max Bellstrike",
      "Power",
      "Crit",
    ])
    expect(splendor.rotations.length).toBeGreaterThan(0)
    expect(splendor.defaultRotationId).toBeTruthy()
  })
})
