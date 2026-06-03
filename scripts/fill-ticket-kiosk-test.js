const fs = require("fs");
const crypto = require("crypto");

const dataPath = "data/characters.json";
const characterId = process.argv[2];
if (!characterId) throw new Error("Usage: node scripts/fill-ticket-kiosk-test.js <characterId>");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const character = data.characters.find((item) => item.id === characterId);
if (!character) throw new Error(`Character not found: ${characterId}`);

const now = new Date().toISOString();

const sections = [
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
  "assets",
  "generationProfile",
];
for (const key of sections) character[key] ||= {};

Object.assign(character.coreIdentity, {
  name: "钟砚临",
  codename: "错币钟",
  faction: "北城换乘局",
  birthday: "10月17日",
  age: "36",
  height: "190cm",
  weight: "118kg",
  occupation: "地铁售票机巡检员",
  affiliation: "北城换乘局夜班设备科",
  species: "人类",
  heritage: "东亚纯血",
});

Object.assign(character.visualIdentity, {
  visualKeywords: "厚实体格、硬币匣、站务短袖、低光刻度",
  colorLanguage: "白色上衣、暖灰制服、黑橄榄裤、暗红票线、旧金属点缀",
  faceShape: "宽下颌方脸",
  expression: "明亮保护性表情，露齿短笑像正要提醒乘客，眉毛微抬且眼神警觉",
  eyes: "深棕小眼，眼尾有笑线但视线很稳",
  eyeColor: "深棕色",
  eyebrow: "浓黑平眉，左眉略抬",
  lip: "厚唇，露齿短笑口型",
  scar: "右耳下方一小道旧检修划痕",
  tattoo: "无纹身，仅腕带下有浅色票纹印记",
  hairStyle: "短寸侧分，发顶稍硬",
  hairLength: "短发",
  hairColor: "黑褐色",
  highlight: "暗红棕细挑染",
  facialHair: "修整短络腮胡",
  bodyType: "非常厚实的成年壮汉，圆润压重的力量感",
  muscleLevel: "极宽肩、厚胸、粗脖、巨大上臂和前臂、强壮大腿",
  bodyFat: "结实带厚度，非瘦削",
  shoulderWidth: "极宽肩",
  skinTone: "暖麦色",
  muscleFocus: "胸肩、前臂和大腿体量最突出",
});

Object.assign(character.costumeSystem, {
  outerwear: "暖灰短袖站务衬衫，开襟穿在贴身白上衣外，袖口卷起露出厚前臂",
  outerwearColor: "暖灰色，暗红细票线滚边",
  innerwear: "干净白色贴身厚棉短袖上衣，扎进腰部结构，胸肩被清楚撑开",
  innerwearColor: "干净白色",
  pants: "黑橄榄高腰锥形站务裤，膝侧有扁平检修袋",
  pantsColor: "黑橄榄色",
  socks: "短白袜",
  socksColor: "白色",
  shoes: "宽头黑灰防滑站务鞋",
  shoesColor: "黑灰色",
  gloves: "一只深灰检修手套，另一手缠白色腕带",
  glovesColor: "深灰与白色",
  necklace: "贴近领口的小旧票夹坠",
  necklaceColor: "旧银色",
  belt: "窄黑腰带连接斜挎硬币匣和票据扫描器",
  beltColor: "黑色与旧金属扣",
  signatureItem: "透明盖板硬币匣，里面的错币会排成路线预兆",
  signatureItemColor: "旧金属银、暗红刻度、少量暖金低光",
});

Object.assign(character.personality, {
  corePersonality: "热心、谨慎、健谈、守规矩",
  strengths: "记忆站点细节，能安抚焦躁乘客",
  weaknesses: "太容易替陌生人承担风险",
  hiddenPersonality: "私下喜欢把每天的异常车票按声音排序",
  emotionalStability: "稳定，压力下会先开口指挥",
  confidenceLevel: "中高，自信但不炫耀",
  outwardPersona: "像随时能帮忙的夜班大哥",
  trueCore: "把迷路的人带回正确出口",
  surfaceFear: "售票大厅突然断电",
  deepFear: "自己错过一次能提前阻止的事故",
  traumaTrigger: "硬币连续卡住三次的声音",
  stressResponse: "先笑一下稳住人群，然后快速分配行动",
  trauma: "学徒期曾因误判找零故障导致人群踩踏惊险失控",
  traumaSource: "旧站台闸机事故",
  recoveryStatus: "已经恢复工作，但保留过度巡检习惯",
  traumaImpact: "对小故障极敏感，不愿让异常被当成小事",
});

