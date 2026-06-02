const fs = require("fs");

const dataPath = "data/characters.json";
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const characterId = process.argv[2];
const character = data.characters.find((item) => item.id === characterId);

if (!character) throw new Error(`Character not found: ${characterId}`);

for (const key of [
  "coreIdentity",
  "visualIdentity",
  "costumeSystem",
  "personality",
  "behaviorSystem",
  "lifestyle",
  "socialSystem",
  "combatSystem",
  "worldSetting",
  "hiddenInformation",
  "numericalAttributes",
  "metaDesign",
]) {
  character[key] ||= {};
}

Object.assign(character.coreIdentity, {
  name: "岚阀司昼",
  codename: "铜哨",
  faction: "南港阀门局",
  birthday: "09/17",
  age: "34",
  height: "188",
  weight: "96 KG",
  occupation: "港区压力阀检修员",
  affiliation: "南港旧管网维护队",
  species: "人类",
});

Object.assign(character.visualIdentity, {
  visualKeywords: "宽肩、窄腰、铜色护具、管网工具、海风感",
  colorLanguage: "深青灰、氧化铜绿、旧铜色、白色警示线",
  faceShape: "长方脸，颧骨硬",
  expression: "平静带笑",
  eyes: "细长上挑眼",
  eyeColor: "浅琥珀",
  eyebrow: "浓直眉",
  lip: "薄唇，嘴角微扬",
  scar: "左下颌一道短疤",
  tattoo: "右前臂有阀门编号纹身",
  hairStyle: "后梳短发，发尾微卷",
  hairLength: "短发",
  hairColor: "深褐黑",
  highlight: "铜棕挑染",
  bodyType: "结实高挑",
  muscleLevel: "中高，线条紧",
  bodyFat: "低",
  shoulderWidth: "宽",
  skinTone: "被海风晒深的暖麦色",
  muscleFocus: "肩背、前臂、腰腹",
});

Object.assign(character.costumeSystem, {
  outerwear: "短款防水工装夹克",
  outerwearColor: "深青灰",
  innerwear: "白色贴身背心",
  innerwearColor: "旧白",
  pants: "高腰耐磨工装裤",
  pantsColor: "炭黑",
  socks: "厚棉短袜",
  socksColor: "灰黑",
  shoes: "防滑港务靴",
  shoesColor: "黑色",
  gloves: "半指检修手套",
  glovesColor: "氧化铜绿",
  necklace: "细链铜哨",
  necklaceColor: "旧铜色",
  belt: "双层工具腰带",
  beltColor: "黑与铜",
  signatureItem: "压力表和阀门扳手",
  signatureItemColor: "铜绿与银灰",
});

Object.assign(character.personality, {
  corePersonality: "松弛可靠",
  strengths: "判断快，能稳场",
  weaknesses: "习惯独自扛事",
  hiddenPersonality: "很会照顾人",
  emotionalStability: "高",
  confidenceLevel: "稳定自信",
  outwardPersona: "像什么都不急的港区师傅",
  trueCore: "怕系统失控，所以总提前准备",
  surfaceFear: "设备突发爆压",
  deepFear: "再次听见管道爆裂声",
  traumaTrigger: "尖锐泄压声",
  stressResponse: "立刻沉默并接管现场",
  trauma: "旧港爆阀事故",
  traumaSource: "一次错误维护指令",
  recoveryStatus: "能工作，但仍警觉",
  traumaImpact: "不轻信口头命令",
});

Object.assign(character.behaviorSystem, {
  thinkingAction: "转动铜哨链",
  irritatedAction: "用指节敲压力表壳",
  nervousAction: "检查扳手卡扣",
  relaxedAction: "靠栏杆吹海风",
  lyingAction: "笑得太轻",
  shyAction: "压低帽檐",
  speechSpeed: "慢中带顿",
  speechTone: "温和沙哑",
  catchphrase: "别急，先听管子怎么说。",
  battleLine: "阀门归我，人往后退。",
  walkStyle: "步子长，重心低",
  combatStance: "侧身护住工具箱",
  idleAction: "拇指擦过铜哨",
  attackRhythm: "等对方失衡后出手",
});

Object.assign(character.lifestyle, {
  favoriteFood: "热辣鱼丸汤",
  hatedFood: "过甜点心",
  hiddenFavorite: "薄荷汽水",
  appetite: "大",
  alcoholTolerance: "中",
  cookingSkill: "会做海边简餐",
  roomStyle: "旧工具、海图、干净工作台",
  neatness: "工具区极整齐，生活区随意",
  collections: "废弃铜阀铭牌",
  pets: "养一只总睡工具箱的黑猫",
});

Object.assign(character.socialSystem, {
  socialAbility: "自然亲切",
  lyingAbility: "一般",
  boundarySense: "强但不冷",
  popularity: "港区人缘好",
  romanceExperience: "有过一段长关系",
  preferredType: "聪明、敢直说的人",
  expressionStyle: "开玩笑和实际帮忙",
  possessiveness: "低，重视自由",
});

