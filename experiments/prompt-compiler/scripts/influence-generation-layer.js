const { themePresets, globalRegionLibrary } = require("./theme-direction-layer");

const ageRanges = ["early_30s", "mid_30s", "late_30s", "early_40s"];
const bodyArchetypes = ["very_broad_frame", "thick_chubby_muscular", "bulky_soft_strong", "heavy_power_build"];
const personalityCores = [
  "calm_reliable",
  "warm_protective",
  "serious_focused",
  "blunt_honest",
  "quiet_observant",
  "cheerful_loud",
  "patient_caretaker",
];
const presentationModes = [
  "work_mode",
  "patrol_mode",
  "off_duty_mode",
  "daily_portrait_mode",
  "ceremonial_but_practical_mode",
  "combat_ready_mode",
];

const occupationSeeds = {
  market_guard: ["市场夜巡", "市场守卫", "摊位边街区看护"],
  rain_infrastructure_observer: ["地下街雨线观测员", "排水路径巡查员", "雨棚街口防汛观察员"],
  library_stack_keeper: ["垂直书库看护", "旧书库管理员", "归档通道守护员"],
  harbor_pressure_maintenance: ["港区压力阀检修员", "码头管道维护员", "港口仓库维修员"],
  greenhouse_gardener: ["温室花匠", "废弃玻璃房园丁", "潮湿花棚看护"],
  bathhouse_keeper: ["澡堂热水房看护", "浴场后门管理员", "蒸汽走廊维护员"],
  dawn_gatekeeper: ["黎明门卫", "旧门洞看守", "清晨街口守门人"],
  postal_courier: ["路线邮差", "山城路线员", "车站边街区递送员"],
  shelter_night_school_guide: ["避难所夜校引导员", "临时集合点秩序员", "安全出口引导员"],
  underground_fitness_trainer: ["地下健身教练", "旧拳馆教练", "地下商场训练员"],
  warehouse_logistics_guard: ["仓库物流守卫", "装卸区看护", "货柜区巡查员"],
  clock_tower_maintainer: ["钟塔维护员", "老钟楼校时员", "塔楼机房看护"],
  book_repair_binder: ["旧书修复师", "装订铺看护", "纸页仓库整理员"],
  generic_civic_worker: ["城市公共事务员", "社区设施看护", "临时服务点负责人"],
  urban_fantasy_worker: ["都市奇幻劳动者", "架空街区守护员", "地下通道事务员"],
};

const worldFlavorSeeds = {
  market_guard: "market_night_shift",
  rain_infrastructure_observer: "rainy_infrastructure",
  library_stack_keeper: "civic_urban_fantasy",
  harbor_pressure_maintenance: "industrial_service",
  greenhouse_gardener: "folk_fantasy_light",
  bathhouse_keeper: "folk_fantasy_light",
  dawn_gatekeeper: "local_guardian",
  postal_courier: "old_city_modern",
  shelter_night_school_guide: "civic_urban_fantasy",
  underground_fitness_trainer: "civic_urban_fantasy",
  warehouse_logistics_guard: "industrial_service",
  clock_tower_maintainer: "old_city_modern",
  book_repair_binder: "old_city_modern",
};

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function forcedOrPick(value, items, rng) {
  if (value && items.includes(value)) return value;
  return pick(items, rng);
}

function themeIds() {
  return themePresets.map((item) => item.themeCategory);
}

function regionIds() {
  return globalRegionLibrary.map((item) => item.id);
}

function findTheme(id) {
  return themePresets.find((item) => item.themeCategory === id) || themePresets[0];
}

function findRegion(id) {
  return globalRegionLibrary.find((item) => item.id === id) || globalRegionLibrary[0];
}

