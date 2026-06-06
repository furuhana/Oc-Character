const fs = require("fs");
const path = require("path");

const defaultDesignLanguagePath = path.resolve(__dirname, "../config/design-language.json");

const defaults = {
  shapeHierarchy: "large_shape_dominant",
  silhouettePriority: "high",
  detailDensity: "medium_low",
  readability: "high",
  ornamentScale: "medium_large",
  visualFocusCount: "one_main_one_secondary",
  surfaceNoiseLevel: "controlled",
  segmentationLevel: "controlled",
  motifStrength: "strong_single_motif",
  graphicClarity: "high",
  complexityBudget: "moderate",
};

const labels = {
  shapeHierarchy: {
    large_shape_dominant: "大形主导",
    balanced: "形体与细节平衡",
    detail_dominant: "细节主导",
  },
  silhouettePriority: { high: "高轮廓优先", medium: "中等轮廓优先", low: "低轮廓优先" },
  detailDensity: { low: "低细节密度", medium_low: "中低细节密度", medium: "中等细节密度", high: "高细节密度" },
  readability: { high: "高可读性", medium: "中等可读性", low: "低可读性" },
  ornamentScale: { large: "大型装饰", medium_large: "中大型装饰", medium: "中型装饰", small_dense: "密集小装饰" },
  visualFocusCount: {
    one_main: "1 个主视觉重点",
    one_main_one_secondary: "1 个主视觉重点 + 1 个次视觉重点",
    multiple: "多重点",
  },
  surfaceNoiseLevel: { clean: "干净表面", controlled: "克制表面噪音", textured: "有纹理", noisy: "嘈杂表面" },
  segmentationLevel: { minimal: "极少分割", controlled: "克制结构分割", moderate: "中等结构分割", dense: "密集结构分割" },
  motifStrength: {
    strong_single_motif: "单一强主题",
    dual_motif: "双主题",
    mixed_motif: "混合主题",
    scattered_motif: "分散主题",
  },
  graphicClarity: { high: "高清晰图形关系", medium: "中等图形清晰度", low: "低图形清晰度" },
  complexityBudget: { simple: "简洁复杂度", moderate: "中等复杂度", rich_controlled: "丰富但克制", overloaded: "过载" },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadDesignLanguage(filePath = defaultDesignLanguagePath) {
  const data = readJson(filePath);
  return { ...defaults, ...(data.designLanguage || data) };
}

function labelOf(designLanguage, key) {
  const value = designLanguage[key];
  return (labels[key] && labels[key][value]) || value;
}

function getUpperGarmentLimits(designLanguage) {
  const focusLimit = designLanguage.visualFocusCount === "one_main" ? 1 : designLanguage.visualFocusCount === "multiple" ? 3 : 2;
  const detailLimit = designLanguage.detailDensity === "low" ? 1 : designLanguage.detailDensity === "high" ? 3 : 2;
  const structureLimit = designLanguage.segmentationLevel === "dense" ? 3 : 2;

  return {
    focusLimit,
    detailLimit,
    structureLimit,
    shouldPreferLargeShapes: designLanguage.shapeHierarchy === "large_shape_dominant",
    shouldReduceNoise: ["clean", "controlled"].includes(designLanguage.surfaceNoiseLevel),
  };
}

function formatDesignLanguageSummary(designLanguage) {
  return [
    `${labelOf(designLanguage, "shapeHierarchy")}、${labelOf(designLanguage, "silhouettePriority")}、${labelOf(designLanguage, "detailDensity")}、${labelOf(designLanguage, "readability")}。`,
    `优先使用清晰大块面、中大型结构重点和简洁轮廓建立识别度；整件单品控制为${labelOf(designLanguage, "visualFocusCount")}。`,
    `表面处理保持${labelOf(designLanguage, "surfaceNoiseLevel")}，结构分割保持${labelOf(designLanguage, "segmentationLevel")}，主题表达保持${labelOf(designLanguage, "motifStrength")}。`,
    "避免密集小扣件、小带子、小挂件、小拼接、小切线、小纹样和高频细节噪音。",
  ].join("\n");
}

function formatDesignLanguageChecks(designLanguage) {
  return [
    `是否符合${labelOf(designLanguage, "shapeHierarchy")}，没有依赖碎小装饰制造复杂感？`,
    "远看是否有清楚轮廓，中距离是否能读懂主要结构？",
    `视觉重点是否控制在${labelOf(designLanguage, "visualFocusCount")}？`,
    `小细节、表面纹理和切线数量是否符合${labelOf(designLanguage, "detailDensity")}与${labelOf(designLanguage, "surfaceNoiseLevel")}？`,
    "主题元素是否集中表达，而不是分散堆满全身？",
    `整体复杂度是否保持${labelOf(designLanguage, "complexityBudget")}？`,
  ];
}

module.exports = {
  defaultDesignLanguagePath,
  loadDesignLanguage,
  getUpperGarmentLimits,
  formatDesignLanguageSummary,
  formatDesignLanguageChecks,
};
