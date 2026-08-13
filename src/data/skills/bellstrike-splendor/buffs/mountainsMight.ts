import { defineClassBuff } from "../../../../definitions/skills/buffDef"
import { BUFF, PARAM } from "../../buffs/ids"
import { CAST } from "../../ids"
import { stat } from "../../../../engine/effects/effect"

export const mountainsMightBuffDef = defineClassBuff({
  id: BUFF.mountainsMight,
  name: "Mountain's Might",
  requires: { param: PARAM.mountainsMight },
  triggeredBy: [CAST.spearQ, CAST.spearQ0HitCancel, CAST.spearQ5HitCancel, CAST.spearQPrepull],
  duration: 8,
  buffAppliesOnCastEnd: true,
  effects: [stat("directAffinityRate", 0.015)],
})