Object.assign(character.combatSystem, {
  combatType: "工具反制型",
  coreStyle: "卡位、卸力、短距离压制",
  weaponPreference: "阀门扳手",
  specialAbility: "听声判断压力和结构弱点",
  painTolerance: "中高",
  aggression: "低，防守为主",
  stamina: "高",
  burstPower: "中高",
  pressure: "温和但压迫感强",
  reactionSpeed: "快",
});

Object.assign(character.worldSetting, {
  origin: "南港旧管网区",
  socialClass: "技术工人家庭",
  education: "港务技校",
  criminalRecord: "无",
  organizationRank: "检修小队副负责人",
  enemyForces: "走私改管团伙",
  biggestRegret: "没能阻止师傅接下危险检修",
  biggestGoal: "重建旧港安全管网",
  hiddenDream: "开一间靠海修理铺",
  mostImportantPerson: "已退休的老队长",
  unforgettableExperience: "台风夜独自关停主压力阀",
  lifeStain: "曾篡改记录保护新人",
});

Object.assign(character.hiddenInformation, {
  shameSecret: "怕正式演讲",
  hiddenHobby: "夜里吹口琴",
  weakness: "对求助的人太心软",
  secretHabit: "给每个修好的阀门起绰号",
  contrastSide: "看起来随性，其实记忆力惊人",
  foodAllergy: "轻微贝类过敏",
});

Object.assign(character.numericalAttributes, {
  wealth: 42,
  morality: 76,
  sanity: 68,
  confidence: 73,
  stress: 55,
  danger: 58,
  desire: 46,
  loyalty: 82,
  stability: 77,
  social: 66,
  doom: 28,
  violence: 34,
});

Object.assign(character.metaDesign, {
  characterHook: "一个听得懂旧港管道声音的检修员，总能在事故发生前半拍出现在阀门旁。",
  characterImagePromptCn:
    "只画一个人物：岚阀司昼，34岁男性，港区压力阀检修员。高挑结实，宽肩窄腰，暖麦色皮肤，长方脸，细长浅琥珀眼，平静带笑，后梳短发带铜棕挑染，左下颌短疤。穿深青灰短款防水工装夹克、旧白背心、炭黑高腰工装裤、黑色防滑港务靴、氧化铜绿半指手套，黑铜双层工具腰带，胸前挂细链铜哨。手持旧铜色阀门扳手和小压力表，像可靠但有压迫感的港区技术工人。干净动画游戏立绘，清晰线条，简单赛璐璐上色，单人全身，从头到脚完整可见，留出边距。背景必须是纯 #00ff00 平面绿幕。",
  characterImagePrompt:
    "Use case: stylized-concept. Asset type: full-body character sprite / cutout source. Create exactly ONE full-body anime-style character illustration of Lanfasi Zhou, a 34-year-old harbor pressure-valve repairman. He is a tall, sturdy adult male with broad shoulders, a narrow waist, practical worker muscle, warm wheat skin, a long rectangular face, narrow light-amber eyes, calm slightly smiling expression, slicked-back short dark brown-black hair with copper-brown highlights, and a short scar on his left jaw. Outfit: deep teal-gray short waterproof work jacket, worn white fitted tank top, charcoal high-waist utility pants, black anti-slip harbor boots, oxidized-copper-green fingerless repair gloves, black-and-copper double tool belt, and a thin necklace with an old copper whistle. Props: an old copper valve wrench and a small pressure gauge, clearly reading as harbor pipe-network maintenance tools. Mood: relaxed, reliable, technically sharp, quietly intimidating, like a man who can prevent an industrial accident before anyone else notices. Style: clean anime game character concept art, crisp outline, simple cel shading, strong readable silhouette, cutout-ready asset. Composition: single standing character, centered, full body visible from head to boots, generous padding, no cropping. Background: perfectly flat solid #00ff00 chroma-key background only, one uniform green color, no gradients, no texture, no floor, no shadow, no reflection, no scenery. Absolute bans: no UI, no infographic, no chart, no diagram, no character sheet, no text, no letters, no labels, no icons, no panels, no app screen, no multiple characters, no unrelated objects as the main subject, no watermark. Do not use #00ff00 anywhere on the character.",
});

character.activeMarks = { attributes: true, images: true };
character.agentMarks = character.agentMarks || [];
for (const mark of ["[GENERATE_ATTRIBUTES]", "[GENERATE_PROMPT]"]) {
  character.agentMarks.push({ id: crypto.randomUUID(), mark, createdAt: new Date().toISOString() });
}
character.updatedAt = new Date().toISOString();
data.savedAt = new Date().toISOString();

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Filled ${character.coreIdentity.name} (${character.id})`);
