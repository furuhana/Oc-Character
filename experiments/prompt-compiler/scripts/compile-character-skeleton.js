const fs = require("fs");
const path = require("path");
const { defaultDesignLanguagePath, loadDesignLanguage } = require("./design-language");
const { buildUpperGarmentModule, createRng } = require("./generate-random-upper-garment");
const { buildOuterwearModule } = require("./outerwear-module");
const { buildThemeDirectionLayer } = require("./theme-direction-layer");
const { buildOutfitCoherenceCheck } = require("./outfit-coherence-check");
const { buildBottomModule } = require("./bottom-module");
const { buildInfluenceGenerationLayer } = require("./influence-generation-layer");
const { applyReasonabilityFilter } = require("./reasonability-filter");
const { buildCompositionLayer } = require("./composition-layer");
const { buildFieldInfluenceExpansionLayer } = require("./field-influence-expansion-layer");

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

function unique(items) {
  return Array.from(new Set((items || []).filter(Boolean)));
}

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
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
  "calf-length utility pants": "七分功能裤",
  "work shorts": "工装短裤",
  "long shorts": "及膝长短裤",
  "knee-length shorts": "及膝短裤",
  "relaxed shorts": "宽松短裤",
  "wide cropped trousers": "宽版裁短裤",
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
  "above knee": "膝上",
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
  hidden: "隐藏",
  "slightly_visible": "略微可见",
  "clearly_visible": "清楚可见",
  "dominant_visible": "明显可见",
  "ankle_socks": "短袜",
  "crew_socks": "白色中筒袜",
  "mid_calf_socks": "白色小腿袜",
  "knee_high_socks": "白色长袜",
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
  const palette = designLanguage.migratedPalette && designLanguage.migratedPalette.summary
    ? `色彩遵守${designLanguage.migratedPalette.summary}，`
    : "";
  return `${palette}整体保持${shape}、高可读性和${detail}，每个单品只保留${focus}，用少量中大型特征建立识别度，避免小扣件、小带子、小挂件、密集切线和高频碎纹样。`;
}

function normalizeBodyPhrase(text) {
  return String(text || "")
    .replace(/KG/g, "kg")
    .replace(/(\d+)\s*kg/gi, "体重约 $1 kg")
    .replace(/极高/g, "体格高大")
    .replace(/中高/g, "中高身材")
    .replace(/线条紧/g, "肌肉线条紧实")
    .replace(/(^|，)宽($|，)/g, "$1肩背较宽$2")
    .replace(/，，+/g, "，")
    .replace(/^，|，$/g, "");
}

function characterFoundationSentence(foundation) {
  if (!foundation) return "";
  const body = [
    normalizeBodyPhrase(foundation.bodyType),
    normalizeBodyPhrase(foundation.muscleLevel),
    normalizeBodyPhrase(foundation.shoulderWidth),
    foundation.height ? `身高${foundation.height}` : "",
    foundation.weight ? normalizeBodyPhrase(foundation.weight) : "",
  ].filter(Boolean).join("，");
  const face = [
    foundation.skinTone,
    foundation.faceShape,
    foundation.hairStyle,
    foundation.hairColor,
    foundation.expression,
  ].filter(Boolean).join("，");
  const identity = [
    foundation.age ? `${foundation.age}岁左右` : "",
    foundation.heritageBase ? `${foundation.heritageBase}出身` : "",
    foundation.personalityCore ? `性格${foundation.personalityCore}` : "",
  ].filter(Boolean).join("，");
  return `${identity ? `${identity}。` : ""}${body ? `体型${body}。` : ""}${face ? `${face}。` : ""}`;
}

function shortBodyPhrase(foundation, skeleton) {
  if (!foundation) return "壮硕厚实，宽肩厚胸，手臂和腿部有力量";
  return unique([
    normalizeBodyPhrase(foundation.bodyType),
    normalizeBodyPhrase(foundation.muscleLevel),
    normalizeBodyPhrase(foundation.shoulderWidth),
  ]).slice(0, 3).join("，") || cn(skeleton.bodyLayer.bodyType);
}

