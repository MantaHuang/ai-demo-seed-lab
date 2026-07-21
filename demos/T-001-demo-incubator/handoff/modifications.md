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

- Requested by:
- Type: Requirement | Defect | UX | Technical
- Reason:
- Spec revision before:
- Spec revision after:
- Changes:
- Impact:
- Verification:
