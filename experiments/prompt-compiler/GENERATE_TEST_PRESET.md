# Generate Test Preset / 【生成测试】预设

This file is the fixed entry preset for the Oc-Character 2.0 Generate Test Workflow.

When a new Codex session sees the user say `【生成测试】`, it should read this file first and follow the workflow below. This shortcut is for a lightweight image-test prompt-pack workflow, not for changing core generation modules.

When the user says `【生成测试】`, the assistant must not only create files. It must directly display the generated test content in the chat response. Files are backups. The chat response is the primary output.

## Shortcut Meaning

`【生成测试】` means:

- enter the Generate Test Workflow
- use default `exploration` mode, not regression mode
- generate one test by default
- output one case only
- output one prompt pack only
- prepare one image-test-ready section
- directly display the full generated content in chat
- do not output top12, top6, long candidate tables, or a large failed-candidate pool

Quantity parsing:

- `【生成测试】` = 1 test
- `【生成测试 2】` = 2 tests
- `【生成测试 *2】` = 2 tests
- `【生成测试 3】` = 3 tests
- `【生成测试 *3】` = 3 tests

If there is no number, the default count is always 1.

## Required 2.0 Constraints

Every run must read or obey the current 2.0 structure and constraints:

- current `README.md` structure map
- `designLanguage`
- `stylePreferenceLayer`
- `characterFoundationLayer`
- `influenceGenerationLayer`
- `reasonabilityFilter`
- `compositionLayer`
- Prompt Compression Gate
- `topModule`
- `outerwearModule`
- `bottomModule`
- `sockVisibility` logic
- white fitted innerwear body-anchor rule
- broad thick adult male body preference
- large-shape dominant design
- medium-low detail density
- restrained fantasy
- prompt-pack structure
- negative prompt rules
- fixed default reference image for image generation:
  `E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png`

Old regression cases may be used only as regression references. They are not default generation sources.

## Mode Rules

Default `【生成测试】` mode is `exploration`, not `regression`.

Regression mode is only used when the user explicitly requests regression testing, for example:

- `【生成回归测试】`
- `【回归测试】`
- `【测试旧 case】`

Default exploration mode must:

- randomly generate a fresh theme / occupation from current 2.0 influences
- pass through `reasonabilityFilter`
- pass through `compositionLayer`
- pass through `candidateQualityFilter`
- filter out old regression themes
- filter out candidates too similar to old regression cases

Default exploration mode must use this blacklist:

```js
regressionThemeBlacklistForExploration = [
  "harbor_pressure_maintenance",
  "rain_infrastructure_observer",
  "library_stack_keeper",
  "bathhouse_keeper",
  "market_guard",
]
```

If a generated candidate hits this blacklist:

- do not output it
- generate a new candidate
- retry a limited number of times
- if retries fail, output a warning and a non-regression fallback candidate when possible
- do not default back to an old regression case

## Default Reference Image

Default absolute reference image path:

```text
E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png
```

Default project-relative reference image path:

```text
experiments/prompt-compiler/assets/reference/body-style-anchor.png
```

Every `【生成测试】` run that enters image generation must use this image as the
image reference. The reference image binds only body style, style discipline,
and white fitted innerwear body-anchor direction. It is not a character-copy
template.

Allowed inheritance:

- broad thick adult male body type
- very wide shoulders
- thick chest
- strong arms
- thick torso
- sturdy legs
- mature and steady adult male presence
- clean TV anime cel-shaded style
- simple clean linework
- large simplified body-structure feeling
- white fitted innerwear as the core body anchor

Forbidden inheritance:

- face
- facial identity
- hairstyle
- expression
- clothing style
- pants
- shoes
- pose
- colors
- identity setting
- props
- background

Default Reference Image Usage Note for every prompt pack:

```text
Reference image path: E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png
Project relative path: experiments/prompt-compiler/assets/reference/body-style-anchor.png
Use the uploaded reference image only for body style, broad thick adult male proportions, very wide shoulders, thick chest, strong arms, thick torso, sturdy legs, mature steady adult male presence, clean TV anime cel-shaded style, simple clean linework, large simplified body-structure feeling, and white fitted innerwear body-anchor direction.
Do not copy the reference image character identity, face, facial features, hairstyle, expression, clothing style, pants, shoes, pose, colors, props, or background.
```

## Default Workflow

Each test must go through this order:

```text
Step 1. random primary influences
Step 2. derived influences
Step 3. resolved influences
Step 4. reasonabilityFilter
Step 5. compositionLayer
Step 6. candidateQualityFilter
Step 7. outfit generation
Step 8. case summary
Step 9. prompt pack
Step 10. Run Image Generation
```

