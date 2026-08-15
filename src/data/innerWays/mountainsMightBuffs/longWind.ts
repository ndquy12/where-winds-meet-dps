import { defineClassBuff } from "../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../skills/buffs/ids"

import { stat } from "../../../engine/effects/effect"

export const longWind = defineClassBuff({
  id: BUFF.mountainsMight,
  name: "Endless Gale",
  requires: { param: PARAM.mountainsMight },
  duration: 10,
  cooldown: 12,
  buffAppliesOnCastEnd: true,
  effects: [stat("directAffinityRate", 0.03)],
})
