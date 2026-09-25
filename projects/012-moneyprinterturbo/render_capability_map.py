from pathlib import Path
from xml.sax.saxutils import escape

root = Path(r"F:\codex_project\0925_codex_project")
out = root / "docs/projects/012-moneyprinterturbo/assets/capability-map.svg"
W, H = 1600, 1170
parts = []

def add(s): parts.append(s)
def rect(x,y,w,h,fill,rx=0,stroke="none",sw=1):
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
def line(x1,y1,x2,y2,color="#DDE3DA",sw=1):
    add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"/>')
def txt(x,y,s,size=18,color="#25352B",weight=500,anchor="start",spacing=0):
    add(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" letter-spacing="{spacing}" font-family="Microsoft YaHei, Noto Sans SC, PingFang SC, sans-serif">{escape(s)}</text>')
def circle(x,y,r,fill):
    add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>')
def pill(x,y,w,label,bg,fg,size=15):
    rect(x,y,w,31,bg,15)
    txt(x+w/2,y+21,label,size,fg,700,"middle")

add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">')
add('<title id="title">MoneyPrinterTurbo 能力总览图</title>')
add('<desc id="desc">展示输入类型、六步处理流程、输出效果、运行环境和可选模型、使用场景，以及作为自有产品基础的意义。</desc>')
rect(0,0,W,H,"#F6F4ED")
rect(0,0,W,11,"#F0784C")
circle(1490,108,95,"#EEEFE5")
circle(1550,62,53,"#E4EADF")
txt(60,57,"MONEYPRINTERTURBO  /  CAPABILITY MAP",17,"#D66C45",800,spacing=2)
txt(60,115,"从输入到成片，一张图看懂",45,"#223A2B",850)
txt(62,155,"核心原理：大模型生成文案和画面线索；预写程序调度各环节，媒体工具合成最终视频。",18,"#677267",500)
pill(1243,43,281,"一站式生成 · 可控地接管","#E4EEDF","#386044",16)

# Main cards
for x,w in [(60,370),(450,700),(1170,370)]:
    rect(x,190,w,460,"#FFFEFA",21,"#DCE2D8",1.5)
rect(60,190,370,6,"#F0784C",3)
rect(450,190,700,6,"#6B9471",3)
rect(1170,190,370,6,"#3D6550",3)
txt(86,237,"01  /  输入什么",25,"#253B2D",800)
txt(476,237,"02  /  如何处理",25,"#253B2D",800)
txt(1196,237,"03  /  输出什么",25,"#253B2D",800)
line(86,253,404,253)
line(476,253,1124,253)
line(1196,253,1514,253)

# Input rows
input_rows = [
    ("A","主题 / 关键词","一句话即可启动自动创作",281),
    ("B","自备脚本","直接使用，或交给模型改写",350),
    ("C","本地图片 / 视频","作为可控的画面素材",419),
    ("D","录制的配音 / 自备音乐","替换自动语音或背景乐",488),
]
for letter,title,desc,y in input_rows:
    circle(103,y-5,17,"#FCE9DD")
    txt(103,y+1,letter,15,"#D36F47",850,"middle")
    txt(132,y,title,20,"#26392C",750)
    txt(132,y+27,desc,15,"#788176",450)
rect(84,544,322,63,"#EBF2E8",11)
txt(99,569,"还能设置",15,"#4F7755",800)
txt(99,593,"语言 · 画幅 · 字幕 · 生成数量",15,"#46634B",600)
txt(86,631,"提交入口：WebUI / API / CLI / AI Agent",13,"#879087",600)

# Process
steps=[
("01","文案与素材词","生成脚本，提取画面搜索词"),
("02","准备视觉画面","现成视频 / 图片缓慢缩放 / AI 动态片段"),
("03","制作旁白","TTS / 上传录音 / 无配音"),
("04","字幕时间轴","语音时间戳 / faster-whisper 转写"),
("05","剪辑与混音","预写代码调用 MoviePy / FFmpeg 拼接、叠字、混音"),
("06","导出与交付","产出成片；可批量，可选发布"),
]
for i,(num,title,desc) in enumerate(steps):
    y=284+i*59
    if i<5: line(502,y+17,502,y+57,"#BED1BD",2)
    circle(502,y,18,"#3E684E" if i==5 else "#E8F1E7")
    txt(502,y+5,num,13,"#FFFFFF" if i==5 else "#4B7653",800,"middle")
    txt(535,y-3,title,19,"#263C2E",800)
    txt(535,y+22,desc,15,"#788476",500)
    if i<5: line(535,y+35,1124,y+35,"#ECF0E9",1)

# Output thumbnail
rect(1195,270,320,179,"#1D382B",12)
rect(1210,285,290,149,"#416B52",8)
add('<path d="M1210 390 C1270 326 1310 360 1350 316 C1390 350 1440 333 1500 287 L1500 434 L1210 434 Z" fill="#75A780"/>')
add('<path d="M1210 420 C1260 365 1300 385 1350 362 C1410 390 1450 354 1500 335 L1500 434 L1210 434 Z" fill="#D2BC8E"/>')
circle(1355,352,28,"#FCF9F0")
add('<path d="M1348 338 L1371 352 L1348 366 Z" fill="#32533F"/>')
rect(1228,396,180,7,"#FFFDF4",3)
rect(1228,411,135,6,"#EAE5D7",3)
txt(1197,475,"成片示意",14,"#8A978B",600)
pill(1195,489,92,"9:16","#E7EFE5","#486A4D",14)
pill(1297,489,92,"16:9","#E7EFE5","#486A4D",14)
pill(1399,489,92,"1:1","#E7EFE5","#486A4D",14)
txt(1197,552,"画面 + 旁白 + 字幕 + 配乐",18,"#314B38",750)
txt(1197,581,"高清短视频 · 可选平台发布",15,"#758276",500)
line(1197,599,1513,599)
txt(1197,625,"官方真实成片可在本页案例区播放 ↗",13,"#CC6C47",700)

# connector arrows
add('<path d="M432 417 L445 417 M438 411 L445 417 L438 423" fill="none" stroke="#F0784C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
add('<path d="M1152 417 L1165 417 M1158 411 L1165 417 L1158 423" fill="none" stroke="#5E8C67" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')

# Bottom cards
for x,w in [(60,710),(790,350),(1160,380)]:
    rect(x,674,w,397,"#FFFEFA",21,"#DCE2D8",1.5)
txt(86,722,"04  /  依赖哪些模型与环境？",25,"#253B2D",800)
txt(816,722,"05  /  使用场景",25,"#253B2D",800)
txt(1186,722,"06  /  对你的意义",25,"#253B2D",800)
line(86,740,744,740)
line(816,740,1114,740)
line(1186,740,1514,740)
pill(87,761,108,"基础运行","#E6EFE3","#42694A",14)
pill(425,761,186,"按需要选择服务","#FCE9DD","#B9613C",14)
txt(88,814,"Python 3.11+ · Windows / macOS / Linux",15,"#2F4735",700)
txt(88,846,"CPU 可运行；GPU 非必需",17,"#2F4735",700)
txt(88,878,"MoviePy + FFmpeg 完成视频合成",17,"#2F4735",700)
txt(426,814,"脚本：Kimi / OpenAI / DeepSeek 等",16,"#2F4735",700)
txt(426,846,"画面：图库 API / AI 图像或视频模型",16,"#2F4735",700)
txt(426,878,"声音：Edge TTS 等；字幕可用 Whisper",16,"#2F4735",700)
rect(87,924,656,104,"#F6F4E9",11)
txt(108,957,"配置原则",17,"#526C4F",800)
txt(108,983,"已有脚本、画面或配音时，可跳过对应模型环节。",16,"#647564",500)
txt(108,1009,"外部服务通常需要 API Key；本地转写和批量处理可用 GPU 加速。",15,"#647564",500)

# Scenarios
scenarios=[
("知识科普","主题 → 解说短片",783),
("品牌内容","自有素材 → 多版初稿",860),
("系列账号","统一模板 → 批量生产",937),
]
for title,desc,y in scenarios:
    circle(832,y-5,6,"#F0784C")
    txt(850,y,title,20,"#314B38",800)
    txt(850,y+25,desc,15,"#788477",500)
line(816,1002,1114,1002)
txt(816,1030,"适合结构清晰、可人工审片的短视频",13,"#8A9288",500)

# Product meaning
value=[
("01","复用生成底座","更快验证产品需求",785),
("02","做垂直体验","模板、素材库、逐镜头编辑与审核",866),
("03","用真实数据决策","成功率、成本、修改时间、采用率",947),
]
for num,title,desc,y in value:
    txt(1187,y,num,16,"#D57550",800)
    txt(1226,y,title,20,"#314B38",800)
    txt(1226,y+26,desc,15,"#788477",500)
line(1186,1020,1514,1020)
txt(1186,1048,"建议先选一种用户与视频类型做验证",13,"#8A9288",500)

# Footer
line(60,1095,1540,1095,"#DADFD5",1.5)
txt(60,1128,"边界：当前主流程没有物理规律驱动的图形仿真；自动成片仍需审核事实、画面、版权和发布要求。",15,"#6E796E",550)
txt(60,1154,"来源：github.com/harry0703/MoneyPrinterTurbo  ·  资料核对：2026-09-26",13,"#9AA59A",500)
txt(1540,1154,"PROJECT 012",13,"#9AA59A",800,"end",1)
add('</svg>')
out.write_text("\n".join(parts),encoding="utf-8")
print(out)
