import { describe, expect, it } from "vitest"
import { simulateTimeline, FPS } from "../../src/engine/timeline"
import { defaultInputs } from "../../src/engine/defaults"
import { buildContext } from "../../src/engine/panel"
import { makeSkill, makeHit, makeTrigger, type Skill } from "../../src/engine/skill"
import { makeRotation, makeStep, type Rotation } from "../../src/engine/rotation"
import { makeBuff, type Buff } from "../../src/engine/buff"
import { makeDebuff, type Debuff } from "../../src/engine/debuff"
import type { Inputs } from "../../src/engine/types"

// Scoped to Bellstrike Umbra — the only implemented class (CLAUDE.md
// § "Implemented classes").
const umbraInputs = { ...defaultInputs, classId: "bellstrikeUmbra" }
const CLASS = umbraInputs.classId

function timelineInputs(
  rotation: Rotation,
  skills: Skill[],
  buffs: Buff[] = [],
  debuffs: Debuff[] = [],
): Inputs {
  return {
    ...umbraInputs,
    classId: CLASS,
    customSkills: skills,
    customBuffs: buffs,
    customDebuffs: debuffs,
    activeCustomRotation: rotation,
  }
}

describe("timeline — per-cast direct damage and hit count", () => {
  it("attributes each cast's direct-hit damage and hit count to itself, summing to totalDamage", () => {
    const a = makeSkill(CLASS, {
      name: "A",
      castFrames: 90,
      hits: [makeHit({ physMultiplier: 1, physFixed: 100 }), makeHit({ frame: 30, physFixed: 50 })],
    })
    const b = makeSkill(CLASS, {
      name: "B",
      castFrames: 60,
      hits: [makeHit({ physMultiplier: 2, physFixed: 50 })],
    })
    const rotation = makeRotation(CLASS, {
      steps: [makeStep({ skillId: a.id, hitCount: 2 }), makeStep({ skillId: b.id, hitCount: 1 })],
    })
    const r = simulateTimeline(timelineInputs(rotation, [a, b]))
    const castA = r.casts!.find((c) => c.skillName === "A")!
    const castB = r.casts!.find((c) => c.skillName === "B")!
    expect(castA.hitCount).toBe(2)
    expect(castB.hitCount).toBe(1)
    expect(castA.expectedDamage! + castB.expectedDamage!).toBeCloseTo(r.totalDamage, 6)
  })

  it("a triggered sub-skill's damage lands on the cast that triggered it, not its own cast", () => {
    const sub = makeSkill(CLASS, {
      name: "Sub",
      castFrames: 60,
      hits: [makeHit({ physFixed: 5000, physMultiplier: 1 })],
    })
    const trigger = makeSkill(CLASS, {
      name: "Trigger",
      castFrames: 60,
      hits: [
        makeHit({ frame: 0, triggers: [makeTrigger({ kind: "castSkill", targetId: sub.id })] }),
      ],
    })
    const rotation = makeRotation(CLASS, {
      steps: [makeStep({ skillId: trigger.id, hitCount: 1 })],
    })
    const r = simulateTimeline(timelineInputs(rotation, [trigger, sub]))
    expect(r.casts).toHaveLength(1)
    const cast = r.casts![0]
    expect(cast.hitCount).toBe(2)
    expect(cast.expectedDamage).toBeCloseTo(r.totalDamage, 6)
  })

  it("excludes DoT-tick damage — the applying cast's direct damage is only its own hit, not the ticks it seeds", () => {
    const bleed = makeDebuff(CLASS, {
      name: "Bleed",
      activation: "triggered",
      durationFrames: 600,
      maxStacks: 1,
      stackScaling: "flat",
      dot: {
        tickIntervalFrames: 30,
        physMultiplier: 1,
        physFixed: 0,
        attributeMultiplier: 0,
        attributeFixed: 0,
        attributeAttack: "",
        skillType: "sustain",
        count: 1,
      },
    })
    const bleedApply = makeSkill(CLASS, {
      name: "Bleed Applier",
      castFrames: 300,
      hits: [
        makeHit({
          frame: 0,
          physFixed: 1,
          physMultiplier: 0,
          triggers: [makeTrigger({ kind: "applyDebuff", targetId: bleed.id, stacks: 1 })],
        }),
      ],
    })
    const rotation = makeRotation(CLASS, {
      steps: [makeStep({ skillId: bleedApply.id, hitCount: 1 })],
    })
    const r = simulateTimeline(timelineInputs(rotation, [bleedApply], [], [bleed]))
    const cast = r.casts!.find((c) => c.skillName === "Bleed Applier")!
    const dotRow = r.perSkill.find((s) => s.name === "Bleed (DoT)")!
    expect(dotRow.expectedDamage).toBeGreaterThan(0)
    expect(cast.expectedDamage).toBeGreaterThan(0)
    expect(cast.expectedDamage).toBeLessThan(dotRow.expectedDamage)
    expect(cast.expectedDamage! * 5).toBeLessThan(dotRow.expectedDamage)
  })
})

