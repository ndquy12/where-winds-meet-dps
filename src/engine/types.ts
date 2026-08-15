import type { GearWordId } from "../data/stats/statLines"
import type { Rotation } from "./rotation"

export type { GearWordId } from "../data/stats/statLines"
import type { Skill } from "./skill"
import type { Buff, BuffStatEffect } from "./buff"
import type { Debuff } from "./debuff"
import type { DamageOutcomeBreakdown } from "./formula"
import type { DamageEffectSource } from "./buffs/buffEngine"

export const ATTRIBUTE_KEYS = ["Bellstrike", "Stonesplit", "Silkbind", "Bamboocut"] as const

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number]

export const WEAPON_NAMES = [
  "Sword",
  "Spear",
  "Fan",
  "Umbrella",
  "Modao",
  "Twin Blades",
  "Rope Dart",
  "Hengdao",
] as const

export type WeaponName = (typeof WEAPON_NAMES)[number]

export function isWeaponName(value: string): value is WeaponName {
  return (WEAPON_NAMES as readonly string[]).includes(value)
}

export type BowSet = "affinity" | "crit" | "precision" | null

export type Arsenal = "general" | "bellstrike" | "stonesplit" | "silkbind" | "bamboocut"

export interface AttackBlock {
  min: number
  max: number
  penetration: number
}

export interface QiBreakSettings {
  enabled: boolean
  startSec: number
  durationSec: number
}

// Deliberately NOT settings here, because each already has exactly one home and
// a second would double-count it: Fire Oil is the Divinecraft fire choice
// (`Inputs.tianGongElement`), Vulnerability is the tank spear debuff
// (`Inputs.shareEasyHurt`), and Formbend has no modeled effect at all.
export interface CombatSettings {
  qiBreak: QiBreakSettings
  dragonsBreath: boolean
  healerBuff: boolean
  breakExtension: boolean
  revelryScript: boolean
  dragonHeadFullStacks: boolean
  dragonHeadLowHpMaxBonus: boolean
}

export function defaultCombatSettings(): CombatSettings {
  return {
    qiBreak: { enabled: true, startSec: 25, durationSec: 10 },
    dragonsBreath: false,
    healerBuff: false,
    breakExtension: false,
    revelryScript: false,
    dragonHeadFullStacks: false,
    dragonHeadLowHpMaxBonus: false,
  }
}

// Numbers are stored as fractions where the panel shows percentages
// (29.2 % → 0.292).
export interface Inputs {
  classId: string
  breakthrough: number

  phys: AttackBlock
  bellstrike: AttackBlock
  stonesplit: AttackBlock
  silkbind: AttackBlock
  bamboocut: AttackBlock

  precision: number
  critRate: number
  affinityRate: number
  directCritRate: number
  directAffinityRate: number
  physBoost: number
  critDamageBoost: number
  affinityDamageBoost: number
  attributeDamageBoost: number
  sustainDamageBoost: number
  // Injected at the engine boundary, not persisted.
  allDamageBoost?: number

  allMartialBoost: number
  swordBoost: number
  spearBoost: number
  fanBoost: number
  umbrellaBoost: number
  modaoBoost: number
  dualKnivesBoost: number
  ropeDartBoost: number
  hengDaoBoost: number

  bossBoost: number
  singleMysticBoost: number
  areaMysticBoost: number

  classSpecificAttunement: Record<string, number>

  mindMethods: [MindMethodSlot, MindMethodSlot, MindMethodSlot, MindMethodSlot]

  food: boolean
  tianGongElement: "fire" | "poison" | null
  // A `SET_ID` value, never the display name.
  set: string | null
  shareDebuff5HenZhi: boolean
  shareEasyHurt: boolean

  bowSet: BowSet
  arsenal: Arsenal
  dummyMode: boolean

  rotation: string | null

  selectedBuiltinRotationId?: string | null

  // Injected at the engine boundary, not persisted on the profile blob — the
  // engine never reads storage, so locked fixtures stay byte-exact.
  activeCustomRotation?: Rotation | null
  customSkills?: Skill[] | null
  customBuffs?: Buff[] | null
  customDebuffs?: Debuff[] | null

