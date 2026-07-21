# Modification Log

按时间追加，不覆盖历史记录。需求变化必须关联新的有效规格版本；缺陷修复可以保持原规格版本。

## 2026-07-21 - 响应 Codex 可实现性复核，规格修订至 Revision 1

- Requested by: Codex 复核（request-changes）+ 用户 4 项决策（Manta）
- Type: Requirement
- Reason: 复核指出 5 处数据/验收契约未闭合：①卡片数据缺作者字段与字段优先级；②一句话点子无生成规则；③词库仍为 Draft；④统计约束与复盘指标冲突；⑤唯一作品卡无可测链接。
- Spec revision before: 0（已批准）
- Spec revision after: 1（Manta 于 2026-07-21 批准）
- Changes: case.yaml 成为唯一机器数据源（新增 author/links，构建输出 demos.json）；固定点子句模板与 slug/ID 不可变规则；词库转正为 idea-dimensions.yaml（用户按现状批准）；统计定为 GoatCounter 渐进方案（放弃停留时长）；部署定为 GitHub Pages + base path + 大陆三网实测；9 个场景验收全部改写为可自动断言形式；安全健壮性要求并入功能要求；T-001 卡补 repo 链接；case.yaml/brief.md 冗余收敛。
- Impact: 实现范围与 Revision 0 一致，未新增产品功能；主要影响数据契约、测试形式与模板（_template/case.yaml 由 Codex 实现时同步）。
- Verification: case.yaml 与 idea-dimensions.yaml 通过 YAML 解析；复核 6 个阻断问题逐条有落点（Issue 建立一项列入 Codex 交接清单）。

## YYYY-MM-DD HH:MM - Change Title

## 2026-07-21 - Phase 1 工程实现与验收自动化

- Requested by: Manta（批准 Spec Revision 1 后开工）
- Type: Technical
- Reason: 将已批准规格落为可部署、可验证的第一阶段产品。
- Spec revision before: 1
- Spec revision after: 1（无需求变更）
- Changes: Eleventy 作品墙、灵感生成器、case.yaml 数据构建、GoatCounter 渐进增强、GitHub Pages Actions、Node/Playwright S1-S9 验收；模板补充 `author/status/links/origin_idea`。
- Impact: 新增 Phase 1 可运行站点和独立依赖；未实现任何 Out of Scope 内容。
- Verification: 构建与单元测试通过；S1-S9 自动测试通过；桌面与移动端截图人工检查通过；三网访问与陌生访客演示待部署后人工完成。

## YYYY-MM-DD HH:MM - Change Title

- Requested by:
- Type: Requirement | Defect | UX | Technical
- Reason:
- Spec revision before:
- Spec revision after:
- Changes:
- Impact:
- Verification:

## 2026-07-22 - 修复桌面端灵感生成器横向溢出

- Requested by: Claude Code 只读验收 Finding 1，Manta 批准修复
- Type: Defect
- Reason: 1280px 桌面视口下 `.generator` 使用 `100vw` 参与全宽计算，未扣除浏览器垂直滚动条宽度，造成约 8px 横向溢出。
- Spec revision before: 1
- Spec revision after: 1（缺陷修复，无需修改规格）
- Changes: `.generator` 改为基于父容器的 `width: 100%`，并新增 1280×800 桌面视口无横向溢出的 Playwright 回归测试。
- Impact: 消除桌面横向滚动条；不改变功能、数据契约或移动端交互。
- Verification: `npm run build` 与 `npm run test:unit` 通过；桌面回归断言通过，独立 Chromium DOM 尺寸检查为 `clientWidth=1280`、`scrollWidth=1280`、generator 边界 `8..1272`。
