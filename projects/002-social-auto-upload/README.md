# 002 · social-auto-upload 多平台内容发布

> 用户先在项目打开的浏览器中登录；工具保存登录状态，之后定位创作者网页中的上传框、输入框和按钮，实现重复上传与发布。它适合个人 IP 的内容生产稳定之后使用。

## 基本信息

- 原仓库：[dreammis/social-auto-upload](https://github.com/dreammis/social-auto-upload)
- 作者 / 组织：dreammis
- 研究日期：2026-09-25
- 核对版本：[0012d2c](https://github.com/dreammis/social-auto-upload/commit/0012d2c355f88f683cc38dde2a2db209e14091bc)
- 项目类型：开源多平台视频与图文上传工具
- Web 展示：[social-auto-upload 能力地图](../../docs/projects/002-social-auto-upload/index.html)
- 一图总览：[能力、平台、发布路径与个人 IP 价值](../../docs/projects/002-social-auto-upload/overview.svg)

## 研究摘要

项目把各平台 uploader、统一命令行入口 sau 和部分 Agent Skill 组合起来，面向已准备好素材、需要反复发布的创作者。仓库列有 11 个可上传视频的平台，其中抖音、小红书、快手、视频号、YouTube 使用 Patchright 操作网页，百家号、支付宝生活号、微博、虎扑使用 Playwright 操作网页；Bilibili 委托 biliup，TikTok 保留旧 Chrome 示例。用户在项目浏览器里手动登录后，浏览器平台保存并恢复会话，按网页元素完成选文件、填表和点击发布。图文与定时仅覆盖部分平台。对个人 IP 而言，它承担内容完成后的重复分发，选题、平台化表达与效果复盘仍由创作者决定。当前 sau 一次选一个平台；连续发布需依次调用或自行增加一层调度。[单平台入口源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py#L727-L742)

## 能力清单

以下为原仓库声明的支持范围，尚未在自己的账号中逐一实测。[README 能力表](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/README.md#L64-L77)

| 平台 | 视频 | 图文 | 定时 | CLI | Skill | 备注 |
| --- | :--: | :--: | :--: | :--: | :--: | --- |
| 抖音 | 是 | 是 | 是 | 是 | 是 | 主线重构最完整 |
| Bilibili | 是 | 否 | 是 | 是 | 是 | CLI 封装 biliup |
| 小红书 | 是 | 是 | 是 | 是 | 是 | 浏览器版适配 |
| 快手 | 是 | 是 | 是 | 是 | 是 | CLI / Skill 初版 |
| 视频号 | 是 | 否 | 是 | 是 | 否 | tencent_uploader |
| 百家号 | 是 | 否 | 否 | 是 | 否 | 浏览器自动化 |
| 支付宝生活号 | 是 | 否 | 否 | 是 | 否 | 需创作权限 |
| 微博 | 是 | 否 | 否 | 是 | 否 | 标题最多 30 字 |
| 虎扑 | 是 | 否 | 否 | 是 | 否 | 标题 4–40 字 |
| TikTok | 是 | 否 | 示例支持 | 否 | 否 | 旧 Chrome 示例 |
| YouTube | 是 | 否 | 否 | 是 | 否 | Studio 网页发布 |

汇总：11 个平台列有视频能力，3 个支持图文，6 个列有定时能力（TikTok 为旧示例），10 个进入统一 CLI，4 个有 Skill。平台的字段和账号流程不同。[CLI 文档](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/CLI.md)

## 各平台如何发布

下表按当前 main 对应的固定提交 0012d2c 核对代码路径。“发布结果”指脚本观察到的页面信号或外部程序退出码；不等于作品已经审核通过并公开。[统一 CLI 平台清单](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/CLI.md#L1-L25)

| 平台 | 登录与执行路径 | 发布动作及平台定时 | 关键边界 |
| --- | --- | --- | --- |
| [抖音](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py) | 扫码并保存浏览器状态；Patchright 操作创作者网页 | 视频或多图上传、标题/正文/话题、封面等；网页定时控件；跳内容管理页判提交 | 视频未指定声明时默认选“内容由AI生成” |
| [Bilibili](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py#L520-L547) | 本地终端扫码；sau 调用外部 biliup | biliup upload 接收视频、标题、简介、分区、标签、封面；定时映射为 --dtime；退出码判断 | 底层上传由 biliup 运行版本决定；不是 SAU 浏览器表单路径 |
| [小红书](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/xiaohongshu_uploader/main.py) | 扫码保存状态；Patchright 操作创作者网页 | 视频/图文各用上传页，填标题、正文、话题；网页定时开关；成功页判断 | 成功页不证明作品已公开 |
| [快手](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/ks_uploader/main.py) | 扫码保存状态；Patchright 操作创作者网页 | 视频文件选择器或多图页，描述/话题、封面、合集；网页定时控件；内容管理页判断 | 视频无独立标题写入；图文 --title 未实际写入发布页 |
| [视频号](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/tencent_uploader/main.py) | 微信扫码保存状态；Patchright 操作视频号助手 | 视频、描述/话题/短标题、双比例封面、合集；网页定时或草稿 | --category 未在发布流程使用；图文类仍未实现；默认尝试 AI 声明 |
| [百家号](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/baijiahao_uploader/main.py) | 百度扫码保存状态；Playwright 操作发布网页 | 视频、标题、横版封面、合集；无本库定时；页面跳转判断 | --desc/--tags 未填入网页；上传实际要求横版封面；默认尝试 AI 声明 |
| [支付宝生活号](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/alipay_uploader/main.py) | 支付宝扫码保存状态；Playwright 操作内容创作网页 | 视频、标题/简介/封面/合集；标签拼入标题；确认发布或提交审核 | 需内容创作权限；默认尝试 AI 声明；提交审核不等于公开 |
| [微博](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/weibo_uploader/main.py) | 网页扫码保存状态；Playwright 操作视频弹窗 | 选视频、标题/正文/话题、封面/合集；成功层判断 | 实际要求封面小于 5 MB；代码固定选“二创”并尝试 AI 声明 |
| [虎扑](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/hupu_uploader/main.py) | 浏览器完成 QQ 或手机号登录；Playwright 操作视频页 | 选视频、标题/简介、可选封面；跳帖子详情页判断 | 60 秒未跳转只警告并返回，CLI 成功输出可能是假阳性 |
| [TikTok](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/tk_uploader/main_chrome.py) | 旧 Chrome 示例手工登录保存状态；Playwright 操作 TikTok Studio | 视频、标题/标签/封面；Studio 原生 Schedule 定时 | 没有统一 sau CLI / Skill，示例需独立验证 |
| [YouTube](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/youtube_uploader/main.py) | Google 账号交互登录保存状态；Patchright 操作 Studio | 视频、标题/简介/标签、封面、播放列表、受众、可见性；等上传完后发布 | 无本库定时参数；仓库采用 Studio 网页而非 Data API |

Patchright 和 Playwright 都是浏览器自动化库，并非内置浏览器；仓库要求另行安装 Chromium，脚本可在可见窗口或无头模式中控制它。[浏览器安装说明](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/CLI.md#L49-L55)

浏览器路径共有 9 个统一 CLI 平台，其中 5 个使用 Patchright、4 个使用 Playwright；Bilibili 是 CLI 委托 biliup；TikTok 只在旧示例中。统一 CLI 一次处理一个平台，多平台连续发布需要在外层依次调度。[CLI 文档](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/CLI.md)

**登录态与上传动作的分工：**浏览器平台先把已登录会话的 storage_state 存到本地 JSON，再在新浏览器会话中载入；Cookie 用于证明账号身份，选文件、填写表单与提交仍由浏览器自动化完成。不同平台和账号分别保存状态。Bilibili 的账号信息交由 biliup 处理。[账号路径源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py#L250-L253)、[抖音保存状态](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py#L263-L280)、[恢复并上传](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py#L895-L923)

**定时与成功判定：**抖音、快手、小红书、视频号的脚本填写平台网页定时控件，B站传时间戳给 biliup；TikTok 旧示例操作 Studio 的 Schedule 控件。不是本地程序等到发布时间才点击发布。CLI 能返回或网页出现成功提示，只说明该次提交路径的信号，不证明作品已经通过审核并在约定时间公开。[定时 CLI 文档](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/CLI.md#L177-L188)
## 实现原理

主流路径是“在项目启动的浏览器中人工登录 → 保存浏览器登录态 → 下次在新浏览器会话中恢复登录态 → 自动操作发布网页”。这是**延续同一账号的身份**，通常不是接管刚才那一个窗口，也不会默认读取日常 Chrome 的 Cookie。Cookie 是登录凭据的一部分，不负责把视频上传到平台；脚本通过 CSS 选择器、按钮文字或元素角色定位网页元素，控制浏览器选择文件、填表、点击发布，再由平台网页发出请求。不同平台和账号分别保存登录态。你看到的能力地图是静态说明页，本身不登录或发布。

1. 用户扫码或在浏览器中完成交互登录。以抖音为例，程序将登录后的浏览器状态保存到本地账号文件。[登录源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py#L263-L280)
2. CLI 按平台和账号定位 cookies 目录中的 JSON 登录态文件；上传时加载并检查有效性。这些文件应按账号凭据保管。[路径源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py#L250-L253)
3. sau 把素材、标题、描述等交给平台 uploader。浏览器平台按各自实现使用 Patchright 或 Playwright 控制 Chromium：前者是控制程序库，后者才是实际运行网页的浏览器。程序根据网页元素的 CSS 选择器、文本或角色定位上传框，调用文件选择、输入和点击动作；平台网页随后向服务器发出上传与发布请求。页面结构改变时，定位规则和流程判断需要维护。B站通过 biliup，TikTok 则保留旧 Playwright Chrome 示例。[抖音流程](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py#L895-L970)、[B站调用](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py#L520-L547)
4. 支持定时的平台在创作者后台填写平台提供的发布时间；提交后仍需要检查后台的实际作品状态。[抖音定时源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py#L339-L349)

## 对建立个人 IP 的意义

该工具最适合放在“内容已经做好 → 稳定分发”一段。内容主题、形式和目标平台稳定后，重复上传与排期会消耗创作时间；脚本可以承担这些规则明确的操作。选题、平台化改写、评论互动和效果复盘仍需自己完成。

建议先选两个与目标受众相符的平台，用真实内容手动发几轮，并分别调整标题、封面和表达。形成重复流程后，用一个账号、一条作品试运行，核对平台实际状态，再扩大。工作区已有的 RVC 研究偏向声音制作；这个项目偏向成品内容分发，可用于同一创作链的不同环节。

## 值得借鉴的做法

1. **平台适配器与统一入口：** 平台差异留给 uploader，使用者面对较一致的命令结构。
2. **登录态复用：** 人工完成首次登录后，后续任务可使用本地账号文件，但需要保护凭据。
3. **固定高频动作：** 上传与填表交给脚本，减少每次重新操作网页的成本；平台改版时则要维护适配器。
4. **平台原生排期：** 提前把作品提交给平台，而非让本地程序持续等待发布时间。

## 使用边界

- 页面结构、登录态和二次验证会影响自动化稳定性。仓库仍在重构；历史 Web 端并非主线，不保证可直接运行。[重构说明](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/README.md#L136-L148)
- 当前 CLI 帮助称省略自主声明时不设置，但抖音视频上传函数在未指定时默认选择“内容由AI生成”。发布非 AI 内容前应先检查或修正这一行为。[CLI 帮助](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py#L754-L757)、[上传源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py#L966-L970)
- 作者的能力表不等于你的账号已通过端到端验证；正式使用前要逐平台检查发布与定时状态。

## 图片与说明

网页新增一张可单独打开的 SVG 总览图，概括 11 个平台、3 类接入路径、5+1 个定时能力、手动登录与登录态复用、平台结果核验和个人 IP 分工。详细能力矩阵与逐平台说明保留在图下方。

## 实践记录

- 已制作独立静态网页：[能力地图](../../docs/projects/002-social-auto-upload/index.html)。网页本身不连接社交账号，也不执行上传。
- 网页资源使用相对路径，适合由仓库现有的 docs 目录提供。
- 已在桌面和 390 像素手机视口预览，并检查图文、定时、Skill 筛选分别显示 3、6、4 个平台。
- 尚未安装或运行原上传工具，也未在任何社交账号中实测发布成功率。

## 结论与后续

- **已确认：** 这是以浏览器自动化为主、B站另用 biliup 的多平台发布工具，各平台能力有差异。
- **仍需验证：** 目标平台、账号与内容类型是否稳定可用，以及它能否节省实际发布时间。
- **可用于自己：** 在个人 IP 的内容流程成形后，用作发布自动化候选。
- **下一步：** 确定两个目标平台，准备一条已审核素材，从单账号、单平台试发开始。

## 参考链接

- [原仓库](https://github.com/dreammis/social-auto-upload)
- [固定研究版本](https://github.com/dreammis/social-auto-upload/commit/0012d2c355f88f683cc38dde2a2db209e14091bc)
- [README 能力表](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/README.md#L64-L77)
- [CLI 文档](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/CLI.md)
- [安装说明](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/docs/install.md)
- [CLI 源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/sau_cli.py)
- [抖音上传源码](https://github.com/dreammis/social-auto-upload/blob/0012d2c355f88f683cc38dde2a2db209e14091bc/uploader/douyin_uploader/main.py)
