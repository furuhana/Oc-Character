# Prompt Compiler Experiment

## Current Stage / 当前阶段

The 2.0 experiment has completed these MVP pieces:

- `Design Language Layer`
- `Theme Direction Layer`
- `Global Region Context Layer`
- `Full Module Skeleton`
- `Natural Final Prompt Compiler`
- `Top Module MVP`
- `Outerwear Module MVP`
- `Bottom Module MVP`

These modules are not deepened yet:

- `footwearModule`
- `accessoryModule`
- `weaponModule`

Current work should enter the Image Test / 图像验证 stage. The priority is to
test natural final prompts in an image model and record visual results before
adding more module complexity.

For now:

- Do not build the Outfit Coordination Layer yet.
- Do not deepen all remaining modules at once.
- Do not blindly expand random libraries.

Recommended next step:

1. Use the natural final prompts in:

```text
experiments/prompt-compiler/output/test-runs-after-theme
```

2. Record image results in:

```text
experiments/prompt-compiler/IMAGE_TEST_LOG.md
```

3. Decide the next development step from the image-test results:

- If theme direction is not obvious, strengthen `themeDirectionLayer`.
- If the prompt still feels mechanical, continue optimizing Prompt Compiler.
- If the lower body feels too empty, start `bottomModule`.
- If details are still fragmented, add a `designLanguage` checker.

This folder contains a small, isolated MVP for testing:

`Weapon Module -> Prompt Compiler -> Compiled weapon prompt`

It does not change the main character data or the existing image-generation
workflow.

## Design Language Layer

The global design-language config lives at:

```text
experiments/prompt-compiler/config/design-language.json
```

Current MVP scope:

- `designLanguage` is a global aesthetic layer, not outfit coordination.
- It is currently connected to the upper-garment module only.
- New item modules should read the same config after they become mature.
- Outfit coordination should come later, after tops, outerwear, pants, shoes,
  accessories, weapons, and props have stable module behavior.

Run the upper-garment generator with a custom design-language config:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js --design-language experiments/prompt-compiler/config/design-language.json
```

## Full Module Skeleton MVP

This experiment creates the full 2.0 module shell, then compiles it into one
prompt. It intentionally does not add an Outfit Coordination Layer yet.

Included skeleton modules:

- `characterLayer`
- `bodyLayer`
- `faceLayer`
- `expressionLayer`
- `topModule`
- `outerwearModule`
- `bottomModule`
- `footwearModule`
- `accessoryModule`
- `weaponModule`
- `fantasyLayer`
- `styleLayer`

Generate module JSON and compile the final prompt:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed skeleton-test-1 --culture-level 2 --design-language experiments/prompt-compiler/config/design-language.json --mode final
```

Outputs:

```text
experiments/prompt-compiler/output/latest-character-skeleton.json
experiments/prompt-compiler/output/latest-character-prompt.md
```

Compile again from an existing skeleton JSON:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --input experiments/prompt-compiler/output/latest-character-skeleton.json --prompt-output experiments/prompt-compiler/output/latest-character-prompt-from-json.md
```

Debug mode keeps module-like wording for inspection:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed skeleton-test-1 --culture-level 2 --mode debug --prompt-output experiments/prompt-compiler/output/latest-character-prompt-debug.md
```

