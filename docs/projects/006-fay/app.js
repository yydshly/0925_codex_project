const capabilities = [
  { category: "交互输入", symbol: "◉", title: "语音与文字输入", description: "接收文字或语音；ASR 可选用项目提供的接入方式。支持唤醒、对话打断等交互控制。", tags: ["ASR", "文字接口", "打断"] },
  { category: "交互输入", symbol: "≋", title: "流式会话", description: "逐步传递回复内容，按用户与会话管理输出，让前端能更早展示文字或播放语音。", tags: ["流式输出", "会话状态", "多用户"] },
  { category: "认知编排", symbol: "✧", title: "模型与工具决策", description: "接入兼容接口的大模型；先判断请求，再按需进入工具循环，完成任务后组织最终回复。", tags: ["LLM", "Agent", "MCP"] },
  { category: "认知编排", symbol: "⌁", title: "知识与记忆", description: "通过 MCP 接入知识库；记忆模块保存观察、对话与反思，并按相关性、时间和重要度检索。", tags: ["知识检索", "长期记忆", "人设"] },
  { category: "连接输出", symbol: "♫", title: "语音与终端输出", description: "TTS 按需合成回应；Fay 将文字、音频及终端驱动信号交给数字人或设备端呈现。", tags: ["TTS", "数字人驱动", "终端接口"] },
  { category: "连接输出", symbol: "⌘", title: "多端与业务接口", description: "通过接口连接网页、App、硬件和第三方系统，也可配置定时播报及主动对话。", tags: ["WebSocket", "HTTP", "自动播报"] }
];

const flowSteps = [
  { label: "接收输入", sub: "文字 / 语音", title: "从用户的表达开始", description: "网页、App、数字人或硬件把文字或音频送入 Fay。文字可直接进入会话，语音则先经过识别。", aside: "接入重点", asideText: "先确定终端、网络方式和用户身份。" },
  { label: "语音转写", sub: "ASR", title: "将语音变成可处理的文字", description: "ASR 把音频转为文本。实际识别速度和准确率会受到模型、麦克风与现场噪声影响。", aside: "可替换模块", asideText: "项目包含不同 ASR 接入；文字输入可跳过此步。" },
  { label: "装配上下文", sub: "记忆 / 知识", title: "在回答前补充相关信息", description: "系统提示词、历史对话和关联记忆进入上下文；预启动 MCP 工具还可先检索知识，再把结果提供给模型。", aside: "关键机制", asideText: "预启动适合每轮都需要查询的知识或状态。" },
  { label: "判断与行动", sub: "LLM / MCP", title: "决定回答，或调用工具", description: "模型先判断请求；简单对话可直接回复，任务型请求进入工具循环，逐步选择工具并检查结果。", aside: "任务边界", asideText: "工具权限与参数约束应由业务系统共同控制。" },
  { label: "生成回复", sub: "流式文本", title: "把结果组织成自然语言", description: "工具任务完成后，模型依据执行结果生成面向用户的回复，文本以流式方式传给会话与界面。", aside: "体验重点", asideText: "首句等待时间需要结合真实模型测量。" },
  { label: "表达呈现", sub: "TTS / 终端", title: "让回应变得可听、可见", description: "TTS 将文本合成音频；Fay 把文字、音频及终端驱动信号送往接入端，由接入端负责角色动画或设备动作。", aside: "职责划分", asideText: "Fay 提供驱动信息；形象渲染由接入端实现。" }
];

const scenarios = [
  { tab: "展厅与导览", title: "让展项介绍变成现场对话", description: "访客提问后，数字人结合展项资料回答，并通过语音和终端画面引导参观。", needs: ["语音识别", "知识检索", "TTS", "数字人动作"], example: "示例：展厅讲解员、场馆导览屏" },
  { tab: "教学与培训", title: "让知识讲解更有陪伴感", description: "虚拟教师围绕课程内容答疑，也可按日程主动播报学习提醒或固定内容。", needs: ["课程知识库", "人设", "记忆", "自动播报"], example: "示例：课程助教、企业培训导师" },
  { tab: "客服与业务", title: "把问答连接到实际业务", description: "除回答常见问题，还可通过受控工具查询订单、预约或服务状态，并把结果说给用户。", needs: ["MCP 工具", "业务接口", "权限控制", "多用户"], example: "示例：网站语音客服、服务大厅助手" },
  { tab: "设备与机器人", title: "给硬件一个可对话的入口", description: "设备提供麦克风、扬声器或屏幕，Fay 负责后端交互编排，终端解释动作与反馈。", needs: ["语音交互", "终端接口", "动作映射", "低延迟"], example: "示例：迎宾机器人、桌面陪伴设备" }
];

const decisions = [
  { button: "我要做数字人 / 语音产品", eyebrow: "匹配度 / 较高", title: "适合作为原型起点", description: "Fay 已把语音、模型、工具与终端接口串起来，能让你先验证完整体验，再决定保留和替换哪些模块。", next: ["先接入一个终端与一套语音模型", "用真实用户问题测首句延迟和打断体验"] },
  { button: "我要研究 Agent 架构", eyebrow: "匹配度 / 参考价值高", title: "适合研究交互编排", description: "它提供工具循环、预启动检索和长期记忆的具体实现，可作为研究任务型语音 Agent 的案例。", next: ["先读 Prompt 设计和 MCP 接口文档", "围绕一个业务工具复现实验链路"] },
  { button: "我只需要文字聊天", eyebrow: "匹配度 / 视需求而定", title: "先核算框架复杂度", description: "Fay 的价值集中在语音、数字人和多端联动。如果当前需求仅是文字问答，可以先明确未来是否会引入这些入口。", next: ["列出未来六个月的终端与语音需求", "比较集成成本与实际要使用的模块"] }
];

