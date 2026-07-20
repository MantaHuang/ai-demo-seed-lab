# GitHub 远端仓库设置

## 推荐仓库

- Owner: `MantaHuang`
- Repository: `ai-demo-seed-lab`
- Visibility: private first, public later if要展示

## 当前限制

当前 Codex 已连接 GitHub App，可以操作已有仓库里的文件、Issue 和 PR。

但这个连接器没有提供“创建新仓库”的工具。本机也暂时没有安装 GitHub CLI (`gh`)。

## 方案 A：网页创建仓库

1. 打开 GitHub 新建仓库页面。
2. 创建 `MantaHuang/ai-demo-seed-lab`。
3. 不要勾选自动生成 README、`.gitignore` 或 License，避免和本地文件冲突。
4. 创建后，把远端地址告诉 Codex。
5. Codex 执行：

```bash
git remote add origin https://github.com/MantaHuang/ai-demo-seed-lab.git
git branch -M main
git push -u origin main
```

## 方案 B：安装 GitHub CLI 后由 Codex 创建

安装并登录 `gh` 后，Codex 可以执行：

```bash
gh repo create MantaHuang/ai-demo-seed-lab --private --source . --remote origin --push
```

## 建议

先用 private 仓库承载协作机制和 Demo 草稿。等平台有可展示首页、Demo Card 和至少 2-3 个可运行 Demo 后，再决定是否公开。
