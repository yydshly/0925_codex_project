# 003 · Voicebox 本地语音工作台

> Voicebox 是本地模型驱动的双向语音工作台：Whisper 听写、7 类 TTS 引擎的声音克隆与预置配音、本地 Qwen3 文本处理，并提供 REST 与 MCP 接口。研究它，是为了判断语音输入、个人配音和 AI 助手发声能否进入自己的内容工作流。

## 基本信息

- 原仓库：[jamiepine/voicebox](https://github.com/jamiepine/voicebox)
- 作者 / 组织：jamiepine
- 研究日期：2026-09-25
- 核对版本：[v0.5.0 发布说明](https://github.com/jamiepine/voicebox/releases/tag/v0.5.0)及当日的官方文档与 `main` 分支
- 项目类型：本地优先的开源 AI 语音工作台
- Web 展示：[Voicebox 能力地图](https://yydshly.github.io/0925_codex_project/projects/003-voicebox/)
- 完整引导图：[可缩放 SVG](https://yydshly.github.io/0925_codex_project/projects/003-voicebox/overview.svg)

## 研究摘要

Voicebox 的核心是双向语音：输入端用 Whisper 把录音转成文字，输出端用多种预训练 TTS 模型把文案读成预置音色或参考音色。界面还管理音色档案、录音、长文配音、音效和多轨故事。REST API 与 MCP 让其他程序和 AI 助手调用这些语音能力。[项目 README](https://github.com/jamiepine/voicebox/blob/main/README.md)

它更像一个模型整合与创作平台，而非新训练的单个语音模型。七个 TTS 引擎中，Qwen3-TTS、LuxTTS、Chatterbox Multilingual、Chatterbox Turbo、TADA 支持克隆；Qwen CustomVoice 和 Kokoro 使用预置音色。最多 23 种语言指 Chatterbox Multilingual，不能推广到所有引擎。[引擎总览](https://github.com/jamiepine/voicebox/blob/main/docs/content/docs/overview/introduction.mdx)

## 一图理解

![Voicebox 完整引导图：能力、模型、原理、个人工作流与边界](../../docs/projects/003-voicebox/overview.svg)

[单独打开并缩放引导图](../../docs/projects/003-voicebox/overview.svg)。它按“定位 → 本地模型 → 输入/输出原理 → 克隆和预置 → 对自己的意义 → 边界与验证”组织。

## 模型在本地还是远端？支持哪些模型？

**默认是本地模型推理。** 第一次启用模型时，Voicebox 从 Hugging Face 下载权重并缓存；随后在运行后端的设备上通过 MLX 或 PyTorch 推理。桌面版通常在自己的电脑上运行；如果主动把后端部署到另一台机器，模型就在那台机器上运行。若连接云端 AI 助手，助手生成回答的位置由它自身服务决定，Voicebox 仍提供语音能力。[模型管理](https://docs.voicebox.sh/developer/model-management)、[系统架构](https://docs.voicebox.sh/developer/architecture)

| 模型用途 | Voicebox 支持的模型或规格 | 做什么 |
| --- | --- | --- |
| 语音识别 STT | Whisper Base、Small、Medium、Large、Turbo | 录音转文字；Apple Silicon 优先 MLX Whisper，其余平台走 PyTorch 路径。 |
| 语音合成 TTS · 克隆 | Qwen3-TTS 0.6B / 1.7B；LuxTTS；Chatterbox Multilingual；Chatterbox Turbo；TADA 1B（英语）/ 3B（多语言） | 参考录音提供音色条件，再按新文案生成声音；共 5 类引擎、7 种权重规格。 |
| 语音合成 TTS · 预置 | Qwen CustomVoice 0.6B / 1.7B；Kokoro 82M | 不提供参考录音，直接选择内置音色；共 2 类引擎、3 种权重规格。 |
| 文本模型 LLM | Qwen3 0.6B、1.7B、4B | 听写润色、声音人格台词生成或改写；与 Qwen3-TTS 用途不同。 |

因此“7 个引擎”指 7 类 TTS 能力，不等于一共只有 7 个模型文件。TTS 共 10 种权重规格；Whisper 有 5 档，文本 Qwen3 有 3 档。实际使用只需下载选择的模型。模型下载体积与硬件需求见[官方模型清单](https://docs.voicebox.sh/developer/model-management)；Qwen3 文本模型档位见 [v0.5.0 发布说明](https://github.com/jamiepine/voicebox/releases/tag/v0.5.0)。

## 主要能力与范围

| 能力 | 具体可做的事 | 关键边界 |
| --- | --- | --- |
| 语音输入 | 全局快捷键录音、Whisper 转写、可选本地 Qwen3 文本清理、保存录音与转写 | Windows/macOS 支持自动粘贴；Linux 尚未支持这一桌面流程。中文润色准确率需要自行测试。[听写文档](https://docs.voicebox.sh/overview/dictation) |
| 克隆音色配音 | 以建议的 10–30 秒清晰参考录音生成音色提示，再合成新文案 | 属于零样本条件生成，不是为该人重新训练模型；效果受样本质量、语言和引擎影响。[克隆文档](https://docs.voicebox.sh/overview/voice-cloning) |
| 预置音色配音 | 不录音直接选 Qwen CustomVoice 或 Kokoro 音色 | 不能用这两个预置引擎克隆指定人声；自然语言发声指令接通于 Qwen CustomVoice，不适用于 Qwen 克隆路径。[TTS 实现文档](https://docs.voicebox.sh/developer/tts-generation) |
| 音频创作 | 长文分块、交叉淡化、音效、版本与多轨 Stories | 单次输入上限 50,000 字符；拼接后仍需试听衔接、读音与音色一致性。[README](https://github.com/jamiepine/voicebox#unlimited-generation-length) |
| 程序接入 | REST 合成、转写和音色管理；MCP 让 AI 助手发声 | Voicebox 提供语音层，回答内容和对话调度由外部 AI 助手或应用负责。[API](https://github.com/jamiepine/voicebox#api) |

## 实现原理

**输入路径：**快捷键或麦克风录音 → Whisper 识别 → 可选本地 Qwen3 文字润色 → Captures 保存、复制或粘贴到目标应用。

**输出路径：**文案或 Agent 文本 → 选择预置音色，或从参考录音构造音色提示 → 选择 TTS 引擎生成音频 → 长文分块与交叉淡化 → 可选音效 → 本地文件和 SQLite 记录。[架构文档](https://github.com/jamiepine/voicebox/blob/main/docs/content/docs/developer/architecture.mdx)、[TTS 生成文档](https://docs.voicebox.sh/developer/tts-generation)

桌面层是 Tauri 与 React；后端是本地 FastAPI 服务，统一调度模型。Apple Silicon 主要走 MLX，其他平台依据设备使用 PyTorch 的 CUDA、ROCm、XPU、DirectML 或 CPU 路径。模型首次使用时下载并缓存到本机。[模型管理文档](https://github.com/jamiepine/voicebox/blob/main/docs/content/docs/developer/model-management.mdx)

## 值得借鉴的做法

1. **统一多个模型：**通过后端协议和注册表，把识别、克隆、预置音色、设备选择包装成相对稳定的用户流程，便于比较不同模型的适用场景。[架构文档](https://github.com/jamiepine/voicebox/blob/main/docs/content/docs/developer/architecture.mdx)
2. **把语音变成可复用资源：**音色档案、参考录音、转写、生成版本和效果链持续保留，而非每次临时调用一个模型。[声音档案文档](https://github.com/jamiepine/voicebox/blob/main/docs/content/docs/developer/voice-profiles.mdx)
3. **连接 AI 助手：**MCP 和 REST 使原本只给人操作的配音工具可以进入自动化流程。[MCP 文档](https://docs.voicebox.sh/overview/mcp-server)

## 与现有研究的关系

- [001 · RVC](../001-rvc-voice-conversion/README.md)处理“已有语音 → 目标声线语音”，适合换声。Voicebox 的核心输出是“文字 → 指定音色语音”，同时提供“语音 → 文字”。两者解决的问题不同。
- [002 · social-auto-upload](../002-social-auto-upload/README.md)处理内容完成后的多平台分发。对于个人 IP，可把 Voicebox 放在“口述想法、形成文案、生成配音”的上游，发布工具放在下游。这是工作流组合设想，尚未做端到端实测。

## 环境、授权与风险

Windows 和 macOS 有安装包；Linux 桌面安装包尚未提供。最低要求 8 GB 内存和 5 GB 磁盘，建议 16 GB 内存以上；首次模型下载约 350 MB 至 8 GB，CPU 可运行但速度通常较慢。[安装文档](https://docs.voicebox.sh/overview/installation)

只克隆自己或已获许可的声音。Voicebox 仓库代码采用 MIT 许可，各底层模型权重仍需分别查看许可。默认本地使用无需云端语音 API；若把服务开放到网络，当前 REST/MCP API 没有内置认证，应另加访问控制。[责任使用](https://github.com/jamiepine/voicebox/blob/main/RESPONSIBLE_USE.md)、[Docker 部署](https://docs.voicebox.sh/overview/docker)

截至研究日，最新正式版仍为 2026 年 4 月的 v0.5.0。项目状态文档记录过模型加载、捕获和非英语润色等回归；这是当时的上游记录，不能据此断言所有问题今天仍然存在。[发布页](https://github.com/jamiepine/voicebox/releases/latest)、[项目状态](https://github.com/jamiepine/voicebox/blob/main/docs/PROJECT_STATUS.md)

## 实践记录

已完成能力资料核对及[中文研究网页](../../docs/projects/003-voicebox/index.html)。尚未在本机安装或运行 Voicebox 模型，也未实测中文克隆、转写质量、生成速度或 MCP 客户端兼容性。网页是研究展示，打开它不等于运行 Voicebox 本体。

## 结论与后续

**对自己的意义：**可以把 Voicebox 作为个人 IP 内容制作中的语音输入与配音层，也可以用它给 AI 助手添加声音；它与已研究的 RVC 换声和 social-auto-upload 发布环节互补。

下一步若要投入使用，先用自己的 10–30 秒中文清晰录音测试 Qwen3-TTS 与 Chatterbox Multilingual 的短句相似度和读音；再测试长文衔接、Whisper 中文转写，以及在目标机器上的速度和资源占用。关键任务以实测结果决定是否采用。
