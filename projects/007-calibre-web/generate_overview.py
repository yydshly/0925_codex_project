"""Build the editable, single-page SVG overview for project 007."""

from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUTPUTS = (
    ROOT / "projects/007-calibre-web/assets/overview.svg",
    ROOT / "docs/projects/007-calibre-web/assets/overview.svg",
)

W, H = 1800, 3260
NAVY = "#11213d"
NAVY2 = "#203456"
BLUE = "#235bb8"
INK = "#17243b"
MUTED = "#52627c"
LINE = "#ced9ea"
PAPER = "#f5f8fc"
WHITE = "#ffffff"
LIME = "#ddfb68"
TEAL = "#1a9297"
ORANGE = "#ef8a55"

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
    '<title id="title">Calibre-Web 能力、操作、输入输出与内部原理一图总览</title>',
    '<desc id="desc">上方展示 Calibre 书库、用户操作与外部元数据输入，经 Calibre-Web 的路由、权限、书目查询、书籍处理和分发模块，输出到浏览器、OPDS、Kobo 和邮件。下方列出首次操作步骤、六类功能、运行资源、个人价值及能力边界。</desc>',
    '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#4274c4"/></marker></defs>',
    '<style>text{font-family:Inter,"Microsoft YaHei","PingFang SC","Noto Sans CJK SC",sans-serif} .heavy{font-weight:800}.semibold{font-weight:700}.mono{font-family:Consolas,"Microsoft YaHei",monospace}</style>',
]


def add(fragment):
    parts.append(fragment)


def rect(x, y, w, h, fill=WHITE, stroke="none", r=18, sw=2):
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')


def line(x1, y1, x2, y2, color=LINE, width=2, arrow=False):
    end = ' marker-end="url(#arrow)"' if arrow else ""
    add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"{end}/>')


def text(x, y, value, size=28, color=INK, weight=400, anchor=None, cls=None):
    attrs = f' x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}"'
    if anchor:
        attrs += f' text-anchor="{anchor}"'
    if cls:
        attrs += f' class="{cls}"'
    add(f'<text{attrs}>{escape(value)}</text>')


def lines(x, y, values, size=25, color=MUTED, leading=38, weight=400):
    for index, value in enumerate(values):
        text(x, y + leading * index, value, size, color, weight)


def tag(x, y, value, fill="#e8effa", color=BLUE, w=None):
    width = w or (len(value) * 23 + 30)
    rect(x, y, width, 41, fill, "none", 8)
    text(x + 15, y + 29, value, 23, color, 750)


def section(y, number, title, detail):
    text(72, y, f"{number}  /  {title}", 37, INK, 800)
    text(1728, y, detail, 24, MUTED, 500, anchor="end")


def labeled_row(x, y, label, descriptions, accent=BLUE):
    rect(x, y - 30, 10, 62, accent, "none", 5)
    text(x + 25, y, label, 29, INK, 750)
    lines(x + 25, y + 35, descriptions, 23, MUTED, 32)


# Header and reading key.
rect(0, 0, W, 296, NAVY, "none", 0)
rect(72, 60, 13, 34, LIME, "none", 3)
text(104, 89, "PROJECT 007  /  OPEN-SOURCE ATLAS", 26, LIME, 800)
text(72, 174, "Calibre-Web 一图总览", 76, WHITE, 800)
text(75, 229, "已有书库 → 网页管理与阅读 → 阅读器分发", 31, "#d7e3f5", 500)
rect(1401, 64, 327, 57, NAVY2, "#607395", 28)
text(1565, 102, "资料研究 · 2026.09", 23, WHITE, 650, anchor="middle")
line(72, 270, 1728, 270, "#486080", 2)
text(72, 289, "INPUT  书库与操作", 21, "#b6c9e4", 650)
text(705, 289, "PROCESS  Flask 服务与独立用户库", 21, "#b6c9e4", 650)
text(1460, 289, "OUTPUT  多端获取", 21, "#b6c9e4", 650)


# Input, internal modules and output.
section(369, "01", "数据与模块", "一条主线看清内部原理")
rect(72, 406, 440, 764, WHITE, LINE, 20)
rect(554, 406, 692, 764, "#edf3fc", "#a9c2e8", 20)
rect(1288, 406, 440, 764, WHITE, LINE, 20)

