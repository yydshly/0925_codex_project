# RVC 能力总览图制作记录

工具：内置 image_gen（生成后调整背景对比度）。

最终图片：../../docs/projects/001-rvc-voice-conversion/assets/rvc-capabilities-overview.png

资料依据：
- https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI
- https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/docs/cn/cli.md
- https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/realtime_gui.py

## 初始提示词

Use case: infographic-diagram. Generate ONE high-resolution portrait Chinese infographic, approximately 1600x2200, elegant crisp scientific/business explainer, large readable simplified Chinese text, generous spacing, navy background header, white body, teal/purple/orange accents, rounded diagram panels, real Chinese typography. All information fits one image. Title "RVC 能力总览". Subtitle "把已有的讲话或歌声，转换成目标声线". This is a capability map, not a detailed algorithm flowchart.

Top core workflow, three large connected nodes: "已有录音 / 麦克风" → "RVC + 目标声线模型" → "转换后的声音". Below "尽量保留内容、节奏与音高走势，主要改变说话人的声音特征。"

Main middle 6 capability cards in 2 columns, 3 rows, with large numbered icons and these exact texts:
01 "录音换声" / "输入：讲话录音 + 声线模型" / "输出：目标声线的录音" / "可用于：台词、旁白、角色声音实验"
02 "歌声换声" / "输入：已有歌声 + 声线模型" / "输出：目标声线的演唱" / "保留原演唱的旋律与节奏，效果需试听"
03 "实时变声" / "输入：麦克风声音" / "输出：持续转换的音频" / "接入直播或聊天需配置音频路由；存在延迟"
04 "训练自己的声线" / "输入：清晰、统一的目标声音素材" / "产出：声线模型与可选特征索引" / "从预训练底模继续学习"
05 "批量与参数控制" / "批量转换多段音频" / "调整升降调、检索比例等参数" / "网页操作或命令行调用"
06 "人声分离与声线管理" / "辅助：分离人声和伴奏，需额外模型" / "支持多说话人训练与选择" / "模型融合可探索不同音色"

Next section title "在自己的电脑上，需要准备什么？". Compact horizontal 4 boxes with plus signs: "RVC 程序" + "基础模型：HuBERT、RMVPE 等" + "目标声线 .pth" + "可选索引 .index". Footer below this row "基础模型通常共用；更换声线主要更换目标模型。CPU / 显卡负责计算，速度取决于设备。". Make clear .index is data, label "检索数据".

Next section title "可以组合成什么应用？" with 3 short workflow rows:
"配音制作：录台词 → RVC 换声 → 试听与导出"
"音乐制作：分离人声 → RVC 换声 → 另行混回伴奏"
"文字配音：外部 TTS 生成语音 → RVC 换声"
External steps (TTS, mixing) in gray, RVC steps teal.

Bottom section title "能力边界". Three concise bullets:
"核心输入是声音；文字转语音、翻译与作曲需其他工具。"
"相似度、清晰度与实时延迟受素材、模型和设备影响。"
"可本地运行，也可部署到服务器；网页界面本身不执行模型计算。"
Small footer "依据：RVC 官方 README、CLI 文档与实时转换代码｜能力说明，不代表本项目已部署模型"
Do not add unsupported promises, guaranteed latency numbers, perfect cloning, automatic translation, or automatic composition. No giant AI brain illustration, no text overflow, no watermark. Show all sections in one complete image; generous readable text.

## 调整提示词

Edit this RVC 能力总览 infographic. Preserve all layout, diagrams, capability categories, Chinese content, colors, and arrows. One precise correction: the entire page background below the navy title banner must be a SOLID OPAQUE WHITE (#FFFFFF), no transparency anywhere, and all section titles, small text, footer citations must be dark navy or dark gray and clearly readable against it. Remove noisy dark/transparent gaps and stray colored pixels. Flat clean print-ready background. In the fourth model requirements box use the exact title “可选索引 .index”, subtitle “检索数据”, with no misspelling. Do not add new decorative English copy. Maintain large high-resolution portrait output.
