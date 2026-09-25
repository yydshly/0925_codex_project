const filterButtons = [...document.querySelectorAll('[data-filter]')];
const engineRows = [...document.querySelectorAll('tbody tr[data-kind]')];
const resultCount = document.getElementById('result-count');

function applyFilter(filter) {
  let visible = 0;
  for (const row of engineRows) {
    const matches = filter === 'all' || row.dataset.kind === filter || (filter === 'zh' && row.dataset.zh === 'true');
    row.hidden = !matches;
    if (matches) visible += 1;
  }
  for (const button of filterButtons) {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  resultCount.textContent = `显示 ${visible} 个引擎`;
}

for (const button of filterButtons) {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
}

const caseTabs = [...document.querySelectorAll('[role="tab"][data-case]')];
const casePanels = [...document.querySelectorAll('[role="tabpanel"][data-panel]')];

function selectCase(caseName, focus = false) {
  for (const tab of caseTabs) {
    const selected = tab.dataset.case === caseName;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  }
  for (const panel of casePanels) panel.hidden = panel.dataset.panel !== caseName;
}

caseTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCase(tab.dataset.case));
  tab.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % caseTabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + caseTabs.length) % caseTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = caseTabs.length - 1;
    else return;
    event.preventDefault();
    selectCase(caseTabs[next].dataset.case, true);
  });
});

const progressBar = document.getElementById('progress-bar');
let progressFrame = 0;

function updateProgress() {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
}

function scheduleProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}

window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress);
updateProgress();
