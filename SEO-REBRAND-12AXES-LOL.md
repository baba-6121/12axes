# 12axes.lol SEO 与品牌调整实施记录

## 目标

在不改动核心测评功能、结果算法、后端 API、首屏现有文案和第 3 屏现有文案的前提下，将站点的品牌与技术 SEO 统一到 `https://12axes.lol`。

核心关键词保留：

> Political Quiz and Ideology Test across 12 Axes

## 本轮范围

- 保留现有首屏 UI 结构和文案。
- 保留现有第 3 屏结果示例 UI 结构和文案。
- 保留测评流程、结果展示、匹配数据和 Railway API 对接。
- 调整站点名称、页脚和社交分享信息。
- 更新 title、description、canonical、hreflang、Open Graph、JSON-LD、sitemap 与 robots 的站点地址。
- 将原 `Support the project` 区域替换为政治画像维度说明区。
- 将原 `Open source / An independent, transparent project` 区域替换为结果解读指南区。
- 将旧域名引用从生产页面和生成页面源文件中清理为新域名。

## 明确不做

- 不重写首屏现有 H1、副标题、CTA 或示例卡片文案。
- 不重写第 3 屏现有标题、描述、匹配卡片文案或 CTA。
- 不重写题库、评分算法或后端 API。
- 不更换 Logo、favicon 或现有图标资产。
- 页面不展示个人 GitHub 用户名、仓库路径、钱包地址或原仓库入口。
- 不直接修改 `frontend/dist`；所有修改以源文件为准并通过构建生成。
- 第一阶段不迁移现有 `/` 与 `/en` 路由结构。

## 内容调整

### 政治画像维度说明区

原支持区改为 `Read your profile / What your political profile measures`，围绕政治测验结果会观察的五类维度提供解释：经济与所有权、权力与制度、文化与社会、国际视野、科技与未来。该区不再包含捐赠地址、加密货币、原版 `Support the project` 标识或任何仓库入口。

### 结果解读指南区

原开源区改为 `Interpreting the result / A political profile is more than a label`，保留四张卡片的视觉结构，但内容改为解释 12 个政治维度、跨维度匹配、混合观点与结果使用方式。底部 CTA 仅跳转到站内的测验版本选择和计分说明，不展示 GitHub、个人用户名或仓库地址。

葡萄牙语版本同步提供对应内容，保证双语页面的可索引内容和页面结构一致。

## 技术 SEO

- 英文页面 title 保留完整核心关键词：

  `Political Quiz and Ideology Test across 12 Axes | 12axes.lol`

- 站点 canonical、OG URL、JSON-LD URL、sitemap 和 robots 使用 `https://12axes.lol`。
- 生成页面统一使用站点配置，不在脚本中继续硬编码旧域名。
- 生产页面保留现有 `/` 和 `/en` 语言路径，避免第一阶段路由迁移风险。
- Railway `FRONTEND_ORIGINS` 加入 `https://12axes.lol`。

## 数据分析代码

- Microsoft Clarity 已加入，项目 ID：`yqyqv31blm`。
- Google Analytics 4 已配置，衡量 ID：`G-FDMHT7SPDC`。
- 两段代码写入 `frontend/index.html`，并同步写入静态页面生成脚本，覆盖首页、语言页、结果页、目录页和详情页。
- 已移除原先的 Google Analytics 衡量 ID，确保每个页面只保留一个 Google 代码配置。

## 验证标准

- `npm test` 通过。
- `npm run build` 通过。
- 生产生成页面不再引用旧站点 URL。
- 本地预览页已核对两块新区域的可见文本、站内 CTA 和导航标签。
- 当前只完成本地源文件和静态构建验证，尚未推送分支或部署 Cloudflare Pages/Railway。
- 部署后的 `https://12axes.lol` 返回 200、Railway `/api/health` 和题库接口连通性，留待部署阶段验证。
- 首屏和第 3 屏现有文案保持不变。
- Support 与 Open source 两个区域在英文和葡萄牙语下均有对应内容。

## 本次实施结果

- 分支：`feat/seo-rebrand-12axes-lol`。
- 已移除两个区域的捐赠地址、加密货币复制控件、GitHub 图标、个人用户名和仓库链接。
- 已保留原有两块区域的整体版式节奏：画像说明区继续使用双栏结构，结果解读区继续使用四张卡片和底部 CTA 结构。
- `npm test`：3 个测试文件、13 个测试全部通过。
- `npm run build`：构建通过，生成 1694 个双语页面及 sitemap/robots。
- 已检查生成的 1699 个 HTML 文件：全部包含 Clarity，全部包含新的 Google 代码，且没有旧 Google ID。
- Logo、favicon、首屏和第 3 屏未改动。
