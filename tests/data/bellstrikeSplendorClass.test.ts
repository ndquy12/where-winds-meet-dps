import { describe, expect, it } from "vitest"
import { BELLSTRIKE_SPLENDOR_POOL } from "../../src/data/classes/bellstrike-splendor/retunementPool"

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
