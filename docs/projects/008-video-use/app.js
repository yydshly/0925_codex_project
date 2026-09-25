(() => {
  const buttons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".cap-card")];
  const count = document.getElementById("filter-count");

  if (!buttons.length || !cards.length || !count) return;

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visible = 0;

      for (const card of cards) {
        const show = filter === "all" || card.dataset.group === filter;
        card.hidden = !show;
        if (show) visible += 1;
      }

      for (const candidate of buttons) {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      }
      count.textContent = "显示 " + visible + " 项";
    });
  }
})();