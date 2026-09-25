const pipelineContent = {
  capture: {
    kicker: "STEP 01 · INPUT",
    title: "接收持续到来的音频",
    description: "浏览器或应用把音频分批送入服务，再转换为 16 kHz 单声道音频；已有文件也可以直接转写。",
    glyph: "◂ ))",
  },
  vad: {
    kicker: "STEP 02 · VOICE ACTIVITY",
    title: "找到真正有人说话的片段",
    description: "Silero VAD 判断有人说话的开始与结束，跳过静音并记录时间位置；它不负责辨认说了什么。",
    glyph: "⌁",
  },
  asr: {
    kicker: "STEP 03 · RECOGNITION",
    title: "调用识别模型生成文字",
    description: "说话中的音频块进入缓存后就可持续调用 ASR，必要时先合并少量音频以减少调用；不需要等整句话说完。",
    glyph: "Aa",
  },
  commit: {
    kicker: "STEP 04 · STABILITY",
    title: "判断哪些字可以确认",
    description: "默认 AlignAtt 暂缓靠近音频末尾的词；可选 LocalAgreement 比较连续识别的一致前缀。暂定文字仍可能改变。",
    glyph: "✓",
  },
  output: {
    kicker: "STEP 05 · OUTPUT",
    title: "把更新送回你的产品",
    description: "服务推送暂定与已确认文字；检测到停顿可处理句尾，较长停顿或音频结束会形成段落边界。",
    glyph: "↗",
  },
};

const scenarioContent = {
  meeting: {
    number: "01",
    title: "会议与访谈字幕",
    lead: "让参与者在讲话过程中看到字幕，结束后留下可整理的文字记录。",
    path: ["麦克风或会议音频", "WhisperLiveKit", "实时字幕"],
    own: "持续识别、输出临时与已确认文字；可选说话人编号。",
    product: "音频来源、字幕界面、会议记录保存与权限。",
  },
  media: {
    number: "02",
    title: "内容整理与检索",
    lead: "把访谈、播客或视频素材变成字幕和可搜索的文字。",
    path: ["录音或视频音轨", "WhisperLiveKit", "字幕 / 文稿"],
    own: "文件转写、时间戳以及 SRT / VTT 等导出格式。",
    product: "上传管理、校对编辑、搜索与内容发布。",
  },
  agent: {
    number: "03",
    title: "语音助手",
    lead: "把用户的话变成文字，作为助手理解请求的入口。",
    path: ["用户讲话", "WhisperLiveKit", "你的助手逻辑"],
    own: "持续识别语音并向你的应用提供文字。",
    product: "意图理解、模型推理、工具调用、回复生成与语音播报。",
  },
  translation: {
    number: "04",
    title: "跨语言交流",
    lead: "在讲话的同时显示原文及目标语言文本，辅助跨语言沟通。",
    path: ["源语言音频", "WhisperLiveKit", "双语文字"],
    own: "识别和可选的文字翻译。",
    product: "语言设置、双语展示、人工修订与最终内容交付。",
  },
  support: {
    number: "05",
    title: "客服通话记录",
    lead: "让对话在进行时成为可阅读的记录，为后续质检或摘要提供材料。",
    path: ["通话音频", "WhisperLiveKit", "对话记录"],
    own: "逐步转写，可选说话人编号和时间信息。",
    product: "通话系统接入、客户身份、质检规则与数据保存。",
  },
};

const fitContent = {
  web: {
    flow: ["你的网页 / App", "WhisperLiveKit", "字幕与业务功能"],
    title: "先接原生实时接口",
    description: "把麦克风音频发送到它的 WebSocket；用临时文字更新界面，用已确认文字保存记录或交给后续流程。",
    value: "实时分段、模型调用与结果推送的基础工作",
  },
  livekit: {
    flow: ["LiveKit 会议音频", "音频桥接", "WhisperLiveKit", "会议字幕"],
    title: "从会议音轨做音频桥接",
    description: "LiveKit 继续负责会议中的音视频传输；你新增一层桥接，把需要转写的音轨送给 WhisperLiveKit，并把字幕带回会议界面。",
    value: "实时识别与字幕结果处理的基础工作",
  },
  files: {
    flow: ["录音文件", "WhisperLiveKit", "文稿 / 字幕"],
    title: "先复用已有的 Voicebox 听写",
    description: "如果当前只处理录音文件，先看 003 Voicebox 是否已满足需求。只有准确度、字幕格式或工作流不合适时，再拿同一段录音比较 WhisperLiveKit。",
    valueLabel: "当前判断",
    value: "暂不需要新增实时转写服务",
  },
};

