# Expression Design Guide

Use this guide when filling `visualIdentity.expression`, `visualIdentity.lip`,
and the face/expression sentence in `metaDesign.characterImagePrompt` and
`metaDesign.characterImagePromptCn`.

## Purpose

The character image prompt must not default to a closed-mouth calm face. Most
characters can still be emotionally stable, but their visible facial action
should vary. Write expression as a draw-able face direction, not only a mood word.

Every final full-body prompt should include:

- expression family
- mouth shape
- brow or eye action

Good:

- `steady protective expression, mouth slightly open as if giving a low command,
  brows gently lowered`
- `confident toothy grin, one eyebrow raised, eyes bright`
- `strained determined expression, teeth clenched, brows locked`

Weak:

- `calm expression`
- `gentle expression`
- `focused expression`

These weak words may be used only when paired with a visible mouth and brow/eye
action.

## Sample Distribution

The locked reference sample suggests this conservative default spread:

- Restrained stable expression: 40%
- Medium visible expression: 32%
- Strong visible expression: 20%
- Special or extreme expression: 8%

Fatigue cap:

- Tired, sleepy, weary, exhausted, drowsy, or visibly fatigued faces are a rare
  accent, not a default mood.
- Across the last eight recent characters, at most one character may use a
  tired/sleepy/weary face direction.
- Do not use fatigue just because the character works at night, has a difficult
  job, is calm, older, quiet, municipal, protective, or working-class.
- If a concept needs responsibility or long experience, prefer alert, steady,
  protective, controlled, watchful, weathered, or low-command expressions.

Mouth-shape spread:

- Closed mouth, pressed mouth, or flat mouth line: 32%
- Closed-mouth smile, side smile, or controlled smirk: 20%
- Slightly open mouth or speaking mid-sentence: 24%
- Toothy grin or clenched teeth: 12%
- Wide open mouth, shouting, or big laugh: 12%

For new batches, keep closed-mouth variants under 45% across recent characters.
Make speaking, toothy, clenched, shouting, or laughing mouths visibly present.

## Recent-Character Check

Before writing a new final image prompt, inspect the last five recent characters.
Avoid repeating the same mouth shape if it appeared too often.

If recent characters are mostly calm closed-mouth faces, the next character should
use one of:

- speaking mid-sentence
- toothy grin
- clenched teeth
- open-mouth command
- wide laugh
- strained breath with slightly open mouth

Do not solve repetition by making every character extreme. Stable and restrained
faces are still allowed, but their mouth and brow/eye action must be specific.

## Numeric Drivers

Use numerical attributes as probabilities and modifiers, not as absolute labels.
`danger` and `violence` do not automatically mean evil. A dangerous character may
be a protector, a risky profession, a cursed person, or someone with strong combat
responsibility.

### Exposure Level

Start from `stability` and `sanity`.

- High stability and high sanity: restrained or medium expression is more likely.
  Do not ban open mouths; prefer low command, speaking, subtle smile, or controlled
  clenched teeth.
- High stress: increase clenched teeth, tense brows, slight open-mouth breath,
  worried speaking, or strained smile.
- Low stability or low sanity: increase strong or special expressions, especially
  when stress, danger, or desire is also high.
- High social and high confidence: increase toothy smiles, speaking mid-sentence,
  big laugh, side grin, and bright eyes.
- Low social and high stability: increase quiet gaze, pressed mouth, low speaking,
  or minimal side smile.

### Moral Read

Use `morality`, `loyalty`, and `desire` to decide whether danger reads as
protective, neutral, seductive, selfish, or threatening.

- High morality + high loyalty: danger or violence should read protective,
  determined, commanding, or self-sacrificing.
- Low morality + high desire: danger can read charming, predatory, teasing,
  contemptuous, or manipulative.
- Low sanity + high stress: danger can read unstable, strained, frantic, or
  haunted.
- High stability + high danger: danger can read controlled pressure, low threat,
  or quiet dominance.

## Expression Families

Choose one family, then write a visible mouth and brow/eye action.

### Gentle Stable

Use for high morality, high stability, high loyalty, or care roles.

Mouth options:

- soft closed-mouth smile
- small open-mouth reassurance
- low speaking mid-sentence
- warm toothy smile, used sparingly

Brow/eye options:

- relaxed eyes
- softened brows
- slight smile lines
- attentive side glance

### Protective Command

Use for high morality or loyalty with high danger, violence, pressure, or combat
responsibility.

Mouth options:

- open-mouth command
- clenched teeth
- firm speaking mouth
- short toothy grin before action

Brow/eye options:

- lowered brows
- alert eyes
- tight focused gaze
- forward stare

### Controlled Pressure

Use for high danger with high stability, low social display, or authority roles.

Mouth options:

- flat closed mouth
- one-corner controlled smirk
- low speaking mouth
- slight open mouth as if issuing a warning

Brow/eye options:

- lowered brow ridge
- narrowed eyes
- sideward assessing gaze
- calm heavy stare

### Outgoing Bright

Use for high social, high confidence, low stress, or energetic public roles.

Mouth options:

- toothy grin
- open-mouth laugh
- speaking mid-sentence
- broad closed-mouth smile

Brow/eye options:

- bright eyes
- raised brows
- eye-corner smile
- lifted chin

### Strained Endurance

Use for high stress, high loyalty, high morality, trauma history, or protective
burden.

Mouth options:

- clenched teeth
- slightly open breath
- tense speaking mouth
- strained small smile

Brow/eye options:

- knitted brows
- watchful narrowed eyes
- heavy but alert eyes
- sweat-free but tense face
- gaze fixed past the viewer

### Dangerous Charm

Use for low morality, high desire, high confidence, high danger, or social masking.

Mouth options:

- side smirk
- toothy cold smile
- quiet open-mouth tease
- closed-mouth smile with visible tension

Brow/eye options:

- one eyebrow raised
- half-lidded eyes
- narrowed amused gaze
- tilted head

### Volatile Threat

Use sparingly. Requires low stability or sanity, high stress, high violence, low
morality, or explicit unstable concept.

Mouth options:

- wide shouting mouth
- unstable laugh
- gritted teeth
- open-mouth snarl

Brow/eye options:

- sharp furrowed brows
- wide eyes
- uneven stare
- heavy shadow under eyes

## Prompt Rules

When writing `metaDesign.characterImagePrompt`, include one compact expression
phrase in the appearance sentence.

Template:

```text
<face and hair details>, <expression family>: <mouth shape>, <brow/eye action>.
```

Examples:

```text
warm wheat skin, square face, short stubble, protective command expression:
mouth open as if giving a short order, brows lowered and eyes alert.
```

```text
dark hair, neat short beard, controlled pressure expression: one-corner smirk,
narrowed assessing eyes.
```

```text
short black hair, old scar at the brow, strained endurance expression: teeth
clenched, brows knitted but gaze steady.
```

Avoid writing only:

- `calm focused expression`
- `gentle expression`
- `tired expression`
- `serious expression`

Also avoid these unless the fatigue cap has been checked and fatigue is truly
central to the character:

- `slightly tired expression`
- `quiet alert tired expression`
- `tired gentle expression`
- `sleepy expression`
- `drowsy expression`
- `weary expression`

If one of those mood words is important, attach it to a mouth and brow/eye action:

```text
calm focused expression, mouth slightly open as if speaking quietly, brows gently
lowered.
```

## Image-Generation Reminder

During image generation, do not append this guide to the image prompt. This guide is
used only during the attribute/final-prompt writing phase. The final prompt remains
the source of truth.
