# 1.0 A-Field Conversion Test Log

This log records conversion-quality checks for the current
`1.0 A-Field Conversion MVP`.

Scope for this round:

- Source: `data/characters.json`
- Converted characters: first 5 existing characters
- Output folder: `experiments/prompt-compiler/output/conversion-test-5`
- Current pass: conversion-quality rules updated, no new clothing modules added

## Current Pass Summary

The basic 1.0 to 2.0 conversion chain remains stable, and the coarse inference
issues from the previous pass are reduced.

Fixed in this pass:

- `地下街雨线观测员` now maps to `rain_infrastructure_observer`, not `underground_fitness_trainer`.
- `避难所夜校引导员` now maps to `shelter_night_school_guide`, not `warehouse_logistics_guard`.
- `港区压力阀检修员` now maps to `harbor_pressure_maintenance`, not `clock_tower_maintainer`.
- `图书馆垂直书库管理员` now maps to `library_stack_keeper`, with book/library motifs extracted.
- `中国北方城市家庭` keeps `中国北方`.
- `中国南港工人家庭` maps to `harbor_district`.
- Missing `forbiddenDirectTool` now gets fallback guardrails when possible.

Remaining weak spots:

- `visualKeywordExtraction.materialWords` is still sparse when source text does
  not explicitly mention materials.
- Some prompts can still feel slightly long because `characterHook` is carried
  into `themeSummary`.
- The fallback guardrail is rule-based and small; it should be expanded only
  after more conversion tests show repeated gaps.

## Test 1

- 角色名: 钟砚泊
- skeleton: `output/conversion-test-5/character-0-converted-skeleton.json`
- prompt: `output/conversion-test-5/character-0-converted-prompt.md`
- 新 themeCategory: `clock_tower_maintainer`
- themeInference:
  - confidence: `1`
  - matchedKeywords: `钟楼`, `秒针`
  - fallbackUsed: `false`
- occupation 是否成功进入 occupationInfluence: Yes, `城市钟楼秒差校准师`
- heritage 是否被清洗成 heritageBase / regionContext: Yes
  - heritageBase: `中国华北`
  - regionContext: `north_china_old_city`
- visualKeywords 是否被拆成 role/body/clothing/material/color/motif/prop/promptHints: Yes
  - motifWords: `钟楼`, `秒针`, `秒格`, `校准`
  - propWords: `扳轮`, `铜秒针扳轮`
  - materialWords: `铜`
- characterHook 是否进入 themeSummary: Yes
- colorLanguage 是否进入 designLanguage.migratedPalette: Yes
- forbiddenDirectTool 是否进入 guardrails: Yes
  - `普通扳手`, `普通钟表`, `普通怀表`, `普通螺丝刀`
- fallback guardrail 是否生效: No, source guardrail existed
- final prompt 是否自然: Mostly yes
- 是否出现字段原文硬塞: No full `visualKeywords` paste found
- 是否出现地域刻板化: No obvious issue
- 是否出现职业直译服装或工具: Controlled by guardrail
- 是否保留角色识别度: Yes
- 主要问题: `themeSummary` still carries a long hook sentence
- 下一步建议: Later add hook compression rules

## Test 2

- 角色名: 陆页钧
- skeleton: `output/conversion-test-5/character-1-converted-skeleton.json`
- prompt: `output/conversion-test-5/character-1-converted-prompt.md`
- 新 themeCategory: `library_stack_keeper`
- themeInference:
  - confidence: `1`
  - matchedKeywords: `图书馆`, `书库`, `垂直书库`, `书签`, `馆员`
  - fallbackUsed: `false`
- occupation 是否成功进入 occupationInfluence: Yes, `图书馆垂直书库管理员`
- heritage 是否被清洗成 heritageBase / regionContext: Improved
  - heritageBase: `中国北方`
  - regionContext: `north_china_old_city`
- visualKeywords 是否被拆成 role/body/clothing/material/color/motif/prop/promptHints: Improved
  - motifWords: `图书馆`, `书库`, `书签`, `馆员`
  - propWords: `书签`, `重力书签锤`
  - materialWords: none from source
- characterHook 是否进入 themeSummary: Yes
- colorLanguage 是否进入 designLanguage.migratedPalette: Yes
- forbiddenDirectTool 是否进入 guardrails: Yes
  - `普通书本`, `普通书签`, `普通书车`, `馆员印章`
- fallback guardrail 是否生效: No, source guardrail existed
- final prompt 是否自然: Mostly yes
- 是否出现字段原文硬塞: No full `visualKeywords` paste found
- 是否出现地域刻板化: Mild risk remains because `北方城市` maps to `north_china_old_city`; acceptable for now
- 是否出现职业直译服装或工具: Guardrail reduces risk
- 是否保留角色识别度: Yes
- 主要问题: No material words extracted because source lacks explicit material terms
- 下一步建议: Keep as-is until more book/library samples show a repeated material gap

