import { describe, expect, it } from "vitest"
import { BELLSTRIKE_SPLENDOR_POOL } from "../../src/data/classes/bellstrike-splendor/retunementPool"
import { rotationPoolFor } from "../../src/definitions/rotations/registry"

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