function shortFacePhrase(foundation, skeleton) {
  if (!foundation) return `${cn(skeleton.faceLayer.faceType)}，发型简洁可读，${cn(skeleton.expressionLayer.expression)}`;
  return unique([
    foundation.skinTone,
    foundation.faceShape,
    foundation.hairStyle,
    foundation.hairColor,
    foundation.expression,
  ]).slice(0, 5).join("，");
}

function compressThemeSummary(theme) {
  if (!theme) return "轻都市奇幻角色，以少量清楚母题建立识别度。";
  const motifs = unique(theme.visualMotifs || []).slice(0, 2);
  const region = theme.regionLabel || "";
  const label = theme.themeLabel || theme.themeCategory || "角色";
  const motifText = motifs.length ? `，以${motifs.join("、")}为母题` : "";
  return `整体带有${region}${label}气质${motifText}。`;
}

function primaryProp(skeleton) {
  const theme = skeleton.themeDirectionLayer || {};
  const influence = skeleton.influenceSourceLayer || {};
  return unique([
    theme.specialVisualProp,
    influence.visualWeapon,
    influence.weaponPreference,
    ...((theme.visualKeywordExtraction && theme.visualKeywordExtraction.propWords) || []),
    ...(theme.propWords || []),
  ])[0] || "";
}

function fieldMotifLabelMap(skeleton) {
  const concrete = skeleton.fieldInfluenceExpansionLayer && skeleton.fieldInfluenceExpansionLayer.concreteTheme
    ? skeleton.fieldInfluenceExpansionLayer.concreteTheme
    : skeleton.influenceGenerationLayer &&
      skeleton.influenceGenerationLayer.fieldInfluenceExpansionLayer &&
      skeleton.influenceGenerationLayer.fieldInfluenceExpansionLayer.concreteTheme
      ? skeleton.influenceGenerationLayer.fieldInfluenceExpansionLayer.concreteTheme
      : null;
  if (!concrete || !concrete.sourceMotifs || !concrete.sourceMotifLabels) return {};
  return Object.fromEntries(concrete.sourceMotifs.map((item, index) => [item, concrete.sourceMotifLabels[index] || item]));
}

function dedupePromptConcepts(skeleton) {
  const theme = skeleton.themeDirectionLayer || {};
  const extraction = theme.visualKeywordExtraction || {};
  const composition = skeleton.compositionLayer || {};
  const labelMap = fieldMotifLabelMap(skeleton);
  const prop = primaryProp(skeleton);
  const rawMotifs = unique([...(composition.sourceMotifs || []), ...(extraction.motifWords || []), ...(theme.visualMotifs || [])])
    .filter((item) => item !== prop && !String(prop).includes(item))
    .slice(0, 2);
  const motifs = rawMotifs.map((item) => labelMap[item] || item);
  return {
    visualWeapon: prop,
    motifs,
    themeSummary: compressThemeSummary({ ...theme, visualMotifs: motifs.length ? motifs : theme.visualMotifs }),
    selectedMotifs: motifs,
  };
}

function innerwearAnchor(theme) {
  const clothing = theme && theme.visualKeywordExtraction ? theme.visualKeywordExtraction.clothingWords || [] : [];
  const explicit = clothing.find((item) => /白色|贴身|短袖|背心|上衣/.test(item));
  if (explicit) return explicit.replace(/^白色贴身短袖$/, "白色贴身短袖上衣");
  return "白色贴身内搭";
}

function innerwearBodyAnchorPhrase(theme) {
  return `${innerwearAnchor(theme)}紧贴厚实躯干，布料下能轻微读出胸肌与腹肌的大块轮廓，强调被包裹住的力量感，腹部结构清楚但概括，不做细碎肌肉刻画`;
}

function outerwearShape(skeleton) {
  const outer = skeleton.outerwearModule || {};
  if (!outer || outer.presence === "none") return "简洁外层";
  return `${regionalCn(outer.baseType, outer.themeDirectionLayer)}，${regionalCn(outer.silhouette, outer.themeDirectionLayer)}轮廓`;
}

