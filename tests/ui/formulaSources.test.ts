import { describe, expect, it } from "vitest"
import {
  buffFormulaSources,
  buildFormulaSources,
  classBuffFormulaSources,
  combatToggleFormulaSources,
  mergeFormulaSources,
} from "../../src/ui/features/rotation/formulaSources"
import { defaultInputs } from "../../src/engine/defaults"
import type {
  CastBuffTag,
  CastHitFormulaSnapshot,
  Inputs,
  MartialArtsTalent,
} from "../../src/engine/types"
import type { DamageOutcomeEquation } from "../../src/engine/formula"

function flatEquation(result: number): DamageOutcomeEquation {
  return {
    physAttack: { factors: [{ label: "Attack Value", value: result, isPercent: false }], result },
    physFlat: null,
    attributeFlat: null,
    attributeBlocks: [],
  }
}

// Scoped to Bellstrike Umbra — the only implemented class (CLAUDE.md
// § "Implemented classes"). insightfulStrike and shatteredRidge are class-
// agnostic reference data, used here only to exercise real, registered
// contributions rather than fabricated ones.
const baseInputs: Inputs = {
  ...defaultInputs,
  classId: "bellstrikeUmbra",
  set: null,
  bowSet: null,
  martialArtsTalents: [],
  oddities: {},
  mindMethods: [
    { name: "", stacks: "" },
    { name: "", stacks: "" },
    { name: "", stacks: "" },
    { name: "", stacks: "" },
  ],
  combatSettings: { ...defaultInputs.combatSettings!, revelryScript: false, healerBuff: false },
}

function tag(patch: Partial<CastBuffTag> = {}): CastBuffTag {
  return { id: "buff", name: "Buff", stacks: 1, maxStacks: 1, effects: [], ...patch }
}

