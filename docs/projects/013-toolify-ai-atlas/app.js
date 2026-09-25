const groups = [
  { id: "all", name: "全部类别" },
  { id: "knowledge", name: "对话与知识工作" },
  { id: "creative", name: "多媒体创作" },
  { id: "build", name: "开发与流程" },
  { id: "growth", name: "增长与商业" },
  { id: "analysis", name: "研究与识别" },
  { id: "domain", name: "生活与专业场景" }
];

// 类别名称与顺序取自 Toolify 首页。能力描述是本站按典型任务做的概括。
const categories = [
  {
    id: "chatbots", group: "knowledge", zh: "对话与虚拟陪伴", en: "Chatbots & Virtual Companions", slug: "chatbots-virtual-companions",
    summary: "以对话为入口，完成问答、陪伴或客服沟通。", input: "问题、上下文、知识资料", output: "回答、建议、会话记录",
    tags: ["问答", "角色互动", "客服"], tasks: ["解释问题并持续追问", "基于资料回答用户", "按设定角色交流"],
    watch: "检查事实和引用；客服场景还要确认知识来源与转人工机制。"
  },
  {
    id: "office", group: "knowledge", zh: "办公与生产力", en: "Office & Productivity", slug: "office-productivity",
    summary: "把资料处理、日程和重复办公动作做得更快。", input: "邮件、会议、文件、任务", output: "纪要、待办、文档、自动化动作",
    tags: ["会议纪要", "文档", "日程"], tasks: ["提炼会议结论和待办", "总结长文档与邮件", "串联重复的办公步骤"],
    watch: "确认它能否接入你正在使用的软件，以及是否保留原始出处。"
  },
  {
    id: "art", group: "creative", zh: "艺术与创意设计", en: "Art & Creative Design", slug: "art-creative-design",
    summary: "从创意描述发展成视觉概念与设计素材。", input: "创意简报、参考图、品牌约束", output: "概念图、版式草案、设计元素",
    tags: ["概念设计", "海报", "素材"], tasks: ["探索多种视觉方向", "制作可讨论的初稿", "将参考风格应用到新素材"],
    watch: "检查品牌一致性、可编辑性、版权和商用授权。"
  },
  {
    id: "coding", group: "build", zh: "编程与开发", en: "Coding & Development", slug: "coding-development",
    summary: "辅助写代码，也能按描述构建应用或工作流。", input: "需求、代码库、错误信息", output: "代码、应用、测试与修改建议",
    tags: ["应用构建", "代码辅助", "测试"], tasks: ["把需求转成可运行原型", "解释并修复错误", "生成测试或审查代码"],
    watch: "必须运行和审查生成结果；留意部署、数据存储与维护责任。"
  },
  {
    id: "images", group: "creative", zh: "图像生成与编辑", en: "Image Generation & Editing", slug: "image-generation-editing",
    summary: "生成图片，或对已有图片做编辑与增强。", input: "文字描述、参考图、原图", output: "新图、修图、放大图",
    tags: ["文生图", "修图", "放大"], tasks: ["生成配图和产品概念图", "移除背景或替换局部", "提升低清素材质量"],
    watch: "人物、品牌和细节一致性需要逐张检查。"
  },
  {
    id: "video", group: "creative", zh: "视频与动画", en: "Video & Animation", slug: "video-animation",
    summary: "从文字、图片或片段生成与编辑动态内容。", input: "脚本、图片、已有视频", output: "视频片段、字幕、动画或成片",
    tags: ["视频生成", "剪辑", "字幕"], tasks: ["根据脚本制作短片", "自动剪辑并配字幕", "把静态画面变成动态镜头"],
    watch: "重点检查镜头连贯、声音同步和可复用素材的授权。"
  },
  {
    id: "writing", group: "knowledge", zh: "文本生成与编辑", en: "Writing & Editing", slug: "writing-editing",
    summary: "起草、改写、校对并适配不同表达场合。", input: "主题、素材、写作要求", output: "文章、摘要、邮件、文案",
    tags: ["写作", "改写", "摘要"], tasks: ["从资料整理初稿", "调整语气和篇幅", "校对结构与语言"],
    watch: "需要核对事实、引用与品牌语气；重要文本保留人工编辑。"
  },
  {
    id: "education", group: "knowledge", zh: "学习辅助与翻译", en: "Education & Translation", slug: "education-translation",
    summary: "解释知识、提供练习，并帮助跨语言理解。", input: "教材、问题、原文或语音", output: "讲解、练习、译文",
    tags: ["辅导", "练习", "翻译"], tasks: ["把难点拆成步骤讲解", "按水平生成练习", "翻译并解释语境"],
    watch: "学习场景要辨别错误讲解；正式译文应由懂领域的人复核。"
  },
  {
    id: "voice", group: "creative", zh: "语音生成与转换", en: "Voice Generation & Conversion", slug: "voice-generation-conversion",
    summary: "让声音变成文字，或让文字与声音生成新语音。", input: "录音、文字、授权音色", output: "转写、配音、变声结果",
    tags: ["转写", "配音", "声音转换"], tasks: ["会议或视频语音转写", "为脚本生成配音", "对已有声音做转换"],
    watch: "注意说话人授权、语种效果、延迟和背景噪声。"
  },
  {
    id: "business", group: "build", zh: "企业管理", en: "Business Management", slug: "business-management",
    summary: "把客户、项目、招聘和服务流程组织起来。", input: "客户记录、工单、业务规则", output: "跟进建议、任务、自动化处理",
    tags: ["CRM", "工作流", "客服"], tasks: ["整理客户和销售线索", "分配任务并追踪进度", "自动回答常见服务问题"],
    watch: "核对权限、数据流向，以及自动操作是否需要审批。"
  },
  {
    id: "music", group: "creative", zh: "音乐与音频", en: "Music & Audio", slug: "music-audio",
    summary: "制作歌曲、音效，或处理已有音轨。", input: "文字、旋律、歌词、音频", output: "歌曲、伴奏、分轨、音效",
    tags: ["作曲", "分轨", "音效"], tasks: ["生成歌曲或背景音乐", "从歌曲中提取人声和伴奏", "消噪、母带或音频增强"],
    watch: "发布前确认商用条款、旋律相似性和素材来源。"
  },
  {
    id: "detection", group: "analysis", zh: "AI 检测与反检测", en: "AI Detection & Anti-Detection", slug: "ai-detection-anti-detection",
    summary: "评估内容来源、相似性，或调整机器生成文本的表达。", input: "文字、图片、待检查内容", output: "概率提示、相似性报告、改写文本",
    tags: ["内容检测", "查重", "改写"], tasks: ["筛查疑似机器生成内容", "检查文本相似性", "改善不自然的表达"],
    watch: "检测结果通常只能当线索，不宜单凭一个分数作重要判断。"
  },
  {
    id: "marketing", group: "growth", zh: "商业营销与广告", en: "Marketing & Advertising", slug: "marketing-advertising",
    summary: "研究受众、制作广告素材并优化获客。", input: "产品定位、用户画像、渠道数据", output: "广告文案、线索、优化建议",
    tags: ["广告", "SEO", "线索"], tasks: ["生成不同受众的广告版本", "发现潜在客户", "改进搜索可见性"],
    watch: "评估真实转化和获客成本，不只看生成速度。"
  },
  {
    id: "research", group: "analysis", zh: "研究与数据分析", en: "Research & Data Analysis", slug: "research-data-analysis",
    summary: "从资料或数据中提取证据、规律与解释。", input: "论文、网页、表格、数据库", output: "摘要、证据、图表、分析结论",
    tags: ["文献", "数据分析", "预测"], tasks: ["查找并比较研究证据", "分析表格和业务数据", "生成可追溯的研究摘要"],
    watch: "追溯原文和数据口径；预测要用独立样本验证。"
  },
  {
    id: "social", group: "growth", zh: "社交媒体", en: "Social Media", slug: "social-media",
    summary: "围绕平台内容、账号运营和创作者商业化。", input: "选题、素材、平台数据", output: "帖子、标题、排期、分析",
    tags: ["社媒文案", "封面", "运营"], tasks: ["把一个主题改写为多平台内容", "制作标题和缩略图", "分析互动和内容表现"],
    watch: "平台规则和受众差异仍需人工判断，自动发布前检查成稿。"
  },
  {
    id: "daily", group: "domain", zh: "日常生活", en: "Daily Life", slug: "daily-life",
    summary: "将 AI 放入旅行、个人安排与兴趣决策。", input: "偏好、时间、预算、地点", output: "计划、建议、清单",
    tags: ["行程", "个人助理", "生活"], tasks: ["规划旅行与活动", "安排个人日程", "按偏好筛选方案"],
    watch: "价格、营业时间和可用性要到实际服务方再次核实。"
  },
  {
    id: "health", group: "domain", zh: "医疗与健康", en: "Health & Wellness", slug: "health-wellness",
    summary: "辅助健康信息整理、记录和专业服务。", input: "症状描述、就诊记录、健康数据", output: "记录、提醒、参考信息",
    tags: ["医疗记录", "健康管理", "症状信息"], tasks: ["整理就诊对话为病历草稿", "解释常见健康概念", "跟踪健康习惯"],
    watch: "健康建议和诊断涉及高风险，必须由合格专业人士核验。"
  },
  {
    id: "legal", group: "domain", zh: "法律与财务", en: "Legal & Finance", slug: "legal-finance",
    summary: "辅助合同、账务和金融数据的处理与审查。", input: "合同、票据、交易和报表", output: "条款摘要、分类账、分析提示",
    tags: ["合同", "会计", "财务分析"], tasks: ["提取合同关键条款", "整理票据与交易", "分析财务报表异常"],
    watch: "结果应由相应专业人士审查；重视数据保密和适用法规。"
  },
  {
    id: "image-analysis", group: "analysis", zh: "图像识别与分析", en: "Image Analysis", slug: "image-analysis",
    summary: "从图片中识别文字、对象和结构化信息。", input: "照片、截图、扫描件", output: "文字、标签、定位结果",
    tags: ["OCR", "识别", "图像理解"], tasks: ["从票据或截图提取文字", "识别图中的物体", "将视觉信息转成可检索数据"],
    watch: "模糊图片、特殊字体和复杂版式容易导致漏识或错位。"
  },
  {
    id: "interior", group: "domain", zh: "室内与建筑设计", en: "Interior & Architectural Design", slug: "interior-architectural-design",
    summary: "辅助平面布局、空间效果和设计沟通。", input: "户型、尺寸、参考风格", output: "平面方案、效果图、3D 预览",
    tags: ["平面图", "室内设计", "3D"], tasks: ["从户型生成布局方案", "预览不同装修风格", "将平面草图转为立体展示"],
    watch: "尺寸、结构、安全和施工规范要由专业人员核验。"
  },
  {
    id: "business-research", group: "growth", zh: "商业研究", en: "Business Research", slug: "business-research",
    summary: "探索品牌命名、商业机会和市场信息。", input: "行业、产品想法、竞品资料", output: "名称备选、机会假设、调研摘要",
    tags: ["命名", "竞品", "市场"], tasks: ["寻找品牌名称和域名线索", "梳理竞品与市场切口", "把想法变成待验证的假设"],
    watch: "市场结论需要真实用户、需求与渠道数据验证。"
  },
  {
    id: "other", group: "domain", zh: "其他与跨类工具", en: "Other", slug: "other-1",
    summary: "暂未归入单一领域，或横跨多种任务。", input: "依具体产品而定", output: "依具体产品而定",
    tags: ["跨领域", "新场景", "工具箱"], tasks: ["发现新的细分应用", "观察多个能力的组合", "再按实际任务重新归类"],
    watch: "先确认具体产品的输入、输出和目标用户，不要仅凭“AI”标签判断。"
  }
];

