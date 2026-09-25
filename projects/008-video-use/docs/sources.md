# 核对来源

核对日期：2026-09-25。链接指向上游 `main` 分支，后续更新可能改变具体实现；开展开发前应重新核对目标版本。

| 来源 | 本项目使用它核对什么 |
| --- | --- |
| [仓库 README](https://github.com/browser-use/video-use) | 产品定位、宣称能力、基本使用路径 |
| [`SKILL.md`](https://github.com/browser-use/video-use/blob/main/SKILL.md) | 代理工作流程、剪辑规则、EDL、成片自检和动画方案 |
| [`install.md`](https://github.com/browser-use/video-use/blob/main/install.md) | 安装依赖、API key、Skill 注册方式 |
| [`pyproject.toml`](https://github.com/browser-use/video-use/blob/main/pyproject.toml) | Python 版本和包依赖 |
| [`helpers/transcribe.py`](https://github.com/browser-use/video-use/blob/main/helpers/transcribe.py) | 音轨提取、Scribe 请求参数、缓存行为 |
| [`helpers/transcribe_batch.py`](https://github.com/browser-use/video-use/blob/main/helpers/transcribe_batch.py) | 批量扫描、并发与缓存跳过 |
| [`helpers/pack_transcripts.py`](https://github.com/browser-use/video-use/blob/main/helpers/pack_transcripts.py) | 逐词结果向短句视图的转换 |
| [`helpers/timeline_view.py`](https://github.com/browser-use/video-use/blob/main/helpers/timeline_view.py) | 抽帧、波形、词标签与尚未实现的完整项目视图 |
| [`helpers/grade.py`](https://github.com/browser-use/video-use/blob/main/helpers/grade.py) | 预设与基于画面统计的自动修正 |
| [`helpers/render.py`](https://github.com/browser-use/video-use/blob/main/helpers/render.py) | EDL、分段渲染、拼接、叠加、字幕、响度处理 |

## 状态标注原则

README 的能力介绍可能涵盖代理能通过其他工具完成的工作。整理时，以 `helpers/` 中有无相应代码区分脚本能力；仅在 `SKILL.md` 中规定的行为标为“代理工作流程”；需 HyperFrames、Remotion、Manim 等其他引擎的内容标为“可选外部工具”。
