const originBundles = [
  {
    nationality: "中国",
    region: "华南",
    regionContext: "south_china_market_street",
    birthplace: "南方港城",
    localityFlavor: "老市场后巷",
    environmentFlavor: "湿热市场街",
    workplaceBase: "夜市冷柜摊位",
    raceOrSpecies: "human",
    heritage: "local market family",
    familyBackground: "stall-helper family with long local ties",
    climateInfluence: ["humid heat", "wet pavement reflection", "plastic awning shade"],
    localityVisualCues: ["arcade shadow", "market back lane", "stall light strings"],
    paletteBias: ["wet gray", "deep teal", "warm stall light", "off white"],
  },
  {
    nationality: "中国",
    region: "华北",
    regionContext: "north_china_old_city",
    birthplace: "老城区",
    localityFlavor: "供热管院落",
    environmentFlavor: "干冷旧城街巷",
    workplaceBase: "市政管线值守点",
    raceOrSpecies: "human",
    heritage: "old municipal worker family",
    familyBackground: "ordinary but respected maintenance household",
    climateInfluence: ["dry cold air", "coal dust marks", "old brick alleys"],
    localityVisualCues: ["courtyard gate shadow", "heating pipe corridor", "old street lamps"],
    paletteBias: ["gray blue", "coal black", "old copper", "old white"],
  },
  {
    nationality: "巴西",
    region: "拉美山城",
    regionContext: "harbor_district",
    birthplace: "渡轮港城区",
    localityFlavor: "河边仓库区",
    environmentFlavor: "潮湿港口维修带",
    workplaceBase: "仓库侧服务通道",
    raceOrSpecies: "human",
    heritage: "dockside repair family",
    familyBackground: "port service family with practical craft habits",
    climateInfluence: ["salt wind", "humid metal", "morning mist"],
    localityVisualCues: ["ferry terminal wall", "crate straps", "pipe corridor"],
    paletteBias: ["mist blue", "dark teal gray", "oxidized copper", "off white"],
  },
  {
    nationality: "巴西",
    region: "拉美山城",
    regionContext: "latin_american_hill_town",
    birthplace: "山坡温室小镇",
    localityFlavor: "温室供给路",
    environmentFlavor: "潮湿玻璃棚",
    workplaceBase: "温室夜间看护区",
    raceOrSpecies: "human",
    heritage: "plant nursery repair family",
    familyBackground: "low-income nursery helpers with reliable neighbors",
    climateInfluence: ["warm greenhouse humidity", "sun-faded plastic", "soil stains"],
    localityVisualCues: ["greenhouse frame", "irrigation hose", "vine trellis"],
    paletteBias: ["leaf green", "sun-faded white", "soil brown", "rubber black"],
  },
];

const socialBundles = [
  {
    wealthLevel: "low income but socially trusted",
    class: "working class",
    occupation: "night market freezer crate mover and stall watcher",
    organization: "stall-owner mutual-aid group",
    education: "practical apprenticeship",
    socialReputation: "reliable familiar face",
    dailyActivity: "moves freezer crates before dawn, organizes stall cables, watches over stalls at night",
    workplace: "humid arcade market back lane",
    clothingNeatness: "durable but not sloppy",
    materialQuality: "practical waterproof cloth and rubber edges",
    formalityLevel: "low_medium",
    practicalityLevel: "high",
  },
  {
    wealthLevel: "old-money family, personally does basic work",
    class: "downward-mobile local gentry",
    occupation: "old cinema projection booth repairman",
    organization: "neighborhood cinema preservation crew",
    education: "technical school",
    socialReputation: "quietly capable and a little proud",
    dailyActivity: "repairs projector rails, replaces lamp housings, carries film cans through narrow stairs",
    workplace: "old cinema projection room",
    clothingNeatness: "cleaner tailoring with few refined fittings",
    materialQuality: "neat canvas, low-key leather trim, aged metal buckles",
    formalityLevel: "medium",
    practicalityLevel: "medium_high",
  },
  {
    wealthLevel: "stable modest wage",
    class: "municipal service worker",
    occupation: "rooftop radio antenna repairman",
    organization: "small public radio maintenance team",
    education: "trade school",
    socialReputation: "steady person people call in bad weather",
    dailyActivity: "climbs rooftop stairs, tightens antenna cables, checks signal boxes after rain",
    workplace: "rooftop radio shed and stairwell",
    clothingNeatness: "tidy utility wear",
    materialQuality: "windproof cloth, rubberized seams, brushed metal clips",
    formalityLevel: "medium",
    practicalityLevel: "high",
  },
  {
    wealthLevel: "low income with stable community support",
    class: "service worker",
    occupation: "public pool lifeguard and closing-shift caretaker",
    organization: "municipal pool staff",
    education: "first-aid certificate",
    socialReputation: "protective and reassuring",
    dailyActivity: "checks lane ropes, folds float markers, cleans tiled showers, locks pool gates",
    workplace: "public pool after-hours deck",
    clothingNeatness: "clean sporty practical",
    materialQuality: "quick-dry fabric, rubber guards, tile-colored trim",
    formalityLevel: "low_medium",
    practicalityLevel: "high",
  },
  {
    wealthLevel: "modest but not poor",
    class: "street service specialist",
    occupation: "bridge lantern inspector",
    organization: "night bridge maintenance crew",
    education: "utility apprenticeship",
    socialReputation: "patient, watchful, dependable",
    dailyActivity: "checks bridge lantern brackets, wipes rain lenses, marks cable tension points",
    workplace: "windy bridge service walkway",
    clothingNeatness: "orderly weatherproof workwear",
    materialQuality: "waterproof cloth, dull brass, rubber hems",
    formalityLevel: "medium",
    practicalityLevel: "high",
  },
];

