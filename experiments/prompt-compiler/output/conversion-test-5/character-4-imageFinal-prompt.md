# Character Skeleton Prompt Compiler Output

## Image Final Prompt

单人全身角色设定图，从头到脚完整可见，白底或浅色背景；中国南港出身，港区压力阀检修员，整体成熟厚实、稳定可靠。
结实高挑，中高身材，肌肉线条紧实，肩背较宽。被海风晒深的暖麦色，长方脸，颧骨硬，后梳短发，发尾微卷，深褐黑，平静带笑。
整体带有港口社区港区压力维护气质，以港区、压力阀为母题。
服装以白色贴身背心为身体锚点，外层是工装夹克，披挂式轮廓，下装为制服感长裤，直筒轮廓，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。
核心道具只保留阀门扳手，符号化处理，少量轻都市奇幻感，不要散成全身小图案。不要画成普通阀门、普通扳手和普通压力表。
配色以干净白、深青灰、雾蓝、氧化铜绿小点缀、少量白色警示线。干净 TV 动画赛璐璐和游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。

## promptCompressionGate.debug

{
  "mode": "imageFinal",
  "targetLength": "250-450 Chinese characters",
  "paragraphCount": 6,
  "dedupedConcepts": {
    "visualWeapon": "阀门扳手",
    "motifs": [
      "港区",
      "压力阀"
    ],
    "themeSummary": "整体带有港口社区港区压力维护气质，以港区、压力阀为母题。"
  },
  "moduleSanityWarnings": [
    "topModule.baseArchetype '风衣' is outerwear-like; downgraded to fitted innerwear.",
    "outerwearModule.baseType 'blazer' mismatches harbor_pressure_maintenance; replaced with utility outerwear."
  ],
  "influenceOnly": [
    "风衣",
    "blazer"
  ],
  "debugOnly": [
    "body cleanup candidate: muscleLevel=中高，线条紧",
    "body cleanup candidate: shoulderWidth=宽",
    "body cleanup candidate: weight=96 KG"
  ]
}