function bottomShape(skeleton) {
  const bottom = skeleton.bottomModule || {};
  if (!bottom || bottom.status !== "active") return "利落长裤";
  const socks = bottomSockPhrase(bottom, { compact: true });
  return `${cn(bottom.baseType)}，${cn(bottom.silhouette)}轮廓${socks ? `，${socks}` : ""}`;
}

function compositionSentence(skeleton) {
  const layer = skeleton.compositionLayer;
  if (!layer || layer.status !== "mvp" || !layer.promptFragment) return "";
  return `${layer.promptFragment}。`;
}

function bottomSockPhrase(bottomModule, options = {}) {
  const profile = bottomModule && bottomModule.sockVisibilityProfile;
  if (!profile || profile.sockVisibility === "hidden") return "";
  const sock = cn(profile.sockLength || "crew_socks");
  if (profile.sockVisibility === "slightly_visible") return options.compact
    ? `裤脚与鞋履之间露出一截${sock}`
    : `裤脚与鞋履之间略微露出一截${sock}`;
  if (profile.sockVisibility === "dominant_visible") return options.compact
    ? `搭配清楚的${sock}`
    : `搭配清楚可见的${sock}，作为下半身稳定视觉组成`;
  return options.compact
    ? `${sock}清楚可见`
    : `${sock}在裤脚与鞋履之间清楚可见`;
}

function paletteSentence(designLanguage) {
  if (designLanguage && designLanguage.migratedPalette && designLanguage.migratedPalette.summary) {
    return `配色以${designLanguage.migratedPalette.summary}。`;
  }
  return "配色干净，主色和点缀色分明。";
}

function stylePreferencePhrase(skeleton) {
  const stylePreference = skeleton.stylePreferenceLayer || {};
  const parts = unique([stylePreference.lineQuality, stylePreference.shadowStyle]);
  if (parts.length) return parts.join("、");
  return "干净 TV 动画赛璐璐";
}

function ageRangeCn(value) {
  return {
    early_30s: "三十出头",
    mid_30s: "三十五岁左右",
    late_30s: "三十七八岁",
    early_40s: "四十出头",
  }[value] || "成熟成年";
}

function bodyArchetypeCn(value) {
  return {
    very_broad_frame: "极宽肩厚实体格",
    thick_chubby_muscular: "厚实微胖但有肌肉的体型",
    bulky_soft_strong: "壮硕柔厚的力量型体格",
    heavy_power_build: "沉重有力的强壮体格",
  }[value] || "壮硕厚实体型";
}

function personalityCn(value) {
  return {
    calm_reliable: "平静可靠",
    warm_protective: "温和保护欲",
    serious_focused: "严肃专注",
    blunt_honest: "直率诚实",
    quiet_observant: "安静观察型",
    cheerful_loud: "爽朗外向",
    patient_caretaker: "耐心照看者",
  }[value] || value;
}

function cleanupPromptPunctuation(text) {
  return String(text || "")
    .replace(/。{2,}/g, "。")
    .replace(/，。/g, "。")
    .replace(/；。/g, "。")
    .replace(/。\s*。/g, "。")
    .replace(/\n{3,}/g, "\n\n");
}