const productCases = {
  chatbots: [
    { name: "ChatGPT", capability: "通用对话、写作、资料理解和任务协助。", fit: "适合需要一个多用途助手来探索问题和制作初稿。", url: "https://www.toolify.ai/tool/chatgpt-4" },
    { name: "Google Gemini", capability: "个人助手式的写作、研究与解释。", fit: "适合在 Google 生态中处理日常信息任务。", url: "https://www.toolify.ai/tool/gemini-gemini-advanced" }
  ],
  office: [
    { name: "Toki", capability: "安排会议、规划每天日程和提醒。", fit: "适合日历与时间管理任务。", url: "https://www.toolify.ai/tool/toki" },
    { name: "Zapier", capability: "连接不同应用，把触发条件变成自动化流程。", fit: "适合跨软件的重复办公步骤。", url: "https://www.toolify.ai/tool/zapier-com" }
  ],
  art: [
    { name: "Khroma", capability: "按偏好生成和探索配色组合。", fit: "适合设计前期寻找视觉方向。", url: "https://www.toolify.ai/tool/khroma" },
    { name: "Artflow.ai", capability: "创建角色图像、动画故事与视频素材。", fit: "适合有角色连续性的视觉叙事。", url: "https://www.toolify.ai/tool/artflow-ai" }
  ],
  coding: [
    { name: "Replit", capability: "在云端 IDE 中用 AI 辅助编写、运行与部署应用。", fit: "适合想边做边运行原型的人。", url: "https://www.toolify.ai/tool/replit" },
    { name: "Bolt AI Builder", capability: "通过描述构建网站、应用和 SaaS 原型。", fit: "适合快速验证页面与应用想法。", url: "https://www.toolify.ai/tool/luxe-magnate-core" }
  ],
  images: [
    { name: "Tuapix", capability: "在同一工作台生成、比较并编辑图片和视频。", fit: "适合需要多模型视觉试稿与素材管理。", url: "https://www.toolify.ai/tool/tuapix" },
    { name: "Professional Headshot Generator", capability: "从照片生成和修饰职业头像。", fit: "适合履历、社交资料等明确的人像任务。", url: "https://www.toolify.ai/tool/professional-headshot-generator-ai" }
  ],
  video: [
    { name: "Vibit", capability: "研究素材、创建并渲染短视频广告。", fit: "适合以广告转化为目标的视频制作。", url: "https://www.toolify.ai/tool/vibit" },
    { name: "Recastia", capability: "把 PDF 转成视频、演示文稿等形式。", fit: "适合把已有文档改编为多种传播内容。", url: "https://www.toolify.ai/tool/recastia" }
  ],
  writing: [
    { name: "QuillBot", capability: "改写文本，检查语法和相似性。", fit: "适合对已有草稿做表达优化。", url: "https://www.toolify.ai/tool/quillbot-paraphraser" },
    { name: "Grammarly", capability: "在写作过程中提示语法、风格和语气。", fit: "适合持续润色邮件与日常英文写作。", url: "https://www.toolify.ai/tool/grammarly" }
  ],
  education: [
    { name: "Language Reactor", capability: "用双语字幕、词典和 AI 辅助理解影视与网页。", fit: "适合利用真实内容练习外语。", url: "https://www.toolify.ai/tool/language-reactor" },
    { name: "Studydrive", capability: "提供学习笔记、AI 闪卡和学习清单。", fit: "适合课程复习和知识记忆。", url: "https://www.toolify.ai/tool/studydrive" }
  ],
  voice: [
    { name: "ElevenLabs", capability: "文字转语音、音色克隆和多语言配音。", fit: "适合为内容制作自然语音。", url: "https://www.toolify.ai/tool/elevenlabs-io" },
    { name: "Typecast", capability: "生成有情绪表现的 AI 声音与配音。", fit: "适合角色讲述和视频旁白。", url: "https://www.toolify.ai/tool/typecast-ai" }
  ],
  business: [
    { name: "HubSpot", capability: "整合营销、销售、客服与客户关系管理。", fit: "适合围绕客户旅程组织团队工作。", url: "https://www.toolify.ai/tool/hubspot-com" },
    { name: "Attio", capability: "用可定制数据模型和自动化管理客户关系。", fit: "适合需要自定义 CRM 流程的团队。", url: "https://www.toolify.ai/tool/attio" }
  ],
  music: [
    { name: "Suno", capability: "根据想法生成、编辑和分享歌曲。", fit: "适合快速制作歌曲样稿。", url: "https://www.toolify.ai/tool/suno" },
    { name: "Mureka", capability: "根据歌词与提示生成并编辑音乐。", fit: "适合从已有歌词发展歌曲。", url: "https://www.toolify.ai/tool/mureka" }
  ],
  detection: [
    { name: "ZeroGPT", capability: "对文本给出 AI 生成检测提示，并提供写作工具。", fit: "适合做内容初步筛查。", url: "https://www.toolify.ai/tool/zerogpt" },
    { name: "Originality.ai", capability: "检查 AI 生成迹象与文本抄袭相似性。", fit: "适合内容审核中的辅助核查。", url: "https://www.toolify.ai/tool/originality" }
  ],
  marketing: [
    { name: "Creads", capability: "用 AI 代理制作、发布、优化并汇报营销内容。", fit: "适合多平台营销执行与复盘。", url: "https://www.toolify.ai/tool/creads" },
    { name: "Brevo", capability: "把邮件营销、自动化和客户关系管理放在一起。", fit: "适合邮件触达和客户培育。", url: "https://www.toolify.ai/tool/brevo" }
  ],
  research: [
    { name: "Semantic Scholar", capability: "发现相关科学文献并辅助研究阅读。", fit: "适合先建立某一主题的论文清单。", url: "https://www.toolify.ai/tool/semantic-scholar" },
    { name: "Elicit", capability: "检索、总结论文并抽取研究数据。", fit: "适合带有明确研究问题的文献整理。", url: "https://www.toolify.ai/tool/elicit" }
  ],
  social: [
    { name: "Creads", capability: "连接社媒平台后制作、发布并优化内容。", fit: "适合把社媒运营纳入营销工作流。", url: "https://www.toolify.ai/tool/creads" },
    { name: "Beacons", capability: "管理创作者链接页、数字商品、邮件和受众数据。", fit: "适合创作者经营主页与变现入口。", url: "https://www.toolify.ai/tool/beacons-ai-2-0" }
  ],
  daily: [
    { name: "iMean AI Trip Planner", capability: "对话规划行程，并查找航班与酒店。", fit: "适合从旅行想法形成可调整的计划。", url: "https://www.toolify.ai/tool/imean-ai-travel-planner" },
    { name: "Trip Planner AI", capability: "给出个性化行程和路线安排。", fit: "适合比较旅行路线与每日活动。", url: "https://www.toolify.ai/tool/tripplanner-ai" }
  ],
  health: [
    { name: "Heidi Health", capability: "转写就诊对话并生成临床记录草稿。", fit: "适合医生减少记录整理时间。", url: "https://www.toolify.ai/tool/heidi" },
    { name: "Freed", capability: "把医患会话整理为临床文档。", fit: "适合医疗记录流程中的文书辅助。", url: "https://www.toolify.ai/tool/freed-ai-medical-scribe" }
  ],
  legal: [
    { name: "Syft Analytics", capability: "分析财务数据并制作报表。", fit: "适合企业经营表现与财务报告。", url: "https://www.toolify.ai/tool/syft-assist-ai" },
    { name: "Jump", capability: "为财务顾问整理会议笔记、任务与 CRM 更新。", fit: "适合顾问服务中的会后跟进。", url: "https://www.toolify.ai/tool/jump-ai" }
  ],
  "image-analysis": [
    { name: "ImageToText.info", capability: "从照片或截图中提取文字。", fit: "适合简单 OCR 和资料录入。", url: "https://www.toolify.ai/tool/image-to-text-converter" },
    { name: "LightPDF", capability: "编辑、转换 PDF，并对文档进行 AI 问答。", fit: "适合扫描件和 PDF 文档处理。", url: "https://www.toolify.ai/tool/lightpdf-com" }
  ],
  interior: [
    { name: "Planner 5D", capability: "识别平面图并制作 3D 家居设计。", fit: "适合快速探索户型与布置方案。", url: "https://www.toolify.ai/tool/planner-5d" },
    { name: "Coohom", capability: "创建室内与家具 3D 方案并渲染效果。", fit: "适合更完整的空间设计展示。", url: "https://www.toolify.ai/tool/coohom-3d-home-interior-design-ai-tool" }
  ],
  "business-research": [
    { name: "Namelix", capability: "生成简短品牌名称并提示域名线索。", fit: "适合产品命名初筛。", url: "https://www.toolify.ai/tool/namelix" },
    { name: "NameSnack", capability: "生成商号名称并检查域名可用性。", fit: "适合品牌命名与域名联动探索。", url: "https://www.toolify.ai/tool/namesnack" }
  ],
  other: [
    { name: "DeepSeek", capability: "提供基础模型、聊天与开发 API。", fit: "适合比较底层模型能力和接入方式。", url: "https://www.toolify.ai/tool/deepseek" },
    { name: "OpenRouter", capability: "通过统一接口访问多种大模型。", fit: "适合需要在多个模型间切换的开发者。", url: "https://www.toolify.ai/tool/openrouter-ai" }
  ]
};
const groupList = document.getElementById("group-list");
const categoryList = document.getElementById("category-list");
const detailPanel = document.getElementById("detail-panel");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const threeDMatch = document.getElementById("three-d-match");
const coverageMatch = document.getElementById("coverage-match");
const search = document.getElementById("search");
let activeGroup = "all";
let selectedId = categories[0].id;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
}

