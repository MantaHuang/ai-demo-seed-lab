# Demo 孵化流程

## 状态流转

```text
Idea -> Qualified -> Planned -> Building -> Review -> Showcase -> Archived
```

## 唯一事实源

Demo 状态以 GitHub Issue label 为准。

`demo-card.md` 中的 Status 字段只作为展示快照，方便平台页面读取和人工浏览；如果它与 Issue label 不一致，以 Issue label 为准。

## 状态定义

### Idea

刚被提出，还没有判断价值。

进入条件：

- 有一句话描述。
- 知道大概面向谁。

### Qualified

通过初筛，值得花时间探索。

进入条件：

- 明确目标用户。
- 明确 AI 能带来的增益。
- 有可展示的 10 分钟场景。

### Planned

已经具备可执行计划。

进入条件：

- Claude 已给出产品/体验建议。
- Codex 已给出实现计划。
- 用户确认优先级。
- MVP 阶段可以用 Issue 评论 `/approve` 作为用户确认信号。

### Building

正在实现。

进入条件：

- 有独立分支或明确任务范围。
- 有验收标准。

### Review

等待交叉审查。

进入条件：

- Demo 能运行。
- README 或 Demo Card 已补齐。
- Codex 完成基础验证。

### Showcase

可展示状态。

进入条件：

- 核心路径可跑通。
- 已知限制写清楚。
- 有截图、录屏或可访问入口。

### Archived

暂停或放弃。

进入条件：

- 价值不足、成本过高、方向重复，或阶段性完成。

## 每个 Demo 的目录结构

```text
demos/demo-slug/
  README.md
  demo-card.md
  brief.md
  src/
  assets/
  tests/
```

## Agent 流程

### Claude Code

在 `brief.md` 中补充：

- 用户场景
- 价值主张
- 产品流程
- MVP 建议
- 风险问题

### Codex

在 `README.md` 和代码中补充：

- 运行方式
- 技术方案
- 文件结构
- 验证结果
- 已知限制

### Cross Review

审查时必须回答：

- 这个 Demo 是否能在 10 分钟内讲清楚？
- 用户第一次看是否知道它在解决什么？
- 工程实现是否足够小、足够稳？
- 下一步迭代最值得做什么？

## MVP 直通道

第一个真实 Demo 不必完整执行所有门禁。为了优先压测协作闭环，可以使用直通道：

```text
Idea Issue -> Claude brief -> Codex build -> 一次交叉审查 -> Demo Card
```

从第二或第三个 Demo 开始，再严格使用完整状态机。