function hitSnapshot(patch: Partial<CastHitFormulaSnapshot> = {}): CastHitFormulaSnapshot {
  return {
    skillName: "Hit",
    atTimeSec: 0,
    qiPhase: "normal",
    inWindow: true,
    damage: 100,
    outcomes: {
      grazeChance: 0.5,
      critChance: 0.2,
      affinityChance: 0.2,
      normalChance: 0.1,
      grazeDamage: 80,
      critDamage: 150,
      affinityDamage: 140,
      normalDamage: 100,
      grazeEquation: flatEquation(80),
      critEquation: flatEquation(150),
      affinityEquation: flatEquation(140),
      normalEquation: flatEquation(100),
    },
    classBuffSources: [],
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

describe("buffFormulaSources", () => {
  it("keys each buff's nonzero effects by their own statKey", () => {
    const buffs = [tag({ name: "Crit Up", effects: [{ statKey: "critRate", amount: 0.2 }] })]
    const out = buffFormulaSources(buffs)
    expect(out.critRate).toEqual([{ name: "Crit Up", amount: 0.2 }])
  })

  it("drops zero-amount effects", () => {
    const buffs = [tag({ effects: [{ statKey: "critRate", amount: 0 }] })]
    expect(buffFormulaSources(buffs).critRate).toBeUndefined()
  })

  it("regression: skips an engineSourced tag, since classBuffFormulaSources already reports its real per-hit amount", () => {
    const buffs = [
      tag({
        name: "Sword Slash Damage Boost",
        effects: [{ statKey: "allDamageBoost", amount: 0.3 }],
        engineSourced: true,
      }),
    ]
    expect(buffFormulaSources(buffs).allDamageBoost).toBeUndefined()
  })
})

describe("buildFormulaSources — talents", () => {
  it("attributes an enabled flat talent's own contribution to its mapped path", () => {
    const talent: MartialArtsTalent = {
      id: "t1",
      name: "Fury Strike",
      enabled: true,
      stat: "critRate",
      maxBonus: 0.15,
      scalesWith: "power",
      scaleMax: 0,
    }
    const out = buildFormulaSources({ ...baseInputs, martialArtsTalents: [talent] })
    expect(out.critRate).toEqual([{ name: "Fury Strike (Talent)", amount: 0.15 }])
  })

  it("skips a disabled talent entirely", () => {
    const talent: MartialArtsTalent = {
      id: "t1",
      name: "Fury Strike",
      enabled: false,
      stat: "critRate",
      maxBonus: 0.15,
      scalesWith: "power",
      scaleMax: 0,
    }
    const out = buildFormulaSources({ ...baseInputs, martialArtsTalents: [talent] })
    expect(out.critRate).toBeUndefined()
  })
})

describe("buildFormulaSources — oddities", () => {
  it("aggregates every enabled node under a single 'Oddities' source", () => {
    const out = buildFormulaSources({
      ...baseInputs,
      oddities: {
        region: [
          { id: 1, stat: "critRate", value: 0.03, enabled: true },
          { id: 2, stat: "critRate", value: 0.02, enabled: true },
          { id: 3, stat: "critRate", value: 0.5, enabled: false },
        ],
      },
    })
    expect(out.critRate).toEqual([{ name: "Oddities", amount: 0.05 }])
  })
})

describe("buildFormulaSources — inner way", () => {
  it("attributes both a panelStats path and an allDamageBonus scalar to the real Insightful Strike def", () => {
    const out = buildFormulaSources({
      ...baseInputs,
      mindMethods: [
        { id: "insightfulStrike", name: "Insightful Strike", stacks: "tier 6" },
        { name: "", stacks: "" },
        { name: "", stacks: "" },
        { name: "", stacks: "" },
      ],
    })
    expect(out["phys.min"]).toEqual([{ name: "Insightful Strike (Inner Way)", amount: 22.3 }])
    expect(out.allDamageBoost).toEqual([{ name: "Insightful Strike (Inner Way)", amount: 0.015 }])
  })

  it("attributes nothing for an empty slot", () => {
    const out = buildFormulaSources(baseInputs)
    expect(Object.keys(out)).toHaveLength(0)
  })
})

describe("buildFormulaSources — set", () => {
  it("attributes the real Shattered Ridge's 2-piece panel bonus and 4-piece formula bonus separately", () => {
    const out = buildFormulaSources({ ...baseInputs, set: "shatteredRidge" })
    expect(out["phys.min"]).toEqual([{ name: "Shattered Ridge (Set)", amount: 78 }])
    expect(out.generalDamageBoost).toEqual([{ name: "Shattered Ridge (Set)", amount: 0.05 }])
    expect(out.allDamageBoost).toBeUndefined()
  })
})

describe("buildFormulaSources — bow set", () => {
  it("attributes the crit bow-set bonus to critRate", () => {
    const out = buildFormulaSources({ ...baseInputs, bowSet: "crit" })
    expect(out.critRate).toEqual([{ name: "Bow Set", amount: 0.045 }])
  })
})

describe("combatToggleFormulaSources", () => {
  it("adds revelry script and healer buff (boosted while exhausted), and gates Qi Break on the enabled flag and phase", () => {
    const withToggles: Inputs = {
      ...baseInputs,
      combatSettings: {
        ...baseInputs.combatSettings!,
        revelryScript: true,
        healerBuff: true,
        qiBreak: { enabled: true, startSec: 25, durationSec: 10 },
      },
    }
    const normal = combatToggleFormulaSources(withToggles, "normal")
    expect(normal.allDamageBoost).toEqual([
      { name: "Revelry Script", amount: 0.3 },
      { name: "Healer Buff", amount: 0.2 },
    ])
    const exhausted = combatToggleFormulaSources(withToggles, "exhausted")
    expect(exhausted.allDamageBoost).toEqual([
      { name: "Revelry Script", amount: 0.3 },
      { name: "Qi Break Boost", amount: 0.1 },
      { name: "Healer Buff", amount: 0.25 },
    ])
  })

  it("omits Qi Break when combatSettings.qiBreak.enabled is false, even while exhausted", () => {
    const out = combatToggleFormulaSources(
      {
        ...baseInputs,
        combatSettings: {
          ...baseInputs.combatSettings!,
          qiBreak: { enabled: false, startSec: 25, durationSec: 10 },
        },
      },
      "exhausted",
    )
    expect(out.allDamageBoost).toBeUndefined()
  })
})

describe("classBuffFormulaSources", () => {
  it("keys a class-buff module's nonzero effects by their own statKey, named by the module", () => {
    const hit = hitSnapshot({
      classBuffSources: [
        {
          statKey: "allDamageBoost",
          amount: 0.08,
          sourceId: "qiImbalance",
          sourceName: "Qi Imbalance",
        },
        {
          statKey: "attributeDamageBoost",
          amount: 0.08,
          sourceId: "qiImbalance",
          sourceName: "Qi Imbalance",
        },
      ],
    })
    const out = classBuffFormulaSources(hit)
    expect(out.allDamageBoost).toEqual([{ name: "Qi Imbalance", amount: 0.08 }])
    expect(out.attributeDamageBoost).toEqual([{ name: "Qi Imbalance", amount: 0.08 }])
  })

  it("is empty when the hit carries no class-buff contributions", () => {
    expect(classBuffFormulaSources(hitSnapshot())).toEqual({})
  })
})

describe("mergeFormulaSources", () => {
  it("concatenates sources for the same path across maps, preserving each map's own sources for distinct paths", () => {
    const merged = mergeFormulaSources(
      { critRate: [{ name: "A", amount: 0.1 }] },
      { critRate: [{ name: "B", amount: 0.2 }], affinityRate: [{ name: "C", amount: 0.05 }] },
    )
    expect(merged.critRate).toEqual([
      { name: "A", amount: 0.1 },
      { name: "B", amount: 0.2 },
    ])
    expect(merged.affinityRate).toEqual([{ name: "C", amount: 0.05 }])
  })
})
