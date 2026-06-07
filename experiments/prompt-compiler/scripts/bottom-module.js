const baseTypes = [
  "straight work trousers",
  "tapered trousers",
  "relaxed utility pants",
  "cropped utility pants",
  "calf-length utility pants",
  "work shorts",
  "long shorts",
  "knee-length shorts",
  "relaxed shorts",
  "wide cropped trousers",
  "drawstring trousers",
  "wrap-panel trousers",
  "uniform trousers",
  "simple fitted pants",
  "wide casual trousers",
];

const silhouettes = ["straight", "relaxed", "tapered", "wide", "cropped-straight", "sturdy workwear", "soft daily", "heavy lower body"];
const lengthByPreference = {
  full_length: "full length",
  ankle_length: "ankle length",
  cropped_ankle: "cropped ankle",
  calf_length: "calf length",
  knee_length: "knee length",
  above_knee: "above knee",
};
const legExposureByPreference = {
  full_length: "covered",
  ankle_length: "ankle_visible",
  cropped_ankle: "ankle_visible",
  calf_length: "calf_visible",
  knee_length: "knee_visible",
  above_knee: "knee_visible",
};
const waistStructures = ["clean waistband", "work belt compatible", "tied waist", "layered waistband", "broad waistband", "practical belt loops"];
const legStructures = ["clean leg line", "side seam emphasis", "knee panel", "utility pocket panel", "wide thigh volume", "simple reinforced knee", "panel division", "wrapped front panel"];
const hemTreatments = ["clean hem", "cuffed hem", "rolled hem", "narrowed hem", "tucked into footwear", "open hem"];
const materials = ["cotton twill", "work canvas", "matte utility fabric", "soft blended fabric", "denim-like sturdy fabric", "dry woven fabric"];
const wearStates = ["clean", "lightly worn", "practical daily wear", "tidy workwear", "relaxed daily"];
const designFocusOptions = ["waist", "side pocket area", "thigh panel", "knee area", "hem / ankle", "side motif strip"];

const stylePools = {
  modern_workwear: {
    baseType: ["straight work trousers", "relaxed utility pants", "uniform trousers", "cropped utility pants", "work shorts", "long shorts"],
    shortBaseType: ["work shorts", "long shorts", "knee-length shorts", "cropped utility pants", "calf-length utility pants"],
    silhouette: ["straight", "sturdy workwear", "relaxed"],
    waistStructure: ["work belt compatible", "practical belt loops", "clean waistband"],
    legStructure: ["utility pocket panel", "simple reinforced knee", "clean leg line"],
    material: ["work canvas", "cotton twill", "matte utility fabric"],
  },
  sports_utility: {
    baseType: ["cropped utility pants", "tapered trousers", "simple fitted pants", "relaxed shorts", "wide cropped trousers"],
    shortBaseType: ["relaxed shorts", "knee-length shorts", "cropped utility pants", "wide cropped trousers"],
    silhouette: ["tapered", "cropped-straight", "sturdy workwear"],
    waistStructure: ["broad waistband", "work belt compatible", "clean waistband"],
    legStructure: ["knee panel", "side seam emphasis", "clean leg line"],
    material: ["matte utility fabric", "soft blended fabric", "dry woven fabric"],
  },
  traditional_modern: {
    baseType: ["drawstring trousers", "wrap-panel trousers", "wide casual trousers", "wide cropped trousers"],
    shortBaseType: ["wide cropped trousers", "calf-length utility pants", "long shorts"],
    silhouette: ["wide", "relaxed", "soft daily"],
    waistStructure: ["tied waist", "layered waistband", "broad waistband"],
    legStructure: ["wrapped front panel", "panel division", "clean leg line"],
    material: ["dry woven fabric", "cotton twill", "soft blended fabric"],
  },
  fantasy_worker: {
    baseType: ["relaxed utility pants", "wrap-panel trousers", "straight work trousers", "cropped utility pants", "long shorts"],
    shortBaseType: ["cropped utility pants", "calf-length utility pants", "long shorts", "work shorts"],
    silhouette: ["sturdy workwear", "relaxed", "heavy lower body"],
    waistStructure: ["work belt compatible", "broad waistband", "practical belt loops"],
    legStructure: ["side seam emphasis", "utility pocket panel", "panel division"],
    material: ["matte utility fabric", "work canvas", "dry woven fabric"],
  },
  soft_daily: {
    baseType: ["wide casual trousers", "tapered trousers", "simple fitted pants", "relaxed shorts", "wide cropped trousers"],
    shortBaseType: ["relaxed shorts", "wide cropped trousers", "knee-length shorts", "calf-length utility pants"],
    silhouette: ["soft daily", "relaxed", "straight"],
    waistStructure: ["clean waistband", "tied waist", "broad waistband"],
    legStructure: ["clean leg line", "side seam emphasis", "panel division"],
    material: ["soft blended fabric", "cotton twill", "dry woven fabric"],
  },
  urban_casual: {
    baseType: ["tapered trousers", "simple fitted pants", "wide casual trousers", "wide cropped trousers", "relaxed shorts"],
    shortBaseType: ["wide cropped trousers", "relaxed shorts", "knee-length shorts", "cropped utility pants"],
    silhouette: ["tapered", "straight", "relaxed"],
    waistStructure: ["clean waistband", "practical belt loops", "broad waistband"],
    legStructure: ["clean leg line", "side seam emphasis", "knee panel"],
    material: ["cotton twill", "denim-like sturdy fabric", "soft blended fabric"],
  },
};

