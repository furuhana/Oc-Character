const fs = require("fs");
const path = require("path");
const { buildCharacterSkeleton, compileFinalPrompt } = require("./compile-character-skeleton");
const { loadDesignLanguage, defaultDesignLanguagePath } = require("./design-language");

const defaultInputPath = path.resolve(__dirname, "../../../data/characters.json");
const defaultModuleOutputPath = path.resolve(__dirname, "../output/converted-character-skeleton.json");
const defaultPromptOutputPath = path.resolve(__dirname, "../output/converted-character-full-prompt.md");
const defaultImagePromptOutputPath = path.resolve(__dirname, "../output/converted-character-image-prompt.md");

const migratedFieldPaths = [
  "coreIdentity.occupation",
  "coreIdentity.heritage",
  "coreIdentity.age",
  "coreIdentity.height",
  "coreIdentity.weight",
  "personality.corePersonality",
  "visualIdentity.bodyType",
  "visualIdentity.muscleLevel",
  "visualIdentity.shoulderWidth",
  "visualIdentity.skinTone",
  "visualIdentity.faceShape",
  "visualIdentity.expression",
  "visualIdentity.hairStyle",
  "visualIdentity.hairColor",
  "combatSystem.battleArchetype",
  "combatSystem.visualWeapon",
  "combatSystem.combatFunction",
  "combatSystem.weaponPreference",
  "combatSystem.forbiddenDirectTool",
  "metaDesign.characterHook",
  "visualIdentity.visualKeywords",
  "visualIdentity.colorLanguage",
];

