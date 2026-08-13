import { defineInnerWay } from "../../definitions/innerWays/innerWayDef"
import { INNER_WAY_ID, INNER_WAY_NODE } from "./ids"
import { PARAM } from "../skills/buffs/ids"
import { swordMorphChargedBonus } from "./swordMorphBuffs/swordMorphChargedBonus"

export const swordMorph = defineInnerWay({
  id: INNER_WAY_ID.swordMorph,
  name: "Sword Morph",
  selectableTiers: [6, 5],
  buffParam: PARAM.swordMorph,
  panelStats: {
    "phys.max": 74.4,
    directAffinityRate: 0.023,
  },
  tiers: {
    6: {
      nodes: [INNER_WAY_NODE.swordMorphChargedBonus],
    },
  },
  buffDefs: [swordMorphChargedBonus],
})
