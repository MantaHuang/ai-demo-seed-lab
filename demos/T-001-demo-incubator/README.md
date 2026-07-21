# AI DEMO 孵化平台（T-001）

## One-liner

让共学社区的 AI Demo 有地方被看见、被试用、被推着往前走；第一版是作品展示墙 + 摇一摇灵感生成器。

## Target User

共学学员与社区创作者（主）；导师与访客（次）。

## Use Case

- 想做点什么但没想法 → 打开摇一摇，摇出一个「方向 × 人群 × 形态」的起点。
- 做完一个 Demo 想被看见 → 在仓库按模板加一个目录，重新构建即上墙。
- 想看看社区里大家在做什么 → 浏览作品墙，点进感兴趣的 Demo。

## Run

```bash
npm install
npm run dev
```

本地站点默认由 Eleventy 启动。生产构建：

```bash
npm run build
```

运行数据与浏览器验收：

```bash
npm test
```

GitHub Pages 使用项目 base path：`/ai-demo-seed-lab/`。GoatCounter 为可选渐进增强，在仓库 Variables 中配置 `GOATCOUNTER_CODE` 后加载；未配置或统计请求失败不影响作品墙与灵感生成器。

## Validation

- [x] 核心路径可运行
- [x] README 写明运行方式
- [x] Demo Card 已补齐
- [x] 已知限制已记录
- [x] `generated/effective-spec.md` 已获用户批准
- [x] `handoff/implementation.md` 已记录实现和验证
- [ ] `handoff/review.md` 已完成只读验收

## Known Limits

- Phase 1 无账号、无评论、无上传、无在线试用；全平台路线图见 `brief.md`。
- GoatCounter 需要站点所有者自行创建站点并配置公开 site code；未配置时不采集统计。
- 移动、联通、电信三网访问和陌生访客 10 分钟演示需要部署后人工完成。
