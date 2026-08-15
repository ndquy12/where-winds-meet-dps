import type { CastBuffTag } from "../../../../engine/types"
import type { BuffStatEffect } from "../../../../engine/buff"
import { STAT_DEF_BY_KEY } from "../../../../engine/statRegistry"
import { useI18n } from "../../../../i18n/i18nContext"
import { buffChipHue } from "../buffChips"
import styles from "./CastBuffTagChip.module.scss"

function effectsSummary(effects: BuffStatEffect[], t: (text: string) => string): string {
  return effects
    .filter((effect) => effect.amount !== 0)
    .map((effect) => {
      const def = STAT_DEF_BY_KEY[effect.statKey]
      const label = def ? t(def.label) : effect.statKey
      const sign = effect.amount >= 0 ? "+" : ""
      const value =
        def?.unit === "fraction"
          ? `${sign}${(effect.amount * 100).toFixed(0)}%`
          : `${sign}${effect.amount}`
      return `${label} ${value}`
    })
    .join(", ")
}

export function CastBuffTagChip({ tag }: { tag: CastBuffTag }) {
  const { t } = useI18n()
  const label = tag.maxStacks > 1 ? `${t(tag.name)} ${tag.stacks}/${tag.maxStacks}` : t(tag.name)
  const eff = effectsSummary(tag.effects, t)
  const style = { "--buff-hue": buffChipHue(tag.name, tag.id) } as React.CSSProperties
  return (
    <span className={styles.castBuffTag} style={style}>
      {label}
      <span className={styles.castBuffTooltip}>
        <div>{t(tag.name)}</div>
        {tag.maxStacks > 1 && (
          <div>
            {t("Stacks")}: {tag.stacks} / {tag.maxStacks}
          </div>
        )}
        {tag.remainingSec != null && (
          <div>
            {t("Remaining")}: {tag.remainingSec.toFixed(1)}s
          </div>
        )}
        {tag.dotIntervalSec != null && (
          <div>
            {t("DoT")} · {t("every")} {tag.dotIntervalSec.toFixed(1)}s
          </div>
        )}
        {eff && <div>{eff}</div>}
        {tag.requires && (
          <div>
            {t("requires")} {tag.requires}
          </div>
        )}
        {tag.description && <div>{tag.description}</div>}
      </span>
    </span>
  )
}
