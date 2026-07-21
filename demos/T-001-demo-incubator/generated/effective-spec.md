# Effective Spec — T-001 AI DEMO 孵化平台（Phase 1）

> Status: Approved (Revision 1). 本版本为 Codex 的唯一实现依据；任何需求变更须先记录反馈、由 Claude 更新规格并经用户重新批准。
>
> 本规格只覆盖 Phase 1（展示墙 + 灵感生成器）。Phase 2-4 蓝图见 `../brief.md`，不属于本规格。

## Revision

- Revision: 1
- 修订原因: Codex 复核指出 5 处数据/验收契约未闭合；用户拍板：词库按现状批准 / GoatCounter 渐进统计 / 先 GitHub Pages / 机器字段集中到 case.yaml
- Approved by: Manta（用户）
- Approved at: 2026-07-21（会话内批准；GitHub Issue 建立后补记 `/approve`）
- Related Issue: 待建（Codex 建立后回填）
- 上一版: Revision 0，Approved by Manta，2026-07-21

## One-Sentence Concept

一个公开站点，承载项目全周期的头尾两端：「摇一摇」帮不知道做什么的人领到一个可动手的项目起点（周期入口），作品墙让做出来的 Demo 被看见（周期出口）；两端通过 `origin_idea` 字段在数据上打通，为 Phase 2 的进度管理预留链路。

## Goal

1. **Demo 作品墙**：从本仓库数据渲染作品卡片，让社区的 Demo 被看见。
2. **灵感生成器**：「摇一摇」生成结构化 idea 卡，把「不知道做什么」变成「有一个具体起点」。

## User Flow

1. 访客打开首页，看到 Demo 作品墙（卡片网格）。
2. 每张卡片显示：作品名、作者、一句话介绍、状态、链接（Repo / Demo，如有）；有 `origin_idea` 的卡片显示「源自灵感 #编号」标记。
3. 点击卡片链接跳转到对应 Demo 或仓库页面。
4. 访客切换到「摇一摇」：选择一条方向（或"随机"）→ 点击摇一摇 → 得到一张 idea 卡（方向 × 人群 × 形态 + 按固定模板生成的一句话点子）→ 可重摇、可复制文本（含 idea 编号）。

## Data Contract（卡片数据契约）

- **case.yaml 是唯一机器数据源**；`demo-card.md` 退为纯人读叙事，构建时不解析。
- case.yaml 新增字段（模板 `demos/_template/case.yaml` 由 Codex 实现时同步更新）：
  - `author`: 公开展示名（字符串）
  - `links: { repo, demo, issue }`（均可为空字符串）
  - `origin_idea`: 可选，值为 idea 纯 ID（不带 `#`）
- 构建时将各 demo 归一化为统一卡片模型并输出静态 `demos.json`：
  `id, slug, title, author, tagline, status, repo_url, demo_url, issue_url, origin_idea`
  （`tagline` 来自 case.yaml 的 `goal` 首句或新增 `tagline` 字段，Codex 提案后在 handoff 说明）
- 必备字段 = `title` / `author` / `tagline`：缺失时该字段显示「未填写」占位，卡片仍渲染。
- YAML 解析失败：跳过该卡片，构建日志输出 `YAML_PARSE_ERROR <文件路径>`；缺必备字段输出 `MISSING_REQUIRED_FIELD <文件路径> <字段>`。两种情况**构建退出码均为 0**。
- `_template` 目录排除；新增合规 demo 目录后重新构建即出现新卡片，无需改前端代码。

## Idea 编号与词库规则

