const traditionalTerms = [
  "交领",
  "斜襟",
  "对襟",
  "立领",
  "盘扣",
  "系带",
  "腰封",
  "包裹",
  "羽织",
  "Angarkha",
  "Tunic",
  "韩服",
  "Dashiki",
];

const strongOuterwearTerms = ["hood", "cape", "cloak", "half-cape", "draped", "layered", "wide placket", "oversized collar"];

function includesAnyText(values, terms) {
  const text = values.filter(Boolean).join(" ");
  return terms.some((term) => text.includes(term));
}

function isTraditionalTop(topModule) {
  return includesAnyText(
    [
      topModule.baseArchetype,
      topModule.cutLanguage,
      topModule.closureSystem,
      ...(topModule.traditionalInfluences || []),
      ...(topModule.structuralFeatures || []),
    ],
    traditionalTerms,
  );
}

function isStrongOuterwear(outerwearModule) {
  return includesAnyText(
    [
      outerwearModule.baseType,
      outerwearModule.silhouette,
      outerwearModule.cutLanguage,
      outerwearModule.designFocus && outerwearModule.designFocus.primary,
      outerwearModule.designFocus && outerwearModule.designFocus.secondary,
      ...(outerwearModule.structuralFeature || []),
    ],
    strongOuterwearTerms,
  );
}

function styleFromTheme(themeDirectionLayer) {
  if (!themeDirectionLayer) return "urban_casual";
  if (["harbor_worker", "old_city_worker", "postal_courier"].includes(themeDirectionLayer.themeCategory)) return "modern_workwear";
  if (["underground_fitness_trainer"].includes(themeDirectionLayer.themeCategory)) return "sports_utility";
  if (["bathhouse_keeper", "festival_security", "mountain_lodge_keeper"].includes(themeDirectionLayer.themeCategory)) return "traditional_modern";
  if (["greenhouse_gardener", "clock_tower_maintainer"].includes(themeDirectionLayer.themeCategory)) return "fantasy_worker";
  if (["night_market_vendor", "neighborhood_guardian", "book_repair_binder"].includes(themeDirectionLayer.themeCategory)) return "soft_daily";
  return "urban_casual";
}

function chooseSecondaryStyle(primaryStyleSource, themeDirectionLayer, topModule) {
  const topTraditional = isTraditionalTop(topModule);
  if (topTraditional && primaryStyleSource !== "traditional_modern") return "traditional_modern";
  if (themeDirectionLayer && themeDirectionLayer.fantasyFlavor !== "现实主义" && primaryStyleSource !== "fantasy_worker") return "fantasy_worker";
  return "";
}

function styleLabel(style) {
  return {
    modern_workwear: "现代工装",
    urban_casual: "都市休闲",
    traditional_modern: "传统现代混合",
    fantasy_worker: "都市奇幻劳动者",
    sports_utility: "运动机能",
    soft_daily: "日常生活感",
  }[style] || "都市休闲";
}

function buildOutfitCoherenceCheck({ themeDirectionLayer, topModule, outerwearModule }) {
  const primaryStyleSource = styleFromTheme(themeDirectionLayer);
  const secondaryStyleSource = chooseSecondaryStyle(primaryStyleSource, themeDirectionLayer, topModule);
  const topTraditional = isTraditionalTop(topModule);
  const outerwearStrong = isStrongOuterwear(outerwearModule);
  const outerwearDominant = outerwearModule && ["medium", "heavy"].includes(outerwearModule.presence);
  const dominantModule = outerwearDominant ? "outerwearModule" : "topModule";
  const supportingModule = dominantModule === "outerwearModule" ? "topModule" : "outerwearModule";
  const motifs = themeDirectionLayer ? themeDirectionLayer.visualMotifs || [] : [];
  const motifMainPlacement = outerwearDominant ? "外套肩部或领口区域" : "上衣领口或前襟区域";
  const motifEchoPlacement = motifs.length > 1 ? "腰带或下摆边缘的一处小呼应" : "";
  const reducedModules = [];
  const warningMessages = [];

  if (outerwearDominant) {
    reducedModules.push("topModule");
    warningMessages.push("outerwear is medium/heavy, so topModule should support instead of competing");
  }

  const culturalLevel = themeDirectionLayer ? themeDirectionLayer.culturalInfluenceLevel : 1;
  if (culturalLevel === 1 && topTraditional && outerwearStrong) {
    reducedModules.push("outerwearModule");
    warningMessages.push("culturalInfluenceLevel 1 allows traditional detail in only one major upper-body module");
  }
  if (culturalLevel === 2 && topTraditional && outerwearStrong) {
    reducedModules.push(dominantModule === "outerwearModule" ? "topModule" : "outerwearModule");
    warningMessages.push("culturalInfluenceLevel 2 should not make both top and outerwear strongly traditional/complex");
  }
  if (culturalLevel < 3 && topTraditional && outerwearStrong) {
    warningMessages.push("avoid stacking traditional top structure with strong outerwear cape/hood/layer language");
  }
  if (motifs.length > 2) {
    warningMessages.push("motifs should be limited to one main placement and one echo placement");
  }

  return {
    moduleName: "outfitCoherenceCheck",
    status: "active",
    scope: "topModule + outerwearModule + themeDirectionLayer only",
    primaryStyleSource,
    secondaryStyleSource,
    dominantModule,
    supportingModule,
    motifMainPlacement,
    motifEchoPlacement,
    reducedModules: Array.from(new Set(reducedModules)),
    warningMessages: Array.from(new Set(warningMessages)),
    styleSummary: buildCoherenceSummary({
      primaryStyleSource,
      secondaryStyleSource,
      dominantModule,
      supportingModule,
      motifMainPlacement,
      motifEchoPlacement,
      themeDirectionLayer,
      topTraditional,
    }),
  };
}

function buildCoherenceSummary(check) {
  const primary = styleLabel(check.primaryStyleSource);
  const secondary = check.secondaryStyleSource ? `，辅以${styleLabel(check.secondaryStyleSource)}` : "";
  const dominant = check.dominantModule === "outerwearModule" ? "外套负责主视觉" : "上衣负责主视觉";
  const support = check.supportingModule === "topModule" ? "内搭降低复杂度，只做结构衬托" : "外套保持简洁，只做轮廓衬托";
  const motifText = check.themeDirectionLayer && check.themeDirectionLayer.visualMotifs.length
    ? `${check.themeDirectionLayer.visualMotifs.slice(0, 2).join("和")}元素集中在${check.motifMainPlacement}${check.motifEchoPlacement ? `，${check.motifEchoPlacement}` : ""}`
    : "主题母题只做少量集中表达";
  return `整体以${primary}为主${secondary}，${dominant}，${support}，${motifText}。`;
}

module.exports = {
  buildOutfitCoherenceCheck,
  styleLabel,
};
