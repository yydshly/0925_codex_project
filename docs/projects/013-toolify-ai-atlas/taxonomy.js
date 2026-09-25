(() => {
  const data = window.toolifyTaxonomy;
  const root = document.getElementById("taxonomy-groups");
  const search = document.getElementById("taxonomy-search");
  const groupSelect = document.getElementById("taxonomy-group");
  const count = document.getElementById("taxonomy-count");
  const empty = document.getElementById("taxonomy-empty");
  const clear = document.getElementById("taxonomy-clear");
  if (!data || !root || !search || !groupSelect || !count || !empty || !clear) return;

  const aliases = [
    ["3d", "3D 模型 建模 立体"], ["agent", "智能体 代理"], ["workflow", "工作流 自动化"],
    ["transcription", "转写 录音转文字"], ["transcriber", "转写 录音转文字"],
    ["speech-to-text", "语音转文字 转写"], ["text-to-speech", "文字转语音 配音"],
    ["speech", "语音"], ["voice", "声音 语音"], ["podcast", "播客"],
    ["audio", "音频"], ["music", "音乐"], ["song", "歌曲"], ["lyrics", "歌词"],
    ["video", "视频"], ["animation", "动画"], ["avatar", "数字人 虚拟形象 头像"],
    ["lip sync", "口型同步"], ["image", "图像 图片"], ["photo", "照片 修图"],
    ["picture", "图片"], ["ocr", "文字识别"], ["recognition", "识别"],
    ["segmentation", "分割"], ["background", "背景"], ["upscaler", "放大 超分辨率"],
    ["texture", "纹理 贴图"], ["art", "艺术"], ["design", "设计"],
    ["logo", "标志"], ["comic", "漫画"], ["storyboard", "分镜"],
    ["writing", "写作"], ["writer", "写作"], ["text", "文本 文字"],
    ["blog", "博客"], ["email", "邮件"], ["script", "脚本"],
    ["summar", "摘要 总结"], ["rewrite", "改写"], ["paraphrase", "改写"],
    ["translate", "翻译"], ["translator", "翻译"], ["language", "语言"],
    ["presentation", "演示文稿 PPT"], ["ppt", "PPT 演示文稿"],
    ["document", "文档"], ["pdf", "PDF 文档"], ["extraction", "提取 抽取"],
    ["knowledge", "知识库"], ["search", "搜索 检索"], ["research", "研究 调研"],
    ["data", "数据"], ["chart", "图表"], ["spreadsheet", "表格"],
    ["code", "代码 编程"], ["coding", "编程"], ["app builder", "应用构建"],
    ["website", "网站"], ["api", "接口"], ["testing", "测试"],
    ["game", "游戏"], ["robot", "机器人"], ["chatbot", "聊天机器人 对话"],
    ["customer service", "客服"], ["crm", "客户关系"], ["sales", "销售"],
    ["marketing", "营销"], ["advertis", "广告"], ["seo", "搜索优化"],
    ["social media", "社交媒体"], ["finance", "财务"], ["accounting", "会计"],
    ["contract", "合同"], ["legal", "法律"], ["tax", "税务"],
    ["health", "健康"], ["medical", "医疗"], ["mental", "心理"],
    ["education", "教育"], ["homework", "作业"], ["quiz", "测验"],
    ["travel", "旅行"], ["recipe", "食谱"], ["shopping", "购物"],
    ["interior", "室内"], ["floor plan", "户型 平面图"], ["resume", "简历"]
  ];
  const spotlights = {
    "ai-3d-model-generator": ["#three-d", "3D 产品专题"],
    "image-to-3d-model": ["#three-d", "3D 产品专题"],
    "text-to-3d": ["#three-d", "3D 产品专题"],
    "ai-agent": ["#coverage-agent", "产品案例"],
    "ai-transcription": ["#coverage-transcription", "产品案例"],
    "ai-presentation-generator": ["#coverage-presentation", "产品案例"],
    "ai-avatar-video-generator": ["#coverage-avatar", "产品案例"],
    "ai-game-generator": ["#coverage-game", "产品案例"],
    "ai-knowledge-base": ["#coverage-knowledge", "产品案例"],
    "ai-document-extraction": ["#coverage-extraction", "产品案例"]
  };
  const compact = value => String(value).toLocaleLowerCase().replace(/[\s\-_/&()]+/g, "");
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const aliasText = name => aliases.filter(([needle]) => name.toLocaleLowerCase().includes(needle)).map(([, words]) => words).join(" ");

  groupSelect.innerHTML = `<option value="all">全部 22 个大类</option>` + data.groups.map(group => `<option value="${escapeHtml(group.id)}">${escapeHtml(group.zh)} · ${group.categories.length}</option>`).join("");
  const initialHash = decodeURIComponent(location.hash.slice(1));
  const initialGroup = initialHash.startsWith("taxonomy-") ? initialHash.slice("taxonomy-".length) : "";
  if (data.groups.some(group => group.id === initialGroup)) groupSelect.value = initialGroup;

  function render() {
    const query = compact(search.value.trim());
    const selected = groupSelect.value;
    let shownCategories = 0;
    const visibleGroups = data.groups.filter(group => selected === "all" || group.id === selected).map(group => {
      const groupSearch = compact([group.zh, group.en].join(" "));
      const allInGroup = query && groupSearch.includes(query);
      const categories = group.categories.filter(category => !query || allInGroup || compact(category.name + " " + category.zh + " " + category.description + " " + aliasText(category.name)).includes(query));
      shownCategories += categories.length;
      return { ...group, categories };
    }).filter(group => group.categories.length);

    count.textContent = `显示 ${shownCategories} / ${data.entryCount} 个细分类 · ${visibleGroups.length} / ${data.groups.length} 个大类`;
    empty.hidden = visibleGroups.length > 0;
    root.innerHTML = visibleGroups.map((group, index) => {
      const open = query && shownCategories <= 100 || selected !== "all" || (!query && index === 0);
      return `<details class="taxonomy-group" id="taxonomy-${escapeHtml(group.id)}" ${open ? "open" : ""}>
        <summary><span class="taxonomy-group-no">${String(data.groups.findIndex(item => item.id === group.id) + 1).padStart(2, "0")}</span><span class="taxonomy-group-title"><b>${escapeHtml(group.zh)}</b><small>${escapeHtml(group.en)}</small></span><span class="taxonomy-group-summary">${escapeHtml(group.summary)}</span><span class="taxonomy-group-count">${group.categories.length} 类</span><span class="taxonomy-chevron" aria-hidden="true">⌄</span></summary>
        <div class="taxonomy-category-list">${group.categories.map(category => {
          const spotlight = spotlights[category.slug];
          return `<div class="taxonomy-category"><div class="taxonomy-category-top"><a class="taxonomy-category-name" href="https://www.toolify.ai/category/${encodeURIComponent(category.slug)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(category.zh)}</strong><span>${escapeHtml(category.name)} ↗</span></a>${spotlight ? `<a class="taxonomy-spotlight" href="${spotlight[0]}">${spotlight[1]} →</a>` : ""}</div><p>${escapeHtml(category.description)}</p></div>`;
        }).join("")}</div>
      </details>`;
    }).join("");
  }

  search.addEventListener("input", render);
  groupSelect.addEventListener("change", render);
  clear.addEventListener("click", () => { search.value = ""; groupSelect.value = "all"; render(); search.focus(); });
  render();
  if (initialGroup) requestAnimationFrame(() => document.getElementById(initialHash)?.scrollIntoView());
})();
