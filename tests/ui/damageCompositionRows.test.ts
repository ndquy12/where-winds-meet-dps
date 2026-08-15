import { describe, expect, it } from "vitest"
import { damageCompositionRows } from "../../src/ui/features/rotation/damageCompositionRows"
import type { DamageOutcomeBreakdown, DamageOutcomeEquation } from "../../src/engine/formula"

function physOnlyEquation(
  attackValue: number,
  multiplier: number,
  boostPct: number,
): DamageOutcomeEquation {
  const factors = [
    { label: "Attack Value", value: attackValue, isPercent: false },
    { label: "Phys Multiplier", value: multiplier, isPercent: false },
    { label: "Damage Boost", value: boostPct, isPercent: true },
    { label: "Penetration", value: 0, isPercent: true },
    { label: "Combined Damage Boost", value: 0, isPercent: true },
    { label: "Skill Modifier", value: 1, isPercent: false },
  ]
  const result = factors.reduce((acc, f) => acc * (f.isPercent ? 1 + f.value : f.value), 1)
  return {
    physAttack: { factors, result },
    physFlat: null,
    attributeFlat: null,
    attributeBlocks: [],
  }
}

function mixedEquation(): DamageOutcomeEquation {
  const physFactors = [
    { label: "Attack Value", value: 1000, isPercent: false },
    { label: "Phys Multiplier", value: 1, isPercent: false },
    { label: "Damage Boost", value: 0, isPercent: true },
    { label: "Penetration", value: 0, isPercent: true },
    { label: "Combined Damage Boost", value: 0, isPercent: true },
    { label: "Skill Modifier", value: 1, isPercent: false },
  ]
  const attrFactors = [
    { label: "Attack Value", value: 480, isPercent: false },
    { label: "Phys Multiplier (no match)", value: 1, isPercent: false },
    { label: "Damage Boost", value: 0, isPercent: true },
    { label: "Penetration", value: 0, isPercent: true },
    { label: "Combined Damage Boost", value: 0, isPercent: true },
    { label: "Skill Modifier", value: 1, isPercent: false },
  ]
  return {
    physAttack: { factors: physFactors, result: 1000 },
    physFlat: null,
    attributeFlat: null,
    attributeBlocks: [
      { factors: attrFactors, result: 480, attribute: "Stonesplit", usesMatchingMultiplier: false },
    ],
  }
}

function outcomes(patch: Partial<DamageOutcomeBreakdown> = {}): DamageOutcomeBreakdown {
  const graze = physOnlyEquation(742, 1, 0)
  return {
    grazeChance: 0.58,
    critChance: 0.22,
    affinityChance: 0.15,
    normalChance: 0.05,
    grazeDamage: 742,
    critDamage: 1480,
    affinityDamage: 1120,
    normalDamage: 980,
    grazeEquation: graze,
    critEquation: physOnlyEquation(1000, 1, 0.48),
    affinityEquation: mixedEquation(),
    normalEquation: physOnlyEquation(980, 1, 0),
    ...patch,
  }
}

describe("damageCompositionRows", () => {
  it("formats each outcome's chance as a whole-percent and damage as a rounded, comma-grouped number", () => {
    const rows = damageCompositionRows(outcomes())
    const crit = rows.find((r) => r.key === "critChance")!
    expect(crit.chanceDisplay).toBe("22%")
    expect(crit.damageDisplay).toBe("1,480")
  })

  it("lists which rate rows each outcome's chance depends on, and none for normal", () => {
    const rows = damageCompositionRows(outcomes())
    expect(rows.find((r) => r.key === "grazeChance")!.chanceDependsOn).toEqual([
      "Precision",
      "Affinity Rate",
    ])
    expect(rows.find((r) => r.key === "normalChance")!.chanceDependsOn).toEqual([])
  })

  it("renders a Phys term with each factor labeled and formatted by its own kind (raw, multiplier, percent)", () => {
    const rows = damageCompositionRows(outcomes())
    const crit = rows.find((r) => r.key === "critChance")!
    const physTerm = crit.terms.find((t) => t.label === "Phys")!
    expect(physTerm.factors).toEqual([
      { label: "Attack Value", display: "1,000" },
      { label: "Phys Multiplier", display: "×1.00" },
      { label: "Damage Boost", display: "+48%" },
      { label: "Penetration", display: "+0%" },
      { label: "Combined Damage Boost", display: "+0%" },
      { label: "Skill Modifier", display: "×1.00" },
    ])
    expect(physTerm.resultDisplay).toBe("1,480")
  })

  it("labels an attribute term with the attribute name, and flags a non-matching multiplier", () => {
    const rows = damageCompositionRows(outcomes())
    const affinity = rows.find((r) => r.key === "affinityChance")!
    expect(affinity.terms.map((t) => t.label)).toEqual(["Phys", "Attribute (Stonesplit, no match)"])
  })

  it("omits a term entirely when its result is zero", () => {
    const rows = damageCompositionRows(outcomes())
    const graze = rows.find((r) => r.key === "grazeChance")!
    expect(graze.terms).toHaveLength(1)
    expect(graze.terms[0].label).toBe("Phys")
  })

  it("flags a zero-chance outcome (e.g. a guaranteedCrit hit)", () => {
    const rows = damageCompositionRows(
      outcomes({ critChance: 1, grazeChance: 0, affinityChance: 0, normalChance: 0 }),
    )
    expect(rows.find((r) => r.key === "critChance")!.isZero).toBe(false)
    expect(rows.find((r) => r.key === "grazeChance")!.isZero).toBe(true)
  })
})
