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

## 2026-07-21 - 状态事实与需求事实分层管理

Decision:

GitHub Issue label 是 Demo 流转状态的唯一事实源；每个 Demo 的 `generated/effective-spec.md` 是当前批准实现需求的唯一事实源。

Context:

参考协作案例使用 `case.yaml`、有效规格和 handoff 文件保存执行证据。仓库原有 Issue 状态机适合平台治理，但缺少单个 Demo 的需求与返修证据链。

Options Considered:

- 全部以 GitHub Issue 为准。
- 全部以仓库文件为准。
- 状态与需求分别使用最合适的事实源。

Why:

状态回答“走到哪一步”，有效规格回答“批准做什么”。分层后既能服务 GitHub 看板，也能防止两个 agent 根据不同聊天记录实现。

Impact:

每个 Demo 新增 `case.yaml`、`generated/effective-spec.md` 和 `handoff/` 证据链。Claude 负责需求规格和只读验收，Codex 负责实现、记录、提交和状态维护。
