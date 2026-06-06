const fs = require("fs");
const path = require("path");
const {
  defaultDesignLanguagePath,
  formatDesignLanguageChecks,
  formatDesignLanguageSummary,
  getUpperGarmentLimits,
  loadDesignLanguage,
} = require("./design-language");

const defaultLibraryPath = path.resolve(__dirname, "../libraries/fashion-upper-samples.json");
const defaultOutputPath = path.resolve(__dirname, "../output/latest-upper-garment-ai-brief.md");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (const char of String(seed || Date.now())) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = hashSeed(seed);
  return function rng() {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function pickMany(items, count, rng) {
  const pool = [...items];
  const result = [];
  while (pool.length && result.length < count) {
    const index = Math.floor(rng() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

function optionValue(args, name) {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = args.indexOf(`--${name}`);
  if (index >= 0) return args[index + 1];
  return "";
}

function findByName(items, name, key = "source") {
  if (!name) return null;
  return items.find((item) => item[key] === name) || null;
}

function numberOption(args, name) {
  const value = optionValue(args, name);
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
}

function pickCulturalLevel(library, rng, forcedLevel) {
  const level = forcedLevel == null ? Math.floor(rng() * 4) : clamp(Math.round(forcedLevel), 0, 5);
  return library.culturalAdaptationLevels.find((item) => item.level === level) || library.culturalAdaptationLevels[0];
}

function pickBaseTop(library, rng, culturalLevel, forcedBase) {
  if (forcedBase) return forcedBase;
  if (culturalLevel.level === 0 || culturalLevel.level === 1) return pick(library.baseTopLibrary.modern, rng);
  if (culturalLevel.level >= 2) return pick(library.baseTopLibrary.traditional, rng);
  return pick([...library.baseTopLibrary.modern, ...library.baseTopLibrary.traditional], rng);
}

function traditionalPickCount(culturalLevel) {
  if (culturalLevel.level === 0) return 0;
  if (culturalLevel.level === 1) return 1;
  if (culturalLevel.level === 2) return 2;
  if (culturalLevel.level === 3) return 3;
  return 4;
}

function buildUpperGarmentModule(library, rng, options = {}) {
  const designLanguage = options.designLanguage || loadDesignLanguage();
  const designLimits = getUpperGarmentLimits(designLanguage);
  const influence = findByName(library.influenceSources, options.influence) || pick(library.influenceSources, rng);
  const culturalLevel = pickCulturalLevel(library, rng, options.cultureLevel);
  const traditionalInfluences = pickMany(library.traditionalInfluenceLibrary, traditionalPickCount(culturalLevel), rng);
  const designFocus = pickMany(library.designFocus, designLimits.focusLimit, rng);
  const structuralFeatures = pickMany(library.structuralFeatures, designLimits.structureLimit, rng);
  const detailComponents = pickMany(library.detailComponents, designLimits.detailLimit, rng);
  const constructionVerbs = pickMany(library.constructionVerbs, 5, rng);
  const visualMaterials = pickMany(influence.visualMaterials, Math.min(3, influence.visualMaterials.length), rng);
  const influenceDetails = pickMany(influence.details, Math.min(3, influence.details.length), rng);

  return {
    designLanguage,
    designLimits,
    baseArchetype: pickBaseTop(library, rng, culturalLevel, options.base),
    baseCategory: culturalLevel.level <= 1 ? "modern" : "traditional",
    culturalAdaptationLevel: culturalLevel,
    traditionalInfluences,
    silhouette: pick(library.silhouettes, rng),
    cutLanguage: pick(library.cutLanguages, rng),
    materialLanguage: pick(library.materialLanguages, rng),
    closureSystem: pick(library.closureSystems, rng),
    designFocus,
    structuralFeatures,
    detailComponents,
    wearState: pick(library.wearStates, rng),
    personalHabit: pick(library.personalHabits, rng),
    influenceSource: influence.source,
    influenceMaterials: visualMaterials,
    influenceDetails,
    constructionVerbs,
    judgement: {
      visualNoiseLevel: pick(library.judgementAxes.visualNoiseLevel, rng),
      formality: pick(library.judgementAxes.formality, rng),
      layeringDepth: pick(library.judgementAxes.layeringDepth, rng),
      mobility: pick(library.judgementAxes.mobility, rng),
      fantasyIntensity: pick(library.judgementAxes.fantasyIntensity, rng),
      cleanliness: pick(library.judgementAxes.cleanliness, rng),
    },
    avoid: influence.avoid,
  };
}

function formatAiBrief(module, seed) {
  const designLanguageChecks = formatDesignLanguageChecks(module.designLanguage);
  return [
    "# 上衣模块 AI 发挥测试 Brief",
    "",
    "请根据下面的结构化上衣模块进行创作。这个测试用于观察 AI 如何在服装基础款、轮廓、裁剪、细节、影响源与全局设计语言之间做取舍，并把结果压缩成短的生图提示词。",
    "",
    "重要要求：",
    "- 不要照抄字段，不要把所有素材都塞进最终提示词。",
    "- 先写可追踪的设计思考日志，再抽取视觉要点，最后压缩成最终提示词。",
    "- 服装最终提示词只写上衣/外套本体，不写人物身体、脸、动作、背景、画风或世界观。",
    "- 基础上衣方向默认兼容干净白色贴身内搭可从外套下露出，但不要让外套完全遮住胸口结构。",
    "- 目标是现代都市服装 + 传统结构语言 + 轻度奇幻设计的混合，不要默认做成 cosplay 或历史复原服。",
    "- 文化改造程度决定传统元素比例；等级低时只保留少量传统细节，等级高时也要保持角色可穿的现代设计感。",
    "- 材质语言和闭合系统用于让衣服更像真实衣物，不要把闭合系统当成额外装饰乱堆。",
    "- 最终提示词不要出现解释、规则、括号说明、AI、文字标签或抽象概念。",
    "",
    "Design Language Layer / 全局设计语言：",
    formatDesignLanguageSummary(module.designLanguage),
    "",
    "上衣模块接入要求：",
    `- 版型优先级：${module.designLimits.shouldPreferLargeShapes ? "优先清晰大版型、大轮廓、大块面" : "保持版型与细节平衡"}`,
    `- 视觉重点上限：${module.designLimits.focusLimit}`,
    `- 结构特征上限：${module.designLimits.structureLimit}`,
    `- 细节组件上限：${module.designLimits.detailLimit}`,
    `- 表面噪音：${module.designLimits.shouldReduceNoise ? "主动动画化降噪，避免写实纹理和密集小符号" : "允许更多纹理，但仍需保持可读"}`,
    "",
    "动画化降噪规则：",
    "- 最终提示词必须适配干净 TV 动画赛璐璐风格。",
    "- 把复杂材质转写为动画可读的大色块和简单质感，不要写实材质堆叠。",
    "- 每件上衣最终最多保留 1 个结构重点 + 1 个细节重点 + 1 个材质方向。",
    "- 避免写实化词汇：高精度、复杂纹理、真实皮革纹、密集缝线、硬核工业结构、过多金属件。",
    "- 如果抽到复杂材质或结构，请在最终提示词里主动降级为更简单的动画表达。",
    "",
    "最终提示词压缩规则：",
    "- 最终提示词最多 1 句话，中文建议 70-130 字，绝对不要超过 150 个中文字。",
    "- 最终提示词只保留 5-7 个视觉要点：基础款、轮廓、材质、闭合系统或穿着状态、1 个裁剪变化、1-2 个结构重点、1-2 个细节。",
    "- 舍弃推导里的解释、性格分析、功能说明、重复材质、过多装饰和次要小零件。",
    "",
    `基础款：${module.baseArchetype}`,
    `基础款类别：${module.baseCategory}`,
    `文化改造程度：${module.culturalAdaptationLevel.level} = ${module.culturalAdaptationLevel.label}`,
    `文化改造说明：${module.culturalAdaptationLevel.description}`,
    `传统结构语言候选：${module.traditionalInfluences.length ? module.traditionalInfluences.join(" / ") : "无"}`,
    `轮廓形状：${module.silhouette}`,
    `裁剪语言：${module.cutLanguage}`,
    `材质语言：${module.materialLanguage}`,
    `闭合系统：${module.closureSystem}`,
    `视觉重点候选：${module.designFocus.join(" / ")}`,
    `结构特征候选：${module.structuralFeatures.join(" / ")}`,
    `细节组件候选：${module.detailComponents.join(" / ")}`,
    `穿着状态：${module.wearState}`,
    `个人穿衣习惯：${module.personalHabit}`,
    `影响源：${module.influenceSource}`,
    `随机种子：${seed}`,
    "",
    "影响源素材：",
    `- 可用材质：${module.influenceMaterials.join(" / ")}`,
    `- 可用细节：${module.influenceDetails.join(" / ")}`,
    `- 可参考结构动作：${module.constructionVerbs.join(" / ")}`,
    `- 避免项：${module.avoid.join("；")}`,
    "",
    "判断项：",
    `- 视觉噪音：${module.judgement.visualNoiseLevel}`,
    `- 正式程度：${module.judgement.formality}`,
    `- 层次深度：${module.judgement.layeringDepth}`,
    `- 行动便利：${module.judgement.mobility}`,
    `- 奇幻浓度：${module.judgement.fantasyIntensity}`,
    `- 整洁程度：${module.judgement.cleanliness}`,
    "",
    "请严格按下面格式返回：",
    "",
    "上衣名称/称呼：",
    "基础款：",
    "影响源：",
    "",
    "设计思考日志：",
    "",
    "取舍记录：",
    "- 保留：",
    "- 舍弃：",
    "- 原因：",
    "",
    "文化适配：",
    "- 现代基础如何保留：",
    "- 传统结构如何转译：",
    "- 如何避免 cosplay：",
    "",
    "动画化降噪：",
    "- 复杂素材如何降级：",
    "- 最终只保留的结构重点：",
    "- 最终只保留的细节重点：",
    "- 最终材质方向：",
    "",
    "视觉要点：",
    "- ",
    "- ",
    "- ",
    "- ",
    "- ",
    "",
    "最终提示词：",
    "",
    "检查提醒：",
    ...designLanguageChecks.map((item) => `- ${item}`),
  ].join("\n");
}

function printUsage() {
  console.log("Usage:");
  console.log("node experiments/prompt-compiler/scripts/generate-random-upper-garment.js [--seed test-1] [--base Hoodie] [--influence 花匠] [--culture-level 1] [--design-language experiments/prompt-compiler/config/design-language.json]");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    printUsage();
    return;
  }

  const seed = optionValue(args, "seed") || `${Date.now()}`;
  const libraryPath = path.resolve(process.cwd(), optionValue(args, "library") || defaultLibraryPath);
  const designLanguagePath = path.resolve(process.cwd(), optionValue(args, "design-language") || defaultDesignLanguagePath);
  const library = readJson(libraryPath);
  const designLanguage = loadDesignLanguage(designLanguagePath);
  const module = buildUpperGarmentModule(library, createRng(seed), {
    base: optionValue(args, "base"),
    influence: optionValue(args, "influence"),
    cultureLevel: numberOption(args, "culture-level"),
    designLanguage,
  });

  const outputPath = path.resolve(process.cwd(), optionValue(args, "output") || defaultOutputPath);
  const brief = formatAiBrief(module, seed);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${brief}\n`, "utf8");

  console.log("已生成上衣模块 AI 发挥测试 Brief。");
  console.log("");
  console.log(`基础款：${module.baseArchetype}`);
  console.log(`文化改造程度：${module.culturalAdaptationLevel.level} = ${module.culturalAdaptationLevel.label}`);
  console.log(`轮廓：${module.silhouette}`);
  console.log(`影响源：${module.influenceSource}`);
  console.log(`随机种子：${seed}`);
  console.log("");
  console.log(`Brief 文件：${path.relative(process.cwd(), outputPath)}`);
  console.log("");
  console.log("下一步在新会话运行：");
  console.log(`cat ${path.relative(process.cwd(), outputPath)}`);
}

if (require.main === module) main();

module.exports = {
  buildUpperGarmentModule,
  createRng,
  formatAiBrief,
};