const psychologicalBundles = [
  {
    desire: "medium high, wants people to notice his strength and reliability",
    fear: "being forgotten after the old street is demolished",
    trauma: "lost a former workplace during redevelopment",
    flaw: "takes on too many other people's problems",
    obsession: "keeps routes and tools arranged in a repeatable order",
    habit: "adjusts his belt and gloves while speaking",
    hiddenInformation: "knows many back-lane shortcuts",
    personalityCore: "warm_protective",
    physicalConfidence: "high",
  },
  {
    desire: "low, prefers not to draw attention",
    fear: "making a visible mistake in public",
    trauma: "once failed an inspection that hurt coworkers",
    flaw: "overchecks every closure and strap",
    obsession: "keeps front edges aligned",
    habit: "smooths the front placket before answering",
    hiddenInformation: "keeps a private repair notebook",
    personalityCore: "quiet_observant",
    physicalConfidence: "medium",
  },
  {
    desire: "high, enjoys being seen as strong and stylish",
    fear: "being treated as disposable labor",
    trauma: "grew up ignored by official crews",
    flaw: "shows off when praised",
    obsession: "keeps visible gear polished",
    habit: "rolls shoulders before lifting",
    hiddenInformation: "secretly designs better work layouts",
    personalityCore: "cheerful_loud",
    physicalConfidence: "high",
  },
  {
    desire: "moderate, wants respect more than attention",
    fear: "letting his team down",
    trauma: "injured while protecting a younger coworker",
    flaw: "too stubborn to ask for help",
    obsession: "reinforces weak points before they fail",
    habit: "checks wrist wraps and pocket flaps",
    hiddenInformation: "keeps spare supplies for others",
    personalityCore: "serious_focused",
    physicalConfidence: "medium_high",
  },
];

const riskBundles = [
  {
    criminalRecord: "caught reselling discarded electronics when young",
    violenceTendency: "low, but firm when people exploit neighbors",
    threatLevel: "guarded but not aggressive",
    conflictHistory: "knows old back alleys and repair markets",
    undergroundTies: "informal parts traders",
    derivedRiskLogic: ["hidden inner pockets", "old metal number plates", "crate-strap closures", "more cautious stance"],
  },
  {
    criminalRecord: "none, but often questioned because of underground contacts",
    violenceTendency: "medium low, defensive only",
    threatLevel: "watchful",
    conflictHistory: "has broken up workplace disputes",
    undergroundTies: "night-shift repair people",
    derivedRiskLogic: ["reinforced forearm zones", "secure closures", "durable gloves", "protected side pockets"],
  },
  {
    criminalRecord: "minor permit trouble from helping street vendors",
    violenceTendency: "low",
    threatLevel: "approachable but hard to move",
    conflictHistory: "regular arguments with inspectors",
    undergroundTies: "stall-owner message chain",
    derivedRiskLogic: ["non-logo identifiers", "practical storage", "weathered waist structure", "firm grounded posture"],
  },
];