- 词库文件 `../idea-dimensions.yaml`（已随本修订转正，用户 2026-07-21 批准按现状使用；Codex 只做格式转换，不改任何文案）。
- slug 仅允许 `[a-z0-9]+`；各维度内唯一；**发布后不改名、不复用**；弃用词条加 `deprecated: true` 而非删除。
- ID = `IDEA-{directionSlug}-{audienceSlug}-{formSlug}`；构建时校验最终 ID 无重复；比较统一小写；URL 中使用 `encodeURIComponent`。
- 修改词条 `hint`/`name` 文案不改变 ID 语义（ID 标识维度组合，不标识文案版本）。
- 一句话点子由固定模板生成（模板存于词库配置 `idea_template`）：
  `为「{audience.name}」做一个「{form.name}」，帮 TA 在「{direction.name}」场景里拿到一个具体的结果。`
  idea 卡同时展示三个维度的 `hint` 作为补充说明。

## Functional Requirements

- [ ] 作品墙按 Data Contract 构建渲染；输出 `demos.json` 供页面与测试共用。
- [ ] 摇一摇：指定方向摇 / 全随机摇 / 重摇（算法排除上一组合）/ 一键复制（文本含 ID 与一句话点子）；随机源可注入/可固定以便测试。
- [ ] 默认本地规则生成，**不依赖任何付费 API**；无 API Key 环境功能完整。
- [ ] 统计：GoatCounter 托管版；仅采集访问量 + 自定义事件 `generator-open` / `shake` / `reshake` / `copy-idea` / `demo-link-click`；**不承诺停留时长**；无 Cookie、无客户端标识、不持久化 IP/UA、无跨站画像；统计脚本加载失败或被拦截时核心功能不受影响。
- [ ] 部署：GitHub Pages 项目站点 + GitHub Actions 构建发布；所有资源与内部链接使用可配置 base path，不假定域名根目录。
- [ ] 建议技术栈：Eleventy + Nunjucks + 原生 JS/CSS + `yaml` npm 包；不引入 React/Next.js/数据库/CMS/SSR。Codex 可等价替换，但须在 `handoff/implementation.md` 说明理由。
- [ ] 安全与健壮性：外链协议白名单仅 `https:`/`http:`；渲染内容统一转义；配置 schema 校验（重复/非法 slug、未知状态、危险 URL 产生明确告警）；剪贴板 API 不可用时提供选中文本回退；支持 `prefers-reduced-motion`；摇一摇可用键盘操作。
- [ ] 移动端（375px 宽）浏览与摇一摇可用。

## Assumptions（批准前请校对）

- 访客无需登录即可使用全部功能（Phase 1 无账号体系）。
- 「上墙」的唯一途径 = 按模板向本仓库提交 demo 目录（Git 流程），Phase 1 不做站内上传。
- 站点公开可访问，展示内容均无隐私/授权问题（由仓库收录流程保证）。
- 界面语言为中文。
- 大陆访问：先以 GitHub Pages 上线，验收阶段实测（见下），不可达再评估境内/香港托管，不提前付出备案成本。

## Scenario Acceptance Tests（场景验收，全部可自动断言）

- **S1 首次打开**：页面存在唯一 `h1` 且文本含「AI Demo」与「展示」；375×667 与桌面视口下，作品墙标题、至少一张卡片、摇一摇入口首屏无需交互可见。（主观可用性另列人工检查项）
- **S2 作品墙链接**：对配置了 `repo_url`/`demo_url` 的卡片，渲染 `href` 与配置值一致、协议为 https/http、点击产生导航请求；外部站点是否在线不作为成败条件。
- **S3 摇一摇路径**：点击后测试浏览器 3 秒内出现含「方向/人群/形态/一句话点子」四字段的 idea 卡，复制按钮可用，复制文本含 ID。
- **S4 重摇不重样**：注入固定随机序列，连摇 5 次断言相邻两次 ID 不同。
- **S5 脏数据降级**：fixture 含损坏 case.yaml 与缺字段样例；构建退出码 0，日志含 `YAML_PARSE_ERROR`/`MISSING_REQUIRED_FIELD` 与文件路径，卡片按契约跳过或占位。
- **S6 新增自动上墙**：fixture 新增合规 demo 目录，构建后 `demos.json` 与页面出现其 ID，未改任何前端源文件。
- **S7 无 API Key**：清除项目文档列出的全部可选密钥变量并禁止外部 API 请求，页面加载、摇/重摇/复制全部通过（统计请求除外，且其失败不影响功能）。
- **S8 移动端**：375×667 视口断言 `document.documentElement.scrollWidth <= clientWidth`；卡片与主要按钮不超出视口；摇一摇/重摇/复制可点击。
- **S9 灵感转化链路**：fixture demo 的 `origin_idea` 填合法 ID，构建后该卡片渲染「源自灵感 #ID」标记。

