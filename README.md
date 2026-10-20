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
- `cv-source.tex`：用户提供的英文 LaTeX 简历源代码；可用 XeLaTeX 编译，字体为 TeX Gyre Termes
- `style.css`、`script.js`：全站样式与交互
- `image/`、`favicon.jpg`、`posts/*.pdf`：原有图片与阅读材料

## 简历内容

HTML 简历已按提供的 LaTeX 内容更新，包括科研开始时间为 2026 年 9 月、丘成桐数学夏令营年份为 2023、个人主页链接为 https://nicholasshu.com。
“下载简历”按钮保留在姓名右侧，点击后选择中文或英文 PDF。

本次交付为网站及 LaTeX 源码。`中文CV.pdf`、`英文CV.pdf` 和学术论文 PDF 保留原文件，没有重新编译或翻译；若要同步下载文件，请编译或更新相应 PDF 后替换。

## 维护

各页使用 `data-lang="zh"`、`data-lang="en"`、`data-lang="ja"` 分别保存三语内容，页面标题通过 `data-title-*` 设置。
简历专用样式与 HTML 放在同一文件中，避免旧共享 CSS 缓存导致排版失效。更新共享样式或脚本时，同时更新各 HTML 引用中的版本参数。

Google Fonts 与 MathJax 使用原有在线加载方式；首次显示字体和公式需要网络连接。
