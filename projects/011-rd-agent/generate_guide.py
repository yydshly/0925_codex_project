"""Generate the RD-Agent one-page SVG guide with exact Chinese text."""
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).resolve().parents[2] / "docs/projects/011-rd-agent/rd-agent-guide.svg"
W,H=1800,3320
ink="#132338"; muted="#50647c"; cyan="#0a918b"; blue="#3268c9"; amber="#ad6b11"; purple="#704cc0"
p=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
'<title id="title">RD-Agent 一图理解：能力、运行原理、场景和使用判断</title>',
'<desc id="desc">完整展示外部大模型、RD-Agent 调度器和执行评价程序的分工；Copilot 与 Agent 两条路径；八个场景；3D 人物流程的缺口；以及何时重新尝试。</desc>',
'<style>text{font-family:"Microsoft YaHei","Noto Sans CJK SC","PingFang SC",Arial,sans-serif}</style>']
def box(x,y,w,h,fill,stroke="none",r=24):
    p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
def t(x,y,s,size=27,color=ink,weight=400,anchor="start"):
    p.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(s)}</text>')
def ls(x,y,ss,size=24,color=muted,gap=37):
    for i,s in enumerate(ss): t(x,y+i*gap,s,size,color)
def head(y,num,title,note=""):
    t(75,y,num,25,cyan,700); t(150,y,title,43,ink,700)
    if note:t(1720,y,note,23,muted,anchor="end")
def card(x,y,w,h,accent,title,details,tag):
    box(x,y,w,h,"#ffffff","#cfdceb",19); box(x,y,w,8,accent,r=3)
    t(x+25,y+44,tag,21,accent,700); t(x+25,y+91,title,30,ink,700)
    ls(x+25,y+132,details,22,muted,34)
box(0,0,W,H,"#edf3fa",r=0)
box(0,0,W,254,"#0d1a2d",r=0);box(75,51,176,37,"#1d6b73",r=17)
t(163,79,"一图导读 · 011",20,"#d4fffa",700,"middle")
t(75,150,"RD-Agent：让研发想法经过多轮真实实验",61,"#ffffff",700)
t(75,209,"论文实现 / 数据集探索 / 指标反馈 / 适用边界 / 对你的价值",29,"#abc1da")
box(70,285,1660,230,"#162a41","#3a5b73")
t(105,335,"一句话定义",23,"#76e0cf",700)
t(105,384,"它是调用外部大模型的研发流程框架，不是一个新的基础模型，也不是现成的 3D 工具。",31,"#eff8ff",700)
for x,w,c,s in [(105,480,"#214e5b","大模型：理解、假设、写代码"),(670,480,"#28446a","RD-Agent：调度、记录、重试"),(1235,460,"#544a4b","程序：运行、训练、评价")]:
    box(x,412,w,68,c,r=14);t(x+w/2,456,s,27,"#ffffff",700,"middle")
t(615,456,"→",36,"#94ddd6",700);t(1180,456,"→",36,"#94ddd6",700)
head(580,"01","入口：先给它什么？","论文和数据集可以出现在同一任务中")
box(70,606,1660,78,"#dce9f3","#c9dbea",16)
t(100,657,"共同前提",27,ink,700)
t(266,657,"任务目标 + 外部 LLM 接口 + 可执行环境 + 评价方式 + 时间/算力预算",27,ink)
card(70,703,805,202,cyan,"A  已知方法 / 论文资料",["论文 PDF、研报、公式或人工指定方案","适合：想理解并实现一个已有方法"],"常见入口 · COPILOT")
card(895,703,835,202,amber,"B  待优化目标 / 数据集",["数据、任务说明、固定验证集、基线和指标","适合：可反复实验并比较得分的问题"],"常见入口 · AGENT")
head(970,"02","内部如何处理？两条常见路径","多次调用模型 + 真正执行 + 反馈")
box(70,995,805,845,"#f8fffe","#a9d9d2")
box(895,995,835,845,"#fffdfa","#e5c798")
t(104,1043,"COPILOT · 人指定方向",23,cyan,700)
t(104,1090,"把已有描述推进到代码",36,ink,700)
ls(104,1135,["例：给通用模型 Copilot 一篇论文 PDF；","给金融数据 Copilot 一份研报。"],25,muted,38)
t(929,1043,"AGENT · 围绕目标探索",23,amber,700)
t(929,1090,"让结果决定下一轮试什么",36,ink,700)
ls(929,1135,["例：给定训练数据、验证集和 AUC 目标；","或给行情数据与回测规则。"],25,muted,38)
steps=[
(104,cyan,"#e6f5f2",737,[("读取资料","Reader 从 PDF / 报告提取结构、公式、描述"),("组织任务","明确输入输出、模型组件和实现约束"),("生成与修复","Coder 多次调用 LLM 写 PyTorch / 因子代码"),("运行检查","样例张量、报错；金融因子可结合回测")]),
(929,amber,"#faf0e1",767,[("研究代理","根据目标和旧结果提出可检验的假设"),("开发代理","把假设写成代码，运行失败则修复"),("真实实验","训练 / 验证 / 回测，产出分数和日志"),("评价与记录","比较基线、保存轨迹，反馈给下一轮")])]
for x,color,fill,w,ss in steps:
    for i,(title,detail) in enumerate(ss):
        y=1226+i*116;box(x,y,w,96,fill,r=15);box(x+14,y+19,55,55,color,r=16)
        t(x+41,y+57,str(i+1),29,"#ffffff",700,"middle")
        t(x+86,y+42,title,26,ink,700);t(x+86,y+73,detail,21,muted)