Final prompt mode hides internal field names and enum values:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed skeleton-test-1 --culture-level 2 --mode final
```

## Theme Direction Layer + Global Region Context

`themeDirectionLayer` gives the character a theme direction and life context.
It is not an Outfit Coordination Layer and does not decide whether every item
matches. It provides visual flavor for `topModule`, `outerwearModule`,
`fantasyLayer`, and the Prompt Compiler.

The layer now separates role theme from regional context:

- `themeCategory` = what the character does.
- `regionContext` = where the character belongs visually.
- `environmentFlavor` = a more specific street, shop, gate, warehouse, or
  neighborhood feeling.
- `culturalInfluenceLevel` = how strongly regional structure may affect
  clothing.

`regionContext` is not a costume generator. It should guide color, material,
street flavor, small structural hints, and a few concentrated motifs without
turning every region into ethnic costume cosplay.

Fields:

- `themeCategory`
- `themeLabel`
- `regionContext`
- `regionLabel`
- `environmentFlavor`
- `environmentKeywords`
- `visualMotifs`
- `materialMood`
- `materialHints`
- `colorHints`
- `structuralHints`
- `fantasyFlavor`
- `culturalInfluenceLevel`
- `modernityLevel`
- `themeSummary`

Example:

```json
{
  "themeCategory": "night_patrol",
  "themeLabel": "夜巡",
  "regionContext": "north_china_old_city",
  "regionLabel": "华北旧城",
  "environmentFlavor": "老城墙",
  "visualMotifs": ["暖气阀", "旧钟", "路灯"],
  "materialMood": "旧铜与磨砂金属",
  "fantasyFlavor": "轻都市奇幻",
  "culturalInfluenceLevel": 1,
  "modernityLevel": "old_city_modern",
  "themeSummary": "整体带有华北旧城夜巡的气质，环境指向老城墙，以旧铜与磨砂金属和灰蓝、煤黑配色作为主题基础，以暖气阀、旧钟、路灯作为少量集中视觉母题。"
}
```

Force a theme category and region context:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed region-test-1 --culture-level 1 --cultural-influence-level 1 --outerwear-presence medium --theme-category night_patrol --region-context north_china_old_city --mode final
```

Generate a non-Japanese night-patrol test:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed rain-night-test --culture-level 1 --outerwear-presence medium --theme-category night_patrol --region-context southeast_asian_rain_street --mode final
```

Generate 10 seeds and inspect regional distribution:

```powershell
$outDir = 'experiments\prompt-compiler\output\region-distribution-10-seeds'; New-Item -ItemType Directory -Force -Path $outDir | Out-Null; 1..10 | ForEach-Object { $seed = "region-eval-$_"; $json = Join-Path $outDir "$seed.json"; $md = Join-Path $outDir "$seed.md"; node experiments\prompt-compiler\scripts\compile-character-skeleton.js --seed $seed --culture-level 1 --outerwear-presence medium --design-language experiments\prompt-compiler\config\design-language.json --mode final --module-output $json --prompt-output $md | Out-Null; $s = Get-Content $json -Encoding UTF8 | ConvertFrom-Json; [PSCustomObject]@{ Seed=$seed; Theme=$s.themeDirectionLayer.themeCategory; Region=$s.themeDirectionLayer.regionContext; Env=$s.themeDirectionLayer.environmentFlavor; Level=$s.themeDirectionLayer.culturalInfluenceLevel; Summary=$s.themeDirectionLayer.themeSummary } } | Format-Table -AutoSize
```

## Image Test Log

Use `IMAGE_TEST_LOG.md` to record image-generation results from natural final
prompts. This phase is for visual evaluation only; do not change generation
logic until enough prompt/image results show a repeated pattern.

Current recommendation: run image tests against the 10 natural prompts in
`experiments/prompt-compiler/output/test-runs-after-theme` before deepening
`footwearModule`. Use the results to decide whether the next step should be
strengthening `themeDirectionLayer`, continuing Prompt Compiler cleanup,
starting `footwearModule`, or adding a `designLanguage` checker.

Recommended flow:

1. Generate a final prompt.
2. Use the prompt with the reference image in an image model.
3. Record the seed, prompt file, theme, top/outerwear summaries, visual score,
   and observed issues in:

```text
experiments/prompt-compiler/IMAGE_TEST_LOG.md
```

The log tracks whether outputs preserve large-shape dominant design,
medium-low detail density, clear top/outerwear readability, and distinct theme
direction without drifting back into a default modern urban template.

Deepen modules later in this order:

1. `outerwearModule` - MVP complete
2. `bottomModule` - MVP complete
3. `footwearModule`
4. `accessoryModule`
5. `weaponModule`

## Outerwear Module MVP

`outerwearModule` is the first deepened single-item module after `topModule`.
It remains independent from Outfit Coordination Layer logic.

Implemented fields:

- `presence`: `none`, `light`, `medium`, `heavy`
- `baseType`
- `silhouette`
- `length`
- `cutLanguage`
- `designFocus.primary`
- `designFocus.secondary`
- `structuralFeature`
- `material`
- `finish`
- `wearState`
- `detailScale`
- `readabilityRule`
- `avoidanceRule`
- `promptFragment`

Design-language behavior:

- Uses the shared `designLanguage` object.
- Defaults to medium-large details.
- Keeps visual focus to one main focus plus one secondary focus.
- Avoids high-frequency trims, tiny straps, tiny charms, dense seams, and
  small patterns.
- If `presence` is `none`, the compiler keeps the white fitted top as the main
  upper-body visual.
- If outerwear exists and `wearState` is not `closed`, the prompt fragment asks
  to keep the white fitted top partially visible.

Generate a character skeleton with an active outerwear module:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed outerwear-test-1 --culture-level 2 --outerwear-presence medium --design-language experiments/prompt-compiler/config/design-language.json
```

Generate a no-outerwear test:

```bash
node experiments/prompt-compiler/scripts/compile-character-skeleton.js --seed outerwear-none-test --culture-level 2 --outerwear-presence none --prompt-output experiments/prompt-compiler/output/latest-character-prompt-no-outerwear.md --module-output experiments/prompt-compiler/output/latest-character-skeleton-no-outerwear.json
```

## Run

Generate a random upper-garment brief for Codex:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js
```

One-line upper-garment test command:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js && printf '\n\n===== COPY/EXECUTE THIS UPPER GARMENT BRIEF =====\n\n' && cat experiments/prompt-compiler/output/latest-upper-garment-ai-brief.md && printf '\n\n请执行上面的 Brief，严格按指定格式填写，不要总结，不要只展示 Brief 原文。最终提示词必须压缩成 1 句，中文 70-130 字，绝对不要超过 150 个中文字，并适配干净 TV 动画赛璐璐风格，主动做动画化降噪。\n'
```

Stable upper-garment test:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js --seed upper-test-1
```

Lock one upper-garment base or influence:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js --base 飞行员夹克 --influence 天文馆穹幕放映员 --seed pilot-planetarium-1
```

Modern base with light traditional structure:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js --base Hoodie --culture-level 1 --seed modern-traditional-1
```

Modernized traditional base:

```bash
node experiments/prompt-compiler/scripts/generate-random-upper-garment.js --culture-level 2 --seed traditional-modernized-1
```

Generate a random weapon brief for Codex:

```bash
node experiments/prompt-compiler/scripts/generate-random-weapon.js
```

The command writes an AI brief to:

```text
experiments/prompt-compiler/output/latest-weapon-ai-brief.md
```

Open a new Codex session and run:

```bash
cat experiments/prompt-compiler/output/latest-weapon-ai-brief.md
```

Then ask Codex to follow the brief exactly. This tests AI interpretation and
prompt compilation instead of JS template filling.

One-line test command:

```bash
node experiments/prompt-compiler/scripts/generate-random-weapon.js && printf '\n\n===== COPY/EXECUTE THIS BRIEF =====\n\n' && cat experiments/prompt-compiler/output/latest-weapon-ai-brief.md && printf '\n\n请执行上面的 Brief，严格按指定格式填写，不要总结，不要只展示 Brief 原文。最终提示词必须压缩成 1 句，中文 60-120 字，绝对不要超过 140 个中文字。\n'
```

Stable test with a fixed seed:

```bash
node experiments/prompt-compiler/scripts/generate-random-weapon.js --seed test-1
```

Lock one influence source or archetype:

```bash
node experiments/prompt-compiler/scripts/generate-random-weapon.js --role 花匠 --archetype 斧头 --seed garden-axe-1
```

Compile an existing module file:

```bash
node experiments/prompt-compiler/scripts/compile-weapon-module.js experiments/prompt-compiler/examples/weapon-module-gardener-axe.json
```

The command prints weapon name, archetype, influence source, generation
guidance, final prompt, module summary, and validation checks.

Other examples:

```bash
node experiments/prompt-compiler/scripts/compile-weapon-module.js experiments/prompt-compiler/examples/weapon-module-archive-hammer.json
node experiments/prompt-compiler/scripts/compile-weapon-module.js experiments/prompt-compiler/examples/weapon-module-planetarium-spear.json
```

## Acceptance Questions

- Is the weapon a concrete drawable object?
- Does the compiled prompt explain the weapon visually, not only by name?
- Does the role influence avoid direct occupation-tool copying?
- Are chroma-key risks surfaced as warnings?
- Is the output clearer and more stable than hand-writing the weapon sentence?
