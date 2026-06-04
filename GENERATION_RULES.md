# Character Generation Rules

Read this before generating attributes or images for this workbench.

## Full Workflow

Use `CHARACTER_CREATION_WORKFLOW.md` as the top-level sequence:

1. Fill all profile modules for the current character.
2. Before finalizing expression and mouth fields, read `EXPRESSION_DESIGN_GUIDE.md`
   and apply the expression design gate.
3. Before finalizing costume fields, read `COSTUME_DESIGN_GUIDE.md` and apply the costume design gate.
4. Write `metaDesign.characterImagePromptCn` and `metaDesign.characterImagePrompt` from the completed profile.
5. Run `node scripts/check-character-completeness.js`.
6. Only then enter `IMAGE_GENERATION_WORKFLOW.md`.

Image generation must use the final prompt tab as its source of truth. The image prompt is not built by appending every profile field at generation time.

## Attribute Generation

- Generate for the currently active character only.
- Respect marks:
  - `attributes: true` means fill profile fields.
  - `images: true` means generate or update image assets.
  - If `images` is false, do not change image assets.
- Completion rule: when `images: true` after profile fields and final prompts are
  filled, continue into `IMAGE_GENERATION_WORKFLOW.md` immediately. Do not treat
  creating the character, filling attributes, or toggling the image mark as a
  stopping point unless the user explicitly asks not to generate or a concrete
  blocker prevents image generation.
- Keep ordinary form fields concise. Prefer keyword-like values over prose.
- Use longer sentences only in textarea fields, prompts, notes, hooks, history, trauma, or other one-row narrative fields.
- If a field needs a sentence, make the UI field span one full row.
- Avoid mojibake by writing JSON with UTF-8 or Unicode escapes.
- Names should feel like designed character names, not casual worker nicknames.
- Avoid overusing `老X`, `小X`, `阿X`, or other generic age-based aliases unless the user explicitly asks for that tone.
- Prefer names with stronger visual identity, faction flavor, or memorable rhythm.
- Before choosing or revising names, read `NAME_GENERATION_RULES.md` and use
  `data/name-samples.json` as a flavor anchor. The sample library is not a hard
  vocabulary limit; extend from it when the result still matches the character's
  nationality, heritage, world, and imagination level.
- For candidate generation, use `numericalAttributes.imagination`,
  `numericalAttributes.worldBinding`, `numericalAttributes.identityMix`, and
  `numericalAttributes.nameRealism` to choose naming template freedom. Preview
  candidates with `node scripts/generate-name.js [characterId] [count]` when a
  name needs to be generated or revised.
- Default character direction is modern urban fantasy: a believable real-world occupation or public identity with one unusual supernatural ability, artifact, device, familiar, curse, or hidden role as the core design hook.
- Do not default to industrial workers, dock workers, heavy laborers, guards, or grimy working-class archetypes unless the user explicitly asks for them.
- Visual style should lean toward clean Kyoto Animation-like TV anime cel shading: crisp readable linework, clean shadow shapes, fresh colors, tidy clothing, and minimal dirt or dust.
- Before finalizing heritage, hair, facial hair, skin tone, or other appearance cues, read `HERITAGE_APPEARANCE_RULES.md`. Use it as a probability and restraint guide, not as a stereotype lock.
- Treat industrial texture, grime, dust, rust, oil, soot, distressed surfaces, and wasteland mood as minor optional accents only, never as the main design thesis.
- Prefer modern uniforms, everyday streetwear, service-work clothing, office/public-role clothing, school-adjacent adult roles, municipal roles, medical roles, retail roles, creative jobs, delivery roles, or civic roles as the grounded base.
- Before writing `visualIdentity.expression`, `visualIdentity.lip`, or the
  expression sentence in the final prompt, read `EXPRESSION_DESIGN_GUIDE.md`.
  Choose expression exposure from the numerical attributes and character concept.
  Do not default every character to calm/gentle/focused closed-mouth faces.
  Stable characters can speak, smile with teeth, command, breathe through a
  slightly open mouth, or clench their teeth as long as the face remains
  character-appropriate.
- Every final image prompt must include a draw-able expression phrase with:
  expression family, mouth shape, and brow/eye action. Avoid writing only
  `calm expression`, `gentle expression`, `focused expression`, or `tired expression`.
  If those mood words are used, pair them with visible mouth and brow/eye action.