const intentionallyIgnoredAreas = [
  "socialSystem",
  "hiddenInformation",
  "lifestyle.foodAllergy",
  "lifestyle.pets",
  "coreIdentity.birthday",
  "assets",
  "activeMarks",
  "agentMarks",
  "settings.developer",
  "generationProfile",
  "romance / preferredType / possessiveness",
  "broad negative style rules",
  "body rendering rules",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${text}\n`, "utf8");
}

function optionValue(args, name) {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(`--${name}`);
  if (index >= 0) return args[index + 1];
  return "";
}

function numberOption(args, name, fallback) {
  const value = optionValue(args, name);
  if (!value) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function get(source, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => (value && value[key] !== undefined ? value[key] : ""), source);
}

function compact(value) {
  return typeof value === "string" ? value.trim() : value || "";
}

function splitText(text) {
  return String(text || "")
    .split(/[，,、；;。.\n\r\t]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function pickCharacter(data, options) {
  const characters = Array.isArray(data) ? data : data.characters || [];
  if (!characters.length && data.coreIdentity) return data;
  if (options.name) {
    const found = characters.find((character) => get(character, "coreIdentity.name") === options.name);
    if (found) return found;
  }
  return characters[options.characterIndex] || characters[0];
}

function inferRegionContext(heritage) {
  const text = String(heritage || "");
  if (/南港|港区|港口|码头/.test(text)) return "harbor_district";
  if (/江南|水乡|沿海/.test(text)) return "coastal_neighborhood";
  if (/华北|北方|北京|天津|河北|山西|旧城|胡同/.test(text)) return "north_china_old_city";
  if (/华南|广东|岭南|骑楼|市井/.test(text)) return "south_china_market_street";
  if (/日本|小镇/.test(text)) return "japanese_small_town";
  if (/京都/.test(text)) return "kyoto_old_street";
  if (/韩国/.test(text)) return "korean_old_district";
  if (/东南亚|雨街|雨林/.test(text)) return "southeast_asian_rain_street";
  if (/中亚|集市/.test(text)) return "central_asian_market";
  if (/北非/.test(text)) return "north_african_medina";
  if (/地中海/.test(text)) return "mediterranean_port";
  if (/东欧/.test(text)) return "eastern_europe_old_quarter";
  if (/西欧|欧洲/.test(text)) return "western_europe_old_town";
  if (/拉美|山城/.test(text)) return "latin_american_hill_town";
  if (/中东|巴扎/.test(text)) return "middle_eastern_bazaar";
  if (/印度/.test(text)) return "indian_old_market";
  if (/海边|沿海/.test(text)) return "coastal_neighborhood";
  if (/工业|郊区|维修站/.test(text)) return "industrial_suburb";
  return "fantasy_mixed_city";
}

function normalizeHeritage(heritage) {
  const raw = compact(heritage);
  const result = {
    heritageRaw: raw,
    heritageBase: raw,
    country: "",
    regionHint: "",
    localityFlavor: "",
  };
  if (!raw) return result;

  if (/中国/.test(raw)) result.country = "中国";
  else if (/日本/.test(raw)) result.country = "日本";
  else if (/韩国/.test(raw)) result.country = "韩国";
  else if (/印度/.test(raw)) result.country = "印度";

  const regionRules = [
    ["东北", "东北"],
    ["北方", "北方"],
    ["华北", "华北"],
    ["南港", "南港"],
    ["华南|岭南|广东", "华南"],
    ["西北", "西北"],
    ["西南", "西南"],
    ["华东|江南", "华东"],
    ["关西|京都", "关西"],
    ["中亚", "中亚"],
    ["北非", "北非"],
    ["东南亚", "东南亚"],
    ["地中海", "地中海"],
    ["东欧", "东欧"],
    ["西欧|欧洲", "西欧"],
    ["拉美", "拉美"],
    ["中东", "中东"],
  ];
  for (const [pattern, label] of regionRules) {
    if (new RegExp(pattern).test(raw)) {
      result.regionHint = label;
      break;
    }
  }

  const localityRules = [
    ["旧城|胡同|老城", "旧城"],
    ["南港|港区|港口|码头", "港口"],
    ["海边|沿海", "海边"],
    ["山城|坡道", "山城"],
    ["市场|市井|集市|巴扎", "市场街区"],
    ["工业|郊区|维修站", "工业郊区"],
    ["雨街|湿街", "雨街"],
    ["小镇", "小镇"],
  ];
  for (const [pattern, label] of localityRules) {
    if (new RegExp(pattern).test(raw)) {
      result.localityFlavor = label;
      break;
    }
  }

  const baseParts = [result.country, result.regionHint].filter(Boolean);
  result.heritageBase = baseParts.length ? baseParts.join("") : raw
    .replace(/家庭|出身|背景/g, "")
    .replace(/旧城|胡同|老城|港口|码头|海边|沿海|山城|坡道|市场|市井|集市|巴扎|工业|郊区|维修站|雨街|湿街|小镇/g, "")
    .trim();
  if (!result.heritageBase) result.heritageBase = raw;
  return result;
}

function matchTheme(text, theme, keywords) {
  const matchedKeywords = keywords.filter((keyword) => new RegExp(keyword, "i").test(text));
  return {
    selectedTheme: theme,
    confidence: Math.min(1, matchedKeywords.length / 2),
    matchedKeywords,
    fallbackUsed: false,
  };
}

function inferThemeCategoryDetailed(occupation, visualKeywords) {
  const text = `${occupation || ""} ${visualKeywords || ""}`;
  const rules = [
    ["rain_infrastructure_observer", ["雨线", "雨水", "排水", "地下街", "水位", "防汛", "雨伞", "水尺", "积水", "管沟", "flood", "rain"]],
    ["shelter_night_school_guide", ["避难所", "夜校", "引导员", "疏散", "shelter", "evacuation", "guide", "night school", "点名", "走廊", "秩序"]],
    ["harbor_pressure_maintenance", ["港区", "南港", "压力阀", "阀门", "管道", "检修", "码头", "港口", "pressure valve", "pipe", "harbor maintenance"]],
    ["library_stack_keeper", ["图书馆", "书库", "垂直书库", "书架", "书页", "书签", "装订", "馆员", "归档"]],
    ["clock_tower_maintainer", ["钟楼", "钟塔", "秒针", "报时", "校时", "钟表", "表盘"]],
    ["greenhouse_gardener", ["花", "温室", "园艺", "园丁"]],
    ["postal_courier", ["邮", "递送", "路线员", "快递"]],
    ["market_guard", ["市场", "摊", "夜市"]],
    ["warehouse_logistics_guard", ["仓库", "物流", "货柜"]],
    ["night_patrol", ["夜巡", "巡逻", "巡夜"]],
    ["dawn_gatekeeper", ["门卫", "看门", "守门"]],
    ["bathhouse_keeper", ["澡堂", "浴场", "热水"]],
    ["underground_fitness_trainer", ["健身", "拳馆", "教练"]],
  ];
  const matches = rules
    .map(([theme, keywords]) => matchTheme(text, theme, keywords))
    .filter((match) => match.matchedKeywords.length)
    .sort((a, b) => b.matchedKeywords.length - a.matchedKeywords.length);

  if (matches.length && matches[0].confidence >= 0.5) return matches[0];

  const fallback = /奇幻|异常|魔法|异能|旧城|地下/.test(text) ? "urban_fantasy_worker" : "generic_civic_worker";
  return {
    selectedTheme: fallback,
    confidence: matches[0] ? matches[0].confidence : 0,
    matchedKeywords: matches[0] ? matches[0].matchedKeywords : [],
    fallbackUsed: true,
  };
}

function inferThemeCategory(occupation, visualKeywords) {
  return inferThemeCategoryDetailed(occupation, visualKeywords).selectedTheme;
}

function extractTermsByDictionary(parts, dictionary) {
  return unique(dictionary.filter((term) => parts.some((part) => part.includes(term))));
}

function extractVisualKeywords(visualKeywords, occupation = "", visualWeapon = "") {
  const parts = unique([
    ...splitText(visualKeywords),
    ...splitText(occupation),
    ...splitText(visualWeapon),
  ]);
  const colorDictionary = ["白色", "暖白", "黑色", "蓝黑", "雾灰", "灰蓝", "铜金", "旧铜", "铜色", "琥珀", "暗红", "深蓝", "煤黑", "小麦色", "雨蓝", "深青黑", "氧化铜绿"];
  const materialDictionary = ["铜", "旧铜", "黄铜", "帆布", "棉布", "尼龙", "橡胶", "皮革", "厚织物", "金属", "亚克力", "玻璃", "防水布", "透明雨具", "反光条", "铜管", "橡胶管", "纸页"];
  const clothingDictionary = ["贴身短袖", "白色贴身短袖", "贴身上衣", "短袖", "背心", "工装裤", "短工装裤", "长袜", "厚靴", "腰封", "外套", "夹克", "防水靴", "雨衣"];
  const motifDictionary = [
    "钟楼", "秒针", "秒格", "校准", "节拍", "齿轮", "钟表", "旧城", "巷灯", "温室", "蔷薇", "荆棘", "邮戳", "路线",
    "图书馆", "书库", "书架", "书页", "书签", "装订", "归档", "馆员", "书车", "印章",
    "雨线", "雨水", "排水", "地下街", "积水", "水尺", "雨伞", "水桶", "防水布", "透明雨具", "反光条",
    "港区", "南港", "压力阀", "阀门", "管道", "检修", "码头", "港口", "压力表", "铜管", "橡胶管",
    "避难所", "夜校", "引导", "疏散", "点名", "走廊", "教室", "扩音器", "名册", "粉笔", "课桌", "安全出口",
  ];
  const propDictionary = [
    "扳轮", "秒差计", "怀表", "钥匙", "护符", "工具带", "铜秒针扳轮", "折叠秒差计",
    "书签", "书车", "印章", "重力书签锤", "金属索引签",
    "雨尺伞骨", "折叠水位牌", "雨伞", "水尺", "水桶",
    "阀门扳手", "压力表", "管钳", "阀门", "铜管",
    "折叠门槛盾", "扩音器", "名册", "点名册", "教鞭",
  ];
  const bodyDictionary = ["厚重", "魁梧", "壮硕", "宽肩", "厚胸", "粗臂", "强壮"];

  const roleWords = unique([
    ...parts.filter((part) => /师|员|守卫|花匠|邮差|教练|看护|巡逻|门卫/.test(part))
      .map((part) => part.replace(/^(厚重|魁梧|壮硕|城市|旧城)/, "")),
    occupation,
  ]).filter(Boolean);
  const propWords = unique([
    ...extractTermsByDictionary(parts, propDictionary),
    visualWeapon,
  ]).filter(Boolean);

  return {
    roleWords,
    bodyWords: extractTermsByDictionary(parts, bodyDictionary),
    clothingWords: unique(parts.filter((part) => clothingDictionary.some((term) => part.includes(term)))),
    materialWords: extractTermsByDictionary(parts, materialDictionary),
    colorWords: extractTermsByDictionary(parts, colorDictionary),
    motifWords: extractTermsByDictionary(parts, motifDictionary),
    propWords,
    promptHints: unique(parts.filter((part) => /厚重|干净|贴身|核心|锚点|光|轮廓/.test(part))),
  };
}

function parseForbiddenDirectTool(value) {
  return splitText(value).map((item) => item.replace(/^普通/, "普通"));
}

function fallbackGuardrails({ occupation, visualWeapon, weaponPreference, propWords }) {
  const text = [occupation, visualWeapon, weaponPreference, ...(propWords || [])].filter(Boolean).join(" ");
  if (/港区|南港|压力阀|阀门|管道|检修|码头|港口/.test(text)) {
    return ["普通阀门", "普通扳手", "普通压力表", "普通管钳", "普通维修工具"];
  }
  if (/图书馆|书库|书页|书签|馆员|归档/.test(text)) {
    return ["普通书本", "普通书签", "普通书车", "普通馆员印章"];
  }
  if (/雨线|雨水|排水|地下街|水位|防汛|雨伞|水尺/.test(text)) {
    return ["普通雨伞", "普通水桶", "普通雨衣", "普通排水扳手"];
  }
  if (/避难所|夜校|引导|疏散|点名|走廊|教室/.test(text)) {
    return ["普通教鞭", "普通粉笔", "普通点名册", "普通扩音器"];
  }
  return [];
}

function parseColorLanguage(colorLanguage, extraction) {
  const colors = unique([...splitText(colorLanguage), ...(extraction.colorWords || [])]);
  const summary = colorLanguage || (colors.length ? colors.join("，") : "");
  return {
    source: "visualIdentity.colorLanguage + visualKeywordExtraction.colorWords",
    summary,
    extractedColors: colors,
    rule: "Use as palette guidance only; do not create dense color markings.",
  };
}

function isOuterwearLikeTop(baseArchetype) {
  return /风衣|长外套|西装外套|连帽外套|飞行员夹克|工装夹克|运动夹克|短款夹克|衬衫外套|Hoodie/i.test(String(baseArchetype || ""));
}

function themeNeedsUtilityOuterwear(themeCategory) {
  return [
    "rain_infrastructure_observer",
    "harbor_pressure_maintenance",
    "warehouse_logistics_guard",
  ].includes(themeCategory);
}

function applyModuleSanityFilters(skeleton, extraction) {
  const moduleSanityWarnings = [];
  const influenceOnly = [];
  const debugOnly = [];
  const top = skeleton.topModule || {};
  const outer = skeleton.outerwearModule || {};
  const themeCategory = skeleton.themeDirectionLayer ? skeleton.themeDirectionLayer.themeCategory : "";
  const innerAnchor = (extraction.clothingWords || []).find((item) => /白色|贴身|短袖|背心|上衣/.test(item)) || "白色贴身短袖上衣";

  if (isOuterwearLikeTop(top.baseArchetype)) {
    moduleSanityWarnings.push(`topModule.baseArchetype '${top.baseArchetype}' is outerwear-like; downgraded to fitted innerwear.`);
    influenceOnly.push(top.baseArchetype);
    top.baseArchetype = innerAnchor.replace(/^白色贴身短袖$/, "白色贴身短袖上衣");
    top.baseCategory = "modern";
    top.silhouette = /背心/.test(innerAnchor) ? "贴身背心轮廓" : "贴身短袖轮廓";
    top.cutLanguage = "clean";
    top.materialLanguage = "clean";
    top.closureSystem = "pullover";
    top.designFocus = ["chest fit"];
    top.structuralFeatures = [];
    top.detailComponents = [];
  }

  if (outer && outer.presence !== "none" && themeNeedsUtilityOuterwear(themeCategory) && ["blazer", "cardigan", "long coat", "half-cape"].includes(outer.baseType)) {
    moduleSanityWarnings.push(`outerwearModule.baseType '${outer.baseType}' mismatches ${themeCategory}; replaced with utility outerwear.`);
    influenceOnly.push(outer.baseType);
    if (themeCategory === "rain_infrastructure_observer") {
      outer.baseType = "hoodie jacket";
      outer.material = "matte nylon";
      outer.finish = "clean matte";
      outer.structuralFeature = ["large pocket"];
    } else if (themeCategory === "harbor_pressure_maintenance") {
      outer.baseType = "work jacket";
      outer.material = "utility fabric";
      outer.finish = "clean matte";
      outer.structuralFeature = ["large pocket"];
    } else {
      outer.baseType = "utility vest";
      outer.material = "utility fabric";
      outer.finish = "flat color blocks";
      outer.structuralFeature = ["large pocket"];
    }
  }

  if (skeleton.characterFoundationLayer) {
    for (const key of ["bodyType", "muscleLevel", "shoulderWidth", "weight"]) {
      const value = skeleton.characterFoundationLayer[key];
      if (/中高|线条紧|(^|，)宽($|，)|KG/.test(String(value || ""))) {
        debugOnly.push(`body cleanup candidate: ${key}=${value}`);
      }
    }
  }

  skeleton.promptCompressionGate = {
    status: "active",
    version: "v2",
    imageFinalRules: {
      targetLength: "250-450 Chinese characters",
      maxParagraphs: 6,
      mustRenderLimit: "one identity, one region, one-two motifs, one core prop, one innerwear anchor, one outerwear shape, one bottom silhouette, one palette sentence",
    },
    influenceOnly,
    debugOnly,
    debug: {
      moduleSanityWarnings,
    },
  };
  return skeleton;
}

function buildCharacterFoundationLayer(character, heritageInfo) {
  return {
    moduleName: "characterFoundationLayer",
    status: "converted-from-1.0-a-fields",
    age: compact(get(character, "coreIdentity.age")),
    height: compact(get(character, "coreIdentity.height")),
    weight: compact(get(character, "coreIdentity.weight")),
    heritageBase: heritageInfo.heritageBase,
    personalityCore: compact(get(character, "personality.corePersonality")),
    bodyType: compact(get(character, "visualIdentity.bodyType")),
    muscleLevel: compact(get(character, "visualIdentity.muscleLevel")),
    shoulderWidth: compact(get(character, "visualIdentity.shoulderWidth")),
    skinTone: compact(get(character, "visualIdentity.skinTone")),
    faceShape: compact(get(character, "visualIdentity.faceShape")),
    expression: compact(get(character, "visualIdentity.expression")),
    hairStyle: compact(get(character, "visualIdentity.hairStyle")),
    hairColor: compact(get(character, "visualIdentity.hairColor")),
  };
}

function buildInfluenceSourceLayer(character) {
  return {
    moduleName: "influenceSourceLayer",
    status: "converted-from-1.0-a-fields",
    occupationInfluence: compact(get(character, "coreIdentity.occupation")),
    combatArchetype: compact(get(character, "combatSystem.battleArchetype")),
    combatFunction: compact(get(character, "combatSystem.combatFunction")),
    visualWeapon: compact(get(character, "combatSystem.visualWeapon")),
    weaponPreference: compact(get(character, "combatSystem.weaponPreference")),
    forbiddenDirectTool: compact(get(character, "combatSystem.forbiddenDirectTool")),
    influenceRule: "Occupation and combat fields are influence sources only; they must not directly decide clothing or become ordinary job tools.",
  };
}

function buildConvertedThemeLayer(baseTheme, character, extraction, themeInference) {
  const characterHook = compact(get(character, "metaDesign.characterHook"));
  const visualWeapon = compact(get(character, "combatSystem.visualWeapon"));
  const motifs = unique([
    ...(extraction.motifWords || []),
    ...(baseTheme.visualMotifs || []),
    ...(extraction.propWords || []).slice(0, 1),
  ]).slice(0, 3);
  const materials = unique([
    ...(extraction.materialWords || []),
    ...(baseTheme.materialHints || []),
  ]).slice(0, 4);
  const props = unique([visualWeapon, ...(extraction.propWords || [])]).filter(Boolean);
  const hookHint = characterHook
    ? characterHook
        .replace(/一个穿.*?的/, "")
        .replace(/[。.!！]$/g, "")
        .slice(0, 42)
    : "";

  return {
    ...baseTheme,
    status: "active-with-1.0-a-field-influence",
    characterHook,
    themeInference,
    visualKeywordExtraction: extraction,
    visualMotifs: motifs.length ? motifs : baseTheme.visualMotifs,
    materialHints: materials.length ? materials : baseTheme.materialHints,
    specialVisualProp: props[0] || "",
    propWords: props,
    themeSummary: [
      `整体带有${baseTheme.regionLabel}${baseTheme.themeLabel}的气质`,
      baseTheme.environmentFlavor ? `环境指向${baseTheme.environmentFlavor}` : "",
      motifs.length ? `以${motifs.join("、")}作为少量集中视觉母题` : "",
      props[0] ? `核心可见道具是${props[0]}` : "",
      hookHint ? hookHint : "",
    ].filter(Boolean).join("，") + "。",
  };
}

function applyConvertedFoundationToSkeleton(skeleton, foundation) {
  return {
    ...skeleton,
    characterLayer: {
      ...skeleton.characterLayer,
      role: "adult male original character converted from 1.0 profile",
      ageRead: foundation.age ? `${foundation.age} years old` : skeleton.characterLayer.ageRead,
      presence: foundation.personalityCore || skeleton.characterLayer.presence,
    },
    bodyLayer: {
      ...skeleton.bodyLayer,
      bodyType: foundation.bodyType || skeleton.bodyLayer.bodyType,
      build: [foundation.muscleLevel, foundation.shoulderWidth].filter(Boolean).join("，") || skeleton.bodyLayer.build,
      height: foundation.height,
      weight: foundation.weight,
    },
    faceLayer: {
      ...skeleton.faceLayer,
      faceType: foundation.faceShape || skeleton.faceLayer.faceType,
      hair: [foundation.hairStyle, foundation.hairColor].filter(Boolean).join("，") || skeleton.faceLayer.hair,
      skinTone: foundation.skinTone,
    },
    expressionLayer: {
      ...skeleton.expressionLayer,
      expression: foundation.expression || skeleton.expressionLayer.expression,
    },
  };
}

function buildStylePreferenceLayer() {
  return {
    moduleName: "stylePreferenceLayer",
    status: "minimal-subset-from-1.0-style-preference",
    lineQuality: "京都动画式清爽线条",
    shadowStyle: "干净赛璐璐阴影",
    rule: "Only keep the stable line and cel-shadow preferences; do not import broad body rendering or negative style rules.",
  };
}

function convertCharacterToSkeleton(character, options = {}) {
  const visualKeywords = compact(get(character, "visualIdentity.visualKeywords"));
  const occupation = compact(get(character, "coreIdentity.occupation"));
  const visualWeapon = compact(get(character, "combatSystem.visualWeapon"));
  const heritage = compact(get(character, "coreIdentity.heritage"));
  const heritageInfo = normalizeHeritage(heritage);
  const extraction = extractVisualKeywords(visualKeywords, occupation, visualWeapon);
  const regionContext = options.regionContext || inferRegionContext(heritage);
  const inferredTheme = inferThemeCategoryDetailed(occupation, visualKeywords);
  const themeCategory = options.themeCategory || inferredTheme.selectedTheme;
  const designLanguage = options.designLanguage || loadDesignLanguage(options.designLanguagePath || defaultDesignLanguagePath);
  designLanguage.migratedPalette = parseColorLanguage(compact(get(character, "visualIdentity.colorLanguage")), extraction);

  let skeleton = buildCharacterSkeleton({
    seed: options.seed || `converted-${get(character, "coreIdentity.name") || Date.now()}`,
    designLanguage,
    themeCategory,
    regionContext,
    culturalInfluenceLevel: options.culturalInfluenceLevel,
    cultureLevel: options.cultureLevel,
    outerwearPresence: options.outerwearPresence || "medium",
    base: options.base,
    influence: occupation,
  });

  const characterFoundationLayer = buildCharacterFoundationLayer(character, heritageInfo);
  const influenceSourceLayer = buildInfluenceSourceLayer(character);
  const themeDirectionLayer = buildConvertedThemeLayer(skeleton.themeDirectionLayer, character, extraction, inferredTheme);
  const directGuardrails = parseForbiddenDirectTool(get(character, "combatSystem.forbiddenDirectTool"));
  const fallbackNoDirectTool = directGuardrails.length ? [] : fallbackGuardrails({
    occupation,
    visualWeapon,
    weaponPreference: get(character, "combatSystem.weaponPreference"),
    propWords: extraction.propWords,
  });
  const guardrails = {
    moduleName: "promptGuardrails",
    status: "converted-from-1.0-a-fields",
    noDirectTool: directGuardrails.length ? directGuardrails : fallbackNoDirectTool,
    fallbackUsed: !directGuardrails.length && fallbackNoDirectTool.length > 0,
    rule: "Avoid direct occupation-to-tool translation; use weaponPreference or visualWeapon as a stylized prop source.",
  };
  skeleton = applyConvertedFoundationToSkeleton(skeleton, characterFoundationLayer);

  skeleton = {
    ...skeleton,
    version: "2.0-skeleton-mvp-converted-from-1.0-a-fields",
    sourceVersion: "1.0",
    sourceCharacterName: get(character, "coreIdentity.name"),
    characterFoundationLayer,
    influenceSourceLayer,
    stylePreferenceLayer: buildStylePreferenceLayer(),
    themeDirectionLayer,
    regionContextLayer: {
      moduleName: "regionContext",
      status: "inferred-from-1.0-heritage",
      ...heritageInfo,
      inferredRegionContext: regionContext,
      rule: "Heritage informs regional context softly; avoid stereotype or direct national costume translation.",
    },
    designLanguage,
    guardrails,
    conversionReport: {
      migratedFieldPaths,
      intentionallyIgnoredAreas,
      visualKeywordsSource: visualKeywords,
      visualKeywordExtraction: extraction,
      themeInference: inferredTheme,
      characterHookSource: get(character, "metaDesign.characterHook"),
      forbiddenDirectToolSource: get(character, "combatSystem.forbiddenDirectTool"),
      fallbackGuardrails: fallbackNoDirectTool,
      stylePreferenceSource: "minimal subset from 1.0 style preference: line quality and cel shadow only",
    },
  };
  return applyModuleSanityFilters(skeleton, extraction);
}

function printUsage() {
  console.log("Usage:");
  console.log("node experiments/prompt-compiler/scripts/convert-1-0-character-to-2-0-skeleton.js --input data/characters.json --character-index 0");
  console.log("");
  console.log("Optional:");
  console.log("--name 钟砚泊");
  console.log("--seed converted-test-1");
  console.log("--theme-category clock_tower_maintainer");
  console.log("--region-context north_china_old_city");
  console.log("--cultural-influence-level 0|1|2|3");
  console.log("--culture-level 0|1|2");
  console.log("--outerwear-presence none|light|medium|heavy");
  console.log("--module-output experiments/prompt-compiler/output/converted-character-skeleton.json");
  console.log("--prompt-output experiments/prompt-compiler/output/converted-character-full-prompt.md");
  console.log("--image-prompt-output experiments/prompt-compiler/output/converted-character-image-prompt.md");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    printUsage();
    return;
  }
  const inputPath = path.resolve(process.cwd(), optionValue(args, "input") || defaultInputPath);
  const moduleOutputPath = path.resolve(process.cwd(), optionValue(args, "module-output") || defaultModuleOutputPath);
  const promptOutputPath = path.resolve(process.cwd(), optionValue(args, "prompt-output") || defaultPromptOutputPath);
  const imagePromptOutputPath = path.resolve(process.cwd(), optionValue(args, "image-prompt-output") || defaultImagePromptOutputPath);
  const data = readJson(inputPath);
  const character = pickCharacter(data, {
    characterIndex: numberOption(args, "character-index", 0),
    name: optionValue(args, "name"),
  });
  if (!character) {
    throw new Error(`No character found in ${inputPath}`);
  }

  const skeleton = convertCharacterToSkeleton(character, {
    seed: optionValue(args, "seed"),
    themeCategory: optionValue(args, "theme-category"),
    regionContext: optionValue(args, "region-context"),
    culturalInfluenceLevel: numberOption(args, "cultural-influence-level", null),
    cultureLevel: numberOption(args, "culture-level", 1),
    outerwearPresence: optionValue(args, "outerwear-presence"),
    designLanguagePath: path.resolve(process.cwd(), optionValue(args, "design-language") || defaultDesignLanguagePath),
  });
  const mode = optionValue(args, "mode");
  const prompt = compileFinalPrompt(skeleton, { mode: mode || "fullFinal" });
  const imagePrompt = compileFinalPrompt(skeleton, { mode: "imageFinal" });

  writeJson(moduleOutputPath, skeleton);
  writeText(promptOutputPath, prompt);
  writeText(imagePromptOutputPath, imagePrompt);
  console.log("Converted 1.0 character A-field MVP into 2.0 skeleton.");
  console.log(`Source character: ${skeleton.sourceCharacterName || "(unnamed)"}`);
  console.log(`Skeleton JSON: ${path.relative(process.cwd(), moduleOutputPath)}`);
  console.log(`Full final prompt: ${path.relative(process.cwd(), promptOutputPath)}`);
  console.log(`Image final prompt: ${path.relative(process.cwd(), imagePromptOutputPath)}`);
}

if (require.main === module) main();

module.exports = {
  convertCharacterToSkeleton,
  extractVisualKeywords,
  inferRegionContext,
  inferThemeCategory,
  inferThemeCategoryDetailed,
  normalizeHeritage,
};
