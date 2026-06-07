# Character Skeleton Prompt Compiler Output

## Image Final Prompt

单人全身角色设定图，从头到脚完整可见，白底或浅色背景；东南亚雨街出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有东南亚雨街雨水设施观测气质，以雨线、水位刻度为母题。
服装以白色贴身内搭紧贴厚实躯干，布料下能轻微读出胸肌与腹肌的大块轮廓，强调被包裹住的力量感，腹部结构清楚但概括，不做细碎肌肉刻画；外层是简洁外层，下装为直筒工装裤，稳重工装轮廓，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。服装将雨线和水位刻度转成前襟透明防雨片，用竖向线条贯穿前身，线条在边缘克制中断，主块面分成两段，不遮白色内搭。
奇幻元素轻量集中，不抢服装主体。
配色干净，主色和点缀色分明。京都动画式清爽线条、干净赛璐璐阴影，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。

## promptCompressionGate.debug

{
  "mode": "imageFinal",
  "targetLength": "250-450 Chinese characters",
  "paragraphCount": 6,
  "dedupedConcepts": {
    "visualWeapon": "",
    "motifs": [
      "雨线",
      "水位刻度"
    ],
    "themeSummary": "整体带有东南亚雨街雨水设施观测气质，以雨线、水位刻度为母题。",
    "selectedMotifs": [
      "雨线",
      "水位刻度"
    ]
  },
  "moduleSanityWarnings": [],
  "influenceOnly": [],
  "debugOnly": [],
  "reasonabilityFilter": {
    "moduleName": "reasonabilityFilter",
    "status": "active-mvp",
    "passed": true,
    "score": 100,
    "warnings": [],
    "fixesApplied": [],
    "compressionNotes": [
      "Compressed normal motif list to 1-2 must-render motifs without warning.",
      "Compressed composition planes to the MVP complexity budget.",
      "Compressed composition line groups to avoid high-frequency seam noise.",
      "Compressed composition point clusters to one small accent area."
    ],
    "rejectedCombinations": [],
    "finalDecision": "passed with light checks"
  },
  "influenceReasoningLog": [
    {
      "source": "regionContext + themeCategory",
      "input": [
        "southeast_asian_rain_street",
        "rain_infrastructure_observer"
      ],
      "derived": [
        "humid",
        "rainy",
        "warm"
      ],
      "reason": "Region and role seed climate, material, and comfort constraints."
    },
    {
      "source": "themeCategory + regionContext",
      "input": [
        "rain_infrastructure_observer",
        "southeast_asian_rain_street"
      ],
      "derived": [
        "wet_street",
        "drainage_path",
        "reflective_surface"
      ],
      "reason": "Theme and place combine into a drawable environment flavor."
    },
    {
      "source": "presentationMode + occupationSeed + personalityCore",
      "input": [
        "ceremonial_but_practical_mode",
        "排水路径巡查员",
        "calm_reliable"
      ],
      "derived": [
        "practical"
      ],
      "reason": "Mode and personality derive practical movement and daily-wear pressure."
    },
    {
      "source": "climate + presentationMode + lifestyle",
      "input": [
        [
          "humid",
          "rainy",
          "warm"
        ],
        "ceremonial_but_practical_mode",
        [
          "practical"
        ]
      ],
      "derived": [
        "full_length_preferred"
      ],
      "reason": "Bottom length is derived from climate and use case, not independently random."
    },
    {
      "source": "bottomLengthBias",
      "input": "full_length_preferred",
      "derived": [
        "white_socks_hidden_or_slight"
      ],
      "reason": "Sock visibility follows leg exposure and should not randomize independently."
    }
  ]
}
