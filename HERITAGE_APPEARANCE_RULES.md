# Heritage Appearance Rules

Use this file when generating identity and appearance fields.

## Purpose

`coreIdentity.heritage` is an upstream identity cue. It may influence face, skin
tone, hair, facial hair, color language, naming flavor, origin, social context,
and the final image prompt.

Do not treat heritage as a stereotype lock. Occupation, age, personality, class,
world setting, fantasy hook, and individual design needs can override the default
appearance tendencies.

## Heritage Field

Write `coreIdentity.heritage` as a compact value:

- Pure heritage: 80%.
- Mixed heritage: 20%.
- Mixed heritage can include only two sources.
- Prefer clear wording such as `东亚纯血`, `南欧纯血`, `东亚/北欧混血`,
  `拉美/西非混血`.
- Keep it usable as a design cue, not a biography paragraph.

## Hair Length Distribution

For adult male characters, use this default distribution unless the character
concept strongly suggests otherwise:

- Very short hair, buzz cut, crew cut, or shaved head: 35%.
- Short hair: 50%.
- Long hair: 15%.

Use occupation, age, discipline, social pressure, fashion sense, combat needs,
and supernatural identity to adjust the result. Long hair should feel intentional
and character-specific, not a default anime lead habit.

## Hair Color

Default hair colors should be low-saturation and mostly dark:

- black
- dark brown
- chestnut black
- gray black
- dark golden brown
- dark red brown
- dark green black
- ash brown
- salt-and-pepper black

Bright colors should usually appear only as small highlights, magical traces,
professional marks, faction signals, aging, or abnormal story details. Avoid
using a bright full-head color by default.

## Facial Hair Distribution

Write facial hair in `visualIdentity.facialHair`.

Default adult male facial hair distribution:

- Dense beard: 10%.
- No facial hair: 25%.
- Stubble: 25%.
- Short beard: 40%.

Use concise visual phrases such as:

- `无胡子`
- `短胡茬`
- `修整短络腮胡`
- `下巴短胡`
- `短八字胡`
- `浓密络腮胡`

Facial hair should coordinate with age, occupation, discipline, grooming habits,
social class, and facial shape. It can make a character warmer, rougher, older,
more formal, more relaxed, or more intimidating, but should not become visual
noise.

## Prompt Rule

When writing `metaDesign.characterImagePrompt` and
`metaDesign.characterImagePromptCn`, include the final hair and facial hair
decision as part of the face/appearance sentence.
