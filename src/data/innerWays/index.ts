import type { InnerWayDef } from "../../definitions/innerWays/innerWayDef"
import { battleAnthem } from "./battleAnthem"
import { bitterSeason } from "./bitterSeason"
import { frostCladNight } from "./frostCladNight"
import { insightfulStrike } from "./insightfulStrike"
import { moraleChant } from "./moraleChant"
import { mountainsMight } from "./mountainsMight"
import { steadfastDevotion } from "./steadfastDevotion"
import { swordHorizon } from "./swordHorizon"
import { swordMorph } from "./swordMorph"
import { throatPierce } from "./throatPierce"
import { wolfchasersArt } from "./wolfchasersArt"

// Order is load-bearing: the context-scalar sum and
// `innerWayTargetDefenseMultiplier`'s first-match both iterate this array,
// and float addition is not associative.
export const INNER_WAYS: readonly InnerWayDef[] = [
  bitterSeason,
  frostCladNight,
  insightfulStrike,
  moraleChant,
  steadfastDevotion,
  swordHorizon,
  throatPierce,
  wolfchasersArt,
  swordMorph,
  mountainsMight,
  battleAnthem,
]