function deriveClimate(primary, theme, region) {
  const text = [primary.themeCategory, primary.regionContext, region.label, ...(region.environmentKeywords || [])].join(" ");
  const values = [];
  if (/harbor|港|海|码头|coastal|mediterranean/.test(text)) values.push("coastal", "humid", "windy");
  if (/rain|雨|湿|排水|防汛|southeast_asian/.test(text)) values.push("humid", "rainy", "warm");
  if (/greenhouse|温室|花棚/.test(text)) values.push("humid", "warm", "plant_environment");
  if (/bathhouse|澡堂|浴场|热水|蒸汽/.test(text)) values.push("humid", "warm", "steam");
  if (/north_china|华北|北方|钟楼/.test(text)) values.push("dry", "cold_possible", "old_city");
  if (/market|市场|夜市|集市/.test(text)) values.push("street", "seasonal_warm_possible");
  if (!values.length) values.push("temperate");
  return Array.from(new Set(values));
}

function deriveEnvironment(primary, theme, region) {
  const values = [];
  if (/market|市场|集市/.test(`${primary.themeCategory} ${primary.regionContext}`)) values.push("crowded_market", "stall_lights");
  if (/rain|雨|排水/.test(primary.themeCategory)) values.push("wet_street", "drainage_path", "reflective_surface");
  if (/library|book|书/.test(primary.themeCategory)) values.push("indoor_archive", "vertical_storage", "quiet_heavy_space");
  if (/harbor|港/.test(`${primary.themeCategory} ${primary.regionContext}`)) values.push("harbor_service_area", "wet_metal", "pipe_corridor");
  if (/greenhouse|温室/.test(primary.themeCategory)) values.push("glasshouse", "humid_plants", "workbench_path");
  if (!values.length) values.push(region.environmentKeywords[0] || theme.environmentHints[0] || "urban_street");
  return Array.from(new Set(values));
}

function deriveLifestyle(primary) {
  const values = [];
  if (primary.presentationMode === "off_duty_mode" || primary.personalityCore === "cheerful_loud") values.push("casual", "relaxed");
  if (/fitness|健身|拳馆/.test(`${primary.themeCategory} ${primary.occupationSeed}`)) values.push("athletic");
  if (primary.presentationMode === "patrol_mode") values.push("practical", "mobile", "guardian");
  if (primary.presentationMode === "work_mode" || /maintenance|worker|检修|维护|守卫/.test(`${primary.themeCategory} ${primary.occupationSeed}`)) values.push("practical", "tidy", "workwear");
  if (!values.length) values.push("practical");
  return Array.from(new Set(values));
}

function deriveSocialRole(primary) {
  const text = `${primary.themeCategory} ${primary.occupationSeed} ${primary.personalityCore}`;
  if (/shelter|避难|guide|引导|patient_caretaker/.test(text)) return ["community_keeper", "guide", "protector"];
  if (/market|市场|blunt_honest/.test(text)) return ["local_guardian", "familiar_big_brother"];
  if (/postal|邮|courier/.test(text)) return ["route_keeper", "reliable_messenger"];
  if (/library|book|书/.test(text)) return ["archive_keeper", "quiet_protector"];
  return ["local_worker", "reliable_adult"];
}

function deriveMaterials(primary, climate, environment) {
  const text = [...climate, ...environment, primary.themeCategory, primary.occupationSeed].join(" ");
  if (/rain|wet|humid|drainage|雨|排水/.test(text)) return ["waterproof fabric", "rubber", "matte pvc", "reflective tape"];
  if (/harbor|pipe|港|码头|管道/.test(text)) return ["canvas", "rubber", "oxidized metal", "waterproof cloth"];
  if (/library|archive|book|书/.test(text)) return ["wool blend", "matte fabric", "leather edge", "paper motif"];
  if (/greenhouse|plant|温室/.test(text)) return ["canvas", "rubber", "translucent acrylic", "glass motif"];
  return ["cotton canvas", "matte fabric", "rubber", "brushed metal"];
}

function deriveColors(primary, region) {
  if (primary.regionContext === "north_china_old_city") return ["gray blue", "coal black", "old white", "old copper"];
  if (primary.regionContext === "harbor_district") return ["mist blue", "dark teal gray", "oxidized copper", "off white"];
  if (primary.regionContext === "southeast_asian_rain_street") return ["wet gray", "deep blue", "orange light", "reflective silver"];
  return (region.colorHints || ["old white", "dark gray", "muted blue"]).slice(0, 4);
}

