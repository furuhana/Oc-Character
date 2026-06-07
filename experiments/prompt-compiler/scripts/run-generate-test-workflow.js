const fs = require("fs");
const path = require("path");

const { buildCharacterSkeleton, compileFinalPrompt } = require("./compile-character-skeleton");
const { defaultDesignLanguagePath } = require("./design-language");
const { genericLowPotentialMotifs, broadThemeCategories } = require("./field-influence-expansion-layer");

const presetPath = path.resolve(__dirname, "../GENERATE_TEST_PRESET.md");
const outputDir = path.resolve(__dirname, "../output/generate-test");
const referenceImagePath = "experiments/prompt-compiler/assets/reference/body-style-anchor.png";
const absoluteReferenceImagePath =
  "E:\\wk\\GitHub\\Oc-Character\\experiments\\prompt-compiler\\assets\\reference\\body-style-anchor.png";
const defaultMode = "exploration";

const regressionThemeBlacklistForExploration = [
  "harbor_pressure_maintenance",
  "rain_infrastructure_observer",
  "library_stack_keeper",
  "bathhouse_keeper",
  "market_guard",
];

const regressionSimilarityPatterns = [
  /harbor|港|码头|pressure|压力阀|阀门|管线|管道/i,
  /rain|雨|排水|水位|防汛|水尺/i,
  /library|book|archive|书库|图书馆|书签|索引/i,
  /bathhouse|澡堂|浴场|蒸汽|热水/i,
  /market|市场|夜市|摊位|货牌/i,
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
  "flat poster pattern pasted on clothes",
  "abstract graphic poster outfit",
  "text",
  "logo",
  "UI",
  "watermark",
  "multiple characters",
  "cropped body",
  "missing feet",
  "bad anatomy",
  "skinny body",
  "childish proportions",
  "big head",
  "six-pack",
  "shredded abs",
  "ripped",
  "wet shirt",
  "oily skin",
  "hyper-realistic muscle",
  "finely segmented abs",
  "sexualized outfit",
  "prop sheet",
  "turnaround sheet",
].join(", ");

const referenceImageUsageNote =
  [
    `Reference image path: ${absoluteReferenceImagePath}`,
    `Project relative path: ${referenceImagePath}`,
    "Use the uploaded reference image only for body style, broad thick adult male proportions, very wide shoulders, thick chest, strong arms, thick torso, sturdy legs, mature steady adult male presence, clean TV anime cel-shaded style, simple clean linework, large simplified body-structure feeling, and white fitted innerwear body-anchor direction.",
    "Do not copy the reference image character identity, face, facial features, hairstyle, expression, clothing style, pants, shoes, pose, colors, props, or background.",
  ].join("\n");

const observationChecklist = [
  "是否是单人全身",
  "是否从头到脚完整可见，没有裁切",
  "是否保留宽肩厚胸、壮硕厚实成年男性体型",
  "是否保持成熟成年男性感觉，不要变瘦、幼化或大头化",
  "是否保留白色贴身内搭",
  "白色贴身内搭是否像包裹住厚实躯干，而不是松垮普通 T-shirt",
  "布料下是否能轻微读出胸肌与腹肌的大块轮廓",
  "腹部轮廓是否是大块、概括、克制的，而不是细碎六块腹肌",
  "是否避免湿身、油亮、写实健美、过度性感化",
  "主题母题是否被转化成服装结构，而不是只贴成徽章或图案",
  "是否能看到母题变成了服装块面、分割线、口袋、护片、肩部结构、腰部结构或少量点状呼应",
  "服装是否像一整套，而不是随机拼装",
  "下装长度是否符合当前 case",
  "如果当前 case 要求短裤、裁短裤或露踝裤，是否出现对应裤长",
  "如果当前 case 要求白袜，是否出现清楚可见的白色袜子",
  "如果当前 case 是 full-length 长裤方向，是否没有乱露白袜",
  "主题方向是否清楚，不要变成普通现代路人",
  "核心母题是否准确，不要被泛用装饰取代",
  "是否保持干净 TV 动画赛璐璐风格",
  "是否保持大形主导、中低细节密度、高可读性",
  "是否避免大量小扣件、小带子、小挂件、碎纹样",
  "是否避免文字、logo、UI、水印",
  "是否避免多人、三视图、道具拆解页",
];

