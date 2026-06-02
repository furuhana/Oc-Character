# Image Generation Rules

Use this file only when generating image assets for the workbench.

## Workflow Boundary

Do not start image generation until the character profile has been completed and checked with:

```bash
node scripts/check-character-completeness.js
```

The intended sequence is documented in `CHARACTER_CREATION_WORKFLOW.md`:

1. Fill all character profile modules.
2. Write the final image prompt from the completed profile.
3. Generate the image from the final image prompt only.

## Source Of Truth

- For full-body generation, read only:
  - `metaDesign.characterImagePrompt`
  - `metaDesign.characterImagePromptCn` as secondary clarification
  - `settings.styleReference.image` if it exists
- Do not read scattered profile fields during image generation.
- Do not append generation notes, starter prompt, attribute rules, module labels, UI text, or markdown documentation to the image prompt.
- Profile attributes are used only before this step, when writing the final prompt.

## Full-Body Task

- Generate one character only.
- Generate a full-body character illustration only.
- The full body must be visible from head to feet.
- Use a clean flat chroma-key background so it can be removed locally.
- Do not generate UI, infographics, diagrams, character sheets, text, labels, icons, charts, frames, or explanatory layouts.
- Do not generate objects or environments as the main subject.
- Prefer clean TV anime cel-shading: crisp lines, clean shadow blocks, polished edges, tidy clothing and skin, fresh readable colors.
- Avoid excessive dust, grime, rust, stains, distressed texture, muddy rendering, and gritty industrial-worker styling unless the final prompt explicitly asks for it.
- Prefer modern urban fantasy character design: an ordinary contemporary occupation or social role with an unusual artifact, ability, creature, device, curse, or magical tool as the core visual hook.
- Keep the image visually denoised: no dirty overlays, no gritty texture passes, no dusty atmosphere, no heavy noise, no smudged shadows.
- Use summarized, intentional shadow shapes rather than complex dirty rendering. The character should feel clean, polished, and easy to read at a glance.
- Prefer restrained, readable magical effects over bright complex glows. Strong glow, diffuse light, translucent effects, or semi-transparent materials make chroma-key removal harder.
- When body type is unspecified, prefer a bulky soft-strong adult male: broad shoulders, thick chest, thick arms, rounded muscular mass, and a warm substantial silhouette rather than slender fashion-model proportions.
- If a tight white T-shirt is included, show subtle abdominal contours through the fabric with clean cel-shading. Avoid photoreal skin detail, wet-shirt effects, explicit framing, or hyper-realistic anatomy.

## Chroma-Key Color Choice

- Do not always default to green. Choose the flat background key color by contrast with the character and effects.
- If the prompt includes green, mint, teal, cyan, healing effects, plant magic, water-light effects, transparent green materials, or green/cyan glow, use flat `#ff00ff` magenta.
- If the prompt includes magenta, pink, rose, fuchsia, or violet elements, use flat `#00ff00` green.
- If the character has translucent, diffuse, glowing, or semi-transparent effects, keep those effects restrained and choose the key color furthest from the effect color.
- Never use the chosen key color, or a visually similar color, anywhere on the character, props, aura, reflections, transparent materials, or magical effects.

## Style Reference

- If a style reference image exists, use it only for:
  - broad body proportion
  - silhouette language
  - line quality
  - rendering style
  - anime / game character illustration taste
- Do not copy the reference identity, face, clothing, pose, props, colors, or exact design.
- The final prompt decides the character. The reference decides only the drawing language.

## Local Output Flow

- Save the generated source image separately.
- Remove the chroma-key background locally.
- Save the transparent PNG separately.
- Write the transparent PNG path to:
  - `assets.fullBody`
  - `assets.thumbnail`