function deriveBottomLengthBias(primary, climate, lifestyle) {
  const text = [primary.themeCategory, primary.presentationMode, primary.occupationSeed, ...climate, ...lifestyle].join(" ");
  if (/ceremonial_but_practical_mode|formal|cold_possible|library|书库|shelter|避难/.test(text)) return "full_length_preferred";
  if (/humid|warm|coastal|market|greenhouse|fitness|off_duty|athletic|patrol|港|温室|市场|健身/.test(text)) return "short_or_cropped_allowed";
  return "ankle_or_full_balanced";
}

function deriveSockBias(bottomLengthBias) {
  if (bottomLengthBias === "short_or_cropped_allowed") return "white_socks_likely_visible_when_exposed";
  if (bottomLengthBias === "full_length_preferred") return "white_socks_hidden_or_slight";
  return "white_socks_visible_only_if_ankle_or_calf_exposed";
}

function deriveOuterwearBias(primary, climate, material) {
  const text = [primary.themeCategory, primary.occupationSeed, ...climate, ...material].join(" ");
  if (/rain|waterproof|雨|排水/.test(text)) return { baseTypes: ["hoodie jacket", "work jacket", "utility vest"], materials: ["matte nylon", "utility fabric"] };
  if (/harbor|港|pipe|管道/.test(text)) return { baseTypes: ["work jacket", "cropped jacket", "utility vest"], materials: ["cotton canvas", "matte nylon", "utility fabric"] };
  if (/library|book|书/.test(text)) return { baseTypes: ["long coat", "cardigan", "blazer"], materials: ["wool blend", "soft knit"] };
  if (/fitness|健身|拳馆/.test(text)) return { baseTypes: ["track jacket", "bomber jacket", "hoodie jacket"], materials: ["thick jersey", "matte nylon"] };
  return { baseTypes: ["work jacket", "cropped jacket", "bomber jacket"], materials: ["cotton canvas", "utility fabric"] };
}

function derivePropBias(primary) {
  const text = `${primary.themeCategory} ${primary.occupationSeed}`;
  if (/pressure|阀|管道/.test(text)) return "transformed_pressure_gauge_or_valve_symbol";
  if (/library|书|archive/.test(text)) return "transformed_bookmark_hammer_or_index_shield";
  if (/rain|雨|排水/.test(text)) return "transformed_rain_gauge_or_umbrella_rib_prop";
  if (/market|市场/.test(text)) return "transformed_route_sign_or_stall_token";
  return "single_symbolic_practical_prop";
}

function deriveFantasyDensity(primary) {
  if (/realist|industrial_service/.test(primary.worldFlavorSeed)) return "low";
  if (/folk|fantasy|civic_urban_fantasy/.test(primary.worldFlavorSeed)) return "restrained";
  return "low";
}

function formalityFor(mode) {
  return {
    ceremonial_but_practical_mode: "medium_high",
    off_duty_mode: "low",
    work_mode: "medium",
    patrol_mode: "medium",
    daily_portrait_mode: "low_medium",
    combat_ready_mode: "medium_high",
  }[mode] || "medium";
}

function practicalityFor(primary, environment) {
  const text = `${primary.occupationSeed} ${primary.presentationMode} ${environment.join(" ")}`;
  if (/守卫|巡|检修|维护|worker|guard|patrol|wet|harbor|排水|港/.test(text)) return "high";
  return "medium";
}

