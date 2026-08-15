import { useMemo } from "react"
import type { Inputs, MartialArtsTalent, ScalingSource, TalentStat } from "../../../../engine/types"
import { alwaysActiveClassBuffs, type ClassBuffRow } from "../../../../engine/buffs/catalog"
import { catalogBuffDefs } from "../../../../engine/buffs/data"
import { useI18n } from "../../../../i18n/i18nContext"
import { buildScalingSources } from "../../../../definitions/baseStats"
import { withDerivedStats, equippedPiecesFor } from "../../../../engine/derivedInputs"
import { innerWayDefinition, slotInnerWayId } from "../../../../definitions/innerWays/registry"
import { tierFromStacks } from "../../../../definitions/innerWays/innerWayDef"
import { STAT_DEF_BY_KEY, type StatKey } from "../../../../engine/statRegistry"
import { SET_BY_ID } from "../../../../definitions/sets/registry"
import styles from "./TalentsTab.module.scss"

interface Props {
  inputs: Inputs
}

const RATE_STATS = new Set<TalentStat>([
  "affinityRate",
  "critRate",
  "precisionRate",
  "critDamage",
  "affinityDamage",
  "attributeDamage",
  "physPenetration",
  "bellstrikePenetration",
  "stonesplitPenetration",
  "silkbindPenetration",
  "bamboocutPenetration",
])

const RATE_SOURCES = new Set<ScalingSource>([
  "phys.penetration",
  "bellstrike.penetration",
  "stonesplit.penetration",
  "silkbind.penetration",
  "bamboocut.penetration",
])

const PENETRATION_STATS = new Set<TalentStat>([
  "physPenetration",
  "bellstrikePenetration",
  "stonesplitPenetration",
  "silkbindPenetration",
  "bamboocutPenetration",
])

const STAT_LABEL: Record<TalentStat, string> = {
  minPhys: "Min Phys",
  maxPhys: "Max Phys",
  physPenetration: "Phys Penetration",
  minBellstrike: "Min Bellstrike",
  maxBellstrike: "Max Bellstrike",
  bellstrikePenetration: "Bellstrike Penetration",
  minStonesplit: "Min Stonesplit",
  maxStonesplit: "Max Stonesplit",
  stonesplitPenetration: "Stonesplit Penetration",
  minSilkbind: "Min Silkbind",
  maxSilkbind: "Max Silkbind",
  silkbindPenetration: "Silkbind Penetration",
  minBamboocut: "Min Bamboocut",
  maxBamboocut: "Max Bamboocut",
  bamboocutPenetration: "Bamboocut Penetration",
  precisionRate: "Precision Rate",
  critRate: "Crit Rate",
  affinityRate: "Affinity Rate",
  critDamage: "Crit Damage",
  affinityDamage: "Affinity Damage",
  attributeDamage: "Attribute Damage",
}

const SOURCE_LABEL: Record<ScalingSource, string> = {
  power: "Power",
  agility: "Agility",
  momentum: "Momentum",
  affinityRate: "Affinity Rate",
  "phys.min": "Min Phys",
  "phys.max": "Max Phys",
  "phys.penetration": "Phys Penetration",
  "bellstrike.min": "Min Bellstrike",
  "bellstrike.max": "Max Bellstrike",
  "bellstrike.penetration": "Bellstrike Penetration",
  "stonesplit.min": "Min Stonesplit",
  "stonesplit.max": "Max Stonesplit",
  "stonesplit.penetration": "Stonesplit Penetration",
  "silkbind.min": "Min Silkbind",
  "silkbind.max": "Max Silkbind",
  "silkbind.penetration": "Silkbind Penetration",
  "bamboocut.min": "Min Bamboocut",
  "bamboocut.max": "Max Bamboocut",
  "bamboocut.penetration": "Bamboocut Penetration",
}

function formatStatValue(stat: TalentStat, value: number): string {
  const sign = value >= 0 ? "+" : ""
  if (PENETRATION_STATS.has(stat)) return `${sign}${Math.round(value * 1000) / 10}`
  if (RATE_STATS.has(stat)) return `${sign}${(value * 100).toFixed(1)}%`
  return `${sign}${Math.round(value * 100) / 100}`
}

function talentCurrent(row: MartialArtsTalent, sources: Record<ScalingSource, number>): number {
  const attr = sources[row.scalesWith] ?? 0
  const scale = row.scaleMax > 0 ? Math.min(attr / row.scaleMax, 1) : 1
  return scale * row.maxBonus
}

