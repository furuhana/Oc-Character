const baseTypes = [
  "straight work trousers",
  "tapered trousers",
  "relaxed utility pants",
  "cropped utility pants",
  "work shorts",
  "long shorts",
  "drawstring trousers",
  "wrap-panel trousers",
  "uniform trousers",
  "simple fitted pants",
  "wide casual trousers",
];

const silhouettes = ["straight", "relaxed", "tapered", "wide", "cropped-straight", "sturdy workwear", "soft daily", "heavy lower body"];
const lengths = ["full length", "ankle length", "cropped ankle", "calf length", "knee length"];
const waistStructures = ["clean waistband", "work belt compatible", "tied waist", "layered waistband", "broad waistband", "practical belt loops"];
const legStructures = ["clean leg line", "side seam emphasis", "knee panel", "utility pocket panel", "wide thigh volume", "simple reinforced knee", "panel division", "wrapped front panel"];
const hemTreatments = ["clean hem", "cuffed hem", "rolled hem", "narrowed hem", "tucked into footwear", "open hem"];
const materials = ["cotton twill", "work canvas", "matte utility fabric", "soft blended fabric", "denim-like sturdy fabric", "dry woven fabric"];
const wearStates = ["clean", "lightly worn", "practical daily wear", "tidy workwear", "relaxed daily"];
const designFocusOptions = ["waist", "side pocket area", "thigh panel", "knee area", "hem / ankle", "side motif strip"];

const stylePools = {
  modern_workwear: {
    baseType: ["straight work trousers", "relaxed utility pants", "uniform trousers"],
    silhouette: ["straight", "sturdy workwear", "relaxed"],
    waistStructure: ["work belt compatible", "practical belt loops", "clean waistband"],
    legStructure: ["utility pocket panel", "simple reinforced knee", "clean leg line"],
    material: ["work canvas", "cotton twill", "matte utility fabric"],
  },
  sports_utility: {
    baseType: ["cropped utility pants", "tapered trousers", "simple fitted pants"],
    silhouette: ["tapered", "cropped-straight", "sturdy workwear"],
    waistStructure: ["broad waistband", "work belt compatible", "clean waistband"],
    legStructure: ["knee panel", "side seam emphasis", "clean leg line"],
    material: ["matte utility fabric", "soft blended fabric", "dry woven fabric"],
  },
  traditional_modern: {
    baseType: ["drawstring trousers", "wrap-panel trousers", "wide casual trousers"],
    silhouette: ["wide", "relaxed", "soft daily"],
    waistStructure: ["tied waist", "layered waistband", "broad waistband"],
    legStructure: ["wrapped front panel", "panel division", "clean leg line"],
    material: ["dry woven fabric", "cotton twill", "soft blended fabric"],
  },
  fantasy_worker: {
    baseType: ["relaxed utility pants", "wrap-panel trousers", "straight work trousers"],
    silhouette: ["sturdy workwear", "relaxed", "heavy lower body"],
    waistStructure: ["work belt compatible", "broad waistband", "practical belt loops"],
    legStructure: ["side seam emphasis", "utility pocket panel", "panel division"],
    material: ["matte utility fabric", "work canvas", "dry woven fabric"],
  },
  soft_daily: {
    baseType: ["wide casual trousers", "tapered trousers", "simple fitted pants"],
    silhouette: ["soft daily", "relaxed", "straight"],
    waistStructure: ["clean waistband", "tied waist", "broad waistband"],
    legStructure: ["clean leg line", "side seam emphasis", "panel division"],
    material: ["soft blended fabric", "cotton twill", "dry woven fabric"],
  },
  urban_casual: {
    baseType: ["tapered trousers", "simple fitted pants", "wide casual trousers"],
    silhouette: ["tapered", "straight", "relaxed"],
    waistStructure: ["clean waistband", "practical belt loops", "broad waistband"],
    legStructure: ["clean leg line", "side seam emphasis", "knee panel"],
    material: ["cotton twill", "denim-like sturdy fabric", "soft blended fabric"],
  },
};

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

function buildPromptFragment(module) {
  const focus = module.designFocus.join(" / ");
  const motif = module.motifUsage === "none" ? "no theme motif on pants" : `${module.motifUsage}: ${module.motifEcho}`;
  return [
    `${module.baseType}`,
    `${module.silhouette} silhouette`,
    module.length,
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
  const primaryStyle = outfitCoherenceCheck ? outfitCoherenceCheck.primaryStyleSource : "urban_casual";
  const stylePool = poolFor(primaryStyle);
  const limits = bottomLimits(designLanguage, outfitCoherenceCheck);
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
    presence: "developed",
    baseType: pick(stylePool.baseType, rng),
    silhouette: pick(stylePool.silhouette, rng),
    length: pick(lengths, rng),
    waistStructure: pick(stylePool.waistStructure, rng),
    legStructure: pick(stylePool.legStructure, rng),
    hemTreatment: pick(hemTreatments, rng),
    material: pick(stylePool.material, rng),
    wearState: pick(wearStates, rng),
    designFocus,
    motifUsage: motifs.length ? limits.motifUsage : "none",
    motifEcho,
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