Object.assign(character.behaviorSystem, {
  thinkingAction: "拇指摩挲票夹边缘",
  irritatedAction: "把硬币匣扣得更紧",
  nervousAction: "快速确认出口指示牌",
  relaxedAction: "靠着售票机低声哼报站旋律",
  lyingAction: "会先看向最近的闸机灯",
  shyAction: "摸后颈并把笑声压低",
  speechSpeed: "偏快但吐字清楚",
  speechTone: "温和明亮，带站务广播感",
  catchphrase: "别急，下一枚硬币会指路。",
  battleLine: "退到黄线后面，我来关掉这台机器。",
  walkStyle: "步幅大，肩背稳，像在巡站",
  combatStance: "半侧身护人，硬币匣挡在前臂旁",
  idleAction: "掂一枚错币听回声",
  attackRhythm: "先警告，再用硬币匣短促压制",
});

Object.assign(character.lifestyle, {
  favoriteFood: "热豆浆和葱油饼",
  hatedFood: "太甜的罐装咖啡",
  hiddenFavorite: "收集老式单程票",
  appetite: "饭量很大，夜班后会加餐",
  alcoholTolerance: "中等，值班前绝不喝",
  cookingSkill: "会做简单夜宵",
  roomStyle: "整齐小单间，墙上贴线路图",
  neatness: "很整洁，零钱盒按年份分格",
  collections: "旧票根、废弃站牌螺丝、异常硬币",
  pets: "无宠物，常喂站外流浪猫",
});

Object.assign(character.socialSystem, {
  socialAbility: "高，擅长处理乘客争执",
  lyingAbility: "中等，不擅长恶意隐瞒",
  boundarySense: "强，会把危险区域挡得很明确",
  popularity: "在夜班乘客和同事中口碑好",
  romanceExperience: "有过一段稳定关系，因夜班错过太多约会分开",
  preferredType: "能理解他责任感的人",
  expressionStyle: "先说笑缓冲，再给清楚指令",
  possessiveness: "低到中，保护欲强但尊重边界",
});

Object.assign(character.combatSystem, {
  combatType: "防护控制型",
  coreStyle: "用硬币匣、扫描器和站务栏杆制造短距离阻挡",
  weaponPreference: "加固硬币匣与短柄检修扳手",
  specialAbility: "能从错币落下的节奏判断下一处危险出口",
  painTolerance: "高",
  aggression: "中低，以保护和疏散优先",
  stamina: "高，能连续巡站",
  burstPower: "高，短距离冲撞和拉拽很强",
  pressure: "高，人群混乱时仍能下指令",
  reactionSpeed: "中高，对设备声响反应极快",
});

Object.assign(character.worldSetting, {
  origin: "北城二号线老换乘站",
  socialClass: "普通市民阶层，稳定工薪",
  education: "市政设备专科学校",
  criminalRecord: "无犯罪记录",
  organizationRank: "夜班设备科资深巡检员",
  enemyForces: "盗取闸机余票能量的灰票商会",
  biggestRegret: "学徒期没有及时喊停故障闸机",
  biggestGoal: "把所有夜间迷路乘客安全送到出口",
  hiddenDream: "开一家只卖旧车票纪念品的小店",
  mostImportantPerson: "退休的第一任师傅何叔",
  unforgettableExperience: "在断电大厅里靠硬币声找到被困儿童",
  lifeStain: "曾把一次灵异错币事件上报成普通机械故障",
});

Object.assign(character.hiddenInformation, {
  shameSecret: "他偷偷保留了事故当天的卡币",
  hiddenHobby: "给废票写很短的失物招领故事",
  weakness: "听到儿童哭声会立刻分心",
  secretHabit: "每次巡检前摸三下票夹坠",
  contrastSide: "看起来健谈，独处时却非常安静",
  foodAllergy: "对芒果轻微过敏",
});

Object.assign(character.numericalAttributes, {
  wealth: 42,
  morality: 82,
  sanity: 74,
  confidence: 68,
  stress: 58,
  danger: 63,
  desire: 36,
  loyalty: 86,
  stability: 76,
  social: 72,
  doom: 44,
  violence: 41,
});

