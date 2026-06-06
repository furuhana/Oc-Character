# 1.0 Generator Structure Inventory

本文档只盘点当前 1.0 人物生成工作台的结构，不修改功能、不新增生成逻辑、不开始 2.0 迁移。

依据来源：

- `index.html`：主页面布局、资源 Tab、生成配置弹窗。
- `app.js`：页面模块、字段 key、默认角色结构、存储与表单绑定。
- `GENERATION_RULES.md`：属性生成、服装、武器、Prompt 的人工/Agent 工作流约束。
- `scripts/generate-name.js`：命名候选随机逻辑。
- `scripts/prepare-image-generation.js`：最终出图读取范围。
- `data/characters.json`：现有角色样本，用于字段示例。

重要结论：1.0 前端没有一个统一的“随机生成所有字段”的函数。字段主要通过手填、导入 JSON、Agent 按规则填写、测试脚本写入、命名候选脚本和最终 Prompt 人工/Agent 编译完成。当前出图脚本只读取最终 Prompt 字段和风格参考图，不会在出图时自动读取身份、服装、人格等零散字段。

## 页面结构

| 页面 / Tab | Key | 用途 |
|---|---|---|
| 身份 | `identity` | 角色基础身份、职业、组织、血统、核心性格、视觉关键词和角色钩子。它是 1.0 最重要的上游信息页。 |
| 特征 | `appearance` | 脸、表情、发型、体型、肤色、疤痕、纹身等可视化基础。主要进入最终 Prompt。 |
| 人格 | `personality` | 性格、优缺点、恐惧、创伤、外在人设和真实内核。主要用于角色合理性、表情、行为和叙事。 |
| 行为 | `behavior` | 习惯动作、说话方式、走路、站姿、攻击节奏。适合作为姿态/动作影响源，但当前不会自动下游。 |
| 服装 | `costume` | 上装、下装、鞋袜、配饰、标志物和颜色。当前是最终 Prompt 的主要人工来源之一。 |
| 生活 | `life` | 食物、居住环境、收藏、宠物、整洁度等生活习惯。当前多为展示和角色厚度。 |
| 社交 | `social` | 社交能力、边界感、人气、恋爱倾向、表达方式。当前多为展示和角色关系逻辑。 |
| 战斗 | `combat` | 战斗原型、武器逻辑、能力、战斗数值倾向。当前强烈影响武器和奇幻锚点的人工生成。 |
| 与世界 | `world` | 出身地、阶层、教育、组织地位、敌对势力、目标、经历。适合作为世界观影响源。 |
| 解锁项 | `unlock` | 秘密、隐藏爱好、弱点、反差面、过敏等隐藏信息。当前多为展示/剧情补充。 |
| 数值 | `stats` | 0-100 数值。部分字段已被命名脚本读取，其他多为展示或人工判断依据。 |
| 提示词 | `prompt` | 中文最终提示词和英文最终提示词。出图脚本只把这里作为角色主体来源。 |

另有非人物字段：

| 区域 | 用途 |
|---|---|
| 资源 Tab：全身、多视图、服装、道具、表情 | 切换展示/上传的资产位，字段存在于 `assets`。 |
| 生成配置弹窗 | 保存起手式正向/负向提示、风格参考图、生成备注、导入导出 JSON。 |
| 样本库弹窗 | 管理命名样本。当前只开放命名样本；职业词库、世界概念、服装词库、能力道具按钮是 disabled。 |
| 开发者模式 | 调整 UI 位置、大小和显示参数，不属于角色生成字段。 |

## 身份 / Core Profile

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 名字 | `coreIdentity.name` | 钟砚泊 | 角色姓名、列表标题 | 命名脚本可生成候选；前端不自动填 | 否，规则要求最终图不写姓名 | 是 | B：迁移到基础档案，不作为视觉影响源 |
| 代号 | `coreIdentity.codename` | 短秒 | 代号/隐藏身份 | 命名脚本可生成候选 | 否 | 是 | C：可保留，不先影响生成 |
| 别名 | `coreIdentity.alias` | 钟师傅 | 数据结构存在，但当前身份页不显示 | 可手填/脚本填 | 否 | 是 | C |
| 阵营 | `coreIdentity.faction` | 旧城钟塔校准所 | 数据结构存在，主要用于列表/头图副标题兜底 | 默认有值，创建时有固定值 | 可选 | 是 | B：可并入 affiliation/organization |
| 生日 | `coreIdentity.birthday` | 1989-09-03 | 基础档案 | 手填/Agent | 否 | 是 | C |
| 年龄 | `coreIdentity.age` | 36 | 年龄视觉与身份约束 | 手填/Agent | 是 | 是 | A：`characterFoundationLayer` |
| 身高 | `coreIdentity.height` | 192 cm | 体量参考 | 手填/Agent | 可选 | 是 | A：`characterFoundationLayer` |
| 体重 | `coreIdentity.weight` | 123 kg | 体量参考 | 手填/Agent | 可选 | 是 | A：`characterFoundationLayer` |
| 职业 | `coreIdentity.occupation` | 城市钟楼秒差校准师 | 身份核心、主题来源 | 手填/Agent；不在前端随机池 | 是 | 是 | A：`influenceSourceLayer.occupationInfluence` |
| 组织 | `coreIdentity.affiliation` | 旧城钟塔校准所 | 社会关系、组织语境 | 手填/Agent | 可选 | 是 | A/B：`influenceSourceLayer.organizationInfluence` |
| 种族 | `coreIdentity.species` | 人类，秒差承载者 | 人类/异常身份 | 手填/Agent | 可选 | 是 | B：基础设定或世界影响源 |
| 国籍血统 | `coreIdentity.heritage` | 中国华北旧城家庭 | 命名、外观概率、地域语境 | 命名脚本读取；Agent 填 | 是 | 是 | A：`regionContext` + `characterFoundationLayer` |
| 性格 | `personality.corePersonality` | 准时、硬朗、护短、嘴碎 | 核心性格入口，也在人格页重复出现 | 手填/Agent | 间接，常影响表情/姿态 | 是 | A：`characterFoundationLayer.personalityCore` |
| 特点 | `visualIdentity.visualKeywords` | 厚重钟楼校准师，白色贴身短袖，铜秒针扳轮 | 视觉摘要/Prompt 来源 | Agent 汇总 | 是，常是 Prompt 主来源之一 | 是 | A：拆到 `themeDirectionLayer` + `Prompt Compiler` |
| 钩子 | `metaDesign.characterHook` | 用铜秒针扳轮把错拍的动作重新压回节奏 | 角色核心卖点 | Agent 汇总 | 是/间接 | 是 | A：`themeDirectionLayer.themeSummary` |

