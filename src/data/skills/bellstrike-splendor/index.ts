import type { Skill } from "../../../engine/skill"
import { spearQ } from "./spearq"
import { spearQPrepull } from "./spearq-prepull"
import { spearQ0HitCancel } from "./spearq-0-hit-cancel"
import { swordQ } from "./swordq"
import { swordSpecial } from "./swordspecial"
import { swordSpecial2nd } from "./swordspecial-2nd"
import { swordSpecialDeflect } from "./swordspecial-deflect"
import { swordHeavyCharged } from "./swordheavycharged"
import { swordHeavyChargedPrepull } from "./swordheavycharged-prepull"
import { swordHeavyCharged2Hit } from "./swordheavycharged-2-hit"
import { energySurge } from "./energysurge"
import { swordHeavyChargedStart } from "./swordheavycharged-start"

export { CLASS_ID } from "./ids"

export const SKILLS: Skill[] = [
  spearQ,
  spearQPrepull,
  spearQ0HitCancel,
  swordQ,
  swordSpecial,
  swordSpecial2nd,
  swordSpecialDeflect,
  swordHeavyCharged,
  swordHeavyChargedPrepull,
  swordHeavyChargedStart,
  swordHeavyCharged2Hit,
  energySurge,
]
