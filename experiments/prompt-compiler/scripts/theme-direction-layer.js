const themePresets = [
  {
    themeCategory: "old_city_worker",
    environmentFlavor: "华北旧城",
    visualMotifs: ["旧铜", "工具带", "地方徽章"],
    materialMood: "旧铜与棉布",
    fantasyFlavor: "轻都市奇幻",
    culturalInfluenceLevel: 1,
    modernityLevel: "old_city_modern",
    themeSummary: "整体带有华北旧城劳动者的气质，以旧铜、棉布、工具带和地方徽章作为少量集中视觉母题。",
  },
  {
    themeCategory: "neighborhood_guardian",
    environmentFlavor: "海边居民区",
    visualMotifs: ["路线牌", "护符", "旧钥匙"],
    materialMood: "帆布与橡胶",
    fantasyFlavor: "轻都市奇幻",
    culturalInfluenceLevel: 1,
    modernityLevel: "old_city_modern",
    themeSummary: "整体像海边社区的安静守护者，用帆布、橡胶、路线牌和护符形成朴素可靠的视觉方向。",
  },
  {
    themeCategory: "bathhouse_keeper",
    environmentFlavor: "老澡堂",
    visualMotifs: ["热水阀", "压力表", "毛巾"],
    materialMood: "木材与磨砂金属",
    fantasyFlavor: "民俗感奇幻",
    culturalInfluenceLevel: 2,
    modernityLevel: "traditional_modern",
    themeSummary: "整体带有老澡堂和热水房看护的气味，以热水阀、压力表、毛巾和磨砂金属作为克制母题。",
  },
  {
    themeCategory: "book_repair_binder",
    environmentFlavor: "旧书街",
    visualMotifs: ["书页", "装订线", "纸片"],
    materialMood: "纸页与黄铜",
    fantasyFlavor: "轻都市奇幻",
    culturalInfluenceLevel: 1,
    modernityLevel: "retro_modern",
    themeSummary: "整体像旧书街的修复装订师，以纸页、黄铜、装订线和少量纸片形成安静的书卷气。",
  },
  {
    themeCategory: "clock_tower_maintainer",
    environmentFlavor: "老钟楼",
    visualMotifs: ["钟表刻度", "旧铜", "旧钥匙"],
    materialMood: "羊毛与皮革边",
    fantasyFlavor: "都市奇幻",
    culturalInfluenceLevel: 2,
    modernityLevel: "retro_modern",
    themeSummary: "整体带有老钟楼维护员的气质，以钟表刻度、旧铜、旧钥匙和皮革边作为集中视觉母题。",
  },
  {
    themeCategory: "postal_courier",
    environmentFlavor: "山城坡道",
    visualMotifs: ["邮戳", "路线牌", "票据"],
    materialMood: "帆布与橡胶",
    fantasyFlavor: "现实主义",
    culturalInfluenceLevel: 1,
    modernityLevel: "old_city_modern",
    themeSummary: "整体像山城坡道里的路线员，以邮戳、路线牌、票据和耐磨帆布形成清楚的生活语境。",
  },
  {
    themeCategory: "greenhouse_gardener",
    environmentFlavor: "废弃温室",
    visualMotifs: ["蔷薇", "荆棘", "温室玻璃"],
    materialMood: "玻璃与藤蔓",
    fantasyFlavor: "民俗感奇幻",
    culturalInfluenceLevel: 1,
    modernityLevel: "fantasy_urban",
    themeSummary: "整体带有废弃温室花匠的气味，以蔷薇、荆棘和温室玻璃作为少量中大型视觉母题。",
  },
  {
    themeCategory: "night_market_vendor",
    environmentFlavor: "夜市后巷",
    visualMotifs: ["木牌", "票据", "地方徽章"],
    materialMood: "防水布与塑料件",
    fantasyFlavor: "轻都市奇幻",
    culturalInfluenceLevel: 1,
    modernityLevel: "contemporary_modern",
    themeSummary: "整体像夜市后巷的摊主，以防水布、塑料件、木牌和票据形成亲近街巷的视觉方向。",
  },
  {
    themeCategory: "festival_security",
    environmentFlavor: "京都老街",
    visualMotifs: ["护符", "纸片", "地方徽章"],
    materialMood: "厚针织与布带",
    fantasyFlavor: "仪式感奇幻",
    culturalInfluenceLevel: 2,
    modernityLevel: "traditional_modern",
    themeSummary: "整体带有京都老街节庆安保的气质，以护符、纸片、地方徽章和宽布带作为克制仪式感。",
  },
  {
    themeCategory: "harbor_worker",
    environmentFlavor: "港口社区",
    visualMotifs: ["工具带", "路线牌", "旧钥匙"],
    materialMood: "防水布与塑料件",
    fantasyFlavor: "现实主义",
    culturalInfluenceLevel: 0,
    modernityLevel: "contemporary_modern",
    themeSummary: "整体像港口社区的工人，以防水布、塑料件、工具带和路线牌形成耐用清楚的工作感。",
  },
  {
    themeCategory: "mountain_lodge_keeper",
    environmentFlavor: "山间旅舍",
    visualMotifs: ["木牌", "旧钥匙", "毛巾"],
    materialMood: "羊毛与皮革边",
    fantasyFlavor: "轻都市奇幻",
    culturalInfluenceLevel: 2,
    modernityLevel: "old_city_modern",
    themeSummary: "整体像山间旅舍看守，以羊毛、皮革边、木牌和旧钥匙形成温厚的山地生活气味。",
  },
  {
    themeCategory: "underground_fitness_trainer",
    environmentFlavor: "地下商场",
    visualMotifs: ["压力表", "工具带", "地方徽章"],
    materialMood: "厚针织与布带",
    fantasyFlavor: "轻都市奇幻",
    culturalInfluenceLevel: 0,
    modernityLevel: "fantasy_urban",
    themeSummary: "整体像地下健身和拳馆教练，以厚针织、布带、压力表和地方徽章形成强壮但克制的都市气质。",
  },
];

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function buildThemeDirectionLayer(rng, options = {}) {
  const preset = options.themeCategory
    ? themePresets.find((item) => item.themeCategory === options.themeCategory) || pick(themePresets, rng)
    : pick(themePresets, rng);

  return {
    moduleName: "themeDirectionLayer",
    status: "active",
    themeCategory: preset.themeCategory,
    environmentFlavor: preset.environmentFlavor,
    visualMotifs: preset.visualMotifs.slice(0, 3),
    materialMood: preset.materialMood,
    fantasyFlavor: preset.fantasyFlavor,
    culturalInfluenceLevel: preset.culturalInfluenceLevel,
    modernityLevel: preset.modernityLevel,
    themeSummary: preset.themeSummary,
  };
}

module.exports = {
  buildThemeDirectionLayer,
  themePresets,
};
