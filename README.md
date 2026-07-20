# AI DEMO Seed Lab

AI DEMO Seed Lab 是一个用于孵化、管理和展示 AI Demo 的协作仓库。

这个仓库的第一目标不是马上堆功能，而是先建立一套稳定的 Claude Code 与 Codex 协作机制：Claude 负责发散、产品判断和方案参谋；Codex 负责工程落地、验证和仓库维护；用户负责方向裁决和优先级。

## 当前阶段

MVP 之前的协作基建阶段。

已建立的基础：

- `AGENTS.md`：Codex 读取的协作规则
- `CLAUDE.md`：Claude Code 读取的协作规则，引用同一份规则源
- `docs/collaboration-model.md`：Claude 与 Codex 的分工方案
- `docs/workflows/demo-incubation.md`：从 idea 到可运行 demo 的流转
- `demos/_template/`：每个 demo 的标准目录模板
- `.github/ISSUE_TEMPLATE/`：GitHub 上提交 demo idea 和任务的模板

## 工作原则

1. 每个 Demo 先有清楚的用户场景，再进入工程实现。
2. Claude Code 先做产品发散、风险提示、体验推演。
3. Codex 再做需求收敛、代码实现、测试验证。
4. 关键判断写入 GitHub Issue 或文档，避免只存在聊天记录里。
5. 所有可运行成果进入 `demos/`，所有平台级能力进入后续 `platform/`。

## 推荐远端仓库名

建议新建 GitHub 仓库：

`ai-demo-seed-lab`

当前 GitHub 连接器可以读写已有仓库、创建 Issue/PR，但没有创建新仓库的接口。远端仓库需要在 GitHub 页面创建，或安装并登录 GitHub CLI 后由 Codex 执行推送。
