const fs = require("fs");
const path = require("path");

const abstractTerms = [
  "规则",
  "法则",
  "边界",
  "命运",
  "概念",
  "权限",
  "流程",
  "回路",
  "归处",
];

const physicalTerms = [
  "斧",
  "锤",
  "枪",
  "剑",
  "刀",
  "盾",
  "弓",
  "杖",
  "伞",
  "剪",
  "钩",
  "鞭",
  "棍",
  "刃",
  "锚",
  "槌",
];

const greenRiskTerms = ["绿色", "绿光", "荧光绿", "藤蔓", "叶片", "植物", "草", "苔", "薄荷", "#00ff00"];

const directToolRisks = new Map([
  ["花匠", ["园艺剪", "花束", "普通剪刀"]],
  ["档案", ["书本", "文件夹", "普通印章"]],
  ["厨师", ["菜刀", "锅铲", "普通锅"]],
  ["焊工", ["焊枪", "普通撬棍"]],
  ["检修", ["扳手", "普通工具"]],
]);

function readModule(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function textOf(module) {
  return [
    module.archetype,
    module.roleInfluence,
    ...(module.visualInfluences || []),
    module.composition?.mainShape,
    module.composition?.handle,
    module.composition?.headOrCore,
    ...(module.composition?.secondaryParts || []),
    module.composition?.silhouette,
    module.material?.primary,
    module.material?.secondary,
    module.material?.finish,
    module.material?.wearState,
    module.combatFunction,
    module.weaponName,
    module.imagePromptBreakdown,
    ...(module.bans || []),
  ]
    .filter(Boolean)
    .join(" ");
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function validateRequired(module) {
  const missing = [];
  for (const key of ["archetype", "roleInfluence", "visualInfluences", "composition", "material", "combatFunction", "weaponName", "imagePromptBreakdown"]) {
    if (!module[key] || (Array.isArray(module[key]) && !module[key].length)) missing.push(key);
  }
  for (const key of ["mainShape", "handle", "headOrCore", "secondaryParts", "silhouette"]) {
    const value = module.composition?.[key];
    if (!value || (Array.isArray(value) && !value.length)) missing.push(`composition.${key}`);
  }
  for (const key of ["primary", "secondary", "finish", "wearState"]) {
    if (!module.material?.[key]) missing.push(`material.${key}`);
  }
  return missing;
}

function runChecks(module) {
  const checks = [];
  const allText = textOf(module);
  const promptText = module.imagePromptBreakdown || "";

  const missing = validateRequired(module);
  checks.push({
    level: missing.length ? "FAIL" : "PASS",
    message: missing.length ? `missing required fields: ${missing.join(", ")}` : "required fields present",
  });

  checks.push({
    level: hasAny(`${module.archetype} ${promptText}`, physicalTerms) ? "PASS" : "FAIL",
    message: "physical weapon archetype is readable",
  });

  const abstractOnly = hasAny(module.weaponName || "", abstractTerms) && !hasAny(promptText, physicalTerms);
  checks.push({
    level: abstractOnly ? "FAIL" : "PASS",
    message: "weapon name is not abstract-only, or prompt grounds it as a physical object",
  });

  checks.push({
    level: promptText.length >= 60 ? "PASS" : "FAIL",
    message: "imagePromptBreakdown is detailed enough for drawing",
  });

  let directRisk = "";
  for (const [role, riskyTerms] of directToolRisks.entries()) {
    if (String(module.roleInfluence || "").includes(role) && hasAny(promptText, riskyTerms)) {
      directRisk = `${role}: ${riskyTerms.filter((term) => promptText.includes(term)).join(", ")}`;
      break;
    }
  }
  checks.push({
    level: directRisk ? "WARN" : "PASS",
    message: directRisk ? `possible direct occupation-tool copy (${directRisk})` : "role influence is not only a direct job-tool copy",
  });

  checks.push({
    level: hasAny(allText, greenRiskTerms) ? "WARN" : "PASS",
    message: hasAny(allText, greenRiskTerms) ? "green/chroma-key risk found; avoid green on weapon or use another key color" : "no obvious green chroma-key conflict",
  });

  const textRisk = hasAny(promptText, ["文字", "标签", "UI"]);
  checks.push({
    level: textRisk ? "WARN" : "PASS",
    message: textRisk ? "text/UI/label risk found; describe shapes instead of readable words" : "no text/UI/label risk in weapon prompt",
  });

  return checks;
}

function compileGuidance(module) {
  if (module.generationGuidance) return module.generationGuidance;

  return [
    `以${module.archetype}作为武器原型。`,
    `因为角色生活/职业气质接近${module.roleInfluence}，所以这个${module.archetype}会受到${(module.visualInfluences || []).join("、")}影响。`,
    `这些影响被转译为武器结构、材质和装饰，而不是直接画成普通职业工具。`,
    `武器命名为${module.weaponName}，名字只作为设定，不直接替代画面描述。`,
  ].join("");
}

function compileWeaponPrompt(module) {
  return module.imagePromptBreakdown;
}

function printResult(filePath, module, compiledPrompt, checks) {
  console.log(`Generated weapon / 武器名：${module.weaponName}`);
  console.log(`Archetype / 原型：${module.archetype}`);
  console.log(`Influence sources / 影响源：${[module.roleInfluence, ...(module.visualInfluences || [])].join(" / ")}`);
  console.log("");
  console.log("Guidance / 生成引导：");
  console.log(compileGuidance(module));
  console.log("");
  console.log("Final prompt / 最终提示词：");
  console.log(compiledPrompt);
  console.log("");
  console.log("=== 模块摘要 / MODULE SUMMARY ===");
  console.log(`file: ${path.relative(process.cwd(), filePath)}`);
  console.log(`weaponName: ${module.weaponName}`);
  console.log(`archetype: ${module.archetype}`);
  console.log(`roleInfluence: ${module.roleInfluence}`);
  console.log(`visualInfluences: ${(module.visualInfluences || []).join(" / ")}`);
  console.log("");
  console.log("=== 检查结果 / CHECKS ===");
  for (const check of checks) {
    console.log(`${check.level} ${check.message}`);
  }
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node experiments/prompt-compiler/scripts/compile-weapon-module.js <weapon-module.json>");
    process.exit(1);
  }

  const absolute = path.resolve(process.cwd(), filePath);
  const module = readModule(absolute);
  const compiledPrompt = compileWeaponPrompt(module);
  const checks = runChecks(module);
  printResult(absolute, module, compiledPrompt, checks);

  if (checks.some((check) => check.level === "FAIL")) process.exitCode = 2;
}

if (require.main === module) main();

module.exports = {
  compileGuidance,
  compileWeaponPrompt,
  runChecks,
  printResult,
  readModule,
};