- Check the last five recent characters before choosing a mouth shape. If closed
  mouths, flat mouth lines, or slight closed-mouth smiles are overrepresented,
  choose speaking mid-sentence, toothy grin, clenched teeth, open-mouth command,
  wide laugh, or another specific non-closed mouth shape when the character
  concept allows it.
- Fatigue is capped. Before using tired, sleepy, weary, exhausted, drowsy,
  `困`, `困倦`, `疲惫`, or similar wording in `visualIdentity.expression`,
  `visualIdentity.eyes`, or the final prompt, inspect the last eight recent
  characters. If any recent character already uses a tired/sleepy/weary face,
  choose another expression family. Night work, civic work, protective duty,
  older age, calm personality, and trauma history do not by themselves justify a
  tired-looking face.
- Preferred replacements for overused fatigue: alert steady gaze, low speaking
  command, protective focus, controlled pressure, weathered but awake eyes,
  firm closed-mouth resolve, small reassuring smile, clenched-teeth endurance,
  or watchful side glance.
- Before writing costume fields or outfit text in the final prompt, read `COSTUME_DESIGN_GUIDE.md` and use it to judge clothing type, silhouette, layering, accessories, material language, color logic, and anti-repetition swaps.
- Costume color hierarchy has priority over element-based color intuition: make the outfit wearable and attractive first, then use element colors mostly as props, trims, badges, hardware, or restrained low-glow accents.
- The fantasy layer should be readable but restrained: one signature object, subtle aura, magical tool, abnormal material, compact familiar, small curse mark, or controlled ability.
- Avoid making strong diffuse glow the default. Prefer compact, readable, low-glow fantasy markers unless the character concept truly needs bright light effects.
- Body floor: unless the user explicitly asks for a slimmer or average build, every new adult male character should be at least very bulky and muscular: extremely broad shoulders, heavy chest, thick neck/traps, large upper arms and forearms, strong thighs, and a substantial rounded power build. Do not drift back to ordinary anime-protagonist, fashion-model, or merely athletic proportions.
- Escalation target: when the user asks for "more muscular", "stronger", "bigger", or similar, write the body as a giant thick power build, larger and heavier than the style reference, with the fitted top visibly stretched across chest, shoulders, and arms.
- A recurring preferred garment is a tight white top wrapping the torso: fitted white T-shirt, sleeveless undershirt, fitted long-sleeve, or another clean close-fitting white top that can be tucked into pants, overalls, apron waist, harness, or belt structure. Keep it attractive, clean, non-realistic, non-photographic, and not explicit.
- If the user says to remove outerwear, write `costumeSystem.outerwear` as no outerwear and keep the upper body focused on the tight white top. Do not reintroduce a jacket, coat, vest, open shirt, or overshirt in the final prompt.

## Weapon Logic

Weapons must not be decided by occupation alone, but they also must not become
pure rules, permissions, boundaries, routes, processes, or concepts. The final
weapon must first be a visual physical object that an ordinary person could
understand and sketch within three seconds. Add fantasy logic after the object
exists.

Generate combat equipment in this order:

1. Decide `combatSystem.battleArchetype`: how the character fights.
2. Decide `combatSystem.visualWeapon`: the visible weapon object. It must be a
   concrete noun or object phrase, such as bell, umbrella, staff, hammer, shield,
   key, lamp, bag, rope, stamp, cane, bracer, road sign, mailbag, dagger, or
   gauntlet.
3. Decide `combatSystem.combatFunction`: what the object does in combat, such as
   defend, pull, lock down, navigate, reflect, track, bind, heal, summon, or
   reinforce the body.
4. Decide `combatSystem.fantasyExplanation`: why the object can do that. This is
   where abstract rules, permissions, contracts, routes, boundaries, fate, or
   workflows may appear.
5. Decide `combatSystem.weaponSource`: where the power, material, rule, or
   authority comes from. Keep this as explanation, not the weapon itself.
6. Read `coreIdentity.occupation` only after those choices. Use the occupation for
   materials, symbols, procedures, social rituals, or disguise.
7. Fill `combatSystem.forbiddenDirectTool` with the most obvious direct tools
   implied by the occupation.