## 特征 / Visual Identity

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 脸型 | `visualIdentity.faceShape` | 宽额方脸，下巴厚 | 脸部结构 | Agent/手填 | 是 | 是 | A：`characterFoundationLayer.face` |
| 表情 | `visualIdentity.expression` | 紧绷专注的开口提醒表情 | 面部情绪和口型 | Agent/手填 | 是 | 是 | A：基础层 + 受 personality 影响 |
| 眼型 | `visualIdentity.eyes` | 深眼窝，目光笔直 | 眼部形状/神态 | Agent/手填 | 是 | 是 | A |
| 瞳色 | `visualIdentity.eyeColor` | 暗金褐 | 颜色细节 | Agent/手填 | 是 | 是 | B |
| 眉毛 | `visualIdentity.eyebrow` | 粗黑浓眉，眉心压紧 | 表情辅助 | Agent/手填 | 是 | 是 | B |
| 嘴型 | `visualIdentity.lip` | 中厚嘴唇，微张报秒口型 | 表情和口型 | Agent/手填 | 是 | 是 | A |
| 疤痕 | `visualIdentity.scar` | 左下巴一道短浅擦伤 | 识别点 | Agent/手填 | 是 | 是 | A/B |
| 纹身 | `visualIdentity.tattoo` | 右小腿外侧一圈细秒格纹 | 识别点/主题纹样 | Agent/手填 | 是 | 是 | A/B：可进 motif |
| 发型 | `visualIdentity.hairStyle` | 短黑发向后梳 | 发型 | Agent/手填 | 是 | 是 | A |
| 发长 | `visualIdentity.hairLength` | 短发 | 发型约束 | Agent/手填 | 是 | 是 | B |
| 发色 | `visualIdentity.hairColor` | 黑色 | 发色 | Agent/手填 | 是 | 是 | A |
| 挑染 | `visualIdentity.highlight` | 暖灰高光 | 发色变化 | Agent/手填 | 可选 | 是 | B |
| 胡子 | `visualIdentity.facialHair` | 短胡茬与干净络腮线 | 男性脸部特征 | Agent/手填 | 是 | 是 | A |
| 体型 | `visualIdentity.bodyType` | 非常厚实魁梧的成年男性 | 体型核心 | Agent/手填 | 是 | 是 | A |
| 肌肉量 | `visualIdentity.muscleLevel` | 极高 | 体量细化 | Agent/手填 | 是 | 是 | A |
| 体脂 | `visualIdentity.bodyFat` | 中等偏低 | 体型风格 | Agent/手填 | 是 | 是 | B |
| 肩宽 | `visualIdentity.shoulderWidth` | 极宽肩，胸背厚重 | 轮廓 | Agent/手填 | 是 | 是 | A |
| 肤色 | `visualIdentity.skinTone` | 暖铜小麦色 | 外观/heritage 相关 | Agent/手填 | 是 | 是 | A：基础层 + regionContext |
| 肌肉焦点 | `visualIdentity.muscleFocus` | 厚胸、粗前臂、强壮大腿 | Prompt 体型强调 | Agent/手填 | 是 | 是 | A |
| 色彩语言 | `visualIdentity.colorLanguage` | 白色上身锚点，蓝黑与雾灰为主 | 数据结构存在，当前特征页不显示 | Agent/脚本可填 | 是/间接 | 是 | A：`designLanguage.palette` |

## 人格 / Personality

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 核心性格 | `personality.corePersonality` | 准时、硬朗、护短、嘴碎 | 性格核心 | Agent/手填 | 间接 | 是 | A |
| 优点 | `personality.strengths` | 节奏感极强 | 行为/叙事支撑 | Agent/手填 | 可选/间接 | 是 | B |
| 缺点 | `personality.weaknesses` | 无法忍受拖延 | 冲突来源 | Agent/手填 | 可选/间接 | 是 | B |
| 隐藏性格 | `personality.hiddenPersonality` | 怕没有钟声的夜晚 | 反差 | Agent/手填 | 否/间接 | 是 | C |
| 情绪稳定 | `personality.emotionalStability` | 中高 | 表情、压力反应参考 | Agent/手填 | 间接 | 是 | B，与数值 `stability` 重复 |
| 自信程度 | `personality.confidenceLevel` | 高 | 表情和姿态参考 | Agent/手填 | 间接 | 是 | B，与数值 `confidence` 重复 |
| 外在表现 | `personality.outwardPersona` | 很严的维修师傅 | 对外人设 | Agent/手填 | 可选/间接 | 是 | B |
| 真实内核 | `personality.trueCore` | 多给别人几秒逃生时间 | 主题动机 | Agent/手填 | 可选/间接 | 是 | B |
| 表层恐惧 | `personality.surfaceFear` | 钟塔停摆 | 剧情冲突 | Agent/手填 | 否/间接 | 是 | C |
| 深层恐惧 | `personality.deepFear` | 多争来的几秒仍不够 | 深层动机 | Agent/手填 | 否/间接 | 是 | C |
| 创伤触发 | `personality.traumaTrigger` | 三个钟同时错拍 | 行为触发 | Agent/手填 | 可选/间接 | 是 | C |
| 应激反应 | `personality.stressResponse` | 先大声报秒 | 行为逻辑 | Agent/手填 | 可选/间接 | 是 | B |
| 创伤 | `personality.trauma` | 钟塔异常停摆 | 背景叙事 | Agent/手填 | 否/间接 | 是 | C |
| 创伤来源 | `personality.traumaSource` | 旧城钟塔秒差灾害 | 世界观连接 | Agent/手填 | 可选/间接 | 是 | C |
| 恢复状态 | `personality.recoveryStatus` | 恢复良好 | 心理状态 | Agent/手填 | 否/间接 | 是 | C |
| 创伤影响 | `personality.traumaImpact` | 强迫式校时习惯 | 行为动机 | Agent/手填 | 可选/间接 | 是 | B |