Step 10 must be written this way in generated output:

```text
Step 10. Run Image Generation

Use reference image:

E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png

Use it only for body style, broad thick adult male proportions, clean TV anime cel-shaded style, and white fitted innerwear body-anchor direction.

Do not copy the reference image character identity, face, hairstyle, clothing, pose, colors, props, or background.
```

If the current environment cannot directly call an image generation tool, the
assistant or script must explicitly output:

```text
Image Generation Unavailable:
当前 Codex 环境只能生成 prompt pack，不能直接调用图像生成工具。请使用以下 reference image path 和 English Prompt 进行图像生成。

Reference image path:
E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png
```

Do not only say `Image Test Ready`, and do not pretend an image was generated.

Randomness should happen at the influence layer. Clothing should be derived from influences. Do not directly randomize a pile of clothing modules. Do not hard-code old case files as the default source.

## Candidate Quality Filter

Before outputting the prompt pack, apply a lightweight candidate quality filter:

```js
candidateQualityFilter: {
  passed: boolean,
  appealScore: number,
  noveltyScore: number,
  coherenceScore: number,
  visualPotentialScore: number,
  regressionSimilarityPenalty: number,
  riskNotes: [],
  rejectReason: string | null
}
```

Score meanings:

- `appealScore`: whether the character is attractive enough to test visually
- `noveltyScore`: whether it avoids repeating old samples, old regression cases, and generic workwear men
- `coherenceScore`: whether person, occupation, region, clothing, and motifs feel natural together
- `visualPotentialScore`: whether motifs can become garment structure instead of badges or flat graphics

Default pass requirements:

- character appeal is present
- suitable for a broad thick adult male body
- outfit has design potential
- `compositionLayer` has room to work
- motifs can become garment structure
- not only generic workwear repetition
- has some region or scene flavor
- white fitted innerwear body anchor remains viable
- suitable for image generation

Default reject reasons:

- old regression case in default exploration mode
- too ordinary
- too tool-like
- too abstract to draw
- motifs are too vague
- too similar to old regression cases
- weak visual potential
- strong conflict with current design system
- strange without being visually appealing
- unsuitable for broad thick adult male body type

Only show the final passed candidate by default. Do not expose failed candidates unless the user explicitly asks for debug.

Regression similarity penalty:

- If candidate theme is one of the old regression cases, `noveltyScore` must be at most 2, `passed` must be false, and `rejectReason` must be `旧 regression case，不用于默认生成测试`.
- If candidate is highly similar to an old regression case, lower `noveltyScore` and add `too similar to regression case` to `riskNotes`.
- Default `【生成测试】` must prefer fresh candidates.

## Output Order

Each test must output in this fixed order in the chat response:

1. Case Summary
2. Chinese Prompt
3. English Prompt
4. Negative Prompt
5. Reference Image Usage Note
6. Observation Checklist
7. Step 10. Run Image Generation
8. Saved Files

For multiple tests, use:

- `Test 01`
- `Test 02`
- `Test 03`

Do not output extra top12, top6, long tables, or large candidate pools by default.

## Case Summary Must Include

- theme / occupation
- regionContext
- personalityCore
- presentationMode
- derived influence summary
- composition idea
- outfit summary
- bottom / sock
- candidate quality summary
- test purpose

## Prompt Pack Must Include

- Test Purpose
- Chinese Prompt
- English Prompt
- Negative Prompt
- Reference Image Usage Note
- Observation Checklist

## Step 10 / Image Generation Input Must Include

- which English Prompt to use
- which Negative Prompt to use
- which Reference Image Usage Note to use
- this run's image-test focus
- default absolute reference image path:
  `E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png`
- default project-relative reference image path:
  `experiments/prompt-compiler/assets/reference/body-style-anchor.png`
- image generation unavailable message when direct image generation is not available

## Saved Files Rule

Saved files must be listed last. File paths must not replace the generated body content.

Required saved files:

- `latest-generate-test-prompt-pack.md`
- `latest-generate-test-summary.md`
- `latest-generate-test-skeleton.json`

## Global Prompt-Pack Rules

Every generated prompt pack must include or obey these rules:

