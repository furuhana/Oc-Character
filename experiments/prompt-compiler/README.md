# Prompt Compiler Experiment

## Current Stage / 当前阶段

The 2.0 experiment has completed these MVP pieces:

- `Design Language Layer`
- `Theme Direction Layer`
- `Global Region Context Layer`
- `1.0 A-Field Conversion MVP`
- `characterFoundationLayer`
- `influenceSourceLayer`
- `Full Module Skeleton`
- `Natural Final Prompt Compiler`
- `Top Module MVP`
- `Outerwear Module MVP`
- `Bottom Module MVP`
- `Light Outfit Coherence Check`
- `Influence Generation Layer MVP`
- `Reasonability Filter MVP`
- `Composition Layer MVP`

These modules are not deepened yet:

- `footwearModule`
- `accessoryModule`
- `weaponModule`

Current work is ready for the next Image Test / 图像验证 pass. The priority is
to confirm whether `compositionLayer` turns theme motifs into garment structure
instead of simple badges, icons, or decorative stickers.

## Generate Test Shortcut / 【生成测试】快捷工作流

When the user says `【生成测试】`, read:

```text
experiments/prompt-compiler/GENERATE_TEST_PRESET.md
```

and follow that preset.

Default behavior:

- exploration mode
- one test only
- random but reasoned candidate
- uses current 2.0 constraints
- uses the default body-style reference image
- direct chat output required
- outputs case summary
- outputs Chinese / English prompt pack
- outputs Step 10 / image generation input content
- files are saved as backup
- old regression cases are excluded unless explicitly requested

Default `【生成测试】` excludes these old regression themes:

- `harbor_pressure_maintenance`
- `rain_infrastructure_observer`
- `library_stack_keeper`
- `bathhouse_keeper`
- `market_guard`

Use regression cases only when the user explicitly requests `【生成回归测试】`,
`【回归测试】`, or `【测试旧 case】`.

Quantity behavior:

- `【生成测试】` = 1 test
- `【生成测试 2】` = 2 tests
- `【生成测试 *2】` = 2 tests
- `【生成测试 3】` = 3 tests
- `【生成测试 *3】` = 3 tests

The default absolute reference image path is:

```text
E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png
```

The default project-relative reference image path is:

```text
experiments/prompt-compiler/assets/reference/body-style-anchor.png
```

Every `【生成测试】` run that enters image generation must use this image as the
image reference. The reference image is used only for broad thick adult male
body style, very wide shoulders, thick chest, strong arms, thick torso, sturdy
legs, mature steady adult male presence, clean TV anime cel-shaded style,
simple clean linework, large simplified body structure, and white fitted
innerwear body-anchor direction. It must not be copied as identity, face,
facial features, hairstyle, expression, clothing style, pants, shoes, pose,
colors, props, or background.

Image generation step:

```text
Step 10. Run Image Generation

Use reference image:

E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png

Use it only for body style, broad thick adult male proportions, clean TV anime cel-shaded style, and white fitted innerwear body-anchor direction.

Do not copy the reference image character identity, face, hairstyle, clothing, pose, colors, props, or background.
```

If the current Codex environment cannot directly call image generation, output:

```text
Image Generation Unavailable:
当前 Codex 环境只能生成 prompt pack，不能直接调用图像生成工具。请使用以下 reference image path 和 English Prompt 进行图像生成。

Reference image path:
E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png
```

Do not only say `Image Test Ready`, and do not pretend an image was generated.

Script entry:

```bash
node experiments/prompt-compiler/scripts/run-generate-test-workflow.js
node experiments/prompt-compiler/scripts/run-generate-test-workflow.js --count 2
node experiments/prompt-compiler/scripts/run-generate-test-workflow.js --count 3
```

Default output directory:

```text
experiments/prompt-compiler/output/generate-test/
```

For now:

- Do not build the Outfit Coordination Layer yet.
- Do not deepen all remaining modules at once.
- Do not blindly expand random libraries.

Recommended next step:

1. Review the composition-layer test log:

```text
experiments/prompt-compiler/COMPOSITION_LAYER_TEST_LOG.md
```

2. Use current `imageFinal` prompts for image testing and record results in:

```text
experiments/prompt-compiler/IMAGE_TEST_LOG.md
```

3. Decide the next development step from the image-test results:

- If influence variation is still not clear, expand `primaryInfluences` /
  `derivedInfluences` instead of blindly expanding clothing libraries.