## 行为 / Behavior

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 思考动作 | `behaviorSystem.thinkingAction` | 拨动腰侧秒差计 | 日常动作 | Agent/手填 | 可选 | 是 | B：姿态影响源 |
| 烦躁动作 | `behaviorSystem.irritatedAction` | 靴跟敲四拍 | 情绪动作 | Agent/手填 | 否/间接 | 是 | B |
| 紧张动作 | `behaviorSystem.nervousAction` | 数三、二、一 | 情绪动作 | Agent/手填 | 否/间接 | 是 | B |
| 放松动作 | `behaviorSystem.relaxedAction` | 擦拭扳轮 | 日常动作 | Agent/手填 | 可选 | 是 | B |
| 说谎动作 | `behaviorSystem.lyingAction` | 报时慢半拍 | 行为细节 | Agent/手填 | 否 | 是 | C |
| 害羞动作 | `behaviorSystem.shyAction` | 摸额发 | 行为细节 | Agent/手填 | 否 | 是 | C |
| 语速 | `behaviorSystem.speechSpeed` | 短促偏快 | 语言风格 | Agent/手填 | 否 | 是 | C |
| 语气 | `behaviorSystem.speechTone` | 低沉有节拍 | 语言风格 | Agent/手填 | 否 | 是 | C |
| 口癖 | `behaviorSystem.catchphrase` | 再给你三秒。 | 台词 | Agent/手填 | 否 | 是 | C |
| 战斗台词 | `behaviorSystem.battleLine` | 错拍了，重来。 | 台词 | Agent/手填 | 否 | 是 | C |
| 走路方式 | `behaviorSystem.walkStyle` | 大步有节奏 | 动作语言 | Agent/手填 | 可选/间接 | 是 | B |
| 战斗姿态 | `behaviorSystem.combatStance` | 扳轮横在身前 | 姿态描述 | Agent/手填 | 是/可选 | 是 | A：姿态影响源 |
| 待机动作 | `behaviorSystem.idleAction` | 每隔十秒看秒差计 | 角色小动作 | Agent/手填 | 可选 | 是 | B |
| 攻击节奏 | `behaviorSystem.attackRhythm` | 三拍压近，第四拍横扫 | 战斗节奏 | Agent/手填 | 可选 | 是 | B |

## 服装 / Costume

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 外套 | `costumeSystem.outerwear` | 蓝黑钟塔肩带披片 | 上身外层 | Agent/手填 | 是 | 是 | B：2.0 不应直接由职业硬决定 |
| 外套颜色 | `costumeSystem.outerwearColor` | 深蓝黑，铜色小扣 | 颜色 | Agent/手填 | 是 | 是 | B |
| 打底 | `costumeSystem.innerwear` | 贴身白色短袖上衣 | 核心上衣 | Agent/手填 | 是 | 是 | A/B：作为 Compiler 输出，不一定是影响源 |
| 打底颜色 | `costumeSystem.innerwearColor` | 干净暖白 | 颜色 | Agent/手填 | 是 | 是 | B |
| 裤子 | `costumeSystem.pants` | 高腰工装短裤 | 下装轮廓 | Agent/手填 | 是 | 是 | B |
| 裤子颜色 | `costumeSystem.pantsColor` | 雾灰蓝 | 颜色 | Agent/手填 | 是 | 是 | B |
| 袜子 | `costumeSystem.socks` | 厚实长筒工作袜 | 下身细节 | Agent/手填 | 是 | 是 | C/B |
| 袜子颜色 | `costumeSystem.socksColor` | 白灰配暗金环线 | 颜色 | Agent/手填 | 是 | 是 | C |
| 鞋子 | `costumeSystem.shoes` | 宽底维护靴 | 鞋 | Agent/手填 | 是 | 是 | B |
| 鞋子颜色 | `costumeSystem.shoesColor` | 深蓝黑 | 颜色 | Agent/手填 | 是 | 是 | C |
| 手套 | `costumeSystem.gloves` | 半指校准手套 | 手部配件 | Agent/手填 | 是 | 是 | B |
| 手套颜色 | `costumeSystem.glovesColor` | 深灰配铜扣 | 颜色 | Agent/手填 | 是 | 是 | C |
| 项链 | `costumeSystem.necklace` | 裂钟摆片项链 | 小配饰 | Agent/手填 | 可选 | 是 | C |
| 项链颜色 | `costumeSystem.necklaceColor` | 旧铜 | 颜色 | Agent/手填 | 可选 | 是 | C |
| 腰带 | `costumeSystem.belt` | 宽蓝黑腰封 | 结构/道具挂载 | Agent/手填 | 是 | 是 | B |
| 腰带颜色 | `costumeSystem.beltColor` | 蓝黑配铜扣 | 颜色 | Agent/手填 | 是 | 是 | C |
| 标志物 | `costumeSystem.signatureItem` | 铜秒针扳轮 | 识别物/道具 | Agent/手填 | 是 | 是 | A：`themeDirectionLayer.signatureProp` / weapon link |
| 标志物颜色 | `costumeSystem.signatureItemColor` | 旧铜、象牙、琥珀光 | 道具色彩 | Agent/手填 | 是 | 是 | B |

## 生活 / Lifestyle

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 最爱食物 | `lifestyle.favoriteFood` | 葱油饼夹卤牛肉 | 生活细节 | Agent/手填 | 否 | 是 | C |
| 讨厌食物 | `lifestyle.hatedFood` | 泡软的面包 | 生活细节 | Agent/手填 | 否 | 是 | C |
| 隐藏最爱 | `lifestyle.hiddenFavorite` | 老式奶油冰棍 | 反差 | Agent/手填 | 否 | 是 | C |
| 食量 | `lifestyle.appetite` | 很大 | 体型/生活参考 | Agent/手填 | 否/间接 | 是 | C |
| 酒量 | `lifestyle.alcoholTolerance` | 中高 | 生活细节 | Agent/手填 | 否 | 是 | C |
| 料理能力 | `lifestyle.cookingSkill` | 会做快手热菜 | 生活细节 | Agent/手填 | 否 | 是 | C |
| 房间风格 | `lifestyle.roomStyle` | 挂满旧钟面和维护表 | 环境/物件主题 | Agent/手填 | 可选/间接 | 是 | B：可作 motif 来源 |
| 整洁度 | `lifestyle.neatness` | 工具极整齐 | 生活习惯 | Agent/手填 | 间接 | 是 | C/B |
| 收藏物 | `lifestyle.collections` | 旧秒针、裂表盘 | 主题物件池 | Agent/手填 | 可选/间接 | 是 | B |
| 宠物情况 | `lifestyle.pets` | 无宠物 | 生活细节 | Agent/手填 | 通常否 | 是 | C/D：当前易变成无关信息 |

## 社交 / Social

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 社交能力 | `socialSystem.socialAbility` | 中高，嘴硬但热心 | 社交表现 | Agent/手填 | 间接 | 是 | C/B |
| 说谎能力 | `socialSystem.lyingAbility` | 低 | 行为判断 | Agent/手填 | 否 | 是 | C |
| 边界感 | `socialSystem.boundarySense` | 中等 | 人际习惯 | Agent/手填 | 否 | 是 | C |
| 人气 | `socialSystem.popularity` | 街坊信任 | 社会关系 | Agent/手填 | 否/间接 | 是 | C |
| 恋爱经验 | `socialSystem.romanceExperience` | 有过稳定关系 | 关系历史 | Agent/手填 | 否 | 是 | C/D |
| 喜欢类型 | `socialSystem.preferredType` | 能打断他的人 | 关系偏好 | Agent/手填 | 否 | 是 | C/D |
| 表达方式 | `socialSystem.expressionStyle` | 直接帮忙 | 社交行为 | Agent/手填 | 间接 | 是 | C |
| 占有欲 | `socialSystem.possessiveness` | 中 | 关系倾向 | Agent/手填 | 否 | 是 | D：容易污染视觉生成 |

