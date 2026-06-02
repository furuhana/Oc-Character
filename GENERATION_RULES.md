# Character Generation Rules

Read this before generating attributes or images for this workbench.

## Full Workflow

Use `CHARACTER_CREATION_WORKFLOW.md` as the top-level sequence:

1. Fill all profile modules for the current character.
2. Before finalizing costume fields, read `COSTUME_DESIGN_GUIDE.md` and apply the costume design gate.
3. Write `metaDesign.characterImagePromptCn` and `metaDesign.characterImagePrompt` from the completed profile.
4. Run `node scripts/check-character-completeness.js`.
5. Only then enter `IMAGE_GENERATION_WORKFLOW.md`.

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
- Default character direction is modern urban fantasy: a believable real-world occupation or public identity with one unusual supernatural ability, artifact, device, familiar, curse, or hidden role as the core design hook.
- Do not default to industrial workers, dock workers, heavy laborers, guards, or grimy working-class archetypes unless the user explicitly asks for them.
- Visual style should lean toward clean Kyoto Animation-like TV anime cel shading: crisp readable linework, clean shadow shapes, fresh colors, tidy clothing, and minimal dirt or dust.
- Before finalizing heritage, hair, facial hair, skin tone, or other appearance cues, read `HERITAGE_APPEARANCE_RULES.md`. Use it as a probability and restraint guide, not as a stereotype lock.
- Treat industrial texture, grime, dust, rust, oil, soot, distressed surfaces, and wasteland mood as minor optional accents only, never as the main design thesis.
- Prefer modern uniforms, everyday streetwear, service-work clothing, office/public-role clothing, school-adjacent adult roles, municipal roles, medical roles, retail roles, creative jobs, delivery roles, or civic roles as the grounded base.
- Before writing costume fields or outfit text in the final prompt, read `COSTUME_DESIGN_GUIDE.md` and use it to judge clothing type, silhouette, layering, accessories, material language, color logic, and anti-repetition swaps.
- Costume color hierarchy has priority over element-based color intuition: make the outfit wearable and attractive first, then use element colors mostly as props, trims, badges, hardware, or restrained low-glow accents.
- The fantasy layer should be readable but restrained: one signature object, subtle aura, magical tool, abnormal material, compact familiar, small curse mark, or controlled ability.
- Avoid making strong diffuse glow the default. Prefer compact, readable, low-glow fantasy markers unless the character concept truly needs bright light effects.
- The preferred body direction is a bulky, soft-strong adult male: broad shoulders, thick chest, thick arms, visible strength, a substantial rounded body, and more muscle than a slim lead character.
- A recurring preferred garment is a tight white top wrapping the torso: fitted white T-shirt, sleeveless undershirt, fitted long-sleeve, or another clean close-fitting white top that can be tucked into pants, overalls, apron waist, harness, or belt structure. Keep it attractive, clean, non-realistic, non-photographic, and not explicit.

## Concision Targets

- Name, codename, species, faction: 2-8 Chinese characters when possible.
- Core personality: 3-5 short traits.
- Face, eyes, eyebrow, lip, body, clothing fields: compact phrases.
- Expression: 2-6 Chinese characters, or one very short phrase.
- Scar, tattoo, hair, facial hair, skin tone, muscle focus: compact phrases unless a specific story detail matters.
- Visual keywords and character hook may be longer.

## Image Generation

- Image generation has its own narrow rule file: `IMAGE_GENERATION_RULES.md`.
- During image generation, do not use this file as prompt material.
- Before image generation, fill the final prompt tab (`metaDesign.characterImagePrompt` and `metaDesign.characterImagePromptCn`) as the last attribute-generation step.
- The final prompt tab is the single source of truth for the character image.
- Profile attributes and generation notes may guide how the final prompt is written, but must not be appended to the image prompt.

## Full-Body Prompt Guardrails

Every full-body prompt must include these constraints:

- `Single character only.`
- `Full body visible from head to boots.`
- `Generate the character from the current attributes.`
- `The style reference is only for body proportion and drawing style; do not copy the reference character.`
- `No UI, no infographic, no diagram, no character sheet, no text, no labels, no icons, no scenery.`
- `Pure flat chroma-key background only.`
- `Clean anime cel shading, crisp linework, tidy modern urban fantasy design, minimal dirt and grime.`
- `Urban first, fantasy second; no gritty industrial mood unless explicitly requested.`
- `Bulky soft-strong adult male, not slender; fitted white top system is preferred, such as a tight T-shirt, sleeveless undershirt, or fitted long-sleeve tucked into the waist structure, with subtle torso contours in clean cel shading.`
- `Choose a chroma-key background by contrast: avoid green key for green/cyan/healing/translucent effects; avoid magenta key for pink/violet elements.`