- If `reasonabilityFilter` over-corrects, tune the filter before adding modules.
- If theme direction is not obvious, strengthen `themeDirectionLayer`.
- If motif-to-garment translation still looks like pasted badges, tune
  `compositionLayer` before adding new modules.
- If the prompt still feels mechanical, continue optimizing Prompt Compiler.
- If lower-body variation feels weak, tune `bottomModule` length and
  `sockVisibility` weights rather than starting a new module.
- If details are still fragmented, add a `designLanguage` checker.

This folder contains a small, isolated MVP for testing:

`Structured modules -> Prompt Compiler -> Natural final character prompt`

It does not change the main character data or the existing image-generation
workflow.

## Current 2.0 Structure Map

The current experiment is no longer only random clothing generation. It now has
two input paths:

- Random 2.0 skeleton generation.
- 1.0 character JSON conversion into a 2.0 skeleton.

Current main layers:

| Layer | Purpose | Current status |
|---|---|---|
| `characterFoundationLayer` | Clean person baseline: age, body, face, skin, hair, expression, simple heritage base. | Active for 1.0 conversion MVP. |
| `influenceSourceLayer` | High-value concept sources from occupation and combat fields. | Active for 1.0 conversion MVP. |
| `influenceGenerationLayer` | Generates primary, derived, and resolved influence sources before module generation. | Active MVP. |
| `reasonabilityFilter` | Checks and lightly fixes common mismatches before final prompt output. | Active MVP. |
| `themeDirectionLayer` | Role theme, visual motifs, material mood, hook, special prop. | Active. |
| `compositionLayer` | Converts core motifs into garment panels, seams, pockets, guards, and small accent echoes. | Active MVP. |
| `regionContextLayer` | Clean region inference from 1.0 heritage. | Active for 1.0 conversion MVP. |
| `designLanguage` | Global visual discipline: large shapes, readability, detail density, palette. | Active. |
| `stylePreferenceLayer` | Minimal global render preference: clear Kyoto-animation-like line quality and clean cel shading. | Active, intentionally narrow. |
| `outfitCoherenceCheck` | Light upper-body consistency check across theme, top, outerwear. | Active. |
| `topModule` | Upper garment MVP. | Active. |
| `outerwearModule` | Outerwear MVP. | Active. |
| `bottomModule` | Bottom MVP, still intentionally light. | Active. |
| `footwearModule` | Minimal placeholder. | Not deepened. |
| `accessoryModule` | Minimal placeholder. | Not deepened. |
| `weaponModule` | Minimal placeholder in full character skeleton. | Not deepened. |
| `Prompt Compiler` | Builds debug output or natural final prompt. | Active. |

Current rule of thumb:

- 1.0 fields are treated as influence sources, not final prompt text.
- `visualKeywords` must be split into structured buckets before use.
- `heritage` must be cleaned before it becomes `heritageBase`.
- `occupation` must not directly decide clothing or become a normal job tool.
- `forbiddenDirectTool` must enter guardrails.
- `regionContext` must not become national costume generation.

## Influence Generation Layer + Reasonability Filter

This MVP moves the experiment away from pure module-weight randomness. The
intended flow is:

```text
primary influences
-> derived influences
-> resolved influences
-> reasonability filter
-> module generation
-> prompt compression
-> imageFinal
```

`influenceGenerationLayer` has this shape:

```json
{
  "primaryInfluences": {},
  "derivedInfluences": {},
  "resolvedInfluences": {},
  "influenceReasoningLog": []
}
```

`primaryInfluences` are the first random or user-locked source items:

- `themeCategory`
- `regionContext`
- `ageRange`
- `bodyArchetype`
- `personalityCore`
- `presentationMode`
- `occupationSeed`
- `worldFlavorSeed`

`derivedInfluences` are not parallel random fields. They are inferred from the
primary sources, for example:

- `climateInfluence`
- `environmentInfluence`
- `lifestyleInfluence`
- `materialInfluence`
- `colorInfluence`
- `culturalStructureInfluence`
- `bottomLengthBias`
- `sockBias`
- `outerwearBias`
- `propBias`
- `fantasyDensity`
- `formalityLevel`
- `practicalityLevel`

`resolvedInfluences` are the stable downstream source. Current modules should
prefer these over directly reading every primary field.

`reasonabilityFilter` checks the generated skeleton before final prompt output.
It can warn and apply small fixes for:

- region / climate mismatch
- occupation / outerwear mismatch
- `presentationMode` / bottom length mismatch
- bottom length / sock visibility mismatch
- overly strong traditional structure
- direct occupation-tool translation risk
- too many must-render motifs
- modules competing for too much complexity
- prompt verbosity that should stay debug-only

The filter output is:

```json
{
  "passed": true,
  "score": 96,
  "warnings": [],
  "fixesApplied": [],
  "rejectedCombinations": [],
  "finalDecision": "passed with light checks"
}
```

Current constraints:

- Do not build the full Outfit Coordination Layer yet.
- Do not deepen `footwearModule`, `accessoryModule`, or `weaponModule` yet.
- Do not blindly expand random libraries.
- Do not let all influence fields enter `imageFinal`; most reasoning belongs in
  debug or the skeleton JSON.

Recommended next step:

- If this layer stays stable, enter image testing again with the current
  `imageFinal` prompts.
- If motif-to-garment translation still looks like pasted badges, tune
  `compositionLayer` before adding new modules.
- If the filter over-corrects, tune `reasonabilityFilter` before adding modules.
- If variation still feels weak, expand `primaryInfluences` and
  `derivedInfluences` instead of expanding clothing libraries first.

## Composition Layer MVP / Motif-to-Garment Composition Layer

`compositionLayer` is a small Motif-to-Garment Composition Layer. Its goal is
to take core visual motifs from `themeDirectionLayer`, `regionContext`, and
occupation-derived influences, then turn them into garment structure:

- large garment panels
- seam and split-line placement
- pockets and pocket flaps
- guard plates or shoulder patches
- shoulder and waist structure
- small point accents used only as restrained echoes

This layer exists because theme motifs such as pressure valves, pipe lines,
rain lines, water-level marks, bookmarks, index tabs, steam, hot-water pipes,
and market signs should become clothing design language, not just a badge on
the chest or a small repeated pattern.

Current flow:

```text
themeDirectionLayer / resolvedInfluences
-> compositionLayer
-> topModule / outerwearModule / bottomModule
-> reasonabilityFilter
-> Prompt Compression Gate
-> imageFinal
```

The MVP structure is:

```json
{
  "sourceMotifs": [],
  "extractedElements": {
    "points": [],
    "lines": [],
    "planes": []
  },
  "compositionGrammar": {},
  "garmentMapping": {},
  "complexityControl": {},
  "compositionReasoningLog": [],
  "promptFragment": ""
}
```

`sourceMotifs` keeps only 1-3 core motifs. `extractedElements` breaks them into
limited point, line, and plane candidates for internal reasoning. `compositionGrammar`
chooses a small arrangement / rhythm / transformation variation. `garmentMapping`
maps the result to one main garment area and one small echo area. `promptFragment`
is the only part intended for `imageFinal`, and it must read as natural clothing
description.

Example `imageFinal` expression:

```text
服装将雨线和水位刻度转成前襟透明防雨片，用竖向线条贯穿前身，线条在边缘克制中断，主块面分成两段，不遮白色内搭。
```

What this layer does not do:

- It does not copy reference images.
- It does not paste flat patterns across the whole outfit.
- It does not output tutorial terms such as `点线面`, `布尔`, or `平面构成` in
  `imageFinal`.
- It does not cover or weaken the white fitted innerwear body anchor.
- It does not turn clothing into an abstract poster.
- It does not develop `footwearModule`, `accessoryModule`, or `weaponModule`.

The current recommendation is to run image tests from `imageFinal` and check
whether `compositionLayer` makes theme motifs feel like garment structure rather
than pasted badges.

### Style Preference Layer

`stylePreferenceLayer` is intentionally minimal. It currently keeps only two
stable style preferences:

```json
{
  "lineQuality": "京都动画式清爽线条",
  "shadowStyle": "干净赛璐璐阴影"
}
```

It does not import broad body-rendering rules or long negative style lists from
1.0. Those are treated as debug or authoring preferences unless image tests show
they are actually needed.

## 1.0 Valuable Influence Sources

The current migration uses only the first A-level fields from
`docs/GENERATOR_1_0_STRUCTURE.md`.

Migrated fields:

| 1.0 field | 2.0 destination | Use |
|---|---|---|
| `coreIdentity.occupation` | `influenceSourceLayer.occupationInfluence` | Identity and life-context influence, not direct clothing/weapon output. |
| `coreIdentity.heritage` | `regionContextLayer` + `characterFoundationLayer.heritageBase` | Soft region inference and clean origin label. |
| `coreIdentity.age` | `characterFoundationLayer.age` | Age read in final prompt. |
| `coreIdentity.height` | `characterFoundationLayer.height` | Body scale. |
| `coreIdentity.weight` | `characterFoundationLayer.weight` | Body scale. |
| `personality.corePersonality` | `characterFoundationLayer.personalityCore` | Expression and presence flavor. |
| `visualIdentity.bodyType` | `characterFoundationLayer.bodyType` | Body baseline. |
| `visualIdentity.muscleLevel` | `characterFoundationLayer.muscleLevel` | Body mass and strength. |
| `visualIdentity.shoulderWidth` | `characterFoundationLayer.shoulderWidth` | Silhouette emphasis. |
| `visualIdentity.skinTone` | `characterFoundationLayer.skinTone` | Appearance baseline. |
| `visualIdentity.faceShape` | `characterFoundationLayer.faceShape` | Face baseline. |
| `visualIdentity.expression` | `characterFoundationLayer.expression` | Face/emotion baseline. |
| `visualIdentity.hairStyle` | `characterFoundationLayer.hairStyle` | Hair baseline. |
| `visualIdentity.hairColor` | `characterFoundationLayer.hairColor` | Hair color. |
| `combatSystem.battleArchetype` | `influenceSourceLayer.combatArchetype` | Combat posture and prop logic influence. |
| `combatSystem.visualWeapon` | `influenceSourceLayer.visualWeapon` + `themeDirectionLayer.specialVisualProp` | Drawable prop source. |
| `combatSystem.combatFunction` | `influenceSourceLayer.combatFunction` | Prop/action function influence. |
| `combatSystem.weaponPreference` | `influenceSourceLayer.weaponPreference` | Preferred final prop direction. |
| `combatSystem.forbiddenDirectTool` | `guardrails.noDirectTool` | Avoid direct occupation-tool output. |
| `metaDesign.characterHook` | `themeDirectionLayer.characterHook` + `themeSummary` | Theme logic, compressed into the theme summary. |
| `visualIdentity.visualKeywords` | `themeDirectionLayer.visualKeywordExtraction` | Split into structured visual buckets. |
| `visualIdentity.colorLanguage` | `designLanguage.migratedPalette` | Palette guidance. |

Intentionally not migrated yet:

- `socialSystem`
- `hiddenInformation`
- romance / preferredType / possessiveness
- food allergy
- pets
- birthday
- `assets`
- `agentMarks`
- developer settings
- full `costumeSystem`

Reason: these fields can add character depth, but they are noisy as direct
visual-generation inputs. They should not pollute the current visual skeleton.

### Heritage Cleanup

1.0 often stores heritage as an over-written phrase, such as:

```text
中国华北旧城家庭
```

2.0 now splits this into:

```json
{
  "heritageRaw": "中国华北旧城家庭",
  "heritageBase": "中国华北",
  "country": "中国",
  "regionHint": "华北",
  "localityFlavor": "旧城",
  "inferredRegionContext": "north_china_old_city"
}
```

Only the clean `heritageBase` should enter `characterFoundationLayer`. Local
flavor belongs in `regionContextLayer` and `themeDirectionLayer`, not in the
person baseline.

### Visual Keyword Extraction

`visualIdentity.visualKeywords` is not pasted into the final prompt. It is split
into:

```json
{
  "roleWords": [],
  "bodyWords": [],
  "clothingWords": [],
  "materialWords": [],
  "colorWords": [],
  "motifWords": [],
  "propWords": [],
  "promptHints": []
}
```

Example source:

```text
厚重钟楼校准师，白色贴身短袖，膝下短工装裤，长袜厚靴，铜秒针扳轮，蓝黑腰封，琥珀秒格光
```

Example extraction:

```json
{
  "roleWords": ["钟楼校准师", "城市钟楼秒差校准师"],
  "bodyWords": ["厚重"],
  "clothingWords": ["白色贴身短袖", "膝下短工装裤", "长袜厚靴", "蓝黑腰封"],
  "materialWords": ["铜"],
  "colorWords": ["白色", "蓝黑", "琥珀"],
  "motifWords": ["钟楼", "秒针", "秒格", "校准"],
  "propWords": ["扳轮", "铜秒针扳轮"],
  "promptHints": ["厚重钟楼校准师", "白色贴身短袖", "琥珀秒格光"]
}
```