## 战斗 / Combat

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 战斗原型 | `combatSystem.battleArchetype` | 近战节拍控制者 | 战斗上游原型 | 默认有值；Agent/手填 | 间接/可选 | 是 | A：`influenceSourceLayer.combatArchetype` |
| 战斗类型 | `combatSystem.combatType` | 近距离压制与时间错拍控制 | 战斗定位 | Agent/手填 | 可选 | 是 | A/B |
| 核心打法 | `combatSystem.coreStyle` | 抢出半秒空隙保护队友 | 战斗逻辑 | Agent/手填 | 可选 | 是 | A/B |
| 特殊能力 | `combatSystem.specialAbility` | 半秒校准 | 奇幻能力 | Agent/手填 | 是 | 是 | A |
| 视觉武器 | `combatSystem.visualWeapon` | 铜秒针扳轮 | 可画道具对象 | Agent/手填 | 是 | 是 | A |
| 战斗功能 | `combatSystem.combatFunction` | 格挡、横扫、校准错拍 | 武器用途 | Agent/手填 | 可选/间接 | 是 | A |
| 武器来源 | `combatSystem.weaponSource` | 主秒针被异常秒差浸透 | 来源解释 | Agent/手填 | 可选/间接 | 是 | A/B |
| 禁用直译 | `combatSystem.forbiddenDirectTool` | 普通扳手、普通钟表 | 反直译保护 | Agent/手填 | 否/负向参考 | 是 | A：迁移为 guardrail |
| 变形逻辑 | `combatSystem.weaponTransformation` | 主秒针放大成棘轮武器 | 设计推理 | Agent/手填 | 可选/间接 | 是 | A/B |
| 奇幻解释 | `combatSystem.fantasyExplanation` | 动作被迫对齐报秒节拍 | 能力解释 | Agent/手填 | 可选/间接 | 是 | A |
| 最终武器 | `combatSystem.weaponPreference` | 铜秒针扳轮与折叠秒差计 | 最终道具 | Agent/手填 | 是 | 是 | A |
| 耐痛 | `combatSystem.painTolerance` | 高 | 战斗性格 | Agent/手填 | 否/间接 | 是 | C |
| 攻击性 | `combatSystem.aggression` | 中高 | 战斗倾向 | Agent/手填 | 间接 | 是 | C/B |
| 耐力 | `combatSystem.stamina` | 高 | 战斗能力 | Agent/手填 | 否/间接 | 是 | C |
| 爆发力 | `combatSystem.burstPower` | 极高 | 动作强度 | Agent/手填 | 间接 | 是 | C/B |
| 压迫感 | `combatSystem.pressure` | 高 | 视觉气势 | Agent/手填 | 间接 | 是 | B |
| 反应速度 | `combatSystem.reactionSpeed` | 高 | 动作风格 | Agent/手填 | 否/间接 | 是 | C |

## 与世界 / World Relation

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 出身地 | `worldSetting.origin` | 旧城钟塔维修夹层 | 地域/场景 | Agent/手填 | 可选/间接 | 是 | A/B：`regionContext` + influence |
| 社会阶层 | `worldSetting.socialClass` | 普通旧城维修家庭 | 社会背景 | Agent/手填 | 间接 | 是 | B |
| 教育程度 | `worldSetting.education` | 机械计时维护培训 | 职业可信度 | Agent/手填 | 间接 | 是 | B |
| 犯罪记录 | `worldSetting.criminalRecord` | 无 | 法律状态 | Agent/手填 | 通常否 | 是 | C/D |
| 组织地位 | `worldSetting.organizationRank` | 一线校准师 | 组织角色 | Agent/手填 | 可选/间接 | 是 | B |
| 敌对势力 | `worldSetting.enemyForces` | 错拍影 | 世界冲突 | Agent/手填 | 可选/间接 | 是 | B |
| 最后悔的事 | `worldSetting.biggestRegret` | 迟了四秒发现停摆 | 动机 | Agent/手填 | 间接 | 是 | C/B |
| 最大目标 | `worldSetting.biggestGoal` | 报时系统互相校准 | 长期目标 | Agent/手填 | 间接 | 是 | C/B |
| 隐藏梦想 | `worldSetting.hiddenDream` | 修一座放学钟塔 | 反差 | Agent/手填 | 否/间接 | 是 | C |
| 最重要的人 | `worldSetting.mostImportantPerson` | 教他听钟芯的父亲 | 关系动机 | Agent/手填 | 否 | 是 | C |
| 难忘经历 | `worldSetting.unforgettableExperience` | 暴雨夜顶住主钟摆 | 关键经历 | Agent/手填 | 可选/间接 | 是 | B |
| 人生污点 | `worldSetting.lifeStain` | 改短响应时间 | 阴影/秘密 | Agent/手填 | 否/间接 | 是 | C |

## 解锁项 / Unlocks

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 羞耻秘密 | `hiddenInformation.shameSecret` | 把四秒延误写成设备延迟 | 隐藏剧情 | Agent/手填 | 否 | 是 | C |
| 隐藏爱好 | `hiddenInformation.hiddenHobby` | 收集报时录音 | 反差/物件 | Agent/手填 | 可选/间接 | 是 | C/B |
| 弱点 | `hiddenInformation.weakness` | 无节奏噪声会头痛 | 弱点 | Agent/手填 | 可选/间接 | 是 | C/B |
| 秘密习惯 | `hiddenInformation.secretHabit` | 过门默数一步 | 行为小动作 | Agent/手填 | 可选/间接 | 是 | C |
| 反差面 | `hiddenInformation.contrastSide` | 给小孩修玩具钟 | 反差 | Agent/手填 | 否 | 是 | C |
| 过敏食物 | `hiddenInformation.foodAllergy` | 无明显过敏 | 生活信息 | Agent/手填 | 否 | 是 | D |

