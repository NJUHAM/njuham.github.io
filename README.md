# NJU HAM · 南京大学学生业余无线电协会

> 把世界，调进南大。

南京大学学生业余无线电协会（NJU HAM）的社团主页。一个不需要构建、开箱即用的静态网站，可以直接部署到 GitHub Pages。

**线上地址：** <https://njuham.github.io/homepage/>

## 技术说明

- 纯 HTML + CSS + 原生 JavaScript，无框架、无依赖、无构建步骤。
- 响应式布局，支持桌面、平板与手机。
- 动效遵循 `prefers-reduced-motion`，并保留无 JavaScript 时的基本可读性。
- 所有资源均在仓库内，不加载第三方字体或追踪脚本。

## 页面结构

```text
.
├── index.html                 # 单页主页
├── 404.html                   # GitHub Pages 404 页面
├── .nojekyll                  # 跳过 Jekyll 处理
├── assets/
│   ├── css/style.css          # 全站样式与响应式规则
│   └── js/main.js             # 导航、频段切换、时钟、摩尔斯音频、复制群号
└── img/
    ├── mark-purple.svg        # 紫色协会标志
    ├── mark-white.svg         # 白色协会标志
    ├── poster-2026.webp       # 招新海报
    ├── charm.webp             # 亚克力周边图
    ├── join-qr.png            # 招新群二维码
    ├── og-cover.png           # 社交分享预览图（1200 × 630）
    └── favicon-*.png          # 站点图标
```

`img/` 中还保留了协会提供的原始 PNG / SVG 素材作为存档，页面只引用上表中的压缩版本。

## 本地预览

直接双击 `index.html` 也可浏览，但推荐启动一个本地静态服务器，以确保相对路径和剪贴板行为正常：

```bash
# Python 3
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `njuham-homepage`，并将本仓库推送到 `main` 分支。

   ```bash
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git branch -M main
   git push -u origin main
   ```

2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **Deploy from a branch**。
4. 分支选择 `main`，目录选择 `/ (root)`，保存。
5. 等待 Actions 完成，访问 `https://<你的用户名>.github.io/<仓库名>/`。

如果仓库名为 `<你的用户名>.github.io`，站点会直接部署在 `https://<你的用户名>.github.io/`。站内链接全部使用相对路径，两种部署方式都可以正常工作。

本仓库已启用 GitHub Pages（`main` 分支根目录），之后每次推送 `main` 都会自动重新发布。

> 当前 canonical、`og:image`、`twitter:image` 与结构化数据已指向 `https://njuham.github.io/homepage/`。如果以后更换自定义域名，请全局替换这些绝对地址。

## 常见维护

### 修改招新群号

群号出现在以下位置，修改时请一并更新：

- `index.html` 中 `#qqNumber` 的文本与 `data-copy="1098195189"`；
- `index.html` 中二维码卡片的 `alt` 与底部群号文本；
- `index.html` 页脚 `QQ · 1098195189`；
- `README.md`（本文档）。

### 更换招新二维码

替换 `img/join-qr.png` 即可。建议保留二维码四周的白色静区，尺寸比例尽量接近原图（357 × 276）。若比例变化明显，记得同步更新 `index.html` 中 `<img>` 的 `width`/`height`。

### 修改社交分享图

`img/og-cover.png` 是 1200 × 630 的分享预览图。`index.html` 中的分享图地址已使用当前线上的绝对地址：

```html
<meta property="og:image" content="https://njuham.github.io/homepage/img/og-cover.png">
<meta name="twitter:image" content="https://njuham.github.io/homepage/img/og-cover.png">
```

替换图片时保持文件名不变即可。若以后更换域名，请同步修改这两处以及 `canonical`、`og:url` 和结构化数据中的 `url` / `logo`。

### 更新活动与问答

- 活动卡片：`index.html` 中 `.activity-grid` 内的四个 `<article>`；
- 从零到 On Air 的路径：`.path-list`；
- 常见问题：`.faq-list` 中的 `<details>`；
- 频段演示数据：`assets/js/main.js` 顶部的 `bandData` 对象。

## 浏览器支持

面向现代浏览器（Chrome、Edge、Firefox、Safari 的近期版本）。摩尔斯音频使用 Web Audio API；不支持时会在页面上给出提示，不影响其他内容。

## License

[MIT](./LICENSE) © 2026 NJUHAM

---

73 DE NJU HAM · See you on the air.
