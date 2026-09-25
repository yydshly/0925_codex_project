# 收录新项目

## 目录与编号

1. 为新项目分配下一个三位编号，例如 `001`、`002`。编号是稳定的项目 ID，删除项目后也不复用。
2. 用小写英文、数字和连字符写简短名称，例如 `001-example-project`。
3. 复制 `projects/_template/` 到 `projects/001-example-project/`，填写研究笔记。图片保存在该项目的 `assets/` 下。
4. 在根目录 `README.md` 的索引表中按编号升序添加一行。链接直接指向项目笔记；有图片和演示时，再补上对应链接。

建议每篇笔记至少写清原仓库、研究动机、值得借鉴的做法和自己的结论。图片旁写明它展示的内容及来源；请使用有意义的图片替代文字。

## Web 演示

需要发布的静态网页放在 `docs/projects/001-example-project/`，并提供 `index.html`。部署后，它的路径是 `https://yydshly.github.io/0925_codex_project/projects/001-example-project/`。在项目笔记和根目录索引中加入演示链接，并在 `docs/index.html` 中添加同一项目的入口。

这个仓库通过 `docs/` 预留了一个 GitHub Pages 站点；不同项目使用该站点的不同子路径。启用时，在 GitHub 仓库的 **Settings → Pages** 中选择 **Deploy from a branch**、`main`、`/docs`。如项目需要构建，先把生成的静态文件放到对应的 `docs/projects/<编号-名称>/` 目录；需要后端服务的应用不能直接运行在 GitHub Pages 上。

项目站点位于仓库路径下，请在网页中使用相对资源路径，避免把 `/` 当作站点根目录。发布前检查首页、图片和项目链接。