## 数值 / Stats

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 贫富 | `numericalAttributes.wealth` | 44 | 社会资源倾向 | 默认 30；Agent/手调 | 间接 | 是 | B/C |
| 道德 | `numericalAttributes.morality` | 80 | 行为判断 | 默认 30；Agent/手调 | 间接 | 是 | B |
| 理智 | `numericalAttributes.sanity` | 75 | 心理状态 | 默认 30；Agent/手调 | 间接 | 是 | B |
| 自信 | `numericalAttributes.confidence` | 84 | 表情/姿态参考 | 默认 30；Agent/手调 | 间接 | 是 | B |
| 压力 | `numericalAttributes.stress` | 59 | 表情/状态参考 | 默认 30；Agent/手调 | 间接 | 是 | B |
| 危险 | `numericalAttributes.danger` | 73 | 战斗/威胁感 | 默认 30；Agent/手调 | 间接 | 是 | B |
| 欲望 | `numericalAttributes.desire` | 42 | 内在驱动 | 默认 30；Agent/手调 | 否/间接 | 是 | C |
| 忠诚 | `numericalAttributes.loyalty` | 83 | 社交/组织倾向 | 默认 30；Agent/手调 | 否/间接 | 是 | C |
| 情绪稳定 | `numericalAttributes.stability` | 78 | 表情/命名默认读取之一 | 默认 30；Agent/手调 | 间接 | 是 | B |
| 社交能力 | `numericalAttributes.social` | 64 | 社交倾向 | 默认 30；Agent/手调 | 否/间接 | 是 | C |
| 自毁倾向 | `numericalAttributes.doom` | 30 | 悲剧倾向 | 默认 30；Agent/手调 | 否/间接 | 是 | C/D |
| 暴力倾向 | `numericalAttributes.violence` | 55 | 战斗倾向 | 默认 30；Agent/手调 | 间接 | 是 | B/C |
| 脑洞 | `numericalAttributes.imagination` | 60 | 命名模板权重 | 默认 30；命名脚本读取 | 间接/命名 | 是 | A/B |
| 世界绑定 | `numericalAttributes.worldBinding` | 74 | 命名模板权重/世界强度 | 默认 30；命名脚本读取 | 间接/命名 | 是 | A/B |
| 文化混合 | `numericalAttributes.identityMix` | 15 | 命名模板权重 | 默认 30；命名脚本读取 | 间接/命名 | 是 | B |
| 名字现实感 | `numericalAttributes.nameRealism` | 69 | 命名模板权重 | 默认 70；命名脚本读取 | 命名 | 是 | A/B |

## 提示词 / Final Prompt

| 字段 | Key | 示例 | 用途 | 是否随机 | 是否进 Prompt | 是否展示信息 | 是否建议迁移 |
|---|---|---|---|---|---|---|---|
| 中文提示词 | `metaDesign.characterImagePromptCn` | 单个角色，全身从头到靴子完整可见... | 中文理解备份/最终图像主体 | Agent/手写编译 | 是，出图读取 | 是 | A：`Prompt Compiler.output.cn` |
| 英文提示词 | `metaDesign.characterImagePrompt` | Single character only. Full body visible... | 出图主文本 | Agent/手写编译 | 是，出图主来源 | 是 | A：`Prompt Compiler.output.en` |

数据结构中还存在但当前提示词页不显示：

| 字段 | Key | 当前用途 | 建议 |
|---|---|---|---|
| 一致性提示词 | `metaDesign.characterConsistencyPrompt` | 角色复现摘要，样本中有值 | B：可迁移到 Prompt Compiler 的 consistency brief |
| 多视图提示词 | `metaDesign.referenceSheetPrompt` | 预留 | C：等多资产流程成熟 |
| 道具提示词 | `metaDesign.propsPrompt` | 预留 | C |
| 服装提示词 | `metaDesign.costumePrompt` | 预留 | C |

## 随机逻辑盘点

### 1. 随机池生成字段

| 来源 | 字段 | 说明 |
|---|---|---|
| `makeId()` | `id`、`agentMarks[].id`、preset id | 使用 `crypto.randomUUID()` 或 `crypto.getRandomValues()`；只是技术 ID。 |
| `scripts/generate-name.js` | 候选 `name`、`codename`、`namingProfile` 建议 | 读取 `data/name-samples.json`，根据文化、数值权重和 seed 产生候选；不会自动写入角色，除非人工/脚本采用。 |
| 测试脚本 | 多个角色字段 | `scripts/fill-*.js` 直接写入固定样本，不是通用随机池。 |
| Agent 工作流 | 几乎所有角色字段 | 由规则文档约束的生成流程，不在前端代码中实现随机池。 |

当前没有代码级随机池生成职业、服装、人格、行为、世界观或 Prompt。

### 2. 根据其他字段推导的字段

| 字段 | 推导依据 | 位置 |
|---|---|---|
| 命名文化 `primaryCulture` | `heritage`、`species`、`faction`、`affiliation`、`occupation`、`world.origin`、`world.organizationRank`、`world.socialClass` | `scripts/generate-name.js` |
| 命名模板 | `imagination`、`worldBinding`、`identityMix`、`nameRealism` | `scripts/generate-name.js` |
| 代号候选 | `occupation`、`specialAbility`、`weaponPreference`、`characterHook` 和样本概念词 | `scripts/generate-name.js` |
| 色键颜色 | 最终中英 Prompt 是否包含绿色/青色/粉紫等发光或透明元素 | `scripts/prepare-image-generation.js` |
| 出图请求 | `metaDesign.characterImagePrompt`、`metaDesign.characterImagePromptCn`、`settings.styleReference.image` | `scripts/prepare-image-generation.js` |
| 最终 Prompt | 规则要求由完整 profile 人工/Agent 编译 | `GENERATION_RULES.md` |

### 3. 固定默认值

| 字段 | 默认值 |
|---|---|
| `coreIdentity.faction` | `重装安保队`；创建新角色时覆盖为 `未归档` |
| `combatSystem.battleArchetype` | `守护型响应者` |
| `numericalAttributes.*` | 大多为 `30`，`nameRealism` 为 `70` |
| `activeMarks` | `{ attributes: false, images: true }` |
| `assets.fullBody` | `./assets/character-placeholder.png` |
| `generationProfile.notes` | 内置生成备注模板 |
| `settings.starterPrompt` | 内置起手式正向 + 负向提示 |

### 4. 会被其他字段影响的字段

| 下游字段 | 当前影响源 | 结论 |
|---|---|---|
| 名字/代号候选 | heritage、occupation、affiliation、world、数值 | 已有脚本级依赖。 |
| 表情 | 规则要求读取 `EXPRESSION_DESIGN_GUIDE.md`，并考虑数值和角色概念 | 不是代码自动依赖，是工作流依赖。 |
| 服装 | 规则要求读 `COSTUME_DESIGN_GUIDE.md`，结合数值、世界阵营、战斗方式、身体轮廓和反重复 | 不是代码自动依赖，是工作流依赖。 |
| 武器 | 规则要求按 battleArchetype -> visualWeapon -> function -> fantasy -> source -> occupation 包装 | 强依赖工作流，且明确禁止职业直译。 |
| Prompt | 理论上由所有可视字段、职业、战斗、服装、hook 编译 | 出图时只读取已编译结果。 |

