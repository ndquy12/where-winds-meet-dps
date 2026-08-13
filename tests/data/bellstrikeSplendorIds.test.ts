import { describe, expect, it } from "vitest"
import { CLASS_ID, SKILL, DEBUFF } from "../../src/data/skills/bellstrike-splendor/ids"

describe("bellstrike-splendor ids", () => {
  it("pins the class id", () => {
    expect(CLASS_ID).toBe("bellstrikeSplendor")
  })

  it("pins every skill id to its source JSON id", () => {
    expect(SKILL.swordQ).toBe("bellstrikeSplendor-swordq")
    expect(SKILL.swordQ2nd).toBe("bellstrikeSplendor-swordq-2nd")
    expect(SKILL.swordSpecial).toBe("bellstrikeSplendor-swordspecial")
    expect(SKILL.swordSpecial2nd).toBe("bellstrikeSplendor-swordspecial-2nd")
    expect(SKILL.swordSpecialDeflect).toBe("bellstrikeSplendor-swordspecial-deflect")
    expect(SKILL.swordHeavyCharged).toBe("bellstrikeSplendor-swordheavycharged")
    expect(SKILL.swordHeavyChargedPrepull).toBe("bellstrikeSplendor-swordheavycharged-prepull")
    expect(SKILL.swordHeavyCharged2Hit).toBe("bellstrikeSplendor-swordheavycharged-2-hit")
    expect(SKILL.spearQ).toBe("bellstrikeSplendor-spearq")
    expect(SKILL.spearQPrepull).toBe("bellstrikeSplendor-spearq-prepull")
    expect(SKILL.spearQ0HitCancel).toBe("bellstrikeSplendor-spearq-0-hit-cancel")
    expect(SKILL.energySurge).toBe("bellstrikeSplendor-energysurge")
  })

  it("pins every debuff id to its source JSON id", () => {
    expect(DEBUFF.toadPoison).toBe("debuff-bellstrikeSplendor-toad-poison")
    expect(DEBUFF.combustion).toBe("debuff-bellstrikeSplendor-combustion")
    expect(DEBUFF.fluteRipple).toBe("debuff-bellstrikeSplendor-flute-ripple")
    expect(DEBUFF.bleedTick).toBe("debuff-bellstrikeSplendor-bleed-tick")
    expect(DEBUFF.bitterSeasonTick).toBe("debuff-bellstrikeSplendor-bitter-season-tick")
  })
})
