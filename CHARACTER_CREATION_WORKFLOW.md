# Character Creation Workflow

This is the top-level workflow for creating or updating a character in the OC Character Bible Workbench.

## Core Principle

Generate in this order:

1. Fill the character profile.
2. Write the final image prompt from that completed profile.
3. Generate the image from the final image prompt only.

The image generation step must not directly read every profile field. The completed profile is used to write `metaDesign.characterImagePrompt` and `metaDesign.characterImagePromptCn`. After that, those final prompt fields become the single source of truth for the image.

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