observationChecklist.push(
  "desire / body display 是否被翻译成服装贴身度、露肤程度和外套开合，而不是抽象符号",
  "如果角色更性感，是否仍然有完整服装设计",
  "是否避免裸体、湿身、油亮和色情化",
  "是否保留成年厚实男性体型和白色贴身内搭锚点",
  "是否通过剪裁和搭配表达自信，而不是只靠裸露",
);

const regionEn = {
  neutral_urban: "a grounded modern urban setting",
  north_china_old_city: "a North China old-city setting",
  southeast_asian_rain_street: "a Southeast Asian rain-street setting",
  kyoto_old_street: "an old Kyoto street setting",
  latin_american_hill_town: "a Latin American hillside town setting",
  central_asian_market: "a Central Asian market setting",
  eastern_europe_old_quarter: "an Eastern European old-quarter setting",
  japanese_small_town: "a small Japanese town setting",
};

const themeEn = {
  night_patrol: "night patrol worker",
  market_guard: "market guard",
  clock_tower_maintainer: "clock-tower maintainer",
  greenhouse_gardener: "greenhouse gardener",
  harbor_pressure_maintenance: "harbor pressure-maintenance worker",
  rain_infrastructure_observer: "rain-infrastructure observer",
  library_stack_keeper: "library stack keeper",
  underground_fitness_trainer: "underground fitness trainer",
  bathhouse_keeper: "bathhouse caretaker",
  generic_civic_worker: "civic public-service worker",
};

const motifEn = {
  "压力阀": "pressure valves",
  "管线": "pipe lines",
  "雨线": "rain-line marks",
  "水位刻度": "water-level scale marks",
  "书签": "bookmarks",
  "索引签": "index tabs",
  "蒸汽": "steam",
  "热水管": "hot-water pipes",
  "路灯": "street lights",
  "旧钟": "old clocks",
  "旧铜": "aged copper",
  "摊位灯": "stall lights",
  "货牌": "market tags",
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, `${text.trim()}\n`, "utf8");
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function optionValue(args, name) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return null;
  return args[index + 1] || null;
}

function parseCount(args) {
  const raw = optionValue(args, "count");
  if (!raw) return 1;
  const count = Number.parseInt(raw, 10);
  if (!Number.isFinite(count) || count < 1) return 1;
  return Math.min(count, 10);
}

function parseMode(args) {
  const raw = optionValue(args, "mode");
  if (args.includes("--regression") || raw === "regression") return "regression";
  return defaultMode;
}