  buffParams?: Record<string, unknown> | null

  combatSettings?: CombatSettings

  inventory: GearPiece[]
  equipped: EquippedSlots

  martialArtsTalents: MartialArtsTalent[]

  oddities: OddityRegions
}

export type TalentStat =
  | "minPhys"
  | "maxPhys"
  | "physPenetration"
  | "minBellstrike"
  | "maxBellstrike"
  | "bellstrikePenetration"
  | "minStonesplit"
  | "maxStonesplit"
  | "stonesplitPenetration"
  | "minSilkbind"
  | "maxSilkbind"
  | "silkbindPenetration"
  | "minBamboocut"
  | "maxBamboocut"
  | "bamboocutPenetration"
  | "precisionRate"
  | "critRate"
  | "affinityRate"
  | "critDamage"
  | "affinityDamage"
  | "attributeDamage"

export type AttributeName = "power" | "agility" | "momentum"

export type ScalingSource =
  | AttributeName
  | "phys.min"
  | "phys.max"
  | "phys.penetration"
  | "bellstrike.min"
  | "bellstrike.max"
  | "bellstrike.penetration"
  | "stonesplit.min"
  | "stonesplit.max"
  | "stonesplit.penetration"
  | "silkbind.min"
  | "silkbind.max"
  | "silkbind.penetration"
  | "bamboocut.min"
  | "bamboocut.max"
  | "bamboocut.penetration"
  | "affinityRate"

export interface MartialArtsTalent {
  id: string
  name: string
  enabled: boolean
  stat: TalentStat
  maxBonus: number
  scalesWith: ScalingSource
  scaleMax: number
}

export interface OddityNode {
  id: number
  stat: TalentStat
  value: number
  enabled: boolean
  icon?: string
}

export type OddityRegions = Record<string, OddityNode[]>

export type GearSlot =
  "leftWeapon" | "rightWeapon" | "disc" | "pendant" | "helm" | "armor" | "greaves" | "bracer"

export const GEAR_SLOTS: readonly GearSlot[] = [
  "leftWeapon",
  "rightWeapon",
  "disc",
  "pendant",
  "helm",
  "armor",
  "greaves",
  "bracer",
]

export const WEAPON_SLOTS: readonly GearSlot[] = ["leftWeapon", "rightWeapon", "disc", "pendant"]

export function isWeaponSlot(slot: GearSlot): boolean {
  return WEAPON_SLOTS.includes(slot)
}

export type GearLevel = 86 | 91 | 96
export type GearRarity = "legendary" | "epic"

export interface GearWordEntry {
  word: GearWordId | ""
  value: number
  retuned: boolean
}

export interface GearPiece {
  id: string
  slot: GearSlot
  level: GearLevel
  rarity: GearRarity
  minPhys: number
  maxPhys: number
  hp: number
  physDef: number
  words: [GearWordEntry, GearWordEntry, GearWordEntry, GearWordEntry, GearWordEntry]
  attunement: string
  attunementValue: number
  relayed: boolean
  isNew?: boolean
}

export type EquippedSlots = Record<GearSlot, string | null>

export const EMPTY_EQUIPPED: EquippedSlots = {
  leftWeapon: null,
  rightWeapon: null,
  disc: null,
  pendant: null,
  helm: null,
  armor: null,
  greaves: null,
  bracer: null,
}

export function emptyGearWord(): GearWordEntry {
  return { word: "", value: 0, retuned: false }
}

export function emptyGearWords(): GearPiece["words"] {
  return [emptyGearWord(), emptyGearWord(), emptyGearWord(), emptyGearWord(), emptyGearWord()]
}

export interface MindMethodSlot {
  // The stable identity. `name` is the display string and is kept only so an
  // older saved profile still resolves; `hydrateInputs` fills `id` from it.
  id?: string
  name: string
  stacks: string
}

export interface StoredProfile {
  id: string
  name: string
  inputs: Inputs
}

