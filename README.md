# Nicholas Shu — 三语个人学术网站源码

纯 HTML、CSS、JavaScript 静态网站，无构建步骤。

## 使用

解压后打开 `index.html`，或通过静态文件服务器预览。上线时，将压缩包内的文件和目录按原结构一起上传。

页眉语言选择器支持中文、English、日本語。选择会保存到浏览器，站内链接同时携带 `lang` 参数，例如：

- `index.html?lang=ja`：日语首页
- `cv.html?lang=ja`：日语履历书
- `cv.html?lang=en`：英文简历

## 文件

- `index.html`：首页
- `about.html`：个人介绍
- `research.html`：研究介绍
- `blog.html`、`posts/*.html`：博客列表和文章；日语版包含数学文章正文，保留原有公式
- `contact.html`：联系页
- `cv.html`：中文、英文、日文 HTML 简历
- `cv-source.tex`：按用户提供内容更新的英文 LaTeX 简历源代码；可用 XeLaTeX 编译，字体为 TeX Gyre Termes
- `cv-sources/zh/main.tex`、`cv-sources/en/main.tex`、`cv-sources/ja/main.tex`：同步新增奖项后的三语 LaTeX 源码；对应的中、英、日 CV 压缩包也已更新
- `style.css`、`script.js`：全站样式与交互
- `image/`、`favicon.jpg`、`posts/*.pdf`：原有图片与阅读材料

## 简历内容

HTML 简历已按提供的 LaTeX 内容更新，包括科研开始时间为 2026 年 9 月、丘成桐数学夏令营年份为 2023、个人主页链接为 https://nicholasshu.com。
新增荣誉：2026 年中国科学技术大学 Robogame 比赛第一名、2025 年 CMC 数学竞赛省二等奖、2025 年学校九章杯三等奖；已同步三语 HTML 和 LaTeX 源码。
“下载简历”按钮保留在姓名右侧，点击后选择中文、英文或日文 PDF。

本次交付为网站及 LaTeX 源码。`中文CV.pdf`、`英文CV.pdf`、`日文CV.pdf` 和学术论文 PDF 保留原文件，没有重新编译或翻译；若要同步下载文件，请编译或更新相应 PDF 后替换。

## 维护

各页使用 `data-lang="zh"`、`data-lang="en"`、`data-lang="ja"` 分别保存三语内容，页面标题通过 `data-title-*` 设置。
简历专用样式与 HTML 放在同一文件中，避免旧共享 CSS 缓存导致排版失效。更新共享样式或脚本时，同时更新各 HTML 引用中的版本参数。

Google Fonts 与 MathJax 使用原有在线加载方式；首次显示字体和公式需要网络连接。

## 2026-10 英文博客与视觉更新

- 五篇 Evans 阅读笔记已补齐英文正文、例题、公式和推导说明，第一篇博客也补齐英文内容。博客列表使用具体主题标题，并标识 PDF 阅读材料。保留原有 `Evens` 文件名以兼容旧链接，展示名称统一为 Evans。
- 英文正文是整理补写版：修正了热核指数、非齐次项、球面平均半径等明显笔误，并补充 Harnack 不等式的非负条件、热方程最大值原理的时间方向和唯一性所需条件。中日文原正文与原 PDF 未做全面数学校订或重新翻译。
- 相关公式交叉参考：[Stanford 热方程讲义](https://web.stanford.edu/class/math220b/handouts/heateqn.pdf)、[高维波动方程讲义](https://web.stanford.edu/class/math220a/handouts/waveequation3.pdf)。主要内容仍依据站内原始读书笔记整理。
- 首页改用暖白／深绿视觉、SVG 动态几何图形、鼠标视差和滚动入场。动画可暂停，系统启用“减少动态效果”时自动降级；无 JavaScript 时正文仍可见。
- 文章增加可折叠目录与阅读进度；目录随中文、英文、日文切换重建。移动菜单支持 Escape 关闭。
- 所有页面的共享资源版本更新为 `20261022-refresh1`。仍为纯静态网站，无构建依赖。
