const fs = require("fs");
const path = require("path");

const { buildCharacterSkeleton, compileFinalPrompt } = require("./compile-character-skeleton");
const { defaultDesignLanguagePath } = require("./design-language");

const outputDir = path.resolve(__dirname, "../output/image-test-influence-generation");
const selectedCasesPath = path.join(outputDir, "selected-cases.json");

const cases = [
  {
    id: "case-01-harbor-workwear",
    title: "Harbor Workwear",
    seed: "influence-mvp-2",
    themeCategory: "harbor_pressure_maintenance",
    regionContext: "latin_american_hill_town",
    purpose: "测试港口 / 潮湿 / 工装方向是否能保留压力阀、管线和工装外套的主题识别，同时不变成普通现代路人。",
  },
  {
    id: "case-02-rain-waterproof",
    title: "Rain Waterproof",
    seed: "influence-mvp-4",
    themeCategory: "rain_infrastructure_observer",
    regionContext: "kyoto_old_street",
    purpose: "测试雨水设施 / 防水 / 连帽外套方向是否成立，雨线和水位刻度是否能被识别为主题母题。",
  },
  {
    id: "case-03-library-full-length",
    title: "Library Full Length",
    seed: "influence-mvp-8",
    themeCategory: "library_stack_keeper",
    regionContext: "kyoto_old_street",
    purpose: "测试书库 / 室内 / 长裤方向是否能保持安静秩序感，并让书签、索引签等母题清楚但不过量。",
  },
  {
    id: "case-04-market-summer-shorts-socks",
    title: "Market Summer Shorts Socks",
    seed: "influence-mvp-11",
    themeCategory: "underground_fitness_trainer",
    regionContext: "central_asian_market",
    purpose: "测试市场 / 夏季 / 短裤白袜方向是否成立，短裤、白袜和厚实体型是否能自然共存。",
  },
  {
    id: "case-05-bathhouse-filtered-full",
    title: "Bathhouse Filtered Full",
    seed: "influence-mvp-3",
    themeCategory: "bathhouse_keeper",
    regionContext: "eastern_europe_old_quarter",
    purpose: "测试澡堂 / 蒸汽 / full-length 修正方向是否成立，滤网修正后应表现为长裤而不是短裤。",
  },
  {
    id: "case-06-generic-civic-control",
    title: "Generic Civic Control",
    seed: "influence-mvp-1",
    themeCategory: "generic_civic_worker",
    regionContext: "japanese_small_town",
    purpose: "测试普通 civic / urban fantasy worker 对照组，观察它是否过于泛化或仍能保持清楚主题。",
  },
];

const negativePrompt = [
  "photorealistic",
  "realistic rendering",
  "oil painting",
  "painterly thick paint",
  "messy texture",
  "excessive small buckles",
  "excessive straps",
  "tiny ornaments everywhere",
  "dense micro patterns",
  "text",
  "logo",
  "UI",
  "multiple characters",
  "cropped body",
  "missing feet",
  "bad anatomy",
  "skinny body",
  "six-pack",
  "shredded abs",
  "ripped",
  "wet shirt",
  "oily skin",
  "hyper-realistic muscle",
  "finely segmented abs",
  "sexualized outfit",
].join(", ");

const referenceImageUsageNote = "参考图只用于画风、体型、线条、干净赛璐璐阴影和厚实壮硕的比例气质；不要复制参考图的脸、衣服、姿势、道具和背景。";

const observationChecklist = [
  "体型是否够宽厚，仍是成年厚实壮硕男性",
  "白色贴身内搭是否保留，胸腹大块轮廓是否只是隔着布料轻微读出",
  "是否有被包裹住的力量感，而不是裸露腹肌、湿身或健美腹肌",
  "主题是否明显，母题是否准确",
  "内搭、外套、下装是否像一套，而不是拼装",
  "短裤和白袜是否按预期出现",
  "是否保持大形主导、中低细节密度、高可读性",
  "是否没有文字、logo、UI、多人或身体裁切",
];

const regionEn = {
  latin_american_hill_town: "a Latin American hillside port district",
  kyoto_old_street: "an old Kyoto street setting",
  central_asian_market: "a Central Asian market setting",
  eastern_europe_old_quarter: "an old Eastern European district",
  japanese_small_town: "a small Japanese town",
};

