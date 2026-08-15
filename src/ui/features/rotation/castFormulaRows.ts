import type { CastFormulaSnapshot } from "../../../engine/types"

export interface RawFormulaSource {
  name: string
  amount: number
}

type Unit = "fraction" | "raw"
type AttributeSuffix = "min" | "max" | "penetration"

// The calculation-step order the UI groups rows by — attack values feed the
// outcome rows in `damageCompositionRows.ts`, which is the step after this
// whole list, so keep the two files' step names in sync.
const STEPS = ["Attack Values", "Rates", "Damage Boosts", "Penetration & Defense"] as const
type Step = (typeof STEPS)[number]

interface FieldDef {
  key: Exclude<keyof CastFormulaSnapshot, "primaryAttribute">
  label: string
  unit: Unit
  step: Step
  statKeys?: readonly string[]
  attributeScopedSuffix?: AttributeSuffix
}

const FIELDS: readonly FieldDef[] = [
  {
    key: "effectiveMinPhysAttack",
    label: "Min Phys Attack",
    unit: "raw",
    step: "Attack Values",
    statKeys: ["phys.min"],
  },
  {
    key: "effectiveMaxPhysAttack",
    label: "Max Phys Attack",
    unit: "raw",
    step: "Attack Values",
    statKeys: ["phys.max"],
  },
  {
    key: "primaryAttributeMin",
    label: "Attribute Min Attack",
    unit: "raw",
    step: "Attack Values",
    attributeScopedSuffix: "min",
  },
  {
    key: "primaryAttributeMax",
    label: "Attribute Max Attack",
    unit: "raw",
    step: "Attack Values",
    attributeScopedSuffix: "max",
  },
  {
    key: "precisionRate",
    label: "Precision",
    unit: "fraction",
    step: "Rates",
    statKeys: ["precision"],
  },
  { key: "critRate", label: "Crit Rate", unit: "fraction", step: "Rates", statKeys: ["critRate"] },
  {
    key: "affinityRate",
    label: "Affinity Rate",
    unit: "fraction",
    step: "Rates",
    statKeys: ["affinityRate"],
  },
  {
    key: "directCritRate",
    label: "Direct Crit Rate",
    unit: "fraction",
    step: "Rates",
    statKeys: ["directCritRate"],
  },
  {
    key: "directAffinityRate",
    label: "Direct Affinity Rate",
    unit: "fraction",
    step: "Rates",
    statKeys: ["directAffinityRate"],
  },
  {
    key: "critDamageBoost",
    label: "Crit Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["critDamageBoost"],
  },
  {
    key: "affinityDamageBoost",
    label: "Affinity Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["affinityDamageBoost"],
  },
  {
    key: "physDamageBoost",
    label: "Phys Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["physBoost"],
  },
  {
    key: "attributeDamageBoost",
    label: "Attribute Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["attributeDamageBoost"],
  },
  {
    key: "sustainDamageBoost",
    label: "Sustain Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["sustainDamageBoost"],
  },
  {
    // No `BuffStatEffect` targets this field directly — it is composed inside
    // `panel.ts buildContext` from henZhi/easyHurt/tianGong/boss/school/target
    // plus an inner way's `generalDamageBoost` scalar and a set's own
    // `formulaBonus.generalDamageBoost`, never from an editor-system buff. The
    // "generalDamageBoost" path here is a synthetic key `buildFormulaSources`
    // writes to directly — it is NOT `Inputs.allDamageBoost`'s StatKey.
    key: "generalDamageBoost",
    label: "General Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["generalDamageBoost"],
  },
  {
    key: "allDamageBoost",
    label: "All Damage Boost",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["allDamageBoost"],
  },
  {
    key: "chargeBonus",
    label: "Charge Bonus",
    unit: "fraction",
    step: "Damage Boosts",
    statKeys: ["chargeBonus"],
  },
  {
    key: "physPenetration",
    label: "Phys Penetration",
    unit: "fraction",
    step: "Penetration & Defense",
    statKeys: ["phys.penetration"],
  },
  {
    key: "primaryAttributePenetration",
    label: "Attribute Penetration",
    unit: "fraction",
    step: "Penetration & Defense",
    attributeScopedSuffix: "penetration",
  },
  {
    key: "effectiveDefense",
    label: "Target Defense",
    unit: "raw",
    step: "Penetration & Defense",
    statKeys: ["target.defense", "target.defensePct"],
  },
]

export interface FormulaRowSource {
  name: string
  display: string
}

export interface FormulaRow {
  key: string
  label: string
  display: string
  changed: boolean
  sources: FormulaRowSource[]
  step: Step
}

function formatValue(value: number, unit: Unit): string {
  return unit === "fraction" ? `${(value * 100).toFixed(1)}%` : Math.round(value).toLocaleString()
}

function formatSourceAmount(amount: number, unit: Unit): string {
  const sign = amount >= 0 ? "+" : ""
  return unit === "fraction"
    ? `${sign}${(amount * 100).toFixed(0)}%`
    : `${sign}${Math.round(amount).toLocaleString()}`
}

function statKeysFor(field: FieldDef, snapshot: CastFormulaSnapshot): readonly string[] {
  if (field.attributeScopedSuffix) {
    return [`${snapshot.primaryAttribute.toLowerCase()}.${field.attributeScopedSuffix}`]
  }
  return field.statKeys ?? []
}

function sourcesFor(
  field: FieldDef,
  snapshot: CastFormulaSnapshot,
  sourcesByPath: Readonly<Record<string, readonly RawFormulaSource[]>>,
  unit: Unit,
): FormulaRowSource[] {
  const keys = statKeysFor(field, snapshot)
  if (keys.length === 0) return []
  const sources: FormulaRowSource[] = []
  for (const key of keys) {
    for (const source of sourcesByPath[key] ?? []) {
      if (source.amount === 0) continue
      sources.push({ name: source.name, display: formatSourceAmount(source.amount, unit) })
    }
  }
  return sources
}

export function castFormulaRows(
  snapshot: CastFormulaSnapshot | undefined,
  previous: CastFormulaSnapshot | undefined,
  sourcesByPath: Readonly<Record<string, readonly RawFormulaSource[]>> = {},
): FormulaRow[] {
  if (!snapshot) return []
  return FIELDS.map((field) => {
    const value = snapshot[field.key]
    const previousValue = previous?.[field.key]
    return {
      key: field.key,
      label: field.label,
      display: formatValue(value, field.unit),
      changed: previousValue !== undefined && previousValue !== value,
      sources: sourcesFor(field, snapshot, sourcesByPath, field.unit),
      step: field.step,
    }
  })
}

export interface FormulaStepGroup {
  step: Step
  rows: FormulaRow[]
}

export function groupRowsByStep(rows: readonly FormulaRow[]): FormulaStepGroup[] {
  return STEPS.map((step) => ({ step, rows: rows.filter((row) => row.step === step) })).filter(
    (group) => group.rows.length > 0,
  )
}
