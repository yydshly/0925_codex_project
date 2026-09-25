const modes = {
  text: {
    kicker: "最简入口",
    title: "输入一句话，数字人把它说出来。",
    description: "echo 模式直接朗读传入的文字，无需大语言模型；TTS 先把文字变成声音，口型模型再生成画面。",
    steps: [
      ["输入文字", "你的文案"],
      ["语音合成", "TTS 必需"],
      ["口型推理", "本地模型 + avatar"],
      ["音视频输出", "WebRTC / RTMP"]
    ],
    dependencies: [
      ["必需 · 口型模型", true],
      ["必需 · avatar", true],
      ["必需 · TTS", true],
      ["可选 · LLM", false]
    ]
  },
  audio: {
    kicker: "使用现有声音",
    title: "声音已经做好，直接驱动画面。",
    description: "通过 /humanaudio 上传音频文件。LiveTalking 提取音频特征并生成同步口型；内置 LLM 和 TTS 可以跳过。",
    steps: [
      ["上传音频", "你的录音或配音"],
      ["提取特征", "分析说话声音"],
      ["口型推理", "本地模型 + avatar"],
      ["音视频输出", "播放或录制"]
    ],
    dependencies: [
      ["必需 · 口型模型", true],
      ["必需 · avatar", true],
      ["不需要 · 内置 TTS", false],
      ["不需要 · LLM", false]
    ]
  },
  conversation: {
    kicker: "扩展为语音互动",
    title: "让用户提问，让数字人回答。",
    description: "用户讲话先由 ASR 转成文字，LLM 生成回答，TTS 合成声音，最后由 LiveTalking 生成口型和画面。各模块的延迟会累加。",
    steps: [
      ["语音提问", "ASR 识别"],
      ["生成回答", "LLM / 知识库"],
      ["合成声音", "TTS 服务"],
      ["数字人回复", "口型 + 推流"]
    ],
    dependencies: [
      ["必需 · 口型模型", true],
      ["必需 · avatar", true],
      ["必需 · ASR", true],
      ["必需 · LLM", true],
      ["必需 · TTS", true]
    ]
  }
};

const buttons = [...document.querySelectorAll(".mode-button")];
const flowKicker = document.getElementById("flow-kicker");
const flowTitle = document.getElementById("flow-title");
const flowDescription = document.getElementById("flow-description");
const flowSteps = document.getElementById("flow-steps");
const flowDependencies = document.getElementById("flow-dependencies");

function selectMode(key) {
  const mode = modes[key];
  if (!mode) return;
  buttons.forEach((button) => {
    const active = button.dataset.mode === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  flowKicker.textContent = mode.kicker;
  flowTitle.textContent = mode.title;
  flowDescription.textContent = mode.description;
  flowSteps.replaceChildren(...mode.steps.map(([title, detail], index) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    const heading = document.createElement("b");
    const caption = document.createElement("small");
    number.textContent = String(index + 1).padStart(2, "0");
    heading.textContent = title;
    caption.textContent = detail;
    item.append(number, heading, caption);
    return item;
  }));
  flowDependencies.replaceChildren(...mode.dependencies.map(([label, required]) => {
    const chip = document.createElement("span");
    chip.className = `dependency ${required ? "required" : "optional"}`;
    chip.textContent = label;
    return chip;
  }));
}

buttons.forEach((button) => {
  button.addEventListener("click", () => selectMode(button.dataset.mode));
});

const workflowTabs = [...document.querySelectorAll('.workflow-tab')];
const workflowPanels = {
  video: document.getElementById('workflow-video'),
  live: document.getElementById('workflow-live')
};
workflowTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.workflow;
    workflowTabs.forEach((item) => {
      const active = item.dataset.workflow === selected;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    Object.entries(workflowPanels).forEach(([key, panel]) => {
      panel.hidden = key !== selected;
    });
  });
});
