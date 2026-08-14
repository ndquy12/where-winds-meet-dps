import { describe, expect, it } from "vitest"
import { DEBUFFS } from "../../src/data/skills/bellstrike-splendor/debuffs"
import { DEBUFF } from "../../src/data/skills/bellstrike-splendor/ids"

describe("bellstrike-splendor debuffs", () => {
  it("has exactly 5 debuffs", () => {
    expect(DEBUFFS).toHaveLength(5)
  })

  it("every debuff carries classId bellstrikeSplendor and Bellstrike attribute", () => {
    for (const debuff of DEBUFFS) {
      expect(debuff.classId, debuff.id).toBe("bellstrikeSplendor")
      expect(debuff.dot?.attributeAttack, debuff.id).toBe("Bellstrike")
    }
  })

  it("Bleed Tick matches its sourced per-stack values", () => {
    const bleedTick = DEBUFFS.find((debuff) => debuff.id === DEBUFF.bleedTick)!
    expect(bleedTick.maxStacks).toBe(5)
    expect(bleedTick.stackScaling).toBe("perStack")
    expect(bleedTick.dot?.tickIntervalFrames).toBe(60)
    expect(bleedTick.dot?.physMultiplier).toBe(0.07)
    expect(bleedTick.dot?.attributeMultiplier).toBe(0.105)
  })

  it("Toad Poison matches its sourced flat-tick values", () => {
    const toadPoison = DEBUFFS.find((debuff) => debuff.id === DEBUFF.toadPoison)!
    expect(toadPoison.durationFrames).toBe(601)
    expect(toadPoison.maxStacks).toBe(1)
    expect(toadPoison.dot?.tickIntervalFrames).toBe(300)
    expect(toadPoison.dot?.physMultiplier).toBe(1.6216)
    expect(toadPoison.dot?.physFixed).toBe(219)
  })
})
