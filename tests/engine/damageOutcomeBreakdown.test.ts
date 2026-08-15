import { describe, expect, it } from "vitest"
import { computeSkillDamage } from "../../src/engine/formula"
import { buildContext } from "../../src/engine/panel"
import { defaultInputs } from "../../src/engine/defaults"

// Scoped to Bellstrike Umbra — the only implemented class (CLAUDE.md
// § "Implemented classes").
const umbraInputs = { ...defaultInputs, classId: "bellstrikeUmbra" }

type Art = Parameters<typeof computeSkillDamage>[0]
const art_ = (a: Record<string, unknown>) => a as unknown as Art

const PLAIN_HIT = art_({
  name: "Plain",
  physMultiplier: 1,
  physFixed: 100,
  correction: 1,
  skillType: "weapon",
  weaponOrAttribute: "Sword",
})

describe("computeSkillDamage — outcome breakdown", () => {
  it("chances sum to 1 and the chance-weighted damage sum reproduces expectedDamage", () => {
    const ctx = buildContext(umbraInputs)
    const { expectedDamage, outcomes } = computeSkillDamage(PLAIN_HIT, ctx, 1)
    const chanceSum =
      outcomes.grazeChance + outcomes.critChance + outcomes.affinityChance + outcomes.normalChance
    expect(chanceSum).toBeCloseTo(1, 6)
    const weightedSum =
      outcomes.grazeChance * outcomes.grazeDamage +
      outcomes.critChance * outcomes.critDamage +
      outcomes.affinityChance * outcomes.affinityDamage +
      outcomes.normalChance * outcomes.normalDamage
    expect(weightedSum).toBeCloseTo(expectedDamage, 6)
  })

  it("a guaranteedNormal hit reports 100% normal chance, and normalDamage equals expectedDamage", () => {
    const ctx = buildContext(umbraInputs)
    const { expectedDamage, outcomes } = computeSkillDamage(
      art_({ ...PLAIN_HIT, guaranteedNormal: 1 }),
      ctx,
      1,
    )
    expect(outcomes.normalChance).toBe(1)
    expect(outcomes.grazeChance).toBe(0)
    expect(outcomes.critChance).toBe(0)
    expect(outcomes.affinityChance).toBe(0)
    expect(outcomes.normalDamage).toBeCloseTo(expectedDamage, 6)
  })

  it("a guaranteedCrit hit reports 100% crit chance, and critDamage equals expectedDamage", () => {
    const ctx = buildContext(umbraInputs)
    const { expectedDamage, outcomes } = computeSkillDamage(
      art_({ ...PLAIN_HIT, guaranteedCrit: 1 }),
      ctx,
      1,
    )
    expect(outcomes.critChance).toBe(1)
    expect(outcomes.grazeChance).toBe(0)
    expect(outcomes.affinityChance).toBe(0)
    expect(outcomes.normalChance).toBe(0)
    expect(outcomes.critDamage).toBeCloseTo(expectedDamage, 6)
  })

  it("every chance and every damage row is non-negative for a plain hit", () => {
    const ctx = buildContext(umbraInputs)
    const { outcomes } = computeSkillDamage(PLAIN_HIT, ctx, 1)
    expect(outcomes.grazeChance).toBeGreaterThanOrEqual(0)
    expect(outcomes.critChance).toBeGreaterThanOrEqual(0)
    expect(outcomes.affinityChance).toBeGreaterThanOrEqual(0)
    expect(outcomes.normalChance).toBeGreaterThanOrEqual(0)
    expect(outcomes.grazeDamage).toBeGreaterThanOrEqual(0)
    expect(outcomes.critDamage).toBeGreaterThanOrEqual(0)
    expect(outcomes.affinityDamage).toBeGreaterThanOrEqual(0)
    expect(outcomes.normalDamage).toBeGreaterThanOrEqual(0)
  })

  function sumOfTerms(
    equation: ReturnType<typeof computeSkillDamage>["outcomes"]["critEquation"],
  ): number {
    return (
      equation.physAttack.result +
      (equation.physFlat?.result ?? 0) +
      (equation.attributeFlat?.result ?? 0) +
      equation.attributeBlocks.reduce((sum, block) => sum + block.result, 0)
    )
  }

  it("every equation term, multiplied out, reproduces its own stated result", () => {
    const ctx = buildContext(umbraInputs)
    const { outcomes } = computeSkillDamage(PLAIN_HIT, ctx, 1)
    for (const equation of [
      outcomes.grazeEquation,
      outcomes.critEquation,
      outcomes.affinityEquation,
      outcomes.normalEquation,
    ]) {
      for (const term of [equation.physAttack, equation.physFlat, ...equation.attributeBlocks]) {
        if (!term) continue
        const product = term.factors.reduce(
          (acc, f) => acc * (f.isPercent ? 1 + f.value : f.value),
          1,
        )
        expect(product).toBeCloseTo(term.result, 6)
      }
    }
  })

  it("summing every term in an outcome's equation reproduces that outcome's own damage exactly", () => {
    const ctx = buildContext(umbraInputs)
    const { outcomes } = computeSkillDamage(PLAIN_HIT, ctx, 1)
    expect(sumOfTerms(outcomes.grazeEquation)).toBeCloseTo(outcomes.grazeDamage, 6)
    expect(sumOfTerms(outcomes.critEquation)).toBeCloseTo(outcomes.critDamage, 6)
    expect(sumOfTerms(outcomes.affinityEquation)).toBeCloseTo(outcomes.affinityDamage, 6)
    expect(sumOfTerms(outcomes.normalEquation)).toBeCloseTo(outcomes.normalDamage, 6)
  })

  it("a buff-driven affinityDamageBoost (e.g. Bellstrike Splendor's Affinity DMG UP) lands only on the Affinity outcome's own terms, at its exact amount", () => {
    const baseline = buildContext(umbraInputs)
    const boosted = buildContext({
      ...umbraInputs,
      affinityDamageBoost: umbraInputs.affinityDamageBoost + 0.18,
    })
    const before = computeSkillDamage(PLAIN_HIT, baseline, 1).outcomes
    const after = computeSkillDamage(PLAIN_HIT, boosted, 1).outcomes

    const affinityBoostFactor = (equation: (typeof after)["affinityEquation"]) =>
      equation.physAttack.factors.find((f) => f.label === "Affinity Damage Boost")?.value

    expect(
      affinityBoostFactor(after.affinityEquation)! - affinityBoostFactor(before.affinityEquation)!,
    ).toBeCloseTo(0.18, 6)
    expect(after.grazeEquation).toEqual(before.grazeEquation)
    expect(after.critEquation).toEqual(before.critEquation)
    expect(after.normalEquation).toEqual(before.normalEquation)
    expect(after.grazeDamage).toBeCloseTo(before.grazeDamage, 6)
    expect(after.critDamage).toBeCloseTo(before.critDamage, 6)
    expect(after.normalDamage).toBeCloseTo(before.normalDamage, 6)
    expect(after.affinityDamage).toBeGreaterThan(before.affinityDamage)
  })

  it("regression: Swallowcall's low-qi bonus is read twice by attrBlock, and the equation surfaces both reads so the terms still sum to the real damage", () => {
    const ctx = buildContext({ ...umbraInputs, set: "swallowcall" })
    const { outcomes } = computeSkillDamage(PLAIN_HIT, ctx, 1, {
      qiExhausted: 0,
      yiShuiLayer: 0,
      bengJieLayer: 0,
      lowQi: 1,
    })
    const equations = [
      [outcomes.grazeEquation, outcomes.grazeDamage],
      [outcomes.critEquation, outcomes.critDamage],
      [outcomes.affinityEquation, outcomes.affinityDamage],
      [outcomes.normalEquation, outcomes.normalDamage],
    ] as const
    for (const [equation, damage] of equations) {
      expect(sumOfTerms(equation)).toBeCloseTo(damage, 6)
      for (const block of equation.attributeBlocks) {
        const lowQiFactor = block.factors.find((f) => f.label === "Low-Qi Set Bonus")
        expect(lowQiFactor?.value).toBeCloseTo(0.1, 6)
        const dmgBoostFactor = block.factors.find((f) => f.label === "Damage Boost")
        expect(dmgBoostFactor).toBeTruthy()
      }
    }
  })

  it("regression: a weapon skill with no attributeMultiplier/attributeFixed still gets a nonzero, labeled attribute block, because non-matching attribute blocks read the phys multiplier instead of skipping", () => {
    const ctx = buildContext(umbraInputs)
    const { outcomes } = computeSkillDamage(PLAIN_HIT, ctx, 1)
    const nonMatching = outcomes.critEquation.attributeBlocks.filter(
      (block) => !block.usesMatchingMultiplier,
    )
    expect(nonMatching.length).toBeGreaterThan(0)
    for (const block of nonMatching) {
      const multiplierFactor = block.factors.find((f) => f.label === "Phys Multiplier (no match)")
      expect(multiplierFactor).toBeTruthy()
    }
  })
})
