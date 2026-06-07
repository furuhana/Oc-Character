const themePresets = [
  {
    themeCategory: "night_patrol",
    label: "夜巡",
    environmentHints: ["老巷", "夜街", "后巷", "河岸社区"],
    motifHints: ["巷灯", "旧钥匙", "路线牌"],
    materialHints: ["棉布", "帆布", "磨砂金属"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "old_city_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "festival_security",
    label: "节庆安保",
    environmentHints: ["节庆街口", "人群边缘", "临时岗亭"],
    motifHints: ["票据", "地方徽章", "布带"],
    materialHints: ["厚织物", "帆布", "旧金属"],
    fantasyFlavor: "仪式感奇幻",
    modernityLevel: "traditional_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "market_guard",
    label: "市场守卫",
    environmentHints: ["市场后巷", "摊位边街", "货棚通道"],
    motifHints: ["摊牌", "票据", "市场牌"],
    materialHints: ["帆布", "皮革", "磨砂金属"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "old_city_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "warehouse_logistics_guard",
    label: "仓库物流守卫",
    environmentHints: ["港口仓库", "装卸区", "老工业区"],
    motifHints: ["编号牌", "货签", "反光条"],
    materialHints: ["防水布", "尼龙", "橡胶"],
    fantasyFlavor: "现实主义",
    modernityLevel: "contemporary_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "dawn_gatekeeper",
    label: "黎明门卫",
    environmentHints: ["清晨街口", "旧门洞", "车站边街区"],
    motifHints: ["门牌", "旧钥匙", "晨光灯"],
    materialHints: ["棉布", "羊毛", "旧铁"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "old_city_modern",
    styleHint: "soft_daily",
  },
  {
    themeCategory: "bathhouse_keeper",
    label: "澡堂看护",
    environmentHints: ["浴场后门", "热水房", "蒸汽走廊"],
    motifHints: ["热水阀", "压力表", "毛巾"],
    materialHints: ["厚棉布", "磨砂金属", "木材"],
    fantasyFlavor: "民俗感奇幻",
    modernityLevel: "traditional_modern",
    styleHint: "soft_daily",
  },
  {
    themeCategory: "greenhouse_gardener",
    label: "温室花匠",
    environmentHints: ["温室", "废弃玻璃房", "潮湿花棚"],
    motifHints: ["蔷薇", "荆棘", "温室玻璃"],
    materialHints: ["帆布", "玻璃", "藤蔓"],
    fantasyFlavor: "民俗感奇幻",
    modernityLevel: "fantasy_urban",
    styleHint: "fantasy_worker",
  },
  {
    themeCategory: "postal_courier",
    label: "邮差",
    environmentHints: ["路线街区", "车站边街区", "山城坡道"],
    motifHints: ["邮戳", "路线牌", "票据"],
    materialHints: ["帆布", "橡胶", "旧金属"],
    fantasyFlavor: "现实主义",
    modernityLevel: "old_city_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "clock_tower_maintainer",
    label: "钟塔维护",
    environmentHints: ["老钟楼", "塔楼机房", "旧街高处"],
    motifHints: ["钟表刻度", "旧铜", "齿轮"],
    materialHints: ["羊毛", "皮革边", "旧铜"],
    fantasyFlavor: "都市奇幻",
    modernityLevel: "retro_modern",
    styleHint: "fantasy_worker",
  },
  {
    themeCategory: "rain_infrastructure_observer",
    label: "雨水设施观测",
    environmentHints: ["地下街", "排水口", "雨棚街口", "防汛通道"],
    motifHints: ["水尺", "雨线", "反光条"],
    materialHints: ["防水布", "透明雨具", "橡胶"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "old_city_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "shelter_night_school_guide",
    label: "避难夜校引导",
    environmentHints: ["避难所走廊", "夜校教室", "安全出口", "临时集合点"],
    motifHints: ["安全出口", "点名册", "门槛线"],
    materialHints: ["帆布", "反光条", "磨砂金属"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "old_city_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "harbor_pressure_maintenance",
    label: "港区压力维护",
    environmentHints: ["港区管道", "码头阀门间", "湿冷维修站", "港口仓库"],
    motifHints: ["压力表", "阀门", "铜管"],
    materialHints: ["防水布", "橡胶", "磨砂金属"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "old_city_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "library_stack_keeper",
    label: "书库看护",
    environmentHints: ["垂直书库", "旧书架", "归档通道", "图书馆后库"],
    motifHints: ["书页", "书签", "索引牌"],
    materialHints: ["纸页", "黄铜", "棉布"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "retro_modern",
    styleHint: "soft_daily",
  },
  {
    themeCategory: "book_repair_binder",
    label: "旧书修复师",
    environmentHints: ["旧书街", "装订铺", "纸页仓库"],
    motifHints: ["书页", "装订线", "纸片"],
    materialHints: ["纸页", "黄铜", "棉布"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "retro_modern",
    styleHint: "soft_daily",
  },
  {
    themeCategory: "underground_fitness_trainer",
    label: "地下健身教练",
    environmentHints: ["地下商场", "拳馆走廊", "旧健身房"],
    motifHints: ["压力表", "地方徽章", "布带"],
    materialHints: ["厚针织", "布带", "橡胶"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "fantasy_urban",
    styleHint: "sports_utility",
  },
  {
    themeCategory: "generic_civic_worker",
    label: "城市公共事务员",
    environmentHints: ["社区街口", "公共设施旁", "地下通道", "临时服务点"],
    motifHints: ["路线牌", "编号牌", "地方徽章"],
    materialHints: ["帆布", "尼龙", "磨砂金属"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "contemporary_modern",
    styleHint: "modern_workwear",
  },
  {
    themeCategory: "urban_fantasy_worker",
    label: "都市奇幻劳动者",
    environmentHints: ["架空街区", "旧楼边街", "地下通道", "夜市后巷"],
    motifHints: ["旧钥匙", "票据", "灯具"],
    materialHints: ["帆布", "旧铜", "橡胶"],
    fantasyFlavor: "轻都市奇幻",
    modernityLevel: "fantasy_urban",
    styleHint: "fantasy_worker",
  },
];

const globalRegionLibrary = [
  {
    id: "neutral_urban",
    label: "中性都市",
    weight: 3,
    environmentKeywords: ["车站边街区", "地下通道", "社区街口", "旧公寓外侧"],
    materialHints: ["帆布", "尼龙", "橡胶", "磨砂金属"],
    colorHints: ["灰黑", "旧白", "深蓝", "安全橙"],
    structuralHints: ["现代工装", "短夹克", "清楚门襟", "实用口袋"],
    motifHints: ["路线牌", "编号牌", "街灯", "票据"],
    avoidIfNotSelected: ["神社", "鸟居", "和风祭典", "京都"],
  },
  {
    id: "north_china_old_city",
    label: "华北旧城",
    weight: 3,
    environmentKeywords: ["胡同", "老城墙", "灰砖", "旧门牌", "路灯", "供热管线"],
    materialHints: ["棉布", "帆布", "旧铜", "磨砂金属", "厚织物"],
    colorHints: ["灰蓝", "煤黑", "旧白", "暗红", "旧铜"],
    structuralHints: ["实用工装", "宽门襟", "厚外套", "棉服感", "腰带"],
    motifHints: ["门牌", "路灯", "旧钥匙", "暖气阀", "旧钟"],
    avoidIfNotSelected: ["神社", "鸟居", "和风祭典", "京都"],
  },
  {
    id: "south_china_market_street",
    label: "华南市井街区",
    weight: 2,
    environmentKeywords: ["骑楼", "湿热街巷", "市场棚", "招牌", "窄巷"],
    materialHints: ["薄帆布", "防水布", "塑料件", "棉布"],
    colorHints: ["湿灰", "旧绿", "暖红", "米白", "深蓝"],
    structuralHints: ["轻外层", "开领", "短外套", "宽松裤"],
    motifHints: ["摊牌", "塑料绳", "旧招牌", "票据"],
    avoidIfNotSelected: ["神社", "鸟居", "京都"],
  },
  {
    id: "japanese_small_town",
    label: "日本小镇",
    weight: 1,
    environmentKeywords: ["木牌", "安静街巷", "小站前", "街灯", "店帘"],
    materialHints: ["棉布", "厚织物", "木材", "旧金属"],
    colorHints: ["深蓝", "旧白", "木色", "炭黑", "暗红"],
    structuralHints: ["轻和风结构", "交叠前襟", "短外搭", "宽布带"],
    motifHints: ["木牌", "护符", "纸片", "街灯"],
    avoidIfNotSelected: ["北非老城", "中亚集市", "地中海港口"],
  },
  {
    id: "kyoto_old_street",
    label: "京都老街",
    weight: 1,
    environmentKeywords: ["京都", "老街", "町屋", "木格门", "石板路"],
    materialHints: ["棉布", "厚针织", "布带", "木材"],
    colorHints: ["墨蓝", "旧白", "木褐", "朱红", "炭黑"],
    structuralHints: ["羽织式外搭", "交叠前襟", "宽布带", "短披挂"],
    motifHints: ["护符", "纸片", "木牌", "街灯"],
    avoidIfNotSelected: ["北非老城", "中亚集市", "地中海港口"],
  },
  {
    id: "korean_old_district",
    label: "韩国旧城区",
    weight: 2,
    environmentKeywords: ["坡道旧街", "小店门口", "砖墙", "社区巷口"],
    materialHints: ["棉布", "羊毛", "帆布", "旧金属"],
    colorHints: ["石灰", "深蓝", "旧白", "棕灰"],
    structuralHints: ["短外套", "简洁开合", "宽松裤", "圆润领口"],
    motifHints: ["门牌", "小店招牌", "旧钥匙"],
    avoidIfNotSelected: ["神社", "鸟居", "京都"],
  },
  {
    id: "southeast_asian_rain_street",
    label: "东南亚雨街",
    weight: 2,
    environmentKeywords: ["雨棚", "湿街", "霓虹", "小摊", "摩托", "塑料帘"],
    materialHints: ["防水布", "尼龙", "PVC", "橡胶", "透明塑料"],
    colorHints: ["深蓝", "湿灰", "橙灯", "雨夜黑", "旧白"],
    structuralHints: ["防雨外层", "短外披", "宽松裤", "雨具结构"],
    motifHints: ["雨滴", "摊牌", "塑料绳", "反光条"],
    avoidIfNotSelected: ["神社", "羽织", "祭典"],
  },
  {
    id: "central_asian_market",
    label: "中亚集市",
    weight: 2,
    environmentKeywords: ["集市", "织毯", "拱门", "干燥街道", "香料摊"],
    materialHints: ["厚布", "皮革", "编织带", "黄铜", "羊毛"],
    colorHints: ["沙色", "深红", "靛蓝", "旧金", "土黄"],
    structuralHints: ["宽腰带", "长外披", "直线长身", "边饰"],
    motifHints: ["编织纹", "护符", "铜扣", "市场牌"],
    avoidIfNotSelected: ["和风", "神社", "京都"],
  },
  {
    id: "north_african_medina",
    label: "北非老城",
    weight: 2,
    environmentKeywords: ["老城巷道", "拱门", "白墙", "市场阴影", "石阶"],
    materialHints: ["亚麻", "厚布", "皮革", "黄铜"],
    colorHints: ["砂白", "靛蓝", "土黄", "旧金", "深棕"],
    structuralHints: ["宽松外层", "长身直线", "开襟", "腰带"],
    motifHints: ["拱门牌", "铜扣", "护符", "街灯"],
    avoidIfNotSelected: ["神社", "京都", "鸟居"],
  },
  {
    id: "mediterranean_port",
    label: "地中海港口",
    weight: 2,
    environmentKeywords: ["港口", "石墙", "海风", "渔网", "码头仓库"],
    materialHints: ["亚麻", "帆布", "皮革", "旧铁", "绳索"],
    colorHints: ["海蓝", "白", "砂色", "旧棕", "铁灰"],
    structuralHints: ["开领外套", "短夹克", "宽松裤", "卷袖"],
    motifHints: ["绳结", "港牌", "船灯", "鱼钩"],
    avoidIfNotSelected: ["神社", "祭典", "鸟居"],
  },
  {
    id: "eastern_europe_old_quarter",
    label: "东欧旧城区",
    weight: 2,
    environmentKeywords: ["旧电车街", "砖墙", "雪后路面", "老广场"],
    materialHints: ["羊毛", "皮革边", "厚布", "旧铁"],
    colorHints: ["深灰", "酒红", "旧白", "煤黑"],
    structuralHints: ["厚外套", "高领", "宽肩", "长裤"],
    motifHints: ["电车票", "旧钥匙", "街灯", "徽章"],
    avoidIfNotSelected: ["神社", "京都", "和风"],
  },
  {
    id: "western_europe_old_town",
    label: "西欧旧城",
    weight: 2,
    environmentKeywords: ["石板路", "旧书店", "钟楼街", "小广场"],
    materialHints: ["羊毛", "亚麻", "皮革", "黄铜"],
    colorHints: ["海军蓝", "旧白", "棕色", "暗绿"],
    structuralHints: ["短夹克", "西装外套", "开领", "整洁长裤"],
    motifHints: ["钟表刻度", "门牌", "票据", "旧钥匙"],
    avoidIfNotSelected: ["神社", "鸟居", "京都"],
  },
  {
    id: "latin_american_hill_town",
    label: "拉美山城",
    weight: 2,
    environmentKeywords: ["山城坡道", "彩墙", "集市", "铁门", "午后阳光"],
    materialHints: ["棉布", "皮革", "编织布", "旧金属"],
    colorHints: ["土红", "暖黄", "深绿", "旧蓝", "白"],
    structuralHints: ["开领", "宽腰带", "短外套", "披挂小布"],
    motifHints: ["彩色边饰", "护符", "门牌", "街灯"],
    avoidIfNotSelected: ["和风", "神社", "京都"],
  },
  {
    id: "middle_eastern_bazaar",
    label: "中东巴扎",
    weight: 2,
    environmentKeywords: ["巴扎", "拱廊", "灯具摊", "香料街", "石墙"],
    materialHints: ["厚布", "皮革", "黄铜", "棉布"],
    colorHints: ["砂色", "深绿", "旧金", "暗红"],
    structuralHints: ["宽腰带", "开襟外层", "长身线条", "边饰"],
    motifHints: ["灯具", "护符", "铜扣", "市场牌"],
    avoidIfNotSelected: ["神社", "京都", "鸟居"],
  },
  {
    id: "indian_old_market",
    label: "印度旧市场",
    weight: 2,
    environmentKeywords: ["旧市场", "布料摊", "车站街", "热尘", "招牌"],
    materialHints: ["棉布", "薄布", "黄铜", "皮革"],
    colorHints: ["姜黄", "深红", "靛蓝", "旧白"],
    structuralHints: ["长上衣现代化", "宽松裤", "开领", "轻外层"],
    motifHints: ["票据", "铜扣", "布边", "市场牌"],
    avoidIfNotSelected: ["神社", "京都", "鸟居"],
  },
  {
    id: "harbor_district",
    label: "港口社区",
    weight: 3,
    environmentKeywords: ["港口仓库", "湿冷码头", "货柜边街", "船灯"],
    materialHints: ["防水布", "尼龙", "橡胶", "旧铁"],
    colorHints: ["海军蓝", "铁灰", "旧白", "安全橙"],
    structuralHints: ["工装外套", "实用口袋", "短夹克", "卷袖"],
    motifHints: ["港牌", "船灯", "绳结", "编号牌"],
    avoidIfNotSelected: ["神社", "京都", "鸟居"],
  },
  {
    id: "mountain_town",
    label: "山城",
    weight: 2,
    environmentKeywords: ["山城坡道", "石阶", "雾气街口", "旅舍门前"],
    materialHints: ["羊毛", "棉布", "皮革边", "厚织物"],
    colorHints: ["深绿", "雾灰", "旧白", "棕色"],
    structuralHints: ["厚外套", "宽松裤", "卷袖", "腰带"],
    motifHints: ["木牌", "旧钥匙", "旅舍牌", "街灯"],
    avoidIfNotSelected: ["神社", "京都", "鸟居"],
  },
  {
    id: "coastal_neighborhood",
    label: "海边居民区",
    weight: 2,
    environmentKeywords: ["海边小街", "防波堤", "旧渔具店", "潮湿楼梯"],
    materialHints: ["帆布", "防水布", "橡胶", "旧铁"],
    colorHints: ["海蓝", "旧白", "湿灰", "暗绿"],
    structuralHints: ["短外套", "防风外层", "宽松裤", "实用口袋"],
    motifHints: ["路线牌", "鱼钩", "绳结", "船灯"],
    avoidIfNotSelected: ["神社", "京都", "和风"],
  },
  {
    id: "industrial_suburb",
    label: "工业郊区",
    weight: 3,
    environmentKeywords: ["老工业区", "维修站", "仓库后门", "管线墙"],
    materialHints: ["帆布", "橡胶", "尼龙", "磨砂金属"],
    colorHints: ["煤黑", "铁灰", "旧白", "安全黄"],
    structuralHints: ["现代工装", "功能口袋", "宽肩外套", "厚下摆"],
    motifHints: ["压力表", "编号牌", "工具带", "反光条"],
    avoidIfNotSelected: ["神社", "京都", "鸟居"],
  },
  {
    id: "fantasy_mixed_city",
    label: "架空混合都市",
    weight: 3,
    environmentKeywords: ["架空老城", "混合街区", "夜市", "旧楼", "地下通道"],
    materialHints: ["帆布", "尼龙", "旧铜", "亚克力", "橡胶"],
    colorHints: ["深蓝", "灰黑", "旧白", "琥珀", "暗红"],
    structuralHints: ["现代工装为主", "少量混合传统结构", "短外层", "宽腰带"],
    motifHints: ["旧钥匙", "路牌", "票据", "护符", "灯具"],
    avoidIfNotSelected: ["不要过度指向单一现实国家"],
  },
];

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function pickMany(items, count, rng) {
  const pool = Array.from(new Set(items.filter(Boolean)));
  const result = [];
  while (pool.length && result.length < count) {
    const index = Math.floor(rng() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

function weightedPick(items, rng) {
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let cursor = rng() * total;
  for (const item of items) {
    cursor -= item.weight || 1;
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function forcedOrPickById(value, items, rng, weighted = false) {
  const found = value ? items.find((item) => item.id === value || item.themeCategory === value) : null;
  if (found) return found;
  return weighted ? weightedPick(items, rng) : pick(items, rng);
}

function defaultCulturalInfluenceLevel(region, rng) {
  if (region.id === "neutral_urban" || region.id === "industrial_suburb" || region.id === "harbor_district") {
    return rng() < 0.85 ? 0 : 1;
  }
  const roll = rng();
  if (roll < 0.5) return 0;
  if (roll < 0.88) return 1;
  if (roll < 0.98) return 2;
  return 3;
}

function modernityFor(theme, region, level) {
  if (region.id === "fantasy_mixed_city") return "fantasy_urban";
  if (level >= 2) return "traditional_modern";
  return theme.modernityLevel || "old_city_modern";
}

function materialMoodFor(theme, region, rng) {
  const materials = pickMany([...(region.materialHints || []), ...(theme.materialHints || [])], 2, rng);
  return materials.join("与") || "帆布与磨砂金属";
}

const themeMotifPriority = {
  harbor_pressure_maintenance: ["压力阀", "管线", "潮湿金属", "码头标记", "压力刻度", "氧化铜绿", "压力表", "阀门", "铜管"],
  rain_infrastructure_observer: ["雨线", "水位刻度", "排水路径", "反光条", "透明雨具", "湿地面", "水尺"],
  library_stack_keeper: ["书签", "索引签", "书页", "书库层架", "归档标记", "旧书架"],
  bathhouse_keeper: ["蒸汽", "热水管", "瓷砖", "温度刻度", "毛巾", "阀门", "热水阀"],
  market_guard: ["摊位灯", "货牌", "夜市路标", "布棚", "市场边线", "摊牌", "市场牌"],
};

function motifPriorityFor(theme) {
  return themeMotifPriority[theme.themeCategory] || [];
}

function buildVisualMotifs(theme, region, rng) {
  const priority = motifPriorityFor(theme);
  const themePool = [...priority, ...(theme.motifHints || [])];
  const regionPool = region.motifHints || [];
  const selected = [];

  for (const item of themePool) {
    if (!selected.includes(item)) selected.push(item);
    if (selected.length >= 2) break;
  }

  const echoPool = regionPool.filter((item) => !selected.includes(item));
  if (echoPool.length && selected.length < 3) selected.push(pick(echoPool, rng));

  return selected.slice(0, 3);
}

function buildThemeSummary(theme, region, environmentFlavor, motifs, materialMood, level) {
  const motifText = motifs.length ? `，以${motifs.join("、")}作为少量集中视觉母题` : "";
  const levelText = level >= 2 ? "，只让地域结构做现代化转译，不走传统服装套装" : "";
  return `整体带有${region.label}${theme.label}的气质，环境指向${environmentFlavor}，以${materialMood}和${region.colorHints.slice(0, 2).join("、")}配色作为主题基础${motifText}${levelText}。`;
}

function buildThemeDirectionLayer(rng, options = {}) {
  const theme = forcedOrPickById(options.themeCategory, themePresets, rng);
  const region = forcedOrPickById(options.regionContext, globalRegionLibrary, rng, true);
  const culturalInfluenceLevel = Number.isFinite(options.culturalInfluenceLevel)
    ? options.culturalInfluenceLevel
    : defaultCulturalInfluenceLevel(region, rng);
  const environmentFlavor = options.environmentFlavor || pick([...region.environmentKeywords, ...theme.environmentHints], rng);
  const visualMotifs = buildVisualMotifs(theme, region, rng);
  const materialMood = materialMoodFor(theme, region, rng);
  const modernityLevel = modernityFor(theme, region, culturalInfluenceLevel);

  return {
    moduleName: "themeDirectionLayer",
    status: "active",
    themeCategory: theme.themeCategory,
    themeLabel: theme.label,
    regionContext: region.id,
    regionLabel: region.label,
    environmentFlavor,
    environmentKeywords: region.environmentKeywords.slice(),
    visualMotifs,
    materialMood,
    materialHints: pickMany([...(region.materialHints || []), ...(theme.materialHints || [])], 4, rng),
    colorHints: region.colorHints.slice(0, 5),
    structuralHints: region.structuralHints.slice(0, 4),
    motifHints: region.motifHints.slice(0, 5),
    fantasyFlavor: theme.fantasyFlavor,
    culturalInfluenceLevel,
    modernityLevel,
    styleHint: theme.styleHint,
    avoidIfNotSelected: region.avoidIfNotSelected.slice(),
    regionRule: "regionContext gives color, material, street flavor, small structure hints, and motifs; it is not a costume generator.",
    themeSummary: buildThemeSummary(theme, region, environmentFlavor, visualMotifs, materialMood, culturalInfluenceLevel),
  };
}

module.exports = {
  buildThemeDirectionLayer,
  themePresets,
  globalRegionLibrary,
};
