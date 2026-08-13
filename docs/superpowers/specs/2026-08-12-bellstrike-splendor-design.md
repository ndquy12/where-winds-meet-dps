# Register `bellstrikeSplendor`

## Status

Provisional registration. `docs/CLASSES.md` already lists Bellstrike Splendor
as an unregistered class whose data lives under `reference/classes/`. This
spec registers it from that data as-is; `ClassDef.validated` stays `false`
until a measured build pins its numbers.

## Source data

`reference/classes/`:

- `skills/bellstrike-rainbow/*.json` — 10 skill JSONs (old directory name,
  ids inside already say `bellstrikeSplendor`)
- `debuffsLibrary.json` → `bellstrikeSplendor` — 5 debuff JSONs
- `buffs/mountainsMight.json` — 1 class buff, tagged `bellstrike_splendor`
- `defaultRotations.json` → `bellstrikeSplendor` — 1 rotation, references
  more skills than exist
- `specMeta.json` — weapon/inner-way metadata (`weaponsBySpec.bellstrike_splendor`,
  `nameless_sword`, `nameless_spear`)

## Scope

Register the class using only what the reference data actually contains.
Do not invent numbers for anything missing.

### Skills (12, all ported verbatim)

SwordQ, SwordQ[2nd], SwordSpecial, SwordSpecial[2nd], SwordSpecial[Deflect],
SwordHeavyCharged, SwordHeavyCharged[Prepull], SwordHeavyCharged[2-Hit],
SpearQ, SpearQ[Prepull], SpearQ[0-Hit-Cancel], EnergySurge.

No SpearHeavy exists in the reference data — Splendor ships without one.

### Debuffs (5, all ported verbatim)

Toad Poison, Combustion, Flute Ripple, Bleed Tick, Bitter Season Tick. All
DoTs (`skillType: "sustain"`), `attributeAttack: "Bellstrike"`, effects `[]`
(the DoT block carries the damage, matching the `bellstrikeUmbra` debuff
shape exactly).

### Class buff: Mountain's Might

From `reference/classes/buffs/mountainsMight.json`, `specs: ["bellstrike_splendor"]`
variant:

- Triggered by `cast:spearQ`, `cast:spearQ0HitCancel`, `cast:spearQ5HitCancel`,
  `cast:spearQPrepull`
- Duration 8s, `buffAppliesOnCastEnd: true`
- Effect: `directAffinity +0.015` (flat — `directAffinity`/`directCritRate`
  bypass the white→yellow resistance conversion per CLAUDE.md § "White vs
  Yellow rates", so this ports as a single `stat("directAffinityRate", 0.015)`
  with no conversion math)
- `enabledParam: "mountainsMight"` — new `PARAM.mountainsMight` /
  `BUFF.mountainsMight` ids, since neither exists yet

This buff is **not** an inner way. The reference JSON's `scope: "spec"`
matches `docs/CLASSES.md` § "Buff ownership": "a def reachable purely because
you are this class... goes on the class's own list." It goes in
`classBuffDefs`, the same slot `bellstrikeUmbraBleedPen` occupies for Umbra.

### Default rotation (reduced)

The sourced rotation ("Kaezuma' 42VS 1DB") references 11 distinct skill ids;
5 have no JSON (`deflect-cancel-prepull`, `drunkenpoet-prepull`,
`fire-breath-1-hit`, `flute-of-the-tides-prepull`, `soaring`). Build a
default rotation using only the 6 sourced, castable skills, preserving their
relative order and hit counts from the reference rotation:

1. `spearq-prepull` (prePull, 1 hit)
2. `swordheavycharged-prepull` (prePull, 3 hits)
3. `swordq` (1 hit)
4. `energysurge` (3 hits)
5. `swordheavycharged` (3 hits) — repeated as in the source rotation
6. `spearq` — included once for a live spearQ cast that keeps Mountain's
   Might refreshed

Lives in `src/data/rotations/defaultRotations.json` under a new
`bellstrikeSplendor` key (the file `rotationPoolFor` actually reads — distinct
from `reference/classes/defaultRotations.json`).

