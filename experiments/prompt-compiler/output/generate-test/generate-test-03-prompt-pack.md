# Test 03 - Generate Test Prompt Pack

## Test Purpose
Test whether the current 2.0 workflow can produce one original broad thick adult male full-body character prompt with white fitted innerwear anchor, coherent outfit structure, readable motif-to-garment translation, restrained fantasy, and clean TV anime cel shading.

## Chinese Prompt
单人全身角色设定图，从头到脚完整可见，白底或浅色背景；港口社区出身，原创成年男性角色，整体成熟厚实、稳定可靠。
壮硕厚实，宽肩厚胸，手臂和腿部有力量；成熟男性脸型，发型简洁可读，平静专注的表情。
整体带有港口社区bridge lantern inspector气质，以bridge cable lines、lantern frame为母题。
服装以白色贴身内搭紧贴厚实躯干，布料下能轻微读出胸肌与腹肌的大块轮廓，强调被包裹住的力量感，腹部结构清楚但概括，不做细碎肌肉刻画；外层是工装夹克，短版轮廓，下装为七分功能裤，直筒轮廓，白色小腿袜清楚可见，搭配简洁实用的深色鞋履，上半身主视觉清楚，下半身稳定支撑。服装将bridge cable lines和lantern frame转成前襟tensioned diagonal front panel，保持方整秩序，线条在边缘克制中断，主片切出窄条边，不遮白色内搭。
奇幻元素轻量集中，不抢服装主体。
配色干净，主色和点缀色分明。京都动画式清爽线条、干净赛璐璐阴影，游戏角色设定感，大形主导，中低细节密度，轮廓清楚；不要写实摄影、厚涂、复杂纹理、文字、UI、多人或身体裁切。

全局规则：单人全身角色设定图，从头到脚完整可见；原创成年男性，不是服装展示架；宽肩厚胸、厚实躯干、粗壮手臂和结实腿部，成熟稳重。保留白色贴身内搭作为身体锚点，内搭贴合厚实躯干，布料下轻微读出胸肌与腹肌的大块概括轮廓，强调被包裹住的力量感，不做细碎六块腹肌、湿身、油亮、写实健美或过度性感。服装像一整套，主题母题转化为服装块面、分割线、口袋、护片、肩部结构、腰部结构或少量克制呼应，不要贴徽章、碎图案或随机拼装。大形主导、中低细节密度、干净 TV 动画赛璐璐风格。

## English Prompt
Single full-body character design sheet, the entire figure visible from head to toe, on a white or clean light background. Create one original adult male character from harbor_district, designed as a believable person first and not as a costume showcase. He suggests a bridge lantern inspector, mature, sturdy, thick-built, grounded, and reliable, with wide shoulders, thick chest, powerful arms, strong legs, a mature masculine face, readable hairstyle, and calm focused expression. His design is grounded in real daily activity: checks lantern brackets, wipes rain lenses, marks cable tension points, around windy bridge service walkway. Keep the white fitted inner top visible as the body anchor. The inner top should cling to the thick torso enough to suggest broad chest mass and large simplified abdominal forms under the fabric, with a restrained wrapped and contained feeling, not exposed muscles. Body-display logic: fitted fit, closed outerwear, covered exposure, low-key body display; keep it adult, stylish, non-explicit, and fully designed as clothing. Keep abdominal definition broad, simplified, and restrained, not finely segmented, not shredded, not wet, not oily, not hyper-realistic, and not sexualized. Translate bridge cable lines, lantern frame and tension marker bands into garment structure: panels, seams, pockets, guards, waist structures, shoulder structures, and a few restrained accents. Garment logic: white fitted inner top remains the body anchor; fitted fabric lightly shows broad chest and large simplified abdominal forms; more closed practical outer layer; waterproof cloth, dull brass, rubber hems. The outfit must feel coherent as one garment system, with large-shape dominant design, clear silhouette, medium-low detail density, one main visual focus and one secondary focus, restrained fantasy, and only a few medium-to-large motifs. Use clean TV anime cel-shaded style, Kyoto-animation-like crisp linework, simple shadow blocks, and game character design sensibility.

## Negative Prompt
photorealistic, realistic rendering, oil painting, painterly thick paint, messy texture, excessive small buckles, excessive straps, tiny ornaments everywhere, dense micro patterns, flat poster pattern pasted on clothes, abstract graphic poster outfit, text, logo, UI, watermark, multiple characters, cropped body, missing feet, bad anatomy, skinny body, childish proportions, big head, six-pack, shredded abs, ripped, wet shirt, oily skin, hyper-realistic muscle, finely segmented abs, sexualized outfit, prop sheet, turnaround sheet

## Reference Image Usage Note
Reference image path: E:\wk\GitHub\Oc-Character\experiments\prompt-compiler\assets\reference\body-style-anchor.png
Project relative path: experiments/prompt-compiler/assets/reference/body-style-anchor.png
Use the uploaded reference image only for body style, broad thick adult male proportions, very wide shoulders, thick chest, strong arms, thick torso, sturdy legs, mature steady adult male presence, clean TV anime cel-shaded style, simple clean linework, large simplified body-structure feeling, and white fitted innerwear body-anchor direction.
Do not copy the reference image character identity, face, facial features, hairstyle, expression, clothing style, pants, shoes, pose, colors, props, or background.

## Observation Checklist
- 是否是单人全身
- 是否从头到脚完整可见，没有裁切
- 是否保留宽肩厚胸、壮硕厚实成年男性体型
- 是否保持成熟成年男性感觉，不要变瘦、幼化或大头化
- 是否保留白色贴身内搭
- 白色贴身内搭是否像包裹住厚实躯干，而不是松垮普通 T-shirt
- 布料下是否能轻微读出胸肌与腹肌的大块轮廓
- 腹部轮廓是否是大块、概括、克制的，而不是细碎六块腹肌
- 是否避免湿身、油亮、写实健美、过度性感化
- 主题母题是否被转化成服装结构，而不是只贴成徽章或图案
- 是否能看到母题变成了服装块面、分割线、口袋、护片、肩部结构、腰部结构或少量点状呼应
- 服装是否像一整套，而不是随机拼装
- 下装长度是否符合当前 case
- 如果当前 case 要求短裤、裁短裤或露踝裤，是否出现对应裤长
- 如果当前 case 要求白袜，是否出现清楚可见的白色袜子
- 如果当前 case 是 full-length 长裤方向，是否没有乱露白袜
- 主题方向是否清楚，不要变成普通现代路人
- 核心母题是否准确，不要被泛用装饰取代
- 是否保持干净 TV 动画赛璐璐风格
- 是否保持大形主导、中低细节密度、高可读性
- 是否避免大量小扣件、小带子、小挂件、碎纹样
- 是否避免文字、logo、UI、水印
- 是否避免多人、三视图、道具拆解页
- desire / body display 是否被翻译成服装贴身度、露肤程度和外套开合，而不是抽象符号
- 如果角色更性感，是否仍然有完整服装设计
- 是否避免裸体、湿身、油亮和色情化
- 是否保留成年厚实男性体型和白色贴身内搭锚点
- 是否通过剪裁和搭配表达自信，而不是只靠裸露
