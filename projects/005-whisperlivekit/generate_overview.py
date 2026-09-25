"""Generate the single-page WhisperLiveKit research diagram as an editable SVG."""

from html import escape
from pathlib import Path


OUT = Path(__file__).resolve().parents[2] / "docs/projects/005-whisperlivekit/assets/overview.svg"
W, H = 1600, 2780
INK = "#173328"
SOFT = "#52645b"
MUTED = "#70847a"
GREEN = "#155b44"
DARK = "#123c2e"
ORANGE = "#d9744e"
PAPER = "#f5f7f3"
WHITE = "#fffefa"
LINE = "#d7e2d8"
MINT = "#e3efe6"
FONT = "Microsoft YaHei, Noto Sans CJK SC, PingFang SC, sans-serif"

svg = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
    '<title id="title">WhisperLiveKit 能力、原理、输入输出和项目价值总览</title>',
    '<desc id="desc">一张完整图解：Whisper、WhisperLiveKit、LiveKit 的关系；音频输入、语音检测、识别模型、流式确认与文字输出；底层依赖、可选能力、场景、对现有项目的价值和使用边界。</desc>',
    f'<rect width="{W}" height="{H}" fill="{PAPER}"/>',
    '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto"><path d="M0 0 L8 5 L0 10" fill="none" stroke="#d9744e" stroke-width="2.5"/></marker></defs>',
]


def rect(x, y, w, h, fill=WHITE, stroke=LINE, rx=18, sw=2):
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')


def text(x, y, value, size=24, color=INK, weight=400, anchor="start", spacing=None):
    attrs = f'x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}"'
    if spacing is not None:
        attrs += f' letter-spacing="{spacing}"'
    svg.append(f'<text {attrs}>{escape(value)}</text>')


def lines(x, y, values, size=22, color=SOFT, weight=400, gap=35):
    for index, value in enumerate(values):
        text(x, y + index * gap, value, size, color, weight)


def rule(x1, y1, x2, y2, color=LINE, width=2):
    svg.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>')


