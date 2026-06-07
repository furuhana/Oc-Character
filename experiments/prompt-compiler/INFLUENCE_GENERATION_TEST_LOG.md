# Influence Generation Layer Test Log

Generated: 2026-06-07

Scope: regression test for Influence Generation Layer + Reasonability Filter. No image test, no footwear/accessory/weapon development.

## Summary

- Seeds: 20
- Reasonability warnings: 4 / 20
- Reasonability fixes: 4 / 20
- Normal compression notes: 20 / 20
- ImageFinal length range: 299-316 Chinese characters
- Non-full bottom length: 5 / 20
- Explicit shorts: 4 / 20
- Full-length visible socks: 0 / 20
- Punctuation issues: none
- Shorts remaining after full-length fix: none

## Distribution

### Bottom Length

```json
{
  "full_length": 14,
  "knee_length": 4,
  "calf_length": 1,
  "ankle_length": 1
}
```

### Sock Visibility

```json
{
  "hidden": 14,
  "dominant_visible": 4,
  "clearly_visible": 1,
  "slightly_visible": 1
}
```

## 20 Seed Table

| Seed | primaryInfluences | derivedInfluences summary | resolvedInfluences summary | reasonability score | warnings | fixesApplied | final bottom length | sock visibility | outerwear type | imageFinal length |
|---|---|---|---|---:|---|---|---|---|---|---:|
| influence-mvp-1 | generic_civic_worker; japanese_small_town; mid_30s; bulky_soft_strong; cheerful_loud; work_mode; 城市公共事务员; contemporary_modern | climate=temperate; env=木牌; lifestyle=casual/relaxed/practical/tidy/workwear; bottom=ankle_or_full_balanced; sock=white_socks_visible_only_if_ankle_or_calf_exposed | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=深蓝/旧白; formality=medium; practicality=medium; fantasy=low | 95 | Balanced bottom-length influence produced shorts. | Changed shorts to full-length trousers under balanced bottom-length bias. | full_length | hidden | cropped jacket | 303 |
| influence-mvp-2 | harbor_pressure_maintenance; latin_american_hill_town; early_30s; bulky_soft_strong; quiet_observant; daily_portrait_mode; 港口仓库维修员; industrial_service | climate=coastal/humid/windy/street/seasonal_warm_possible; env=harbor_service_area/wet_metal; lifestyle=practical/tidy/workwear; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=土红/暖黄; formality=low_medium; practicality=high; fantasy=low | 100 | - | - | knee_length | dominant_visible | work jacket | 314 |
| influence-mvp-3 | bathhouse_keeper; eastern_europe_old_quarter; early_40s; bulky_soft_strong; quiet_observant; ceremonial_but_practical_mode; 蒸汽走廊维护员; folk_fantasy_light | climate=humid/warm/steam; env=旧电车街; lifestyle=practical/tidy/workwear; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=深灰/酒红; formality=medium_high; practicality=high; fantasy=restrained | 94 | Full-length-preferred influence produced shorts. | Changed shorts to full-length trousers under full_length_preferred bias. | full_length | hidden | utility vest | 302 |
| influence-mvp-4 | rain_infrastructure_observer; kyoto_old_street; early_40s; heavy_power_build; blunt_honest; off_duty_mode; 排水路径巡查员; rainy_infrastructure | climate=humid/rainy/warm; env=wet_street/drainage_path; lifestyle=casual/relaxed; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=墨蓝/旧白; formality=low; practicality=high; fantasy=low | 100 | - | - | full_length | hidden | hoodie jacket | 303 |
| influence-mvp-5 | night_patrol; southeast_asian_rain_street; mid_30s; bulky_soft_strong; blunt_honest; combat_ready_mode; 社区设施看护; old_city_modern | climate=humid/rainy/warm; env=雨棚; lifestyle=practical; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=wet gray/deep blue; formality=medium_high; practicality=medium; fantasy=low | 100 | - | - | knee_length | dominant_visible | work jacket | 309 |
| influence-mvp-6 | urban_fantasy_worker; middle_eastern_bazaar; early_40s; thick_chubby_muscular; patient_caretaker; work_mode; 都市奇幻劳动者; fantasy_urban | climate=temperate; env=巴扎; lifestyle=practical/tidy/workwear; bottom=ankle_or_full_balanced; sock=white_socks_visible_only_if_ankle_or_calf_exposed | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=砂色/深绿; formality=medium; practicality=medium; fantasy=restrained | 95 | Balanced bottom-length influence produced shorts. | Changed shorts to full-length trousers under balanced bottom-length bias. | full_length | hidden | work jacket | 308 |
| influence-mvp-7 | bathhouse_keeper; central_asian_market; late_30s; heavy_power_build; blunt_honest; patrol_mode; 蒸汽走廊维护员; folk_fantasy_light | climate=humid/warm/steam/street/seasonal_warm_possible; env=crowded_market/stall_lights; lifestyle=practical/mobile/guardian/tidy/workwear; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=沙色/深红; formality=medium; practicality=high; fantasy=restrained | 100 | - | - | full_length | hidden | hoodie jacket | 300 |
| influence-mvp-8 | library_stack_keeper; kyoto_old_street; late_30s; heavy_power_build; patient_caretaker; combat_ready_mode; 旧书库管理员; civic_urban_fantasy | climate=temperate; env=indoor_archive/vertical_storage; lifestyle=practical; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=long coat/cardigan/blazer; material=wool blend/matte fabric; color=墨蓝/旧白; formality=medium_high; practicality=medium; fantasy=restrained | 100 | - | - | full_length | hidden | cardigan | 300 |
| influence-mvp-9 | shelter_night_school_guide; north_african_medina; mid_30s; heavy_power_build; quiet_observant; off_duty_mode; 安全出口引导员; civic_urban_fantasy | climate=street/seasonal_warm_possible; env=老城巷道; lifestyle=casual/relaxed; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=砂白/靛蓝; formality=low; practicality=medium; fantasy=restrained | 100 | - | - | full_length | hidden | work jacket | 307 |
| influence-mvp-10 | library_stack_keeper; mountain_town; early_30s; thick_chubby_muscular; blunt_honest; off_duty_mode; 归档通道守护员; civic_urban_fantasy | climate=temperate; env=indoor_archive/vertical_storage; lifestyle=casual/relaxed; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=long coat/cardigan/blazer; material=wool blend/matte fabric; color=深绿/雾灰; formality=low; practicality=medium; fantasy=restrained | 100 | - | - | calf_length | clearly_visible | long coat | 308 |
| influence-mvp-11 | underground_fitness_trainer; central_asian_market; early_30s; very_broad_frame; patient_caretaker; work_mode; 地下商场训练员; civic_urban_fantasy | climate=humid/rainy/warm/street/seasonal_warm_possible; env=crowded_market/stall_lights; lifestyle=athletic/practical/tidy/workwear; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=沙色/深红; formality=medium; practicality=high; fantasy=restrained | 100 | - | - | knee_length | dominant_visible | hoodie jacket | 315 |
| influence-mvp-12 | bathhouse_keeper; latin_american_hill_town; late_30s; thick_chubby_muscular; calm_reliable; combat_ready_mode; 澡堂热水房看护; folk_fantasy_light | climate=humid/warm/steam/street/seasonal_warm_possible; env=山城坡道; lifestyle=practical; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=hoodie jacket/work jacket/utility vest; material=waterproof fabric/rubber; color=土红/暖黄; formality=medium_high; practicality=medium; fantasy=restrained | 100 | - | - | full_length | hidden | work jacket | 304 |
| influence-mvp-13 | market_guard; kyoto_old_street; mid_30s; heavy_power_build; quiet_observant; ceremonial_but_practical_mode; 市场夜巡; market_night_shift | climate=street/seasonal_warm_possible; env=crowded_market/stall_lights; lifestyle=practical; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=墨蓝/旧白; formality=medium_high; practicality=high; fantasy=low | 94 | Full-length-preferred influence produced shorts. | Changed shorts to full-length trousers under full_length_preferred bias. | full_length | hidden | cropped jacket | 302 |
| influence-mvp-14 | postal_courier; central_asian_market; early_30s; very_broad_frame; blunt_honest; combat_ready_mode; 车站边街区递送员; old_city_modern | climate=street/seasonal_warm_possible; env=crowded_market/stall_lights; lifestyle=practical; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=沙色/深红; formality=medium_high; practicality=medium; fantasy=low | 100 | - | - | ankle_length | slightly_visible | work jacket | 316 |
| influence-mvp-15 | night_patrol; eastern_europe_old_quarter; early_40s; very_broad_frame; quiet_observant; work_mode; 城市公共事务员; old_city_modern | climate=temperate; env=旧电车街; lifestyle=practical/tidy/workwear; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=深灰/酒红; formality=medium; practicality=medium; fantasy=low | 100 | - | - | knee_length | dominant_visible | bomber jacket | 313 |
| influence-mvp-16 | book_repair_binder; japanese_small_town; early_30s; heavy_power_build; patient_caretaker; off_duty_mode; 旧书修复师; old_city_modern | climate=temperate; env=indoor_archive/vertical_storage; lifestyle=casual/relaxed; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=long coat/cardigan/blazer; material=wool blend/matte fabric; color=深蓝/旧白; formality=low; practicality=medium; fantasy=low | 100 | - | - | full_length | hidden | cardigan | 300 |
| influence-mvp-17 | urban_fantasy_worker; japanese_small_town; mid_30s; thick_chubby_muscular; serious_focused; ceremonial_but_practical_mode; 架空街区守护员; fantasy_urban | climate=temperate; env=木牌; lifestyle=practical/tidy/workwear; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=深蓝/旧白; formality=medium_high; practicality=medium; fantasy=restrained | 100 | - | - | full_length | hidden | bomber jacket | 313 |
| influence-mvp-18 | book_repair_binder; mountain_town; mid_30s; thick_chubby_muscular; cheerful_loud; patrol_mode; 旧书修复师; old_city_modern | climate=temperate; env=indoor_archive/vertical_storage; lifestyle=casual/relaxed/practical/mobile/guardian; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=long coat/cardigan/blazer; material=wool blend/matte fabric; color=深绿/雾灰; formality=medium; practicality=high; fantasy=low | 100 | - | - | full_length | hidden | long coat | 299 |
| influence-mvp-19 | clock_tower_maintainer; north_african_medina; early_30s; very_broad_frame; warm_protective; off_duty_mode; 老钟楼校时员; old_city_modern | climate=street/seasonal_warm_possible; env=老城巷道; lifestyle=casual/relaxed; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=砂白/靛蓝; formality=low; practicality=medium; fantasy=low | 100 | - | - | full_length | hidden | cropped jacket | 303 |
| influence-mvp-20 | market_guard; western_europe_old_town; early_30s; thick_chubby_muscular; patient_caretaker; daily_portrait_mode; 市场夜巡; market_night_shift | climate=dry/cold_possible/old_city/street/seasonal_warm_possible; env=crowded_market/stall_lights; lifestyle=practical; bottom=full_length_preferred; sock=white_socks_hidden_or_slight | outer=work jacket/cropped jacket/bomber jacket; material=cotton canvas/matte fabric; color=海军蓝/旧白; formality=low_medium; practicality=high; fantasy=low | 100 | - | - | full_length | hidden | bomber jacket | 302 |

