import type {
  DamageEquationTerm,
  DamageOutcomeBreakdown,
  DamageOutcomeEquation,
} from "../../../engine/formula"

interface OutcomeDef {
  key: keyof DamageOutcomeBreakdown & `${string}Chance`
  damageKey: keyof DamageOutcomeBreakdown & `${string}Damage`
  equationKey: keyof DamageOutcomeBreakdown & `${string}Equation`
  label: string
  chanceDependsOn: readonly string[]
}

// Which rate rows each outcome's chance is computed from — see
// docs/CALCULATION.md's graze-rate rule for the one that's spelled out
// exactly; crit/affinity compete against each other inside the kernel, so
// naming their dependencies is as precise as this gets without recomputing
// the kernel's own chance math a second time.
const OUTCOMES: readonly OutcomeDef[] = [
  {
    key: "grazeChance",
    damageKey: "grazeDamage",
    equationKey: "grazeEquation",
    label: "Graze",
    chanceDependsOn: ["Precision", "Affinity Rate"],
  },
  {
    key: "critChance",
    damageKey: "critDamage",
    equationKey: "critEquation",
    label: "Crit",
    chanceDependsOn: ["Precision", "Crit Rate", "Direct Crit Rate"],
  },
  {
    key: "affinityChance",
    damageKey: "affinityDamage",
    equationKey: "affinityEquation",
    label: "Affinity",
    chanceDependsOn: ["Affinity Rate", "Direct Affinity Rate"],
  },
  {
    key: "normalChance",
    damageKey: "normalDamage",
    equationKey: "normalEquation",
    label: "Normal",
    chanceDependsOn: [],
  },
]

// Raw multiplicands (an attack value, a flat damage number, the skill's own
// N/O coefficient) print as plain numbers; every other factor this module
// names is a percent that multiplies in as `(1 + value)` — see
// `formula.ts`'s `DamageFactor.isPercent`, which this label set mirrors. A
// new factor label added in formula.ts needs an entry here too.
const RAW_LABELS = new Set(["Attack Value", "Flat Damage"])
const RAW_MULTIPLIER_LABELS = new Set([
  "Phys Multiplier",
  "Attribute Multiplier",
  "Phys Multiplier (no match)",
  "Skill Modifier",
  "DoT Multiplier",
])

function formatFactor(label: string, value: number): string {
  if (RAW_LABELS.has(label)) return Math.round(value).toLocaleString()
  if (RAW_MULTIPLIER_LABELS.has(label)) return `×${value.toFixed(2)}`
  const sign = value >= 0 ? "+" : ""
  return `${sign}${(value * 100).toFixed(0)}%`
}

export interface FormulaFactorDisplay {
  label: string
  display: string
}

export interface FormulaTermDisplay {
  label: string
  factors: FormulaFactorDisplay[]
  resultDisplay: string
}

export interface CompositionRow {
  key: string
  label: string
  chanceDisplay: string
  damageDisplay: string
  chanceDependsOn: readonly string[]
  terms: FormulaTermDisplay[]
  isZero: boolean
}

function displayTerm(label: string, term: DamageEquationTerm): FormulaTermDisplay {
  return {
    label,
    factors: term.factors.map((f) => ({ label: f.label, display: formatFactor(f.label, f.value) })),
    resultDisplay: Math.round(term.result).toLocaleString(),
  }
}

function displayTerms(equation: DamageOutcomeEquation): FormulaTermDisplay[] {
  const terms: FormulaTermDisplay[] = []
  if (equation.physAttack.result !== 0) terms.push(displayTerm("Phys", equation.physAttack))
  if (equation.physFlat && equation.physFlat.result !== 0) {
    terms.push(displayTerm("Phys (Flat)", equation.physFlat))
  }
  if (equation.attributeFlat && equation.attributeFlat.result !== 0) {
    terms.push(displayTerm("Attribute (Flat)", equation.attributeFlat))
  }
  for (const block of equation.attributeBlocks) {
    const suffix = block.usesMatchingMultiplier ? "" : ", no match"
    terms.push(displayTerm(`Attribute (${block.attribute}${suffix})`, block))
  }
  return terms
}

export function damageCompositionRows(outcomes: DamageOutcomeBreakdown): CompositionRow[] {
  return OUTCOMES.map((outcome) => {
    const chance = outcomes[outcome.key]
    const damage = outcomes[outcome.damageKey]
    return {
      key: outcome.key,
      label: outcome.label,
      chanceDisplay: `${(chance * 100).toFixed(0)}%`,
      damageDisplay: Math.round(damage).toLocaleString(),
      chanceDependsOn: outcome.chanceDependsOn,
      terms: displayTerms(outcomes[outcome.equationKey]),
      isZero: chance === 0,
    }
  })
}
