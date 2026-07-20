# Demo 孵化流程

## 状态流转

```text
Idea -> Qualified -> Planned -> Building -> Review -> Showcase -> Archived
```

## 两类事实源

Demo 状态以 GitHub Issue label 为准；当前批准的实现需求以该 Demo 的 `generated/effective-spec.md` 为准。两者职责不同，不互相覆盖。

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
  case.yaml
  generated/
    effective-spec.md
  handoff/
    implementation.md
    modifications.md
    review.md
  src/
  assets/
  tests/
```

## 八步协作闭环

1. **调研规划**：Claude 起草 `brief.md`、`case.yaml` 和 `generated/effective-spec.md`；Codex 只做可实现性挑战。
2. **人工批准**：用户确认目标、范围和验收标准；Codex 在 Issue 留下批准记录并切换到 `status:planned`。
3. **Codex 开发**：Codex 只按已批准规格实现、测试，并写 `handoff/implementation.md`。
4. **用户反馈**：用户看 Demo 后提出修改；Codex 先写入 `handoff/modifications.md`，不直接把新想法视为有效需求。
5. **规格更新**：如反馈改变需求，Claude 更新 `effective-spec.md`，用户重新批准；纯缺陷修复无需改规格。
6. **Claude 只读验收**：Claude 不改代码，只按有效规格检查一致性、完整性和体验，并给出验收意见。
7. **Codex 修复与复验**：Codex 修复并补充修改记录，Claude 再次只读复验；结果写入 `handoff/review.md`。
8. **最终通过**：用户确认展示或归档，Codex 更新 Issue label、Demo Card 和必要的决策记录。

## 文件写入边界

### Claude Code

在规划阶段起草：

- 用户场景
- 价值主张
- 产品流程
- MVP 建议
- 风险问题
- 当前有效规格

Review 阶段只读代码，不直接修复。

### Codex

在 `README.md` 和代码中补充：

- 运行方式
- 技术方案
- 文件结构
- 验证结果
- 已知限制
- 实现、验证和修改记录

Codex 不得自行改写已批准需求。

### Cross Review

审查时必须回答：

- 这个 Demo 是否能在 10 分钟内讲清楚？
- 用户第一次看是否知道它在解决什么？
- 工程实现是否足够小、足够稳？
- 下一步迭代最值得做什么？

## MVP 直通道

第一个真实 Demo 可以压缩状态流转，但不能省略人工批准、有效规格和只读验收：

```text
Idea Issue -> Claude spec -> 用户批准 -> Codex build -> Claude 只读验收 -> Demo Card
```

从第二或第三个 Demo 开始，再严格使用完整状态机。