## Reasoning Chain Checks

Observed derived influence chains include:

1. harbor / port context -> coastal, humid, windy -> waterproof fabric / rubber -> work or utility outerwear.
2. rain infrastructure -> humid, rainy, warm -> waterproof material bias -> hoodie/work/utility jacket.
3. market + daily/patrol mode -> seasonal warm street context -> short_or_cropped_allowed -> visible white socks when leg is exposed.
4. library/book/archive theme -> indoor_archive / quiet_heavy_space -> wool or matte fabric -> full_length_preferred.
5. bottomLengthBias -> sockBias -> exposed ankle/calf/knee produces visible white socks, full_length keeps socks hidden.

## Regression Checks

- Motif compression is now recorded as compressionNotes unless the motif count is truly over threshold.
- Filter fixes that change bottom length also align bottom baseType and sock visibility before imageFinal.
- imageFinal punctuation cleanup removes repeated Chinese periods and malformed punctuation.
- Theme-specific motifs now take priority over generic region/fantasy motifs.

## Representative ImageFinal Cases

### Harbor / humid / workwear direction

- seed: influence-mvp-2
- primaryInfluences: harbor_pressure_maintenance; latin_american_hill_town; early_30s; bulky_soft_strong; quiet_observant; daily_portrait_mode; 港口仓库维修员; industrial_service
- derivedInfluences summary: climate=coastal/humid/windy/street/seasonal_warm_possible; env=harbor_service_area/wet_metal; lifestyle=practical/tidy/workwear; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed
- reasonabilityFilter: score 100; warnings=-; fixes=-; compressionNotes=Compressed normal motif list to 1-2 must-render motifs without warning.