text(102, 455, "INPUT / 输入", 23, BLUE, 800)
text(102, 511, "先有一份书库", 42, INK, 800)
line(102, 533, 482, 533)
labeled_row(102, 581, "Calibre metadata.db", ["SQLite 书目：书名、作者、标签、", "格式、路径与自定义列"])
labeled_row(102, 707, "书籍与封面文件", ["EPUB / PDF / TXT / 漫画 / 音频等", "保存在书库目录中"], TEAL)
labeled_row(102, 833, "用户与管理员操作", ["上传、编辑、搜索、建书架；", "设置账号、权限与可见内容"], ORANGE)
labeled_row(102, 959, "外部元数据来源", ["按需查询并补全书籍信息；", "可自建元数据提供者"], BLUE)
rect(101, 1080, 382, 57, "#e8f0ff", "none", 9)
text(292, 1117, "源码仓库不附带你的藏书", 24, BLUE, 750, anchor="middle")

line(519, 780, 546, 780, "#4274c4", 7, True)
line(1252, 780, 1280, 780, "#4274c4", 7, True)

text(584, 455, "PROCESS / 核心服务", 23, BLUE, 800)
text(584, 510, "Calibre-Web", 44, INK, 800)
text(584, 549, "Flask 路由接收请求；SQLAlchemy 连接书库与应用数据", 23, MUTED)
rect(584, 573, 632, 70, NAVY, "none", 10)
text(606, 603, "请求入口", 23, LIME, 800)
text(606, 631, "网页 / OPDS / Kobo → 登录与权限检查 → 调用功能模块", 23, WHITE, 550)

module_cards = [
    (584, 666, "书目查询", ["db.py · search.py · shelf.py", "筛选 / 排序 / 自定义列"]),
    (908, 666, "用户与配置", ["ub.py · admin.py · 登录服务", "账号 / 权限 / 内容隐藏"]),
    (584, 816, "书籍处理", ["editbooks.py · uploader.py", "上传 / 元数据 / 封面 / 转换"]),
    (908, 816, "阅读与分发", ["web.py · opds.py · kobo.py", "阅读 / 下载 / 同步 / 推送"]),
]
for x, y, title, details in module_cards:
    rect(x, y, 308, 135, WHITE, LINE, 10)
    text(x + 20, y + 42, title, 29, INK, 800)
    lines(x + 20, y + 79, details, 21, MUTED, 30)

rect(584, 973, 632, 127, "#dfeaff", "#b5cbed", 10)
text(606, 1016, "应用数据 + 后台任务", 28, BLUE, 800)
lines(606, 1053, ["app.db：用户、书架、阅读状态、设置；与书库分开", "worker / tasks：转换、上传、邮件等耗时工作"], 22, MUTED, 31)
text(584, 1142, "格式转换调用外部 ebook-convert / Kepubify 程序", 22, BLUE, 700)

text(1318, 455, "OUTPUT / 输出", 23, BLUE, 800)
text(1318, 511, "从浏览器到设备", 42, INK, 800)
line(1318, 533, 1698, 533)
labeled_row(1318, 581, "浏览器", ["书目页面、在线阅读、", "下载原书与查看封面"])
labeled_row(1318, 707, "OPDS XML 目录", ["供兼容阅读器订阅、", "搜索和获取电子书"], TEAL)
labeled_row(1318, 833, "Kobo 同步", ["同步书籍、书架与阅读状态；", "需要启用并完成设备配置"], BLUE)
labeled_row(1318, 959, "邮件与文件更新", ["发书到阅读器；上传 / 编辑时", "更新书库文件和元数据"], ORANGE)
rect(1317, 1080, 382, 57, "#fff1e9", "none", 9)
text(1508, 1117, "Kobo 不同步 PDF", 24, "#a94b25", 750, anchor="middle")


# Operating sequence.
section(1246, "02", "如何操作", "先配置一次，再围绕书籍日常使用")
rect(72, 1282, 1656, 356, NAVY, "none", 20)
steps = [
    ("01", "准备书库", ["已有 Calibre 目录：", "metadata.db + 书籍文件"]),
    ("02", "安装启动", ["pip install calibreweb", "运行 cps；也可用 Docker"]),
    ("03", "首次配置", ["打开 localhost:8083", "选择书库目录，修改密码"]),
    ("04", "整理与发现", ["上传、编辑、搜索", "按标签与书架分类"]),
    ("05", "阅读与分发", ["浏览器、下载、OPDS", "按需配置 Kobo / 邮件"]),
]
for i, (num, title, detail) in enumerate(steps):
    x = 94 + i * 318
    rect(x, 1354, 300, 178, NAVY2, "#4b6487", 12)
    text(x + 18, 1395, num, 27, LIME, 800)
    text(x + 18, 1443, title, 30, WHITE, 800)
    lines(x + 18, 1484, detail, 21, "#c9d7ea", 31)
    if i < 4:
        text(x + 308, 1455, "›", 33, LIME, 700, anchor="middle")
text(100, 1590, "可选：安装封面 / 转换依赖，配置 OAuth、Google Drive、邮件和 Kobo；对外访问建议 HTTPS。", 23, "#dce7f7")