function extractImageFinal(compiledPrompt) {
  const match = String(compiledPrompt || "").match(/## Image Final Prompt\s+([\s\S]*?)\s+## promptCompressionGate\.debug/);
  return (match ? match[1] : compiledPrompt).trim();
}

function listValues(values) {
  return values.filter(Boolean).join(", ");
}

function getMotifs(skeleton) {
  return (
    skeleton.compositionLayer?.sourceMotifs ||
    skeleton.fieldInfluenceExpansionLayer?.motifCandidates ||
    skeleton.themeDirectionLayer?.visualMotifs ||
    []
  ).slice(0, 3);
}

function fieldLayer(skeleton) {
  return skeleton.fieldInfluenceExpansionLayer || skeleton.influenceGenerationLayer?.fieldInfluenceExpansionLayer || {};
}

function shortList(items, count = 3) {
  return (items || []).filter(Boolean).slice(0, count).join(" / ");
}

function hasGenericCoreMotif(motifs) {
  return (motifs || []).slice(0, 2).some((item) => genericLowPotentialMotifs.has(String(item).toLowerCase()));
}

function bodyDisplayPhrase(desire) {
  if (!desire || !desire.tightnessLevel) return "";
  const confidence = {
    low: "low-key",
    moderate: "moderately confident",
    confident: "confident",
    high_but_non_explicit: "highly confident but non-explicit",
  }[desire.sensualityLevel] || desire.sensualityLevel;
  return `${desire.tightnessLevel} fit, ${desire.outerwearOpenness} outerwear, ${desire.exposureLevel} exposure, ${confidence} body display`;
}

function translateMotifs(motifs) {
  const translated = motifs.map((item) => motifEn[item] || item).filter(Boolean);
  if (!translated.length) return "concentrated role and region motifs";
  if (translated.length === 1) return translated[0];
  return `${translated.slice(0, -1).join(", ")} and ${translated[translated.length - 1]}`;
}

function bottomSockSummary(skeleton) {
  const bottom = skeleton.bottomModule || {};
  const sock = bottom.sockVisibilityProfile || {};
  return listValues([
    bottom.baseType,
    bottom.length,
    sock.sockVisibility ? `sockVisibility: ${sock.sockVisibility}` : null,
    sock.promptFragment,
  ]);
}

function candidateQualityFilter(skeleton, options = {}) {
  const mode = options.mode || defaultMode;
  const usedThemeCategories = options.usedThemeCategories || new Set();
  const riskNotes = [];
  const motifs = getMotifs(skeleton);
  const composition = skeleton.compositionLayer;
  const bottom = skeleton.bottomModule || {};
  const reasonability = skeleton.reasonabilityFilter || {};
  const themeCategory = skeleton.themeDirectionLayer?.themeCategory || "";
  const field = fieldLayer(skeleton);
  const concreteTheme = field.concreteTheme || {};
  const boundaryCheck = field.fieldBoundaryCheck || skeleton.influenceGenerationLayer?.fieldBoundaryCheck || {};
  const sourceMotifs = motifs.length ? motifs : concreteTheme.sourceMotifs || [];
  const genericCoreMotif = hasGenericCoreMotif(sourceMotifs);
  const fieldDerivationSignals = [
    field.selectedFields,
    field.derivedLifeContext && field.derivedLifeContext.length,
    field.derivedVisualContext && field.derivedVisualContext.length,
    field.derivedGarmentLogic && field.derivedGarmentLogic.length,
    concreteTheme.dailyActivity,
    concreteTheme.workplace,
  ].filter(Boolean).length;

  let appealScore = 7;
  let noveltyScore = 6;
  let coherenceScore = 7;
  let visualPotentialScore = 6;
  let fieldDerivationQuality = fieldDerivationSignals >= 5 ? 8 : fieldDerivationSignals >= 3 ? 6 : 3;
  let regressionSimilarityPenalty = 0;
  let forcedRejectReason = null;

  if (boundaryCheck.passed === false) {
    noveltyScore = Math.min(noveltyScore, 4);
    fieldDerivationQuality = Math.min(fieldDerivationQuality, 3);
    forcedRejectReason = "field pollution";
    riskNotes.push("field pollution");
    riskNotes.push(...(boundaryCheck.riskNotes || []));
  }

  if (mode === "exploration" && regressionThemeBlacklistForExploration.includes(themeCategory)) {
    noveltyScore = Math.min(noveltyScore, 2);
    regressionSimilarityPenalty = 7;
    forcedRejectReason = "旧 regression case，不用于默认生成测试";
    riskNotes.push("old regression theme is blocked in exploration mode");
  } else if (mode === "exploration") {
    const comparisonText = [
      themeCategory,
      skeleton.themeDirectionLayer?.themeLabel,
      skeleton.themeDirectionLayer?.themeSummary,
      skeleton.themeDirectionLayer?.environmentFlavor,
      ...(skeleton.themeDirectionLayer?.visualMotifs || []),
      skeleton.compositionLayer?.promptFragment,
      skeleton.influenceGenerationLayer?.primaryInfluences?.occupationSeed,
      ...(skeleton.influenceGenerationLayer?.derivedInfluences?.environmentInfluence || []),
      ...(skeleton.influenceGenerationLayer?.derivedInfluences?.materialInfluence || []),
    ].filter(Boolean).join(" ");
    const similarityHits = regressionSimilarityPatterns.filter((pattern) => pattern.test(comparisonText)).length;
    if (similarityHits >= 2) {
      regressionSimilarityPenalty = Math.min(4, similarityHits + 1);
      noveltyScore -= regressionSimilarityPenalty;
      riskNotes.push("too similar to regression case");
    }
  }
  if (usedThemeCategories.has(themeCategory)) {
    noveltyScore = Math.min(noveltyScore, 4);
    fieldDerivationQuality = Math.min(fieldDerivationQuality, 5);
    riskNotes.push("duplicate concrete theme in the same generate-test batch");
  }

  if (!motifs.length) {
    visualPotentialScore -= 2;
    riskNotes.push("No clear source motifs found.");
  }
  if (!composition?.promptFragment) {
    visualPotentialScore -= 3;
    riskNotes.push("compositionLayer did not produce a prompt fragment.");
  }
  if (/generic/i.test(skeleton.themeDirectionLayer?.themeCategory || "")) {
    noveltyScore = Math.min(noveltyScore - 2, 4);
    riskNotes.push("Theme may read as generic civic workwear.");
  }
  if (broadThemeCategories.has(themeCategory)) {
    noveltyScore = Math.min(noveltyScore, 4);
    fieldDerivationQuality = Math.min(fieldDerivationQuality, 4);
    riskNotes.push("broad theme category was not concretized");
  }
  if (genericCoreMotif) {
    visualPotentialScore = Math.min(visualPotentialScore, 3);
    noveltyScore = Math.min(noveltyScore, 3);
    appealScore = Math.max(0, appealScore - 2);
    riskNotes.push("generic low-potential motif");
  }
  if (!field.selectedFields) {
    fieldDerivationQuality = Math.min(fieldDerivationQuality, 3);
    riskNotes.push("missing fieldInfluenceExpansionLayer");
  }
  if (field.desireExposureInfluence && field.derivedGarmentLogic) {
    appealScore += 1;
    visualPotentialScore += 1;
  }
  if (reasonability.passed === false) {
    coherenceScore -= 3;
    riskNotes.push("reasonabilityFilter did not pass.");
  }
  if (!bottom.promptFragment && !bottom.baseType) {
    coherenceScore -= 1;
    riskNotes.push("Bottom module is weak or missing.");
  }

  const passed =
    !forcedRejectReason &&
    appealScore >= 6 &&
    noveltyScore >= 5 &&
    coherenceScore >= 6 &&
    visualPotentialScore >= 6 &&
    fieldDerivationQuality >= 6 &&
    !genericCoreMotif;

  return {
    passed,
    appealScore: Math.max(0, Math.min(10, appealScore)),
    noveltyScore: Math.max(0, Math.min(10, noveltyScore)),
    coherenceScore: Math.max(0, Math.min(10, coherenceScore)),
    visualPotentialScore: Math.max(0, Math.min(10, visualPotentialScore)),
    fieldDerivationQuality: Math.max(0, Math.min(10, fieldDerivationQuality)),
    regressionSimilarityPenalty,
    riskNotes,
    rejectReason: passed ? null : forcedRejectReason || "Candidate is not strong enough for a lightweight image test.",
  };
}

function buildEnglishPrompt(skeleton) {
  const themeCategory = skeleton.themeDirectionLayer?.themeCategory || "original character";
  const regionContext = skeleton.themeDirectionLayer?.regionContext || "neutral_urban";
  const motifs = translateMotifs(getMotifs(skeleton));
  const field = fieldLayer(skeleton);
  const concreteTheme = field.concreteTheme || {};
  const bundle = field.fieldBundle || field.selectedFields || {};
  const boundaryCheck = field.fieldBoundaryCheck || {};
  const desire = field.desireExposureInfluence || {};
  const composition = skeleton.compositionLayer?.promptFragment
    ? `Translate ${motifs} into garment structure: panels, seams, pockets, guards, waist structures, shoulder structures, and a few restrained accents.`
    : `Use ${motifs} as concentrated garment-structure motifs.`;

  return [
    "Single full-body character design sheet, the entire figure visible from head to toe, on a white or clean light background.",
    `Create one original adult male character from ${regionEn[regionContext] || regionContext}, designed as a believable person first and not as a costume showcase.`,
    `He suggests a ${concreteTheme.themeLabel || themeEn[themeCategory] || themeCategory}, mature, sturdy, thick-built, grounded, and reliable, with wide shoulders, thick chest, powerful arms, strong legs, a mature masculine face, readable hairstyle, and calm focused expression.`,
    concreteTheme.dailyActivity ? `His design is grounded in real daily activity: ${concreteTheme.dailyActivity}, around ${concreteTheme.workplace}.` : "",
    "Keep the white fitted inner top visible as the body anchor. The inner top should cling to the thick torso enough to suggest broad chest mass and large simplified abdominal forms under the fabric, with a restrained wrapped and contained feeling, not exposed muscles.",
    desire.tightnessLevel ? `Body-display logic: ${bodyDisplayPhrase(desire)}; keep it adult, stylish, non-explicit, and fully designed as clothing.` : "",
    "Keep abdominal definition broad, simplified, and restrained, not finely segmented, not shredded, not wet, not oily, not hyper-realistic, and not sexualized.",
    composition,
    field.derivedGarmentLogic?.length ? `Garment logic: ${field.derivedGarmentLogic.slice(0, 4).join("; ")}.` : "",
    "The outfit must feel coherent as one garment system, with large-shape dominant design, clear silhouette, medium-low detail density, one main visual focus and one secondary focus, restrained fantasy, and only a few medium-to-large motifs.",
    "Use clean TV anime cel-shaded style, Kyoto-animation-like crisp linework, simple shadow blocks, and game character design sensibility.",
  ].filter(Boolean).join(" ");
}

function buildChinesePrompt(skeleton, imageFinal) {
  const addendum =
    "全局规则：单人全身角色设定图，从头到脚完整可见；原创成年男性，不是服装展示架；宽肩厚胸、厚实躯干、粗壮手臂和结实腿部，成熟稳重。保留白色贴身内搭作为身体锚点，内搭贴合厚实躯干，布料下轻微读出胸肌与腹肌的大块概括轮廓，强调被包裹住的力量感，不做细碎六块腹肌、湿身、油亮、写实健美或过度性感。服装像一整套，主题母题转化为服装块面、分割线、口袋、护片、肩部结构、腰部结构或少量克制呼应，不要贴徽章、碎图案或随机拼装。大形主导、中低细节密度、干净 TV 动画赛璐璐风格。";
  return `${imageFinal}\n\n${addendum}`;
}

function buildCaseSummary(testId, skeleton, quality) {
  const theme = skeleton.themeDirectionLayer || {};
  const foundation = skeleton.characterFoundationLayer || {};
  const influences = skeleton.influenceGenerationLayer || {};
  const field = fieldLayer(skeleton);
  const concreteTheme = field.concreteTheme || {};
  const bundle = field.fieldBundle || field.selectedFields || {};
  const boundaryCheck = field.fieldBoundaryCheck || {};
  const desire = field.desireExposureInfluence || {};
  return [
    `## Case Summary`,
    "",
    `- testId: ${testId}`,
    `- theme / occupation: ${theme.themeCategory || "unknown"} / ${theme.themeLabel || "unknown"}`,
    `- regionContext: ${theme.regionContext || "unknown"}`,
    `- personalityCore: ${foundation.personalityCore || "mature, grounded, reliable"}`,
    `- presentationMode: ${influences.primaryInfluences?.presentationMode || "single full-body character design sheet"}`,
    `- clean fieldBundle: nationality=${bundle.nationality || "unknown"}; region=${bundle.region || "unknown"}; birthplace=${bundle.birthplace || "unknown"}; localityFlavor=${bundle.localityFlavor || "unknown"}; environmentFlavor=${bundle.environmentFlavor || "unknown"}; workplace=${bundle.workplace || "unknown"}; occupation=${bundle.occupation || "unknown"}; organization=${bundle.organization || "unknown"}; class/wealth=${bundle.classStatus || "unknown"} / ${bundle.wealthLevel || "unknown"}`,
    `- fieldBoundaryCheck: passed=${boundaryCheck.passed !== false}, riskNotes=${shortList(boundaryCheck.riskNotes, 3) || "none"}`,
    `- field bundle influence summary: desire/body display=${field.psychologicalInfluence?.desire || "unknown"} -> ${desire.exposureLevel || "unknown"} / ${desire.tightnessLevel || "unknown"} / ${desire.outerwearOpenness || "unknown"}; risk/criminal note=derivation only, ${shortList(field.riskInfluence?.derivedRiskLogic, 2)}; fear/flaw/habit=${shortList([field.psychologicalInfluence?.fear, field.psychologicalInfluence?.flaw, field.psychologicalInfluence?.habit], 3)}; imagination/world hook=${field.worldHookInfluence?.characterHook || "unknown"}`,
    `- derived life context: ${shortList(field.derivedLifeContext, 5) || "field-derived life context unavailable"}`,
    `- derived visual context: ${shortList(field.derivedVisualContext, 6) || "field-derived visual context unavailable"}`,
    `- derived garment logic: ${shortList(field.derivedGarmentLogic, 6) || "field-derived garment logic unavailable"}`,
    `- desire exposure influence: exposure=${desire.exposureLevel || "unknown"}, tightness=${desire.tightnessLevel || "unknown"}, bodyDisplay=${desire.bodyDisplayLevel || "unknown"}, outerwear=${desire.outerwearOpenness || "unknown"}, skin=${shortList(desire.allowedSkinAreas, 5) || "unknown"}, sensuality=${desire.sensualityLevel || "unknown"}`,
    `- derived influence summary: ${listValues(Object.values(influences.derivedInfluences || {}).slice(0, 8)) || "influence-derived clothing direction"}`,
    `- composition idea: ${skeleton.compositionLayer?.promptFragment || "motifs become garment panels, seams, pockets, guards, and restrained accents"}`,
    `- sourceMotifs: ${shortList(getMotifs(skeleton), 3) || "unknown"}`,
    `- outfit summary: ${listValues([skeleton.topModule?.promptFragment, skeleton.outerwearModule?.promptFragment]) || "white fitted innerwear anchor with simple readable outer layer"}`,
    `- bottom / sock: ${bottomSockSummary(skeleton) || "bottom and sock visibility follow bottomModule"}`,
    `- candidate quality: passed=${quality.passed}, appeal=${quality.appealScore}, novelty=${quality.noveltyScore}, coherence=${quality.coherenceScore}, visualPotential=${quality.visualPotentialScore}, fieldDerivationQuality=${quality.fieldDerivationQuality}, regressionSimilarityPenalty=${quality.regressionSimilarityPenalty || 0}`,
    `- test purpose: verify one lightweight 2.0 image-test prompt pack using current influences, reasonabilityFilter, compositionLayer, white fitted innerwear anchor, broad thick adult male body preference, and restrained large-shape design.`,
  ].join("\n");
}

function buildPromptPack(testId, chinesePrompt, englishPrompt) {
  return [
    `# ${testId} - Generate Test Prompt Pack`,
    "",
    "## Test Purpose",
    "Test whether the current 2.0 workflow can produce one original broad thick adult male full-body character prompt with white fitted innerwear anchor, coherent outfit structure, readable motif-to-garment translation, restrained fantasy, and clean TV anime cel shading.",
    "",
    "## Chinese Prompt",
    chinesePrompt,
    "",
    "## English Prompt",
    englishPrompt,
    "",
    "## Negative Prompt",
    negativePrompt,
    "",
    "## Reference Image Usage Note",
    referenceImageUsageNote,
    "",
    "## Observation Checklist",
    ...observationChecklist.map((item) => `- ${item}`),
  ].join("\n");
}

function buildImageGenerationStep(testId, skeleton) {
  const motifs = getMotifs(skeleton).slice(0, 2).join(" / ") || "core motifs";
  const bottom = bottomSockSummary(skeleton) || "bottom/sock logic";
  return [
    "## Step 10. Run Image Generation",
    "",
    `- testId: ${testId}`,
    "- Use English Prompt: above",
    "- Use Negative Prompt: above",
    `- Use reference image: ${absoluteReferenceImagePath}`,
    `- Project relative reference image path: ${referenceImagePath}`,
    "- Reference image rule: Use it only for body style, broad thick adult male proportions, clean TV anime cel-shaded style, and white fitted innerwear body-anchor direction.",
    "- Do not copy the reference image character identity, face, hairstyle, clothing, pose, colors, props, or background.",
    "- Main test focus:",
    "  - single full-body adult male, complete head-to-toe framing",
    "  - broad thick mature body with visible white fitted inner top",
    `  - motif-to-garment structure from ${motifs}, not stickers or badges`,
    `  - bottom / sock logic: ${bottom}`,
    "  - clean TV anime cel shading with no text/logo/UI/multiple characters/cropping",
    "",
    "Image Generation Unavailable:",
    "当前 Codex 环境只能生成 prompt pack，不能直接调用图像生成工具。请使用以下 reference image path 和 English Prompt 进行图像生成。",
    "",
    "Reference image path:",
    absoluteReferenceImagePath,
  ].join("\n");
}

function buildPassedCandidate(index, options = {}) {
  const mode = options.mode || defaultMode;
  const usedThemeCategories = options.usedThemeCategories || new Set();
  const designLanguagePath = fs.existsSync(path.resolve(__dirname, "../config/design-language.json"))
    ? path.resolve(__dirname, "../config/design-language.json")
    : defaultDesignLanguagePath;
  let fallback = null;
  let rejectedRegressionCount = 0;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const seed = `generate-test-${Date.now()}-${index}-${attempt}`;
    const skeleton = buildCharacterSkeleton({
      seed,
      cultureLevel: 2,
      culturalInfluenceLevel: 1,
      designLanguagePath,
      useFieldInfluenceExpansion: true,
    });
    const quality = candidateQualityFilter(skeleton, { mode, usedThemeCategories });
    if (!quality.passed && quality.rejectReason === "旧 regression case，不用于默认生成测试") {
      rejectedRegressionCount += 1;
      continue;
    }
    if (!fallback) fallback = { skeleton, quality };
    if (quality.passed) {
      skeleton.generateTest = {
        presetPath: "experiments/prompt-compiler/GENERATE_TEST_PRESET.md",
        seed,
        mode,
        candidateQualityFilter: quality,
        referenceImagePath,
        absoluteReferenceImagePath,
        rejectedRegressionCount,
      };
      return { skeleton, quality };
    }
  }
  if (fallback) {
    fallback.skeleton.generateTest = {
      presetPath: "experiments/prompt-compiler/GENERATE_TEST_PRESET.md",
      seed: fallback.skeleton.seed,
      mode,
      warning: "No passed candidate after retries; returning the best non-regression candidate without falling back to old regression cases.",
      candidateQualityFilter: fallback.quality,
      referenceImagePath,
      absoluteReferenceImagePath,
      rejectedRegressionCount,
    };
    return fallback;
  }
  throw new Error("Unable to build a non-regression candidate for exploration mode.");
}

