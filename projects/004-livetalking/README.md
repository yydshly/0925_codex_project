# 004 · LiveTalking：实时数字人能力与依赖

> LiveTalking 把文字或已有音频变成数字人说话的实时音视频。本研究重点回答：能做什么、是否依赖本地模型、怎样部署，以及何时适合接入现有内容工作流。

## 基本信息

- 原仓库：[lipku/LiveTalking](https://github.com/lipku/LiveTalking)
- 作者：Hengzhong Li（GitHub：lipku）
- 研究日期：2026-09-25
- 项目类型：实时数字人渲染、口型同步与音视频推流
- 在线网页：[LiveTalking 能力地图](https://yydshly.github.io/0925_codex_project/projects/004-livetalking/)（静态导读，未部署上游服务）

## 完整架构图

[在网页查看一张完整的输入、处理、模型、环境与输出图](../../docs/projects/004-livetalking/index.html#architecture) · [单独打开矢量图](../../docs/projects/004-livetalking/assets/architecture.svg) · [PNG 预览](../../docs/projects/004-livetalking/assets/architecture.png)

图将人物素材的**提前预处理**与文字、现成音频的**每次播报处理**分开。服务中还区分 API 与会话、可选的 ASR/LLM/TTS、声学特征、所选口型模型、画面合成及 WebRTC/RTMP/虚拟摄像头/MP4 出口。下方是当前上游的运行组合和代表性 Python 依赖。图中的 Voicebox、RVC、015 和 002 为我们已有研究中的候选接点，不表示跨项目集成已跑通。
## 研究摘要

LiveTalking 的核心是把**声音驱动的人物口型画面**实时送到浏览器或直播平台。它提供 WebRTC、RTMP、虚拟摄像头输出；支持自定义人物形象、会话与打断、预设动作、录制和 API 接入。LLM 和 TTS 可以配合使用，但不是其口型渲染能力的前提。适合数字人客服、课程讲解、虚拟主播和内容制作。[项目 README](https://github.com/lipku/LiveTalking)

## 能力清单

| 能力 | 作用 | 依赖与边界 |
| --- | --- | --- |
| 文字驱动 | `/human` 的 `echo` 直接播报文字；`chat` 先调用 LLM | 文字需经 TTS 变成音频；`chat` 另需 LLM 配置 |
| 音频驱动 | `/humanaudio` 上传音频，让人物按现有声音说话 | 可绕过内置 LLM 和 TTS；接口接收音频文件 |
| 口型与画面 | 使用 Wav2Lip、MuseTalk 等模型生成口型并贴回人物画面 | 自托管时要在服务器放置所选模型权重和 avatar 数据 |
| 自定义人物 | 从视频或图片预处理成可使用的 avatar | 各模型制作方法不同；Wav2Lip 的示例输入要求闭嘴视频 |
| 会话与动作 | 多会话、打断当前播报、静音时播放指定视频 | 并发数受 CPU/GPU 资源约束 |
| 输出与录制 | WebRTC、RTMP、虚拟摄像头；可录制 MP4 | RTMP/虚拟摄像头需相应服务或驱动 |
| 扩展 | TTS、avatar、输出模块可替换；可用 API 接入前端 | 声音克隆由所选 TTS 服务或模型提供 |

接口依据：[API 文档](https://github.com/lipku/LiveTalking/blob/main/docs/api.md)；模型、动作和传输依据：[官方使用说明](https://doc.livetalking.ai/docs/usage/)。

### 工作原理

```text
文字 ── 可选 LLM ── TTS ──┐
                           ├─ 音频特征 ─ 口型模型 ─ 与 avatar 画面合成 ─ WebRTC/RTMP/虚拟摄像头
现有音频 ──────────────────┘
```

LLM 负责“说什么”，TTS 负责“发出什么声音”，口型模型负责“画面中的嘴怎么动”，LiveTalking 将这些模块接成实时会话并输出音视频。MuseTalk 等模型并非整段视频都从零生成，而是重点修改说话相关的面部区域。其核心是口型同步；明显的眉眼表情、头部和身体动作更多取决于人物素材或额外动作编排，不能把语音输入理解为对全部表情动作的完整控制。[LiveTalking 架构](https://github.com/lipku/LiveTalking#3-%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84) · [MuseTalk 模型说明](https://github.com/TMElyralab/MuseTalk#model)

## 本地模型：要准备什么

**结论：自托管渲染需要本地视觉模型文件和人物素材，但不要求自己训练现成的 Wav2Lip 或 MuseTalk 模型。** “本地”指运行 LiveTalking 的电脑或服务器；浏览器用户无需各自下载口型权重。

| 选择 | 官方提供的准备方式 | 是否需要自己训练 |
| --- | --- | --- |
| Wav2Lip，最直接的试跑路径 | 下载 `wav2lip256.pth`，放到 `models/wav2lip.pth`；解压示例 avatar 到 `data/avatars/wav2lip256_avatar1/`。官方详细使用说明还列出用于人脸检测的 `s3fd.pth` | 使用预训练权重和示例 avatar 时不需要 |
| MuseTalk | 下载相应 `models/` 文件和 `musetalk_avatar1` 素材；制作自己的 avatar 时另装人脸处理依赖 | 使用预训练权重和示例 avatar 时不需要 |
| Ultralight-Digital-Human | 官方说明要求先在原项目训练对应人物模型，再制作 avatar | 按官方路径，需要训练人物模型 |
| ER-NeRF | 位于 `ernerf-rtmp` 分支；使用自己的数字人需准备训练产物 | 通常需要人物对应的训练产物 |

[模型文件、可选服务与部署环境](docs/requirements.md)列出完整依赖关系。

### LLM、TTS、ASR 分别是否必需

- **LLM：可选。** `echo` 只播报传入文字，`chat` 才使用大模型。
- **TTS：文字输入时需要某种语音合成。** 默认配置是 EdgeTTS，它调用在线语音服务；想用本地语音模型，需要另行部署并接入。上传已有音频可不走 TTS。
- **ASR：将用户讲话变成文字时才需要。** 官方使用说明有浏览器识别和 FunASR 服务接入示例；完整的实时语音对话、唤醒词打断等开箱即用体验在官方版本对比中列为商用版能力。两份文档的表述粒度不同，选型时要按实际要用的流程验证。[语音输入示例](https://doc.livetalking.ai/docs/usage/#37-%E8%AF%AD%E9%9F%B3%E8%BE%93%E5%85%A5) · [版本对比](https://doc.livetalking.ai/docs/service/)

## 值得借鉴的做法

1. **把内容、声音、画面分层：** 同一个数字人渲染层能接不同 LLM、TTS，也能直接接已有音频，降低后续替换成本。
2. **会话化输出：** WebRTC 连接产生 `sessionid`，后续播报、打断和录制围绕这个会话进行，适合交互应用。
3. **把人物预处理放在运行前：** 预先准备 avatar 帧和坐标，再把实时算力集中在口型推理与编码上。

## 对现有项目的意义

当前仓库中，001 RVC 研究声音转换，003 Voicebox 研究听写与配音，002 social-auto-upload 研究内容分发。LiveTalking 可位于**声音制作与视频发布之间**：

`文案/LLM → Voicebox 或其他 TTS 生成音频 → LiveTalking 生成数字人出镜视频 → social-auto-upload 分发`

这是可探索的组合路径，不代表已验证这些工具的接口直接兼容。实际接入时应先检查音频格式、延迟、成片质量和各模型授权。实时客服则是另一条路径：用户语音 → ASR → LLM → TTS → LiveTalking。

## 与此前 015 数字人物练习的区别

此前的 [015「从声音到数字人物」](https://github.com/yydshly/0907_codex_project/blob/main/projects/015-audio2face-3d/README.md)已完成两条路线：一条用 Audio2Face-3D 驱动三维人物面部；另一条将照片做成动作视频，用**本地 MuseTalk 1.5**根据语音重绘口型，再经自研稳定、融合、FFmpeg 编码为 MP4。这与 LiveTalking 的 MuseTalk 口型能力存在实质重叠，不是第一次在本机尝试数字人口型。

| 比较 | 015 练习 | LiveTalking |
| --- | --- | --- |
| 视觉能力 | MuseTalk 1.5 视频口型；独立的 Audio2Face-3D 三维面部路线 | 可选 MuseTalk、Wav2Lip 等口型模型；不包含 015 的 Audio2Face-3D 实现 |
| 人物动作 | LivePortrait、本地或远端动作素材，以及自研稳定和融合 | 预处理 avatar、待机动作和全身视频拼接；原来的动作生成流程不会自动接入 |
| 交付方式 | 生成 MP4 后在自研网页分段播放，可打断与切换 | 面向持续 WebRTC / RTMP / 虚拟摄像头音视频流，含会话和录制接口 |
| 本地验证 | Windows、RTX 4070 Laptop 8 GB 跑通 MuseTalk 1.5；有真实成片 | 当前 004 尚未部署和实测实时帧率 |

015 的早期三段 4 秒成片各需约 24–26 秒嘴型渲染；后续优化记录中，一段 4.52 秒结果的本地渲染为 8.172 秒。它们来自不同阶段，不能直接比较为固定提速，也不能代表 LiveTalking 的实时帧率。[早期完整效果记录](https://github.com/yydshly/0907_codex_project/blob/main/projects/015-audio2face-3d/notes/complete-results.md) · [后续渲染记录](https://github.com/yydshly/0907_codex_project/blob/main/projects/015-audio2face-3d/notes/natural-body-v2.md)

**选择判断：** 预先制作短视频时，先复用 015 已有流程；当需求是实时网页对话、直播推流或标准会话接口时，再试 LiveTalking。015 的 MuseTalk 权重、人物缓存与 LiveTalking 的版本、路径、avatar 数据格式是否兼容，尚未核对，不能直接认为可以复制即用。[以前的真实效果录像](https://yydshly.github.io/0907_codex_project/demos/015-audio2face-3d/#recording-demo)
## 比较时先分清模型与系统

如果要比较最终效果，应先按任务看**具体模型**，再看整个系统能否稳定交付。同一段语音、同一个人物素材、同一硬件和相近设置下，比较才有意义。[网页模型对照](../../docs/projects/004-livetalking/index.html#model-roles)把现有研究分成四层：

| 层 | 代表能力 | 入口 → 出口 | 主要判断 |
| --- | --- | --- | --- |
| 声音 | ASR、TTS、RVC；Voicebox 是承载部分能力的工作台 | 语音 → 文字，文字 → 配音，原音频 → 换声音频 | 识别准确、发音与音色、延迟 |
| 二维口型 | MuseTalk、Wav2Lip 等 | 音频 + 人物帧 → 同步口型画面 | 同步、自然度、身份保持、闪烁、帧率 |
| 动作与表情 | 015 使用过 LivePortrait、Hailuo 等 | 人物素材 + 驱动/生成条件 → 动作画面 | 动作自然、人物一致、与口型衔接 |
| 三维面部 | Audio2Face-3D，属于 015 的独立路线 | 音频 + 3D 人物 → 面部动画 | 角色适配、表情与实时表现 |

LiveTalking 的作用是把所选口型模型、avatar、音频、会话与 WebRTC/RTMP 输出接起来；015 则把动作素材和 MuseTalk 等组件编排为 MP4。002 social-auto-upload 只负责成片分发。两条二维路线若都使用 MuseTalk，核心口型模型同源，差别应具体比较模型版本、人物预处理、合成与传输方式，不能称为不同口型模型的正面对比。口型模型根据连续音频特征生成画面，并非查找预制嘴型图片。MuseTalk 使用的 Whisper 音频编码器在此提取特征，不是先把语音转文字。[LiveTalking](https://github.com/lipku/LiveTalking) · [MuseTalk](https://github.com/TMElyralab/MuseTalk) · [Wav2Lip](https://github.com/Rudrabha/Wav2Lip) · [Audio2Face-3D](https://github.com/NVIDIA/Audio2Face-3D)
## 与既有能力的接入方案

[网页中的组合能力地图](../../docs/projects/004-livetalking/index.html#ecosystem)把现有研究按“声音 → 人物画面 → 交付”连接，提供两条目标不同的路径：

| 路径 | 可选择的模块 | 当前证据 |
| --- | --- | --- |
| 预先制作成片 | 文案或 Voicebox 听写/配音 → 可选 RVC 换声 → 015 已有动作视频 + MuseTalk 口型成 MP4，或未来试用 LiveTalking 录制 → social-auto-upload 发布 | 015 的本地 MuseTalk 成片已验证；Voicebox、RVC、LiveTalking 与上传工具之间的接口以及真实账号发布均未验证 |
| 实时数字人 | 文字输入或语音识别 → 按需 LLM/TTS 或已有音频 → LiveTalking 的 avatar + 口型模型 → WebRTC/RTMP/虚拟摄像头 | 上游提供相关能力，本机尚未安装 LiveTalking，也未验证持续帧率或总响应时间 |

这里的 **015 与 LiveTalking 是画面出口的备选方案**；两者都可能调用 MuseTalk，不需要前后串联两次口型模型。015 的 Audio2Face-3D 则是另一条独立三维路线。Voicebox 的 TTS/ASR、RVC 的音色转换和 002 的成片上传都只是候选模块，不能从各自可用推断整条链路已经兼容。015 后期还接过 MiniMax 对话/TTS、Hailuo 或 LivePortrait 动作，这些组件不会自动进入 LiveTalking。[001 RVC](../001-rvc-voice-conversion/README.md) · [002 上传](../002-social-auto-upload/README.md) · [003 Voicebox](../003-voicebox/README.md) · [015 练习](https://github.com/yydshly/0907_codex_project/blob/main/projects/015-audio2face-3d/README.md)

运行位置需要分开看：015 的 MuseTalk 已在本机验证，但其 MiniMax 对话/TTS、Hailuo 动作使用远端服务；Voicebox、RVC 与 LiveTalking 的自托管模型可在本地运行，当前研究并未安装它们；002 依赖目标平台网页和登录状态。LiveTalking 默认 EdgeTTS 也需要联网，是否能离线运行取决于实际替换的 TTS、LLM 等模块。

实际接入需先核对音频格式与延迟、所选 MuseTalk 版本和 avatar 数据格式、模型与 TTS 共同占用的显存、`inferfps`/`finalfps` 与首句等待。发布工具吃完成的视频文件，WebRTC 实时流另走播放或直播通道。最小试验是用 LiveTalking 示例 avatar + 一段现有短音频跑通单路 WebRTC，之后再考虑将外部语音模块接入。
## 图片与说明

研究网页页首使用内嵌 SVG 与 CSS 展示概念示意；[演示区](../../docs/projects/004-livetalking/index.html#demo)另收录了原仓库的[真实界面截图](https://github.com/lipku/LiveTalking/blob/main/assets/index.jpg)，以及 README 提供的 [Wav2Lip](https://www.bilibili.com/video/BV1scwBeyELA/)、[MuseTalk](https://www.bilibili.com/video/BV1bUwezvEnG/) 和 [ER-NeRF](https://www.bilibili.com/video/BV1G1421z73r/) 动态演示。截图说明界面和人物画面；要判断口型同步效果，应观看视频。网页的[入口与出口图解](../../docs/projects/004-livetalking/index.html#io)区分了 avatar 准备和每次播报。

## 实践记录

本次完成仓库与官方文档调研，并制作[静态能力地图](../../docs/projects/004-livetalking/index.html)；**没有安装或运行 LiveTalking 本体**。此前 015 已在本机用 MuseTalk 1.5 完成人物视频口型推理，见上方对比。将来试跑时优先采用当前主分支 README 的环境组合，并依次验证：

1. 下载 Wav2Lip 示例权重和 avatar，启动 WebRTC 页面。
2. 用 `echo` 发送短中文文本，观察视频、声音、口型和端到端响应时间。
3. 上传现有音频测试 `/humanaudio`；再评估是否接入 Voicebox 或其他声音来源。
4. 观察 `inferfps`、`finalfps`、CPU/GPU 占用；有明确需求时再测录制、RTMP 和多会话。

## 结论与后续

- **已确认：** 自托管需要所选口型模型权重与 avatar 数据；Wav2Lip、MuseTalk 可用现成文件试跑。LLM、ASR 和本地 TTS 均依选用功能增加。
- **仍需验证：** 在目标机器上的安装兼容性、口型画质、整体延迟、音频接口兼容、并发成本。
- **可用于自己的项目：** 需要“会说话的视频形象”时，将它作为视觉输出层；内容和声音可由已有工具提供。
- **发布前核对：** LiveTalking 代码为 Apache-2.0；Wav2Lip 原项目对开源权重的商业使用有限制；MuseTalk 声明其代码和模型允许商业使用，但仍需检查其他依赖、素材和声音许可。LiveTalking README 另有平台视频水印/标识声明。[LiveTalking 许可](https://github.com/lipku/LiveTalking/blob/main/LICENSE) · [Wav2Lip 声明](https://github.com/Rudrabha/Wav2Lip#disclaimer) · [MuseTalk 声明](https://github.com/TMElyralab/MuseTalk#disclaimerlicense)

## 参考链接

- [LiveTalking 主仓库与当前 README](https://github.com/lipku/LiveTalking)
- [官方使用说明：模型、传输、语音输入](https://doc.livetalking.ai/docs/usage/)
- [API 文档](https://github.com/lipku/LiveTalking/blob/main/docs/api.md)
- [开源版与商用版对比](https://doc.livetalking.ai/docs/service/)
- [Python 依赖清单](https://github.com/lipku/LiveTalking/blob/main/requirements.txt)