Object.assign(character.metaDesign, {
  characterHook: "一个能从错币落下的节奏里听出危险出口的地铁售票机巡检员，总在乘客迷路前先一步站到岔口。",
  characterImagePromptCn:
    "只画一个角色：钟砚临，36岁男性，北城换乘局夜班地铁售票机巡检员。非常厚实的成年壮汉，极宽肩、厚胸、粗脖、巨大上臂和前臂、强壮大腿，暖麦色皮肤，宽下颌方脸，修整短络腮胡，右耳下方小检修划痕，黑褐短寸侧分发，少量暗红棕挑染，深棕小眼。表情是明亮保护性：露齿短笑像正要提醒乘客，左眉微抬，眼神警觉。服装：暖灰短袖站务衬衫开襟穿在干净白色贴身厚棉短袖上衣外，白上衣扎进腰部并清楚撑出胸肩体量；黑橄榄高腰锥形站务裤，扁平检修袋；宽头黑灰防滑站务鞋，短白袜；一只深灰检修手套，另一手缠白色腕带；窄黑腰带连接斜挎硬币匣和票据扫描器，小旧票夹坠贴近领口。标志道具：透明盖板硬币匣和短柄检修扳手；奇幻锚点只在错币、票夹坠、扫描器刻度上出现少量暖金低光符号，克制、干净、不要强光环。画风必须参考已上传风格图的体型语言、线条、赛璐璐上色和干净阴影，但不要复制参考图的脸、衣服、姿势、颜色或身份。干净动漫游戏角色概念立绘，清晰线条，简单赛璐璐肌肉和衣褶阴影，不要写实布料纹理，不要照片感，不要油亮皮革，不要湿身，不要灰尘油污。单人全身，从头到鞋完整可见，居中，留足边距。背景必须是纯 #00ff00 平面绿幕，单一颜色，无渐变、无纹理、无地面、无阴影、无反射、无场景。禁止 UI、信息图、图表、角色设定表、文字、字母、标签、图标、面板、多人物、水印。角色身上不要使用 #00ff00 或相近绿色。",
  characterImagePrompt:
    "Use case: stylized-concept. Asset type: full-body character cutout source. Create exactly ONE full-body clean anime cel-shaded character illustration of Yanlin Zhong, a 36-year-old male subway ticket-machine inspector from the North City Transfer Bureau night equipment team. He is an enormous thick-built adult man with extremely broad shoulders, thick chest, thick neck, massive upper arms and forearms, strong thighs, warm wheat skin, a broad square-jawed face, neat short boxed beard, a small maintenance scratch below the right ear, short black-brown side-parted crew cut hair with subtle dark red-brown highlights, and small deep-brown eyes. Expression: bright protective expression, short toothy smile as if warning a passenger, left brow slightly raised, eyes alert. Outfit: a warm-gray short-sleeve station-service shirt worn open over a clean white fitted heavy-cotton short-sleeve top tucked into the waist, the white top visibly stretched over chest and shoulders; black-olive high-waist tapered station trousers with flat maintenance pockets; wide-toe black-gray anti-slip station shoes, short white socks; one dark-gray maintenance glove, the other hand wrapped with white wrist tape; a narrow black belt connected to a diagonal coin cassette and a ticket scanner; a small old ticket-clip pendant close to the collar. Signature props: a transparent-lid coin cassette and a short maintenance wrench. Fantasy anchor: only a few restrained warm-gold low-glow symbols on the misprinted coins, ticket-clip pendant, and scanner scale; compact and tidy, no strong aura. Use the uploaded style reference only for drawing language: bulky adult male body proportion, clean linework, cel-shaded coloring, and simple readable shadows. Do not copy the reference character identity, face, clothing, pose, props, colors, or background. Style: clean anime game character concept art, crisp outline, simplified cel-shaded muscles and folds, no photoreal fabric grain, no photo realism, no glossy leather, no wet material, no dust, no grime, no oil stains. Composition: single standing character, centered, full body visible from head to shoes, generous padding, no cropping. Background: perfectly flat solid #00ff00 chroma-key background only, one uniform green color, no gradients, no texture, no floor, no shadow, no reflection, no scenery. Absolute bans: no UI, no infographic, no chart, no diagram, no character sheet, no text, no letters, no labels, no icons, no panels, no multiple characters, no unrelated objects as the main subject, no watermark. Do not use #00ff00 or similar green anywhere on the character.",
});

character.assets.fullBody ||= "./assets/character-placeholder.png";
character.assets.thumbnail ||= "./assets/character-placeholder.png";
character.activeMarks = { attributes: true, images: true };
character.agentMarks = (character.agentMarks || []).filter((mark) => typeof mark === "object" && mark);
for (const mark of ["[GENERATE_ATTRIBUTES]", "[GENERATE_IMAGES]"]) {
  character.agentMarks.push({ id: crypto.randomUUID(), mark, createdAt: now });
}
character.generationProfile.notes =
  "端到端测试角色：两个生成标记均已打开。属性阶段先完成全部模块，通过完整性检查后再进入图像生成。";
character.updatedAt = now;
data.savedAt = now;

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`${character.coreIdentity.name} (${character.id})`);
console.log(`Planned asset: ./assets/characters/generated-fullbody-${character.id.slice(0, 8)}.png`);