```text
单人全身角色设定图，从头到脚完整可见，白底或浅色背景；拉美山城出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有拉美山城港区压力维护气质，以压力阀、管线为母题。
服装以白色贴身内搭为身体锚点，外层是工装夹克，上半身厚重轮廓，下装为工装短裤，宽松轮廓，搭配清楚的白色长袜，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。
奇幻元素轻量集中，不抢服装主体。
配色干净，主色和点缀色分明。京都动画式清爽线条、干净赛璐璐阴影，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。
```

### Library / indoor / full-length trousers direction

- seed: influence-mvp-8
- primaryInfluences: library_stack_keeper; kyoto_old_street; late_30s; heavy_power_build; patient_caretaker; combat_ready_mode; 旧书库管理员; civic_urban_fantasy
- derivedInfluences summary: climate=temperate; env=indoor_archive/vertical_storage; lifestyle=practical; bottom=full_length_preferred; sock=white_socks_hidden_or_slight
- reasonabilityFilter: score 100; warnings=-; fixes=-; compressionNotes=Compressed normal motif list to 1-2 must-render motifs without warning.

```text
单人全身角色设定图，从头到脚完整可见，白底或浅色背景；京都老街出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有京都老街书库看护气质，以书签、索引签为母题。
服装以白色贴身内搭为身体锚点，外层是开衫，A 字轮廓，下装为宽松日常长裤，宽松轮廓，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。
奇幻元素轻量集中，不抢服装主体。
配色干净，主色和点缀色分明。京都动画式清爽线条、干净赛璐璐阴影，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。
```