function buildSavedFilesSection() {
  return [
    "## Saved Files",
    "",
    "- latest-generate-test-prompt-pack.md",
    "- latest-generate-test-summary.md",
    "- latest-generate-test-skeleton.json",
  ].join("\n");
}

function buildChatReadyOutput(tests) {
  return tests
    .map((test, index) => [
      `# 生成测试 ${String(index + 1).padStart(2, "0")}`,
      "",
      test.caseSummary,
      "",
      "## Chinese Prompt",
      "",
      test.chinesePrompt,
      "",
      "## English Prompt",
      "",
      test.englishPrompt,
      "",
      "## Negative Prompt",
      "",
      negativePrompt,
      "",
      "## Reference Image Usage Note",
      "",
      referenceImageUsageNote,
      "",
      "## Observation Checklist",
      "",
      ...observationChecklist.map((item) => `- ${item}`),
      "",
      test.imageGenerationStep,
      "",
      buildSavedFilesSection(),
    ].join("\n"))
    .join("\n\n");
}

function main() {
  const args = process.argv.slice(2);
  const count = parseCount(args);
  const mode = parseMode(args);
  ensureDir(outputDir);
  const preset = fs.readFileSync(presetPath, "utf8");
  const tests = [];
  const usedThemeCategories = new Set();

  for (let i = 0; i < count; i += 1) {
    const testId = `Test ${String(i + 1).padStart(2, "0")}`;
    const { skeleton, quality } = buildPassedCandidate(i + 1, { mode, usedThemeCategories });
    usedThemeCategories.add(skeleton.themeDirectionLayer?.themeCategory || "");
    const compiled = compileFinalPrompt(skeleton, { mode: "imageFinal" });
    const imageFinal = extractImageFinal(compiled);
    const chinesePrompt = buildChinesePrompt(skeleton, imageFinal);
    const englishPrompt = buildEnglishPrompt(skeleton);
    const caseSummary = buildCaseSummary(testId, skeleton, quality);
    const promptPack = buildPromptPack(testId, chinesePrompt, englishPrompt);
    const imageGenerationStep = buildImageGenerationStep(testId, skeleton);
    tests.push({ testId, skeleton, caseSummary, promptPack, imageGenerationStep, chinesePrompt, englishPrompt });

    if (count > 1) {
      const prefix = `generate-test-${String(i + 1).padStart(2, "0")}`;
      writeText(path.join(outputDir, `${prefix}-prompt-pack.md`), promptPack);
    }
  }

  const summary = [
    "# Latest Generate Test Summary",
    "",
    `Preset: experiments/prompt-compiler/GENERATE_TEST_PRESET.md`,
    `Mode: ${mode}`,
    `Default reference image: ${absoluteReferenceImagePath}`,
    `Default reference image project path: ${referenceImagePath}`,
    `Count: ${count}`,
    "",
    ...tests.flatMap((test) => [test.caseSummary, "", test.imageGenerationStep, ""]),
  ].join("\n");

  const promptPackOutput = tests
    .flatMap((test) => [count > 1 ? `# ${test.testId}` : "", test.promptPack, "", test.imageGenerationStep])
    .filter(Boolean)
    .join("\n\n");

  const skeletonOutput = {
    presetExcerpt: preset.split("\n").slice(0, 24).join("\n"),
    mode,
    regressionThemeBlacklistForExploration,
    count,
    referenceImagePath,
    absoluteReferenceImagePath,
    tests: tests.map((test) => ({
      testId: test.testId,
      skeleton: test.skeleton,
    })),
  };

  writeText(path.join(outputDir, "latest-generate-test-summary.md"), summary);
  writeText(path.join(outputDir, "latest-generate-test-prompt-pack.md"), promptPackOutput);
  writeJson(path.join(outputDir, "latest-generate-test-skeleton.json"), skeletonOutput);

  console.log(buildChatReadyOutput(tests));
}

if (require.main === module) main();

module.exports = {
  candidateQualityFilter,
  buildEnglishPrompt,
  buildPromptPack,
  buildChatReadyOutput,
  buildImageGenerationStep,
  regressionThemeBlacklistForExploration,
};