function compileImageFinalPrompt(skeleton) {
  const theme = skeleton.themeDirectionLayer;
  const foundation = skeleton.characterFoundationLayer;
  const concepts = dedupePromptConcepts(skeleton);
  const occupation = skeleton.influenceSourceLayer && skeleton.influenceSourceLayer.occupationInfluence
    ? skeleton.influenceSourceLayer.occupationInfluence
    : "原创成年男性角色";
  const region = skeleton.regionContextLayer && skeleton.regionContextLayer.heritageBase
    ? skeleton.regionContextLayer.heritageBase
    : theme && theme.regionLabel ? theme.regionLabel : "";
  const prop = concepts.visualWeapon;
  const propSentence = prop
    ? `核心道具只保留${prop}，符号化处理，少量轻都市奇幻感，不要散成全身小图案。`
    : "奇幻元素轻量集中，不抢服装主体。";
  const guardrail = skeleton.guardrails && skeleton.guardrails.noDirectTool && skeleton.guardrails.noDirectTool.length
    ? `不要画成${joinCn(skeleton.guardrails.noDirectTool.slice(0, 3))}。`
    : "";

  const paragraphs = [
    `单人全身角色设定图，从头到脚完整可见，白底或浅色背景；${region ? `${region}出身，` : ""}${occupation}，整体成熟厚实、稳定可靠。`,
    `${shortBodyPhrase(foundation, skeleton)}；${shortFacePhrase(foundation, skeleton)}。`,
    concepts.themeSummary,
    `服装以${innerwearBodyAnchorPhrase(theme)}；外层是${outerwearShape(skeleton)}，下装为${bottomShape(skeleton)}，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。${compositionSentence(skeleton)}`,
    `${propSentence}${guardrail}`,
    `${paletteSentence(skeleton.designLanguage)}${stylePreferencePhrase(skeleton)}，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。`,
  ].filter(Boolean);

  return cleanupPromptPunctuation([
    "# Character Skeleton Prompt Compiler Output",
    "",
    "## Image Final Prompt",
    "",
    paragraphs.join("\n"),
    "",
    "## promptCompressionGate.debug",
    "",
    JSON.stringify({
      mode: "imageFinal",
      targetLength: "250-450 Chinese characters",
      paragraphCount: paragraphs.length,
      dedupedConcepts: concepts,
      moduleSanityWarnings: skeleton.promptCompressionGate && skeleton.promptCompressionGate.debug
        ? skeleton.promptCompressionGate.debug.moduleSanityWarnings || []
        : [],
      influenceOnly: skeleton.promptCompressionGate && skeleton.promptCompressionGate.influenceOnly
        ? skeleton.promptCompressionGate.influenceOnly
        : [],
      debugOnly: skeleton.promptCompressionGate && skeleton.promptCompressionGate.debugOnly
        ? skeleton.promptCompressionGate.debugOnly
        : [],
      reasonabilityFilter: skeleton.reasonabilityFilter || null,
      influenceReasoningLog: skeleton.influenceGenerationLayer
        ? skeleton.influenceGenerationLayer.influenceReasoningLog
        : [],
    }, null, 2),
  ].join("\n"));
}

function influenceSourceSentence(influenceSourceLayer) {
  if (!influenceSourceLayer) return "";
  const parts = [];
  if (influenceSourceLayer.occupationInfluence) {
    parts.push(`身份气质来自${influenceSourceLayer.occupationInfluence}`);
  }
  if (influenceSourceLayer.combatArchetype || influenceSourceLayer.combatFunction) {
    parts.push(`战斗气质偏${[influenceSourceLayer.combatArchetype, influenceSourceLayer.combatFunction].filter(Boolean).join("，")}`);
  }
  const weapon = influenceSourceLayer.weaponPreference || influenceSourceLayer.visualWeapon;
  if (weapon) {
    parts.push(`可见道具以${weapon}为核心，轮廓单一清楚`);
  }
  return parts.length ? `${parts.join("；")}。` : "";
}

function convertedVisualHintSentence(themeDirectionLayer) {
  const extraction = themeDirectionLayer && themeDirectionLayer.visualKeywordExtraction;
  if (!extraction) return "";
  const clothing = extraction.clothingWords || [];
  const props = extraction.propWords || [];
  const hints = [];
  const whiteInner = clothing.find((item) => /白色|贴身|短袖|背心|上衣/.test(item));
  if (whiteInner) {
    hints.push(`内搭锚点保持${whiteInner.replace(/^白色贴身短袖$/, "白色贴身短袖上衣")}，用于轻微读出胸腹大块结构和被包裹住的力量感`);
  }
  const lowerHint = clothing.find((item) => /裤|袜|靴|腰封|腰带/.test(item));
  if (lowerHint) {
    hints.push(`下半身参考${lowerHint}的轮廓方向，保持简洁`);
  }
  if (props.length) {
    hints.push(`道具母题集中在${props.slice(0, 2).join("和")}，不要散成全身小图案`);
  }
  return hints.length ? `${hints.join("；")}。` : "";
}

