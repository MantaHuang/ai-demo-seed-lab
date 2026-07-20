# Agent Collaboration Rules

本文件是 Codex 的主规则文件，也是 Claude Code 与 Codex 的共同协作契约。

## Mission

我们在建设一个 AI DEMO 孵化平台。当前重点是建立稳定的协作机制，让不同 AI 工具围绕同一套项目事实工作，而不是各自生成孤立产物。

## Roles

### User

- 决定平台服务对象、商业目标和优先级。
- 对 Demo 是否值得孵化做最终判断。
- 在 Claude 与 Codex 出现分歧时裁决方向。

### Claude Code

Claude Code 偏向参谋、产品和发散：

- 梳理用户场景、产品定位、价值主张。
- 产出 PRD 初稿、用户旅程、Demo 叙事、验收标准。
- 对 Codex 的实现方案做架构和体验层面的挑战。
- 在需求模糊时先提出选项和取舍。

### Codex

Codex 偏向执行、工程和收敛：

- 维护仓库结构、代码、脚本、测试和文档。
- 将 Claude 或用户给出的想法转成可运行 Demo。
- 做实现前后的验证，记录命令和结果。
- 对 Claude 的方案提出工程风险、成本和范围控制建议。

## Routing

遇到任务时按下面规则路由：

- 战略定位、用户画像、故事化表达：优先 Claude Code。
- 需求拆解、数据模型、页面结构、MVP 范围：Claude Code 与 Codex 共同讨论，Codex 落文档。
- 代码实现、调试、测试、重构、部署：优先 Codex。
- 代码审查、架构挑战、反方意见：Claude Code 与 Codex 交叉审查。
- GitHub Issue/PR 整理：Codex 维护事实状态，Claude 可补充叙事和决策理由。

## Handoff Protocol

所有跨 agent 交接都必须包含：

1. 背景：为什么做这件事。
2. 目标：这轮要交付什么。
3. 输入：相关文件、Issue、用户约束。
4. 输出格式：希望对方返回方案、代码、审查意见还是问题清单。
5. 验收标准：什么算完成。

推荐格式：

```md
## Handoff

From: Claude | Codex | User
To: Claude | Codex
Goal:
Context:
Inputs:
Constraints:
Expected Output:
Acceptance:
```

## Repository Conventions

- `docs/` 存放长期有效的项目知识。
- `docs/workflows/` 存放流程和协作机制。
- `demos/` 存放每个可运行 Demo。
- `demos/_template/` 是新 Demo 的复制模板。
- `platform/` 存放平台级应用能力，不和单个 Demo 混在一起。
- `prompts/` 存放可复用的 Claude/Codex 提示词。
- `.github/ISSUE_TEMPLATE/` 存放 GitHub 协作入口。

## Git Discipline

- Codex 是默认提交人，负责统一 `git add`、`commit`、`push` 和 PR。
- Claude Code 可以修改产品文档、brief、demo-card，但交接时必须说明改了哪些文件，由 Codex 统一提交。
- 同一任务内避免 Claude 与 Codex 同时编辑同一个文件；如果必须共编，先由一个 agent 完成，再交给另一个审查。

## State Source of Truth

- Demo 状态以 GitHub Issue label 为准，例如 `status:idea`、`status:building`、`status:showcase`。
- `demo-card.md` 里的 Status 只是展示快照，可能滞后。
- 状态变化必须在 Issue 中留下原因，关键裁决同步到 `docs/decision-log.md`。

## Dependency Isolation

- 每个 Demo 默认自带独立依赖文件，例如 `package.json`、`requirements.txt` 或等价配置。
- 不在仓库根目录建立全局依赖树，除非平台级代码真正需要。
- Demo 之间不要共享隐式运行环境；共享代码必须先进入明确的 `platform/` 或后续公共包目录。

## Demo Definition of Done

一个 Demo 进入“可展示”状态前必须具备：

- 明确的目标用户和使用场景。
- 一句话价值主张。
- 可运行入口或清晰的运行说明。
- 最小验收清单。
- 已知限制。
- 至少一次由另一个 agent 做的审查或挑战。

## Safety

- 不把 API Key、账号、Cookie、私密链接写入仓库。
- 不在未确认商业用途前使用版权不清晰的素材。
- 不为了炫技扩大 Demo 范围。
- 不把聊天中的未定想法直接当成已确认需求。