The compiler may use these as compact prompt hints, such as a white fitted
innerwear anchor or a concentrated prop motif, but should not copy the whole
source sentence.

## Design Language Layer

The global design-language config lives at:

```text
experiments/prompt-compiler/config/design-language.json
```

Current MVP scope:

- `designLanguage` is a global aesthetic layer, not outfit coordination.
- It is read by the current skeleton modules and the Prompt Compiler.
- `designLanguage.migratedPalette` can receive `visualIdentity.colorLanguage`
  from a converted 1.0 character.
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

## 1.0 A-Field Conversion MVP

The first 1.0-to-2.0 migration experiment converts only the first A-level
visual influence fields from a 1.0 character JSON. It does not migrate social,
romance, hidden info, pets, birthday, assets, agent marks, or developer
settings.

The goal is not to recreate the 1.0 final prompt. The goal is to turn valuable
1.0 fields into a clean person foundation and a small set of influence sources
that the 2.0 Prompt Compiler can use.

Converted target layers:

- `characterFoundationLayer`
- `influenceSourceLayer`
- `themeDirectionLayer`
- `regionContextLayer`
- `designLanguage.migratedPalette`
- `guardrails`

Current conversion example:

```json
{
  "characterFoundationLayer": {
    "age": "36",
    "height": "192 cm",
    "weight": "123 kg",
    "heritageBase": "中国华北",
    "bodyType": "非常厚实魁梧的成年男性",
    "muscleLevel": "极高，胸肩手臂和小腿都很厚",
    "shoulderWidth": "极宽肩，胸背厚重"
  },
  "influenceSourceLayer": {
    "occupationInfluence": "城市钟楼秒差校准师",
    "combatArchetype": "近战节拍控制者",
    "visualWeapon": "铜秒针扳轮",
    "weaponPreference": "铜秒针扳轮与折叠秒差计"
  },
  "guardrails": {
    "noDirectTool": ["普通扳手", "普通钟表", "普通怀表", "普通螺丝刀"]
  }
}
```

Default test using the first sample in `data/characters.json`:

```powershell
node experiments\prompt-compiler\scripts\convert-1-0-character-to-2-0-skeleton.js --input data\characters.json --character-index 0 --seed converted-clocktower-test --culture-level 1 --cultural-influence-level 1 --outerwear-presence medium; Get-Content experiments\prompt-compiler\output\converted-character-prompt.md -Encoding UTF8
```

Outputs:

```text
experiments/prompt-compiler/output/converted-character-skeleton.json
experiments/prompt-compiler/output/converted-character-prompt.md
```

Select a character by name:

```powershell
node experiments\prompt-compiler\scripts\convert-1-0-character-to-2-0-skeleton.js --input data\characters.json --name 钟砚泊 --seed converted-name-test
```

Print the converted natural prompt in PowerShell:

```powershell
node experiments\prompt-compiler\scripts\convert-1-0-character-to-2-0-skeleton.js --input data\characters.json --character-index 0 --seed converted-clocktower-test --culture-level 1 --cultural-influence-level 1 --outerwear-presence medium; Write-Host "`n===== CONVERTED 2.0 FINAL PROMPT =====`n"; Get-Content experiments\prompt-compiler\output\converted-character-prompt.md -Encoding UTF8
```

Inspect converted structure without printing large 1.0 assets:

```powershell
$s = Get-Content experiments\prompt-compiler\output\converted-character-skeleton.json -Encoding UTF8 | ConvertFrom-Json; $s.characterFoundationLayer; $s.influenceSourceLayer; $s.regionContextLayer; $s.themeDirectionLayer.visualKeywordExtraction; $s.guardrails
```

`visualIdentity.visualKeywords` is split into role, body, clothing, material,
color, motif, prop, and prompt-hint buckets. The compiler uses those buckets as
structured influence and does not paste the whole visual keyword sentence into
the final prompt.

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

Current recommendation: run image tests against current `imageFinal` prompts
before deepening `footwearModule`. Focus on whether `compositionLayer` turns
theme motifs into garment panels, seams, pockets, guards, and restrained echoes
instead of pasted badges. Use the results to decide whether the next step should
be tuning `compositionLayer`, strengthening `themeDirectionLayer`, continuing
Prompt Compiler cleanup, tuning `bottomModule` / `sockVisibility`, starting
`footwearModule`, or adding a `designLanguage` checker.

Recommended flow:

1. Generate a final prompt.
2. Use the prompt with the fixed reference image in an image model:
   `E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png`
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
