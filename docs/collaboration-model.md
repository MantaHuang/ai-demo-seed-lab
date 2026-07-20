# Claude Code 与 Codex 协作模型

## 核心判断

不要把 Claude Code 和 Codex 分成“谁更强”。应该按任务形态分工：

- 模糊、开放、需要取舍的任务交给 Claude Code 先发散。
- 明确、可执行、需要验证的任务交给 Codex 落地。
- 重大方案先交叉审查，再进入实现。

一句话规则：

> Claude 产出可判断的方案，Codex 产出可运行的东西。

## 角色分工

| 场景 | 主力 | 产物 |
| --- | --- | --- |
| 平台定位 | 用户 + Claude | 定位、服务对象、价值主张 |
| Demo idea 发散 | Claude | 用户故事、应用场景、差异化角度 |
| MVP 收敛 | Codex | 模块边界、任务拆解、仓库文件 |
| 技术实现 | Codex | 代码、脚本、测试、部署说明 |
| 文案与叙事 | Claude | Demo 包装、案例说明、路演表达 |
| 代码/方案审查 | Claude + Codex | 风险清单、修改建议 |
| GitHub 状态维护 | Codex | Issue、PR、README、任务记录 |

## 推荐协作节奏

### 1. Idea Capture

用户或 Claude 提出 Demo idea，先用 GitHub Issue 记录，不直接开工。

关键字段：

- 谁会用？
- 解决什么高频/高价值问题？
- 为什么 AI 适合做？
- 10 分钟内能展示什么？
- 成功标准是什么？

### 2. Claude Exploration

Claude Code 输出：

- 用户画像
- 核心流程
- 亮点设计
- 风险/不确定性
- MVP 范围建议

### 3. Codex Build Plan

Codex 输出：

- 文件结构
- 数据结构
- 页面/接口清单
- 实现步骤
- 验证方式

### 4. Implementation

Codex 建立 Demo 原型，保证能运行、能解释、能迭代。

### 5. Cross Review

Claude 审查产品逻辑和体验完整性，Codex 修复工程问题。

### 6. Demo Card

每个成熟 Demo 必须有一张标准 Demo Card，方便平台展示。

## 分歧处理

当 Claude 与 Codex 给出不同建议：

1. 先区分分歧类型：产品价值、技术成本、体验完整性、商业优先级。
2. Claude 解释用户价值和体验影响。
3. Codex 解释工程成本和风险。
4. 用户只裁决方向，不需要陷入实现细节。
5. 裁决结果写入 Issue 或 `decision-log.md`。

## 最小可行协作闭环

第一阶段只需要跑通这个闭环：

```text
Idea Issue -> Claude 参谋 -> Codex 实现 -> Claude/Codex 交叉审查 -> Demo Card -> 平台展示
```

这个闭环跑通后，再建设自动化、多 agent 调度和平台后台。