function textNode(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  return element;
}

function setupPipeline() {
  const buttons = [...document.querySelectorAll(".pipeline-step")];
  const detail = document.getElementById("pipeline-detail");
  if (!detail) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const content = pipelineContent[button.dataset.step];
      if (!content) return;
      buttons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("is-selected", active);
        other.setAttribute("aria-pressed", String(active));
      });
      const copy = document.createElement("div");
      copy.append(
        textNode("span", "detail-kicker", content.kicker),
        textNode("h3", "", content.title),
        textNode("p", "", content.description),
      );
      const glyph = textNode("span", "detail-glyph", content.glyph);
      glyph.setAttribute("aria-hidden", "true");
      detail.replaceChildren(copy, glyph);
    });
  });
}

function renderScenario(key) {
  const data = scenarioContent[key];
  const panel = document.getElementById("scenario-panel");
  if (!data || !panel) return;

  const title = textNode("h3", "", data.title);
  const path = document.createElement("div");
  path.className = "scenario-path";
  data.path.forEach((item, index) => {
    if (index > 0) {
      const arrow = textNode("i", "", "→");
      arrow.setAttribute("aria-hidden", "true");
      path.append(arrow);
    }
    path.append(textNode("span", "", item));
  });

  const columns = document.createElement("div");
  columns.className = "panel-columns";
  const wlkColumn = document.createElement("div");
  wlkColumn.append(textNode("span", "mini-label", "它负责"), textNode("p", "", data.own));
  const productColumn = document.createElement("div");
  productColumn.append(textNode("span", "mini-label", "你的项目负责"), textNode("p", "", data.product));
  columns.append(wlkColumn, productColumn);

  panel.replaceChildren(
    textNode("span", "panel-overline", `SCENARIO ${data.number}`),
    title,
    textNode("p", "panel-lead", data.lead),
    path,
    columns,
  );
  panel.setAttribute("aria-labelledby", `tab-${key}`);
}

function setupScenarios() {
  const tabs = [...document.querySelectorAll(".scenario-tabs [role='tab']")];
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((other) => {
        const selected = other === tab;
        other.setAttribute("aria-selected", String(selected));
        other.tabIndex = selected ? 0 : -1;
      });
      renderScenario(tab.dataset.scenario);
    });
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });
}

function renderFit(key) {
  const data = fitContent[key];
  const answer = document.getElementById("fit-answer");
  if (!data || !answer) return;

  const flow = document.createElement("div");
  flow.className = "fit-flow";
  data.flow.forEach((item, index) => {
    if (index > 0) flow.append(textNode("b", "", "→"));
    flow.append(textNode("span", "", item));
  });

  const copy = document.createElement("div");
  copy.className = "fit-copy";
  const explanation = document.createElement("div");
  explanation.append(
    textNode("span", "mini-label", "推荐接法"),
    textNode("h3", "", data.title),
    textNode("p", "", data.description),
  );
  const value = document.createElement("div");
  value.className = "fit-value";
  value.append(textNode("span", "", data.valueLabel || "你能省下"), textNode("strong", "", data.value));
  copy.append(explanation, value);
  answer.replaceChildren(flow, copy);
}

function setupFit() {
  const buttons = [...document.querySelectorAll(".fit-selector button")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((other) => {
        const selected = other === button;
        other.classList.toggle("is-selected", selected);
        other.setAttribute("aria-pressed", String(selected));
      });
      renderFit(button.dataset.fit);
    });
  });
}

function setupNavigation() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".section-nav a")];
  const sections = [...document.querySelectorAll("main > section[id]")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    const id = visible[0].target.id;
    links.forEach((link) => {
      const active = link.hash === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-20% 0px -58% 0px", threshold: [0, 0.1, 0.25, 0.5] });
  sections.forEach((section) => observer.observe(section));
}

setupPipeline();
setupScenarios();
setupFit();
setupNavigation();