const worldHookBundles = [
  {
    imagination: "he imagines the whole market as a refrigerator machine running at night",
    characterHook: "keeps people and cold goods moving before sunrise",
    fantasyFlavor: "restrained urban fantasy",
    abilityConcept: "reads cold airflow and stall-light rhythm",
    weirdIdea: "freezer-grid order becomes his personal design logic",
  },
  {
    imagination: "he thinks of the cinema as a sleeping lantern that must be relit",
    characterHook: "protects the last projection room in the district",
    fantasyFlavor: "retro civic fantasy",
    abilityConcept: "follows projector light paths like repair maps",
    weirdIdea: "film rail geometry becomes garment structure",
  },
  {
    imagination: "he treats radio static as weather from another district",
    characterHook: "climbs rooftops to keep voices connected",
    fantasyFlavor: "low-key signal fantasy",
    abilityConcept: "feels antenna tension through touch",
    weirdIdea: "antenna arcs and cable ties become restrained motifs",
  },
  {
    imagination: "he sees the closed pool as a quiet tiled harbor",
    characterHook: "watches over the pool after everyone leaves",
    fantasyFlavor: "restrained civic fantasy",
    abilityConcept: "reads ripples and lane tension",
    weirdIdea: "lane ropes and tile grids become clothing rhythm",
  },
  {
    imagination: "he imagines bridge lights as a row of small weather clocks",
    characterHook: "keeps night travelers oriented in wind and rain",
    fantasyFlavor: "restrained urban fantasy",
    abilityConcept: "reads lantern flicker and cable vibration",
    weirdIdea: "bridge cables and lantern frames become body-axis structure",
  },
];

const concreteThemeLibrary = {
  "night market freezer crate mover and stall watcher": {
    themeCategory: "night_market_loading_guard",
    themeLabel: "night market freezer-crate watcher",
    dailyActivity: "moves freezer crates before dawn, organizes stall cables, watches the stalls at night",
    workplace: "humid arcade market back lane",
    visualObjects: ["freezer grid", "plastic awning edge", "stall light frame", "crate straps", "wet pavement reflection"],
    activityMotifs: ["crate straps", "freezer rounded door", "cargo rack grid"],
    environmentMotifs: ["plastic awning diagonal", "stall light frame", "arcade shadow"],
    materialMotifs: ["waterproof cloth", "rubber edge", "scuffed plastic"],
  },
  "old cinema projection booth repairman": {
    themeCategory: "old_cinema_projectionist",
    themeLabel: "old cinema projection-booth repairman",
    dailyActivity: "repairs projector rails, replaces lamp housings, carries film cans through narrow stairs",
    workplace: "old cinema projection room",
    visualObjects: ["projector light beam", "film rail", "lamp housing frame", "seat-row spacing", "ticket punch holes"],
    activityMotifs: ["projector light beam", "film rail", "lamp housing frame"],
    environmentMotifs: ["seat-row spacing", "projection-window rectangle", "narrow stair rail"],
    materialMotifs: ["aged brass", "matte canvas", "black rubber cable"],
  },
  "rooftop radio antenna repairman": {
    themeCategory: "rooftop_radio_repairman",
    themeLabel: "rooftop radio antenna repairman",
    dailyActivity: "climbs rooftop stairs, tightens antenna cables, checks signal boxes after rain",
    workplace: "rooftop radio shed and stairwell",
    visualObjects: ["radio antenna arcs", "cable ties", "signal box vents", "roof railing", "rainproof tape"],
    activityMotifs: ["radio antenna arcs", "cable ties", "signal box vents"],
    environmentMotifs: ["roof railing", "stairwell shadow", "service hatch frame"],
    materialMotifs: ["windproof cloth", "rubberized seam", "brushed metal clip"],
  },
  "public pool lifeguard and closing-shift caretaker": {
    themeCategory: "public_pool_lifeguard",
    themeLabel: "public pool lifeguard and closing-shift caretaker",
    dailyActivity: "checks lane ropes, folds float markers, cleans tiled showers, locks pool gates",
    workplace: "public pool after-hours deck",
    visualObjects: ["pool lane rope arcs", "tile grid", "float marker curve", "rescue buoy strap", "gate hinge"],
    activityMotifs: ["pool lane rope arcs", "float marker curve", "rescue buoy strap"],
    environmentMotifs: ["tile grid", "pool edge line", "shower partition seam"],
    materialMotifs: ["quick-dry fabric", "rubber guard", "matte plastic"],
  },
  "bridge lantern inspector": {
    themeCategory: "bridge_lantern_inspector",
    themeLabel: "bridge lantern inspector",
    dailyActivity: "checks lantern brackets, wipes rain lenses, marks cable tension points",
    workplace: "windy bridge service walkway",
    visualObjects: ["bridge cable lines", "lantern frame", "rain lens edge", "service walkway rail", "tension marker bands"],
    activityMotifs: ["bridge cable lines", "lantern frame", "tension marker bands"],
    environmentMotifs: ["service walkway rail", "rain lens edge", "bridge deck stripe"],
    materialMotifs: ["waterproof cloth", "dull brass", "rubber hem"],
  },
};