type TalentEffectLine =
  | { kind: "talent"; skill: string; label?: string }
  | { kind: "talentFlatText"; skills: string[]; text: string }
  | { kind: "mechanic"; id: string; note?: string }
  | { kind: "static"; text: string; subNote?: string }

interface TalentCardConfig {
  name: string
  lines: TalentEffectLine[]
}

interface WeaponColumnConfig {
  weapon: string
  cards: TalentCardConfig[]
}

const BELLSTRIKE_COLUMNS: WeaponColumnConfig[] = [
  {
    weapon: "Strategic Sword",
    cards: [
      {
        name: "Affinity Rate UP",
        lines: [{ kind: "talent", skill: "Affinity Rate UP" }],
      },
      {
        name: "Bleed penetration Enhancement",
        lines: [
          {
            kind: "mechanic",
            id: "bellstrikeUmbraBleedPen",
            note: "Scales with Max Phys (full at 1500)",
          },
        ],
      },
      {
        name: "Bellstrike Attribute UP",
        lines: [
          {
            kind: "talentFlatText",
            skills: ["Sword Bellstrike Attack Min", "Sword Bellstrike Attack Max"],
            text: "+98 Min / +196 Max Bellstrike Attack (always)",
          },
          { kind: "talent", skill: "Bellstrike Penetration Scale" },
        ],
      },
      {
        name: "Attr. Attack DMG UP",
        lines: [
          {
            kind: "static",
            text: "Bellstrike Attack deals 50% bonus damage.",
            subNote:
              "Already applied in the damage formula (elevated attribute multiplier) — not a stat this tab contributes.",
          },
        ],
      },
    ],
  },
  {
    weapon: "Heavenquaker Spear",
    cards: [
      {
        name: "Physical Attack UP",
        lines: [{ kind: "talent", skill: "Physical Attack UP" }],
      },
      {
        name: "Damage Over Time",
        lines: [
          {
            kind: "mechanic",
            id: "bellstrikeUmbraBleedingDamage",
            note: "Affinity DMG 18% on 1500 Max Physical",
          },
        ],
      },
      {
        name: "Bellstrike Attribute UP",
        lines: [
          {
            kind: "talentFlatText",
            skills: ["Spear Bellstrike Attack Min", "Spear Bellstrike Attack Max"],
            text: "+98 Min / +196 Max Bellstrike Attack (always)",
          },
          { kind: "talent", skill: "Attribute Damage Scale", label: "Attribute Damage Boost" },
        ],
      },
    ],
  },
]

const BELLSTRIKE_SPLENDOR_COLUMNS: WeaponColumnConfig[] = [
  {
    weapon: "Nameless Sword",
    cards: [
      {
        name: "Qi Struggle Enhancement",
        lines: [{ kind: "mechanic", id: "qiStruggleEnhancement" }],
      },
      {
        name: "Physical Attack UP",
        lines: [{ kind: "talent", skill: "Physical Attack UP" }],
      },
      {
        name: "Sword Qi Affinity Enhancement",
        lines: [{ kind: "mechanic", id: "swordQiAffinityEnhancement" }],
      },
      {
        name: "Bellstrike Attribute UP",
        lines: [
          {
            kind: "talentFlatText",
            skills: ["Min Bellstrike Attack", "Max Bellstrike Attack"],
            text: "+98 Min / +196 Max Bellstrike Attack (always)",
          },
          { kind: "talent", skill: "Bellstrike Penetration Scale" },
        ],
      },
      {
        name: "Attr. Attack DMG UP",
        lines: [
          {
            kind: "static",
            text: "Bellstrike Attack deals 50% bonus damage.",
            subNote:
              "Already applied in the damage formula (elevated attribute multiplier) — not a stat this tab contributes.",
          },
        ],
      },
    ],
  },
  {
    weapon: "Nameless Spear",
    cards: [
      {
        name: "Max Endurance UP",
        lines: [{ kind: "talent", skill: "Max Endurance UP" }],
      },
      {
        name: "Affinity Rate UP",
        lines: [{ kind: "talent", skill: "Affinity Rate UP" }],
      },
      {
        name: "Affinity DMG UP",
        lines: [{ kind: "mechanic", id: "affinityDamageUpNameless" }],
      },
      {
        name: "Bellstrike Attribute UP",
        lines: [
          {
            kind: "talentFlatText",
            skills: ["Min Bellstrike Attack", "Max Bellstrike Attack"],
            text: "+98 Min / +196 Max Bellstrike Attack (always)",
          },
          { kind: "talent", skill: "Bellstrike Attribute UP" },
        ],
      },
      {
        name: "Attr. Attack DMG UP",
        lines: [
          {
            kind: "static",
            text: "Bellstrike Attack deals 50% bonus damage.",
            subNote:
              "Already applied in the damage formula (elevated attribute multiplier) — not a stat this tab contributes.",
          },
        ],
      },
    ],
  },
]