```text
Create one original adult male character, not a costume showcase. Design him as a believable person first, then let the occupation, region, clothing, and motifs support that person.

Use the fixed reference image at `E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png` only for broad thick adult male body type, very wide shoulders, thick chest, thick torso, strong arms, sturdy legs, mature steady adult male presence, clean TV anime cel-shaded style, simple shadow blocks, and white fitted innerwear body anchor direction.

Do not copy the reference identity, face, facial features, hairstyle, expression, clothing style, pants, shoes, pose, colors, props, or background.

The character must feel broad, sturdy, mature, thick-built, slightly soft-muscular, grounded, and readable.

Keep the white fitted inner top visible as a body anchor whenever the design allows it. The inner top should cling to the torso enough to suggest broad chest mass and large, simplified abdominal forms under the fabric. Keep abdominal definition broad, restrained, wrapped, not shredded, not hyper-realistic, and not sexualized.

Clothing should feel like one coherent outfit, not random module stacking. Theme motifs should be translated into garment structure such as panels, seams, guards, pockets, waist structures, shoulder structures, or restrained accents. Do not turn motifs into flat stickers or excessive repeated icons.

Use large-shape dominant design, clear silhouette, medium-low detail density, one main focus, one secondary focus, restrained fantasy, and only a few medium-to-large motifs.

Avoid tiny busy details, overdesigned tactical clutter, excessive straps, dense accessories, text, logo, UI, watermark, multiple characters, prop sheets, turnaround sheets, cropped body, childish proportions, and skinny body.
```

## Default Negative Prompt

```text
photorealistic, realistic rendering, oil painting, painterly thick paint, messy texture, excessive small buckles, excessive straps, tiny ornaments everywhere, dense micro patterns, flat poster pattern pasted on clothes, abstract graphic poster outfit, text, logo, UI, watermark, multiple characters, cropped body, missing feet, bad anatomy, skinny body, childish proportions, big head, six-pack, shredded abs, ripped, wet shirt, oily skin, hyper-realistic muscle, finely segmented abs, sexualized outfit, prop sheet, turnaround sheet
```

## Default Observation Checklist

- 是否是单人全身
- 是否从头到脚完整可见，没有裁切
- 是否保留宽肩厚胸、壮硕厚实成年男性体型
- 是否保持成熟成年男性感觉，不要变瘦、幼化或大头化
- 是否保留白色贴身内搭
- 白色贴身内搭是否像包裹住厚实躯干，而不是松垮普通 T-shirt
- 布料下是否能轻微读出胸肌与腹肌的大块轮廓
- 腹部轮廓是否是大块、概括、克制的，而不是细碎六块腹肌
- 是否避免湿身、油亮、写实健美、过度性感化
- 主题母题是否被转化成服装结构，而不是只贴成徽章或图案
- 是否能看到母题变成了服装块面、分割线、口袋、护片、肩部结构、腰部结构或少量点状呼应
- 服装是否像一整套，而不是随机拼装
- 下装长度是否符合当前 case
- 如果当前 case 要求短裤、裁短裤或露踝裤，是否出现对应裤长
- 如果当前 case 要求白袜，是否出现清楚可见的白色袜子
- 如果当前 case 是 full-length 长裤方向，是否没有乱露白袜
- 主题方向是否清楚，不要变成普通现代路人
- 核心母题是否准确，不要被泛用装饰取代
- 是否保持干净 TV 动画赛璐璐风格
- 是否保持大形主导、中低细节密度、高可读性
- 是否避免大量小扣件、小带子、小挂件、碎纹样
- 是否避免文字、logo、UI、水印
- 是否避免多人、三视图、道具拆解页

## Default Output Files

Generate Test Workflow writes to:

```text
experiments/prompt-compiler/output/generate-test/
```

Default one-test output:

- `latest-generate-test-summary.md`
- `latest-generate-test-prompt-pack.md`
- `latest-generate-test-skeleton.json`

Multi-test output may also include:

- `generate-test-01-prompt-pack.md`
- `generate-test-02-prompt-pack.md`
- `generate-test-03-prompt-pack.md`

## Script Entry

```bash
node experiments/prompt-compiler/scripts/run-generate-test-workflow.js
node experiments/prompt-compiler/scripts/run-generate-test-workflow.js --count 2
node experiments/prompt-compiler/scripts/run-generate-test-workflow.js --count 3
```

The script follows this preset. If a markdown rule cannot be interpreted automatically, the equivalent rule should be hard-coded in the script and kept aligned with this file.

The script or assistant response must print chat-ready / console-ready output containing the full case and prompt pack. `latest-generate-test-prompt-pack.md` is a saved copy, not the primary delivery.

## Do Not

- do not deepen `footwearModule`
- do not deepen `accessoryModule`
- do not deepen `weaponModule`
- do not expand the clothing random library
- do not use old regression cases as default generation sources
- do not let old regression themes enter default exploration output
- do not output only file paths
- do not output top12 or top6 by default
- do not output a large candidate pool by default
- do not show all failed candidates by default
- do not put full debug into `imageFinal`
- do not copy the reference image character's face, clothing, pose, colors, props, or identity
- do not let `【生成测试】` become a heavy long report