export interface Result {
  dps: number
  totalDamage: number
  rotationDuration: number
  graduationRate: number | null
  perSkill: SkillTickResult[]
  ranking: ItemRankingRow[]
  warnings: string[]
  timeline?: TimelineEvent[]
  buffWindows?: BuffWindow[]
  qiBreakWindow?: { startSec: number; endSec: number } | null
  casts?: RotationCast[]
}

export interface CastBuffTag {
  id: string
  name: string
  stacks: number
  maxStacks: number
  effects: BuffStatEffect[]
  dotIntervalSec?: number
  requires?: string
  description?: string
  remainingSec?: number
  // True for a tag sourced from BuffEngine (a class-buff-system module) rather
  // than the StatusLedger. Its `effects` are a display-only re-evaluation for
  // the chip tooltip, not the per-hit amount `classBuffSources` reports —
  // formula-source attribution must read the latter and skip these, or a
  // class buff's contribution is double-counted in the shown source list.
  engineSourced?: boolean
}

export interface RotationCast {
  index: number
  stepId: string
  stepIndex: number
  skillName: string
  timeSec: number
  inWindow: boolean
  prePull: boolean
  buffs: CastBuffTag[]
  // Direct hits attributed to this cast and any sub-skill it triggered.
  // Excludes DoT ticks and mechanic extra-events, which the engine attributes
  // to their own debuff/mechanic row, not the applying cast.
  expectedDamage?: number
  hitCount?: number
  // One entry per hit event attributed to this cast (its own hits, plus any
  // sub-skill it triggered), in the order they resolved — a multi-hit skill's
  // formula can move mid-cast, so a single per-cast snapshot would silently
  // show hit 1's numbers for every hit.
  hits?: CastHitFormulaSnapshot[]
}

// The effective (yellow, post-resistance) damage-kernel inputs in force when
// one hit resolved. Never the kernel's own single-letter cells
// (docs/CALCULATION.md § "The formula chain" — those are opaque by design),
// always these named fields.
export interface CastFormulaSnapshot {
  precisionRate: number
  critRate: number
  affinityRate: number
  directCritRate: number
  directAffinityRate: number
  critDamageBoost: number
  affinityDamageBoost: number
  physDamageBoost: number
  attributeDamageBoost: number
  sustainDamageBoost: number
  generalDamageBoost: number
  // The engine-boundary channel — revelry script, Qi Break, healer buff, and
  // an inner way's `allDamageBonus` scalar — kept apart from
  // `generalDamageBoost` because the kernel sums the two as separate terms.
  allDamageBoost: number
  chargeBonus: number
  effectiveMinPhysAttack: number
  effectiveMaxPhysAttack: number
  physPenetration: number
  effectiveDefense: number
  primaryAttribute: string
  primaryAttributeMin: number
  primaryAttributeMax: number
  primaryAttributePenetration: number
}

export interface CastHitFormulaSnapshot extends CastFormulaSnapshot {
  skillName: string
  atTimeSec: number
  qiPhase: string
  inWindow: boolean
  damage: number
  outcomes: DamageOutcomeBreakdown
  // Class-buff-system modules (`defineClassBuff`, an inner way's own
  // `buffDefs`) active on this hit — the one contributor category with no
  // other UI representation: not `RotationCast.buffs` (that's the editor
  // system's ledger-backed Buff/Debuff), not a talent/oddity/set/inner-way
  // panel stat, and not a mechanic's own display chip.
  classBuffSources: DamageEffectSource[]
}

export interface SkillTickResult {
  name: string
  breakdownName: string
  type: "weapon" | "mindMethod" | "mystic" | "sustain" | "settlement" | "weaponMystic" | string
  count: number
  expectedDamage: number
  percentOfTotal: number
  castCount?: number
}

export interface TimelineEvent {
  frame: number
  timeSec: number
  skillName: string
  type: string
  kind: "hit" | "dot"
  damage: number
  inWindow: boolean
}

export interface BuffWindow {
  id: string
  name: string
  startSec: number
  endSec: number
}

export interface ItemRankingRow {
  statLineId: string
  label: string
  source: "tunement" | "attunement"
  amount: number
  unit: "raw" | "percent"
  expectedDps: number
  dpsDelta: number
  liftPercent: number
  leadVsMin: number | string
}
