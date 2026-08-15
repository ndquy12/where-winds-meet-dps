import { useMemo, useState } from "react"
import type { CastHitFormulaSnapshot, Inputs, Result, RotationCast } from "../../../../engine/types"
import { hiddenTimelineBuffIds } from "../../../../engine/buffs/catalog"
import { useI18n } from "../../../../i18n/i18nContext"
import { castBuffDisplayOrder, visibleCastBuffs } from "../buffChips"
import { CastBuffTagChip } from "../cast-buff-tag-chip/CastBuffTagChip"
import { castFormulaRows, groupRowsByStep, type FormulaStepGroup } from "../castFormulaRows"
import { damageCompositionRows } from "../damageCompositionRows"
import {
  buffFormulaSources,
  buildFormulaSources,
  classBuffFormulaSources,
  combatToggleFormulaSources,
  mergeFormulaSources,
} from "../formulaSources"
import styles from "./RotationFormulaTimelinePanel.module.scss"

const QI_PHASE_LABELS: Readonly<Record<string, string>> = {
  normal: "Normal",
  below30: "Below 30% Qi",
  exhausted: "Qi Exhausted",
}

interface HitItem {
  key: string
  index: string
  hitNumber: number | null
  cast: RotationCast
  hit: CastHitFormulaSnapshot
  stepGroups: FormulaStepGroup[]
}

export function RotationFormulaTimelinePanel({
  result,
  inputs,
}: {
  result: Result
  inputs: Inputs
}) {
  const { t } = useI18n()
  const [openHits, setOpenHits] = useState<ReadonlySet<string>>(new Set())

  function toggleHit(key: string): void {
    setOpenHits((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const hiddenBuffIds = useMemo(() => hiddenTimelineBuffIds(inputs.classId), [inputs.classId])
  const buffOrder = useMemo(
    () => castBuffDisplayOrder(result.casts, hiddenBuffIds),
    [result.casts, hiddenBuffIds],
  )
  const buildSources = useMemo(() => buildFormulaSources(inputs), [inputs])

  const hitItems = useMemo(() => {
    const items: HitItem[] = []
    let previousHit: CastHitFormulaSnapshot | undefined
    for (const cast of result.casts ?? []) {
      const hits = cast.hits ?? []
      hits.forEach((hit, i) => {
        const sourcesByPath = mergeFormulaSources(
          buffFormulaSources(cast.buffs),
          buildSources,
          combatToggleFormulaSources(inputs, hit.qiPhase),
          classBuffFormulaSources(hit),
        )
        const stepGroups = groupRowsByStep(castFormulaRows(hit, previousHit, sourcesByPath))
        previousHit = hit
        items.push({
          key: `${cast.index}:${i}`,
          index: `${cast.index}`,
          hitNumber: hits.length > 1 ? i + 1 : null,
          cast,
          hit,
          stepGroups,
        })
      })
    }
    return items
  }, [result.casts, buildSources, inputs])

  if (hitItems.length === 0) {
    return <div className="empty-tab">{t("(none)")}</div>
  }

  return (
    <div className={styles.formulaTimelinePanel}>
      {hitItems.map((item) => {
        const isOpen = openHits.has(item.key)
        const shownBuffs = visibleCastBuffs(item.cast.buffs, hiddenBuffIds, buffOrder)
        return (
          <div key={item.key} className={styles.hitItem}>
            <button
              type="button"
              className={styles.hitItemHeader}
              onClick={() => toggleHit(item.key)}
            >
              <span className={styles.idx}>{item.index}</span>
              <span className={styles.time}>{Math.max(0, item.hit.atTimeSec).toFixed(2)}s</span>
              <span className={styles.skillName}>
                {t(item.hit.skillName)}
                {item.hitNumber != null && (
                  <span className={styles.hitNumber}>
                    {" "}
                    ({t("Hit")} {item.hitNumber})
                  </span>
                )}
                {item.cast.prePull && <span className={styles.prepull}>{t("Pre-pull")}</span>}
              </span>
              <span className={styles.qiPhase}>
                {t(QI_PHASE_LABELS[item.hit.qiPhase] ?? item.hit.qiPhase)}
              </span>
              <span className={styles.damage}>
                {Math.round(item.hit.damage).toLocaleString()}
                <span className={styles.damageLabel}>{t("Direct damage")}</span>
              </span>
              <span className={styles.buffsCell}>
                {shownBuffs.length === 0 ? (
                  <span className="muted">—</span>
                ) : (
                  shownBuffs.map((tag) => <CastBuffTagChip key={tag.id} tag={tag} />)
                )}
              </span>
              <span className={styles.disclosure}>{isOpen ? "▾" : "▸"}</span>
            </button>
            {isOpen && (
              <>
                {item.stepGroups.map((group, gi) => (
                  <div key={group.step} className={styles.stepBlock}>
                    <span className={styles.sectionLabel}>
                      {gi + 1}. {t(group.step)}
                    </span>
                    <div className={styles.formulaTable}>
                      {group.rows.map((row) => (
                        <div
                          key={row.key}
                          className={styles.formulaRow + (row.changed ? ` ${styles.changed}` : "")}
                        >
                          <span className={styles.formulaLabel}>{t(row.label)}</span>
                          <span className={styles.formulaValue}>{row.display}</span>
                          <span className={styles.formulaSources}>
                            {row.sources.map((source, si) => (
                              <span key={si} className={styles.formulaSource}>
                                {t(source.name)} {source.display}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className={styles.stepBlock}>
                  <span className={styles.sectionLabel}>
                    {item.stepGroups.length + 1}. {t("Result")}
                  </span>
                  <div className={styles.compositionTable}>
                    {damageCompositionRows(item.hit.outcomes).map((row) => (
                      <div
                        key={row.key}
                        className={
                          styles.compositionRow + (row.isZero ? ` ${styles.compositionZero}` : "")
                        }
                      >
                        <div className={styles.compositionMain}>
                          <span className={styles.compositionLabel}>{t(row.label)}</span>
                          <span className={styles.compositionChance}>{row.chanceDisplay}</span>
                          <span className={styles.compositionArrow}>→</span>
                          <span className={styles.compositionDamage}>{row.damageDisplay}</span>
                        </div>
                        <div className={styles.compositionExplain}>
                          {row.terms.map((term, ti) => (
                            <div key={ti} className={styles.equationTerm}>
                              <span className={styles.equationTermLabel}>{t(term.label)}:</span>
                              <span className={styles.equationFactors}>
                                {term.factors.map((factor, fi) => (
                                  <span key={fi} className={styles.equationFactor}>
                                    {fi > 0 && <span className={styles.equationOperator}> × </span>}
                                    {t(factor.label)} {factor.display}
                                  </span>
                                ))}
                              </span>
                              <span className={styles.equationResult}>= {term.resultDisplay}</span>
                            </div>
                          ))}
                          {row.chanceDependsOn.length > 0 && (
                            <span className={styles.compositionDependsOn}>
                              {t("chance from")} {row.chanceDependsOn.map((d) => t(d)).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
