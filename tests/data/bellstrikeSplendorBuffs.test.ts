import { describe, expect, it } from "vitest"
import { mountainsMightBuffDef } from "../../src/data/skills/bellstrike-splendor/buffs/mountainsMight"
import { CAST } from "../../src/data/skills/ids"

describe("Mountain's Might", () => {
  it("triggers off every SpearQ variant", () => {
    expect(mountainsMightBuffDef.triggeredBy).toEqual([
      CAST.spearQ,
      CAST.spearQ0HitCancel,
      CAST.spearQ5HitCancel,
      CAST.spearQPrepull,
    ])
  })

  it("lasts 8 seconds and applies on cast end", () => {
    expect(mountainsMightBuffDef.duration).toBe(8)
    expect(mountainsMightBuffDef.buffAppliesOnCastEnd).toBe(true)
  })

  it("grants a flat +0.015 directAffinityRate, unaffected by resistance conversion", () => {
    expect(mountainsMightBuffDef.effects).toEqual([{ kind: "stat", statKey: "directAffinityRate", amount: 0.015 }])
  })

  it("is gated behind its own enabled param", () => {
    expect(mountainsMightBuffDef.requires).toEqual({ param: "mountainsMight" })
  })
})
