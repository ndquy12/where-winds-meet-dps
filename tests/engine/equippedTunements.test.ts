import { describe, expect, it } from "vitest"
import { countEquippedTunements } from "../../src/engine/equippedTunements"
import { EMPTY_EQUIPPED } from "../../src/engine/types"
import type { EquippedSlots, GearPiece, GearSlot } from "../../src/engine/types"

function word(name: GearPiece["words"][number]["word"], value = 0): GearPiece["words"][number] {
  return { word: name, value, retuned: false }
}
const EMPTY = word("", 0)

function piece(id: string, slot: GearSlot, overrides: Partial<GearPiece> = {}): GearPiece {
  return {
    id,
    slot,
    level: 91,
    rarity: "legendary",
    minPhys: 1000,
    maxPhys: 2000,
    hp: 0,
    physDef: 0,
    words: [word("crit", 0.03), word("power", 40), EMPTY, EMPTY, EMPTY],
    attunement: "physPen",
    attunementValue: 0.03,
    relayed: false,
    ...overrides,
  }
}

function equip(pieces: GearPiece[]): EquippedSlots {
  const equipped = { ...EMPTY_EQUIPPED }
  for (const equippedPiece of pieces) equipped[equippedPiece.slot] = equippedPiece.id
  return equipped
}

describe("countEquippedTunements", () => {
  it("tallies each word across every equipped piece", () => {
    const weapon = piece("weapon", "leftWeapon", {
      words: [word("power", 40), word("maxPhys", 60), EMPTY, EMPTY, EMPTY],
    })
    const helm = piece("helm", "helm", {
      words: [word("power", 30), word("momentum", 20), EMPTY, EMPTY, EMPTY],
    })
    const inventory = [weapon, helm]

    const counts = countEquippedTunements(inventory, equip(inventory))

    expect(counts).toEqual([
      { word: "power", count: 2 },
      { word: "maxPhys", count: 1 },
      { word: "momentum", count: 1 },
    ])
  })

  it("ignores pieces sitting in the inventory but not equipped", () => {
    const equippedPiece = piece("weapon", "leftWeapon", {
      words: [word("power", 40), EMPTY, EMPTY, EMPTY, EMPTY],
    })
    const benchedPiece = piece("spare", "helm", {
      words: [word("power", 40), EMPTY, EMPTY, EMPTY, EMPTY],
    })
    const inventory = [equippedPiece, benchedPiece]

    const counts = countEquippedTunements(inventory, equip([equippedPiece]))

    expect(counts).toEqual([{ word: "power", count: 1 }])
  })

  it("skips empty word slots", () => {
    const sparse = piece("weapon", "leftWeapon", {
      words: [word("power", 40), EMPTY, EMPTY, EMPTY, EMPTY],
    })
    const inventory = [sparse]

    const counts = countEquippedTunements(inventory, equip(inventory))

    expect(counts).toEqual([{ word: "power", count: 1 }])
  })

  it("returns nothing when no gear is equipped", () => {
    const counts = countEquippedTunements([], EMPTY_EQUIPPED)

    expect(counts).toEqual([])
  })
})
