# 南京大学学生业余无线电协会

> 把世界，调进南大。

南京大学学生业余无线电协会（Nanjing University Student Amateur Radio Association）的社团主页。一个不需要构建、开箱即用的静态网站，可以直接部署到 GitHub Pages。

**线上地址：** <https://njuham.github.io/>

## 技术说明

- 纯 HTML + CSS + 原生 JavaScript，无框架、无依赖、无构建步骤。
- 大屏幕上是整屏翻页（paged view）：上下滚轮、触控板或右侧页码导航逐页浏览；窄屏和高度不足的窗口自动退回自然滚动，避免内容被裁切。
- 活动影集使用响应式图片网格，点击照片可打开灯箱，支持左右方向键切换。
- 响应式布局，支持桌面、平板与手机。
- 动效遵循 `prefers-reduced-motion`，并保留无 JavaScript 时的基本可读性。
- 所有资源均在仓库内，不加载第三方字体或追踪脚本。

## 页面结构

```text
.
├── index.html                 # 单页主页（封面 / 关于 / 日常 / 频段 / 影像 / 路径 / 文化 / 问答 / 加入）
├── 404.html                   # GitHub Pages 404 页面
├── .nojekyll                  # 跳过 Jekyll 处理
├── assets/
│   ├── css/style.css          # 全站样式、分页视图与响应式规则
│   └── js/main.js             # 翻页、灯箱、导航、频段切换、时钟、摩尔斯音频、复制群号
└── img/
    ├── mark-purple.svg        # 紫色协会标志
    ├── mark-white.svg         # 白色协会标志
    ├── poster-2026.webp       # 招新海报
    ├── charm.webp             # 亚克力周边图
    ├── gallery-*.webp         # 活动影集网格图
    ├── lightbox-*.webp        # 灯箱大图
    ├── join-qr.png            # 紫色招新群二维码（960 × 960）
    ├── og-cover.png           # 社交分享预览图（1200 × 630）
    └── favicon-*.png          # 站点图标
```

`img/` 中还保留了协会提供的原始 PNG / SVG 素材作为存档，页面只引用上表中的压缩版本。活动照片原图放在本地 `img/source/`（已在 `.gitignore` 中排除，不随仓库发布），网页只加载重新编码后的 WebP。

## 本地预览

直接双击 `index.html` 也可浏览，但推荐启动一个本地静态服务器，以确保相对路径和剪贴板行为正常：

```bash
# Python 3
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库。要部署到根路径，仓库名必须为 `<用户名>.github.io`；本仓库为 `NJUHAM/njuham.github.io`。

   ```bash
   git remote add origin https://github.com/<你的用户名>/<用户名>.github.io.git
   git branch -M main
   git push -u origin main
   ```

2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **Deploy from a branch**。
4. 分支选择 `main`，目录选择 `/ (root)`，保存。
5. 等待 Actions 完成，访问 `https://<你的用户名>.github.io/`。

如果仓库名不是 `<用户名>.github.io`，则会作为项目页面发布在 `https://<用户名>.github.io/<仓库名>/`。站内链接全部使用相对路径，两种部署方式都可以正常工作，但根路径部署的仓库名不能是 `homepage`。

本仓库已启用 GitHub Pages（`main` 分支根目录），之后每次推送 `main` 都会自动重新发布。

> 当前 canonical、`og:image`、`twitter:image` 与结构化数据已指向 `https://njuham.github.io/`。如果以后更换自定义域名，请全局替换这些绝对地址。

## 常见维护

### 修改招新群号

群号出现在以下位置，修改时请一并更新：

- `index.html` 中 `#qqNumber` 的文本与 `data-copy="1098195189"`；
- `index.html` 中二维码卡片的 `alt` 与底部群号文本；
- `index.html` 页脚 `QQ · 1098195189`；
- `README.md`（本文档）。

### 更换招新二维码

二维码由招新链接 <https://qm.qq.com/q/zmKcEZvmY8> 生成，配色为协会紫 `#630460` + 米白 `#fffaf0`。如果需要重新生成：

- 保持二维码四周至少 4 个模块的白色静区；
- 中心图案只覆盖小面积，并使用高容错等级（H）；
- 输出正方形 `img/join-qr.png`（当前 960 × 960），同步更新 `index.html` 中 `<img>` 的 `width` / `height`。

### 更新活动影集

- 网格图位于 `img/gallery-*.webp`：横版大卡为 1600 × 640，普通卡为 900 × 580；
- 灯箱图位于 `img/lightbox-*.webp`：长边 1600，保留完整构图；
- 在 `index.html` 的 `.gallery-grid` 中复制/替换 `.photo-card`，同时修改 `data-full`、`data-caption`、`alt` 和可见标题；
- 如果增删照片，灯箱的页码会自动按 `.photo-card` 数量更新，无需额外改 JS。

### 修改分页导航

分页视图在宽屏（≥ 1366px）且高度充足（≥ 900px）时启用，其他窗口自然滚动。若要增加或删除整页：

1. 给新的 `<section>` 加上 `class="page"`（深色页可加 `page-dark` 等现有样式类），并设置 `data-page`、`data-page-label`；
2. 同步增删 `#pagePager .pager-dots` 里的按钮，更新 `data-page-index`、`aria-label` 和总页数；
3. 在全站样式末尾的 paged 区块中检查该页在 900px 高度下是否放得下。

### 修改社交分享图

`img/og-cover.png` 是 1200 × 630 的分享预览图。`index.html` 中的分享图地址已使用当前线上的绝对地址：

```html
<meta property="og:image" content="https://njuham.github.io/img/og-cover.png">
<meta name="twitter:image" content="https://njuham.github.io/img/og-cover.png">
```

替换图片时保持文件名不变即可。若以后更换域名，请同步修改这两处以及 `canonical`、`og:url` 和结构化数据中的 `url` / `logo`。

### 更新活动与问答

- 活动卡片：`index.html` 中 `.activity-grid` 内的四个 `<article>`；
- 从零到 On Air 的路径：`.path-list`；
- 常见问题：`.faq-list` 中的 `<details>`；
- 频段演示数据：`assets/js/main.js` 顶部的 `bandData` 对象。

## 浏览器支持

面向现代浏览器（Chrome、Edge、Firefox、Safari 的近期版本）。整屏翻页使用 CSS Scroll Snap；灯箱使用原生 `<dialog>`；摩尔斯音频使用 Web Audio API。不支持这些能力时，页面仍会退回普通滚动和可读的内容布局。

## License

[MIT](./LICENSE) © 2026 Nanjing University Student Amateur Radio Association

---

73 · See you on the air.
