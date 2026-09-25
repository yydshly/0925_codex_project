(() => {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const rows = [...document.querySelectorAll(".matrix tbody tr")];
  const count = document.getElementById("filter-count");

  function applyFilter(filter) {
    let visible = 0;
    rows.forEach((row) => {
      const matches = filter === "all" || row.dataset[filter] === "yes";
      row.hidden = !matches;
      if (matches) visible += 1;
    });
    buttons.forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    count.textContent = "显示 " + visible + " 个平台";
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });
})();
