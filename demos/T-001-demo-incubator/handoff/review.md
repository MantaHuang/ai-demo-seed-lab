# Review Report

## Review Round 1

- Reviewer: Claude Code
- Spec revision: 1
- Code mode: Read-only
- Result: **Pass（附条件通过）**
- Date: 2026-07-22
- 验收方式: 通读全部实现源码（build-data.mjs / eleventy.config.js / index.njk / demo-card.njk / app.js / site.css / 单元与 e2e 测试 / deploy workflow / package.json）+ 线上站点实测（https://mantahuang.github.io/ai-demo-seed-lab/ 桌面与 375×667）+ demos.json 端点 + GitHub Issue #1 核对

### Acceptance Results

- [x] Goal and user flow match the effective spec
- [x] Functional requirements are complete（统计功能已实现但未启用，见条件 1）
- [x] Acceptance criteria pass（S1-S9 全部验证通过；两项人工检查待完成，见条件 2）
- [x] Known limits are disclosed

### S1-S9 逐项复核

| 场景 | 结论 | 复核证据 |
| --- | --- | --- |
| S1 首次打开 | 通过 | 代码：唯一 h1「AI Demo 展示与孵化」含双关键词；e2e 双视口断言首屏元素。线上实测：h1Count=1，作品墙与摇一摇入口首屏可见。 |
| S2 作品墙链接 | 通过 | safeUrl 协议白名单 + DANGEROUS_URL 告警；e2e 断言 href 与配置一致并产生导航。线上：T-001 卡三链接（Demo/仓库/Issue）渲染正确。 |
| S3 摇一摇路径 | 通过 | 线上实测：点击即出四字段卡，句子与 idea_template 逐字吻合（「为「家人/朋友」做一个「可玩交互/游戏」…」）；e2e 同时覆盖 Clipboard API 与选中文本回退，复制文本以 IDEA- 开头。 |
| S4 重摇不重样 | 通过 | window.__ideaRandomSequence 可注入；e2e 固定序列 5 连摇相邻 ID 不同。线上实测两次摇 ID 不同。 |
| S5 脏数据降级 | 通过 | 单测 fixture：损坏 YAML 跳过 + YAML_PARSE_ERROR；缺字段「未填写」占位 + MISSING_REQUIRED_FIELD；构建不中断。 |
| S6 新增自动上墙 | 通过 | 单测 fixture 断言数据函数；补充线上验证：demos.json 端点 200，卡片模型字段齐全（id/author/status/repo_url/demo_url）。 |
| S7 无 API Key | 通过 | e2e 阻断全部外部请求后核心功能可用；项目不读取任何 AI API Key；统计为可选增强。 |
| S8 移动端 | 通过 | e2e 断言 scrollWidth<=clientWidth 及控件在视口内；线上 375×667 实测：无溢出，摇/重摇/复制按钮全部可见可点。 |
| S9 灵感转化链路 | 通过 | 单测用生产 Nunjucks 模板渲染「源自灵感 #IDEA-product-community-tool」；origin_idea 合法性对 validIds 校验（UNKNOWN_ORIGIN_IDEA 告警）。 |

### 规格一致性与边界检查

- **Data Contract**：完全一致——case.yaml 唯一机器源、demos.json 输出、必备字段占位、错误码、`_template` 排除、tagline 取 goal 首句（正则支持中英文标点，实现合理并已在 handoff 说明）。
- **词库**：idea-dimensions.yaml 文案零改动（单测断言 343 组合与模板原文）；slug/ID 规则、deprecated 过滤、查重全部落实。
- **Rabbit Holes**：无违反——无评论/点赞、无 LLM、无数据库/CMS、无 sola 数据搬运、无统计过度建设。
- **Out of Scope**：未发现越界实现。
- **技术栈**：Eleventy + Nunjucks + 原生 JS/CSS + yaml，与建议栈一致，无替换。
- **安全**：模板全量 escape、innerHTML 处手写 escapeHtml、协议白名单、noopener、schema 告警（ILLEGAL_SLUG/UNKNOWN_STATUS/DUPLICATE_DEMO_ID）。
- **可访问性**：prefers-reduced-motion 已支持；控件均为原生元素，键盘可操作；aria-live/aria-label 使用得当。
- **部署**：Actions 触发范围为 `demos/**`（任何 demo 数据变更均重建，覆盖了复核提出的风险）；base path 可配置且线上 `/ai-demo-seed-lab/` 生效。

### Findings

1. **（非阻断/低）桌面横向溢出 ~8px**：1280 宽视口下 `.generator` 区块宽 1280px 而含滚动条的 clientWidth 为 1265px，出现横向滚动条（疑似 100vw 未扣除滚动条宽度）。移动端无此问题，S8 仅约束移动端故不算失败。建议下轮顺手修复（100vw → 100%）。
2. **（条件/用户动作）GoatCounter 未启用**：线上 `data-goatcounter-code` 为空、统计脚本未加载——实现正确（未配置时优雅缺席），但 30 天数据复盘依赖统计数据。需要 Manta 创建 GoatCounter 站点并在仓库 Variables 配置 `GOATCOUNTER_CODE`。
3. **（观察）重摇为"最多重试 30 次"而非确定性排除上一组合**：343 组合下实际无影响且固定序列测试通过；仅当词库收缩到极少组合时可能相邻重复。无需改动，记录备查。
4. **（观察）S6 自动测试断言数据函数而非最终 demos.json 文件**：本次验收已在线上直接验证 demos.json 端点补足，无需改动。

### 待人工完成项（不阻断本次验收结论）

- 大陆访问实测：**2026-07-22 用户（Manta）确认手机网络可正常打开站点**（运营商未记录；如需补齐三网数据，切换移动/联通/电信各测一次并由 Codex 记入 implementation.md）。GoatCounter 端点可达性待站点 code 配置后一并验证。
- 陌生访客 10 分钟演示，记录用时与观察者结论（可选）。

## Re-review

- Reviewer: 不另行触发（Manta 在 Codex 修复 Finding 1 后确认最终通过）
- Result: Final Pass
- Resolved findings: Finding 1，桌面 `.generator` 横向溢出已修复并增加回归断言。
- Remaining findings: Finding 2-4 均为已接受的非阻断条件或观察项。

## Final Approval

- Approved by: Manta
- Approved at: 2026-07-22
- Final Issue status: status:showcase
