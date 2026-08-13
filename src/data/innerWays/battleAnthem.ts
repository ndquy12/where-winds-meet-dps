import { defineInnerWay } from "../../definitions/innerWays/innerWayDef"
import { INNER_WAY_ID } from "./ids"
import { PARAM } from "../skills/buffs/ids"
import { battleAnthemChargedBonus } from "./battleAnthemBuffs/battleAnthemChargedBonus"

export const battleAnthem = defineInnerWay({
  id: INNER_WAY_ID.battleAnthem,
  name: "Battle Anthem",
  selectableTiers: [6, 5],
  buffParam: PARAM.battleAnthem,
  panelStats: {
    affinityRate: 0.039,
    affinityDamageBoost: 0.052,
  },
  buffDefs: [battleAnthemChargedBonus],
})
