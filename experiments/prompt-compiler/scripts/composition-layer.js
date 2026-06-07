const genericMotifs = new Set(["护符", "纸片", "门牌", "地方徽章"]);

const fieldGenericMotifs = new Set([
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

const fieldMotifCn = {
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

const fieldPlaneCn = {
  "broad strap panel": "宽绑带块面",
  "reinforced waist block": "强化腰部块",
  "rounded pocket flap": "圆角口袋盖片",
  "soft rectangular chest panel": "柔和矩形胸前片",
  "square pocket grid panel": "方格口袋块面",
  "side cargo panel": "侧向货袋块面",
  "diagonal rain-awning flap": "斜向雨棚挡片",
  "rectangular light-frame panel": "矩形灯架块面",
  "fan-shaped chest panel": "扇形胸前片",
  "light-window panel": "放映窗块面",
  "narrow rail guard panel": "窄轨道护片",
  "boxy shoulder plate": "箱型肩片",
  "rectangular front housing panel": "矩形前身框片",
  "arc-shaped shoulder panel": "弧形肩片",
  "narrow closure tabs": "窄闭合标签",
  "signal-box pocket panel": "信号箱口袋块",
  "curved side panel": "弧形侧片",
  "rounded color block": "圆角色块",
  "curved safety strap panel": "弧形安全绑带片",
  "tensioned diagonal front panel": "绷紧斜向前片",
  "box-frame shoulder panel": "框架式肩片",
  "banded cuff block": "带状袖口块",
};

const motifElementLibrary = {
  "压力阀": {
    points: ["圆形压力表点", "少量螺栓点"],
    lines: ["短刻度线", "环形表盘线"],
    planes: ["圆形护片", "矩形金属块面"],
  },
  "管线": {
    points: ["管线连接点"],
    lines: ["粗管线走向", "短接缝线"],
    planes: ["长条护片", "侧向功能块面"],
  },
  "压力刻度": {
    points: ["刻度端点"],
    lines: ["短刻度线组", "弧形刻度线"],
    planes: ["小型仪表面板"],
  },
  "潮湿金属": {
    points: ["少量铆点"],
    lines: ["哑光金属边线"],
    planes: ["氧化金属色块"],
  },
  "雨线": {
    points: ["小水痕点"],
    lines: ["竖向雨线", "水位竖线"],
    planes: ["透明防雨片", "防水挡片"],
  },
  "水位刻度": {
    points: ["刻度端点"],
    lines: ["竖向水位刻度", "短反光刻度线"],
    planes: ["窄长反光条"],
  },
  "排水路径": {
    points: ["排水节点"],
    lines: ["斜向排水线", "侧缝导流线"],
    planes: ["防水拼接片"],
  },
  "反光条": {
    points: ["反光端点"],
    lines: ["短反光线组"],
    planes: ["窄反光块"],
  },
  "书签": {
    points: ["小标签点"],
    lines: ["竖向书签线", "纸边线"],
    planes: ["矩形书签前片", "窄长前襟块"],
  },
  "索引签": {
    points: ["索引标签点"],
    lines: ["阶梯式标签线"],
    planes: ["层叠索引片", "口袋标签块"],
  },
  "书页": {
    points: ["页角点"],
    lines: ["层叠纸边线"],
    planes: ["纸页式矩形块"],
  },
  "归档标记": {
    points: ["归档小标点"],
    lines: ["编号短线"],
    planes: ["档案标签块"],
  },
  "蒸汽": {
    points: ["少量蒸汽点"],
    lines: ["柔和弧线", "上升波线"],
    planes: ["淡色蒸汽块面"],
  },
  "热水管": {
    points: ["管线接点"],
    lines: ["粗热水管线", "横向连接线"],
    planes: ["管道护片", "腰侧功能块"],
  },
  "瓷砖": {
    points: ["瓷砖角点"],
    lines: ["大块瓷砖分割线"],
    planes: ["方形瓷砖块面"],
  },
  "温度刻度": {
    points: ["温度刻度点"],
    lines: ["短温度刻度线"],
    planes: ["窄长温度标牌"],
  },
  "摊位灯": {
    points: ["少量灯点"],
    lines: ["悬挂线", "棚架边线"],
    planes: ["灯牌块面"],
  },
  "货牌": {
    points: ["挂点"],
    lines: ["货牌边线", "短吊线"],
    planes: ["矩形货牌块", "口袋牌块"],
  },
  "夜市路标": {
    points: ["路标端点"],
    lines: ["路标边线"],
    planes: ["路牌矩形块"],
  },
  "布棚": {
    points: ["棚角点"],
    lines: ["棚边线", "布带线"],
    planes: ["大块布棚色块"],
  },
  "路线牌": {
    points: ["编号点"],
    lines: ["路线边线"],
    planes: ["路线牌块面"],
  },
  "编号牌": {
    points: ["编号标点"],
    lines: ["短编号线"],
    planes: ["编号牌块"],
  },
};

Object.assign(motifElementLibrary, {
  "crate straps": {
    points: ["strap anchor points"],
    lines: ["diagonal cargo strap lines", "wide belt-like crossing lines"],
    planes: ["broad strap panel", "reinforced waist block"],
  },
  "freezer rounded door": {
    points: ["rounded latch points"],
    lines: ["rounded refrigerator-door seams"],
    planes: ["rounded pocket flap", "soft rectangular chest panel"],
  },
  "cargo rack grid": {
    points: ["grid joint points"],
    lines: ["large cargo-rack grid lines"],
    planes: ["square pocket grid panel", "side cargo panel"],
  },
  "plastic awning diagonal": {
    points: ["awning corner points"],
    lines: ["slanted awning ribs"],
    planes: ["diagonal rain-awning flap"],
  },
  "stall light frame": {
    points: ["small light-frame dots"],
    lines: ["stall-light frame edges"],
    planes: ["rectangular light-frame panel"],
  },
  "projector light beam": {
    points: ["lamp housing points"],
    lines: ["projector beam lines"],
    planes: ["fan-shaped chest panel", "light-window panel"],
  },
  "film rail": {
    points: ["rail screw points"],
    lines: ["parallel film-rail lines"],
    planes: ["narrow rail guard panel"],
  },
  "lamp housing frame": {
    points: ["housing corner points"],
    lines: ["lamp housing edges"],
    planes: ["boxy shoulder plate", "rectangular front housing panel"],
  },
  "radio antenna arcs": {
    points: ["antenna tip points"],
    lines: ["curved antenna arcs", "thin signal lines"],
    planes: ["arc-shaped shoulder panel"],
  },
  "cable ties": {
    points: ["tie lock points"],
    lines: ["short cable-tie bands"],
    planes: ["narrow closure tabs"],
  },
  "signal box vents": {
    points: ["vent end points"],
    lines: ["wide vent slits"],
    planes: ["signal-box pocket panel"],
  },
  "pool lane rope arcs": {
    points: ["lane float points"],
    lines: ["rope arc rhythm"],
    planes: ["curved side panel"],
  },
  "float marker curve": {
    points: ["float marker dots"],
    lines: ["rounded float-marker lines"],
    planes: ["rounded color block"],
  },
  "rescue buoy strap": {
    points: ["strap rivet points"],
    lines: ["buoy strap curves"],
    planes: ["curved safety strap panel"],
  },
  "bridge cable lines": {
    points: ["cable anchor points"],
    lines: ["long bridge cable lines"],
    planes: ["tensioned diagonal front panel"],
  },
  "lantern frame": {
    points: ["lantern corner points"],
    lines: ["lantern frame edges"],
    planes: ["box-frame shoulder panel"],
  },
  "tension marker bands": {
    points: ["marker end points"],
    lines: ["short tension marker bands"],
    planes: ["banded cuff block"],
  },
});

const themeSourceMotifs = {
  harbor_pressure_maintenance: ["压力阀", "管线", "潮湿金属", "压力刻度"],
  rain_infrastructure_observer: ["雨线", "水位刻度", "排水路径", "反光条"],
  library_stack_keeper: ["书签", "索引签", "书页", "归档标记"],
  bathhouse_keeper: ["蒸汽", "热水管", "瓷砖", "温度刻度"],
  market_guard: ["货牌", "摊位灯", "夜市路标", "布棚"],
  night_market_vendor: ["货牌", "摊位灯", "夜市路标", "布棚"],
  generic_civic_worker: ["路线牌", "编号牌"],
};

const arrangements = ["linear", "grid", "radial", "axis_aligned", "diagonal", "asymmetric"];
const rhythms = ["repeat", "alternating", "interrupted", "stepped", "wave"];
const transformations = ["translate", "scale", "non_uniform_scale", "tilt", "cut", "slice", "split", "overlap"];

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function pickMany(items, count, rng) {
  const pool = [...items];
  const result = [];
  while (pool.length && result.length < count) {
    result.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return result;
}

function collectSourceMotifs(themeDirectionLayer, resolvedInfluences) {
  const theme = themeDirectionLayer || {};
  const resolved = resolvedInfluences || {};
  const fieldLayer = resolved.fieldInfluenceExpansionLayer || theme.fieldInfluenceExpansionLayer || {};
  const concreteTheme = fieldLayer.concreteTheme || {};
  const fieldMotifs = unique([
    ...(concreteTheme.activityMotifs || []),
    ...(concreteTheme.environmentMotifs || []),
    ...(concreteTheme.materialMotifs || []),
    ...(fieldLayer.motifCandidates || []),
  ])
    .filter((item) => !genericMotifs.has(item))
    .filter((item) => !fieldGenericMotifs.has(item));
  const fieldSource = fieldMotifs.filter((item) => motifElementLibrary[item]).slice(0, 3);
  if (fieldSource.length >= 2) return fieldSource;

  const themeFallback = themeSourceMotifs[theme.themeCategory] || [];
  const fromTheme = unique([...(theme.visualMotifs || []), ...themeFallback]);
  const fromInfluences = unique([
    ...(resolved.materialInfluence || []),
    ...(resolved.environmentInfluence || []),
    resolved.occupationSeed,
  ]);
  const source = unique([...fromTheme, ...fromInfluences])
    .filter((item) => !genericMotifs.has(item))
    .filter((item) => motifElementLibrary[item] || themeFallback.includes(item))
    .slice(0, 3);
  return source.length ? source : fromTheme.slice(0, 2);
}

function extractElements(sourceMotifs) {
  const points = [];
  const lines = [];
  const planes = [];
  for (const motif of sourceMotifs) {
    const entry = motifElementLibrary[motif];
    if (!entry) continue;
    points.push(...entry.points);
    lines.push(...entry.lines);
    planes.push(...entry.planes);
  }
  return {
    points: unique(points).slice(0, 3),
    lines: unique(lines).slice(0, 4),
    planes: unique(planes).slice(0, 3),
  };
}

function inferMapping(themeCategory, rng) {
  const mappingByTheme = {
    harbor_pressure_maintenance: {
      mainPanel: "chest panel",
      secondaryPanel: "shoulder patch",
      linePlacement: "diagonal front seam",
      pointPlacement: "shoulder bolt-like dots",
      colorPlacement: "secondary block",
    },
    rain_infrastructure_observer: {
      mainPanel: "front opening panel",
      secondaryPanel: "sleeve cuff",
      linePlacement: "vertical side seam",
      pointPlacement: "waist scale marks",
      colorPlacement: "small accent marks only",
    },
    library_stack_keeper: {
      mainPanel: "front opening panel",
      secondaryPanel: "pocket flap",
      linePlacement: "vertical side seam",
      pointPlacement: "pocket tab marks",
      colorPlacement: "secondary block",
    },
    bathhouse_keeper: {
      mainPanel: "waist panel",
      secondaryPanel: "collar edge",
      linePlacement: "curved chest seam",
      pointPlacement: "waist scale marks",
      colorPlacement: "large base color",
    },
    market_guard: {
      mainPanel: "side pocket panel",
      secondaryPanel: "hem strip",
      linePlacement: "hem line",
      pointPlacement: "pocket tab marks",
      colorPlacement: "small accent marks only",
    },
  };
  return mappingByTheme[themeCategory] || {
    mainPanel: pick(["chest panel", "front opening panel", "side pocket panel"], rng),
    secondaryPanel: pick(["collar edge", "pocket flap", "hem strip"], rng),
    linePlacement: pick(["vertical side seam", "diagonal front seam", "hem line"], rng),
    pointPlacement: pick(["pocket tab marks", "waist scale marks", "chest accent dots"], rng),
    colorPlacement: pick(["secondary block", "small accent marks only"], rng),
  };
}

function cnPlacement(value) {
  return {
    "chest panel": "胸前主片",
    "shoulder panel": "肩部护片",
    "front opening panel": "前襟主片",
    "waist panel": "腰部块面",
    "side pocket panel": "侧袋块面",
    "back panel": "背部块面",
    "collar edge": "领边",
    "sleeve cuff": "袖口",
    "shoulder patch": "肩部护片",
    "hem strip": "下摆条片",
    "pocket flap": "口袋盖片",
    "belt area": "腰带区域",
    "diagonal front seam": "斜向前身分割",
    "vertical side seam": "竖向侧缝",
    "curved chest seam": "胸前弧线分割",
    "shoulder-to-waist line": "肩到腰的结构线",
    "sleeve stripe": "袖侧线",
    "hem line": "下摆线",
    "chest accent dots": "胸前少量点状呼应",
    "shoulder bolt-like dots": "肩部少量螺栓状点",
    "waist scale marks": "腰侧短刻度",
    "pocket tab marks": "口袋标签点",
    "sleeve small marks": "袖侧少量标记",
  }[value] || value;
}

function cnPanel(value) {
  return {
    "chest panel": "胸前",
    "shoulder panel": "肩部",
    "front opening panel": "前襟",
    "waist panel": "腰部",
    "side pocket panel": "侧袋",
    "back panel": "背部",
  }[value] || cnPlacement(value);
}

function arrangementCue(value, mapping) {
  return {
    axis_aligned: "沿身体轴线稳定排列",
    diagonal: "前身形成斜向走向",
    linear: "用竖向线条贯穿前身",
    radial: `围绕${cnPanel(mapping.secondaryPanel)}克制放射`,
    grid: "保持方整秩序",
    clustered: "集中成一处主视觉",
    asymmetric: "轻微不对称",
  }[value] || "集中在一个主视觉区域";
}

function rhythmCue(value) {
  return {
    repeat: "少量重复刻度呼应",
    alternating: "长短线交替",
    interrupted: "线条在边缘克制中断",
    stepped: "边缘做阶梯式停顿",
    wave: "柔和弧线呼应主题",
    gradient: "块面轻微渐变",
  }[value] || "节奏保持克制";
}

function transformationCue(value) {
  return {
    overlap: "主副片轻微叠压",
    split: "主块面分成两段",
    cut: "边缘切割干净",
    translate: "小块面错位平移",
    scale: "块面大小有层次",
    non_uniform_scale: "块面拉成窄长比例",
    tilt: "局部轻微倾斜",
    slice: "主片切出窄条边",
  }[value] || "块面处理保持简洁";
}

function buildPromptFragment(layer) {
  const motifs = layer.sourceMotifs.slice(0, 2).map((item) => fieldMotifCn[item] || item).join("和");
  const mainPlaneRaw = layer.extractedElements.planes[0] || "大块结构片";
  const mainPlane = fieldPlaneCn[mainPlaneRaw] || mainPlaneRaw;
  const mapping = layer.garmentMapping;
  const grammar = layer.compositionGrammar || {};
  return `服装将${motifs}转成${cnPanel(mapping.mainPanel)}${mainPlane}，${arrangementCue(grammar.arrangement, mapping)}，${rhythmCue(grammar.rhythm)}，${transformationCue(grammar.transformation)}，不遮白色内搭`;
}

function buildCompositionLayer(rng, options = {}) {
  const themeDirectionLayer = options.themeDirectionLayer || {};
  const resolvedInfluences = options.resolvedInfluences || {};
  const sourceMotifs = collectSourceMotifs(themeDirectionLayer, resolvedInfluences);
  const extractedElements = extractElements(sourceMotifs);
  const compositionGrammar = {
    arrangement: pick(arrangements, rng),
    rhythm: pick(rhythms, rng),
    transformation: pick(transformations, rng),
    booleanOperation: pick(["union", "intersection", "subtraction", "difference"], rng),
  };
  const garmentMapping = inferMapping(themeDirectionLayer.themeCategory, rng);
  const complexityControl = {
    maxMainPlanes: 2,
    maxSecondaryPlanes: 2,
    maxLineGroups: 2,
    maxPointClusters: 1,
    allowDensePattern: false,
    motifScale: "medium_to_large",
    detailDensity: "medium_low",
  };
  const layer = {
    moduleName: "compositionLayer",
    status: "mvp",
    sourceMotifs,
    extractedElements,
    compositionGrammar,
    garmentMapping,
    complexityControl,
    compositionReasoningLog: [
      `Selected ${sourceMotifs.join(" / ")} from theme motifs and resolved influences.`,
      "Converted motifs into limited points, lines, and planes for garment structure instead of surface stickers.",
      `Mapped the main composition to ${garmentMapping.mainPanel} with one echo area at ${garmentMapping.secondaryPanel}.`,
    ],
  };
  return {
    ...layer,
    promptFragment: buildPromptFragment(layer),
  };
}

module.exports = {
  buildCompositionLayer,
};
