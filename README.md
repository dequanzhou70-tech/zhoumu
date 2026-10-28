# 心动放映室 · Crush Cinema

一部关于「你和 TA」的轻互动电影。14 个真实相处的观察题（含 6 组剧情图片选择），串起从深夜聊天到下一次邀约的 4 章故事，生成 12 种关系属性画像之一和可下载的专属海报。

- 适配手机与电脑，支持键盘操作与减少动态效果偏好。
- 题目页直接显示问题，选择后自动进入下一题；最后一题直接生成结果。
- 支持上一题改答、结果页返回修改答案、刷新后手动恢复进度与重开确认。
- 6 个互动维度；未知选项不扣分。少于 4 条已知线索不出总分。
- 「剧情升温值」是娱乐性的互动信号汇总，不是喜欢概率或经过验证的心理量表。
- 不登录、不收集姓名或聊天记录，没有答题上传接口和统计追踪。
- 作答仅保存在本标签页 sessionStorage；邀请链接不含答案。
- 海报通过 Canvas 在设备内生成，1080 × 1560 PNG。12 种画像分别使用独立的本地 SVG 插画，不只是更换背景颜色。

## 关系画像与相处指导

六个指标分别为主动靠近、特别关注、情绪回应、行动投入、相处稳定与边界尊重。结果不是总分高低的简单分档，12 类根据这些维度的组合、观察覆盖及线上相处背景区分。

每个指标给出所选线索、解释、可尝试的行为、注意事项、示例表达和研究索引。结果还提供 3 步相处方案。任何记录到的施压或反复越界优先处理，不用其他高分抵消。

参考文献在 `src/research.js`，包括自我表露与喜欢的元分析、回应性、积极事件分享、共同新鲜活动及情境化冲突沟通研究。文献为建议提供思路，没有验证本产品的 12 类分型、分数或阈值。部分研究以已建立关系的伴侣为对象，不能直接保证暧昧期的效果。本次学术站点访问受限，未完成在线复核；提供完整期刊、年份及 DOI 供查阅。

## 本地开发

建议 Node.js 24（Vite 要求 Node 20.19+ 或 22.12+）。在仓库目录运行：

```sh
npm ci
npm run dev
```

按终端提示访问开发服务器。无需数据库、后端或 API 密钥。

```sh
npm test             # 评分、内容与打包：22 项
npm run build        # 生产站点 -> dist/
npm run preview      # 预览生产站点
npm run package      # 额外生成 release/心动放映室.html 单文件版
```

单文件版把 CSS、JavaScript、图标和剧情图片都内联，不需要 CDN 资源。带剧情图片的版本约 2.3 MB；构建时的大 JS 分块提示主要来自这些媒体资源。可下载后用允许本地 HTML 的浏览器打开；微信等应用内文件预览器可能不执行脚本，正式传播请使用公开网站链接。

## 浏览器测试

```sh
npx playwright install chromium
npm run test:e2e
```

若系统已经提供 Chromium，可复用：

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

16 项端到端测试覆盖完整答题、未知结局、回退改答、刷新恢复、重开确认、弹窗焦点、隐私清除、键盘操作、手机排版及真实 PNG 下载。

## 发布为公开网站

这是纯静态网站，不需要购买服务器。`dist/` 的全部内容可托管到 GitHub Pages、Cloudflare Pages、Netlify 或任何静态服务。构建使用相对资源路径，兼容仓库子目录。

### GitHub Pages（此仓库已提供自动部署工作流）

1. 将代码推送到 GitHub 仓库的 `main` 分支。
2. 在 GitHub 仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开 **Actions → Deploy Crush Cinema → Run workflow**，选择 `main` 执行。如首次推送时尚未启用 Pages，部署可能失败；启用后重新运行即可。
4. 成功后，在工作流的 `github-pages` 环境中打开 GitHub 返回的网址。只有部署成功并实际访问过后，才能确认已上线。

之后推送到 `main` 会自动跑逻辑测试、构建并发布。不需配置网站应用密钥。

**云开发环境的网络限制**：如果无法调用 GitHub API 或验证 Pages 地址，需要在云环境网络设置允许 `api.github.com` 和 `dequanzhou70-tech.github.io`。这与 GitHub 仓库的 Pages 设置是两回事。环境配置草稿的保存、云环境发布，也不等于网站已经部署。

## 内容与结构

- `src/story.js`：14 道题、12 个结果、评分及证据解释。
- `src/main.js`：交互、会话恢复、海报与分享。
- `src/style.css`：响应式电影票视觉。
- `src/art.js`：首页本地 SVG 插画。
- `src/visuals.js`：12 张属性插画。
- `src/choice-scenes.js`：24 个选项逐一对应的分镜说明、对白和裁切位置。
- `src/choice-illustrations.js` 与 `src/assets/story/`：6 组生成的剧情画面（共 24 个分镜），内联 WebP，不依赖外部图片服务。
- `src/research.js`：5 篇参考文献、研究启发及适用局限。
- `tests/`：评分单元测试和 Playwright 浏览器测试。
- `.github/workflows/deploy.yml`：GitHub Pages 构建发布。

修改题目后请运行测试；评分应该根据实际选择提供解释，不将未知经历算作冷淡、不把尊重边界等同于恋爱承诺。
