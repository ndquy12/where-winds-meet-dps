import type { EquippedSlots, GearPiece } from "../../../../engine/types"
import {
  countEquippedTunements,
  type EquippedTunementCount,
} from "../../../../engine/equippedTunements"
import { statLine, statLineLabel } from "../../../../data/stats/statLines"
import { useI18n } from "../../../../i18n/i18nContext"
import styles from "./EquippedTunementsPanel.module.scss"

interface Props {
  inventory: GearPiece[]
  equipped: EquippedSlots
}

const UNCATEGORIZED = "Attributes"

const MERGED_CATEGORIES: Record<string, string> = {
  Phys: "Attack & Attribute",
  Bellstrike: "Attack & Attribute",
  Stonesplit: "Attack & Attribute",
  Silkbind: "Attack & Attribute",
  Bamboocut: "Attack & Attribute",
  Void: "Attack & Attribute",
  "Martial Boosts": "Martial & Target Boosts",
  "Target-Type Boosts": "Martial & Target Boosts",
}

const CATEGORY_ORDER = [
  "Attack & Attribute",
  "Attributes",
  "Martial & Target Boosts",
  "Three Rates",
]

function categoryRank(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category)
  return index === -1 ? CATEGORY_ORDER.length : index
}

function groupByCategory(rows: EquippedTunementCount[]): Map<string, EquippedTunementCount[]> {
  const groups = new Map<string, EquippedTunementCount[]>()
  for (const row of rows) {
    const rawCategory = statLine(row.word)?.category ?? UNCATEGORIZED
    const category = MERGED_CATEGORIES[rawCategory] ?? rawCategory
    const group = groups.get(category)
    if (group) group.push(row)
    else groups.set(category, [row])
  }
  return new Map([...groups].sort(([a], [b]) => categoryRank(a) - categoryRank(b)))
}

export function EquippedTunementsPanel({ inventory, equipped }: Props) {
  const { t } = useI18n()
  const rows = countEquippedTunements(inventory, equipped)

  if (rows.length === 0) {
    return <div className="empty-tab">{t("Equip gear to see its tunement counts")}</div>
  }

  const groups = groupByCategory(rows)

  return (
    <div className={styles.tunementGroups}>
      {Array.from(groups, ([category, groupRows]) => (
        <div key={category}>
          <div className={styles.tunementGroupHead}>{t(category)}</div>
          <div className={styles.tunementCounts}>
            {groupRows.map((row) => (
              <span key={row.word} className={styles.tunementCount}>
                <span className={styles.tunementCountLabel}>{t(statLineLabel(row.word))}</span>
                <span className={styles.tunementCountValue}>{row.count}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
