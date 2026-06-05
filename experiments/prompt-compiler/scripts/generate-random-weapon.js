const fs = require("fs");
const path = require("path");

const defaultLibraryPath = path.resolve(__dirname, "../libraries/weapon-samples.json");
const defaultOutputPath = path.resolve(__dirname, "../output/latest-weapon-ai-brief.md");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (const char of String(seed || Date.now())) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = hashSeed(seed);
  return function rng() {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

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

function optionValue(args, name) {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = args.indexOf(`--${name}`);
  if (index >= 0) return args[index + 1];
  return "";
}

function findByName(items, name, key = "name") {
  if (!name) return null;
  return items.find((item) => item[key] === name) || null;
}

function buildWeaponName(profile, rng) {
  return `${pick(profile.nameHeads, rng)}${pick(profile.nameTails, rng)}`;
}

function jointTermOf(headTerm) {
  return headTerm.includes("连接处") ? headTerm : `${headTerm}连接处`;
}

function buildModule(library, rng, options = {}) {
  const archetype = findByName(library.archetypes, options.archetype) || pick(library.archetypes, rng);
  const profile = findByName(library.roleProfiles, options.role, "role") || pick(library.roleProfiles, rng);
  const visualInfluences = pickMany(profile.visualInfluences, Math.min(4, profile.visualInfluences.length), rng);

  const ornamentA = pick(profile.ornaments, rng);
  const ornamentB = pick(profile.ornaments.filter((item) => item !== ornamentA), rng) || ornamentA;
  const materialA = pick(profile.handleMaterials || profile.materials, rng);
  const materialB = pick(profile.gripMaterials || profile.materials, rng);
  const materialC = pick(profile.headMaterials || profile.materials, rng);
  const headTerm = pick(archetype.headTerms, rng);
  const mainShape = pick(archetype.mainShapes, rng);
  const combatFunction = pick(archetype.functions, rng);
  const surfaceDetail = pick(library.surfaceDetails, rng);
  const constructionVerbs = pickMany(library.constructionVerbs || [], 5, rng);
  const weaponName = buildWeaponName(profile, rng);
  const jointTerm = jointTermOf(headTerm);

  return {
    archetype: archetype.name,
    roleInfluence: profile.role,
    visualInfluences,
    composition: {
      mainShape,
      handle: `${materialA} / ${materialB}`,
      headOrCore: `${materialC} / ${headTerm} / ${surfaceDetail}`,
      secondaryParts: [ornamentA, ornamentB],
      silhouette: `${archetype.name}轮廓清楚，${profile.role}影响只体现在结构、材质和装饰上`,
    },
    material: {
      primary: materialC,
      secondary: `${materialA}、${materialB}`,
      finish: `${headTerm}表面保持干净可读，并带有${surfaceDetail}`,
      wearState: "整洁、有使用痕迹但不脏乱",
    },
    combatFunction,
    weaponName,
    selectedParts: {
      ornamentA,
      ornamentB,
      handleMaterial: materialA,
      gripMaterial: materialB,
      headMaterial: materialC,
      headTerm,
      jointTerm,
      surfaceDetail,
      constructionVerbs,
    },
    bans: profile.avoid,
  };
}

function printUsage() {
  console.log("Usage:");
  console.log("node experiments/prompt-compiler/scripts/generate-random-weapon.js [--seed test-1] [--role 花匠] [--archetype 斧头]");
  console.log("");
  console.log("The command writes an AI brief for Codex to:");
  console.log("experiments/prompt-compiler/output/latest-weapon-ai-brief.md");
}

function formatAiBrief(module, seed) {
  const parts = module.selectedParts;
  return [
    "# 武器模块 AI 发挥测试 Brief",
    "",
    "请你根据下面的结构化武器模块进行创作。这个测试的目标是观察 AI 遇到随机组合和自然语言要求时，会如何理解、推导并编译最终生图提示词。",
    "",
    "重要要求：",
    "- 不要照抄样本句式。",
    "- 不要直接把字段机械拼接成一句话。",
    "- 先用自然语言解释你的设计推导，再把推导压缩成可用于生图的最终提示词。",
    "- 武器名只作为设定味道，不要让最终提示词只依赖武器名。",
    "- 最终提示词必须描述具体可画的实体武器结构、材料和装饰。",
    "- 最终提示词不要出现解释、规则、括号说明、UI、文字标签或抽象概念。",
    "- 如果有绿色、植物、荧光绿等元素，需要提醒它可能和 #00ff00 色键背景冲突。",
    "- 不要默认使用“X 缠绕在 Y 上 / X 缠绕整个 Y”的句式；除非真的必要，缠绕最多出现一次。",
    "- 优先尝试结构动作词里的嵌入、铆接、悬挂、扣合、压印、外露、折叠、镶边等关系。",
    "",
    "最终提示词压缩规则：",
    "- 最终提示词只写武器本体，不写角色、动作、背景、画风、镜头、构图或世界观。",
    "- 最终提示词最多 1 句话，中文建议 60-120 字，绝对不要超过 140 个中文字。",
    "- 最终提示词只保留 4-6 个视觉要点：武器原型、主轮廓、握柄、头部/核心、1-2 个装饰焦点、关键材质。",
    "- 舍弃推导里的解释、功能说明、重复材质、过多形容词和次要小零件。",
    "- 如果信息太多，优先保留能一眼画出来的大形状和主视觉焦点。",
    "",
    `武器名：${module.weaponName}`,
    `原型：${module.archetype}`,
    `影响源：${[module.roleInfluence, ...(module.visualInfluences || [])].join(" / ")}`,
    `随机种子：${seed}`,
    "",
    "结构提示：",
    `- 主体形状：${module.composition.mainShape}`,
    `- 柄/握把素材：${parts.handleMaterial} / ${parts.gripMaterial}`,
    `- 头部/核心素材：${parts.headMaterial} / ${parts.headTerm}`,
    `- 轮廓要求：${module.composition.silhouette}`,
    `- 装饰 A：${parts.ornamentA}`,
    `- 装饰 B：${parts.ornamentB}`,
    `- 连接位置：${parts.jointTerm}`,
    `- 表面细节：${parts.surfaceDetail}`,
    `- 可参考结构动作：${parts.constructionVerbs.join(" / ")}`,
    `- 战斗功能：${module.combatFunction}`,
    `- 避免项：${(module.bans || []).join("；")}`,
    "",
    "请严格按下面格式返回：",
    "",
    "武器名：",
    "原型：",
    "影响源：",
    "",
    "AI推导：",
    "",
    "视觉要点：",
    "- ",
    "- ",
    "- ",
    "- ",
    "",
    "最终提示词：",
    "",
    "检查提醒：",
  ].join("\n");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    printUsage();
    return;
  }

  const seed = optionValue(args, "seed") || `${Date.now()}`;
  const libraryPath = path.resolve(process.cwd(), optionValue(args, "library") || defaultLibraryPath);
  const library = readJson(libraryPath);
  const module = buildModule(library, createRng(seed), {
    role: optionValue(args, "role"),
    archetype: optionValue(args, "archetype"),
  });

  const outputPath = path.resolve(process.cwd(), optionValue(args, "output") || defaultOutputPath);
  const brief = formatAiBrief(module, seed);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${brief}\n`, "utf8");

  console.log("已生成武器模块 AI 发挥测试 Brief。");
  console.log("");
  console.log(`武器名：${module.weaponName}`);
  console.log(`原型：${module.archetype}`);
  console.log(`影响源：${[module.roleInfluence, ...(module.visualInfluences || [])].join(" / ")}`);
  console.log(`随机种子：${seed}`);
  console.log("");
  console.log(`Brief 文件：${path.relative(process.cwd(), outputPath)}`);
  console.log("");
  console.log("下一步在新会话运行：");
  console.log(`cat ${path.relative(process.cwd(), outputPath)}`);
}

if (require.main === module) main();

module.exports = {
  buildModule,
  createRng,
  formatAiBrief,
};