### Rain infrastructure / waterproof material direction

- seed: influence-mvp-4
- primaryInfluences: rain_infrastructure_observer; kyoto_old_street; early_40s; heavy_power_build; blunt_honest; off_duty_mode; 排水路径巡查员; rainy_infrastructure
- derivedInfluences summary: climate=humid/rainy/warm; env=wet_street/drainage_path; lifestyle=casual/relaxed; bottom=short_or_cropped_allowed; sock=white_socks_likely_visible_when_exposed
- reasonabilityFilter: score 100; warnings=-; fixes=-; compressionNotes=Compressed normal motif list to 1-2 must-render motifs without warning.

```text
单人全身角色设定图，从头到脚完整可见，白底或浅色背景；京都老街出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有京都老街雨水设施观测气质，以雨线、水位刻度为母题。
服装以白色贴身内搭为身体锚点，外层是连帽外套，短版轮廓，下装为直筒工装裤，宽松轮廓，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。
奇幻元素轻量集中，不抢服装主体。
配色干净，主色和点缀色分明。京都动画式清爽线条、干净赛璐璐阴影，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。
```

### Ceremonial practical case fixed by filter

- seed: influence-mvp-3
- primaryInfluences: bathhouse_keeper; eastern_europe_old_quarter; early_40s; bulky_soft_strong; quiet_observant; ceremonial_but_practical_mode; 蒸汽走廊维护员; folk_fantasy_light
- derivedInfluences summary: climate=humid/warm/steam; env=旧电车街; lifestyle=practical/tidy/workwear; bottom=full_length_preferred; sock=white_socks_hidden_or_slight
- reasonabilityFilter: score 94; warnings=Full-length-preferred influence produced shorts.; fixes=Changed shorts to full-length trousers under full_length_preferred bias.; compressionNotes=Compressed normal motif list to 1-2 must-render motifs without warning.

```text
单人全身角色设定图，从头到脚完整可见，白底或浅色背景；东欧旧城区出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有东欧旧城区澡堂看护气质，以蒸汽、热水管为母题。
服装以白色贴身内搭为身体锚点，外层是功能背心，箱型轮廓，下装为直筒工装裤，直筒轮廓，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。
奇幻元素轻量集中，不抢服装主体。
配色干净，主色和点缀色分明。京都动画式清爽线条、干净赛璐璐阴影，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。
```

## Verdict

- Influence sources are generated and recorded in primaryInfluences.
- derivedInfluences are visibly derived from themeCategory, regionContext, presentationMode, occupationSeed, and worldFlavorSeed.
- resolvedInfluences are attached to downstream modules and used for outerwear, bottom length, sock behavior, material, color, fantasy density, and formality.
- reasonabilityFilter warnings are no longer a fixed 20/20 motif warning; normal motif compression is diagnostic but not a warning.
- imageFinal remains compressed and natural; no internal field names or repeated punctuation were observed.
- Bottom/sock distribution remains within the target range.