## Acceptance Criteria

- [ ] S1-S9 自动验收全部通过（Codex 在 `handoff/implementation.md` 逐条记录通过/未通过及原因）。
- [ ] 作品墙渲染出本仓库现有 demo（含 T-001 自身，其 repo 链接可点）。
- [ ] 人工检查项：向陌生访客 10 分钟内演示讲清（记录演示用时与观察者结论）。
- [ ] 大陆可达性实测：移动/联通/电信网络各访问一次站点与统计端点，结果记入 `handoff/implementation.md`（不可达不阻断验收，但触发部署形态再评估）。

## Out of Scope

- 账号、登录、个人页
- 评论、点赞、互评、通知、督促
- 作品上传、在线试用沙箱
- sola 平台数据互通
- 后台管理界面
- 停留时长等会话级分析（统计渐进方案的明确取舍）

## Rabbit Holes / Scope Risks（防范围膨胀）

- **别做成完整社区**：看到作品墙就想加评论/点赞——那是 Phase 3，出现此冲动时停下。
- **摇一摇的定位是"入口"而非"玩具"，但实现保持克制**：接 LLM、调 prompt、做动画都可能吞掉整个开发周期；规则组合 + 稳定编号能跑即达标，升级投入等上线数据复盘后由用户定夺。
- **别自建 CMS**：卡片数据源永远是仓库文件，不要为"编辑方便"引入数据库或后台。
- **别追求全量收录**：Phase 1 上墙的就是本仓库 demo，不要爬取或手工搬运 sola 的作品（版权 + 维护成本双坑）。
- **别为统计过度建设**：不自建统计后端、不为停留时长升级方案，GoatCounter 事件够用到 Phase 2。

## Constraints and Risks

- 版权/隐私：作品墙只收录本仓库孵化的 demo 与用户手动授权的条目；不抓取、不转载 sola 或他人作品数据。
- 社区贡献的 YAML/Markdown/链接视为不可信输入：schema 校验 + 协议白名单 + 转义是硬要求。
- "仓库即数据库"意味着卡片质量取决于各 demo 的 case.yaml 维护质量；解析对脏数据宽容。
- GoatCounter 服务器在欧洲，大陆访问质量未知；统计缺失只影响数据完整性，不影响功能。
- sola 联动是合作事项而非技术承诺，本阶段不为其预留接口负担。

## Post-Launch Data Review（上线后数据复盘）

上线约 30 天后，由 Claude/Codex 产出完整数据复盘报告，供用户定夺功能去留（**不设自动裁决**）：

- 灵感转化数：标注 `origin_idea` 的 demo 数量（仓库数据）
- 无催促的第二次提交数：作者主动更新自己 demo 的次数（公开 Git 历史）
- 回访与访问量：GoatCounter 聚合数据（仅所有者可见）
- 功能事件分布：`shake`/`reshake`/`copy-idea`/`demo-link-click` 相对量（替代原"页面停留"指标）

## Handoff Prompt For Development（Revision 1 批准后交给 Codex）

> 复核意见已吸收至本 Revision 1。请：①建立 T-001 GitHub Issue，记录批准信息，回填 `case.yaml.status_issue` 与本文件 Related Issue，更新 label；②只按本规格实现 Phase 1，不做 Out of Scope 内容，警惕 Rabbit Holes 清单；技术栈如有等价替换在 handoff 说明理由。完成后按 S1-S9 逐条自测并在 `handoff/implementation.md` 中记录通过/未通过及原因，附大陆三网实测结果。
