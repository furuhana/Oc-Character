const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = process.env.CHARACTER_DATA_PATH || path.join(root, "data", "characters.json");
const samplesPath = process.env.NAME_SAMPLES_PATH || path.join(root, "data", "name-samples.json");

const defaultNumerical = {
  imagination: 30,
  worldBinding: 30,
  identityMix: 30,
  nameRealism: 70,
  sanity: 30,
  stability: 30,
  confidence: 30,
  social: 30,
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function pickCharacter(data, requestedId) {
  if (requestedId) {
    const found = data.characters.find((character) => character.id === requestedId);
    if (!found) throw new Error(`Character not found: ${requestedId}`);
    return found;
  }
  const marked = data.characters.find((character) => character.activeMarks?.attributes || character.activeMarks?.images);
  return marked || data.characters[0];
}

function clampScore(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(100, Math.max(0, Math.round(number)));
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function inferCulture(character, samples) {
  const identity = character.coreIdentity || {};
  const world = character.worldSetting || {};
  const text = [
    identity.heritage,
    identity.species,
    identity.faction,
    identity.affiliation,
    identity.occupation,
    world.origin,
    world.organizationRank,
    world.socialClass,
  ]
    .filter(Boolean)
    .join(" ");

  const hasJapanese = includesAny(text, ["日本", "日裔", "东瀛", "和风", "神社", "东京", "京都", "大阪", "日本人"]);
  const hasAmerican = includesAny(text, ["美国", "美裔", "欧美", "英语", "纽约", "洛杉矶", "American", "USA"]);
  const hasChinese = includesAny(text, ["中国", "华裔", "华人", "中式", "东亚", "中文", "旧城", "北城", "南城"]);

  if (hasJapanese) return { primaryCulture: "japanese", reason: "Japanese-coded heritage/world text" };
  if (hasAmerican) return { primaryCulture: "american", reason: "American-coded heritage/world text" };
  if (hasChinese) return { primaryCulture: "chinese", reason: "Chinese-coded heritage/world text" };
  return { primaryCulture: "", reason: "No explicit supported naming culture found" };
}

function weightedChoice(entries, rng) {
  const total = entries.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
  if (total <= 0) return entries[0]?.value;
  let cursor = rng() * total;
  for (const entry of entries) {
    cursor -= Math.max(0, entry.weight);
    if (cursor <= 0) return entry.value;
  }
  return entries.at(-1)?.value;
}

function hashSeed(text) {
  let hash = 2166136261;
  for (const char of String(text)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seedText) {
  let state = hashSeed(seedText) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000000) / 1000000;
  };
}

function sample(list, rng) {
  if (!Array.isArray(list) || !list.length) return "";
  return list[Math.floor(rng() * list.length)] || "";
}

function candidateTemplates(scores) {
  const imagination = scores.imagination;
  const worldBinding = scores.worldBinding;
  const realism = scores.nameRealism;
  const mix = scores.identityMix;
  return [
    { value: "real_surname_given_2", weight: realism * 1.2 + (100 - imagination) * 0.9 },
    { value: "compound_surname_given_2", weight: 30 + imagination * 0.45 + mix * 0.35 },
    { value: "real_surname_given_connector", weight: 10 + imagination * 0.35 + realism * 0.25 },
    { value: "real_surname_concept", weight: imagination * 0.65 + worldBinding * 0.95 - realism * 0.25 },
    { value: "compound_concept_suffix", weight: imagination * 0.95 + worldBinding * 0.9 + (100 - realism) * 0.55 },
  ].filter((entry) => entry.weight > 0);
}

function buildJapaneseName(template, categories, rng) {
  const realSurname = sample(categories.realSurnames, rng);
  const compoundSurname = `${sample(categories.surname1, rng)}${sample(categories.surname2, rng)}`;
  const givenPair = `${sample(categories.given1, rng)}${sample(categories.given1, rng)}`;
  const givenWithSuffix = `${sample(categories.given1, rng)}${sample(categories.suffixes, rng)}`;
  const connectorName = `${sample(categories.given1, rng)}${sample(categories.connectors, rng)}${sample(categories.given1, rng)}`;
  const concept = sample(categories.concepts, rng);
  const anomalySuffix = sample(categories.anomalySuffixes, rng);

  switch (template) {
    case "real_surname_given_2":
      return `${realSurname}${givenPair}`;
    case "compound_surname_given_2":
      return `${compoundSurname}${givenWithSuffix}`;
    case "real_surname_given_connector":
      return `${realSurname}${connectorName}`;
    case "real_surname_concept":
      return `${realSurname}${concept}`;
    case "compound_concept_suffix":
      return `${compoundSurname}${concept}${anomalySuffix}`;
    default:
      return `${realSurname}${givenPair}`;
  }
}

function buildChineseName(template, categories, rng) {
  const realSurname = sample(categories.realSurnames, rng);
  const compoundSurname = `${sample(categories.surname1, rng)}${sample(categories.surname2, rng)}`;
  const givenPair = `${sample(categories.given1, rng)}${sample(categories.given1, rng)}`;
  const givenWithConnector = `${sample(categories.given1, rng)}${sample(categories.connectors, rng)}${sample(categories.given1, rng)}`;
  const concept = sample(categories.concepts, rng);
  const anomalySuffix = sample(categories.anomalySuffixes, rng);

  switch (template) {
    case "real_surname_given_2":
      return `${realSurname}${givenPair}`;
    case "compound_surname_given_2":
      return `${compoundSurname}${givenPair}`;
    case "real_surname_given_connector":
      return `${realSurname}${givenWithConnector}`;
    case "real_surname_concept":
      return `${realSurname}${concept}`;
    case "compound_concept_suffix":
      return `${compoundSurname}${concept}${anomalySuffix}`;
    default:
      return `${realSurname}${givenPair}`;
  }
}

function buildAmericanName(template, categories, rng) {
  const firstName = sample(categories.given1, rng);
  const lastName = sample(categories.realSurnames, rng);
  const middleName = sample(categories.connectors, rng);
  const concept = sample(categories.concepts, rng);
  const anomalySuffix = sample(categories.anomalySuffixes, rng);
  const compoundLast = `${sample(categories.surname1, rng)}${sample(categories.surname2, rng)}`;

  switch (template) {
    case "real_surname_given_2":
      return `${firstName}${lastName}`;
    case "compound_surname_given_2":
      return `${firstName}${compoundLast}`;
    case "real_surname_given_connector":
      return `${firstName}${middleName}${lastName}`;
    case "real_surname_concept":
      return `${firstName}${concept}`;
    case "compound_concept_suffix":
      return `${firstName}${concept}${anomalySuffix}`;
    default:
      return `${firstName} ${lastName}`;
  }
}

function buildNameForCulture(culture, template, categories, rng) {
  if (culture === "japanese") return buildJapaneseName(template, categories, rng);
  if (culture === "chinese") return buildChineseName(template, categories, rng);
  if (culture === "american") return buildAmericanName(template, categories, rng);
  return "";
}

function makeCodename(character, culture, categories, scores, rng) {
  const occupation = character.coreIdentity?.occupation || "";
  const ability = character.combatSystem?.specialAbility || character.combatSystem?.weaponPreference || "";
  const hook = character.metaDesign?.characterHook || "";
  const source = `${occupation} ${ability} ${hook}`;
  const matchingConcept = (categories.concepts || []).find((token) => source.includes(token));
  const concept = matchingConcept || sample(categories.concepts, rng);
  if (culture === "american") {
    if (scores.worldBinding >= 70 || scores.imagination >= 70) return concept;
    return sample([concept, `${concept}钥`, `${concept}闸`, `${concept}中继`, `${concept}信号`], rng);
  }
  if (scores.worldBinding >= 70 || scores.imagination >= 70) return concept;
  const suffix = sample(["印", "钥", "闸", "灯", "尺", "签", "频", "锁"], rng);
  return `${concept.slice(0, 2)}${suffix}`;
}

function generateCandidates(character, samples, count = 20) {
  const culture = inferCulture(character, samples);
  const availableCulture = samples.cultures?.[culture.primaryCulture] ? culture.primaryCulture : "";
  const categories = samples.cultures?.[availableCulture]?.categories || {};
  const numerical = { ...defaultNumerical, ...(character.numericalAttributes || {}) };
  const scores = {
    imagination: clampScore(numerical.imagination, defaultNumerical.imagination),
    worldBinding: clampScore(numerical.worldBinding, defaultNumerical.worldBinding),
    identityMix: clampScore(numerical.identityMix, defaultNumerical.identityMix),
    nameRealism: clampScore(numerical.nameRealism, defaultNumerical.nameRealism),
  };
  const rng = makeRng(`${character.id}:${character.updatedAt}:${JSON.stringify(scores)}`);
  if (!availableCulture) {
    return {
      characterId: character.id,
      currentName: character.coreIdentity?.name || "",
      primaryCulture: culture.primaryCulture,
      sampleCultureUsed: "",
      cultureReason: `${culture.reason}. No matching sample library exists yet, so candidates were not generated.`,
      scores,
      candidates: [],
    };
  }
  const templates = candidateTemplates(scores);
  const candidates = [];
  const seen = new Set();

  for (let index = 0; candidates.length < count && index < count * 8; index += 1) {
    const template = weightedChoice(templates, rng);
    const name = buildNameForCulture(availableCulture, template, categories, rng);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    candidates.push({
      name,
      codename: makeCodename(character, availableCulture, categories, scores, rng),
      template,
    });
  }

  return {
    characterId: character.id,
    currentName: character.coreIdentity?.name || "",
    primaryCulture: culture.primaryCulture,
    sampleCultureUsed: availableCulture,
    cultureReason: culture.reason,
    scores,
    candidates,
  };
}

function main() {
  const [characterId, countArg] = process.argv.slice(2);
  const data = readJson(dataPath);
  const samples = readJson(samplesPath);
  const character = pickCharacter(data, characterId);
  const result = generateCandidates(character, samples, Number(countArg) || 20);

  console.log(`Character: ${result.currentName || "(unnamed)"} (${result.characterId})`);
  console.log(`Culture: ${result.primaryCulture}; sample library: ${result.sampleCultureUsed || "(none)"}`);
  console.log(`Reason: ${result.cultureReason}`);
  console.log(`Scores: imagination=${result.scores.imagination}, worldBinding=${result.scores.worldBinding}, identityMix=${result.scores.identityMix}, nameRealism=${result.scores.nameRealism}`);
  console.log("");
  if (!result.candidates.length) {
    console.log("No candidates generated. Add a matching culture to data/name-samples.json or set the character's primary naming culture to an available sample library.");
    return;
  }
  for (const [index, candidate] of result.candidates.entries()) {
    console.log(`${String(index + 1).padStart(2, "0")}. ${candidate.name} / ${candidate.codename} [${candidate.template}]`);
  }
}

main();
