const presenceOptions = ["none", "light", "medium", "heavy"];

const baseTypes = [
  "cropped jacket",
  "work jacket",
  "bomber jacket",
  "track jacket",
  "hoodie jacket",
  "cardigan",
  "haori-inspired jacket",
  "short cloak",
  "utility vest",
  "blazer",
  "long coat",
  "half-cape",
];

const silhouettes = ["boxy", "wide shoulder", "cropped", "oversized", "A-line", "heavy upper body", "draped"];
const lengths = ["cropped", "waist length", "hip length", "thigh length", "long"];
const cutLanguages = ["symmetrical", "asymmetrical", "layered", "panel cut", "split hem", "wrap style", "modular"];
const designFocusOptions = ["collar", "shoulder", "sleeve", "hem", "waist", "back panel", "pocket", "hood"];
const structuralFeatures = [
  "oversized collar",
  "broad shoulder panel",
  "large cuffs",
  "cape layer",
  "fake two-piece",
  "detachable panel",
  "wide placket",
  "large pocket",
  "heavy hem",
];
const materials = ["cotton canvas", "matte nylon", "wool blend", "denim", "leather trim", "thick jersey", "soft knit", "utility fabric"];
const finishes = ["clean matte", "flat color blocks", "low texture", "subtle edge trim", "simplified cel-shaded material"];
const wearStates = ["open", "half open", "closed", "draped over shoulders", "one shoulder slipped", "tied around waist", "sleeves rolled"];

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

function forcedOrPick(value, items, rng) {
  return value && items.includes(value) ? value : pick(items, rng);
}

function getOuterwearLimits(designLanguage) {
  return {
    focusCount: designLanguage.visualFocusCount === "one_main" ? 1 : 2,
    structureCount: designLanguage.complexityBudget === "rich_controlled" ? 2 : 1,
    detailScale: designLanguage.ornamentScale === "small_dense" ? "medium" : "medium_large",
    densityRule: designLanguage.detailDensity === "high" ? "controlled detail clusters" : "low-to-medium detail density",
    noiseRule: ["clean", "controlled"].includes(designLanguage.surfaceNoiseLevel)
      ? "avoid high-frequency trims, tiny straps, tiny charms, dense seams, and small patterns"
      : "allow texture only when it stays readable",
  };
}

function buildPromptFragment(module) {
  if (module.presence === "none") {
    return "no outerwear, keep the clean white fitted top as the main upper-body visual";
  }

  const visibilityRule = module.wearState === "closed"
    ? "closed outerwear may cover most of the top"
    : "leave the white fitted top partially visible";

  return [
    `${module.presence} ${module.baseType}`,
    `${module.silhouette} silhouette`,
    `${module.length}`,
    `${module.cutLanguage} cut`,
    `${module.material} with ${module.finish}`,
    `main focus ${module.designFocus.primary}`,
    module.designFocus.secondary ? `secondary focus ${module.designFocus.secondary}` : "",
    module.structuralFeature.length ? `large structure: ${module.structuralFeature.join(" / ")}` : "",
    module.themeMotifs && module.themeMotifs.length ? `theme motifs: ${module.themeMotifs.join(" / ")}` : "",
    module.materialMood ? `material mood: ${module.materialMood}` : "",
    `${module.wearState}, ${visibilityRule}`,
    `${module.detailScale} details, ${module.readabilityRule}`,
  ].filter(Boolean).join(", ");
}

function buildOuterwearModule(rng, options = {}) {
  const designLanguage = options.designLanguage;
  const themeDirectionLayer = options.themeDirectionLayer || null;
  const limits = getOuterwearLimits(designLanguage);
  const presence = forcedOrPick(options.presence, presenceOptions, rng);

  if (presence === "none") {
    const module = {
      moduleName: "outerwearModule",
      status: "active",
      designLanguage,
      presence,
      baseType: "none",
      silhouette: "none",
      length: "none",
      cutLanguage: "none",
      designFocus: { primary: "topModule", secondary: "" },
      structuralFeature: [],
      material: "none",
      finish: "none",
      wearState: "none",
      detailScale: limits.detailScale,
      readabilityRule: "white fitted top remains the primary upper-body shape",
      avoidanceRule: limits.noiseRule,
      themeDirectionLayer,
      themeMotifs: themeDirectionLayer ? themeDirectionLayer.visualMotifs.slice(0, 2) : [],
      materialMood: themeDirectionLayer ? themeDirectionLayer.materialMood : "",
    };
    return { ...module, promptFragment: buildPromptFragment(module) };
  }

  const designFocus = pickMany(designFocusOptions, limits.focusCount, rng);
  const module = {
    moduleName: "outerwearModule",
    status: "active",
    designLanguage,
    presence,
    baseType: forcedOrPick(options.baseType, baseTypes, rng),
    silhouette: forcedOrPick(options.silhouette, silhouettes, rng),
    length: forcedOrPick(options.length, lengths, rng),
    cutLanguage: forcedOrPick(options.cutLanguage, cutLanguages, rng),
    designFocus: {
      primary: designFocus[0],
      secondary: designFocus[1] || "",
    },
    structuralFeature: pickMany(structuralFeatures, limits.structureCount, rng),
    material: forcedOrPick(options.material, materials, rng),
    finish: forcedOrPick(options.finish, finishes, rng),
    wearState: forcedOrPick(options.wearState, wearStates, rng),
    detailScale: limits.detailScale,
    readabilityRule: `${limits.densityRule}; large-shape dominant, high readability, one main focus plus one secondary focus`,
    avoidanceRule: limits.noiseRule,
    themeDirectionLayer,
    themeMotifs: themeDirectionLayer ? themeDirectionLayer.visualMotifs.slice(0, 2) : [],
    materialMood: themeDirectionLayer ? themeDirectionLayer.materialMood : "",
  };

  return { ...module, promptFragment: buildPromptFragment(module) };
}

module.exports = {
  buildOuterwearModule,
  getOuterwearLimits,
};
