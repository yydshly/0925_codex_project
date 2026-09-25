/* 本站编写的中文导读：与 taxonomy-data.js 的 2026-09-26 快照按大类和顺序对应。 */
(() => {
  const data = window.toolifyTaxonomy;
  if (!data) return;
  const labels = {
    "writing-editing": `博客生成|书籍写作|配文生成|聊天内容生成|营销文案写作|求职信生成|创意写作|描述文案生成|对话文本生成|电子书生成|邮件写作|议论文写作|同人小说生成|语法检查|图像描述生成|灵感语录|职位描述生成|书信写作|情书生成|消息文本生成|电影剧本生成|名称生成|通讯简报生成|小说写作|写作大纲生成|段落生成|改写表达|情节生成|诗歌生成|商品描述生成|提示词生成|文字校对|引语生成|报告写作|内容再利用|评论生成|文章重写|脚本写作|句子生成|短篇故事生成|口号生成|拼写检查|故事生成|字幕生成|文本摘要|文本分类|文本生成|短信生成|论文写作|标题生成|通用写作|写作助手|新闻标题生成|提示词工程|简历写作`,
    "image-generation-editing": `年龄变化模拟|虚拟头像生成|背景生成|背景移除|服装区域图像处理|图像上色|角色扮演形象生成|图像裁剪|图像擦除|图像扩展|人脸替换|职业头像生成|图像合成|图像增强|图像生成|图像锐化|图像放大|局部重绘|地图生成|画面外扩|证件照制作|人物图像生成|照片编辑|照片增强|照片滤镜|老照片修复|商品摄影图生成|个人头像生成|二维码生成|写实图像生成|签名生成|风格迁移|纹理生成|模糊图像修复|二次元角色生成|壁纸生成|水印移除|年鉴风格照片|性别形象转换|以图生图|图像物体移除|文字转手写字迹|文生图`,
    "image-analysis": `图像内容描述|人脸特征分析|人脸识别|图像内容识别|图像扫描|图像分割|图像文字识别|图像反推提示词`,
    "music-audio": `音频编辑|音频音质增强|音轨拆分|节拍生成|纯音乐生成|歌词生成|音频母带处理|旋律生成|MIDI 音乐生成|音乐生成|音频降噪|说唱生成|说唱歌词生成|歌声生成|歌曲翻唱|歌曲生成|歌曲混音|音效生成|音频拆分|分轨提取|文字生成音乐|人声移除|和弦识别与建议`,
    "voice-generation-conversion": `名人音色生成|多语言配音|播客制作|播客短片生成|播客音频编辑|录音处理|语音识别|语音合成|语音转文字|文字转语音|语音转写|音视频转写|语音助手|变声处理|声音克隆|语音音质增强|语音生成|旁白配音|音频转文字|短视频风格配音`,
    "art-creative-design": `3D 模型生成|唱片封面生成|动漫艺术创作|动漫图像生成|艺术图像生成|横幅设计生成|美妆视觉创作|泳装主题图像|书籍封面生成|宣传册制作|名片设计生成|卡通形象生成|猫咪主题创作|服装设计生成|配色方案生成|涂色书生成|漫画创作|漫画制作流程|漫画生成|封面生成|设计助手|设计方案生成|电影海报风格创作|绘画创作|表情符号生成|字体生成|平面设计|发色变换|发型模拟|图标生成|插画生成|信息图生成|标志生成|日式漫画生成|设计样机生成|电影海报生成|绘画生成|图案生成|摄影创作|像素艺术生成|宝可梦主题创作|海报生成|SVG 矢量图生成|草图生成|贴纸生成|T 恤图案设计|纹身图案生成|缩略图制作|用户体验设计|矢量图形生成|时尚设计|图片转 3D 模型|故事分镜|文字生成 3D 模型`,
    "social-media": `社媒简介生成|Facebook 内容辅助|话题标签生成|网红营销辅助|Instagram 内容辅助|Instagram 配文生成|领英职业头像|领英照片生成|网络梗图生成|Instagram 虚拟模特|成人创作者平台工具|搭讪语生成|社交聊天话术|社交主页链接|社交媒体运营|社媒帖子生成|TikTok 内容辅助|推文生成|X 平台内容辅助|用户名生成|YouTube 内容辅助|YouTube 视频摘要|YouTube 封面生成|个人主页链接聚合|YouTube 标签生成`,
    "ai-detection-anti-detection": `AI 艺术图像检测|AI 检测规避改写|AI 内容检查|作文 AI 痕迹检查|内容来源检测|AI 生成内容检测|AI 图像检测|抄袭相似度检查|AI 检测规避|文本自然化改写|低可检测性文本`,
    "coding-development": `AI 开发接口|应用构建|智能浏览器|代码助手|代码生成|代码审查|开发工具|GitHub 开发辅助|落地页构建|软件测试|网页数据抓取|网站构建|日志管理|无代码与低代码开发|SQL 查询构建`,
    "video-animation": `动画视频生成|动画生成|数字人视频生成|卡通视频生成|商业广告视频生成|视频人脸替换|GIF 动图生成|口型同步生成|电影风格视频生成|音乐视频生成|短视频片段生成|短视频生成|素材视频生成|TikTok 视频生成|用户创作风格视频|视频编辑|视频画质增强|视频生成|视频录制|视频内容检索|视频摘要|视频放大增强|虚拟主播|YouTube 视频制作|图片生成视频|长视频剪短视频|脚本生成视频|文字生成视频|视频风格转换`,
    "daily-life": `婴儿形象模拟|圣经内容辅助|烹饪助手|梦境解释|健身辅助|礼物创意|神学主题对话|新闻阅读|资讯简报|穿搭生成|育儿辅助|搭讪语辅助|肖像生成|食谱建议|宗教内容辅助|自拍生成|购物助手|体育信息辅助|旅行辅助|行程规划`,
    "legal-finance": `会计辅助|合同生成|合同管理|合同审查|财务分析辅助|投资研究辅助|法律助手|房地产辅助|股票交易辅助|税务助手|交易机器人`,
    "business-management": `客户关系管理|呼叫中心辅助|客户服务|企业资源管理|面试辅助|产品经理助手|项目管理|招聘辅助|产品路线图|业务工作流`,
    "marketing-advertising": `广告创意|广告内容生成|广告投放辅助|联盟营销|陌生客户电话开发|数字营销|营销邮件生成|邮件营销|传单生成|销售线索获取|营销辅助|营销计划生成|路演材料生成|消息回复辅助|回复内容生成|用户评论管理|搜索优化工具|销售辅助|销售助手|Shopify 商店搭建|网站视觉设计|广告文案|Google 广告优化|搜索优化写作`,
    "health-wellness": `皮肤健康辅助|医疗健康辅助|医疗诊断线索|心理健康支持|症状初筛|心理咨询对话辅助`,
    "business-research": `商业点子生成|企业名称生成|公司名称生成|商业咨询辅助|加密资产信息|域名生成|区块链信息|NFT 内容与工具|Web3 内容与工具`,
    "education-translation": `问题解答|文章摘要|书籍摘要|学习辅导|课程制作|闪卡制作|作业辅导|图片文字翻译|知识库|知识图谱|知识管理|语言学习|教案生成|数学学习辅助|思维导图|题目生成|测验生成|在线测验|辅助阅读|教师助手|文本翻译|教程生成|视频翻译|语音翻译`,
    "chatbots-virtual-companions": `动漫风格虚拟伴侣|虚拟男友|虚拟角色|聊天机器人|约会建议助手|虚拟女友|笑话生成|角色扮演对话|成人主题对话`,
    "interior-architectural-design": `后院设计|户型平面图生成|室内设计|厨房设计|景观设计生成|房间规划`,
    "office-productivity": `智能体|通用助手|日历辅助|图表制作|工作协作助手|图解生成|文档字段提取|文档生成|邮件助手|Excel 公式生成|文件管理|表单处理|求职辅助|生活事务助手|会议助手|信息监测|会议笔记|笔记生成|PDF 处理|PDF 编辑|PDF 摘要|PPT 制作|演示文稿生成|效率工具|报告生成|简历生成|简历检查|标准流程文档|扫描与识别|日程表生成|日程安排|搜索引擎|电子表格|任务管理|Word 文档处理|Excel 辅助|图结构辅助|电子白板`,
    "research-data-analysis": `数据挖掘|数据分析辅助|论文资料检索|预测分析|研究论文辅助|研究工具|体育博彩信息分析|体育赛事预测`,
    "other": `游戏生成|AI 游戏|AI 模型目录|扑克游戏辅助|机器人应用|AI 工具目录|大语言模型|Minecraft 游戏辅助|成人内容工具|开源 AI 模型|其他 AI 工具`
  };

  const descriptions = {
    "ai-3d-model-generator": "根据文字或参考图生成可查看、编辑或导出的三维模型；交付质量需按用途验证。",
    "image-to-3d-model": "以二维图片为参考生成三维模型，需检查几何结构、贴图和导出格式。",
    "text-to-3d": "用文字描述生成三维资产，用于概念设计、场景或游戏素材初稿。",
    "ai-agent": "规划多步任务、调用工具并执行流程；能否自主完成取决于具体产品权限和配置。",
    "ai-document-extraction": "从票据、表单或文档中识别并抽取字段，输出可进入业务流程的结构化数据。",
    "ai-transcription": "把音频或视频中的语音转成文字，常用于字幕、会议记录与检索。",
    "ai-presentation-generator": "根据主题、文档或提纲生成演示文稿初稿，需检查结构与可编辑性。",
    "ai-avatar-video-generator": "用脚本、声音或照片驱动虚拟形象，生成讲解类视频。",
    "ai-game-generator": "用提示词生成游戏场景、交互规则或可试玩原型。",
    "ai-knowledge-base": "导入和组织资料，再对资料进行检索、问答与维护。",
    "ai-medical-diagnosis": "根据症状和资料提供诊断线索；不能代替专业医疗判断。",
    "ai-symptom-checker": "依据症状描述提供初步信息与就医线索；需要医生复核。",
    "ai-therapist": "提供心理支持式对话；不等同于专业心理治疗。",
    "large-language-models-llms": "理解和生成自然语言，可作为写作、问答、编码与智能体产品的基础模型。",
    "ai-models": "发现或使用不同 AI 模型，关注模态、性能、成本与接入方式。",
    "open-source-ai-models": "查找可获取权重或代码的模型，并核对许可证与部署要求。",
    "ai-tools-directory": "按用途和标签发现 AI 工具，比较候选产品的基本信息。",
    "ai-clothing-removal": "对服装区域进行生成式图像处理；应严格核对人物授权与隐私。",
    "ai-bypasser": "尝试改写内容以改变 AI 检测结果；效果与合规性需自行核验。",
    "bypass-ai": "尝试规避 AI 内容检测，检测器结果本身也并不可靠。",
    "undetectable-ai": "把生成文本改写得更像人工写作；不保证检测结论。",
    "humanizer-ai": "调整生成文本的表达与语气，使其更自然。",
    "ai-content-detector": "估计内容是否由 AI 生成；结果只适合参考，不能当作确定证据。",
    "ai-detector": "检测内容中的 AI 生成迹象；需要结合来源和人工判断。",
    "ai-plagiarism-checker": "比对文本相似内容，辅助发现可能的重复或引用问题。",
    "ai-face-recognition": "比对或识别图像中的人脸，使用时需考虑授权与隐私。",
    "ai-ocr": "识别图片或扫描件中的文字，转为可搜索、可编辑的文本。",
    "ai-speech-to-text": "把口语音频识别为文字，可用于字幕和会议记录。",
    "ai-text-to-speech": "把文字合成为语音，适用于旁白、朗读和配音。",
    "audio-to-text-ai": "把音频内容转换为文字，便于编辑、检索与归档。",
    "ai-text-to-music": "用文字描述曲风、情绪或结构，生成音乐片段。",
    "image-to-image": "以现有图片为输入，生成保留参考特征的新图。",
    "text-to-image": "根据文字提示生成图片，可用于概念图和视觉素材。",
    "image-to-video": "把静态图片扩展为动态片段，需检查运动一致性。",
    "text-to-video": "根据文字描述生成视频片段，需核对人物与场景连续性。",
    "video-to-video": "以已有视频为输入，修改风格或画面内容。",
    "script-to-video-ai-generator": "把脚本转成镜头、画面或视频初稿，供后续剪辑。",
    "long-video-to-short-video-ai": "从长视频提取重点片段并改编为短视频。",
    "ai-image-translator": "识别图片中的文字并翻译，尽量保留原图语境。",
    "ai-video-translator": "翻译视频中的语音或字幕，可能同时处理配音。",
    "ai-voice-translator": "识别口语并翻译为其他语言的文字或语音。",
    "ai-pdf-summarizer": "提炼 PDF 文档要点，帮助快速定位信息。",
    "ai-knowledge-graph": "把实体与关系组织成图结构，便于关联检索和分析。",
    "ai-data-mining": "从大量数据中发现模式、关联或异常。",
    "ai-sports-betting": "分析体育博彩相关信息；预测不保证收益。",
    "ai-sports-predictions": "根据赛事数据给出预测线索；结果存在不确定性。",
    "ai-stock-trading": "为股票交易提供数据分析或操作辅助；不保证投资结果。",
    "ai-investing": "辅助研究投资标的和市场信息；仍需独立判断风险。",
    "ai-trading-bot": "按策略自动处理交易信号或订单；需核对权限与风险控制。",
    "nsfw": "聚合成人向 AI 内容或工具；具体边界以产品规则为准。",
    "dirty-talking-ai": "提供成人主题的角色对话；需符合使用者年龄和平台规则。",
    "other": "难以归入现有主题的 AI 工具，需查看具体产品能力。"
  };

  const groupFallback = {
    "writing-editing": title => `围绕${title}起草、改写或校对文字内容。`,
    "image-generation-editing": title => `生成、编辑或优化${title}相关视觉素材。`,
    "image-analysis": title => `从图像中识别、提取或分析${title}相关信息。`,
    "music-audio": title => `对音乐或音频进行${title}相关创作与处理。`,
    "voice-generation-conversion": title => `对语音进行${title}相关识别、生成或编辑。`,
    "art-creative-design": title => `辅助制作${title}相关的设计或视觉作品。`,
    "social-media": title => `辅助制作、发布或分析${title}相关内容。`,
    "ai-detection-anti-detection": title => `检查${title}相关的内容特征或来源；结论需人工复核。`,
    "coding-development": title => `辅助完成${title}相关的开发、测试或部署任务。`,
    "video-animation": title => `制作、编辑或分析${title}相关视频内容。`,
    "daily-life": title => `围绕${title}提供日常信息、建议或内容生成。`,
    "legal-finance": title => `辅助整理和分析${title}相关资料；重要决策需专业复核。`,
    "business-management": title => `帮助记录、协调或自动化${title}相关业务流程。`,
    "marketing-advertising": title => `辅助制作或优化${title}相关营销活动与素材。`,
    "health-wellness": title => `提供${title}相关信息或辅助记录；不能代替专业诊疗。`,
    "business-research": title => `提供${title}相关资料发现、构思或分析工具。`,
    "education-translation": title => `辅助${title}相关的学习、知识组织或翻译任务。`,
    "chatbots-virtual-companions": title => `提供${title}主题的对话或虚拟角色体验。`,
    "interior-architectural-design": title => `辅助规划和展示${title}方案，仍需核对尺寸与施工条件。`,
    "office-productivity": title => `辅助处理${title}相关文档、安排或日常工作流程。`,
    "research-data-analysis": title => `收集、整理或分析${title}相关资料和数据。`,
    "other": title => `提供${title}相关工具或内容，具体能力因产品而异。`
  };

  function explain(category, group, title) {
    if (descriptions[category.slug]) return descriptions[category.slug];
    const name = category.name;
    const subject = title.replace(/(生成|制作|构建|写作)$/, "");
    if (/Generator|Maker|Builder|Writer|Writing/.test(name)) {
      const review = group.id === "legal-finance" ? "，重要内容需专业复核" : "，供后续编辑与核对";
      return `根据主题、提示或已有材料生成${subject}初稿${review}。`;
    }
    if (/Summarizer|Summary/.test(name)) return `从${title.replace(/摘要$/, "")}内容中提炼要点，便于阅读与检索。`;
    if (/Translator|Translate/.test(name)) return `识别并翻译${title.replace(/翻译$/, "")}内容，需核对术语与语境。`;
    if (/Detector|Checker|Review/.test(name)) return `检查${title.replace(/(检测|检查|审查)$/, "")}相关内容，结果需结合人工判断。`;
    if (/Recognition|Scanning|Transcriber/.test(name)) return `识别${title.replace(/(识别|扫描|转写)$/, "")}相关输入，并输出可用信息。`;
    return groupFallback[group.id](title);
  }

  for (const group of data.groups) {
    const translated = labels[group.id]?.split("|");
    if (!translated || translated.length !== group.categories.length) {
      throw new Error(`中文细分类数量不匹配：${group.id}，${translated?.length} / ${group.categories.length}`);
    }
    group.categories.forEach((category, index) => {
      category.zh = translated[index];
      category.description = explain(category, group, category.zh);
    });
  }
})();
