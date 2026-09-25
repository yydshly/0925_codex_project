# 009 · System Design Primer 系统设计资料库

- 原仓库：[donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)
- 研究日期：2026-09-25
- 类型：系统设计学习资料与练习题库

## 一句话定位

它是关于**高性能和大规模系统设计**的资料库：帮助人学习如何设计、评估和扩展系统；本身不是可直接部署的高性能框架。

## 引导图

![System Design Primer 能力全景图：知识体系、设计方法、案例练习、使用价值与扩展方向](../../docs/projects/009-system-design-primer/assets/overview.png)

图：我们根据原仓库 README 和案例制作的摘要图。图中“扩展方向”是我们的建议，不代表上游已有功能。

## 包含哪些内容

- **设计知识：** 性能与扩展、延迟与吞吐、可用性与一致性；DNS、CDN、负载均衡、缓存、数据库、消息队列、通信与安全等常见主题。
- **设计方法：** 从需求和约束出发，估算流量与存储，设计核心组件，再根据瓶颈比较方案和代价。
- **案例练习：** 短链接、信息流、爬虫等系统设计题，以及 LRU 缓存、聊天服务等对象设计题；部分解答配有讨论、示意代码和图。
- **学习辅助：** 学习路线、延伸阅读、Anki 卡片和简体中文等翻译资料。

## 对我的意义

准备系统设计面试、评审技术方案或讨论扩容时，可以把它当作知识索引和提问清单。对现有语音、数字人及内容发布项目，先用它梳理并发量、延迟、存储和故障恢复需求，再判断是否需要缓存、队列或扩容。它提供的是设计思路，具体方案仍需结合实际指标验证。

## 可扩展方向

把自己的项目写成案例，补充真实压测、运行成本和故障复盘，逐步形成团队可复用的架构笔记。

## 参考

- [原仓库与主题目录](https://github.com/donnemartin/system-design-primer)
- [短链接 / Pastebin 设计案例](https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md)