const themeEn = {
  harbor_pressure_maintenance: "harbor pressure-maintenance worker",
  rain_infrastructure_observer: "rain-infrastructure observer",
  library_stack_keeper: "library stack keeper",
  underground_fitness_trainer: "underground fitness trainer in a market district",
  bathhouse_keeper: "bathhouse caretaker",
  generic_civic_worker: "civic public-service worker",
};

const motifEn = {
  "压力阀": "pressure valves",
  "管线": "pipe lines",
  "雨线": "rain-line marks",
  "水位刻度": "water-level scale markings",
  "书签": "bookmarks",
  "索引签": "index tabs",
  "压力表": "a pressure gauge",
  "地方徽章": "local badge motifs",
  "蒸汽": "steam",
  "热水管": "hot-water pipes",
  "路线牌": "route signs",
  "编号牌": "numbered tags",
};

const outerwearEn = {
  "work jacket": "work jacket",
  "hoodie jacket": "hooded outer jacket",
  cardigan: "cardigan",
  "utility vest": "utility vest",
  "cropped jacket": "cropped jacket",
  blazer: "blazer",
};

const silhouetteEn = {
  boxy: "boxy",
  cropped: "cropped",
  oversized: "loose oversized",
  "heavy upper body": "heavy upper-body",
  "A-line": "A-line",
  draped: "draped",
  "wide shoulder": "wide-shouldered",
};

const bottomEn = {
  "straight work trousers": "straight full-length work trousers",
  "loose daily trousers": "loose everyday full-length trousers",
  "wide casual trousers": "wide casual full-length trousers",
  "work shorts": "work shorts",
  "relaxed work shorts": "loose work shorts",
  "knee-length shorts": "knee-length shorts",
  "long shorts": "long shorts",
  "ankle trousers": "ankle-length trousers",
  "wide cropped trousers": "wide cropped trousers",
  "calf-length utility pants": "calf-length utility pants",
  "cropped utility pants": "cropped utility pants",
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, "utf8");
}

function readSelectedCases() {
  if (!fs.existsSync(selectedCasesPath)) return {};
  const rows = JSON.parse(fs.readFileSync(selectedCasesPath, "utf8"));
  return Object.fromEntries(rows.map((row) => [row.id, row]));
}

