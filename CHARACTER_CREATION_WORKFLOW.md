# Character Creation Workflow

This is the top-level workflow for creating or updating a character in the OC Character Bible Workbench.

## Core Principle

Generate in this order:

1. Fill the character profile.
2. Apply the expression design gate before finalizing face and prompt expression text.
3. Apply the costume design gate before finalizing costume fields.
4. Apply the weapon logic gate before finalizing combat equipment.
5. Write the final image prompt from that completed profile.
6. Generate the image from the final image prompt only.

The image generation step must not directly read every profile field. The completed profile is used to write `metaDesign.characterImagePrompt` and `metaDesign.characterImagePromptCn`. After that, those final prompt fields become the single source of truth for the image.

## Completion Rule

If a request creates or updates a character and leaves `activeMarks.images` set to
`true`, the task is not complete at the attribute/profile stage. Continue into
`IMAGE_GENERATION_WORKFLOW.md` in the same turn whenever image generation tools are
available:

1. run the completeness gate for that character
2. prepare the image-generation package for that character
3. generate the chroma-key source image
4. remove the chroma-key background
5. verify transparency
6. write the transparent image back to `assets.fullBody` and `assets.thumbnail`

Only stop after attributes are filled when `activeMarks.images` is false, the user
explicitly asks not to generate, or image generation is blocked by a missing tool,
missing style reference, failed validation, or another concrete error.

## Attribute Phase

Fill every visible profile module for the current character:

- Identity
- Appearance
- Personality
- Behavior
- Costume
- Life
- Social
- Combat
- World
- Unlocks
- Stats
- Prompt

Use `GENERATION_RULES.md` for attribute-writing style, naming, tone, body direction, and field concision.
Use `EXPRESSION_DESIGN_GUIDE.md` before writing `visualIdentity.expression`,
`visualIdentity.lip`, or the expression sentence in the final prompt.
Use `COSTUME_DESIGN_GUIDE.md` before writing costume fields or outfit text in the final prompt.
Use the Weapon Logic section in `GENERATION_RULES.md` before writing
`combatSystem.weaponPreference` or describing combat equipment in the final prompt.

## Expression Design Gate

Before filling or revising `visualIdentity.expression`, `visualIdentity.lip`, or
the expression sentence in `metaDesign.characterImagePrompt`, read
`EXPRESSION_DESIGN_GUIDE.md`.

The expression pass must decide:

- how numerical attributes affect expression exposure, especially morality, sanity,
  confidence, stress, danger, desire, loyalty, stability, social, and violence
- whether danger reads as protective, controlled, charming, unstable, or threatening
- which expression family fits the character
- which visible mouth shape is used: closed, speaking, toothy, clenched, shouting,
  laughing, or another specific shape
- which brow or eye action makes the expression draw-able
- whether recent characters overused closed-mouth calm faces

Most characters may remain emotionally stable, but stable does not mean every
character should be closed-mouth. The final prompt must include visible face action:
expression family, mouth shape, and brow/eye action.

## Costume Design Gate

Before filling or revising the `costumeSystem` fields, read `COSTUME_DESIGN_GUIDE.md`.
Use it as a judgment guide, not as a fixed outfit library.

The costume pass must decide:

- how numerical attributes affect clothing, especially wealth, danger, desire,
  violence tendency, discipline, and public pressure
- how world and faction details affect clothing, including badges, logos, house
  marks, embroidery, rank trims, issued garments, civilian cover, and class signals
- how combat and action needs affect hems, cuffs, footwear, gloves, belts, straps,
  pockets, protective parts, and loose or dangling elements
- how the required fitted white top appears: T-shirt, sleeveless undershirt,
  fitted long-sleeve, or another clean close-fitting white top that can be tucked
  into pants, overalls, apron waist, harness, or belt structure
- whether the current request requires the stronger body floor: very bulky muscular
  adult male proportions, extremely broad shoulders, heavy chest, thick arms and
  forearms, strong thighs, and a fitted top visibly stretched in clean cel shading
- whether outerwear has been explicitly removed; if so, keep `costumeSystem.outerwear`
  as no outerwear and ban jacket, coat, vest, open shirt, and overshirt from the
  final image prompt
- how color hierarchy keeps the outfit wearable first, with element colors limited
  mostly to props, trims, badges, hardware, lining, or restrained low-glow accents
- what makes the outfit attractive as character design, not just practical clothing
- what material language keeps the outfit in clean anime cel-shaded design instead
  of photoreal fabric, glossy fashion rendering, or gritty texture
- what anti-repetition swap changes the silhouette, layering, pants shape,
  footwear, accessory source, faction marking, color logic, or fantasy anchor

After this gate, write concise `costumeSystem` fields and make sure the final prompt
outfit text reflects the same decisions.

## Weapon Logic Gate

Before filling or revising `combatSystem.weaponPreference`, read the Weapon Logic
section in `GENERATION_RULES.md`.

The weapon pass must decide:

- `combatSystem.battleArchetype`: how the character fights
- `combatSystem.visualWeapon`: the concrete visible weapon object, understandable
  and draw-able within three seconds
- `combatSystem.combatFunction`: what that object does in battle
- `combatSystem.fantasyExplanation`: why the object can do that
- `combatSystem.weaponSource`: where the weapon's power, material, rule, or
  authority comes from, kept as explanation rather than the weapon itself
- how `coreIdentity.occupation` contributes material, symbols, workflow, social
  ritual, or disguise after the archetype and source are chosen
- `combatSystem.forbiddenDirectTool`: the direct job-tool cliches that must not
  be used as the final weapon
- `combatSystem.weaponTransformation`: how the final weapon avoids direct
  occupation translation through structure, scale, function, medium, or disguise
- `combatSystem.weaponPreference`: the final weapon, which must contain a clear
  entity noun from `visualWeapon`

Do not design weapons as `occupation -> obvious tool -> weapon`, and do not solve
that problem by jumping to pure abstraction such as rules, routes, boundaries, or
permissions. The correct sequence is:

`battle archetype -> visual weapon object -> combat function -> fantasy explanation -> occupation packaging`.

If the final weapon reads as a concept rather than a prop, downgrade it to
`entity prop + fantasy ability` before writing the final image prompt.

The final step of attribute generation is writing:

- `metaDesign.characterImagePromptCn`
- `metaDesign.characterImagePrompt`

These prompts should summarize the completed character into a direct image-generation instruction. They should include the visual identity, outfit, body type, core fantasy hook, style, composition, and image bans.

## Completeness Gate

Before image generation, run:

```bash
node scripts/check-character-completeness.js
```

For a specific character:

```bash
node scripts/check-character-completeness.js <characterId>
```

If this reports missing fields, stop and fill those fields first. Do not generate the image for a partial character unless the user explicitly asks for a draft image from incomplete information.

## Image Phase

After the completeness gate passes, use `IMAGE_GENERATION_WORKFLOW.md`.

During image generation, read only:

- `metaDesign.characterImagePrompt`
- `metaDesign.characterImagePromptCn`
- `settings.styleReference.image`

Do not append profile modules, notes, rules documents, UI labels, or raw field lists to the image prompt.

The style reference decides drawing language only: body proportion, line quality, rendering style, and coloring method. The final prompt decides the character.

## Local Output Phase

After generation:

1. Save the chroma-key source image in `assets/`.
2. Remove the chroma-key background locally.
3. Verify the final PNG has alpha transparency.
4. Write the transparent PNG back to the character with `scripts/apply-generated-image.js`.
5. Refresh the local app and confirm `assets.fullBody` points to the new transparent PNG.
