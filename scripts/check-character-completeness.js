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
  "coreIdentity.heritage",
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
  "visualIdentity.facialHair",
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
  if (value === undefined || value === null) return false;
  const text = String(value).trim();
  if (!text) return false;

  const compact = text.replace(/\s+/g, "");
  if (/^\?+$/.test(compact)) return false;
  if (/\?{3,}/.test(compact)) return false;

  return true;
}

const abstractFinalWeaponPhrases = [
  "回路线边界",
  "归处法则",
  "退件规则",
  "路径概念体",
  "封印流程",
  "权限规则",
  "命运回路",
];

const abstractWeaponTerms = [
  "规则",
  "法则",
  "边界",
  "流程",
  "权限",
  "概念",
  "回路",
  "路线",
  "命运",
  "授权",
  "契约",
  "系统",
  "原则",
  "秩序",
];

const visualWeaponTerms = [
  "铃",
  "伞",
  "杖",
  "锤",
  "盾",
  "钥匙",
  "灯",
  "包",
  "绳",
  "印章",
  "手杖",
  "护腕",
  "路牌",
  "路签",
  "邮袋",
  "短刀",
  "拳套",
  "手套",
  "枪",
  "弓",
  "刀",
  "剑",
  "棍",
  "槌",
  "斧",
  "钩",
  "链",
  "牌",
  "夹",
  "盒",
  "匣",
  "轮",
  "环",
  "针",
  "瓶",
  "书",
  "bag",
  "bell",
  "umbrella",
  "staff",
  "hammer",
  "shield",
  "key",
  "lamp",
  "rope",
  "stamp",
  "cane",
  "bracer",
  "sign",
  "mailbag",
  "dagger",
  "gauntlet",
  "knife",
  "sword",
  "club",
  "hook",
  "chain",
];

function validateWeaponLogic(character) {
  const issues = [];
  const combatSystem = character.combatSystem || {};
  const finalWeapon = String(combatSystem.weaponPreference || "").trim();
  if (!finalWeapon) return issues;

  const compactFinalWeapon = finalWeapon.replace(/\s+/g, "");
  const hasBannedPhrase = abstractFinalWeaponPhrases.some((phrase) => compactFinalWeapon.includes(phrase));
  if (hasBannedPhrase) {
    issues.push(
      "combatSystem.weaponPreference: final weapon uses a banned pure-concept phrase; use entity prop + fantasy ability."
    );
  }

  const lowerFinalWeapon = finalWeapon.toLowerCase();
  const hasVisualNoun = visualWeaponTerms.some((term) => lowerFinalWeapon.includes(term.toLowerCase()));
  const hasAbstractTerm = abstractWeaponTerms.some((term) => compactFinalWeapon.includes(term));
  if (!hasVisualNoun && hasAbstractTerm) {
    issues.push(
      "combatSystem.weaponPreference: final weapon appears abstract and lacks a clear visible object noun."
    );
  }

  const visualWeapon = String(combatSystem.visualWeapon || "").trim();
  if (visualWeapon && !finalWeapon.includes(visualWeapon) && !hasVisualNoun) {
    issues.push(
      "combatSystem.weaponPreference: final weapon should include the concrete object named in combatSystem.visualWeapon."
    );
  }

  return issues;
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
  const weaponIssues = validateWeaponLogic(character);

  console.log(`${character.coreIdentity?.name || "未命名角色"} (${character.id})`);
  if (!missing.length && !weaponIssues.length) {
    console.log("Complete: all current profile modules are filled.");
    return;
  }

  if (missing.length) {
    console.log(`Missing ${missing.length} field(s):`);
    for (const fieldPath of missing) console.log(`- ${fieldPath}`);
  }

  if (weaponIssues.length) {
    console.log("Weapon logic issue(s):");
    for (const issue of weaponIssues) console.log(`- ${issue}`);
  }
  process.exitCode = 1;
}

main();
