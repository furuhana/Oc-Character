const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "characters.json");

const requiredPaths = [
  "coreIdentity.name",
  "coreIdentity.codename",
  "coreIdentity.faction",
  "coreIdentity.birthday",
  "coreIdentity.age",
  "coreIdentity.height",
  "coreIdentity.weight",
  "coreIdentity.occupation",
  "coreIdentity.affiliation",
  "coreIdentity.species",
  "visualIdentity.visualKeywords",
  "visualIdentity.colorLanguage",
  "visualIdentity.faceShape",
  "visualIdentity.expression",
  "visualIdentity.eyes",
  "visualIdentity.eyeColor",
  "visualIdentity.eyebrow",
  "visualIdentity.lip",
  "visualIdentity.scar",
  "visualIdentity.tattoo",
  "visualIdentity.hairStyle",
  "visualIdentity.hairLength",
  "visualIdentity.hairColor",
  "visualIdentity.highlight",
  "visualIdentity.bodyType",
  "visualIdentity.muscleLevel",
  "visualIdentity.bodyFat",
  "visualIdentity.shoulderWidth",
  "visualIdentity.skinTone",
  "visualIdentity.muscleFocus",
  "costumeSystem.outerwear",
  "costumeSystem.outerwearColor",
  "costumeSystem.innerwear",
  "costumeSystem.innerwearColor",
  "costumeSystem.pants",
  "costumeSystem.pantsColor",
  "costumeSystem.socks",
  "costumeSystem.socksColor",
  "costumeSystem.shoes",
  "costumeSystem.shoesColor",
  "costumeSystem.gloves",
  "costumeSystem.glovesColor",
  "costumeSystem.necklace",
  "costumeSystem.necklaceColor",
  "costumeSystem.belt",
  "costumeSystem.beltColor",
  "costumeSystem.signatureItem",
  "costumeSystem.signatureItemColor",
  "personality.corePersonality",
  "personality.strengths",
  "personality.weaknesses",
  "personality.hiddenPersonality",
  "personality.emotionalStability",
  "personality.confidenceLevel",
  "personality.outwardPersona",
  "personality.trueCore",
  "personality.surfaceFear",
  "personality.deepFear",
  "personality.traumaTrigger",
  "personality.stressResponse",
  "personality.trauma",
  "personality.traumaSource",
  "personality.recoveryStatus",
  "personality.traumaImpact",
  "behaviorSystem.thinkingAction",
  "behaviorSystem.irritatedAction",
  "behaviorSystem.nervousAction",
  "behaviorSystem.relaxedAction",
  "behaviorSystem.lyingAction",
  "behaviorSystem.shyAction",
  "behaviorSystem.speechSpeed",
  "behaviorSystem.speechTone",
  "behaviorSystem.catchphrase",
  "behaviorSystem.battleLine",
  "behaviorSystem.walkStyle",
  "behaviorSystem.combatStance",
  "behaviorSystem.idleAction",
  "behaviorSystem.attackRhythm",
  "lifestyle.favoriteFood",
  "lifestyle.hatedFood",
  "lifestyle.hiddenFavorite",
  "lifestyle.appetite",
  "lifestyle.alcoholTolerance",
  "lifestyle.cookingSkill",
  "lifestyle.roomStyle",
  "lifestyle.neatness",
  "lifestyle.collections",
  "lifestyle.pets",
  "socialSystem.socialAbility",
  "socialSystem.lyingAbility",
  "socialSystem.boundarySense",
  "socialSystem.popularity",
  "socialSystem.romanceExperience",
  "socialSystem.preferredType",
  "socialSystem.expressionStyle",
  "socialSystem.possessiveness",
  "combatSystem.combatType",
  "combatSystem.coreStyle",
  "combatSystem.weaponPreference",
  "combatSystem.specialAbility",
  "combatSystem.painTolerance",
  "combatSystem.aggression",
  "combatSystem.stamina",
  "combatSystem.burstPower",
  "combatSystem.pressure",
  "combatSystem.reactionSpeed",
  "worldSetting.origin",
  "worldSetting.socialClass",
  "worldSetting.education",
  "worldSetting.criminalRecord",
  "worldSetting.organizationRank",
  "worldSetting.enemyForces",
  "worldSetting.biggestRegret",
  "worldSetting.biggestGoal",
  "worldSetting.hiddenDream",
  "worldSetting.mostImportantPerson",
  "worldSetting.unforgettableExperience",
  "worldSetting.lifeStain",
  "hiddenInformation.shameSecret",
  "hiddenInformation.hiddenHobby",
  "hiddenInformation.weakness",
  "hiddenInformation.secretHabit",
  "hiddenInformation.contrastSide",
  "hiddenInformation.foodAllergy",
  "numericalAttributes.wealth",
  "numericalAttributes.morality",
  "numericalAttributes.sanity",
  "numericalAttributes.confidence",
  "numericalAttributes.stress",
  "numericalAttributes.danger",
  "numericalAttributes.desire",
  "numericalAttributes.loyalty",
  "numericalAttributes.stability",
  "numericalAttributes.social",
  "numericalAttributes.doom",
  "numericalAttributes.violence",
  "metaDesign.characterHook",
  "metaDesign.characterImagePromptCn",
  "metaDesign.characterImagePrompt",
];

function getPath(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => (value == null ? value : value[key]), object);
}

function isFilled(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function pickCharacter(data, requestedId) {
  if (requestedId) {
    const found = data.characters.find((character) => character.id === requestedId);
    if (!found) throw new Error(`Character not found: ${requestedId}`);
    return found;
  }
  return [...data.characters].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
}

function main() {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const character = pickCharacter(data, process.argv[2]);
  const missing = requiredPaths.filter((fieldPath) => !isFilled(getPath(character, fieldPath)));

  console.log(`${character.coreIdentity?.name || "未命名角色"} (${character.id})`);
  if (!missing.length) {
    console.log("Complete: all current profile modules are filled.");
    return;
  }

  console.log(`Missing ${missing.length} field(s):`);
  for (const fieldPath of missing) console.log(`- ${fieldPath}`);
  process.exitCode = 1;
}

main();
