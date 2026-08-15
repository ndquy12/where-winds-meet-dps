import { describe, expect, it } from "vitest"
import { BuffEngine } from "../../src/engine/buffs/buffEngine"
import { buffDefsForClass, groupBuffDefs } from "../../src/engine/buffs/data"
import { makeSkill } from "../../src/engine/skill"
import { BUFF } from "../../src/data/skills/buffs/ids"
import { CAST, WEAPON } from "../../src/data/skills/ids"

const CLASS = "bellstrikeSplendor"

function engine(params: Record<string, unknown> = {}) {
  return new BuffEngine({ classId: CLASS, ...params }, buffDefsForClass(CLASS), groupBuffDefs())
}

function skill(name: string, tags: string[], castTag: string, receives: string[] = []) {
  return makeSkill(CLASS, {
    name,
    castTag,
    weaponOrAttribute: "Spear",
    attributeAttack: "Bellstrike",
    tags,
    receives,
  })
}

const statOf = (
  engineUnderTest: BuffEngine,
  target: ReturnType<typeof skill>,
  at: number,
  statKey: string,
) =>
  engineUnderTest
    .calculateDamageEffects(target, at)
    .effects.filter((effect) => effect.statKey === statKey)
    .reduce((total, effect) => total + effect.amount, 0)

describe("Sword Qi Affinity Enhancement", () => {
  const bystander = () =>
    skill("EnergySurge", [WEAPON.sword], CAST.energySurge, [BUFF.swordQiAffinityEnhancement])

  it("pays out while Qi Imbalance is active, even outside the qi-break phase window", () => {
    const engaged = engine()
    engaged.processSkillCast(CAST.spearQ, 0, { castTime: 1 }, false, [BUFF.qiImbalance])
    expect(engaged.qiPhase(1.5)).toBe("normal")
    expect(statOf(engaged, bystander(), 1.5, "affinityDamageBoost")).toBeCloseTo(0.18, 9)
  })

  it("contributes nothing once Qi Imbalance has expired and the phase is normal", () => {
    const expired = engine()
    expired.processSkillCast(CAST.spearQ, 0, { castTime: 1 }, false, [BUFF.qiImbalance])
    expect(statOf(expired, bystander(), 20, "affinityDamageBoost")).toBe(0)
  })

  it("still pays out below the qi threshold with no Qi Imbalance in play", () => {
    const lowQi = engine({ belowQiTime: 0 })
    expect(statOf(lowQi, bystander(), 1.5, "affinityDamageBoost")).toBeCloseTo(0.18, 9)
  })
})

describe("Long Wind (Mountain's Might)", () => {
  const bystander = () => skill("SwordQ", [WEAPON.sword], CAST.swordQ)

  it("reaches skills that never declared it, not just the one that cast Spear Q", () => {
    const gale = engine({ mountainsMight: true })
    gale.processSkillCast(CAST.spearQ, 0, { castTime: 1 }, false, [BUFF.mountainsMight])
    expect(statOf(gale, bystander(), 1.5, "directAffinityRate")).toBeCloseTo(0.03, 9)
  })

  it("contributes nothing without the inner way slotted", () => {
    const unslotted = engine()
    unslotted.processSkillCast(CAST.spearQ, 0, { castTime: 1 }, false, [BUFF.mountainsMight])
    expect(statOf(unslotted, bystander(), 1.5, "directAffinityRate")).toBe(0)
  })
})