def arrow(x1, y1, x2, y2):
    svg.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{ORANGE}" stroke-width="4" marker-end="url(#arrow)"/>')


def section(number, label, title, y):
    text(70, y, number + " / " + label, 18, GREEN, 800, spacing=2)
    text(70, y + 48, title, 36, INK, 800)


def relation_card(x, label, title, body, footer, featured=False):
    fill = DARK if featured else WHITE
    foreground = WHITE if featured else INK
    secondary = "#d4e8d9" if featured else SOFT
    rect(x, 430, 460, 225, fill, DARK if featured else LINE, 20)
    rect(x + 25, 452, 7, 31, ORANGE if featured else GREEN, ORANGE if featured else GREEN, 3, 0)
    text(x + 48, 477, label, 18, "#acd6b8" if featured else GREEN, 800)
    text(x + 28, 523, title, 30, foreground, 800)
    lines(x + 28, 564, body, 21, secondary, gap=32)
    rule(x + 28, 609, x + 430, 609, "#547461" if featured else LINE)
    text(x + 28, 637, footer, 18, "#acd6b8" if featured else MUTED, 700)


def input_card(x, label, title, body):
    rect(x, 860, 460, 150)
    text(x + 24, 897, label, 18, GREEN, 800)
    text(x + 24, 943, title, 28, INK, 800)
    text(x + 24, 980, body, 21, SOFT)


def process_card(x, number, title, body):
    rect(x, 1095, 335, 207, WHITE, LINE, 15)
    text(x + 22, 1132, number, 18, ORANGE, 800)
    text(x + 22, 1175, title, 27, INK, 800)
    lines(x + 22, 1215, body, 20, SOFT, gap=31)


def output_card(x, title, body, accent=GREEN):
    rect(x, 1450, 460, 158)
    rect(x + 24, 1473, 36, 6, accent, accent, 3, 0)
    text(x + 24, 1523, title, 28, INK, 800)
    lines(x + 24, 1563, body, 21, SOFT, gap=31)


def scenario_card(x, title, body):
    rect(x, 1930, 347, 132, WHITE, LINE, 15)
    text(x + 20, 1984, title, 25, INK, 800)
    text(x + 20, 2027, body, 20, SOFT)


# Header
rect(38, 35, 1524, 270, WHITE, LINE, 24)
rect(70, 67, 190, 38, DARK, DARK, 19, 0)
text(165, 93, "PROJECT 005", 17, WHITE, 800, "middle", 1.8)
text(70, 176, "一张图看懂 WhisperLiveKit", 60, INK, 800)
text(70, 231, "把持续音频变成可逐步显示、确认和复用的文字。核心任务仍是语音转文字。", 25, SOFT)
text(1490, 93, "研究概览 · 2026.09.25", 19, GREEN, 700, "end")
for x, height in [(1357, 27), (1378, 44), (1399, 67), (1420, 38), (1441, 78), (1462, 46), (1483, 29)]:
    rect(x, 156 - height / 2, 9, height, GREEN if x % 2 else ORANGE, GREEN if x % 2 else ORANGE, 4, 0)

# Relationship
section("01", "关系", "三个名字，各管一层", 347)
relation_card(70, "模型", "Whisper", ["把一段语音识别成文字", "提供基础识别能力"], "可被本项目作为识别后端")
relation_card(570, "本次研究对象", "WhisperLiveKit", ["接音频、做流式处理", "逐步输出文字事件"], "默认可用 Whisper，也支持其他后端", True)
relation_card(1070, "另一套平台", "LiveKit", ["在参与者之间传输音视频", "管理实时房间与会话"], "可桥接音频；不是必需依赖")
rect(70, 675, 1460, 72, MINT, MINT, 13, 0)
text(94, 720, "记住：Whisper 负责识别；WhisperLiveKit 负责边听边出字；LiveKit 负责传输实时音视频。", 25, GREEN, 700)

# Input → processing → output
section("02", "原理", "输入 → 实时处理 → 输出", 773)
input_card(70, "输入 A", "网页 / App 麦克风", "音频片段持续送入")
input_card(570, "输入 B", "会议或通话音轨", "已有 LiveKit 时需自行桥接")
input_card(1070, "输入 C", "录音 / 视频文件", "也支持一次性文件转写")
arrow(800, 1020, 800, 1044)

rect(70, 1060, 1460, 278, "#e8f0e9", "#c6d9cb", 20)
process_card(90, "01", "接收与缓冲", ["解码连续音频", "保留必要的上下文"])
process_card(445, "02", "语音活动检测", ["识别说话与静音", "减少无声段计算"])
process_card(800, "03", "识别模型", ["Whisper 系列为默认路线", "亦可选已适配的其他模型"])
process_card(1155, "04", "稳定文字判断", ["AlignAtt：避开音频末端", "LocalAgreement：一致前缀"])
text(90, 1328, "不同识别后端的流式策略可能不同。", 18, SOFT)
for x in (427, 782, 1137):
    arrow(x, 1198, x + 15, 1198)
arrow(800, 1351, 800, 1414)

output_card(70, "临时文字", ["边说边显示", "后续音频到来时可能修订"], ORANGE)
output_card(570, "已确认的片段", ["适合保存或交给后续业务", "可带时间信息"])
output_card(1070, "文件与接口结果", ["文字、JSON、SRT / VTT", "WebSocket / REST / Python"])

rect(70, 1631, 710, 131, WHITE, LINE, 16)
text(96, 1680, "可选增强", 26, INK, 800)
lines(96, 1719, ["说话人编号、文字翻译、会话术语上下文"], 21, SOFT)
rect(820, 1631, 710, 131, WHITE, LINE, 16)
text(846, 1680, "运行底座与可选项", 26, INK, 800)
lines(846, 1719, ["Python · FastAPI/WebSocket · 识别模型与权重", "LiveKit 非必需；翻译/分人/其他后端按需安装"], 20, SOFT, gap=29)

# Scenarios
section("03", "场景", "什么时候会用到？", 1845)
scenario_card(70, "实时字幕", "会议、访谈、直播")
scenario_card(441, "内容整理", "录音转稿、制作字幕")
scenario_card(812, "客服记录", "多人对话与时间线")
scenario_card(1183, "语音助手输入", "把讲话交给业务系统")

# Personal value
section("04", "对我们的意义", "当前先验证效果，实时需求明确后再深挖", 2109)
rect(70, 2183, 710, 210, WHITE, LINE, 18)
rect(70, 2183, 9, 210, ORANGE, ORANGE, 4, 0)
text(101, 2232, "现在 · 录制与成片为主", 21, GREEN, 800)
text(101, 2281, "先看效果，不急着集成", 31, INK, 800)
lines(101, 2323, ["003 Voicebox 已覆盖一部分听写。", "用自己的中文音频小样本对照即可。"], 21, SOFT, gap=33)
rect(820, 2183, 710, 210, DARK, DARK, 18)
rect(820, 2183, 9, 210, ORANGE, ORANGE, 4, 0)
text(851, 2232, "以后 · 需要实时互动时", 21, "#acd6b8", 800)
text(851, 2281, "再研究流式工程能力", 31, WHITE, 800)
lines(851, 2323, ["重点测文字确认延迟、准确度、并发", "以及和现有项目的接口衔接。"], 21, "#d5e5d9", gap=33)

text(70, 2443, "可探索的组合（尚未集成验证）", 22, GREEN, 800)
chain = [
    (70, 2464, 248, "用户讲话"),
    (356, 2464, 248, "005 实时转写"),
    (642, 2464, 248, "006 Fay / LLM"),
    (928, 2464, 248, "003 Voicebox TTS"),
    (1214, 2464, 316, "004 LiveTalking 画面"),
]
for x, y, width, label in chain:
    rect(x, y, width, 70, WHITE, LINE, 12)
    text(x + width / 2, y + 45, label, 21, INK, 700, "middle")
for x in (326, 612, 898, 1184):
    arrow(x, 2499, x + 19, 2499)
text(70, 2572, "成片后可研究 002 内容分发；001 RVC 仅在需要改变已有音频声线时加入。", 20, SOFT)

# Boundaries and source links
rect(70, 2602, 1460, 93, "#fff3ec", "#f1d7c8", 13)
text(97, 2640, "能力边界", 22, "#aa593d", 800)
text(97, 2675, "它不负责语音合成或数字人画面；实时不等于零延迟；说话人编号不等于真实身份。", 21, "#6b5b52")
text(70, 2740, "资料：项目 README · API · Backends · Alignment · Benchmarks · OpenAI Whisper · LiveKit 官方文档", 18, MUTED)
text(1530, 2740, "005 / WHISPERLIVEKIT", 18, GREEN, 800, "end", 1)

svg.append("</svg>")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(svg) + "\n", encoding="utf-8")
print(OUT)