## Test 3

- 角色名: 沈泷衡
- skeleton: `output/conversion-test-5/character-2-converted-skeleton.json`
- prompt: `output/conversion-test-5/character-2-converted-prompt.md`
- 新 themeCategory: `rain_infrastructure_observer`
- themeInference:
  - confidence: `1`
  - matchedKeywords: `雨线`, `地下街`
  - fallbackUsed: `false`
- occupation 是否成功进入 occupationInfluence: Yes, `地下街雨线观测员`
- heritage 是否被清洗成 heritageBase / regionContext: Yes
  - heritageBase: `中国华东`
  - regionContext: `coastal_neighborhood`
- visualKeywords 是否被拆成 role/body/clothing/material/color/motif/prop/promptHints: Improved
  - motifWords: `雨线`, `地下街`
  - propWords: `雨尺伞骨`
  - materialWords: none from source
- characterHook 是否进入 themeSummary: Yes
- colorLanguage 是否进入 designLanguage.migratedPalette: Yes
- forbiddenDirectTool 是否进入 guardrails: Yes
  - `普通雨伞`, `普通水桶`, `排水扳手`, `普通雨衣`
- fallback guardrail 是否生效: No, source guardrail existed
- final prompt 是否自然: Better than previous pass
- 是否出现字段原文硬塞: No full `visualKeywords` paste found
- 是否出现地域刻板化: No obvious issue
- 是否出现职业直译服装或工具: Guardrail reduces ordinary rain-tool risk
- 是否保留角色识别度: Yes, rain-line and rain-gauge prop remain clear
- 主要问题: Material extraction still misses implied transparent/waterproof material if not explicitly in visualKeywords
- 下一步建议: If image tests lack rain-material flavor, add material fallback from themeCategory rather than source text

## Test 4

- 角色名: 司澄阙
- skeleton: `output/conversion-test-5/character-3-converted-skeleton.json`
- prompt: `output/conversion-test-5/character-3-converted-prompt.md`
- 新 themeCategory: `shelter_night_school_guide`
- themeInference:
  - confidence: `1`
  - matchedKeywords: `避难所`, `夜校`, `引导员`
  - fallbackUsed: `false`
- occupation 是否成功进入 occupationInfluence: Yes, `避难所夜校引导员`
- heritage 是否被清洗成 heritageBase / regionContext: Yes
  - heritageBase: `中国华东`
  - regionContext: `fantasy_mixed_city`
- visualKeywords 是否被拆成 role/body/clothing/material/color/motif/prop/promptHints: Improved
  - motifWords: `避难所`, `夜校`, `引导`
  - propWords: `折叠门槛盾`
  - materialWords: none from source
- characterHook 是否进入 themeSummary: Yes
- colorLanguage 是否进入 designLanguage.migratedPalette: Yes
- forbiddenDirectTool 是否进入 guardrails: Yes
  - `教鞭`, `粉笔`, `点名册`, `普通扩音器`
- fallback guardrail 是否生效: No, source guardrail existed
- final prompt 是否自然: Better than previous pass
- 是否出现字段原文硬塞: No full `visualKeywords` paste found
- 是否出现地域刻板化: No obvious issue
- 是否出现职业直译服装或工具: Guardrail reduces school-tool risk
- 是否保留角色识别度: Yes, shelter/night-school guide identity is clearer
- 主要问题: Could benefit from `安全出口` or `走廊` motifs if present in source
- 下一步建议: Re-check after image tests; do not expand randomly yet

## Test 5

- 角色名: 岚阀司昼
- skeleton: `output/conversion-test-5/character-4-converted-skeleton.json`
- prompt: `output/conversion-test-5/character-4-converted-prompt.md`
- 新 themeCategory: `harbor_pressure_maintenance`
- themeInference:
  - confidence: `1`
  - matchedKeywords: `港区`, `压力阀`, `检修`
  - fallbackUsed: `false`
- occupation 是否成功进入 occupationInfluence: Yes, `港区压力阀检修员`
- heritage 是否被清洗成 heritageBase / regionContext: Improved
  - heritageBase: `中国南港`
  - regionContext: `harbor_district`
- visualKeywords 是否被拆成 role/body/clothing/material/color/motif/prop/promptHints: Improved
  - motifWords: `港区`, `压力阀`, `检修`
  - propWords: none from source
  - materialWords: none from source
- characterHook 是否进入 themeSummary: Yes
- colorLanguage 是否进入 designLanguage.migratedPalette: Yes
- forbiddenDirectTool 是否进入 guardrails: Source missing, fallback generated
  - `普通阀门`, `普通扳手`, `普通压力表`, `普通管钳`, `普通维修工具`
