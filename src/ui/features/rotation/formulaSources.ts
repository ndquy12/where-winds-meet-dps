import type {
  CastBuffTag,
  CastHitFormulaSnapshot,
  Inputs,
  MindMethodSlot,
} from "../../../engine/types"
import { equippedPiecesFor } from "../../../engine/derivedInputs"
import {
  buildScalingSources,
  DEFAULT_ODDITIES,
  oddityContributions,
  userTalentContributions,
  getMindMethodContributions,
} from "../../../definitions/baseStats"
import { innerWayScalar } from "../../../definitions/innerWays/registry"
import { ARMOR_SET_OPTIONS, BOW_SET_BONUS } from "../../../engine/panel"
import { SET_BY_ID } from "../../../definitions/sets/registry"
import {
  HEALER_BUFF_DAMAGE_BOOST,
  HEALER_BUFF_EXHAUSTED_BONUS,
  QI_BREAK_DAMAGE_BOOST,
  REVELRY_SCRIPT_DAMAGE_BOOST,
} from "../../../engine/timeline"
import type { RawFormulaSource } from "./castFormulaRows"

type SourceMap = Record<string, RawFormulaSource[]>

function add(map: SourceMap, path: string, name: string, amount: number): void {
  if (!amount) return
  ;(map[path] ??= []).push({ name, amount })
}

const EMPTY_MIND_METHOD_SLOT: MindMethodSlot = { name: "", stacks: "" }

const ARMOR_SET_STAT_TO_PATH: Readonly<Record<string, string>> = {
  affinityRate: "affinityRate",
  critRate: "critRate",
  precisionRate: "precision",
  maxPhys: "phys.max",
  minPhys: "phys.min",
}

const BOW_SET_STAT_TO_PATH: Readonly<Record<string, string>> = {
  affinity: "affinityRate",
  crit: "critRate",
  precision: "precision",
}

// Skips `engineSourced` tags — a class buff's chip carries a display-only
// re-evaluation of its own effects (see `CastBuffTag.engineSourced`), and
// `classBuffFormulaSources` below already reports its real per-hit amount.
// Reading both here would attribute the same buff twice.
export function buffFormulaSources(buffs: readonly CastBuffTag[]): SourceMap {
  const out: SourceMap = {}
  for (const buff of buffs) {
    if (buff.engineSourced) continue
    for (const effect of buff.effects) add(out, effect.statKey, buff.name, effect.amount)
  }
  return out
}

// Class-buff-system modules (`defineClassBuff`, an inner way's own
// `buffDefs`) live on `hit.classBuffSources` — the one contributor category
// none of the other three functions here reach, since it is neither an
// editor-system `Buff`/`Debuff` (→ `RotationCast.buffs`'s non-`engineSourced`
// tags), a build-level talent/oddity/set/inner-way panel stat, nor a
// `combatSettings` toggle.
export function classBuffFormulaSources(hit: CastHitFormulaSnapshot): SourceMap {
  const out: SourceMap = {}
  for (const source of hit.classBuffSources) {
    add(out, source.statKey, source.sourceName, source.amount)
  }
  return out
}

// Calls the same resolver the engine itself uses for each category
// (`userTalentContributions`, `oddityContributions`, `getMindMethodContributions`,
// `innerWayScalar`) so these numbers can't drift from the real derivation.
export function buildFormulaSources(inputs: Inputs): SourceMap {
  const out: SourceMap = {}

  const equipped = equippedPiecesFor(inputs)
  const scalingSources = buildScalingSources(inputs, equipped)
  for (const talent of inputs.martialArtsTalents) {
    if (!talent.enabled) continue
    for (const [path, amount] of Object.entries(
      userTalentContributions([talent], scalingSources),
    )) {
      add(out, path, `${talent.name} (Talent)`, amount)
    }
  }

  const oddities = inputs.oddities ?? DEFAULT_ODDITIES
  for (const [path, amount] of Object.entries(oddityContributions(oddities))) {
    add(out, path, "Oddities", amount)
  }

  for (const slot of inputs.mindMethods) {
    if (!slot.name) continue
    const soloInputs: Inputs = {
      ...inputs,
      mindMethods: [slot, EMPTY_MIND_METHOD_SLOT, EMPTY_MIND_METHOD_SLOT, EMPTY_MIND_METHOD_SLOT],
    }
    for (const [path, amount] of Object.entries(getMindMethodContributions(soloInputs))) {
      add(out, path, `${slot.name} (Inner Way)`, amount)
    }
    add(
      out,
      "generalDamageBoost",
      `${slot.name} (Inner Way)`,
      innerWayScalar([slot], "generalDamageBoost"),
    )
    add(out, "chargeBonus", `${slot.name} (Inner Way)`, innerWayScalar([slot], "chargeBonus"))
    add(out, "allDamageBoost", `${slot.name} (Inner Way)`, innerWayScalar([slot], "allDamageBonus"))
  }

  const setOption = inputs.set ? ARMOR_SET_OPTIONS.find((o) => o.setKey === inputs.set) : undefined
  if (setOption) {
    const path = ARMOR_SET_STAT_TO_PATH[setOption.stat]
    if (path) add(out, path, `${setOption.name} (Set)`, setOption.value)
  }

  const setDef = inputs.set ? SET_BY_ID[inputs.set] : undefined
  const setFormula = setDef?.formulaBonus
  if (setDef && setFormula) {
    add(out, "critDamageBoost", `${setDef.name} (Set)`, setFormula.critDamage ?? 0)
    add(out, "affinityDamageBoost", `${setDef.name} (Set)`, setFormula.affinityDamage ?? 0)
    add(out, "directCritRate", `${setDef.name} (Set)`, setFormula.directCrit ?? 0)
    add(out, "generalDamageBoost", `${setDef.name} (Set)`, setFormula.generalDamageBoost ?? 0)
  }

  if (inputs.bowSet) {
    const path = BOW_SET_STAT_TO_PATH[inputs.bowSet]
    if (path) add(out, path, "Bow Set", BOW_SET_BONUS[inputs.bowSet])
  }

  return out
}

// Kept apart from `buildFormulaSources` because the Qi Break and healer
// amounts depend on the Qi phase active at a specific hit, not the build as
// a whole.
export function combatToggleFormulaSources(inputs: Inputs, qiPhase: string): SourceMap {
  const out: SourceMap = {}
  const combat = inputs.combatSettings
  if (combat?.revelryScript)
    add(out, "allDamageBoost", "Revelry Script", REVELRY_SCRIPT_DAMAGE_BOOST)
  if (combat?.qiBreak?.enabled && qiPhase === "exhausted") {
    add(out, "allDamageBoost", "Qi Break Boost", QI_BREAK_DAMAGE_BOOST)
  }
  if (combat?.healerBuff) {
    const amount =
      HEALER_BUFF_DAMAGE_BOOST + (qiPhase === "exhausted" ? HEALER_BUFF_EXHAUSTED_BONUS : 0)
    add(out, "allDamageBoost", "Healer Buff", amount)
  }
  return out
}

export function mergeFormulaSources(...maps: readonly SourceMap[]): SourceMap {
  const out: SourceMap = {}
  for (const map of maps) {
    for (const [path, sources] of Object.entries(map)) {
      out[path] = [...(out[path] ?? []), ...sources]
    }
  }
  return out
}