function guardrailSentence(guardrails) {
  if (!guardrails || !guardrails.noDirectTool || !guardrails.noDirectTool.length) return "";
  return `道具不要画成${joinCn(guardrails.noDirectTool)}，保持符号化和动画化。`;
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
  const exposure = bottomModule.bottomLengthPreference && bottomModule.bottomLengthPreference.legExposureLevel;
  const exposureText = {
    covered: "腿部覆盖完整",
    ankle_visible: "脚踝处保持清楚层次",
    calf_visible: "露出结实小腿",
    knee_visible: "露出膝部和结实小腿",
  }[exposure] || "下半身轮廓清楚";
  const sockText = bottomSockPhrase(bottomModule);
  return `下装使用${cn(bottomModule.baseType)}，${cn(bottomModule.silhouette)}轮廓，${cn(bottomModule.length)}长度，${exposureText}，${cn(bottomModule.waistStructure)}连接上半身，腿部以${cn(bottomModule.legStructure)}和${cn(bottomModule.hemTreatment)}收束${sockText ? `；${sockText}` : ""}；材质为${cn(bottomModule.material)}，${cn(bottomModule.wearState)}，视觉重点只放在${focus}，${motifText}，${complexityText}。`;
}

function placeholderClothingSentence(skeleton) {
  const parts = [];
  if (skeleton.footwearModule) parts.push("鞋履为稳定实用的低噪音造型");
  return parts.length ? `${parts.join("，")}，暂不展开复杂细节。` : "";
}