- fallback guardrail 是否生效: Yes
- final prompt 是否自然: Better than previous pass
- 是否出现字段原文硬塞: No full `visualKeywords` paste found
- 是否出现地域刻板化: Improved; now uses harbor district instead of generic fantasy city
- 是否出现职业直译服装或工具: Reduced, but still needs image testing because pressure/valve motifs are close to the job
- 是否保留角色识别度: Yes, port/valve maintenance identity is clearer
- 主要问题: No propWords extracted because source lacks a distinctive transformed prop
- 下一步建议: Do not invent weapon module yet; keep fallback guardrail and evaluate image output first

## Cross-Test Findings

- Stable:
  - `occupation` enters `occupationInfluence`
  - `heritage` cleanup now preserves `北方` and `南港`
  - `themeInference` records selected theme, confidence, matched keywords, and fallback state
  - `visualKeywordExtraction` catches more domain motifs
  - `colorLanguage` enters `designLanguage.migratedPalette`
  - `characterHook` enters `themeSummary`
  - `forbiddenDirectTool` enters `guardrails`
  - fallback guardrail works when source guardrail is missing

- Improved:
  - Wrong theme contamination is reduced in the first 5 samples
  - Harbor region inference works for `南港`
  - Book/library, rain, shelter, and harbor motifs are now recognized

- Still weak:
  - Material extraction depends on explicit material words in source text
  - Some existing source guardrails lack the `普通` prefix consistently
  - `themeSummary` can become long when hook text is vivid

- Recommended next step:
  - Run image tests on the 5 converted prompts.
  - If visual identity is still unclear, improve hook compression and material fallback.
  - Do not start `footwearModule`, `accessoryModule`, `weaponModule`, or full Outfit Coordination Layer yet.

## Prompt Compression Gate v2 Pass

Scope:

- Full final output files:
  - `output/conversion-test-5/character-0-fullFinal-prompt.md`
  - `output/conversion-test-5/character-1-fullFinal-prompt.md`
  - `output/conversion-test-5/character-2-fullFinal-prompt.md`
  - `output/conversion-test-5/character-3-fullFinal-prompt.md`
  - `output/conversion-test-5/character-4-fullFinal-prompt.md`
- Image final output files:
  - `output/conversion-test-5/character-0-imageFinal-prompt.md`
  - `output/conversion-test-5/character-1-imageFinal-prompt.md`
  - `output/conversion-test-5/character-2-imageFinal-prompt.md`
  - `output/conversion-test-5/character-3-imageFinal-prompt.md`
  - `output/conversion-test-5/character-4-imageFinal-prompt.md`

Current imageFinal checks:

| Character | imageFinal length | Paragraphs | Core prop repeats | Top sanity | Outerwear sanity |
|---|---:|---:|---:|---|---|
| 钟砚泊 | 421 chars | 6 | 1 | `运动夹克` downgraded to white fitted innerwear | OK |
| 陆页钧 | 428 chars | 6 | 1 | `短款夹克` downgraded to white fitted innerwear | OK |
| 沈泷衡 | 424 chars | 6 | 1 | `飞行员夹克` downgraded to white fitted vest | OK |
| 司澄阙 | 425 chars | 6 | 1 | OK | OK |
| 岚阀司昼 | 372 chars | 6 | 1 | `风衣` downgraded to white fitted vest | `blazer` replaced with work jacket |

Compression improvements:

- `imageFinal` is now a dedicated output mode for image generation.
- `fullFinal` keeps the longer natural explanation for inspection.
- `imageFinal` stays within 250-450 Chinese characters in all 5 tests.
- `imageFinal` uses no more than 6 natural paragraphs.
- Core props are deduped to one occurrence in the image prompt body.
- Full characterHook text is no longer pasted into imageFinal.
- Clothing is merged into one clothing paragraph instead of one paragraph per module.
- Placeholder wording such as `暂不展开复杂细节` is not present in imageFinal body.
- Body cleanup converts rough phrases such as `中高，线条紧，宽` into natural phrasing like `中高身材，肌肉线条紧实，肩背较宽`.

Module sanity filter results:

- Top module outerwear-like bases are moved to `influenceOnly` and replaced by fitted innerwear anchors.
- Utility themes such as rain infrastructure and harbor pressure maintenance avoid mismatched formal outerwear in imageFinal.
- Debug warnings are stored in `promptCompressionGate.debug.moduleSanityWarnings`.

Remaining risks:

- Some imageFinal prompts are close to the 450-character upper bound.
- Some debug-only raw phrases still appear in `promptCompressionGate.debug`, which is intentional, but should not be copied into image tools.
- Core prop design is still not a real weapon module; it is only compressed and guarded at prompt level.
