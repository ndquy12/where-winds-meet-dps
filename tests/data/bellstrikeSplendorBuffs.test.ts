import { describe, expect, it } from "vitest"
import { longWind } from "../../src/data/innerWays/mountainsMightBuffs/longWind"
import { qiImbalance } from "../../src/data/skills/bellstrike-splendor/buffs/qiImbalance"
import { swordSlashBonus } from "../../src/data/skills/bellstrike-splendor/buffs/swordSlashBonus"
import { qiStruggleEnhancement } from "../../src/data/skills/bellstrike-splendor/buffs/qiStruggleEnhancement"
import { ATTUNE, CAST, PROP } from "../../src/data/skills/ids"
import type { EffectContext } from "../../src/engine/effects/context"

describe("Mountain's Might", () => {
  it("triggers off every SpearQ variant bellstrikeSplendor carries", () => {
    expect(longWind.triggeredBy).toEqual([
      CAST.spearQ,
      CAST.spearQ0HitCancel,
      CAST.spearQPrepull,
    ])
  })

  it("lasts 10 seconds and applies on cast end", () => {
    expect(longWind.duration).toBe(10)
    expect(longWind.buffAppliesOnCastEnd).toBe(true)
  })

  it("grants a flat +0.03 directAffinityRate, unaffected by resistance conversion", () => {
    expect(longWind.effects).toEqual([{ kind: "stat", statKey: "directAffinityRate", amount: 0.03 }])
  })

  it("is gated behind its own enabled param", () => {
    expect(longWind.requires).toEqual({ param: "mountainsMight" })
  })
})

describe("Qi Imbalance", () => {
  const baseContext: EffectContext = {
    timeSec: 0,
    phase: "normal",
    build: { classId: "bellstrikeSplendor", spec: undefined, armorSet: undefined, param: () => false, paramTier: () => 0, paramValue: () => 0 },
    target: { isTrainingDummy: false },
    status: { isActive: () => false, stacks: () => 0, appliedAt: () => null, expiresAt: () => null },
    self: { stacks: 0 },
    event: { kind: "damage", castTag: CAST.spearQ, tags: new Set() },
  }

  it("triggers off Spear Q and Sword Q, lasting 15 seconds", () => {
    expect(qiImbalance.triggeredBy).toEqual([CAST.spearQ, CAST.swordQ])
    expect(qiImbalance.duration).toBe(15)
    expect(qiImbalance.buffAppliesOnCastEnd).toBe(true)
  })

  it("grants no bonus outside the qi break window", () => {
    if (typeof qiImbalance.effects !== "function") throw new Error("expected a closure")
    expect(qiImbalance.effects(baseContext)).toEqual([])
    expect(qiImbalance.effects({ ...baseContext, phase: "below30" })).toEqual([])
  })

  it("grants +8% allDamageBoost and +8% attributeDamageBoost during the qi break window", () => {
    if (typeof qiImbalance.effects !== "function") throw new Error("expected a closure")
    expect(qiImbalance.effects({ ...baseContext, phase: "exhausted" })).toEqual([
      { kind: "stat", statKey: "allDamageBoost", amount: 0.08 },
      { kind: "stat", statKey: "attributeDamageBoost", amount: 0.08 },
    ])
  })

  it("grants no bonus on non-damage events even during the qi break window", () => {
    if (typeof qiImbalance.effects !== "function") throw new Error("expected a closure")
    expect(qiImbalance.effects({ ...baseContext, phase: "exhausted", event: { kind: "display" } })).toEqual([])
  })
})

