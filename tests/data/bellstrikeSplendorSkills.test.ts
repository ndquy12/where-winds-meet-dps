import { describe, expect, it } from "vitest"
import { SKILLS } from "../../src/data/skills/bellstrike-splendor"
import { SKILL } from "../../src/data/skills/bellstrike-splendor/ids"

describe("bellstrike-splendor skills", () => {
  it("has exactly 12 skills, one per sourced JSON file", () => {
    expect(SKILLS).toHaveLength(12)
  })

  it("every skill carries classId bellstrikeSplendor", () => {
    for (const skill of SKILLS) {
      expect(skill.classId, skill.id).toBe("bellstrikeSplendor")
    }
  })

  it("spearQ matches its sourced hit values", () => {
    const spearQ = SKILLS.find((skill) => skill.id === SKILL.spearQ)!
    expect(spearQ.castFrames).toBe(42)
    expect(spearQ.hits).toHaveLength(1)
    expect(spearQ.hits[0].physMultiplier).toBe(0.5727)
    expect(spearQ.hits[0].attributeMultiplier).toBe(0.859)
    expect(spearQ.hits[0].physFixed).toBe(133)
    expect(spearQ.hits[0].attributeFixed).toBe(74)
  })

  it("energySurge matches its sourced 3-hit values", () => {
    const energySurge = SKILLS.find((skill) => skill.id === SKILL.energySurge)!
    expect(energySurge.castFrames).toBe(51)
    expect(energySurge.hits).toHaveLength(3)
    expect(energySurge.hits.map((hitEntry) => hitEntry.frame)).toEqual([0, 17, 34])
    for (const hitEntry of energySurge.hits) {
      expect(hitEntry.physMultiplier).toBe(1.5676333333333332)
      expect(hitEntry.attributeMultiplier).toBe(2.2483)
      expect(hitEntry.physFixed).toBe(362)
      expect(hitEntry.attributeFixed).toBe(202)
    }
  })

  it("swordHeavyCharged2Hit matches its sourced 2-hit values", () => {
    const twoHit = SKILLS.find((skill) => skill.id === SKILL.swordHeavyCharged2Hit)!
    expect(twoHit.castFrames).toBe(117)
    expect(twoHit.hits).toHaveLength(2)
    expect(twoHit.hits.map((hitEntry) => hitEntry.frame)).toEqual([0, 58])
    expect(twoHit.hits[0].physMultiplier).toBe(1.437)
    expect(twoHit.hits[0].attributeMultiplier).toBe(2.15545)
    expect(twoHit.hits[0].physFixed).toBe(332)
    expect(twoHit.hits[0].attributeFixed).toBe(185)
  })
})
