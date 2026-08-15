import { describe, expect, it } from "vitest"
import {
  castFormulaRows,
  groupRowsByStep,
  type RawFormulaSource,
} from "../../src/ui/features/rotation/castFormulaRows"
import type { CastFormulaSnapshot } from "../../src/engine/types"

function snapshot(patch: Partial<CastFormulaSnapshot> = {}): CastFormulaSnapshot {
  return {
    precisionRate: 1,
    critRate: 0.5,
    affinityRate: 0.1,
    directCritRate: 0,
    directAffinityRate: 0,
    critDamageBoost: 0.6,
    affinityDamageBoost: 0.3,
    physDamageBoost: 0,
    attributeDamageBoost: 0,
    sustainDamageBoost: 0,
    generalDamageBoost: 0.2,
    allDamageBoost: 0,
    chargeBonus: 0,
    effectiveMinPhysAttack: 1000,
    effectiveMaxPhysAttack: 1200,
    physPenetration: 0.1,
    effectiveDefense: 300,
    primaryAttribute: "Bellstrike",
    primaryAttributeMin: 500,
    primaryAttributeMax: 600,
    primaryAttributePenetration: 0.05,
    ...patch,
  }
}

function sourceMap(path: string, sources: RawFormulaSource[]): Record<string, RawFormulaSource[]> {
  return { [path]: sources }
}

describe("castFormulaRows", () => {
  it("returns an empty list when the snapshot is missing", () => {
    expect(castFormulaRows(undefined, undefined)).toEqual([])
  })

  it("formats fraction fields as percentages and raw fields as plain numbers", () => {
    const rows = castFormulaRows(snapshot(), undefined)
    const critRow = rows.find((r) => r.key === "critRate")!
    const minPhysRow = rows.find((r) => r.key === "effectiveMinPhysAttack")!
    expect(critRow.display).toBe("50.0%")
    expect(minPhysRow.display).toBe("1,000")
  })

  it("marks a field changed only when it actually moved from the previous hit's snapshot", () => {
    const previous = snapshot({ critRate: 0.5 })
    const same = castFormulaRows(snapshot({ critRate: 0.5 }), previous)
    const moved = castFormulaRows(snapshot({ critRate: 0.7 }), previous)
    expect(same.find((r) => r.key === "critRate")!.changed).toBe(false)
    expect(moved.find((r) => r.key === "critRate")!.changed).toBe(true)
    expect(moved.find((r) => r.key === "affinityRate")!.changed).toBe(false)
  })

  it("does not mark anything changed when there is no previous hit", () => {
    const rows = castFormulaRows(snapshot(), undefined)
    expect(rows.every((r) => !r.changed)).toBe(true)
  })

  it("attributes a row to the source whose path matches that field", () => {
    const sources = {
      critRate: [{ name: "Crit Up", amount: 0.2 }],
      affinityRate: [{ name: "Unrelated", amount: 0.1 }],
    }
    const rows = castFormulaRows(snapshot(), undefined, sources)
    const critRow = rows.find((r) => r.key === "critRate")!
    expect(critRow.sources).toEqual([{ name: "Crit Up", display: "+20%" }])
  })

  it("omits a zero-amount source from a row's sources", () => {
    const rows = castFormulaRows(
      snapshot(),
      undefined,
      sourceMap("critRate", [{ name: "No-op", amount: 0 }]),
    )
    expect(rows.find((r) => r.key === "critRate")!.sources).toEqual([])
  })

  it("resolves the attribute-scoped rows against the snapshot's own primaryAttribute", () => {
    const sources = sourceMap("stonesplit.min", [{ name: "Stonesplit Up", amount: 50 }])
    const bellstrikeSnapshot = snapshot({ primaryAttribute: "Bellstrike" })
    const stonesplitSnapshot = snapshot({ primaryAttribute: "Stonesplit" })
    expect(
      castFormulaRows(bellstrikeSnapshot, undefined, sources).find(
        (r) => r.key === "primaryAttributeMin",
      )!.sources,
    ).toEqual([])
    expect(
      castFormulaRows(stonesplitSnapshot, undefined, sources).find(
        (r) => r.key === "primaryAttributeMin",
      )!.sources,
    ).toEqual([{ name: "Stonesplit Up", display: "+50" }])
  })

  it("chargeBonus and allDamageBoost each resolve against their own path", () => {
    const sources = {
      chargeBonus: [{ name: "Sword Horizon (Inner Way)", amount: 0.15 }],
      allDamageBoost: [{ name: "Revelry Script", amount: 0.3 }],
    }
    const rows = castFormulaRows(snapshot(), undefined, sources)
    expect(rows.find((r) => r.key === "chargeBonus")!.sources).toEqual([
      { name: "Sword Horizon (Inner Way)", display: "+15%" },
    ])
    expect(rows.find((r) => r.key === "allDamageBoost")!.sources).toEqual([
      { name: "Revelry Script", display: "+30%" },
    ])
  })
})

describe("groupRowsByStep", () => {
  it("groups every row under its calculation step, in Attack Values → Rates → Damage Boosts → Penetration & Defense order", () => {
    const rows = castFormulaRows(snapshot(), undefined)
    const groups = groupRowsByStep(rows)
    expect(groups.map((g) => g.step)).toEqual([
      "Attack Values",
      "Rates",
      "Damage Boosts",
      "Penetration & Defense",
    ])
    expect(groups.every((g) => g.rows.length > 0)).toBe(true)
    expect(groups.reduce((sum, g) => sum + g.rows.length, 0)).toBe(rows.length)
  })

  it("omits an empty step rather than emitting an empty group", () => {
    const rows = castFormulaRows(snapshot(), undefined).filter((r) => r.step !== "Rates")
    const groups = groupRowsByStep(rows)
    expect(groups.some((g) => g.step === "Rates")).toBe(false)
  })
})
