# Bellstrike Splendor — reference notes

Source notes for Bellstrike Splendor's inner ways and talents. Not `docs/` —
this is raw reference material (see `reference/workbook/` for the same kind of
thing), kept here as provenance for the coefficients baked into `src/`.

## Inner Ways

### Sword Morph (primary inner way for Bellstrike Splendor)

Base: `maxPhys +74.4`, `directAffinityRate +0.023`

- Tier 6: +30% Damage Bonus on Sword Slash (Charged Skill)

### Mountain's Might

Base: `Bellstrike +10~20`, `Bellstrike Penetration +6`

- Long Wind: 10s duration, triggered on Spear Q
- While Long Wind is active: +3% Direct Affinity

### Battle Anthem

Base: `Affinity Rate +4%`, `Affinity Damage Bonus +5.2%`

- On Charged Skill: +15% Damage Bonus
- On Endurance consume: not tracked by the engine — set to its max value,
  +10% Damage Bonus, as a permanent assumption

## Talents

| skill                        | stat                 | maxBonus | scalesWith    | scaleMax |
| ----------------------------- | --------------------- | -------- | -------------- | -------- |
| Physical Attack UP            | maxPhys                | 73.9     | momentum       | 280      |
| Bellstrike Penetration Scale  | bellstrikePenetration | 0.22     | bellstrike.max | 655      |
| Affinity Rate UP              | affinityRate           | 0.043    | momentum       | 280      |
| Bellstrike Attribute UP       | attributeDamageBoost   | 0.11     | bellstrike.max | 655      |
| Affinity DMG UP               | affinityDamage          | 0.18     | affinityRate   | 0.3      |
| Max Bellstrike Attack         | maxBellstrike          | 392      | —              | —        |
| Min Bellstrike Attack         | minBellstrike          | 196      | —              | —        |

- Sword Qi Affinity Enhancement: +18% Affinity DMG Bonus, active while a
  Charge Skill is used and Qi Imbalance is active
- Affinity DMG UP Talent (Spear): +18% Affinity DMG Bonus during Long Wind, or
  below 60% Endurance — Endurance not tracked, ignore that half of the
  condition
- Qi Imbalance: on exhausted, +8% Damage Bonus, +8% Bellstrike Damage Bonus;
  triggered on Spear Q hit or Sword Q hit
