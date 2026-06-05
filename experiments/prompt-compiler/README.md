# Prompt Compiler Experiment

This folder contains a small, isolated MVP for testing:

`Weapon Module -> Prompt Compiler -> Compiled weapon prompt`

It does not change the main character data or the existing image-generation
workflow.

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