describe("Sword Slash Bonus", () => {
  it("triggers off every charged and Sword Special variant, lasting 8 seconds, up to 3 stacks", () => {
    expect(swordSlashBonus.triggeredBy).toEqual([
      CAST.swordHeavyCharged,
      CAST.swordHeavyCharged2Hit,
      CAST.swordHeavyChargedPrepull,
      CAST.energySurge,
      CAST.swordSpecial,
      CAST.swordSpecial2nd,
      CAST.swordSpecialDeflect,
    ])
    expect(swordSlashBonus.duration).toBe(8)
    expect(swordSlashBonus.maxStacks).toBe(3)
    expect(swordSlashBonus.stacksPerHit).toBe(true)
  })

  it("grants no bonus at 0 stacks", () => {
    if (typeof swordSlashBonus.effects !== "function") throw new Error("expected a closure")
    const baseContext: EffectContext = {
      timeSec: 0,
      phase: "normal",
      build: { classId: "bellstrikeSplendor", spec: undefined, armorSet: undefined, param: () => false, paramTier: () => 0, paramValue: () => 0 },
      target: { isTrainingDummy: false },
      status: { isActive: () => false, stacks: () => 0, appliedAt: () => null, expiresAt: () => null },
      self: { stacks: 0 },
      event: { kind: "damage", castTag: CAST.swordSpecial, tags: new Set() },
    }
    expect(swordSlashBonus.effects(baseContext)).toEqual([])
  })

  it("grants +10% allDamageBoost per stack, up to 3 stacks", () => {
    if (typeof swordSlashBonus.effects !== "function") throw new Error("expected a closure")
    const baseContext: EffectContext = {
      timeSec: 0,
      phase: "normal",
      build: { classId: "bellstrikeSplendor", spec: undefined, armorSet: undefined, param: () => false, paramTier: () => 0, paramValue: () => 0 },
      target: { isTrainingDummy: false },
      status: { isActive: () => false, stacks: () => 0, appliedAt: () => null, expiresAt: () => null },
      self: { stacks: 1 },
      event: { kind: "damage", castTag: CAST.swordSpecial, tags: new Set() },
    }
    expect(swordSlashBonus.effects(baseContext)).toEqual([{ kind: "stat", statKey: "allDamageBoost", amount: 0.1 }])
    const tripleStack = swordSlashBonus.effects({ ...baseContext, self: { stacks: 3 } })
    expect(tripleStack).toHaveLength(1)
    expect(tripleStack[0].statKey).toBe("allDamageBoost")
    expect(tripleStack[0].amount).toBeCloseTo(0.3)
  })
})

describe("Qi Struggle Enhancement", () => {
  const baseContext: EffectContext = {
    timeSec: 0,
    phase: "normal",
    build: { classId: "bellstrikeSplendor", spec: undefined, armorSet: undefined, param: () => false, paramTier: () => 0, paramValue: () => 0 },
    target: { isTrainingDummy: false },
    status: { isActive: () => false, stacks: () => 0, appliedAt: () => null, expiresAt: () => null },
    self: { stacks: 0 },
    event: { kind: "damage", castTag: CAST.swordSpecial, tags: new Set([ATTUNE.swordSpecial]) },
  }

  it("is always active and scoped to isCharged and Sword Special skills", () => {
    expect(qiStruggleEnhancement.alwaysActive).toBe(true)
    expect(qiStruggleEnhancement.affects).toEqual([PROP.isCharged, ATTUNE.swordSpecial])
  })

  it("grants +20% allDamageBoost on a Sword Special hit", () => {
    if (typeof qiStruggleEnhancement.effects !== "function") throw new Error("expected a closure")
    expect(qiStruggleEnhancement.effects(baseContext)).toEqual([
      { kind: "stat", statKey: "allDamageBoost", amount: 0.2 },
    ])
  })

  it("grants +20% allDamageBoost on an isCharged hit", () => {
    if (typeof qiStruggleEnhancement.effects !== "function") throw new Error("expected a closure")
    expect(
      qiStruggleEnhancement.effects({
        ...baseContext,
        event: { kind: "damage", castTag: CAST.swordHeavyCharged, tags: new Set([PROP.isCharged]) },
      }),
    ).toEqual([{ kind: "stat", statKey: "allDamageBoost", amount: 0.2 }])
  })

  it("grants no bonus on a hit outside both scopes", () => {
    if (typeof qiStruggleEnhancement.effects !== "function") throw new Error("expected a closure")
    expect(
      qiStruggleEnhancement.effects({
        ...baseContext,
        event: { kind: "damage", castTag: CAST.swordQ, tags: new Set() },
      }),
    ).toEqual([])
  })

  it("grants no bonus on non-damage events", () => {
    if (typeof qiStruggleEnhancement.effects !== "function") throw new Error("expected a closure")
    expect(qiStruggleEnhancement.effects({ ...baseContext, event: { kind: "display" } })).toEqual([])
  })
})