const genericLowPotentialMotifs = new Set([
  "old key",
  "key",
  "ticket",
  "receipt",
  "paper slip",
  "paper tag",
  "doorplate",
  "nameplate",
  "charm",
  "talisman",
  "generic badge",
  "generic seal",
  "generic token",
  "generic note",
  "old document",
  "generic paper",
]);

const broadThemeCategories = new Set([
  "urban_fantasy_worker",
  "city_worker",
  "market_worker",
  "civic_worker",
  "night_worker",
  "fantasy_worker",
  "street_worker",
  "public_service_worker",
  "maintenance_worker",
  "generic_civic_worker",
]);

const fieldMotifLabels = {
  "crate straps": "货箱绑带",
  "freezer rounded door": "冷柜圆角门",
  "cargo rack grid": "货架网格",
  "plastic awning diagonal": "塑料雨棚斜边",
  "stall light frame": "摊位灯架",
  "projector light beam": "放映光束",
  "film rail": "胶片轨道",
  "lamp housing frame": "灯箱框架",
  "radio antenna arcs": "电台天线弧线",
  "cable ties": "束线带",
  "signal box vents": "信号箱通风口",
  "pool lane rope arcs": "泳道绳弧线",
  "float marker curve": "浮标曲线",
  "rescue buoy strap": "救生圈绑带",
  "bridge cable lines": "桥梁缆线",
  "lantern frame": "桥灯框架",
  "tension marker bands": "张力标记带",
};

const nationalityAllowList = new Set([
  "中国",
  "日本",
  "韩国",
  "泰国",
  "越南",
  "印度尼西亚",
  "菲律宾",
  "美国",
  "巴西",
  "法国",
  "土耳其",
]);