function extractImageFinal(compiledPrompt) {
  const match = compiledPrompt.match(/## Image Final Prompt\s+([\s\S]*?)\s+## promptCompressionGate\.debug/);
  return (match ? match[1] : compiledPrompt).trim();
}

function upgradeChineseInnerwearAnchor(prompt) {
  const bodyAnchor = "白色贴身内搭紧贴厚实躯干，布料下能轻微读出胸肌与腹肌的大块轮廓，强调被包裹住的力量感，腹部结构清楚但概括，不做细碎肌肉刻画";
  return String(prompt || "")
    .replace(/白色贴身内搭为身体锚点/g, bodyAnchor)
    .replace(/白色贴身短袖上衣为身体锚点/g, bodyAnchor)
    .replace(/白色贴身上衣作为上半身主要视觉/g, `${bodyAnchor}，作为上半身主要视觉`)
    .replace(/不做细碎肌肉刻画，外层/g, "不做细碎肌肉刻画；外层");
}

function listEn(items) {
  const values = items.filter(Boolean);
  if (!values.length) return "";
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function englishMotifs(skeleton) {
  const motifs = Array.isArray(skeleton.motifs)
    ? skeleton.motifs
    : skeleton.themeDirectionLayer && skeleton.themeDirectionLayer.visualMotifs
    ? skeleton.themeDirectionLayer.visualMotifs.slice(0, 2)
    : [];
  return listEn(motifs.map((item) => motifEn[item] || item));
}

function withArticle(phrase) {
  if (!phrase) return "a simple readable outer layer";
  if (/^utility\b/i.test(phrase)) return `a ${phrase}`;
  return /^[aeiou]/i.test(phrase) ? `an ${phrase}` : `a ${phrase}`;
}

function englishOuterwear(skeleton) {
  if (typeof skeleton.outerwear === "string") return withArticle(outerwearEn[skeleton.outerwear] || skeleton.outerwear);
  const outer = skeleton.outerwearModule || {};
  const shape = [silhouetteEn[outer.silhouette], outerwearEn[outer.baseType] || outer.baseType].filter(Boolean).join(" ");
  return withArticle(shape);
}

function englishBottom(skeleton) {
  const bottom = skeleton.bottom || skeleton.bottomModule || {};
  const base = bottomEn[bottom.baseType] || bottom.baseType || "simple full-length trousers";
  const profile = bottom.sockVisibilityProfile || bottom;
  if (!profile.sockVisibility || profile.sockVisibility === "hidden") return `${base} and simple practical dark shoes`;
  if (profile.sockVisibility === "slightly_visible") return `${base}, a small glimpse of clean white socks, and simple practical dark shoes`;
  return `${base}, clearly visible clean white long socks, and simple practical dark shoes`;
}

function englishPrompt(skeleton, caseInfo) {
  const motifs = englishMotifs(skeleton);
  const motifSentence = motifs
    ? `The design suggests a ${themeEn[caseInfo.themeCategory] || caseInfo.themeCategory}, using ${motifs} as concentrated core motifs.`
    : `The design suggests a ${themeEn[caseInfo.themeCategory] || caseInfo.themeCategory} with concentrated, readable visual motifs.`;
  return [
    `Single full-body character design sheet, the entire figure visible from head to toe, on a white or clean light background. An original adult male character from ${regionEn[caseInfo.regionContext] || caseInfo.regionContext}, mature, sturdy, thick-built, and reliable.`,
    "He has broad shoulders and a broad chest, powerful arms and legs, a mature masculine face, a readable hairstyle, and a calm focused expression.",
    motifSentence,
    `Keep the white fitted inner top as a body anchor, with the fabric lightly revealing the large, simplified chest and abdominal structure underneath, emphasizing a wrapped, contained sense of strength rather than exposed muscles. The outer layer is ${englishOuterwear(skeleton)}, paired with ${englishBottom(skeleton)}.`,
    "Keep fantasy elements light and concentrated. Use clean color blocking, Kyoto-animation-like crisp linework, clean cel-shaded shadows, game character design sensibility, large-shape dominance, medium-low detail density, and a readable silhouette.",
  ].join(" ");
}

function promptPackMarkdown(caseInfo, chinesePrompt, english) {
  return [
    `# ${caseInfo.id.replace("case-", "Case ")} - ${caseInfo.title}`,
    "",
    "## Test Purpose",
    caseInfo.purpose,
    "",
    "## Chinese Prompt",
    chinesePrompt,
    "",
    "## English Prompt",
    english,
    "",
    "## Negative Prompt",
    negativePrompt,
    "",
    "## Reference Image Usage Note",
    referenceImageUsageNote,
    "",
    "## Observation Checklist",
    ...observationChecklist.map((item) => `- ${item}`),
    "",
  ].join("\n");
}

function main() {
  ensureDir(outputDir);
  const designLanguagePath = path.resolve(__dirname, "../config/design-language.json");
  const selectedCases = readSelectedCases();

  for (const caseInfo of cases) {
    const selected = selectedCases[caseInfo.id];
    const skeleton = selected || buildCharacterSkeleton({
      seed: caseInfo.seed,
      cultureLevel: 2,
      designLanguagePath: fs.existsSync(designLanguagePath) ? designLanguagePath : defaultDesignLanguagePath,
      themeCategory: caseInfo.themeCategory,
      regionContext: caseInfo.regionContext,
    });
    const compiled = selected ? selected.imageFinal : compileFinalPrompt(skeleton, { mode: "imageFinal" });
    const chinesePrompt = upgradeChineseInnerwearAnchor(selected ? compiled : extractImageFinal(compiled));
    const pack = promptPackMarkdown(caseInfo, chinesePrompt, englishPrompt(skeleton, caseInfo));

    writeText(path.join(outputDir, `${caseInfo.id}.md`), chinesePrompt);
    writeText(path.join(outputDir, `${caseInfo.id}-prompt-pack.md`), pack);
  }

  console.log(`Generated ${cases.length} image test prompt packs in ${path.relative(process.cwd(), outputDir)}`);
}

if (require.main === module) main();
