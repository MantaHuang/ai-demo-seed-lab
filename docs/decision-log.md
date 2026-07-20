# Decision Log

记录会影响平台方向、协作方式、Demo 取舍和技术路径的重要决策。

## 格式

```md
## YYYY-MM-DD - Decision Title

Decision:

Context:

Options Considered:

Why:

Impact:
```

## 2026-07-21 - Claude/Codex 协作基本分工

Decision:

Claude Code 作为产品参谋和方案挑战者，Codex 作为工程执行者和仓库维护者。Codex 是默认提交人。

Context:

用户已经打通 Claude Code 与 Codex 协作，希望在 GitHub 仓库中建立长期协作机制。

Options Considered:

- 两个 agent 各自独立提交。
- Claude 做 PM，Codex 做工程实现。
- 所有工作都由单一 agent 完成。

Why:

Claude 更适合处理开放问题、用户场景和叙事；Codex 更适合维护仓库状态、实现、验证和提交。统一由 Codex 提交可以减少冲突和历史混乱。

Impact:

后续跨 agent 交接需要写清楚文件、目标和验收标准。GitHub 状态由 Codex 维护，Claude 输出以方案和文档为主。

## 2026-07-21 - Demo 状态以 GitHub Issue label 为准

Decision:

Demo 状态的唯一事实源是 GitHub Issue label，`demo-card.md` 的 Status 字段只作为展示快照。

Context:

状态可能同时出现在 Issue、Demo Card 和文档中，如果没有唯一事实源，很快会出现不一致。

Options Considered:

- 以 `demo-card.md` 为准。
- 以目录结构为准。
- 以 GitHub Issue label 为准。

Why:

Issue label 最适合承担任务流转和协作状态，且可以直接服务 GitHub 看板、筛选和自动化。

Impact:

每次状态变化都应更新 Issue label，并在必要时同步 Demo Card。