const nationalityPollutionPattern = /后巷|市场|夜市|澡堂|车站|温室|放映室|雨棚|港口|街区|仓库|屋顶|桥下|摊位|工厂|影院|泳池|小镇|港城|雨街|老街|港区|澡堂|维修|巡检|锅炉|更衣室/;

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function uniq(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function buildFieldBundle(origin, social, risk, psychological, worldHook) {
  return {
    nationality: origin.nationality,
    region: origin.region,
    birthplace: origin.birthplace,
    localityFlavor: origin.localityFlavor,
    environmentFlavor: origin.environmentFlavor,
    workplace: social.workplace || origin.workplaceBase,
    raceOrSpecies: origin.raceOrSpecies || "human",
    wealthLevel: social.wealthLevel,
    classStatus: social.classStatus || social.class,
    occupation: social.occupation,
    organization: social.organization,
    desire: psychological.desire,
    fear: psychological.fear,
    flaw: psychological.flaw,
    habit: psychological.habit,
    criminalRecord: risk.criminalRecord,
    violenceTendency: risk.violenceTendency,
    imagination: worldHook.imagination,
    personalityCore: psychological.personalityCore,
  };
}

function fieldBoundaryCheck(fieldBundle) {
  const riskNotes = [];
  const repairedFields = {};
  let scorePenalty = 0;
  const nationality = fieldBundle.nationality || "";

  if (!nationalityAllowList.has(nationality)) {
    riskNotes.push("field pollution: nationality is not a clean country-level value");
    scorePenalty += 4;
  }
  if (nationalityPollutionPattern.test(nationality)) {
    riskNotes.push("field pollution: nationality contains locality, workplace, or environment flavor");
    scorePenalty += 8;
  }

  const localityWords = /后巷|街|街区|市场|夜市|澡堂|车站|温室|放映室|雨棚|港口|仓库|屋顶|桥下|摊位|工厂|影院|泳池/;
  if (localityWords.test(fieldBundle.nationality || "")) {
    repairedFields.nationality = "";
  }

  const passed = scorePenalty === 0;
  return {
    moduleName: "fieldBoundaryCheck",
    passed,
    scorePenalty,
    riskNotes,
    repairedFields,
    rule: "Upstream fields must stay clean: nationality is country-level only; region, birthplace, localityFlavor, environmentFlavor, and workplace stay separate.",
  };
}

function buildStagedDependencyGraph(fieldBundle, origin, social, risk, psychological, worldHook, concreteTheme) {
  return [
    {
      pass: "fieldBundle",
      reads: ["origin", "social", "risk", "psychological", "worldHook"],
      writes: ["nationality", "region", "birthplace", "localityFlavor", "environmentFlavor", "workplace", "occupation", "personalityCore"],
      note: "Clean 1.0-like fields are generated first and kept separate.",
    },
    {
      pass: "lifeLogic",
      reads: ["wealthLevel", "classStatus", "occupation", "organization", "desire", "fear", "habit", "flaw"],
      writes: ["derivedLifeContext", "desireExposureInfluence"],
      note: "Life context is inferred from multiple fields, not copied into final prompt.",
    },
    {
      pass: "workBehavior",
      reads: ["occupation", "workplace", "dailyActivity", "organization", "criminalRecord", "violenceTendency"],
      writes: ["concreteTheme", "riskInfluence", "derivedGarmentLogic"],
      note: "Occupation becomes behavior and workplace pressure before becoming visual logic.",
    },
    {
      pass: "visualObjectDerivation",
      reads: ["workplace", "dailyActivity", "environmentFlavor", "imagination", "characterHook"],
      writes: ["derivedVisualContext", "motifCandidates"],
      note: "Concrete objects come from activity and environment, avoiding generic keys, tickets, charms, and papers.",
    },
    {
      pass: "garmentAndComposition",
      reads: ["motifCandidates", "materialQuality", "riskInfluence", "desireExposureInfluence"],
      writes: ["derivedGarmentLogic", "compositionLayer source motifs"],
      note: "Motifs are intended for garment panels, seams, pockets, guards, and restrained accents.",
    },
  ].map((entry) => ({
    ...entry,
    fieldSnapshot: entry.pass === "fieldBundle" ? {
      nationality: fieldBundle.nationality,
      region: fieldBundle.region,
      birthplace: fieldBundle.birthplace,
      localityFlavor: fieldBundle.localityFlavor,
      environmentFlavor: fieldBundle.environmentFlavor,
      workplace: fieldBundle.workplace,
      occupation: fieldBundle.occupation,
    } : undefined,
  }));
}

function deriveDesireExposure(psychological, social) {
  const desireText = `${psychological.desire} ${psychological.physicalConfidence} ${social.formalityLevel}`;
  const high = /^high/.test(psychological.desire) || psychological.physicalConfidence === "high";
  const mediumHigh = /medium high|medium_high|moderate/.test(desireText);
  const formal = /medium_high/.test(social.formalityLevel);
  if (high && !formal) {
    return {
      exposureLevel: "open",
      tightnessLevel: "tight",
      bodyDisplayLevel: "high",
      outerwearOpenness: "open",
      allowedSkinAreas: ["arms", "shoulders", "upper_chest", "calves"],
      sensualityLevel: "confident",
      restraintRule: "adult, stylish, non-explicit; no nudity; clothing design must still be present",
    };
  }
  if (mediumHigh) {
    return {
      exposureLevel: "moderate",
      tightnessLevel: "fitted",
      bodyDisplayLevel: "medium",
      outerwearOpenness: "partly_open",
      allowedSkinAreas: ["arms", "upper_chest"],
      sensualityLevel: "moderate",
      restraintRule: "adult, stylish, non-explicit; no wet-shirt or oil-shine framing",
    };
  }
  return {
    exposureLevel: "covered",
    tightnessLevel: "fitted",
    bodyDisplayLevel: "low",
    outerwearOpenness: "closed",
    allowedSkinAreas: ["none"],
    sensualityLevel: "low",
    restraintRule: "adult, stylish, non-explicit; no nudity; no fetish-only outfit",
  };
}

function pickWorldHookFor(social, rng) {
  const occupation = social.occupation || "";
  if (/freezer|market|stall/.test(occupation)) return worldHookBundles[0];
  if (/cinema|projection/.test(occupation)) return worldHookBundles[1];
  if (/radio|antenna/.test(occupation)) return worldHookBundles[2];
  if (/pool|lifeguard/.test(occupation)) return worldHookBundles[3];
  if (/bridge|lantern/.test(occupation)) return worldHookBundles[4];
  return pick(worldHookBundles, rng);
}

function concretizeTheme(social, fieldLayer) {
  const concrete = concreteThemeLibrary[social.occupation] || concreteThemeLibrary["night market freezer crate mover and stall watcher"];
  const desire = fieldLayer.desireExposureInfluence;
  const desireEffect =
    desire.bodyDisplayLevel === "high"
      ? "more body-conscious inner top, open or short outer layer, visible powerful arms, still a complete outfit"
      : desire.bodyDisplayLevel === "medium"
        ? "fitted white inner top, partly open outer layer, clear but restrained body anchor"
        : "covered layers with the white fitted inner top kept as a subtle body anchor";
  const sourceMotifs = uniq([
    ...(concrete.activityMotifs || []),
    ...(concrete.environmentMotifs || []),
    ...(concrete.materialMotifs || []),
  ]).filter((item) => !genericLowPotentialMotifs.has(item)).slice(0, 6);
  return {
    ...concrete,
    desireEffect,
    sourceMotifs,
    sourceMotifLabels: sourceMotifs.map((item) => fieldMotifLabels[item] || item),
  };
}

function garmentLogicFrom(fieldLayer, concreteTheme) {
  const desire = fieldLayer.desireExposureInfluence;
  const social = fieldLayer.socialInfluence;
  const risk = fieldLayer.riskInfluence;
  const outerwear =
    desire.outerwearOpenness === "open"
      ? "open short outer layer"
      : desire.outerwearOpenness === "partly_open"
        ? "partly open utility outer layer"
        : "more closed practical outer layer";
  return [
    "white fitted inner top remains the body anchor",
    `${desire.tightnessLevel} fabric lightly shows broad chest and large simplified abdominal forms`,
    outerwear,
    `${social.materialQuality}`,
    ...(risk.derivedRiskLogic || []).slice(0, 2),
    `main clothing structures derive from ${concreteTheme.sourceMotifs.slice(0, 3).join(", ")}`,
  ];
}

function buildFieldInfluenceExpansionLayer(rng, options = {}) {
  const origin = options.origin || pick(originBundles, rng);
  const social = options.social || pick(socialBundles, rng);
  const risk = options.risk || pick(riskBundles, rng);
  const psychological = options.psychological || pick(psychologicalBundles, rng);
  const worldHook = options.worldHook || pickWorldHookFor(social, rng);
  const fieldBundle = buildFieldBundle(origin, social, risk, psychological, worldHook);
  const boundaryCheck = fieldBoundaryCheck(fieldBundle);
  const layer = {
    moduleName: "fieldInfluenceExpansionLayer",
    status: "active",
    fieldBundle,
    selectedFields: fieldBundle,
    fieldBoundaryCheck: boundaryCheck,
    originInfluence: origin,
    socialInfluence: social,
    riskInfluence: risk,
    psychologicalInfluence: psychological,
    worldHookInfluence: worldHook,
    desireExposureInfluence: deriveDesireExposure(psychological, social),
    derivedLifeContext: [
      social.dailyActivity,
      social.workplace,
      origin.localityVisualCues.join(", "),
      `${social.socialReputation}; ${psychological.habit}`,
      risk.derivedRiskLogic.slice(0, 2).join(", "),
    ],
    derivedVisualContext: [],
    derivedGarmentLogic: [],
    motifCandidates: [],
    rejectionNotes: [],
  };
  const concreteTheme = concretizeTheme(social, layer);
  layer.concreteTheme = concreteTheme;
  layer.stagedDependencyGraph = buildStagedDependencyGraph(fieldBundle, origin, social, risk, psychological, worldHook, concreteTheme);
  layer.derivedVisualContext = uniq([
    ...(concreteTheme.visualObjects || []),
    ...(concreteTheme.activityMotifs || []),
    ...(concreteTheme.environmentMotifs || []),
    ...(concreteTheme.materialMotifs || []),
  ]);
  layer.derivedGarmentLogic = garmentLogicFrom(layer, concreteTheme);
  layer.motifCandidates = concreteTheme.sourceMotifs;
  layer.themeConcretizer = {
    inputBroadTheme: options.themeCategory || "field_bundle_driven",
    broadThemeBlocked: broadThemeCategories.has(options.themeCategory),
    concreteTheme,
  };
  return layer;
}

module.exports = {
  buildFieldInfluenceExpansionLayer,
  fieldBoundaryCheck,
  genericLowPotentialMotifs,
  broadThemeCategories,
};