### 5. 容易导致重复的字段

| 字段/区域 | 重复风险 |
|---|---|
| `visualIdentity.visualKeywords` | 常把职业、体型、服装、武器、颜色全部压成一串，容易和 Prompt、服装字段重复。 |
| `metaDesign.characterHook` | 容易重复 occupation、weaponPreference、specialAbility 的同一句设定。 |
| `costumeSystem.*Color` + `visualIdentity.colorLanguage` | 颜色分散在多个字段，容易互相冲突或重复。 |
| `coreIdentity.faction` + `coreIdentity.affiliation` + `worldSetting.organizationRank` | 组织信息三处重叠。 |
| `personality.emotionalStability` + `numericalAttributes.stability` | 同义字段，一个文本一个数值。 |
| `personality.confidenceLevel` + `numericalAttributes.confidence` | 同义字段。 |
| `socialSystem.socialAbility` + `numericalAttributes.social` | 同义字段。 |
| `combatSystem.visualWeapon` + `weaponPreference` + `signatureItem` | 道具/武器可能三处重复。 |
| `combatSystem.specialAbility` + `fantasyExplanation` + `characterHook` | 奇幻能力容易重复。 |
| `lifestyle.pets` / `hiddenInformation.foodAllergy` | 常填“无”，信息密度低且重复。 |

### 6. 目前没有影响下游、主要展示的字段

前端代码没有自动下游的字段很多。严格按代码看，除命名脚本和出图脚本读取字段外，大多字段都只是存储和展示。尤其是：

- `lifestyle.*`
- `socialSystem.*`
- `hiddenInformation.*`
- 多数 `worldSetting.*`
- 多数 `personality.*`
- 多数战斗数值文本字段
- 多数 `numericalAttributes.*`

它们在 1.0 的实际价值来自 Agent/人工编译 Prompt，而不是程序依赖。

## 指定依赖检查

| 问题 | 当前 1.0 结论 |
|---|---|
| 职业是否影响服装？ | 代码层没有自动影响；规则层要求职业作为现实基础，但服装还要由服装指南、体型、战斗、世界阵营和反重复共同决定。 |
| 职业是否影响武器？ | 规则层明确影响，但只能在后段作为材料、符号、流程、伪装包装；禁止直接 `occupation -> common tool -> weapon`。 |
| 地域 / 国籍 / heritage 是否影响服装？ | 代码层没有；规则层要求外观前读 heritage 外观规则。服装影响更多是语境/概率，不应刻板直译。 |
| 性格是否影响表情？ | 代码层没有；规则层要求表情结合数值和角色概念。建议 2.0 明确建依赖。 |
| 行为是否影响姿态？ | 代码层没有；行为页有 `combatStance`、`walkStyle`、`idleAction`，适合 2.0 作为姿态影响源。 |
| 世界观字段是否影响视觉关键词？ | 代码层没有；现有样本中视觉关键词常吸收职业/世界物件。建议 2.0 明确 world -> motif/material，而不是整句塞入。 |
| `visualKeywords` 是否是最终 Prompt 的主要来源？ | 在现有样本和工作流中是重要摘要来源；但出图脚本不直接读取它，只读取最终 Prompt。 |

## 1.0 字段迁移到 2.0 模块

### characterFoundationLayer

建议迁移：

- `coreIdentity.age`
- `coreIdentity.height`
- `coreIdentity.weight`
- `coreIdentity.species`
- `coreIdentity.heritage` 的人物基础部分
- `personality.corePersonality`
- `visualIdentity.faceShape`
- `visualIdentity.expression`
- `visualIdentity.eyes`
- `visualIdentity.eyeColor`
- `visualIdentity.eyebrow`
- `visualIdentity.lip`
- `visualIdentity.scar`
- `visualIdentity.tattoo`
- `visualIdentity.hairStyle`
- `visualIdentity.hairLength`
- `visualIdentity.hairColor`
- `visualIdentity.highlight`
- `visualIdentity.facialHair`
- `visualIdentity.bodyType`
- `visualIdentity.muscleLevel`
- `visualIdentity.bodyFat`
- `visualIdentity.shoulderWidth`
- `visualIdentity.skinTone`
- `visualIdentity.muscleFocus`

### influenceSourceLayer

建议迁移：

- `coreIdentity.occupation`
- `coreIdentity.affiliation`
- `coreIdentity.faction`
- `worldSetting.origin`
- `worldSetting.socialClass`
- `worldSetting.education`
- `worldSetting.organizationRank`
- `worldSetting.enemyForces`
- `behaviorSystem.walkStyle`
- `behaviorSystem.combatStance`
- `behaviorSystem.idleAction`
- `behaviorSystem.attackRhythm`
- `lifestyle.roomStyle`
- `lifestyle.collections`
- `combatSystem.battleArchetype`
- `combatSystem.combatType`
- `combatSystem.coreStyle`
- `combatSystem.specialAbility`
- `combatSystem.visualWeapon`
- `combatSystem.combatFunction`
- `combatSystem.weaponSource`
- `combatSystem.weaponTransformation`
- `combatSystem.fantasyExplanation`
- `combatSystem.weaponPreference`

### themeDirectionLayer

建议迁移：

- `metaDesign.characterHook`
- `visualIdentity.visualKeywords`
- `visualIdentity.colorLanguage`
- `costumeSystem.signatureItem`
- `costumeSystem.signatureItemColor`
- `combatSystem.visualWeapon`
- `combatSystem.specialAbility`
- `worldSetting.enemyForces`
- `worldSetting.biggestGoal`
- `worldSetting.unforgettableExperience`
- 职业主题，但应拆成 `motif`、`material`、`ritual`、`symbol`，不要整句继承。

### regionContext

建议迁移：

- `coreIdentity.heritage`
- `worldSetting.origin`
- `worldSetting.socialClass`
- `worldSetting.education`
- `coreIdentity.affiliation` 中的地域/组织语境
- `namingProfile.primaryCulture`
- `namingProfile.secondaryCulture`

### designLanguage

建议迁移：

- `visualIdentity.colorLanguage`
- `costumeSystem.*Color`
- `visualIdentity.visualKeywords` 中的颜色、材质、轮廓词
- `settings.starterPrompt` 中稳定的全局风格偏好，但不要把它混入角色字段。

### Prompt Compiler

建议迁移：

