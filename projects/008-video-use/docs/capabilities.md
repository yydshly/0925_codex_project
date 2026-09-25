# 能力清单

## 判定口径

- **脚本已实现**：`helpers/` 中有可调用的代码。
- **代理工作流程**：`SKILL.md` 要求代理完成，实际质量取决于代理、素材和人工审阅。
- **可选外部工具**：需另行安装或由代理制作内容，不是 video-use 自带的生成引擎。
- **未实现/待扩展**：源码直接标注尚未实现，或现有代码没有相应支持。

以下是主要能力域与实现边界，并非上游所有命令参数、风格选项或代理可创作技巧的穷尽清单。

## 素材理解与剪辑

| 能力 | 状态 | 具体机制与边界 | 证据 |
| --- | --- | --- | --- |
| 单文件逐词转写 | 脚本已实现 | FFmpeg 提取 16 kHz 单声道 WAV，调用 ElevenLabs `scribe_v1`，请求逐词时间戳、说话人区分和声音事件；支持指定语言、说话人数与音轨。需要 API key 和网络。 | [`transcribe.py`](https://github.com/browser-use/video-use/blob/main/helpers/transcribe.py) |
| 多文件批量转写 | 脚本已实现 | 默认 4 个线程并发，遍历目录中的常见视频文件；对已有转写文件跳过。 | [`transcribe_batch.py`](https://github.com/browser-use/video-use/blob/main/helpers/transcribe_batch.py) |
| 紧凑转写视图 | 脚本已实现 | 按至少 0.5 秒停顿或说话人变化，把词合并成带时间范围的短句，写入 `takes_packed.md`。这是代理挑选内容的主要输入。 | [`pack_transcripts.py`](https://github.com/browser-use/video-use/blob/main/helpers/pack_transcripts.py) |
| 局部画面与波形查看 | 脚本已实现 | 对指定时间区间均匀抽帧，绘制胶片条、音频波形、词标签和静音区；不是对整条视频连续做视觉理解。 | [`timeline_view.py`](https://github.com/browser-use/video-use/blob/main/helpers/timeline_view.py) |
| 去口头禅、失误和空白 | 代理工作流程 | 代理读转写、比较重录片段，选择要保留的区间并写 EDL；仓库没有一个独立的“一键识别口头禅并自动删除”模型。 | [`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) |
| 叙事重组与多 take 选优 | 代理工作流程 | Skill 给出编辑简报、结构参考和切点规则；代理依据用户目标形成方案，先确认策略再执行。 | [`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) |

## 后期制作

| 能力 | 状态 | 具体机制与边界 | 证据 |
| --- | --- | --- | --- |
| EDL 驱动渲染 | 脚本已实现 | JSON 指定素材、时间段、顺序、调色、动画叠加和字幕；每段分别编码，再用 FFmpeg `-c copy` 拼接。这里“不重新编码”只指拼接步骤。 | [`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py)、[`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) |
| 切点音频淡入淡出 | 脚本已实现 | 每段两端添加约 30 ms 淡入淡出，降低切点爆音风险；仍需听审。 | [`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py) |
| 基础自动调色 | 脚本已实现 | 从片段抽样测亮度、对比度和饱和度，生成幅度有限的修正滤镜；也可选固定预设或自定义 FFmpeg 滤镜。它不是理解审美意图的智能调色师。 | [`grade.py`](https://github.com/browser-use/video-use/blob/main/helpers/grade.py) |
| 字幕生成与烧录 | 脚本已实现 | 依据 EDL 将源时间戳转换到成片时间轴，生成 SRT，并在动画叠加之后烧录。默认短词组、大写风格偏向英文短视频。 | [`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py) |
| 动画叠加 | 渲染脚本 + 可选外部工具 | 渲染器可以在指定时间叠加已生成的动画文件；动画内容需代理另用 HyperFrames、Remotion、Manim 或 PIL 制作。 | [`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py)、[`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) |
| 响度归一化 | 脚本已实现 | 成片可用 FFmpeg `loudnorm` 做响度处理，默认目标为 -14 LUFS、-1 dBTP；它不能替代对白、音乐、音效逐段听审。 | [`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py) |
| 快速草稿与预览 | 脚本已实现 | `--draft` 和 `--preview` 提供不同质量/速度的渲染选择。 | [`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py) |
| 输出自检与返工 | 代理工作流程 | Skill 要求代理检查每个切点附近的画面和波形、检查字幕遮挡、音量等，并在发现问题时重渲染；不是完全自动的视听质检。 | [`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) |
| 项目记忆 | 代理工作流程 | Skill 规定把每次剪辑决策追加到 `edit/project.md`；这主要依赖代理执行。 | [`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) |

## 已知边界

1. **语音优先，画面连续性未获保证。** 无对白素材缺少同等成熟的镜头语义索引；画面主要通过按需胶片条查看。音画时间戳同步不等于相邻镜头自然衔接，人物姿态和屏幕内容可能跳变。
2. **云转写依赖。** 转写脚本向 ElevenLabs 上传音频，涉及成本、网络与素材保密要求。
3. **缓存失效不完整。** 代码只检测同名 JSON 是否存在；若源视频被替换而文件名不变，需要手动清理旧转写。`SKILL.md` 的“源文件变化时重转写”规则尚未在脚本中落实。
4. **完整项目时间线未实现。** `timeline_view.py --edl` 会明确退出，当前只能查看指定时间区间。
5. **中文与 Windows 需要专项验证。** 默认字幕分组、标点及大写样式偏英文；安装说明列出 macOS 和 Linux 的 FFmpeg 命令，未给出 Windows 的完整验证路径。

边界对应源码：[`transcribe.py`](https://github.com/browser-use/video-use/blob/main/helpers/transcribe.py)、[`render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py)、[`timeline_view.py`](https://github.com/browser-use/video-use/blob/main/helpers/timeline_view.py)、[`install.md`](https://github.com/browser-use/video-use/blob/main/install.md)。