### Class definition

```
id: "bellstrikeSplendor"
displayName: "Bellstrike Splendor"
validated: false
spec: "bellstrike_splendor"
primaryAttribute: "Bellstrike"
attributeMultiplier: 51.5        // matches bellstrikeUmbra, same attribute family
classMindGroup: "swordHorizon"   // mirrored from bellstrikeUmbra — NOT independently sourced
allowedMindMethods: [wolfchasersArt, insightfulStrike, moraleChant, bitterSeason]  // mirrored, same caveat
dingYinTags: ["Bleed Boost"]     // has a Bleed Tick debuff, same tag Umbra uses
weapons: ["Sword", "Spear"]      // specMeta.json weaponsBySpec.bellstrike_splendor
critBoostWeaponTypes: []         // both Nameless Sword/Spear show grantsCritBoost: false
classBuffDefs: [mountainsMight]
gateBuffs: []                    // nothing in the reference data needs a gate
mechanics: []
skillBehaviors: []
displayGates: []
poisonExtensions: []             // no Zenith-equivalent mechanic ported
```

### Gaps, stated explicitly (not silently filled)

- `classMindGroup`/`allowedMindMethods` have no source anywhere in
  `reference/` for Splendor; mirrored from Umbra by user decision, pending
  real verification.
- SpearHeavy does not exist for this class in the source data.
- The default rotation is missing 5 of its original 11 steps.
- No gear-set integration, no talent data, no attunement rolls beyond the
  generic Bellstrike pool.

## File layout

```
src/data/skills/bellstrike-splendor/
  ids.ts                 — SKILL / DEBUFF id tables
  index.ts                — CLASS_ID + SKILLS barrel
  swordq.ts, swordq-2nd.ts, swordspecial.ts, swordspecial-2nd.ts,
  swordspecial-deflect.ts, swordheavycharged.ts, swordheavycharged-prepull.ts,
  swordheavycharged-2-hit.ts, spearq.ts, spearq-prepull.ts,
  spearq-0-hit-cancel.ts, energysurge.ts
  debuffs.ts              — 5 defineDebuff exports + DEBUFFS array
  buffs/
    mountainsMight.ts      — defineClassBuff export

src/data/classes/bellstrike-splendor/
  index.ts                 — defineClass call
  attunements.ts            — BELLSTRIKE_SPLENDOR_ATTUNEMENTS (empty or minimal — no source data)
  retunementPool.ts         — own RetunementPool constant, not imported from
                               bellstrikeUmbra's (docs/CLASSES.md § "Where
                               content lives"). Same stat list as Umbra's
                               (Affinity, Max Phys, Momentum, Max Bellstrike,
                               Power, Crit): `nameless_sword`/`nameless_spear`
                               (specMeta.json) produce the identical
                               affinity/bellstrikePen/maxPhys/attrDmgBonus
                               pamBonus set as Umbra's weapons, just split
                               sword-vs-spear differently.

src/data/classes/index.ts   — add bellstrikeSplendor to the class barrel
src/data/skills/buffs/ids.ts — add PARAM.mountainsMight, BUFF.mountainsMight
src/data/rotations/defaultRotations.json — add bellstrikeSplendor entry
```

## Testing

Follow `docs/TESTING.md` § "Class scoping" for an unvalidated class: no
fixture anchor test (nothing measured yet), but the existing architecture
guard tests (`docs/CLASSES.md` mechanical enforcement — data/definitions
boundary, id-prefix checks, one-owner inner-way node checks) must pass
unmodified against the new files. Add the class to whatever generic
"every registered class is selectable" / "every skill's classId matches its
folder" test loop already iterates `CLASS_ID`s, if one exists.

## Migration

No saved-profile shape changes — this adds new ids, it does not rename or
remove any existing one. Per CLAUDE.md § "localStorage migrations": no
migration needed, new class ids are additive and unknown ids already fail
open in existing profile-repair logic.
