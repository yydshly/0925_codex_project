# 技术原理与数据流

## 架构定位

video-use 的智能判断来自**外部代码代理**。仓库提供代理的工作说明（`SKILL.md`）和可运行的 Python 辅助脚本；语音识别来自 ElevenLabs Scribe；视频处理主要由 FFmpeg 完成。因此它更接近一个可改造的剪辑工作流，而不是封装好的 SDK 或独立 SaaS。

## 模型与执行位置

| 层 | 来源 | 运行位置 |
| --- | --- | --- |
| 剪辑决策 | 外部代码代理的大模型 | 取决于所用代理；仓库没有内置权重或专属推理服务器。 |
| 语音识别 | ElevenLabs Scribe API | 原版转写脚本上传音频到云端。 |
| 音视频执行 | Python、FFmpeg/FFprobe | 在代理可执行命令的本机或远程环境。 |

Browser Use Cloud / Box 是 README 提到的可选运行方式。代理程序在本机启动，不等于其大模型一定在本机推理；原版转写也不是离线流程。

## 六个阶段

1. **盘点素材。** 使用 FFprobe 了解源视频时长、音轨与画面格式；代理决定目标时长、比例和剪辑方向。
2. **提取与转写。** `transcribe.py` 提取音轨并上传到 Scribe，获得带词级时间戳、说话人及声音事件的 JSON；批量模式可并行处理素材。
3. **压缩阅读输入。** `pack_transcripts.py` 以停顿和说话人变化为边界生成短句表。代理可以在较短的文本中比较多个 take；不确定的片段才调用 `timeline_view.py` 看画面和波形。
4. **形成剪辑决策。** 代理根据用户确认的策略编写 `edl.json`。每条 `range` 指向某个源文件的起止秒数，并说明该片段在故事中的作用。
5. **渲染。** `render.py` 对每个区间做裁切、必要的调色、音频边缘淡入淡出和编码，拼接后叠加动画并最后烧录字幕，再处理响度。
6. **核验与修订。** 代理应检查成片切点、起止与中间位置，并对有问题的 EDL 或图形重做。这个阶段的质量取决于代理实际执行程度和人工复核。

## 核心文件和职责

| 文件 | 产生者 | 用途 |
| --- | --- | --- |
| `edit/transcripts/<素材名>.json` | 转写脚本 | 保留 Scribe 原始逐词结果，供切点与字幕使用 |
| `edit/takes_packed.md` | 打包脚本 | 供代理快速阅读多条素材的主要文本视图 |
| `edit/edl.json` | 代理 | 表达保留区间、顺序、调色、动画和字幕路径 |
| `edit/master.srt` | 渲染脚本或代理 | 把原视频的词时间映射到成片时间轴 |
| `edit/animations/slot_*/render.*` | 代理调用外部工具 | 可选的图形、动画或视频叠加素材 |
| `edit/preview.mp4` / `edit/final.mp4` | 渲染脚本 | 审阅与交付的视频 |
| `edit/project.md` | 代理 | 按 Skill 记录每次剪辑的约定与决策 |

### EDL 示例（说明结构，不能直接运行）

```json
{
  "version": 1,
  "sources": {"take_a": "/absolute/path/take_a.mp4"},
  "ranges": [
    {"source": "take_a", "start": 2.42, "end": 6.85, "beat": "开场"}
  ],
  "grade": "auto",
  "overlays": [],
  "subtitles": "master.srt"
}
```

## 为什么以文字为中心

把整段视频逐帧交给代理成本很高；语音内容可以压缩成带时间标记的短句，支持搜索、比较和精确指向源文件。画面胶片条是辅助证据，用于核查犹豫的切点、重录版本或成片视觉跳变。这一设计对以**信息和讲话**为主的视频特别有效；对需要识别动作、景别、镜头运动或音乐节拍的素材，还需要额外视觉和音频特征。

## 实现细节与风险点

- **时间对齐：**字幕时间需按 `词的源时间 − 片段起点 + 成片片段偏移` 计算，否则拼接后会错位。
- **视觉连续性：**音画按同一时间戳处理仍可能产生人物姿态、镜头或屏幕内容的跳变；局部抽帧与切点复核可发现问题，但不是自动保证连续。
- **剪辑边缘：**Skill 要求切点落在词边界并留少量余量；30 ms 音频淡入淡出降低爆音风险，不能证明听感自然。
- **编码：**片段先编码成一致的视频格式和帧率，再用 FFmpeg concat demuxer 拼接；需要动画/字幕时还会发生一次合成编码。
- **依赖：**Python 3.10+、FFmpeg/FFprobe 与 ElevenLabs API key 是主要运行条件；动画引擎在实际需要时安装。
- **来源变更：**当前转写缓存只以输出文件存在与否判断，适合试点但不适合直接当作可靠的素材版本管理。

源码依据：[`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md)、[`transcribe.py`](https://github.com/browser-use/video-use/blob/main/helpers/transcribe.py)、[`pack_transcripts.py`](https://github.com/browser-use/video-use/blob/main/helpers/pack_transcripts.py)、[`timeline_view.py`](https://github.com/browser-use/video-use/blob/main/helpers/timeline_view.py)、[`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py)、[`pyproject.toml`](https://github.com/browser-use/video-use/blob/main/pyproject.toml)。