const filters = ["全部", "交互输入", "认知编排", "连接输出"];
let currentFilter = "全部";
let currentFlow = 0;
let currentScenario = 0;
let currentDecision = 0;

function renderFilters() {
  const container = document.getElementById("capability-filters");
  container.innerHTML = filters.map(filter => `<button class="filter-button" type="button" data-filter="${filter}" aria-pressed="${filter === currentFilter}">${filter}</button>`).join("");
  container.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderFilters();
    renderCapabilities();
  }));
}

function renderCapabilities() {
  const query = document.getElementById("capability-search").value.trim().toLowerCase();
  const shown = capabilities.filter(item => (currentFilter === "全部" || item.category === currentFilter) &&
    [item.title, item.description, item.category, ...item.tags].join(" ").toLowerCase().includes(query));
  document.getElementById("capability-grid").innerHTML = shown.map(item => `<article class="capability-card">
    <div class="card-head"><span class="capability-symbol" aria-hidden="true">${item.symbol}</span><span class="capability-number">${String(capabilities.indexOf(item) + 1).padStart(2, "0")} / 06</span></div>
    <h3>${item.title}</h3><p>${item.description}</p><div class="card-tags">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
  </article>`).join("");
  document.getElementById("capability-empty").hidden = shown.length > 0;
}

function renderFlow() {
  const container = document.getElementById("flow");
  container.innerHTML = flowSteps.map((step, index) => `<button class="flow-step" type="button" data-index="${index}" aria-pressed="${index === currentFlow}"><span class="flow-dot">${String(index + 1).padStart(2, "0")}</span><strong>${step.label}</strong><em>${step.sub}</em></button>`).join("");
  const step = flowSteps[currentFlow];
  document.getElementById("flow-detail").innerHTML = `<span class="flow-detail-index">STEP ${String(currentFlow + 1).padStart(2, "0")} / 06</span><div><h3>${step.title}</h3><p>${step.description}</p></div><div class="flow-detail-aside"><b>${step.aside}</b>${step.asideText}</div>`;
  container.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    currentFlow = Number(button.dataset.index);
    renderFlow();
    document.querySelector(`.flow-step[data-index="${currentFlow}"]`).focus();
  }));
}

function renderScenarios() {
  const tabs = document.getElementById("scenario-tabs");
  tabs.innerHTML = scenarios.map((item, index) => `<button class="scenario-tab" id="scenario-tab-${index}" type="button" role="tab" aria-controls="scenario-panel" aria-selected="${index === currentScenario}" tabindex="${index === currentScenario ? 0 : -1}" data-index="${index}"><span>${item.tab}</span><span>0${index + 1} ↗</span></button>`).join("");
  const item = scenarios[currentScenario];
  const panel = document.getElementById("scenario-panel");
  panel.setAttribute("aria-labelledby", `scenario-tab-${currentScenario}`);
  panel.innerHTML = `<span class="scenario-label">SCENARIO / 0${currentScenario + 1}</span><h3>${item.title}</h3><p class="scenario-description">${item.description}</p><div class="scenario-need"><b>需要的关键能力</b><div>${item.needs.map(need => `<span>${need}</span>`).join("")}</div></div><p class="scenario-example">${item.example}</p>`;
  tabs.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    currentScenario = Number(button.dataset.index);
    renderScenarios();
    document.getElementById(`scenario-tab-${currentScenario}`).focus();
  }));
}

function renderDecisions() {
  const options = document.getElementById("decision-options");
  options.innerHTML = decisions.map((item, index) => `<button class="decision-option" type="button" data-index="${index}" aria-pressed="${index === currentDecision}">${item.button}</button>`).join("");
  const item = decisions[currentDecision];
  document.getElementById("decision-result").innerHTML = `<span>${item.eyebrow}</span><h3>${item.title}</h3><p>${item.description}</p><ul>${item.next.map(point => `<li>${point}</li>`).join("")}</ul>`;
  options.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    currentDecision = Number(button.dataset.index);
    renderDecisions();
    document.querySelector(`.decision-option[data-index="${currentDecision}"]`).focus();
  }));
}

renderFilters();
renderCapabilities();
renderFlow();
renderScenarios();
renderDecisions();
document.getElementById("capability-search").addEventListener("input", renderCapabilities);

document.getElementById("scenario-tabs").addEventListener("keydown", event => {
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "Home") currentScenario = 0;
  else if (event.key === "End") currentScenario = scenarios.length - 1;
  else currentScenario = (currentScenario + (event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1) + scenarios.length) % scenarios.length;
  renderScenarios();
  document.getElementById(`scenario-tab-${currentScenario}`).focus();
});

if ("IntersectionObserver" in window) {
  const links = [...document.querySelectorAll(".site-nav a")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-20% 0px -65% 0px" });
  document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
}
