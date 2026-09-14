import type { EquippedSlots, GearPiece } from "./types"
import type { GearWordId } from "../data/stats/statLines"

export interface EquippedTunementCount {
  word: GearWordId
  count: number
}

export function countEquippedTunements(
  inventory: readonly GearPiece[],
  equipped: EquippedSlots,
): EquippedTunementCount[] {
  const equippedIds = new Set(Object.values(equipped).filter((id): id is string => id !== null))
  const counts = new Map<GearWordId, number>()

  for (const piece of inventory) {
    if (!equippedIds.has(piece.id)) continue
    for (const entry of piece.words) {
      if (entry.word === "") continue
      counts.set(entry.word, (counts.get(entry.word) ?? 0) + 1)
    }
  }

  return Array.from(counts, ([word, count]) => ({ word, count }))
}