const CLASS_TALENT_COLUMNS: Record<string, WeaponColumnConfig[]> = {
  bellstrikeUmbra: BELLSTRIKE_COLUMNS,
  bellstrikeSplendor: BELLSTRIKE_SPLENDOR_COLUMNS,
}

export function TalentsTab({ inputs }: Props) {
  const { t } = useI18n()
  const talents = inputs.martialArtsTalents
  const classBuffs = alwaysActiveClassBuffs(inputs)

  const sources = useMemo(() => {
    const equipped = equippedPiecesFor(inputs)
    return buildScalingSources(withDerivedStats(inputs), equipped)
  }, [inputs])

  const talentsByName = useMemo(
    () => new Map(talents.map((row) => [row.name, row] as const)),
    [talents],
  )
  const classBuffsById = useMemo(
    () => new Map(classBuffs.map((buff) => [buff.id, buff] as const)),
    [classBuffs],
  )

  type InnerWayLine = { effect: string; subNote?: string }

  const activeInnerWays = useMemo(() => {
    const formatStat = (key: string, val: number): string => {
      const statDef = STAT_DEF_BY_KEY[key as StatKey]
      const label = statDef?.label ?? key
      const formatted =
        statDef?.unit === "flat" ? `${Math.round(val)}` : `${(val * 100).toFixed(1)}%`
      return `${label} +${formatted}`
    }

    const formatEffect = (statKey: string, amount: number): string => {
      const statDef = STAT_DEF_BY_KEY[statKey]
      const label = statDef?.label ?? statKey
      const sign = amount >= 0 ? "+" : ""
      const formatted =
        statDef?.unit === "flat"
          ? `${sign}${Math.round(amount)}`
          : `${sign}${(amount * 100).toFixed(1)}%`
      return `${label} ${formatted}`
    }

    return inputs.mindMethods
      .map((slot) => {
        const id = slotInnerWayId(slot)
        const def = id ? innerWayDefinition(id) : undefined
        if (!def) return null

        const tier = tierFromStacks(slot.stacks)
        const lines: InnerWayLine[] = []

        // Panel stats (always active, no tier gate)
        if (def.panelStats) {
          for (const [key, val] of Object.entries(def.panelStats)) {
            if (!val) continue
            lines.push({ effect: formatStat(key, val), subNote: "Always active" })
          }
        }

        // Tier-gated panel stats
        if (def.tiers) {
          for (const [tierStr, tierDef] of Object.entries(def.tiers)) {
            if (!tierDef.panelStats) continue
            const reqTier = Number(tierStr)
            const active = tier >= reqTier
            for (const [key, val] of Object.entries(tierDef.panelStats)) {
              if (!val) continue
              lines.push({
                effect: formatStat(key, val),
                subNote: active ? `From tier ${reqTier}` : `Requires tier ${reqTier} (inactive)`,
              })
            }
          }
        }

        // Mechanics
        if (def.mechanics) {
          for (const { mechanic } of def.mechanics) {
            const row = mechanic.catalogRow
            if (!row) continue
            const parts = row.effects().map((e) => formatEffect(e.statKey, e.amount))
            lines.push({
              effect: parts.length > 0 ? parts.join(", ") : "(dynamic)",
              subNote: `Mechanic: ${row.name}`,
            })
          }
        }

        // Buff defs & gate buffs
        const allBuffDefs = [...(def.buffDefs ?? []), ...(def.gateBuffs ?? [])]
        for (const buff of allBuffDefs) {
          let effect: string
          if ("summary" in buff && buff.summary) {
            // BuffModule with a summary string (required when effects is a function)
            effect = buff.summary
          } else if (Array.isArray(buff.effects)) {
            // Static effects array — BuffModule or InnerWayGateBuff
            const parts = (buff.effects as { statKey?: string; amount?: number }[])
              .filter((e) => e.statKey)
              .map((e) => formatEffect(e.statKey ?? "", e.amount ?? 0))
            effect = parts.join(", ") || "(dynamic)"
          } else {
            effect = "(dynamic)"
          }
          const requires = "requires" in buff ? buff.requires : undefined
          const subNote = requires?.minTier
            ? `${buff.name} · Requires tier ${requires.minTier}+`
            : buff.name
          lines.push({ effect, subNote })
        }

        // Scalars
        if (!def.scalars?.minTier || tier >= def.scalars.minTier) {
          const s = def.scalars
          if (s?.allDamageBonus)
            lines.push({ effect: `All Damage +${(s.allDamageBonus * 100).toFixed(1)}%` })
          if (s?.generalDamageBoost)
            lines.push({ effect: `General Damage +${(s.generalDamageBoost * 100).toFixed(1)}%` })
          if (s?.chargeBonus)
            lines.push({ effect: `Charge Bonus +${(s.chargeBonus * 100).toFixed(1)}%` })
          if (s?.dotDamageBoost)
            lines.push({ effect: `DoT Damage +${(s.dotDamageBoost * 100).toFixed(1)}%` })
          if (s?.targetDefenseMultiplier !== undefined)
            lines.push({ effect: `Target Defense x${s.targetDefenseMultiplier.toFixed(2)}` })
        }

        return { def, tier, lines }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [inputs.mindMethods])

  const setBuff = useMemo(() => {
    if (!inputs.set) return null
    const def = SET_BY_ID[inputs.set]
    if (!def) return null

    const lines: { effect: string; subNote?: string }[] = []

    // 2-piece panel bonus — panelBonus.stat is NOT a StatKey (uses different names)
    if (def.panelBonus) {
      const PANEL_STAT: Record<string, { label: string; unit: "fraction" | "flat" }> = {
        affinityRate: { label: "Affinity Rate", unit: "fraction" },
        critRate: { label: "Crit Rate", unit: "fraction" },
        precisionRate: { label: "Precision Rate", unit: "fraction" },
        maxPhys: { label: "Max Phys", unit: "flat" },
        minPhys: { label: "Min Phys", unit: "flat" },
      }
      const mapping = PANEL_STAT[def.panelBonus.stat]
      const label = mapping?.label ?? def.panelBonus.stat
      const formatted =
        mapping?.unit === "flat"
          ? `+${Math.round(def.panelBonus.value)}`
          : `+${(def.panelBonus.value * 100).toFixed(1)}%`
      lines.push({ effect: `${label} ${formatted}`, subNote: "2-piece bonus" })
    }

    // 4-piece formula bonuses (filter out zeros — some sets have placeholder 0 values)
    if (def.formulaBonus) {
      const FORMULA_LABELS: Record<string, string> = {
        physBoost: "Physical Damage Boost",
        affinityDamage: "Affinity Damage",
        critDamage: "Crit Damage",
        directCrit: "Direct Crit Rate",
        lowQiDirectAffinityRate: "Direct Affinity Rate (Low Qi)",
        lowQiBambooDamage: "Bamboocut Damage (Low Qi)",
        generalDamageBoost: "General Damage Boost",
      }
      for (const [key, val] of Object.entries(def.formulaBonus)) {
        if (!val) continue
        const label = FORMULA_LABELS[key] ?? key
        lines.push({ effect: `${label} +${(val * 100).toFixed(1)}%`, subNote: "4-piece bonus" })
      }
    }

    // 4-piece mechanics
    if (def.mechanics) {
      for (const { mechanic } of def.mechanics) {
        const row = mechanic.catalogRow
        if (row) {
          const parts = row.effects().map((e) => {
            const statDef = STAT_DEF_BY_KEY[e.statKey]
            const label = statDef?.label ?? e.statKey
            const sign = e.amount >= 0 ? "+" : ""
            const formatted =
              statDef?.unit === "flat"
                ? `${sign}${Math.round(e.amount)}`
                : `${sign}${(e.amount * 100).toFixed(1)}%`
            return `${label} ${formatted}`
          })
          lines.push({
            effect: parts.length > 0 ? parts.join(", ") : "(dynamic)",
            subNote: `4-piece · ${row.name}`,
          })
        } else {
          // Mechanic has no catalogRow (e.g. Hawking ramp) — show generic note
          lines.push({
            effect: "(dynamic — see rotation timeline)",
            subNote: `4-piece · mechanic`,
          })
        }
      }
    }

    // 4-piece set-gated buffs (like Jadeware and Shattered Ridge deflect)
    if (def.siteKey) {
      const setGatedBuffs = catalogBuffDefs(inputs.classId).filter(
        (b) => b.requires?.set === def.siteKey,
      )
      for (const buff of setGatedBuffs) {
        let effect: string
        if ("summary" in buff && buff.summary) {
          effect = buff.summary
        } else if (Array.isArray(buff.effects)) {
          const parts = (buff.effects as { statKey?: string; amount?: number }[])
            .filter((e) => e.statKey)
            .map((e) => {
              const statDef = STAT_DEF_BY_KEY[e.statKey as StatKey]
              const label = statDef?.label ?? e.statKey
              const sign = (e.amount ?? 0) >= 0 ? "+" : ""
              const formatted =
                statDef?.unit === "flat"
                  ? `${sign}${Math.round(e.amount ?? 0)}`
                  : `${sign}${((e.amount ?? 0) * 100).toFixed(1)}%`
              return `${label} ${formatted}`
            })
          effect = parts.join(", ") || "(dynamic)"
        } else {
          effect = "(dynamic)"
        }
        lines.push({ effect, subNote: `4-piece · ${buff.name}` })
      }
    }

    return { def, lines }
  }, [inputs.set, inputs.classId])

  const columns = CLASS_TALENT_COLUMNS[inputs.classId]

  function renderTalentLine(line: Extract<TalentEffectLine, { kind: "talent" }>) {
    const row = talentsByName.get(line.skill)
    if (!row) return null
    const current = talentCurrent(row, sources)
    const capDisplay = RATE_SOURCES.has(row.scalesWith) ? row.scaleMax * 100 : row.scaleMax
    return (
      <div className={styles.classBuffLine} key={`talent:${line.skill}`}>
        <div className={styles.classBuffHead}>
          {line.label && <span className={styles.classBuffName}>{t(line.label)}</span>}
          <span className={styles.classBuffEffect}>
            {formatStatValue(row.stat, row.maxBonus)} {t(STAT_LABEL[row.stat])}
          </span>
          <span className={styles.classBuffCurrent}>
            {t("Current")}: {formatStatValue(row.stat, current)}
          </span>
        </div>
        <div className={styles.classBuffAffects}>
          {t("Scales With")}: {t(SOURCE_LABEL[row.scalesWith])}
          {row.scaleMax > 0 ? ` (${t("Cap")}: ${capDisplay})` : ""}
        </div>
      </div>
    )
  }

  function renderFlatTextLine(line: Extract<TalentEffectLine, { kind: "talentFlatText" }>) {
    const present = line.skills.some((skillName) => talentsByName.has(skillName))
    if (!present) return null
    return (
      <div className={styles.classBuffLine} key={`flat:${line.skills.join("+")}`}>
        <div className={styles.classBuffHead}>
          <span className={styles.classBuffEffect}>{t(line.text)}</span>
        </div>
      </div>
    )
  }

  function renderMechanicLine(
    line: Extract<TalentEffectLine, { kind: "mechanic" }>,
    buff: ClassBuffRow,
  ) {
    return (
      <div className={styles.classBuffLine} key={`mechanic:${line.id}`}>
        <div className={styles.classBuffHead}>
          <span className={styles.classBuffEffect}>{buff.effect}</span>
        </div>
        <div className={styles.classBuffAffects}>
          {t("Affects")}: {buff.affects}
          {line.note ? ` · ${t(line.note)}` : ""}
        </div>
      </div>
    )
  }

  function renderStaticLine(line: Extract<TalentEffectLine, { kind: "static" }>) {
    return (
      <div className={styles.classBuffLine} key={`static:${line.text}`}>
        <div className={styles.classBuffHead}>
          <span className={styles.classBuffEffect}>{t(line.text)}</span>
        </div>
        {line.subNote && <div className={styles.classBuffAffects}>{t(line.subNote)}</div>}
      </div>
    )
  }

  function renderLine(line: TalentEffectLine) {
    switch (line.kind) {
      case "talent":
        return renderTalentLine(line)
      case "talentFlatText":
        return renderFlatTextLine(line)
      case "mechanic": {
        const buff = classBuffsById.get(line.id)
        return buff ? renderMechanicLine(line, buff) : null
      }
      case "static":
        return renderStaticLine(line)
    }
  }

  function renderCard(card: TalentCardConfig) {
    const lines = card.lines.map(renderLine).filter((line) => line !== null)
    if (lines.length === 0) return null
    return (
      <div className={styles.classBuffRow} key={card.name}>
        <div className={styles.classBuffHead}>
          <span className={styles.classBuffName}>{t(card.name)}</span>
        </div>
        {lines}
      </div>
    )
  }

  function renderColumn(col: WeaponColumnConfig) {
    return (
      <div className={styles.classBuffsColumn} key={col.weapon}>
        <div className={styles.classBuffsColumnHead}>{t(col.weapon)}</div>
        <div className={styles.classBuffsList}>{col.cards.map(renderCard)}</div>
      </div>
    )
  }

  return (
    <div>
      <div>
        {setBuff && (
          <div
            className={styles.classBuffs}
            style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}
          >
            <div className="toolbar">
              <span className="toolbar-label">{t("Set Buff")}</span>
              <span className={styles.classBuffsNote}>{t(setBuff.def.name)}</span>
            </div>
            <div className={styles.classBuffsList}>
              <div className={styles.classBuffRow}>
                <div className={styles.classBuffHead}>
                  <span className={styles.classBuffName}>{t(setBuff.def.name)}</span>
                </div>
                {setBuff.lines.map((line, i) => (
                  <div key={i} className={styles.classBuffLine}>
                    <div className={styles.classBuffHead}>
                      <span className={styles.classBuffEffect}>{line.effect}</span>
                    </div>
                    {line.subNote && <div className={styles.classBuffAffects}>{line.subNote}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={setBuff ? styles.classBuffs : undefined}>
          <div className="toolbar">
            <span className="toolbar-label">{t("Stat Buffs")}</span>
            <span className={styles.classBuffsNote}>{t("Always on (class-tied)")}</span>
          </div>

          {columns ? (
            <div
              className={styles.classBuffsColumns}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              {columns.map(renderColumn)}
            </div>
          ) : (
            <>
              {talents.length === 0 && <div>{t("No stat buffs for this class yet.")}</div>}

              {talents.length > 0 && (
                <div className={styles.classBuffsList}>
                  {talents.map((row) => {
                    const current = talentCurrent(row, sources)
                    const capDisplay = RATE_SOURCES.has(row.scalesWith)
                      ? row.scaleMax * 100
                      : row.scaleMax
                    return (
                      <div key={row.id} className={styles.classBuffRow}>
                        <div className={styles.classBuffHead}>
                          <span className={styles.classBuffName}>{row.name}</span>
                          <span className={styles.classBuffEffect}>
                            {formatStatValue(row.stat, row.maxBonus)} {STAT_LABEL[row.stat]}
                          </span>
                          <span className={styles.classBuffCurrent}>
                            {t("Current")}: {formatStatValue(row.stat, current)}
                          </span>
                        </div>
                        <div className={styles.classBuffAffects}>
                          {t("Scales With")}: {SOURCE_LABEL[row.scalesWith]}
                          {row.scaleMax > 0 ? ` (${t("Cap")}: ${capDisplay})` : ""}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {classBuffs.length > 0 && (
          <div className={styles.classBuffs}>
            <div className="toolbar">
              <span className="toolbar-label">{t("Class Buffs")}</span>
              <span className={styles.classBuffsNote}>{t("Always on (class-tied)")}</span>
            </div>
            <div className={styles.classBuffsList}>
              {classBuffs.map((buff) => (
                <div key={buff.id} className={styles.classBuffRow}>
                  <div className={styles.classBuffHead}>
                    <span className={styles.classBuffName}>{t(buff.name)}</span>
                    <span className={styles.classBuffEffect}>{buff.effect}</span>
                  </div>
                  <div className={styles.classBuffAffects}>
                    {t("Affects")}: {buff.affects}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeInnerWays.length > 0 && (
          <div className={styles.classBuffs}>
            <div className="toolbar">
              <span className="toolbar-label">{t("Inner Ways Buffs")}</span>
              <span className={styles.classBuffsNote}>{t("Always on (slotted)")}</span>
            </div>
            <div
              className={styles.classBuffsColumns}
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            >
              {activeInnerWays.map(({ def, tier, lines }) => (
                <div key={def.id} className={styles.classBuffRow}>
                  <div className={styles.classBuffHead}>
                    <span className={styles.classBuffName}>{t(def.name)}</span>
                    <span className={styles.classBuffCurrent}>
                      {t("Tier")} {tier}
                    </span>
                  </div>
                  {lines.map((line, i) => (
                    <div key={i} className={styles.classBuffLine}>
                      <div className={styles.classBuffHead}>
                        <span className={styles.classBuffEffect}>{line.effect}</span>
                      </div>
                      {line.subNote && (
                        <div className={styles.classBuffAffects}>{line.subNote}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
