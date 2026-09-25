# LiveTalking 模型依赖与环境要求

核对日期：2026-09-25。此页基于上游当前主分支 README、官方使用说明、配置文件与依赖清单；它是部署准备清单，尚未在本工作区安装或实测。

## 一句话回答

**需要本地口型模型，但不一定需要本地大语言模型。** 自托管时，至少选择一种口型/数字人模型，把其权重与 avatar 素材放到运行 LiveTalking 的服务器。可以直接使用预训练文件，不必为 Wav2Lip 或 MuseTalk 从头训练。LLM 仅用于自动生成回答；TTS 仅在文字需要变成声音时参与；ASR 仅在用户以语音提问时参与。[当前 README 快速开始](https://github.com/lipku/LiveTalking#2-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B) · [API 文档](https://github.com/lipku/LiveTalking/blob/main/docs/api.md)

## 资源在哪里运行

| 资源 | 最简文字播报 | 上传已有音频 | 语音问答 |
| --- | --- | --- | --- |
| LiveTalking 程序 | 服务器 | 服务器 | 服务器 |
| 口型模型权重与 avatar 数据 | 必需，放服务器 | 必需，放服务器 | 必需，放服务器 |
| TTS | 必需；默认 EdgeTTS 是在线服务 | 不需要 | 必需，可在线或自行部署 |
| LLM | 不需要，使用 `echo` | 不需要 | 需要，服务可在云端或自托管 |
| ASR | 不需要 | 不需要 | 需要，具体可用浏览器或另接服务 |
| 浏览器端 | 只接收音视频和发请求 | 同左 | 同左 |

“本地模型”是相对于运行 LiveTalking 的机器而言：如果部署在云 GPU 服务器上，模型就放在云服务器，不需要每位观众下载。默认 EdgeTTS 会使用微软的在线语音服务，因此“口型模型在本地”不等于整套流程离线。[配置文件](https://github.com/lipku/LiveTalking/blob/main/config.yaml) · [edge-tts 项目说明](https://github.com/rany2/edge-tts)

## 各模型要准备的文件

### Wav2Lip：官方最简路径

1. 从上游 README 的下载地址获取 `wav2lip256.pth`，保存为项目的 `models/wav2lip.pth`。
2. 解压 `wav2lip256_avatar1.tar.gz` 到 `data/avatars/wav2lip256_avatar1/`。
3. 运行 `python app.py --transport webrtc --model wav2lip --avatar_id wav2lip256_avatar1`。
4. 官方详细使用说明还要求将 `s3fd.pth` 放到人脸检测目录；准备自定义 avatar 时尤其应核对这项依赖。自定义 avatar 要先处理输入视频，再运行服务。

[当前 README](https://github.com/lipku/LiveTalking#21-%E4%B8%8B%E8%BD%BD%E6%A8%A1%E5%9E%8B) · [详细使用说明](https://doc.livetalking.ai/docs/usage/)

### MuseTalk

官方要求下载 MuseTalk 对应的 `models/` 文件，并将示例 `musetalk_avatar1` 放到 `data/avatars/`，然后以 `--model musetalk` 启动。制作自有 avatar 时，还需 FFmpeg、编译工具和 `face_recognition` 等依赖；官方说明这些额外依赖用于 avatar 生成，推理阶段不需要。[MuseTalk 安装与 avatar 说明](https://doc.livetalking.ai/docs/usage/)

### Ultralight-Digital-Human 与 ER-NeRF

Ultralight 官方使用路径要求先在原项目训练人物模型，再将相关 checkpoint、检测模型和头像资源接入 LiveTalking。ER-NeRF 的运行说明位于单独的 `ernerf-rtmp` 分支，自定义人物需要训练产物。它们不适合作为“无需训练，快速了解能力”的首个试跑路径。[官方使用说明](https://doc.livetalking.ai/docs/usage/)

## 环境要求

| 项目 | 当前核对结果 |
| --- | --- |
| 操作系统 | 主仓库 README 声称在 Ubuntu 22.04 测试通过。仓库另提供 Windows 整合包链接，但不能据此推断源码安装流程在 Windows 完全相同。 |
| Python | README 验证组合为 Python 3.12，建议先按此组合创建独立环境。 |
| 深度学习框架 | README 验证组合为 PyTorch 2.9.1、torchvision 0.24.1、torchaudio 2.9.1、CUDA 12.8 对应的 PyTorch 包。显卡驱动、PyTorch 构建与运行环境需匹配。 |
| GPU | 实时口型推理依赖 GPU 性能。官方建议 Wav2Lip256 使用 RTX 3060 及以上，MuseTalk 使用 RTX 3080 Ti 及以上。这是推荐配置，不是保证所有画质或并发都达标的硬门槛。 |
| CPU | 每路视频编码消耗 CPU；分辨率和并发会增大开销。 |
| 软件包 | 安装仓库 `requirements.txt`，包含图像、音频、WebRTC、服务与模型相关 Python 包；部分 TTS、ASR 和输出方式有额外依赖。 |
| FFmpeg | avatar 制作、视频预处理和 RTMP 等路径需要留意。RTMP 的 FFmpeg 构建需包含 `libx264`。 |
| 网络端口 | WebRTC 示例默认监听 TCP 8010；上游说明要求开放 UDP 1–65536。真实部署应按网络架构、ICE/STUN 和实际使用端口进一步收敛配置。 |

[当前 README 安装与性能](https://github.com/lipku/LiveTalking#1-%E5%AE%89%E8%A3%85) · [requirements.txt](https://github.com/lipku/LiveTalking/blob/main/requirements.txt) · [使用说明](https://doc.livetalking.ai/docs/usage/) · [FFmpeg 常见问题](https://doc.livetalking.ai/docs/faq/)

### 官方 README 给出的安装顺序

```bash
git clone https://github.com/lipku/LiveTalking.git
cd LiveTalking
conda create -n livetalking python=3.12
conda activate livetalking
pip install torch==2.9.1 torchvision==0.24.1 torchaudio==2.9.1 --index-url https://download.pytorch.org/whl/cu128
pip install -r requirements.txt
# 之后下载所选模型权重与 avatar 到上文路径
python app.py --transport webrtc --model wav2lip --avatar_id wav2lip256_avatar1
```

上面是上游步骤的整理，**未在本工作区执行**。访问 `http://<服务器地址>:8010/index.html` 并提交文本，即可按官方流程验证。[README 快速开始](https://github.com/lipku/LiveTalking#2-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)

### 上游版本差异

主分支 README 写的是 Ubuntu 22.04 / Python 3.12 / PyTorch 2.9.1 / CUDA 12.8；官网[安装页](https://doc.livetalking.ai/docs/install/)仍写 Ubuntu 20.04 / Python 3.10 / PyTorch 1.12 / CUDA 11.3；仓库 [Dockerfile](https://github.com/lipku/LiveTalking/blob/main/Dockerfile)也沿用旧组合。因此当前源码试跑以主分支 README 为优先参考，不直接将 Dockerfile 当作已核实的当前部署方案。上游 `requirements.txt` 中多项包未固定版本，仍需在目标机器上做兼容性验证。

## 依功能增加的服务

- **只验证能说话：** 示例口型权重 + 示例 avatar + EdgeTTS + WebRTC 浏览器。EdgeTTS 在线，需要网络。
- **已有声音驱动画面：** 通过 `/humanaudio` 上传音频；可绕过内置 TTS 和 LLM。需检查音频文件格式与接口兼容性。
- **自动回复：** `/human` 使用 `chat`，配置千问或兼容网关的 API 密钥和服务。
- **克隆声音：** 选支持克隆的 TTS，并准备参考音频、模型或服务；LiveTalking 自身负责接入与同步画面。
- **语音提问：** 接入浏览器 ASR、FunASR 等识别方案，并验证与打断和会话逻辑的配合。
- **直播推流：** 增加 RTMP 或 WebRTC 推流目标；某些路径还需 SRS、`python_rtmpstream` 等。
- **虚拟摄像头：** 安装虚拟摄像头驱动及官方指定的 Python 包。

[官方使用说明](https://doc.livetalking.ai/docs/usage/) · [API 文档](https://github.com/lipku/LiveTalking/blob/main/docs/api.md)

## 性能与授权检查

官方说明 `inferfps` 是 GPU 推理帧率，`finalfps` 是最终推流帧率，两者都至少达到 25 才算实时；它们不能单独代表从用户提交到数字人开始回应的整体延迟。并发时，静音视频多受 CPU 影响，同时说话多受 GPU 影响。[性能指标](https://github.com/lipku/LiveTalking#6-%E6%80%A7%E8%83%BD%E6%8C%87%E6%A0%87)

LiveTalking 代码标为 Apache-2.0，但模型权重、预训练数据、头像素材、克隆声音和外部语音服务需要分别核对。原版 Wav2Lip 明确表示其开源模型的输出仅限研究、学术和个人用途；MuseTalk 官方声明其代码与训练模型允许商业用途，同时要求遵守其他模型许可。LiveTalking README 还写有在部分视频平台发布时添加水印和标识的声明。正式使用前逐项核对，不能仅凭 LiveTalking 代码许可判断完整方案可商用。[LiveTalking 许可](https://github.com/lipku/LiveTalking/blob/main/LICENSE) · [Wav2Lip 声明](https://github.com/Rudrabha/Wav2Lip#disclaimer) · [MuseTalk 声明](https://github.com/TMElyralab/MuseTalk#disclaimerlicense) · [LiveTalking README 声明](https://github.com/lipku/LiveTalking#8-%E5%A3%B0%E6%98%8E)