function searchableText(item) {
  return [item.zh, item.en, item.summary, item.input, item.output, ...item.tags, ...item.tasks, ...(productCases[item.id] || []).flatMap(product => [product.name, product.capability, product.fit])].join(" ").toLocaleLowerCase();
}

function visibleCategories() {
  const query = search.value.trim().toLocaleLowerCase();
  return categories.filter(item => (activeGroup === "all" || item.group === activeGroup) && (!query || searchableText(item).includes(query)));
}

function renderGroups() {
  groupList.innerHTML = groups.map(group => {
    const count = group.id === "all" ? categories.length : categories.filter(item => item.group === group.id).length;
    return `<button class="group-button" type="button" data-group="${group.id}" aria-pressed="${group.id === activeGroup}"><span>${escapeHtml(group.name)}</span><span class="group-count">${String(count).padStart(2, "0")}</span></button>`;
  }).join("");
}

function renderDetail(item) {
  if (!item) {
    detailPanel.innerHTML = `<div class="detail-placeholder">选择一个类别查看能力说明。</div>`;
    return;
  }
  const number = String(categories.indexOf(item) + 1).padStart(2, "0");
  const products = productCases[item.id] || [];
  const productsMarkup = `<div class="detail-products" id="products"><p class="detail-subtitle">实际产品 <span>每类 2 款</span></p>
    ${products.map(product => `<article class="product-case">
      <a class="product-name" href="${escapeHtml(product.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(product.name)} <span aria-hidden="true">↗</span></a>
      <p>${escapeHtml(product.capability)}</p>
      <small>适合：${escapeHtml(product.fit)}</small>
    </article>`).join("")}</div>`;
  detailPanel.innerHTML = `
    <div class="detail-topline"><span>类别 ${number} / ${categories.length}</span><span class="detail-seal" aria-hidden="true">✳</span></div>
    <h3>${escapeHtml(item.zh)}</h3>
    <p class="detail-en">${escapeHtml(item.en)}</p>
    <p class="detail-desc">${escapeHtml(item.summary)}</p>
    <div class="detail-io"><div><span>输入 INPUT</span><strong>${escapeHtml(item.input)}</strong></div><i aria-hidden="true">→</i><div><span>输出 OUTPUT</span><strong>${escapeHtml(item.output)}</strong></div></div>
    <p class="detail-subtitle">常见任务</p>
    <ul class="detail-tasks">${item.tasks.map(task => `<li>${escapeHtml(task)}</li>`).join("")}</ul>
    ${productsMarkup}
    <p class="detail-watch"><strong>选择时留意：</strong>${escapeHtml(item.watch)}</p>
    <a class="detail-link" href="https://www.toolify.ai/free-ai-tools/${encodeURIComponent(item.slug)}" target="_blank" rel="noopener noreferrer">查看 Toolify 原分类 <span aria-hidden="true">↗</span></a>`;
}