function pick(items, rng) {
  if (!items || !items.length) return "";
  return items[Math.floor(rng() * items.length)];
}

function weightedPick(weightMap, rng) {
  const entries = Object.entries(weightMap).filter(([, weight]) => weight > 0);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries.length ? entries[entries.length - 1][0] : "full_length";
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

function poolFor(styleSource) {
  return stylePools[styleSource] || stylePools.urban_casual;
}

function bottomLimits(designLanguage, outfitCoherenceCheck) {
  const outerwearDominant = outfitCoherenceCheck && outfitCoherenceCheck.dominantModule === "outerwearModule";
  return {
    focusCount: designLanguage.visualFocusCount === "one_main" || outerwearDominant ? 1 : 2,
    complexityLevel: outerwearDominant ? "simple" : "moderate",
    motifUsage: outerwearDominant ? "single echo placement" : "restrained side accent",
  };
}

function inferBottomContext(themeDirectionLayer, outfitCoherenceCheck) {
  const theme = themeDirectionLayer || {};
  const resolved = theme.resolvedInfluences || {};
  if (resolved.climateInfluence || resolved.lifestyleInfluence || resolved.formalityLevel) {
    return {
      climateInfluence: resolved.climateInfluence || ["temperate"],
      presentationMode: resolved.presentationMode || (resolved.formalityLevel === "medium_high"
        ? "ceremonial_but_practical_mode"
        : resolved.movementInfluence && resolved.movementInfluence.includes("walk")
          ? "patrol_mode"
          : "work_mode"),
      lifestyleInfluence: resolved.lifestyleInfluence || ["practical"],
      source: "resolvedInfluences",
    };
  }
  const text = [
    theme.themeCategory,
    theme.themeLabel,
    theme.regionContext,
    theme.regionLabel,
    theme.environmentFlavor,
    ...(theme.environmentKeywords || []),
    ...(theme.materialHints || []),
  ].filter(Boolean).join(" ");

  const climateInfluence = [];
  if (/港|海|沿海|码头|harbor|coastal|mediterranean|latin_american/.test(text)) climateInfluence.push("coastal");
  if (/湿|雨|雨街|地下街|防水|排水|rain|humid|southeast_asian/.test(text)) climateInfluence.push("humid", "rainy");
  if (/温室|花棚|greenhouse|华南|市场棚|骑楼/.test(text)) climateInfluence.push("warm");
  if (/夏|节庆|夜市|市场|market/.test(text)) climateInfluence.push("summer");
  if (!climateInfluence.length) climateInfluence.push("temperate");

  let presentationMode = "work_mode";
  if (/健身|拳馆/.test(text) || outfitCoherenceCheck && outfitCoherenceCheck.primaryStyleSource === "sports_utility") {
    presentationMode = "off_duty_mode";
  } else if (/市场|夜市|温室|澡堂|花匠/.test(text)) {
    presentationMode = "daily_portrait_mode";
  } else if (/巡|守卫|安保|patrol|guard/.test(text)) {
    presentationMode = "patrol_mode";
  } else if (/书库|图书馆|钟楼|夜校|避难所/.test(text)) {
    presentationMode = "ceremonial_but_practical_mode";
  }

  const lifestyleInfluence = [];
  if (/健身|拳馆/.test(text) || outfitCoherenceCheck && outfitCoherenceCheck.primaryStyleSource === "sports_utility") lifestyleInfluence.push("athletic");
  if (/市场|夜市|街|社区/.test(text)) lifestyleInfluence.push("street", "casual");
  if (/港|码头|温室|巡|守卫|维修|物流|排水|防汛/.test(text)) lifestyleInfluence.push("practical", "outdoor", "workwear");
  if (!lifestyleInfluence.length) lifestyleInfluence.push("practical");

  return {
    climateInfluence: Array.from(new Set(climateInfluence)),
    presentationMode,
    lifestyleInfluence: Array.from(new Set(lifestyleInfluence)),
  };
}

function shortLengthWeightProfile(themeDirectionLayer, bottomContext) {
  const theme = themeDirectionLayer || {};
  const text = [
    theme.themeCategory,
    theme.themeLabel,
    theme.regionContext,
    theme.environmentFlavor,
    ...(bottomContext.climateInfluence || []),
    bottomContext.presentationMode,
    ...(bottomContext.lifestyleInfluence || []),
  ].filter(Boolean).join(" ");
  const weights = {
    full_length: 66,
    ankle_length: 8,
    cropped_ankle: 4,
    calf_length: 3,
    knee_length: 14,
    above_knee: 4,
  };
  const warmBoost = /hot|humid|rainy|coastal|greenhouse|summer|warm|harbor_district|coastal_neighborhood|southeast_asian_rain_street|south_china_market_street|mediterranean_port|latin_american_hill_town|market|温室|港|雨|市场|健身/.test(text);
  const shortFriendly = /off_duty_mode|daily_portrait_mode|patrol_mode|athletic|casual|practical|outdoor|street|workwear|greenhouse_gardener|harbor_pressure_maintenance|rain_infrastructure_observer|underground_fitness_trainer|warehouse_logistics_guard|festival_security/.test(text);
  const suppress = /ceremonial_but_practical_mode|formal|refined|old_money|cold|snow|winter|strict uniform|shelter_night_school_guide|clock_tower_maintainer|library_stack_keeper|book_repair_binder|书库|图书馆|钟楼|避难所|夜校|冷/.test(text);

  if (warmBoost) {
    weights.full_length -= 10;
    weights.cropped_ankle += 2;
    weights.calf_length += 2;
    weights.knee_length += 10;
    weights.above_knee += 3;
  }
  if (shortFriendly) {
    weights.full_length -= 5;
    weights.ankle_length += 1;
    weights.cropped_ankle += 1;
    weights.calf_length += 1;
    weights.knee_length += 7;
    weights.above_knee += 1;
  }
  if (suppress) {
    weights.full_length += 22;
    weights.knee_length = Math.max(1, weights.knee_length - 7);
    weights.above_knee = Math.max(0, weights.above_knee - 3);
    weights.calf_length = Math.max(2, weights.calf_length - 4);
  }

  return weights;
}

function reasonForLength(preferredLength, themeDirectionLayer, bottomContext) {
  const theme = themeDirectionLayer || {};
  const context = [
    ...(bottomContext.climateInfluence || []),
    bottomContext.presentationMode,
    ...(bottomContext.lifestyleInfluence || []),
    theme.themeCategory,
    theme.regionContext,
  ].filter(Boolean).slice(0, 5).join(", ");
  const exposure = legExposureByPreference[preferredLength];
  if (preferredLength === "full_length") return `full length selected for stable lower-body support; context: ${context}`;
  if (exposure === "ankle_visible") return `shorter trouser length selected to expose a clean ankle and sock transition; context: ${context}`;
  if (exposure === "calf_visible") return `calf-visible length selected because practical climate or movement context supports leg exposure; context: ${context}`;
  return `knee-visible shorts direction selected because climate, lifestyle, or patrol/work context supports practical leg exposure; context: ${context}`;
}

function pickBaseTypeForLength(stylePool, preferredLength, rng) {
  const shortPool = stylePool.shortBaseType || stylePool.baseType;
  if (preferredLength === "above_knee") {
    return pick(shortPool.filter((item) => /shorts/.test(item)), rng) || pick(shortPool, rng);
  }
  if (preferredLength === "knee_length") return pick(shortPool.filter((item) => /shorts/.test(item)), rng) || pick(shortPool, rng);
  if (preferredLength === "calf_length") {
    return pick(shortPool.filter((item) => /calf|cropped|wide cropped|long shorts/.test(item)), rng) || pick(shortPool, rng);
  }
  if (preferredLength === "cropped_ankle") {
    return pick(shortPool.filter((item) => /cropped|wide cropped|utility pants/.test(item)), rng) || pick(stylePool.baseType, rng);
  }
  if (preferredLength === "ankle_length") {
    return pick(stylePool.baseType.filter((item) => !/shorts|cropped|calf/.test(item)), rng) || pick(stylePool.baseType, rng);
  }
  return pick(stylePool.baseType.filter((item) => !/shorts|cropped|calf/.test(item)), rng) || pick(stylePool.baseType, rng);
}

function buildSockVisibilityProfile(preferredLength) {
  if (preferredLength === "full_length") {
    return {
      sockVisibility: "hidden",
      sockColor: "white",
      sockLength: "crew_socks",
      sockReason: "full-length trousers cover most of the sock, so white socks do not need emphasis",
    };
  }
  if (preferredLength === "ankle_length" || preferredLength === "cropped_ankle") {
    return {
      sockVisibility: preferredLength === "cropped_ankle" ? "clearly_visible" : "slightly_visible",
      sockColor: "white",
      sockLength: preferredLength === "cropped_ankle" ? "mid_calf_socks" : "crew_socks",
      sockReason: "shorter trouser hem leaves a clean white sock transition between pants and shoes",
    };
  }
  if (preferredLength === "calf_length") {
    return {
      sockVisibility: "clearly_visible",
      sockColor: "white",
      sockLength: "mid_calf_socks",
      sockReason: "calf-visible pants need clear white socks to stabilize the lower-leg shape",
    };
  }
  return {
    sockVisibility: "dominant_visible",
    sockColor: "white",
    sockLength: "knee_high_socks",
    sockReason: "shorts expose the lower leg, so clean white socks become part of the lower-body design",
  };
}

function resolveLengthForBaseType(baseType, preferredLength) {
  if (baseType === "calf-length utility pants") return "calf_length";
  if (baseType === "wide cropped trousers" && !["cropped_ankle", "calf_length"].includes(preferredLength)) {
    return "cropped_ankle";
  }
  if (baseType === "cropped utility pants" && !["cropped_ankle", "calf_length"].includes(preferredLength)) {
    return "cropped_ankle";
  }
  if (baseType === "knee-length shorts") return "knee_length";
  if (baseType === "work shorts") return "knee_length";
  if (baseType === "relaxed shorts") return "knee_length";
  if (baseType === "long shorts" && !["above_knee", "knee_length"].includes(preferredLength)) {
    return "knee_length";
  }
  return preferredLength;
}

function buildPromptFragment(module) {
  const focus = module.designFocus.join(" / ");
  const motif = module.motifUsage === "none" ? "no theme motif on pants" : `${module.motifUsage}: ${module.motifEcho}`;
  return [
    `${module.baseType}`,
    `${module.silhouette} silhouette`,
    module.length,
    module.bottomLengthPreference ? `leg exposure ${module.bottomLengthPreference.legExposureLevel}` : "",
    module.sockVisibilityProfile ? `white socks ${module.sockVisibilityProfile.sockVisibility} ${module.sockVisibilityProfile.sockLength}` : "",
    module.waistStructure,
    module.legStructure,
    module.hemTreatment,
    module.material,
    module.wearState,
    `focus ${focus}`,
    motif,
    `${module.complexityLevel} complexity`,
  ].filter(Boolean).join(", ");
}

function buildBottomModule(rng, options = {}) {
  const designLanguage = options.designLanguage;
  const themeDirectionLayer = options.themeDirectionLayer || null;
  const outfitCoherenceCheck = options.outfitCoherenceCheck || null;
  const compositionLayer = options.compositionLayer || null;
  const primaryStyle = outfitCoherenceCheck ? outfitCoherenceCheck.primaryStyleSource : "urban_casual";
  const stylePool = poolFor(primaryStyle);
  const limits = bottomLimits(designLanguage, outfitCoherenceCheck);
  const bottomContext = inferBottomContext(themeDirectionLayer, outfitCoherenceCheck);
  const initialPreferredLength = weightedPick(shortLengthWeightProfile(themeDirectionLayer, bottomContext), rng);
  const baseType = pickBaseTypeForLength(stylePool, initialPreferredLength, rng);
  const preferredLength = resolveLengthForBaseType(baseType, initialPreferredLength);
  const sockVisibilityProfile = buildSockVisibilityProfile(preferredLength);
  const designFocus = pickMany(designFocusOptions, limits.focusCount, rng);
  const motifs = themeDirectionLayer ? themeDirectionLayer.visualMotifs || [] : [];
  const motifEcho = motifs.length ? `${motifs[0]} at ${pick(["side seam", "waist edge", "hem edge"], rng)}` : "";

  const module = {
    moduleName: "bottomModule",
    status: "active",
    designLanguage,
    themeDirectionLayer,
    outfitCoherenceCheck: outfitCoherenceCheck
      ? {
          primaryStyleSource: outfitCoherenceCheck.primaryStyleSource,
          dominantModule: outfitCoherenceCheck.dominantModule,
          supportingModule: outfitCoherenceCheck.supportingModule,
      }
      : null,
    bottomContext,
    presence: "developed",
    baseType,
    silhouette: pick(stylePool.silhouette, rng),
    length: lengthByPreference[preferredLength],
    bottomLengthPreference: {
      legExposureLevel: legExposureByPreference[preferredLength],
      preferredLength,
      initialPreferredLength,
      lengthReason: reasonForLength(preferredLength, themeDirectionLayer, bottomContext),
    },
    sockVisibilityProfile,
    waistStructure: pick(stylePool.waistStructure, rng),
    legStructure: pick(stylePool.legStructure, rng),
    hemTreatment: pick(hemTreatments, rng),
    material: pick(stylePool.material, rng),
    wearState: pick(wearStates, rng),
    designFocus,
    motifUsage: motifs.length ? limits.motifUsage : "none",
    motifEcho,
    compositionEcho: compositionLayer
      ? {
          sourceMotifs: compositionLayer.sourceMotifs.slice(0, 2),
          edgeOrPocketEcho: compositionLayer.garmentMapping.secondaryPanel,
          lineEcho: compositionLayer.garmentMapping.linePlacement,
          rule: "only a small edge, pocket, or side-seam echo; do not compete with upper body",
        }
      : null,
    complexityLevel: limits.complexityLevel,
    role: "support full-body silhouette without competing with upper body",
  };

  return {
    ...module,
    promptFragment: buildPromptFragment(module),
  };
}

module.exports = {
  buildBottomModule,
};
