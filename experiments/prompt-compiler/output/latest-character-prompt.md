# Character Skeleton Prompt Compiler Output

## Image Final Prompt

单人全身角色设定图，从头到脚完整可见，白底或浅色背景；东欧旧城区出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有东欧旧城区澡堂看护气质，以蒸汽、热水管为母题。
服装以白色贴身内搭为身体锚点，外层是功能背心，箱型轮廓，下装为直筒工装裤，直筒轮廓，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。
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
      "蒸汽",
      "热水管"
    ],
    "themeSummary": "整体带有东欧旧城区澡堂看护气质，以蒸汽、热水管为母题。"
  },
  "moduleSanityWarnings": [],
  "influenceOnly": [],
  "debugOnly": [],
  "reasonabilityFilter": {
    "moduleName": "reasonabilityFilter",
    "status": "active-mvp",
    "passed": true,
    "score": 94,
    "warnings": [
      "Full-length-preferred influence produced shorts."
    ],
    "fixesApplied": [
      "Changed shorts to full-length trousers under full_length_preferred bias."
    ],
    "compressionNotes": [
      "Compressed normal motif list to 1-2 must-render motifs without warning."
    ],
    "rejectedCombinations": [],
    "finalDecision": "passed with light checks"
  },
  "influenceReasoningLog": [
    {
      "source": "regionContext + themeCategory",
      "input": [
        "eastern_europe_old_quarter",
        "bathhouse_keeper"
      ],
      "derived": [
        "humid",
        "warm",
        "steam"
      ],
      "reason": "Region and role seed climate, material, and comfort constraints."
    },
    {
      "source": "themeCategory + regionContext",
      "input": [
        "bathhouse_keeper",
        "eastern_europe_old_quarter"
      ],
      "derived": [
        "旧电车街"
      ],
      "reason": "Theme and place combine into a drawable environment flavor."
    },
    {
      "source": "presentationMode + occupationSeed + personalityCore",
      "input": [
        "ceremonial_but_practical_mode",
        "蒸汽走廊维护员",
        "quiet_observant"
      ],
      "derived": [
        "practical",
        "tidy",
        "workwear"
      ],
      "reason": "Mode and personality derive practical movement and daily-wear pressure."
    },
    {
      "source": "climate + presentationMode + lifestyle",
      "input": [
        [
          "humid",
          "warm",
          "steam"
        ],
        "ceremonial_but_practical_mode",
        [
          "practical",
          "tidy",
          "workwear"
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
