# Image Generation Workflow

This workflow prevents stale references and infographic-style generations.

## Source Of Truth

Use only these fields for full-body image generation:

- `metaDesign.characterImagePrompt`
- `metaDesign.characterImagePromptCn`
- `settings.styleReference.image`

Do not append:

- `GENERATION_RULES.md`
- profile field lists
- generation notes
- UI labels
- module names
- old hard-coded references such as `assets/style-reference-muscle.png`

## Required Steps

1. Prepare the request package.

   ```powershell
   node scripts/prepare-image-generation.js
   ```

   Or for a specific character:

   ```powershell
   node scripts/prepare-image-generation.js <characterId>
   ```

   This always decodes the currently uploaded reference from `settings.styleReference.image` into:

   ```text
   assets/current-style-reference.png
   ```

   It also writes:

   ```text
   tmp/image-generation-request.json
   tmp/image-generation-request.txt
   ```

2. Generate the image in an isolated/projectless thread.

   Use `tmp/image-generation-request.txt` as the generation instruction.
   Before calling imagegen, load or attach `assets/current-style-reference.png` as an actual image input. Do not rely on the local file path as text-only prompt content.

   The generated image must be:

   - one character only
   - full body, head to boots visible
   - flat solid chroma-key background chosen by contrast with the character and effects
   - clean anime cel-shading with crisp linework and tidy shadows
   - modern urban fantasy design unless the final prompt says otherwise
   - urban first, fantasy second: a real-world role with one clear signature magical/ability/equipment hook
   - visually denoised: no dust, grime, rusty texture, oil stains, gritty industrial mood, or muddy shadows unless explicitly requested
   - restrained magical effects; avoid strong diffuse glow unless it is essential to the design
   - no UI, infographic, character sheet, labels, text, scenery, or extra characters

   Chroma-key choice:

   - Use `#00ff00` green only when the character and effects do not contain green/cyan/mint/teal tones.
   - Use `#ff00ff` magenta when the character contains green, mint, teal, cyan, healing effects, plant magic, water-light effects, or transparent green/cyan materials.
   - If the character contains magenta, pink, rose, fuchsia, or violet elements, use green instead.
   - The chosen key color must not appear in the character, props, glow, reflections, semi-transparent materials, or aura.

3. Copy the generated chroma-key PNG into `assets`.

   Use a source name like:

   ```text
   assets/generated-fullbody-<characterIdPrefix>-source.png
   ```

4. Remove the chroma-key background.

   ```powershell
   python C:\Users\m\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py --input assets\generated-fullbody-<characterIdPrefix>-source.png --out assets\generated-fullbody-<characterIdPrefix>.png --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
   ```

5. Verify transparency.

   Check that the final PNG is `RGBA`, alpha extrema include `0`, and all four corners are alpha `0`.

6. Write the final transparent PNG back to the character.

   ```powershell
   node scripts/apply-generated-image.js <characterId> assets\generated-fullbody-<characterIdPrefix>.png
   ```

7. Verify the app data endpoint.

   ```powershell
   Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5178/api/data
   ```

## Reference Rule

The uploaded reference image is only for:

- body proportion
- line quality
- coloring method
- general drawing language

Never copy:

- face
- identity
- clothing
- pose
- props
- colors
- background
