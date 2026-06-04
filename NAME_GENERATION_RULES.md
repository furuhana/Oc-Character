# Name Generation Rules

This workbench uses name samples as flavor anchors, not as a hard limit on
creation.

## Core Sequence

1. Choose the naming culture from nationality, heritage, species, and world
   origin.
2. For mixed heritage, the primary culture decides the name skeleton. Secondary
   cultures may contribute middle names, suffixes, titles, codenames, or display
   forms.
3. Use the sample library to learn structure, sound, and token flavor.
4. Use character attributes to choose template family and token tags.
5. Produce separate values when needed:
   - registered/legal name
   - display name
   - alias/common address
   - codename

## Culture Selection

The first maintained culture libraries are Japanese, Chinese, and American.
Do not default to the Japanese sample library. A Japanese name should appear
only when one of these is true:

- the character's nationality or primary heritage is Japanese
- the character's species/faction/world origin is explicitly Japanese-coded
- the character is mixed heritage and Japanese is the secondary culture selected
  for a middle element, suffix, title, display name, or codename flavor
- the user explicitly asks for Japanese naming flavor

If the primary culture is not represented in `data/name-samples.json`, use the
closest existing culture only as a structural reference, then create a suitable
name from the character's stated nationality/heritage and document the inference
in the working reasoning. Do not silently reuse Japanese samples for unrelated
nationalities.

The preview script is stricter than freeform writing: if the detected culture
has no sample library, `scripts/generate-name.js` should not generate candidates.
Add a culture library first, or generate the name manually with explicit cultural
reasoning.

## Sample Freedom

Samples are not a closed vocabulary. They provide stable taste and repeatable
materials. Generation may extend beyond samples when the result still matches
the selected culture, world, and character.

Suggested freedom by imagination:

- 0-20: mostly sample-internal realistic names
- 21-50: sample-inspired names with light extension
- 51-80: cocktail names that mix surname, concept, job, or world tokens
- 81-100: high-concept urban legend names, still readable and character-bound

## Naming Scores

The first naming-engine pass uses four `numericalAttributes` fields:

- `imagination`: how far the name can drift from realistic registration
- `worldBinding`: how strongly faction, job, organization, or world concepts can
  enter the name
- `identityMix`: how much mixed-culture structure or hybrid display naming is
  allowed
- `nameRealism`: how strongly the result should remain a believable legal or
  formal name

These are 0-100 values in the UI. High imagination does not automatically mean a
random name; it increases access to concept and anomaly templates. High
nameRealism pulls the result back toward legal-name templates.

Use `node scripts/generate-name.js [characterId] [count]` to preview candidate
names. This script reads `data/name-samples.json` and the current character but
does not write changes back.

## Japanese Template Families

- Low imagination: `realSurname + given1 + given1`
- Medium imagination: `surname1 + surname2 + given1 + suffix`
- Medium-high imagination: `realSurname + given1 + connector + given1`
- High imagination: `realSurname + concept`
- Extreme imagination: `realSurname/surname compound + concept + anomalySuffix`

Examples:

- `绿川慎也`
- `浅野幻彦`
- `椎名晴之介`
- `松下手闸`
- `江户川大气生物`

## Chinese Template Families

- Low imagination: `realSurname + given1 + given1`
- Medium imagination: `surname1 + surname2 + given1 + given1`
- Medium-high imagination: `realSurname + given1 + connector + given1`
- High imagination: `realSurname + concept`
- Extreme imagination: `surname compound + concept + anomalySuffix`

Examples:

- `沈砚澄`
- `陆衡霁`
- `梁星轨`
- `钟封签`
- `岚阀旧案页`

## American Template Families

American names are stored and displayed as Chinese transliterations in
`coreIdentity.name`, matching the Chinese UI and character list. Keep English
spellings only as secondary metadata later if needed.

- Low imagination: `transliteratedFirstName + transliteratedLastName`
- Medium imagination: `transliteratedFirstName + coined/compound transliteratedLastName`
- Medium-high imagination: `transliteratedFirstName + transliteratedMiddleName + transliteratedLastName`
- High imagination: `transliteratedFirstName + translated concept`
- Extreme imagination: `transliteratedFirstName + translated concept + anomalySuffix`

Examples:

- `达斯汀雷德`
- `埃文斯通桥`
- `凯勒布雷特纳`
- `达斯汀档案`
- `欧文天气协议`

## Attribute Influence

Use existing fields first. Do not add new fields unless repeated generation
needs a control that cannot be inferred.

- `coreIdentity.heritage`, `species`, `faction`, `occupation`: culture and social
  skeleton
- `worldSetting.origin`, `organizationRank`, `enemyForces`, `biggestGoal`: world
  binding and institution flavor
- `combatSystem.specialAbility`, `visualWeapon`, `weaponPreference`: anomaly and
  prop roots
- `hiddenInformation`, `personality`: hidden identity, obsession, and emotional
  direction
- `numericalAttributes`: sanity, stability, confidence, stress, danger, desire,
  loyalty, social, violence, and morality adjust the style of weirdness

High stability and discipline do not necessarily reduce imagination. They make
strange names read as institutional titles, archive names, ranks, or formal
codenames. Low sanity or low stability makes strange names read more like rumor,
dream logic, or fractured self-mythology.
