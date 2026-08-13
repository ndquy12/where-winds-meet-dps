import { defineInnerWay } from "../../definitions/innerWays/innerWayDef"
import { INNER_WAY_ID } from "./ids"
import { PARAM } from "../skills/buffs/ids"
import { longWind } from "./mountainsMightBuffs/longWind"

export const mountainsMight = defineInnerWay({
  id: INNER_WAY_ID.mountainsMight,
  name: "Mountain's Might",
  selectableTiers: [6, 5],
  buffParam: PARAM.mountainsMight,
  panelStats: {
    "bellstrike.min": 10,
    "bellstrike.max": 20,
    "bellstrike.penetration": 6,
  },
  buffDefs: [longWind],
})
