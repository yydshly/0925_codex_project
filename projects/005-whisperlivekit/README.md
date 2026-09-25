# 005 · WhisperLiveKit：实时语音转文字服务

> WhisperLiveKit 持续接收音频，使用 Whisper 等识别模型输出逐步更新的文字，并可加入说话人区分与翻译。本研究重点弄清它与 Whisper、LiveKit 的关系，以及它在现有语音与内容项目中的位置。

## 基本信息

- 原仓库：[QuentinFuxa/WhisperLiveKit](https://github.com/QuentinFuxa/WhisperLiveKit)
- 作者：Quentin Fuxa
- 研究日期：2026-09-25
- 项目类型：可自行部署的实时语音识别服务
- 研究网页：[WhisperLiveKit 能力与接入导读](../../docs/projects/005-whisperlivekit/index.html)
- 上游代码许可：Apache-2.0；所选模型及可选组件可能有各自条款，需分别核对。

## 一图总览

[打开可缩放的完整概览图](../../docs/projects/005-whisperlivekit/assets/overview.svg) · [打开 PNG 预览](../../docs/projects/005-whisperlivekit/assets/overview.png)

![WhisperLiveKit 完整概览图：三者关系、输入输出、处理原理、场景、项目价值与边界。](../../docs/projects/005-whisperlivekit/assets/overview.svg)

图中将已确认的上游能力与我们对现有项目的组合设想分开。组合路径尚未实测；网页是研究导读，不会启动识别服务。

## 先弄清三个名字

| 名称 | 负责的工作 | 与本项目的关系 |
| --- | --- | --- |
| [Whisper](https://github.com/openai/whisper) | 把语音识别成文字的模型 | WhisperLiveKit 默认可用 Whisper 系列模型；也支持其他已适配的识别后端 |
| WhisperLiveKit | 接收音频、组织实时识别、确认文字、推送结果 | 本次研究对象，是服务层和处理链 |
| [LiveKit](https://docs.livekit.io/intro/about/) | 多人实时音视频传输、房间和会话 | 是另一套平台；WhisperLiveKit 自带 WebSocket 音频接口，运行它不要求 LiveKit。两者配合需要音频桥接 |

其项目名中的 “LiveKit” 不应理解为 LiveKit 平台的官方插件。此判断依据上游的[依赖清单](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/pyproject.toml)和[原生 WebSocket 接口说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/API.md)，而非名称推断。

## 能力与边界

1. **实时语音转写：** 客户端通过 WebSocket 持续送入音频，服务端返回可修订的临时文字和已确认片段。界面可以显示临时结果，保存或触发业务动作宜使用已确认结果。
2. **文件转写与字幕：** 命令行及 REST 接口支持已有音频；可输出文字、JSON、SRT 或 VTT。
3. **可选增强：** 说话人区分、翻译、会话级术语上下文等。说话人编号并不自动映射到真实身份；同一词当前只归给一位说话人。
4. **多种后端：** 可选 Whisper、Faster-Whisper、MLX Whisper，以及已适配的 SenseVoiceSmall、Qwen3-ASR 等。不同后端支持的语言、时间戳和推理设备不同，不能当作完全可互换。
5. **服务接口：** 原生 WebSocket、Python API，以及兼容 OpenAI 转写、Deepgram 实时接口的部分功能；“兼容”不等于完整复刻两方 API。

依据：[项目 README](https://github.com/QuentinFuxa/WhisperLiveKit)、[API 文档](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/API.md)、[后端说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/backends.md)、[说话人对齐说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/alignement_principles.md)。

## 技术原理

```text
网页 / 应用音频 → 分批输入与语音活动检测 → 识别模型 → 稳定文字确认
                                                    ↓
                                      可选说话人对齐、翻译
                                                    ↓
                                        WebSocket / API 输出
```

Whisper 原本更适合处理具有一定上下文的音频，直接对极短片段反复识别容易截断词或产生前后不一致的结果。WhisperLiveKit 将音频放在持续更新的缓冲区，使用实时策略决定何时确认输出：SimulStreaming/AlignAtt 根据模型的音频与文字注意力对齐，避开尚靠近当前音频末端的结果；LocalAgreement 则比较连续识别结果的一致前缀。其他后端可能采用自己的流式策略。[项目说明](https://github.com/QuentinFuxa/WhisperLiveKit) · [SimulStreaming 原理](https://github.com/ufal/SimulStreaming)

### 停顿、识别与确认是三回事

WhisperLiveKit 并非等到说话人停顿才把整句交给 Whisper。入口处的 Silero VAD 判断语音开始和结束；说话中的音频块进入缓存，处理器持续运行识别，也可按 `--asr-coalesce-min-s` 合并多个块以减少模型调用。Whisper 路线将音频特征交给模型预测文字；该库再用实时策略区分暂定文字和已确认文字：默认 SimulStreaming/AlignAtt 暂缓靠近当前音频末端的词，可选 LocalAgreement 比较连续识别结果的一致前缀。

停顿用于句尾收尾和段落分界。默认超过 5 秒的 VAD 停顿会形成稳定段落边界；这不是开始识别的等待时间。音频结束时仍会提交剩余内容。依据：[音频处理器](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/whisperlivekit/audio_processor.py)、[VAD](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/whisperlivekit/silero_vad_iterator.py)、[AlignAtt](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/whisperlivekit/simul_whisper/align_att_base.py)、[LocalAgreement](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/whisperlivekit/local_agreement/online_asr.py)、[Whisper 技术介绍](https://openai.com/index/whisper/)。

## 底层依赖与运行条件

| 层次 | 具体依赖 | 作用与边界 |
| --- | --- | --- |
| 基础服务 | Python ≥3.11、<3.14；FastAPI、Uvicorn、WebSockets | 提供网页、REST 与实时音频连接；研究网页本身只是静态页面 |
| 音频与默认识别路线 | librosa、soundfile、PyTorch、faster-whisper；Silero VAD；所选模型权重 | 解码与处理音频、检测语音活动、将语音识别成文字；模型权重需按后端取得 |
| 输入格式与算力 | 非 PCM 输入的 FFmpeg；CPU 或 GPU | 压缩音频解码与推理设备；资源需求取决于模型、延迟和并发目标 |
| 按需扩展 | 翻译、说话人区分、MLX 或其他后端对应的可选依赖 | 只有启用相关功能时才配置，支持范围随所选后端变化 |

**LiveKit 不是必需依赖。**本项目可通过自带 WebSocket 接口接收音频；如从 LiveKit 房间取音轨，需另建音频桥接。依据：[上游依赖清单](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/pyproject.toml)、[后端说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/backends.md)、[项目运行说明](https://github.com/QuentinFuxa/WhisperLiveKit)。

## 场景与扩展

适合会议/访谈实时字幕、直播辅助字幕、跨语言交流、客服对话记录，以及语音助手的输入端。已有音频的字幕制作也可使用文件转写。扩展方向包括专业术语上下文、选择适配中文和硬件的识别模型、把已确认文字送入摘要/待办/检索，以及与现有会议或数字人系统连接。这些后续业务功能和桥接层需要另行实现。

## 对现有项目的意义

这个仓库已有 001 RVC（换声）、002 social-auto-upload（内容发布）、003 Voicebox（本地听写与配音）、004 LiveTalking（数字人音视频）。**当前若以录制口述、配音和成片为主，003 已覆盖一部分听写需求；005 的边际价值不高，先看演示并用少量真实音频试效果即可，无需立刻深挖。**

只有当直播字幕、多人会议记录或数字人实时对话成为明确目标时，WhisperLiveKit 才适合补在**实时语音输入**处：

```text
用户讲话 → WhisperLiveKit 实时文字 → LLM / 业务逻辑 → Voicebox 或其他 TTS → LiveTalking 数字人画面
                                                               ↘ 内容成片后由 002 分发
```

003 Voicebox 已有本地 Whisper 听写，所以若只是把录音变文字，两者会有重叠。005 的研究价值是持续音频、临时与确认结果、实时接口和多人字幕。001 RVC 可在需要改变已有音频声线时另行加入；它与语音识别解决不同问题。以上是能力组合设想，**尚未验证这些项目之间的接口、延迟或实际效果**。

若未来出现明确的实时用例，再在目标设备上用真实中文音频试字幕，记录错字率、首字出现时间、已确认文字的等待时间、资源占用和并发情况；需要数字人对话时，再评估接入 004。仓库自己的[基准说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/benchmarks/README.md)指出，旧版公开图表不足以可靠比较当前后端，应在自己的音频上复测。

## 实践记录

- 已完成：研究网页与文档整理，包含可点击的处理流程、场景切换和项目接入路径。
- 尚未完成：下载或运行上游识别模型、在本机测量延迟及中文准确度、与 003/004 的实际集成。
- 网页仅是研究导读；打开网页不会启动 WhisperLiveKit 的识别服务。

## 参考链接

- [原仓库](https://github.com/QuentinFuxa/WhisperLiveKit)
- [API 文档](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/API.md)
- [后端说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/backends.md)
- [说话人与文字对齐](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/docs/alignement_principles.md)
- [基准测试说明](https://github.com/QuentinFuxa/WhisperLiveKit/blob/main/benchmarks/README.md)