function compileDebugPrompt(skeleton) {
  const parts = [
    skeleton.influenceGenerationLayer ? `influenceGenerationLayer: ${JSON.stringify(skeleton.influenceGenerationLayer)}` : "",
    skeleton.reasonabilityFilter ? `reasonabilityFilter: ${JSON.stringify(skeleton.reasonabilityFilter)}` : "",
    skeleton.characterFoundationLayer ? `foundation: ${JSON.stringify(skeleton.characterFoundationLayer)}` : "",
    skeleton.influenceSourceLayer ? `influenceSource: ${JSON.stringify(skeleton.influenceSourceLayer)}` : "",
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

  return cleanupPromptPunctuation([
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
  ].join("\n"));
}

function compileNaturalFinalPrompt(skeleton) {
  const theme = skeleton.themeDirectionLayer;
  const coherenceCheck = skeleton.outfitCoherenceCheck;
  const foundationText = characterFoundationSentence(skeleton.characterFoundationLayer);
  const influenceText = influenceSourceSentence(skeleton.influenceSourceLayer);
  const sentences = [
    "单人全身角色设定图，从头到脚完整可见，白底或浅色背景，正面或轻微三分之二站姿。",
    `${cn(skeleton.bodyLayer.bodyType)}，气质${cn(skeleton.characterLayer.presence)}；${theme ? sanitizeRegionalTerms(theme.themeSummary, theme) : "整体带有轻都市奇幻的生活语境。"}奇幻感克制，不要大范围发光。`,
    foundationText || "体型壮硕厚实，宽肩厚胸，手臂和腿部有力量，成熟有重量感，边缘略带柔和厚度。",
    foundationText ? "" : `${cn(skeleton.faceLayer.faceType)}，发型简洁可读，${cn(skeleton.expressionLayer.expression)}。`,
    influenceText,
    convertedVisualHintSentence(theme),
    coherenceCheck ? coherenceCheck.styleSummary : "",
    topModuleCoherentSentence(skeleton.topModule, theme, coherenceCheck),
    outerwearCoherentSentence(skeleton.outerwearModule, coherenceCheck),
    bottomModuleSentence(skeleton.bottomModule),
    placeholderClothingSentence(skeleton),
    "配饰、武器和奇幻元素只轻量出现，不抢服装主体。",
    guardrailSentence(skeleton.guardrails),
    designLanguageSentence(skeleton.designLanguage),
    `${stylePreferencePhrase(skeleton)}和游戏角色设定图，块面明确、轮廓清楚、材质动画化；不要厚涂、写实摄影、复杂纹理噪音、文字、UI、多人或身体裁切。`,
  ].filter(Boolean);

  return [
    "# Character Skeleton Prompt Compiler Output",
    "",
    "## Full Final Prompt",
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
  const fieldInfluenceExpansionLayer = options.fieldInfluenceExpansionLayer || (options.useFieldInfluenceExpansion
    ? buildFieldInfluenceExpansionLayer(rng, { themeCategory: options.themeCategory })
    : null);
  const concreteTheme = fieldInfluenceExpansionLayer && fieldInfluenceExpansionLayer.concreteTheme
    ? fieldInfluenceExpansionLayer.concreteTheme
    : null;
  const fieldRegion = fieldInfluenceExpansionLayer && fieldInfluenceExpansionLayer.originInfluence
    ? fieldInfluenceExpansionLayer.originInfluence.regionContext || fieldInfluenceExpansionLayer.originInfluence.region
    : "";
  const influenceGenerationLayer = buildInfluenceGenerationLayer(rng, {
    themeCategory: options.themeCategory,
    regionContext: options.regionContext || fieldRegion,
    occupationSeed: options.influence || (concreteTheme ? concreteTheme.occupationSeed || concreteTheme.themeLabel : ""),
    presentationMode: options.presentationMode,
  });
  const resolvedInfluences = influenceGenerationLayer.resolvedInfluences;
  if (fieldInfluenceExpansionLayer) {
    influenceGenerationLayer.fieldInfluenceExpansionLayer = fieldInfluenceExpansionLayer;
    influenceGenerationLayer.fieldBundle = fieldInfluenceExpansionLayer.fieldBundle;
    influenceGenerationLayer.fieldBoundaryCheck = fieldInfluenceExpansionLayer.fieldBoundaryCheck;
    influenceGenerationLayer.primaryInfluences.occupationSeed = concreteTheme.occupationSeed || concreteTheme.themeLabel;
    influenceGenerationLayer.primaryInfluences.fieldBundleDriven = true;
    influenceGenerationLayer.primaryInfluences.fieldBundle = fieldInfluenceExpansionLayer.fieldBundle;
    resolvedInfluences.fieldInfluenceExpansionLayer = fieldInfluenceExpansionLayer;
    resolvedInfluences.occupationInfluence = concreteTheme.occupationSeed || concreteTheme.themeLabel;
    resolvedInfluences.environmentInfluence = [
      ...(resolvedInfluences.environmentInfluence || []),
      ...(concreteTheme.environmentMotifs || []),
      ...(fieldInfluenceExpansionLayer.derivedVisualContext || []).slice(0, 2),
    ];
    resolvedInfluences.materialInfluence = [
      ...(resolvedInfluences.materialInfluence || []),
      ...(concreteTheme.materialMotifs || []),
    ];
  }
  const themeDirectionLayer = buildThemeDirectionLayer(rng, {
    themeCategory: influenceGenerationLayer.primaryInfluences.themeCategory,
    regionContext: influenceGenerationLayer.primaryInfluences.regionContext,
    culturalInfluenceLevel: options.culturalInfluenceLevel,
  });
  themeDirectionLayer.resolvedInfluences = resolvedInfluences;
  if (fieldInfluenceExpansionLayer && concreteTheme) {
    const motifLabels = concreteTheme.sourceMotifLabels || concreteTheme.sourceMotifs;
    themeDirectionLayer.fieldInfluenceExpansionLayer = fieldInfluenceExpansionLayer;
    themeDirectionLayer.themeCategory = concreteTheme.themeCategory;
    themeDirectionLayer.themeLabel = concreteTheme.themeLabel;
    themeDirectionLayer.visualMotifs = motifLabels.slice(0, 3);
    themeDirectionLayer.environmentFlavor = concreteTheme.workplace;
    themeDirectionLayer.themeSummary = `整体指向${concreteTheme.themeLabel}，生活场景来自${concreteTheme.workplace}，以${motifLabels.slice(0, 3).join("、")}作为可转化为服装结构的具体母题。`;
  }
  const compositionLayer = buildCompositionLayer(rng, {
    themeDirectionLayer,
    resolvedInfluences,
  });
  const upperLibrary = readJson(options.upperLibraryPath || defaultUpperLibraryPath);
  const topModule = {
    moduleName: "topModule",
    status: "active",
    ...buildUpperGarmentModule(upperLibrary, rng, {
      designLanguage,
      base: options.base,
      influence: resolvedInfluences.occupationInfluence || options.influence,
      cultureLevel: options.cultureLevel,
    }),
    themeDirectionLayer,
    compositionInfluence: {
      sourceMotifs: compositionLayer.sourceMotifs.slice(0, 2),
      garmentMapping: compositionLayer.garmentMapping,
      promptFragment: compositionLayer.promptFragment,
    },
    resolvedInfluences,
    themePromptHint: themeDirectionLayer.themeSummary,
  };
  const outerwearBias = resolvedInfluences.outerwearBias || {};
  const outerwearModule = buildOuterwearModule(rng, {
    designLanguage,
    themeDirectionLayer,
    presence: options.outerwearPresence,
    baseType: options.outerwearBaseType || (outerwearBias.baseTypes && outerwearBias.baseTypes.length ? pick(outerwearBias.baseTypes, rng) : ""),
    silhouette: options.outerwearSilhouette,
    length: options.outerwearLength,
    cutLanguage: options.outerwearCutLanguage,
    material: options.outerwearMaterial || (outerwearBias.materials && outerwearBias.materials.length ? pick(outerwearBias.materials, rng) : ""),
    finish: options.outerwearFinish,
    wearState: options.outerwearWearState,
    resolvedInfluences,
  });
  outerwearModule.resolvedInfluences = resolvedInfluences;
  outerwearModule.compositionInfluence = {
    sourceMotifs: compositionLayer.sourceMotifs.slice(0, 2),
    garmentMapping: compositionLayer.garmentMapping,
    promptFragment: compositionLayer.promptFragment,
  };
  const outfitCoherenceCheck = buildOutfitCoherenceCheck({
    themeDirectionLayer,
    topModule,
    outerwearModule,
  });
  const bottomModule = buildBottomModule(rng, {
    designLanguage,
    themeDirectionLayer,
    outfitCoherenceCheck,
    resolvedInfluences,
    compositionLayer,
  });

  const skeleton = {
    version: "2.0-skeleton-mvp",
    seed,
    designLanguage,
    fieldInfluenceExpansionLayer,
    influenceGenerationLayer,
    stylePreferenceLayer: {
      moduleName: "stylePreferenceLayer",
      status: "minimal-global-style-preference",
      lineQuality: "京都动画式清爽线条",
      shadowStyle: "干净赛璐璐阴影",
    },
    themeDirectionLayer,
    compositionLayer,
    outfitCoherenceCheck,
    characterLayer: makeLayer("characterLayer", designLanguage, {
      role: "adult male original character",
      ageRead: ageRangeCn(resolvedInfluences.ageRange),
      presence: personalityCn(resolvedInfluences.personalityCore),
    }),
    bodyLayer: makeLayer("bodyLayer", designLanguage, {
      bodyType: "normal adult male proportion",
      build: bodyArchetypeCn(resolvedInfluences.bodyArchetype),
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
  return applyReasonabilityFilter(skeleton);
}

function compileFinalPrompt(skeleton, options = {}) {
  if (options.mode === "debug") return compileDebugPrompt(skeleton);
  if (options.mode === "imageFinal") return compileImageFinalPrompt(skeleton);
  return compileNaturalFinalPrompt(skeleton);
}

function printUsage() {
  console.log("Usage:");
  console.log("node experiments/prompt-compiler/scripts/compile-character-skeleton.js [--seed skeleton-test-1] [--culture-level 2]");
  console.log("node experiments/prompt-compiler/scripts/compile-character-skeleton.js --input experiments/prompt-compiler/output/latest-character-skeleton.json");
  console.log("");
  console.log("Optional:");
  console.log("--mode fullFinal|imageFinal|debug");
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
  const mode = optionValue(args, "mode") || "fullFinal";
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
