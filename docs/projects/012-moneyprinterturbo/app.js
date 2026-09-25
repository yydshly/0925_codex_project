const routes = {
  stock: {
    symbol: "▧",
    title: "根据搜索词找到现成镜头",
    description: "脚本被提炼成关键词，程序向素材站点搜索视频，按画幅、时长等条件挑选并下载片段。适合通用主题，画面相关性需要预览。",
    tags: ["Pexels", "Pixabay", "Coverr"]
  },
  local: {
    symbol: "▣",
    title: "用自己的照片和视频构成故事",
    description: "上传已有视频会裁切成镜头；上传照片会由程序加缓慢放大，再作为短片段进入配音、字幕与合成流程。",
    tags: ["品牌素材", "商品图片", "实拍视频"]
  },
  ai: {
    symbol: "✦",
    title: "按关键词生成新的画面",
    description: "文生图会按关键词生成静态图片，再由程序做缓慢缩放；文生视频由外部模型直接返回几秒的动态片段。两者都会进入统一剪辑链。",
    tags: ["AI 静态图", "程序缩放", "AI 动态片段"]
  }
};
const tabs = [...document.querySelectorAll("[data-route]")];
function selectRoute(tab) {
  const route = routes[tab.dataset.route];
  if (!route) return;
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const panel = document.querySelector("#route-content");
  panel.setAttribute("aria-labelledby", tab.id);
  document.querySelector("#route-symbol").textContent = route.symbol;
  document.querySelector("#route-title").textContent = route.title;
  document.querySelector("#route-description").textContent = route.description;
  document.querySelector("#route-tags").replaceChildren(...route.tags.map(label => {
    const span = document.createElement("span");
    span.textContent = label;
    return span;
  }));
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectRoute(tab));
  tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    selectRoute(tabs[next]);
    tabs[next].focus();
  });
});

const shots = [
  "镜头建议：展示滤杯、咖啡粉与器具，建立场景。配音先提出“手冲为什么有那么多细节？”",
  "镜头建议：近距离展示热水缓缓注入咖啡粉，字幕提示观众注意注水节奏与粉层变化。",
  "镜头建议：切到咖啡滴落与成杯，让画面和旁白在结果处收束，形成完整的小故事。"
];
document.querySelectorAll("[data-shot]").forEach(button => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.shot);
    if (!Number.isInteger(index) || index < 0 || index >= shots.length) return;
    document.querySelectorAll("[data-shot]").forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#shot-index").textContent = String(index + 1).padStart(2, "0") + " / 03";
    document.querySelector("#shot-copy").textContent = shots[index];
  });
});
