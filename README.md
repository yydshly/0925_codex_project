# GitHub 项目研究

这里按顺序记录值得深入研究的 GitHub 项目。每个子项目保留原仓库链接、简要介绍、关键发现、图片说明和实践记录；有可展示的静态网页时，也会附上演示入口。

[访问在线研究索引](https://yydshly.github.io/0925_codex_project/)

## 项目索引

编号按收录顺序递增，并与 projects/ 中的目录名一致。已有编号不复用。

| 编号 | 源库（关联原仓库） | 研究摘要 | 研究笔记 | 三张引导图与说明 | 在线网页 |
| :--: | --- | --- | --- | --- | --- |
| 001 | [Retrieval-based-Voice-Conversion-WebUI](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI) | **能力：** 已有语音 / 歌声换声、实时变声与声线训练。**原理：** 提取发音与音高，由目标模型重建波形，并可用检索辅助。**对我的意义：** 可复用为换声模块；先理解方案，实际效果按需验证。 | [完整研究](projects/001-rvc-voice-conversion/README.md) | [能力图](https://yydshly.github.io/0925_codex_project/projects/001-rvc-voice-conversion/#capability-diagram) · [原理图](https://yydshly.github.io/0925_codex_project/projects/001-rvc-voice-conversion/#principle-diagram) · [环境图](https://yydshly.github.io/0925_codex_project/projects/001-rvc-voice-conversion/#environment-diagram) | [查看网页](https://yydshly.github.io/0925_codex_project/projects/001-rvc-voice-conversion/) |

## 添加项目

从 [子项目模板](projects/_template/README.md) 开始，按 [收录说明](ADDING_PROJECTS.md) 更新索引。静态网页演示统一放在 docs/projects/ 下，便于通过一个 GitHub Pages 站点按子路径访问。