8. If the visual weapon is just a common job tool, reject it and transform it at
   least once through structure, scale, function, medium, or disguise.
9. Fill `combatSystem.weaponTransformation` with the reasoning.
10. Fill `combatSystem.weaponPreference` as `finalWeapon`. It must contain the
   visible entity noun from `combatSystem.visualWeapon`.

Forbidden shortcut:

- Do not use `occupation -> common tool -> weapon` as the design path.
- Do not use `occupation -> common tool -> abstract rule` as the design path.
- Do not let `combatSystem.weaponPreference` be only an abstract concept.

Required path:

- `battle archetype -> weapon function`
- `visualWeapon -> concrete object`
- `combatFunction -> what the object does`
- `fantasyExplanation -> why the object can do it`
- `occupation -> material, visual packaging, ritual, or disguise`

Final weapon rules:

- `combatSystem.weaponPreference` is the final weapon.
- The final weapon must include a clear entity noun.
- The final weapon must be draw-able as a prop or carried equipment.
- Abstract words may appear in `fantasyExplanation`, `weaponSource`, or
  `weaponTransformation`, but not as the subject of `weaponPreference`.
- Banned pure-concept final weapons include: `回路线边界`, `归处法则`,
  `退件规则`, `路径概念体`, `封印流程`, `权限规则`, `命运回路`.
- If a generated weapon becomes too abstract, automatically downgrade it to:
  `entity prop + fantasy ability`. Example: change `退件规则` into
  `旧邮袋盾`, or change `回路线边界` into `黄铜邮差铃与折叠路签`.

Weapon source examples:

- occupation tool transformed
- occupation material altered
- occupation workflow weaponized
- occupation symbol made physical
- private keepsake
- family inheritance
- illegal modification
- contract gift
- disaster remnant
- otherworld contamination
- ritual medium
- corporate or military prototype
- body byproduct
- environmental leverage
- debt, contract, or permission system

Transformation examples:

- Structure: tool parts become a shield, staff, ring, armor, trap, or mechanism.
- Scale: a large workplace system becomes a handheld device, or a small tool
  becomes an oversized weapon.
- Function: repair, cooking, healing, accounting, or delivery becomes attack,
  defense, control, summoning, or terrain editing.
- Medium: use pressure, thread, scent, ledger entries, stamps, signals, light,
  keys, routes, or timing instead of the tool itself.
- Disguise: the item still looks ordinary until unfolded, authorized, or
  triggered.

Correction examples:

- Wrong final weapon: `退件铃与折叠路签组成的回路线边界`
- Correct fields:
  - `visualWeapon`: `黄铜邮差铃`
  - `combatFunction`: `导航、封锁、反射攻击`
  - `fantasyExplanation`: `摇响后能听见失物真正归处的方向，退回的信件会折成短暂路标。`
  - `weaponPreference`: `黄铜邮差铃与折叠路签`

- Wrong final weapon: `失物回路局授权的退件规则`
- Correct fields:
  - `visualWeapon`: `旧邮袋盾`
  - `combatFunction`: `防御、收纳、反弹`
  - `fantasyExplanation`: `被挡下的攻击会像退件一样被送回原处。`
  - `weaponPreference`: `旧邮袋盾`

Archetype association samples:

- Mage: ranged control, medium, symbol, ritual, formation. Forms may include
  charm rings, floating media, folded staves, notation plates, paper barriers,
  steam circles, light arrays, or ink lines.
- Warrior: heavy weapons, armor, frontal pressure. Forms may include pressure
  shields, valve hammers, weighted guards, folding barricades, impact frames, or
  reinforced carriers.
- Assassin: short weapons, hidden weapons, poison, speed. Forms may include
  sleeve needles, folding blades, wire knives, ring mechanisms, silent valve
  plates, toxic capsules, or concealed launchers.
- Boxer: close range, guard, elbow strikes, knee strikes, body reinforcement.
  Forms may include bracers, gloves, heavy boots, arm plates, shoulder plates,
  binding wraps, or impact rings.
- Tycoon: authorization, dispatch, contracts, pressure through rules. Forms may
  include ceremonial canes, metal name cards, contract folders, seals,
  permission terminals, bodyguard devices, or numbered access tokens.