# Capabilities, six domains.
section(1720, "03", "包含的功能", "官方功能按使用任务归为六类")
capabilities = [
    ("01", "发现与搜索", ["浏览、排序、高级搜索与筛选", "书名 / 作者 / 标签 / 简介等字段", "支持 Calibre 自定义列"], BLUE),
    ("02", "书库管理", ["上传（含音频）、编辑或删除书籍", "封面、分类、书架和阅读状态", "可查找外部元数据"], TEAL),
    ("03", "在线阅读", ["浏览器阅读 EPUB / PDF / TXT", "漫画格式阅读与原文件下载", "也可限制下载权限"], ORANGE),
    ("04", "设备连接", ["OPDS 供阅读器浏览书目", "Kobo 书籍 / 书架 / 阅读状态同步", "邮件发送到电子阅读器"], BLUE),
    ("05", "用户与安全", ["管理员和细粒度用户权限", "权限、可见内容、可选公开注册", "LDAP / OAuth / 代理登录、魔术链接"], TEAL),
    ("06", "处理与扩展", ["Calibre 工具转换、Kepubify", "元数据提供者可扩展", "Google Drive、主题、多语言与更新"], ORANGE),
]
for i, (num, title, details, accent) in enumerate(capabilities):
    col = i % 3
    row = i // 3
    x = 72 + col * 558
    y = 1757 + row * 274
    rect(x, y, 540, 254, WHITE, LINE, 14)
    rect(x, y, 540, 8, accent, "none", 4)
    text(x + 25, y + 51, num, 23, accent, 800)
    text(x + 82, y + 55, title, 34, INK, 800)
    lines(x + 27, y + 112, details, 25, MUTED, 40)


# Resources.
section(2357, "04", "运行资源", "必要资源与按功能增加的组件")
rect(72, 2396, 810, 359, WHITE, LINE, 16)
rect(900, 2396, 828, 359, "#e9f1ff", "#bfd0ea", 16)
tag(100, 2422, "基础 · 必需", "#dceaff", BLUE, 181)
tag(928, 2422, "功能 · 可选", "#d7eeed", "#147276", 181)
text(100, 2493, "先准备能被读取的书库", 32, INK, 800)
lines(100, 2541, [
    "• Calibre 书库目录：metadata.db + 书籍文件",
    "• Python 运行环境、存储空间与浏览器",
    "• app.db 保存设置；连同整份书库备份",
    "• 跨设备访问需要网络地址；公网建议 HTTPS",
], 25, MUTED, 43)
text(928, 2493, "需要时再加入", 32, INK, 800)
lines(928, 2541, [
    "• ebook-convert / Kepubify：格式与 Kobo 转换",
    "• ImageMagick / Ghostscript：封面提取",
    "• SMTP、OPDS 客户端或 Kobo 设备",
    "• LDAP / OAuth / Google Drive 可选依赖",
], 25, MUTED, 43)


# Meaning and boundaries.
section(2820, "05", "场景、价值与边界", "把它放进现有内容创作项目地图")
rect(72, 2859, 810, 306, NAVY, "none", 16)
rect(900, 2859, 828, 306, WHITE, LINE, 16)
text(104, 2908, "对我的意义", 34, LIME, 800)
lines(104, 2957, [
    "书籍 / PDF → 编目、标签、书架与阅读 → 选题和查证",
    "可为 Voicebox、Fay、LiveTalking 与发布流程",
    "提供整理好的资料入口；跨项目接口仍需实测。",
    "场景：个人藏书 / 家庭共读 / 阅读器 / 创作资料",
    "建议先拿一份小书库试用，再决定长期部署。",
], 25, "#e3eaf5", 44)
text(930, 2908, "它目前不负责", 34, INK, 800)
lines(930, 2957, [
    "• 提供现成藏书；你需要接入自己的 Calibre 书库",
    "• 书籍正文全文 / 语义搜索和 AI 问答",
    "• 自动把藏书变成 Fay 的可引用知识库",
    "• 多书库官方建议运行多个实例",
    "• 同库并发修改元数据需谨慎",
], 25, MUTED, 44)

line(72, 3201, 1728, 3201, LINE, 2)
text(72, 3238, "依据：janeczku/calibre-web README、Wiki、cps 模块代码  ·  图中“扩展方向”不计入已有能力", 22, MUTED)
text(1728, 3238, "007  /  CALIBRE-WEB", 22, BLUE, 800, anchor="end")
add("</svg>")

svg = "\n".join(parts) + "\n"
for destination in OUTPUTS:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(svg, encoding="utf-8")
print("Wrote " + ", ".join(str(path) for path in OUTPUTS))