- `metaDesign.characterImagePrompt`
- `metaDesign.characterImagePromptCn`
- `metaDesign.characterConsistencyPrompt`
- `visualIdentity.visualKeywords`
- `metaDesign.characterHook`
- 完整可视字段：appearance、costume、combat visual object、signature prop、designLanguage。

### 暂时不迁移

| 字段/区域 | 原因 |
|---|---|
| `hiddenInformation.foodAllergy` | 通常不影响视觉，易噪声。 |
| `socialSystem.romanceExperience` | 容易污染视觉主题，优先级低。 |
| `socialSystem.preferredType` | 关系偏好，不应影响角色外观。 |
| `socialSystem.possessiveness` | 抽象且容易误导 Prompt。 |
| `coreIdentity.birthday` | 展示信息，不是生成影响源。 |
| `activeMarks`、`agentMarks` | 工作流状态，不是角色结构。 |
| `assets.*` | 结果资产，不是影响源。 |
| `settings.developer.*` | UI 调试参数。 |
| `generationProfile.notes` | 工作备注，不能作为结构化影响源直接迁移。 |

## 迁移价值分级

### A 级：必须迁移

这些字段能明显提高 2.0 的合理随机和可视一致性：

- `coreIdentity.occupation`
- `coreIdentity.heritage`
- `coreIdentity.age`
- `coreIdentity.height`
- `coreIdentity.weight`
- `personality.corePersonality`
- `visualIdentity.bodyType`
- `visualIdentity.muscleLevel`
- `visualIdentity.shoulderWidth`
- `visualIdentity.skinTone`
- `visualIdentity.faceShape`
- `visualIdentity.expression`
- `visualIdentity.hairStyle`
- `visualIdentity.hairColor`
- `visualIdentity.visualKeywords`
- `visualIdentity.colorLanguage`
- `metaDesign.characterHook`
- `combatSystem.battleArchetype`
- `combatSystem.visualWeapon`
- `combatSystem.combatFunction`
- `combatSystem.specialAbility`
- `combatSystem.weaponPreference`
- `combatSystem.forbiddenDirectTool`
- `combatSystem.weaponTransformation`
- `worldSetting.origin`
- `costumeSystem.signatureItem`
- `metaDesign.characterImagePrompt`
- `metaDesign.characterImagePromptCn`

原因：这些字段要么是身份/外观基础，要么能产生职业、武器、主题、地域、Prompt 的主要下游。

### B 级：建议迁移

有用，但需要拆分或改造：

- `coreIdentity.affiliation`
- `coreIdentity.faction`
- `coreIdentity.species`
- `visualIdentity.eyeColor`
- `visualIdentity.eyebrow`
- `visualIdentity.lip`
- `visualIdentity.scar`
- `visualIdentity.tattoo`
- `visualIdentity.highlight`
- `visualIdentity.facialHair`
- `visualIdentity.bodyFat`
- `visualIdentity.muscleFocus`
- `costumeSystem.*`
- `personality.strengths`
- `personality.weaknesses`
- `personality.outwardPersona`
- `personality.trueCore`
- `personality.stressResponse`
- `behaviorSystem.walkStyle`
- `behaviorSystem.combatStance`
- `behaviorSystem.idleAction`
- `behaviorSystem.attackRhythm`
- `worldSetting.socialClass`
- `worldSetting.education`
- `worldSetting.organizationRank`
- `worldSetting.enemyForces`
- `worldSetting.biggestGoal`
- `worldSetting.unforgettableExperience`
- `numericalAttributes.imagination`
- `numericalAttributes.worldBinding`
- `numericalAttributes.identityMix`
- `numericalAttributes.nameRealism`

原因：它们有影响潜力，但需要从自由文本拆成结构化的影响源、概率权重或 prompt hint。

### C 级：暂时保留

可以作为展示字段，不急着影响生成：

- `coreIdentity.name`
- `coreIdentity.codename`
- `coreIdentity.alias`
- `coreIdentity.birthday`
- 多数 `lifestyle.*`
- 多数 `socialSystem.*`
- 多数 `hiddenInformation.*`
- 多数 `personality.trauma*`
- `worldSetting.biggestRegret`
- `worldSetting.hiddenDream`
- `worldSetting.mostImportantPerson`
- `worldSetting.lifeStain`
- 多数战斗文本数值：`painTolerance`、`stamina`、`reactionSpeed`

原因：这些字段增强角色厚度，但直接进入视觉随机时收益不稳定。

### D 级：不建议迁移

- `hiddenInformation.foodAllergy`
- `socialSystem.preferredType`
- `socialSystem.romanceExperience`
- `socialSystem.possessiveness`
- `activeMarks`
- `agentMarks`
- `assets.thumbnail`
- `settings.developer.*`
- `generationProfile.notesTemplateSeeded`

原因：容易造成重复、混乱、字段污染，或只是工作流/旧 UI 状态。

## 1.0 字段到 2.0 模块映射表

