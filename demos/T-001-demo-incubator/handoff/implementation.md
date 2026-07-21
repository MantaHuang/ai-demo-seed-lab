# Implementation Handoff

## Spec Revision

1

## What Was Built

Phase 1 已按 Revision 1 实现：

- Eleventy 静态站，包含作品墙和结构化灵感生成器。
- `scripts/build-data.mjs` 扫描 `demos/*/case.yaml`，生成统一 `demos.json`；`demo-card.md` 不参与机器构建。
- 灵感词库由 `idea-dimensions.yaml` 原文解析为 `ideas.json`，未修改任何词条文案。
- 指定方向、全随机、重摇不重复、稳定 ID、复制与手动选中文本回退。
- 可选 GoatCounter 访问与事件统计；统计不可用时核心功能不受影响。
- GitHub Pages 项目 base path 和 Actions 部署工作流。
- Eleventy + Nunjucks + 原生 JS/CSS + `yaml`，未做技术栈替换。

## Files Changed

- `.github/workflows/deploy-t001.yml`
- `.gitignore`
- `demos/_template/case.yaml`
- `demos/T-001-demo-incubator/package.json`
- `demos/T-001-demo-incubator/package-lock.json`
- `demos/T-001-demo-incubator/eleventy.config.js`
- `demos/T-001-demo-incubator/scripts/build-data.mjs`
- `demos/T-001-demo-incubator/src/`
- `demos/T-001-demo-incubator/tests/`
- `demos/T-001-demo-incubator/playwright.config.js`
- `demos/T-001-demo-incubator/README.md`
- `demos/T-001-demo-incubator/.env.example`
- `demos/T-001-demo-incubator/case.yaml`

## How to Run

```bash
npm install
npm run dev
```

## Verification

- `npm run build`：通过；生成 `index.html`、`demos.json`、`ideas.json` 与静态资源。
- `npm run test:unit`：4/4 通过。
- Playwright 浏览器验收：S1、S2、S3、S4、S7、S8 分批运行，全部通过。
- 视觉 QA：Playwright 生成桌面与 375×667 全页截图，人工检查无重叠、横向溢出或孤字标题。

### S1-S9

| 场景 | 结果 | 证据 / 原因 |
| --- | --- | --- |
| S1 首次打开 | 通过 | Playwright 同时验证 1280×800 与 375×667；唯一 h1、作品墙标题、首张卡片和摇一摇入口均在首屏。 |
| S2 作品墙链接 | 通过 | 断言所有卡片链接协议为 http/https；点击仓库链接产生新页面导航且 URL 与配置一致。 |
| S3 摇一摇路径 | 通过 | 3 秒内展示方向、人群、形态、一句话点子；复制文本包含稳定 ID；同时验证 Clipboard API 和选中文本回退。 |
| S4 重摇不重样 | 通过 | 注入固定随机序列，连续 5 次相邻 ID 均不同。 |
| S5 脏数据降级 | 通过 | Node fixture：损坏 YAML 被跳过，缺字段显示「未填写」，日志含规定错误码，构建函数不中断。 |
| S6 新增自动上墙 | 通过 | Node fixture：只新增合规 Demo 目录即可进入统一卡片模型，无需改前端。 |
| S7 无 API Key | 通过 | 阻断全部外部 HTTPS 请求后，摇、重摇仍可用；项目不读取任何 AI API Key。 |
| S8 移动端 | 通过 | 375×667 下无横向溢出，卡片和摇/重摇/复制按钮均在视口内可操作。 |
| S9 灵感转化链路 | 通过 | fixture 的合法 `origin_idea` 通过同一数据函数和生产 Nunjucks 卡片模板渲染为「源自灵感 #ID」。 |

### 人工与网络检查

| 检查 | 结果 | 说明 |
| --- | --- | --- |
| 陌生访客 10 分钟演示 | 待人工完成 | 需要 Manta 或 Claude 验收阶段找观察者记录用时与结论。 |
| 中国移动访问站点 / GoatCounter | 待三网实测 | 当前机器无法证明运营商链路；部署后用移动网络访问并记录。 |
| 中国联通访问站点 / GoatCounter | 待三网实测 | 当前机器无法证明运营商链路；部署后用联通网络访问并记录。 |
| 中国电信访问站点 / GoatCounter | 待三网实测 | 当前机器无法证明运营商链路；部署后用电信网络访问并记录。 |

## Known Limits

- Phase 1 只有仓库提交上墙，无站内上传。
- GoatCounter code 未配置时不采集统计；统计脚本失败不影响核心功能。
- GitHub Pages 在中国大陆的运营商可达性尚待三网人工实测。
- 未实现有效规格 Out of Scope 中的账号、评论、点赞、上传、沙箱、通知、后台和 sola 互通。