function buildInfluenceGenerationLayer(rng, options = {}) {
  const themeCategory = forcedOrPick(options.themeCategory, themeIds(), rng);
  const regionContext = forcedOrPick(options.regionContext, regionIds(), rng);
  const theme = findTheme(themeCategory);
  const region = findRegion(regionContext);
  const occupationSeed = options.occupationSeed || pick(occupationSeeds[themeCategory] || occupationSeeds.generic_civic_worker, rng);
  const primaryInfluences = {
    themeCategory,
    regionContext,
    ageRange: options.ageRange || pick(ageRanges, rng),
    bodyArchetype: options.bodyArchetype || pick(bodyArchetypes, rng),
    personalityCore: options.personalityCore || pick(personalityCores, rng),
    presentationMode: options.presentationMode || pick(presentationModes, rng),
    occupationSeed,
    worldFlavorSeed: options.worldFlavorSeed || worldFlavorSeeds[themeCategory] || theme.modernityLevel || "old_city_modern",
  };

  const influenceReasoningLog = [];
  const log = (source, input, derived, reason) => influenceReasoningLog.push({ source, input, derived, reason });
  const climateInfluence = deriveClimate(primaryInfluences, theme, region);
  log("regionContext + themeCategory", [regionContext, themeCategory], climateInfluence, "Region and role seed climate, material, and comfort constraints.");
  const environmentInfluence = deriveEnvironment(primaryInfluences, theme, region);
  log("themeCategory + regionContext", [themeCategory, regionContext], environmentInfluence, "Theme and place combine into a drawable environment flavor.");
  const lifestyleInfluence = deriveLifestyle(primaryInfluences);
  log("presentationMode + occupationSeed + personalityCore", [primaryInfluences.presentationMode, occupationSeed, primaryInfluences.personalityCore], lifestyleInfluence, "Mode and personality derive practical movement and daily-wear pressure.");
  const socialRoleInfluence = deriveSocialRole(primaryInfluences);
  const materialInfluence = deriveMaterials(primaryInfluences, climateInfluence, environmentInfluence);
  const colorInfluence = deriveColors(primaryInfluences, region);
  const culturalStructureInfluence = primaryInfluences.regionContext.includes("japanese") || primaryInfluences.regionContext.includes("central_asian")
    ? "small collar/placket/edge influence only"
    : "modern structure with light regional edge";
  const movementInfluence = {
    patrol_mode: "about_to_walk_checking_surroundings",
    work_mode: "standing_ready",
    daily_portrait_mode: "relaxed_standing",
    off_duty_mode: "relaxed_grounded_pose",
    ceremonial_but_practical_mode: "formal_stable_stance",
    combat_ready_mode: "guarded_stance",
  }[primaryInfluences.presentationMode] || "stable_standing";
  const bottomLengthBias = deriveBottomLengthBias(primaryInfluences, climateInfluence, lifestyleInfluence);
  log("climate + presentationMode + lifestyle", [climateInfluence, primaryInfluences.presentationMode, lifestyleInfluence], [bottomLengthBias], "Bottom length is derived from climate and use case, not independently random.");
  const sockBias = deriveSockBias(bottomLengthBias);
  log("bottomLengthBias", bottomLengthBias, [sockBias], "Sock visibility follows leg exposure and should not randomize independently.");
  const outerwearBias = deriveOuterwearBias(primaryInfluences, climateInfluence, materialInfluence);
  const propBias = derivePropBias(primaryInfluences);
  const fantasyDensity = deriveFantasyDensity(primaryInfluences);
  const formalityLevel = formalityFor(primaryInfluences.presentationMode);
  const practicalityLevel = practicalityFor(primaryInfluences, environmentInfluence);

  const derivedInfluences = {
    climateInfluence,
    environmentInfluence,
    lifestyleInfluence,
    socialRoleInfluence,
    materialInfluence,
    colorInfluence,
    culturalStructureInfluence,
    movementInfluence,
    bottomLengthBias,
    sockBias,
    outerwearBias,
    propBias,
    fantasyDensity,
    formalityLevel,
    practicalityLevel,
  };

  const resolvedInfluences = {
    occupationInfluence: occupationSeed,
    regionInfluence: regionContext,
    presentationMode: primaryInfluences.presentationMode,
    ageRange: primaryInfluences.ageRange,
    bodyArchetype: primaryInfluences.bodyArchetype,
    personalityCore: primaryInfluences.personalityCore,
    worldFlavorSeed: primaryInfluences.worldFlavorSeed,
    ...derivedInfluences,
  };

  return {
    moduleName: "influenceGenerationLayer",
    status: "active-mvp",
    primaryInfluences,
    derivedInfluences,
    resolvedInfluences,
    influenceReasoningLog,
  };
}

module.exports = {
  buildInfluenceGenerationLayer,
};