| 1.0 字段 | 当前用途 | 2.0 目标模块 | 迁移方式 | 优先级 |
|---|---|---|---|---|
| `coreIdentity.age` | 年龄 | `characterFoundationLayer.age` | 作为基础约束进入 Prompt | A |
| `coreIdentity.height` | 身高 | `characterFoundationLayer.bodyScale.height` | 与体型共同决定体量 | A |
| `coreIdentity.weight` | 体重 | `characterFoundationLayer.bodyScale.weight` | 与 muscle/bodyType 合并判断 | A |
| `coreIdentity.occupation` | 职业身份 | `influenceSourceLayer.occupationInfluence` | 不直接决定服装/武器，只提供生活逻辑、材料、流程、符号 | A |
| `coreIdentity.affiliation` | 组织 | `influenceSourceLayer.organizationInfluence` | 提供组织语境、制服概率、符号来源 | A/B |
| `coreIdentity.heritage` | 血统/地域 | `regionContext.heritage` | 影响命名、肤色/发色概率和地域语境，避免刻板直译 | A |
| `coreIdentity.species` | 种族/异常身份 | `characterFoundationLayer.species` | 拆成人类基础与异常标记 | B |
| `personality.corePersonality` | 核心性格 | `characterFoundationLayer.personalityCore` | 影响表情、姿态、穿衣习惯、动作节奏 | A |
| `visualIdentity.bodyType` | 体型 | `characterFoundationLayer.body.bodyType` | 基础体型硬约束 | A |
| `visualIdentity.muscleLevel` | 肌肉量 | `characterFoundationLayer.body.muscleLevel` | 控制体量强度 | A |
| `visualIdentity.shoulderWidth` | 肩宽 | `characterFoundationLayer.body.silhouette` | 进入轮廓约束 | A |
| `visualIdentity.skinTone` | 肤色 | `characterFoundationLayer.appearance.skinTone` + `regionContext` | region 只影响概率，不硬套 | A |
| `visualIdentity.faceShape` | 脸型 | `characterFoundationLayer.face.shape` | 可视基础 | A |
| `visualIdentity.expression` | 表情 | `characterFoundationLayer.expression` | 受 personality/stats/behavior 影响 | A |
| `visualIdentity.lip` | 嘴型 | `characterFoundationLayer.expression.mouth` | 表情口型细化 | A |
| `visualIdentity.hairStyle` | 发型 | `characterFoundationLayer.hair.style` | 可视基础 | A |
| `visualIdentity.hairColor` | 发色 | `characterFoundationLayer.hair.color` | 可视基础 | A |
| `visualIdentity.scar` | 疤痕 | `themeDirectionLayer.identityMarks` | 作为识别点，不必每次强制 | B |
| `visualIdentity.tattoo` | 纹身 | `themeDirectionLayer.motifMarks` | 拆成 motif/placement/color | B |
| `visualIdentity.visualKeywords` | 视觉关键词 | `themeDirectionLayer` + `Prompt Compiler` | 拆成 motif/material/silhouette/prop/promptHint | A |
| `visualIdentity.colorLanguage` | 色彩语言 | `designLanguage.palette` | 统一管理主色、点缀色、禁用色 | A |
| `costumeSystem.outerwear` | 外套 | `Prompt Compiler.outfit.outerLayer` | 作为编译结果，不作为第一层影响源 | B |
| `costumeSystem.innerwear` | 打底 | `Prompt Compiler.outfit.innerLayer` | 与 body/designLanguage 编译 | B |
| `costumeSystem.pants` | 裤子 | `Prompt Compiler.outfit.bottom` | 与职业/行动需求/轮廓共同编译 | B |
| `costumeSystem.shoes` | 鞋 | `Prompt Compiler.outfit.footwear` | 与 occupation/terrain/stance 共同编译 | B |
| `costumeSystem.signatureItem` | 标志物 | `themeDirectionLayer.signatureProp` | 可与 weapon 合并或建立冲突检查 | A |
| `behaviorSystem.walkStyle` | 走路方式 | `influenceSourceLayer.movementInfluence` | 影响姿态和轮廓动作 | B |
| `behaviorSystem.combatStance` | 战斗姿态 | `influenceSourceLayer.poseInfluence` | 可直接给 Prompt Compiler | A/B |
| `behaviorSystem.idleAction` | 待机动作 | `influenceSourceLayer.gestureInfluence` | 作为可选 gesture | B |
| `combatSystem.battleArchetype` | 战斗原型 | `influenceSourceLayer.combatArchetype` | 作为武器和姿态上游 | A |
| `combatSystem.visualWeapon` | 视觉武器 | `themeDirectionLayer.weaponObject` | 必须是可画实体名词 | A |
| `combatSystem.combatFunction` | 战斗功能 | `influenceSourceLayer.weaponFunction` | 先决定功能，再包装职业元素 | A |
| `combatSystem.weaponSource` | 武器来源 | `influenceSourceLayer.weaponSource` | 解释来源，不直接当武器 | B |
| `combatSystem.forbiddenDirectTool` | 禁用直译 | `Prompt Compiler.guardrails.noDirectTool` | 作为反重复/反直译规则 | A |
| `combatSystem.weaponTransformation` | 变形逻辑 | `influenceSourceLayer.weaponTransformation` | 保留为设计推理，可自动校验 | A/B |
| `combatSystem.fantasyExplanation` | 奇幻解释 | `themeDirectionLayer.fantasyLogic` | 控制奇幻密度 | A |
| `combatSystem.weaponPreference` | 最终武器 | `Prompt Compiler.props.finalWeapon` | 输出实体道具 | A |
| `worldSetting.origin` | 出身地 | `regionContext.origin` + `influenceSourceLayer.worldOrigin` | 提供地域、环境、职业可信度 | A/B |
| `worldSetting.organizationRank` | 组织地位 | `influenceSourceLayer.socialRole` | 影响制服/徽记/姿态权威感 | B |
| `worldSetting.enemyForces` | 敌对势力 | `themeDirectionLayer.conflictMotif` | 作为 motif，不直接塞敌人进画面 | B |
| `worldSetting.unforgettableExperience` | 难忘经历 | `themeDirectionLayer.backstoryMotif` | 抽取物件/痕迹/姿态 | B |
| `numericalAttributes.imagination` | 脑洞 | `themeDirectionLayer.randomnessWeights.imagination` | 控制现实/奇幻比例 | A/B |
| `numericalAttributes.worldBinding` | 世界绑定 | `themeDirectionLayer.randomnessWeights.worldBinding` | 控制世界观符号强度 | A/B |
| `numericalAttributes.identityMix` | 文化混合 | `regionContext.mixWeight` | 控制混合命名/地域概率 | B |
| `numericalAttributes.nameRealism` | 名字现实感 | `Prompt Compiler.namingWeights.realism` | 只服务命名 | A/B |
| `metaDesign.characterHook` | 角色钩子 | `themeDirectionLayer.themeSummary` | 作为主题总结来源 | A |
| `metaDesign.characterImagePromptCn` | 中文最终提示词 | `Prompt Compiler.output.cn` | 编译输出，不作为上游真相 | A |
| `metaDesign.characterImagePrompt` | 英文最终提示词 | `Prompt Compiler.output.en` | 出图主输出 | A |

## 建议的第一批迁移

第一批应迁移“能稳定影响视觉，但不会污染下游”的字段：

1. `coreIdentity.occupation`
2. `coreIdentity.heritage`
3. `coreIdentity.age`
4. `coreIdentity.height`
5. `coreIdentity.weight`
6. `personality.corePersonality`
7. `visualIdentity.bodyType`
8. `visualIdentity.muscleLevel`
9. `visualIdentity.shoulderWidth`
10. `visualIdentity.skinTone`
11. `visualIdentity.faceShape`
12. `visualIdentity.expression`
13. `visualIdentity.hairStyle`
14. `visualIdentity.hairColor`
15. `combatSystem.battleArchetype`
16. `combatSystem.visualWeapon`
17. `combatSystem.combatFunction`
18. `combatSystem.weaponPreference`
19. `combatSystem.forbiddenDirectTool`
20. `metaDesign.characterHook`
21. `visualIdentity.visualKeywords`
22. `visualIdentity.colorLanguage`

第二批再迁移行为、世界、服装明细和数值权重。生活、社交、解锁项应先保留为展示与剧情字段，等 2.0 的 influenceSourceLayer 稳定后再决定哪些能转成低权重影响源。