function render() {
  const visible = visibleCategories();
  const query = search.value.trim().toLocaleLowerCase();
  const topicKeywords = ["3d", "3d模型", "建模", "数字资产", "meshy", "tripo", "rodin", "hyper3d", "3d ai studio", "sloyd", "kaedim", "secret sauce", "贴图", "骨骼", "拓扑"];
  const topicMatches = query.length >= 2 && topicKeywords.some(keyword => keyword.includes(query) || query.includes(keyword));
  const coverageKeywords = ["agent", "智能体", "coze", "转写", "字幕", "transcription", "turboscribe", "ppt", "演示", "gamma", "数字人", "虚拟形象", "avatar", "visionstory", "游戏", "rosebud", "知识库", "gitbook", "文档提取", "nanonets", "ocr"];
  const coverageMatches = query.length >= 2 && coverageKeywords.some(keyword => keyword.includes(query) || query.includes(keyword));
  if (!visible.some(item => item.id === selectedId)) selectedId = visible.length ? visible[0].id : "";
  groupList.querySelectorAll("button[data-group]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.group === activeGroup)));
  threeDMatch.hidden = !topicMatches;
  coverageMatch.hidden = !coverageMatches;
  resultCount.textContent = `显示 ${visible.length} / ${categories.length} 类 · ${visible.reduce((total, item) => total + productCases[item.id].length, 0)} 个产品案例` + (topicMatches ? " · 3D 专题 7 款" : "") + (coverageMatches ? " · 补充案例 7 款" : "");
  categoryList.innerHTML = visible.map(item => {
    const number = String(categories.indexOf(item) + 1).padStart(2, "0");
    const isActive = item.id === selectedId;
    return `<button class="category-card${isActive ? " is-active" : ""}" type="button" data-id="${escapeHtml(item.id)}" aria-pressed="${isActive}" aria-controls="detail-panel">
      <span class="card-top"><span class="card-index">${number} / ${categories.length}</span><span class="card-arrow" aria-hidden="true">↗</span></span>
      <span class="card-title">${escapeHtml(item.zh)}</span>
      <span class="card-summary">${escapeHtml(item.summary)}</span>
      <span class="card-tags">${item.tags.slice(0, 2).map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</span>
      <span class="card-products"><span>实际产品</span><strong>${productCases[item.id].map(product => escapeHtml(product.name)).join(" · ")}</strong></span>
    </button>`;
  }).join("");
  emptyState.hidden = visible.length > 0 || topicMatches || coverageMatches;
  renderDetail(categories.find(item => item.id === selectedId));
}

groupList.addEventListener("click", event => {
  const button = event.target.closest("button[data-group]");
  if (!button) return;
  activeGroup = button.dataset.group;
  render();
});

categoryList.addEventListener("click", event => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  selectedId = button.dataset.id;
  categoryList.querySelectorAll("button[data-id]").forEach(card => {
    const isActive = card.dataset.id === selectedId;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });
  renderDetail(categories.find(item => item.id === selectedId));
  if (window.matchMedia("(max-width: 760px)").matches) {
    detailPanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
});

search.addEventListener("input", render);
document.addEventListener("keydown", event => {
  if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
});

renderGroups();
render();