- Doctor: precision, diagnosis, anesthesia, repair, life monitoring. Forms may
  include needles, surgical thread, medicine vials, diagnostic frames,
  monitor charms, or sterile binding tools.
- Summoner: contract, call, vessel, remote body. Forms may include bells, cards,
  flutes, contract tokens, media containers, marked cages, or proxy puppets.
- Guardian: protection, boundary, interception, counterforce. Forms may include
  shields, door panels, ward plates, talismans, safety rails, barrier anchors,
  or portable thresholds.
- Hunter: pursuit, distance, traps, routes, bait. Forms may include bows, guns,
  snares, ropes, lures, trackers, marked paths, or capture frames.
- Craftsperson: conversion, mechanism, modular tools, repair logic. Forms may
  include changed tools, folding structures, socket weapons, workbench modules,
  clamps, gear arrays, or replaceable heads.
- Dancer: rhythm, footwork, spiral motion, feint. Forms may include ribbons,
  bell chains, shoe blades, rhythm marks, rotating rings, or movement trails.
- Priest: purification, ritual authority, blessing, sealing. Forms may include
  sacred implements, scripture strips, censers, prayer cords, seals, or
  cleansing vessels.
- Gambler: odds, risk, debt, exchange. Forms may include chips, cards, dice,
  probability marks, wager contracts, or payout counters.
- Actor: misdirection, masks, props, false bodies, triggered lines. Forms may
  include masks, stage props, doubles, spotlights, cue scripts, or voice keys.
- Courier: route, delivery, seal, message timing. Forms may include envelopes,
  stamps, sealing wax, delivery paths, signal devices, or return tags.
- Hacker or intelligence agent: signal, key, remote action, data made visible.
  Forms may include terminals, signals, keys, drones, data constructs, or
  permission exploits.

## Concision Targets

- Name, codename, species, faction: 2-8 Chinese characters when possible.
- Core personality: 3-5 short traits.
- Face, eyes, eyebrow, lip, body, clothing fields: compact phrases.
- Expression: one short draw-able phrase, not just a mood word. Prefer a compact
  combination such as expression family + mouth shape + brow/eye action.
- Scar, tattoo, hair, facial hair, skin tone, muscle focus: compact phrases unless a specific story detail matters.
- Visual keywords and character hook may be longer.

## Image Generation

- Image generation has its own narrow rule file: `IMAGE_GENERATION_RULES.md`.
- During image generation, do not use this file as prompt material.
- Before image generation, fill the final prompt tab (`metaDesign.characterImagePrompt` and `metaDesign.characterImagePromptCn`) as the last attribute-generation step.
- The final prompt tab is the single source of truth for the character image.
- Profile attributes and generation notes may guide how the final prompt is written, but must not be appended to the image prompt.
- Final image prompts must not include the character's name, codename, alias, or
  romanized name. Names are identity metadata, not visible image content. Start
  from visual facts such as age range, heritage, role, body type, face, outfit,
  props, expression, and fantasy anchor.

## Full-Body Prompt Guardrails

Every full-body prompt must include these constraints:

- `Single character only.`
- `Full body visible from head to boots.`
- `Generate the character from the current visual attributes, without writing or referencing the character's name.`
- `The style reference is only for body proportion and drawing style; do not copy the reference character.`
- `No UI, no infographic, no diagram, no character sheet, no text, no labels, no icons, no scenery.`
- `Pure flat chroma-key background only.`
- `Clean anime cel shading, crisp linework, tidy modern urban fantasy design, minimal dirt and grime.`
- `Urban first, fantasy second; no gritty industrial mood unless explicitly requested.`
- `Very bulky muscular adult male as the body floor, not slender or merely athletic; extremely broad shoulders, heavy chest, thick arms and forearms, strong thighs, substantial rounded power build.`
- `Fitted white top system is preferred, such as a tight T-shirt, sleeveless undershirt, or fitted long-sleeve tucked into the waist structure, with clean cel-shaded torso contours. If outerwear is removed, ban jacket/coat/vest/open shirt and make the tight white top the visible upper-body focus.`
- `Choose a chroma-key background by contrast: avoid green key for green/cyan/healing/translucent effects; avoid magenta key for pink/violet elements.`