describe("timeline — per-hit formula snapshot", () => {
  it("a multi-hit skill carries one snapshot per hit, each timed at its own frame", () => {
    const skill = makeSkill(CLASS, {
      name: "MultiHit",
      castFrames: 60,
      hits: [makeHit({ frame: 0 }), makeHit({ frame: 20 }), makeHit({ frame: 40 })],
    })
    const rotation = makeRotation(CLASS, { steps: [makeStep({ skillId: skill.id, hitCount: 3 })] })
    const r = simulateTimeline(timelineInputs(rotation, [skill]))
    const cast = r.casts!.find((c) => c.skillName === "MultiHit")!
    expect(cast.hits).toHaveLength(3)
    expect(cast.hits!.map((h) => h.atTimeSec)).toEqual([0, 20 / FPS, 40 / FPS])
    expect(cast.hits!.every((h) => h.skillName === "MultiHit")).toBe(true)
  })

  it("a mid-cast buff proc changes later hits' formula but not earlier ones within the same cast", () => {
    const buff = makeBuff(CLASS, {
      name: "Crit Up",
      scope: "player",
      activation: "triggered",
      durationFrames: 600,
      effects: [{ statKey: "critRate", amount: 0.2 }],
    })
    const skill = makeSkill(CLASS, {
      name: "ProcMidCast",
      castFrames: 60,
      hits: [
        makeHit({
          frame: 0,
          triggers: [makeTrigger({ kind: "applyBuff", targetId: buff.id, stacks: 1 })],
        }),
        makeHit({ frame: 20 }),
      ],
    })
    const rotation = makeRotation(CLASS, { steps: [makeStep({ skillId: skill.id, hitCount: 2 })] })
    const r = simulateTimeline(timelineInputs(rotation, [skill], [buff]))
    const cast = r.casts!.find((c) => c.skillName === "ProcMidCast")!
    const [firstHit, secondHit] = cast.hits!
    expect(secondHit.critRate).toBeGreaterThan(firstHit.critRate)
  })

  it("reports the effective (yellow) rates, not the white values the user typed", () => {
    const skill = makeSkill(CLASS, { name: "A", castFrames: 60, hits: [makeHit({ frame: 0 })] })
    const rotation = makeRotation(CLASS, { steps: [makeStep({ skillId: skill.id, hitCount: 1 })] })
    const inputs = { ...timelineInputs(rotation, [skill]), set: null }
    const r = simulateTimeline(inputs)
    const ctx = buildContext(inputs)
    const cast = r.casts!.find((c) => c.skillName === "A")!
    const hit = cast.hits![0]
    expect(hit.critRate).toBeCloseTo(ctx.critPanel, 10)
    expect(hit.affinityRate).toBeCloseTo(ctx.affinityPanel, 10)
    expect(hit.precisionRate).toBeCloseTo(ctx.precisionPanel, 10)
    expect(hit.critRate).not.toBeCloseTo(inputs.critRate, 3)
  })

  it("a cast under a crit-rate buff reports a higher effective crit rate than one before the buff applied", () => {
    const buff = makeBuff(CLASS, {
      name: "Crit Up",
      scope: "player",
      activation: "triggered",
      durationFrames: 600,
      effects: [{ statKey: "critRate", amount: 0.2 }],
    })
    const opener = makeSkill(CLASS, {
      name: "Opener",
      castFrames: 30,
      hits: [
        makeHit({
          frame: 0,
          triggers: [makeTrigger({ kind: "applyBuff", targetId: buff.id, stacks: 1 })],
        }),
      ],
    })
    const before = makeSkill(CLASS, {
      name: "Before",
      castFrames: 30,
      hits: [makeHit({ frame: 0 })],
    })
    const after = makeSkill(CLASS, { name: "After", castFrames: 60, hits: [makeHit({ frame: 0 })] })
    const rotation = makeRotation(CLASS, {
      steps: [
        makeStep({ skillId: before.id, hitCount: 1 }),
        makeStep({ skillId: opener.id, hitCount: 1 }),
        makeStep({ skillId: after.id, hitCount: 1 }),
      ],
    })
    const r = simulateTimeline(timelineInputs(rotation, [before, opener, after], [buff]))
    const beforeCast = r.casts!.find((c) => c.skillName === "Before")!
    const afterCast = r.casts!.find((c) => c.skillName === "After")!
    expect(afterCast.hits![0].critRate).toBeGreaterThan(beforeCast.hits![0].critRate)
  })
})

describe("timeline — Qi phase on the per-hit snapshot", () => {
  it("reports normal before the Qi break window and exhausted once inside it, within the same multi-hit cast", () => {
    const qiBreakFrame = Math.round(26.5 * FPS)
    const skill = makeSkill(CLASS, {
      name: "SpansQiBreak",
      castFrames: qiBreakFrame + 60,
      hits: [makeHit({ frame: 0 }), makeHit({ frame: qiBreakFrame })],
    })
    const rotation = makeRotation(CLASS, { steps: [makeStep({ skillId: skill.id, hitCount: 2 })] })
    const r = simulateTimeline(timelineInputs(rotation, [skill]))
    const cast = r.casts!.find((c) => c.skillName === "SpansQiBreak")!
    const [firstHit, secondHit] = cast.hits!
    expect(firstHit.qiPhase).toBe("normal")
    expect(secondHit.qiPhase).toBe("exhausted")
  })
})

describe("timeline — per-hit damage outcome breakdown", () => {
  it("carries a chance-weighted outcome breakdown that reproduces the hit's own damage", () => {
    const skill = makeSkill(CLASS, { name: "A", castFrames: 60, hits: [makeHit({ frame: 0 })] })
    const rotation = makeRotation(CLASS, { steps: [makeStep({ skillId: skill.id, hitCount: 1 })] })
    const r = simulateTimeline(timelineInputs(rotation, [skill]))
    const hit = r.casts!.find((c) => c.skillName === "A")!.hits![0]
    const { outcomes } = hit
    const chanceSum =
      outcomes.grazeChance + outcomes.critChance + outcomes.affinityChance + outcomes.normalChance
    expect(chanceSum).toBeCloseTo(1, 6)
    const weightedSum =
      outcomes.grazeChance * outcomes.grazeDamage +
      outcomes.critChance * outcomes.critDamage +
      outcomes.affinityChance * outcomes.affinityDamage +
      outcomes.normalChance * outcomes.normalDamage
    expect(weightedSum).toBeCloseTo(hit.damage, 6)
  })
})