t(104,1741,"↶  出错或不符合规格时继续修复",25,cyan,700)
t(929,1741,"↶  指标 / 错误 / 经验进入下一轮",25,amber,700)
t(104,1800,"出口：初版代码 + 运行检查 / 回测记录",27,ink,700)
t(929,1800,"出口：候选方案 + 指标 + 实验轨迹",27,ink,700)
head(1915,"03","要分清三件事","两条路径不是互斥产品")
card(70,1943,535,188,cyan,"角色：谁决定方向",["Copilot 跟随人的描述；","Agent 主动探索并参考反馈。"],"ROLE")
card(632,1943,535,188,blue,"对象：改进什么",["模型实现、数据 / 特征 / 因子；","微调还涉及训练配置。"],"OBJECT")
card(1194,1943,536,188,purple,"领域：在哪验证",["金融、数据科学、论文模型、","微调；新领域需要自行适配。"],"DOMAIN")
head(2200,"04","使用场景：七个已有方向 + 一个扩展示例","以官方场景文档为准")
scenes=[
("01","通用论文模型","PDF → PyTorch 实现","结构检查 / 运行修复",cyan),
("02","金融研报因子","研报 → 因子代码","市场数据 / 回测反馈",cyan),
("03","金融因子发现","行情 → 候选特征","因子评价 / 迭代",amber),
("04","金融模型优化","数据 → 模型候选","训练 / 回测比较",amber),
("05","量化联合研发","因子 + 模型组合","交替改进 / 比较",amber),
("06","数据科学任务","表格 / 时序数据","特征 / 模型 / 分数",amber),
("07","大模型微调","基座模型 + 数据集","配置 / 训练 / 基准",amber),
("08","自定义 3D 人物","论文 + 领域数据","需自建运行 / 评价",purple)]
for i,(num,title,a,b,color) in enumerate(scenes):
    x=70+(i%4)*420;y=2230+(i//4)*191
    box(x,y,400,173,"#ffffff","#cfdceb",18);box(x,y,9,173,color,r=4)
    t(x+27,y+43,num,23,color,700);t(x+82,y+44,title,27,ink,700)
    t(x+27,y+96,a,23,muted);t(x+27,y+134,b,23,muted)
head(2687,"05","以 3D 人物为例：论文实现 ≠ 完整产品","这是扩展设想")
box(70,2715,1660,247,"#e9e2f8","#c7b7e8")
t(102,2762,"一篇论文通常只覆盖其中某一环节。即使 RD-Agent 生成了模型代码，也不自动拥有该论文的数据、权重和完整生产流程。",24,"#3e3363")
stages=[("选论文 / 开源实现","匹配文字或单图输入"),("准备数据 / 权重","许可、训练与推理资源"),("生成 3D 资产","几何、网格、纹理"),("后处理","骨骼、动画、导出"),("评价与迭代","身份、质量、可用性")]
for i,(title,detail) in enumerate(stages):
    x=103+i*325;box(x,2810,304,111,"#ffffff","#c7b7e8",14)
    t(x+15,2852,title,23,purple,700);t(x+15,2891,detail,21,muted)
    if i<4:t(x+309,2877,"›",37,purple,700)
head(3035,"06","对你的价值：什么时候值得重新尝试？")
box(70,3060,1660,189,"#14334a","#2a6372")
t(103,3110,"现在",27,"#7ce7d6",700)
t(222,3110,"学习论文：先解释原理，再看 Copilot 的初版代码；做 3D：先找对应论文与公开代码。",26,"#f0faff")
t(103,3161,"以后",27,"#7ce7d6",700)
t(222,3161,"当你有固定数据、基线、指标、执行环境和预算时，再做小规模 Agent 试验。",26,"#f0faff")
t(222,3207,"优先候选：中文语音识别；比较词错率、延迟、成本，再判断自动迭代是否划算。",24,"#b9d3e2")
t(75,3292,"判断边界：可运行代码 ≠ 忠实复现论文 ≠ 达到目标指标；本站展示的是流程模拟，不运行 RD-Agent。",22,muted)
t(1725,3292,"来源：microsoft/RD-Agent 官方仓库及场景文档",20,muted,anchor="end")
p.append("</svg>")
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text("\n".join(p)+"\n",encoding="utf-8")
print(OUT)
