const fs = require("fs");
const path = require("path");
const { defaultDesignLanguagePath, loadDesignLanguage } = require("./design-language");
const { buildUpperGarmentModule, createRng } = require("./generate-random-upper-garment");
const { buildOuterwearModule } = require("./outerwear-module");
const { buildThemeDirectionLayer } = require("./theme-direction-layer");
const { buildOutfitCoherenceCheck } = require("./outfit-coherence-check");
const { buildBottomModule } = require("./bottom-module");

const defaultUpperLibraryPath = path.resolve(__dirname, "../libraries/fashion-upper-samples.json");
const defaultModuleOutputPath = path.resolve(__dirname, "../output/latest-character-skeleton.json");
const defaultPromptOutputPath = path.resolve(__dirname, "../output/latest-character-prompt.md");

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

function numberOption(args, name) {
  const value = optionValue(args, name);
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function makeLayer(name, designLanguage, fields) {
  return {
    moduleName: name,
    status: "skeleton",
    designLanguage,
    ...fields,
  };
}

function summarizeTopModule(topModule) {
  return [
    topModule.baseArchetype,
    topModule.silhouette,
    topModule.cutLanguage,
    topModule.materialLanguage,
    topModule.closureSystem,
    topModule.designFocus && topModule.designFocus.length ? `focus: ${topModule.designFocus.join(" / ")}` : "",
    topModule.structuralFeatures && topModule.structuralFeatures.length ? `structure: ${topModule.structuralFeatures.join(" / ")}` : "",
    topModule.detailComponents && topModule.detailComponents.length ? `details: ${topModule.detailComponents.join(" / ")}` : "",
    topModule.influenceSource ? `influence: ${topModule.influenceSource}` : "",
  ].filter(Boolean).join(", ");
}

function summarizeOuterwearModule(outerwearModule) {
  if (!outerwearModule) return "";
  return outerwearModule.promptFragment || outerwearModule.silhouette || "";
}

function joinCn(items, fallback = "") {
  const values = (items || []).filter(Boolean);
  if (!values.length) return fallback;
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join("、")}和${values[values.length - 1]}`;
}

const cnMap = {
  "sturdy, grounded, broad-shouldered": "沉稳厚实、宽肩可靠",
  "normal adult male proportion": "正常成年男性比例",
  "strong, thick, mature physique": "壮硕厚实的成熟体型",
  "mature masculine face": "成熟男性脸型",
  "calm focused expression": "平静专注的表情",
  light: "轻量",
  medium: "中等量感",
  heavy: "厚重",
  "cropped jacket": "短夹克",
  "work jacket": "工装夹克",
  "bomber jacket": "飞行员夹克",
  "track jacket": "运动夹克",
  "hoodie jacket": "连帽外套",
  cardigan: "开衫",
  "haori-inspired jacket": "羽织式外搭",
  "short cloak": "披肩式短外套",
  "utility vest": "功能背心",
  blazer: "西装外套",
  "long coat": "长外套",
  "half-cape": "半披风",
  boxy: "箱型",
  "wide shoulder": "宽肩",
  cropped: "短版",
  oversized: "宽松",
  "A-line": "A 字",
  "heavy upper body": "上半身厚重",
  draped: "披挂式",
  "waist length": "及腰",
  "hip length": "及胯",
  "thigh length": "及大腿",
  long: "长款",
  symmetrical: "对称",
  asymmetrical: "不对称",
  layered: "分层",
  "panel cut": "拼接裁片",
  "split hem": "开衩下摆",
  "wrap style": "包裹式",
  modular: "模块化",
  collar: "领口",
  shoulder: "肩部",
  sleeve: "袖子",
  hem: "下摆",
  waist: "腰部",
  "back panel": "背部",
  pocket: "口袋",
  hood: "帽子",
  "oversized collar": "大领子",
  "broad shoulder panel": "宽肩片",
  "large cuffs": "大袖口",
  "cape layer": "披肩层",
  "fake two-piece": "假两件结构",
  "detachable panel": "可拆卸片",
  "wide placket": "宽门襟",
  "large pocket": "大口袋",
  "heavy hem": "厚重下摆",
  "cotton canvas": "棉质帆布",
  "matte nylon": "哑光尼龙",
  "wool blend": "羊毛混纺",
  denim: "牛仔布",
  "leather trim": "皮革滚边",
  "thick jersey": "厚针织",
  "soft knit": "柔软针织",
  "utility fabric": "功能布料",
  "straight work trousers": "直筒工装裤",
  "tapered trousers": "微锥形长裤",
  "relaxed utility pants": "宽松功能裤",
  "cropped utility pants": "裁短功能裤",
  "work shorts": "工装短裤",
  "long shorts": "及膝长短裤",
  "drawstring trousers": "系带长裤",
  "wrap-panel trousers": "带前片结构的裤装",
  "uniform trousers": "制服感长裤",
  "simple fitted pants": "简洁修身裤",
  "wide casual trousers": "宽松日常长裤",
  straight: "直筒",
  relaxed: "宽松",
  tapered: "微锥形",
  wide: "宽版",
  "cropped-straight": "裁短直筒",
  "sturdy workwear": "稳重工装",
  "soft daily": "柔和日常",
  "heavy lower body": "下半身厚重",
  "full length": "全长",
  "ankle length": "及踝",
  "cropped ankle": "裁短及踝",
  "calf length": "小腿长度",
  "knee length": "及膝",
  "clean waistband": "干净裤腰",
  "work belt compatible": "可搭配工装皮带",
  "tied waist": "系带腰",
  "layered waistband": "分层腰头",
  "broad waistband": "宽腰头",
  "practical belt loops": "实用皮带袢",
  "clean leg line": "干净腿线",
  "side seam emphasis": "侧缝强调",
  "knee panel": "膝部护片",
  "utility pocket panel": "功能口袋片",
  "wide thigh volume": "宽大大腿量感",
  "simple reinforced knee": "简化加固膝部",
  "panel division": "大块面分割",
  "wrapped front panel": "前片包裹结构",
  "clean hem": "干净裤脚",
  "cuffed hem": "翻边裤脚",
  "rolled hem": "卷边裤脚",
  "narrowed hem": "收窄裤脚",
  "tucked into footwear": "预留塞进鞋靴",
  "open hem": "开放裤脚",
  "cotton twill": "棉斜纹布",
  "work canvas": "工装帆布",
  "matte utility fabric": "哑光功能布",
  "soft blended fabric": "柔软混纺布",
  "denim-like sturdy fabric": "牛仔感硬挺布",
  "dry woven fabric": "干爽梭织布",
  "lightly worn": "轻微使用感",
  "practical daily wear": "日常实用穿着",
  "tidy workwear": "整洁工装状态",
  "relaxed daily": "放松日常状态",
  waist: "腰部",
  "side pocket area": "侧袋区域",
  "thigh panel": "大腿片区",
  "knee area": "膝部",
  "hem / ankle": "裤脚和脚踝",
  "side motif strip": "侧边母题条",
  "clean matte": "干净哑光",
  "flat color blocks": "平整大色块",
  "low texture": "低纹理",
  "subtle edge trim": "克制滚边",
  "simplified cel-shaded material": "简化赛璐璐材质",
  open: "敞开",
  "half open": "半敞开",
  closed: "闭合",
  "draped over shoulders": "披在肩上",
  "one shoulder slipped": "单肩滑落",
  "tied around waist": "系在腰间",
  "sleeves rolled": "卷袖",
  Tunic: "束腰长上衣",
  Angarkha: "斜襟长上衣",
  Kurta: "库尔塔式长上衣",
  Doublet: "短身紧外衣",
  Dashiki: "宽松套头上衣",
  clean: "干净整洁",
};

const japaneseRegionContexts = new Set(["japanese_small_town", "kyoto_old_street"]);
const nonJapaneseTermMap = {
  "羽织式外搭": "短外搭",
  "haori-inspired jacket": "short utility outer layer",
  "羽织": "短外搭",
  "作务衣": "工装感上衣",
  "和风": "地域感",
  "京都": "旧城",
  "神社": "街区小祠堂",
  "鸟居": "街口门架",
  "祭典": "节庆街区",
};

function cn(value) {
  return cnMap[value] || value;
}

function isJapaneseRegion(themeDirectionLayer) {
  return themeDirectionLayer && japaneseRegionContexts.has(themeDirectionLayer.regionContext);
}

function sanitizeRegionalTerms(text, themeDirectionLayer) {
  if (!text || isJapaneseRegion(themeDirectionLayer)) return text;
  return Object.entries(nonJapaneseTermMap).reduce(
    (result, [from, to]) => result.split(from).join(to),
    text,
  );
}

function regionalCn(value, themeDirectionLayer) {
  return sanitizeRegionalTerms(cn(value), themeDirectionLayer);
}

function cnList(items, fallback = "") {
  return joinCn((items || []).map(cn), fallback);
}

function regionalCnList(items, themeDirectionLayer, fallback = "") {
  return joinCn((items || []).map((item) => regionalCn(item, themeDirectionLayer)), fallback);
}

function designLanguageSentence(designLanguage) {
  const shape = designLanguage.shapeHierarchy === "large_shape_dominant" ? "大形主导" : "形体与细节平衡";
  const detail = designLanguage.detailDensity === "medium_low" ? "中低细节密度" : "克制细节密度";
  const focus = designLanguage.visualFocusCount === "one_main_one_secondary" ? "1 个主视觉重点和 1 个次视觉重点" : "少量明确视觉重点";
  return `整体保持${shape}、高可读性和${detail}，每个单品只保留${focus}，用少量中大型特征建立识别度，避免小扣件、小带子、小挂件、密集切线和高频碎纹样。`;
}

function topModuleSentence(topModule, themeDirectionLayer) {
  const focus = regionalCnList(topModule.designFocus, themeDirectionLayer, "领口和肩部");
  const structures = regionalCnList(topModule.structuralFeatures, themeDirectionLayer, "清楚的大结构");
  const details = regionalCnList(topModule.detailComponents, themeDirectionLayer, "少量中型细节");
  const motifs = themeDirectionLayer ? joinCn(themeDirectionLayer.visualMotifs.slice(0, 2)) : "";
  return `基础上衣为${regionalCn(topModule.baseArchetype, themeDirectionLayer)}，${regionalCn(topModule.silhouette, themeDirectionLayer)}轮廓，采用${regionalCn(topModule.cutLanguage, themeDirectionLayer)}和${regionalCn(topModule.materialLanguage, themeDirectionLayer)}，以${regionalCn(topModule.closureSystem, themeDirectionLayer)}处理闭合；视觉重点集中在${focus}，用${structures}支撑大形，${details}只作为局部点缀${motifs ? `，并轻微呼应${motifs}` : ""}。`;
}

function topModuleCoherentSentence(topModule, themeDirectionLayer, coherenceCheck) {
  const supporting = coherenceCheck && coherenceCheck.supportingModule === "topModule";
  const focusItems = supporting ? (topModule.designFocus || []).slice(0, 1) : topModule.designFocus;
  const structureItems = supporting ? (topModule.structuralFeatures || []).slice(0, 1) : topModule.structuralFeatures;
  const detailItems = supporting ? [] : topModule.detailComponents;
  const focus = regionalCnList(focusItems, themeDirectionLayer, "领口");
  const structures = regionalCnList(structureItems, themeDirectionLayer, "清楚的大结构");
  const motifs = themeDirectionLayer ? joinCn(themeDirectionLayer.visualMotifs.slice(0, 1)) : "";
  const supportText = supporting ? "作为衬托层降低复杂度，" : "";
  const detailText = detailItems && detailItems.length ? `，${regionalCnList(detailItems, themeDirectionLayer)}只作为局部点缀` : "";
  return `基础上衣为${regionalCn(topModule.baseArchetype, themeDirectionLayer)}，${regionalCn(topModule.silhouette, themeDirectionLayer)}轮廓，${supportText}重点集中在${focus}，用${structures}支撑大形${detailText}${motifs ? `，只轻微呼应${motifs}` : ""}。`;
}

function outerwearSentence(outerwearModule) {
  if (!outerwearModule || outerwearModule.presence === "none") {
    return "外套暂不出现，白色贴身上衣作为上半身主要视觉，轮廓保持干净清楚。";
  }

  const focus = cnList([outerwearModule.designFocus.primary, outerwearModule.designFocus.secondary]);
  const structures = cnList(outerwearModule.structuralFeature, "一个中大型结构特征");
  const motifs = joinCn(outerwearModule.themeMotifs, "");
  const visibility = outerwearModule.wearState === "closed" ? "闭合穿着时可以覆盖大部分内搭" : "穿着状态不要完全遮住白色贴身上衣";
  return `外套是${cn(outerwearModule.presence)}的${cn(outerwearModule.baseType)}，${cn(outerwearModule.silhouette)}轮廓，${cn(outerwearModule.length)}长度，采用${cn(outerwearModule.cutLanguage)}裁剪，${cn(outerwearModule.material)}配合${cn(outerwearModule.finish)}表面；重点集中在${focus}，用${structures}形成外套识别点${motifs ? `，少量呼应${motifs}` : ""}，${cn(outerwearModule.wearState)}穿着，${visibility}。`;
}

function outerwearCoherentSentence(outerwearModule, coherenceCheck) {
  if (!outerwearModule || outerwearModule.presence === "none") {
    return "外套暂不出现，白色贴身上衣作为上半身主要视觉，轮廓保持干净清楚。";
  }

  const supporting = coherenceCheck && coherenceCheck.supportingModule === "outerwearModule";
  const focusItems = supporting
    ? [outerwearModule.designFocus.primary].filter(Boolean)
    : [outerwearModule.designFocus.primary, outerwearModule.designFocus.secondary].filter(Boolean);
  const structureItems = supporting ? [] : outerwearModule.structuralFeature;
  const themeDirectionLayer = outerwearModule.themeDirectionLayer;
  const focus = regionalCnList(focusItems, themeDirectionLayer, "肩部");
  const structures = structureItems && structureItems.length ? `，用${regionalCnList(structureItems, themeDirectionLayer)}形成外套识别点` : "";
  const visibility = outerwearModule.wearState === "closed" ? "闭合穿着时可以覆盖大部分内搭" : "不要完全遮住白色贴身上衣";
  const supportText = supporting ? "保持简洁，作为轮廓衬托，" : "";
  return `外套是${regionalCn(outerwearModule.presence, themeDirectionLayer)}的${regionalCn(outerwearModule.baseType, themeDirectionLayer)}，${regionalCn(outerwearModule.silhouette, themeDirectionLayer)}轮廓，${supportText}${regionalCn(outerwearModule.material, themeDirectionLayer)}配合${regionalCn(outerwearModule.finish, themeDirectionLayer)}表面；重点集中在${focus}${structures}，${regionalCn(outerwearModule.wearState, themeDirectionLayer)}穿着，${visibility}。`;
}

function bottomModuleSentence(bottomModule) {
  if (!bottomModule || bottomModule.status !== "active") {
    return "裤装保持简洁清楚的长裤轮廓，暂不展开复杂细节。";
  }

  const focus = cnList(bottomModule.designFocus, "腰部");
  const motifText = bottomModule.motifUsage === "none"
    ? "不额外展开主题图案"
    : `只在${focus}或裤侧做一处低调主题呼应`;
  const complexityText = bottomModule.complexityLevel === "simple"
    ? "复杂度低于上半身，不抢外套主视觉"
    : "保持中等复杂度，但仍低于上半身主视觉";
  return `下装使用${cn(bottomModule.baseType)}，${cn(bottomModule.silhouette)}轮廓，${cn(bottomModule.length)}长度，${cn(bottomModule.waistStructure)}连接上半身，腿部以${cn(bottomModule.legStructure)}和${cn(bottomModule.hemTreatment)}收束；材质为${cn(bottomModule.material)}，${cn(bottomModule.wearState)}，视觉重点只放在${focus}，${motifText}，${complexityText}。`;
}

function placeholderClothingSentence(skeleton) {
  const parts = [];
  if (skeleton.footwearModule) parts.push("鞋履为稳定实用的低噪音造型");
  return parts.length ? `${parts.join("，")}，暂不展开复杂细节。` : "";
}

function compileDebugPrompt(skeleton) {
  const parts = [
    skeleton.characterLayer.presence,
    skeleton.bodyLayer.bodyType,
    skeleton.bodyLayer.build,
    skeleton.faceLayer.faceType,
    skeleton.expressionLayer.expression,
    skeleton.themeDirectionLayer ? skeleton.themeDirectionLayer.themeSummary : "",
    skeleton.themeDirectionLayer ? `regionContext: ${skeleton.themeDirectionLayer.regionContext}` : "",
    skeleton.outfitCoherenceCheck ? `coherence: ${skeleton.outfitCoherenceCheck.styleSummary}` : "",
    skeleton.outfitCoherenceCheck && skeleton.outfitCoherenceCheck.warningMessages.length ? `coherence warnings: ${skeleton.outfitCoherenceCheck.warningMessages.join(" / ")}` : "",
    summarizeTopModule(skeleton.topModule),
    summarizeOuterwearModule(skeleton.outerwearModule),
    skeleton.bottomModule.promptFragment || skeleton.bottomModule.silhouette,
    skeleton.footwearModule.silhouette,
    skeleton.accessoryModule.visualFocus,
    skeleton.weaponModule.silhouette,
    skeleton.fantasyLayer.intensity,
    skeleton.styleLayer.renderStyle,
    skeleton.styleLayer.promptDiscipline,
  ].filter(Boolean);

  return [
    "# Character Skeleton Prompt Compiler Output",
    "",
    "## Debug Prompt",
    "",
    parts.join("; "),
    "",
    "## Compiler Notes",
    "",
    "- Debug mode keeps module-like wording and internal structure visible.",
    "- No Outfit Coordination Layer is applied yet.",
    "- All modules carry the shared designLanguage config.",
    "- topModule uses the existing upper-garment module.",
    "- outerwearModule is the first deepened single-item module.",
    "- bottomModule is an MVP single-item module.",
    "- footwearModule, accessoryModule, and weaponModule remain placeholders for later deep passes.",
  ].join("\n");
}

function compileNaturalFinalPrompt(skeleton) {
  const theme = skeleton.themeDirectionLayer;
  const coherenceCheck = skeleton.outfitCoherenceCheck;
  const sentences = [
    "单人全身角色设定图，从头到脚完整可见，白底或浅色背景，正面或轻微三分之二站姿。",
    `${cn(skeleton.bodyLayer.bodyType)}，气质${cn(skeleton.characterLayer.presence)}；${theme ? sanitizeRegionalTerms(theme.themeSummary, theme) : "整体带有轻都市奇幻的生活语境。"}奇幻感克制，不要大范围发光。`,
    "体型壮硕厚实，宽肩厚胸，手臂和腿部有力量，成熟有重量感，边缘略带柔和厚度。",
    `${cn(skeleton.faceLayer.faceType)}，发型简洁可读，${cn(skeleton.expressionLayer.expression)}。`,
    coherenceCheck ? coherenceCheck.styleSummary : "",
    topModuleCoherentSentence(skeleton.topModule, theme, coherenceCheck),
    outerwearCoherentSentence(skeleton.outerwearModule, coherenceCheck),
    bottomModuleSentence(skeleton.bottomModule),
    placeholderClothingSentence(skeleton),
    "配饰、武器和奇幻元素只轻量出现，不抢服装主体。",
    designLanguageSentence(skeleton.designLanguage),
    "干净 TV 动画赛璐璐和游戏角色设定图，块面明确、轮廓清楚、材质动画化；不要厚涂、写实摄影、复杂纹理噪音、文字、UI、多人或身体裁切。",
  ].filter(Boolean);

  return [
    "# Character Skeleton Prompt Compiler Output",
    "",
    "## Final Prompt",
    "",
    sentences.join("\n"),
    "",
    "## Compiler Notes",
    "",
    "- Final prompt mode hides internal field names and enum values.",
    "- No Outfit Coordination Layer is applied yet.",
    "- themeDirectionLayer provides visual flavor; designLanguage controls readability and detail density.",
  ].join("\n");
}

function buildCharacterSkeleton(options = {}) {
  const seed = options.seed || `${Date.now()}`;
  const rng = createRng(seed);
  const designLanguage = options.designLanguage || loadDesignLanguage(options.designLanguagePath || defaultDesignLanguagePath);
  const themeDirectionLayer = buildThemeDirectionLayer(rng, {
    themeCategory: options.themeCategory,
    regionContext: options.regionContext,
    culturalInfluenceLevel: options.culturalInfluenceLevel,
  });
  const upperLibrary = readJson(options.upperLibraryPath || defaultUpperLibraryPath);
  const topModule = {
    moduleName: "topModule",
    status: "active",
    ...buildUpperGarmentModule(upperLibrary, rng, {
      designLanguage,
      base: options.base,
      influence: options.influence,
      cultureLevel: options.cultureLevel,
    }),
    themeDirectionLayer,
    themePromptHint: themeDirectionLayer.themeSummary,
  };
  const outerwearModule = buildOuterwearModule(rng, {
    designLanguage,
    themeDirectionLayer,
    presence: options.outerwearPresence,
    baseType: options.outerwearBaseType,
    silhouette: options.outerwearSilhouette,
    length: options.outerwearLength,
    cutLanguage: options.outerwearCutLanguage,
    material: options.outerwearMaterial,
    finish: options.outerwearFinish,
    wearState: options.outerwearWearState,
  });
  const outfitCoherenceCheck = buildOutfitCoherenceCheck({
    themeDirectionLayer,
    topModule,
    outerwearModule,
  });
  const bottomModule = buildBottomModule(rng, {
    designLanguage,
    themeDirectionLayer,
    outfitCoherenceCheck,
  });

  return {
    version: "2.0-skeleton-mvp",
    seed,
    designLanguage,
    themeDirectionLayer,
    outfitCoherenceCheck,
    characterLayer: makeLayer("characterLayer", designLanguage, {
      role: "adult male original character",
      ageRead: "mature adult",
      presence: "sturdy, grounded, broad-shouldered",
    }),
    bodyLayer: makeLayer("bodyLayer", designLanguage, {
      bodyType: "normal adult male proportion",
      build: "strong, thick, mature physique",
      posture: "stable standing pose",
    }),
    faceLayer: makeLayer("faceLayer", designLanguage, {
      faceType: "mature masculine face",
      hair: "simple readable hairstyle",
      keyFeature: "clear facial silhouette",
    }),
    expressionLayer: makeLayer("expressionLayer", designLanguage, {
      expression: "calm focused expression",
      intensity: "restrained",
    }),
    topModule,
    outerwearModule,
    bottomModule,
    footwearModule: makeLayer("footwearModule", designLanguage, {
      itemType: "footwear placeholder",
      silhouette: "stable practical shoes",
      detailLevel: "minimal until deep module pass",
    }),
    accessoryModule: makeLayer("accessoryModule", designLanguage, {
      itemType: "accessory placeholder",
      visualFocus: "one restrained accessory area",
      detailLevel: "minimal until deep module pass",
    }),
    weaponModule: makeLayer("weaponModule", designLanguage, {
      itemType: "weapon placeholder",
      silhouette: "single readable prop silhouette",
      detailLevel: "minimal until deep module pass",
    }),
    fantasyLayer: makeLayer("fantasyLayer", designLanguage, {
      intensity: themeDirectionLayer.fantasyFlavor,
      source: themeDirectionLayer.themeCategory,
      regionContext: themeDirectionLayer.regionContext,
      rule: "support the outfit and prop design without overwhelming the character",
    }),
    styleLayer: makeLayer("styleLayer", designLanguage, {
      renderStyle: "clean TV animation cel style",
      promptDiscipline: "large shapes, clear blocks, controlled detail density",
    }),
  };
}

function compileFinalPrompt(skeleton, options = {}) {
  return options.mode === "debug" ? compileDebugPrompt(skeleton) : compileNaturalFinalPrompt(skeleton);
}

function printUsage() {
  console.log("Usage:");
  console.log("node experiments/prompt-compiler/scripts/compile-character-skeleton.js [--seed skeleton-test-1] [--culture-level 2]");
  console.log("node experiments/prompt-compiler/scripts/compile-character-skeleton.js --input experiments/prompt-compiler/output/latest-character-skeleton.json");
  console.log("");
  console.log("Optional:");
  console.log("--mode final|debug");
  console.log("--theme-category night_patrol|market_guard|clock_tower_maintainer|greenhouse_gardener|...");
  console.log("--region-context neutral_urban|north_china_old_city|southeast_asian_rain_street|...");
  console.log("--cultural-influence-level 0|1|2|3|4");
  console.log("--design-language experiments/prompt-compiler/config/design-language.json");
  console.log("--outerwear-presence none|light|medium|heavy");
  console.log("--module-output experiments/prompt-compiler/output/latest-character-skeleton.json");
  console.log("--prompt-output experiments/prompt-compiler/output/latest-character-prompt.md");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    printUsage();
    return;
  }

  const designLanguagePath = path.resolve(process.cwd(), optionValue(args, "design-language") || defaultDesignLanguagePath);
  const moduleOutputPath = path.resolve(process.cwd(), optionValue(args, "module-output") || defaultModuleOutputPath);
  const promptOutputPath = path.resolve(process.cwd(), optionValue(args, "prompt-output") || defaultPromptOutputPath);
  const inputPath = optionValue(args, "input");
  const mode = optionValue(args, "mode") || "final";
  const skeleton = inputPath
    ? readJson(path.resolve(process.cwd(), inputPath))
    : buildCharacterSkeleton({
        seed: optionValue(args, "seed") || `${Date.now()}`,
        designLanguagePath,
        upperLibraryPath: path.resolve(process.cwd(), optionValue(args, "upper-library") || defaultUpperLibraryPath),
        base: optionValue(args, "base"),
        influence: optionValue(args, "influence"),
        cultureLevel: numberOption(args, "culture-level"),
        themeCategory: optionValue(args, "theme-category"),
        regionContext: optionValue(args, "region-context"),
        culturalInfluenceLevel: numberOption(args, "cultural-influence-level"),
        outerwearPresence: optionValue(args, "outerwear-presence"),
        outerwearBaseType: optionValue(args, "outerwear-base-type"),
        outerwearSilhouette: optionValue(args, "outerwear-silhouette"),
        outerwearLength: optionValue(args, "outerwear-length"),
        outerwearCutLanguage: optionValue(args, "outerwear-cut-language"),
        outerwearMaterial: optionValue(args, "outerwear-material"),
        outerwearFinish: optionValue(args, "outerwear-finish"),
        outerwearWearState: optionValue(args, "outerwear-wear-state"),
      });
  const compiledPrompt = compileFinalPrompt(skeleton, { mode });

  if (!inputPath) writeJson(moduleOutputPath, skeleton);
  writeText(promptOutputPath, compiledPrompt);

  console.log(inputPath ? "Compiled prompt from skeleton JSON." : "Generated full-module skeleton and compiled prompt.");
  if (!inputPath) console.log(`Skeleton JSON: ${path.relative(process.cwd(), moduleOutputPath)}`);
  console.log(`Compiled prompt: ${path.relative(process.cwd(), promptOutputPath)}`);
}

if (require.main === module) main();

module.exports = {
  buildCharacterSkeleton,
  compileFinalPrompt,
};
