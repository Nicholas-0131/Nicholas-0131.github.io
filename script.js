(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme ---------- */
  function getTheme() {
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  var themeToggles = document.querySelectorAll(".theme-toggle");
  themeToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });

  /* ---------- Language ---------- */
  var languages = ["zh", "en", "ja"];
  var labels = {
    zh: { language: "选择语言", theme: "切换主题", menu: "菜单", nav: "主导航", copied: "已复制" },
    en: { language: "Choose language", theme: "Toggle theme", menu: "Menu", nav: "Primary", copied: "Copied" },
    ja: { language: "言語を選択", theme: "テーマを切り替え", menu: "メニュー", nav: "メインナビゲーション", copied: "コピーしました" }
  };

  function getLang() {
    var lang = root.getAttribute("data-lang");
    return languages.indexOf(lang) !== -1 ? lang : "en";
  }

  function applyLang(lang) {
    if (languages.indexOf(lang) === -1) lang = "en";
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;
    document.querySelectorAll(".lang-select").forEach(function (select) {
      select.value = lang;
      select.setAttribute("aria-label", labels[lang].language);
    });
    [[".theme-toggle", "theme"], [".nav-toggle", "menu"], [".nav", "nav"]].forEach(function (item) {
      document.querySelectorAll(item[0]).forEach(function (element) {
        element.setAttribute("aria-label", labels[lang][item[1]]);
      });
    });
    // Explicit language links also work when browser storage is unavailable.
    document.querySelectorAll("a[href]").forEach(function (link) {
      if (link.hasAttribute("download")) return;
      try {
        var target = new URL(link.getAttribute("href"), window.location.href);
        if (target.origin !== window.location.origin || !/\.html$/.test(target.pathname)) return;
        target.searchParams.set("lang", lang);
        // Retain relative paths so the site can be moved to any hosting subdirectory.
        var href = link.getAttribute("href").split(/[?#]/)[0];
        link.setAttribute("href", href + target.search + target.hash);
      } catch (e) {}
    });
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.href);
    } catch (e) {}
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("site:language", { detail: lang }));
  }

  document.querySelectorAll(".lang-select").forEach(function (select) {
    select.addEventListener("change", function () { applyLang(select.value); });
  });

  applyLang(getLang());

  /* ---------- CV language picker ---------- */
  var cvTrigger = document.getElementById("cv-download-trigger");
  var cvDialog = document.getElementById("cv-dialog");
  if (cvTrigger && cvDialog) {
    cvTrigger.addEventListener("click", function () {
      cvDialog.showModal();
    });
    cvDialog.addEventListener("click", function (event) {
      if (event.target !== cvDialog) return;
      var bounds = cvDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        cvDialog.close();
      }
    });
    cvDialog.querySelectorAll("a[download]").forEach(function (link) {
      link.addEventListener("click", function () { cvDialog.close(); });
    });
  }

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Article navigation and reading progress ---------- */
  var article = document.querySelector(".article");
  if (article) {
    var tocLabels = { zh: "本文目录", en: "On this page", ja: "目次" };
    var toc = document.createElement("details");
    toc.className = "article-toc";
    function buildContents() {
      var lang = getLang();
      var sections = article.querySelectorAll('div[data-lang="' + lang + '"] h2');
      toc.replaceChildren();
      toc.hidden = sections.length === 0;
      if (!sections.length) return;
      var summary = document.createElement("summary");
      summary.textContent = tocLabels[lang];
      var list = document.createElement("ol");
      sections.forEach(function (heading, index) {
        heading.id = "section-" + lang + "-" + (index + 1);
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + heading.id;
        link.textContent = heading.textContent.trim();
        item.appendChild(link);
        list.appendChild(item);
      });
      toc.append(summary, list);
    }
    var articleHeader = article.querySelector(".article-header");
    if (articleHeader) articleHeader.after(toc);
    buildContents();
    document.addEventListener("site:language", buildContents);
    var progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);
    var progressQueued = false;
    function updateProgress() {
      progressQueued = false;
      var start = article.getBoundingClientRect().top + window.scrollY;
      var range = Math.max(1, article.offsetHeight - window.innerHeight);
      var value = Math.min(1, Math.max(0, (window.scrollY - start) / range));
      progress.style.transform = "scaleX(" + value + ")";
    }
    function queueProgress() {
      if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
    }
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress);
    document.addEventListener("site:language", queueProgress);
    if ("ResizeObserver" in window) new ResizeObserver(queueProgress).observe(article);
    queueProgress();
  }

  /* ---------- Progressive motion: content stays visible without JS ---------- */
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".home-page .section, .post-list > article, .r-block, .project, .tl-item").forEach(function (element) {
      element.classList.add("reveal", "reveal-pending");
      revealObserver.observe(element);
    });
    reducedMotion.addEventListener("change", function (event) {
      if (event.matches) {
        document.querySelectorAll(".reveal-pending").forEach(function (el) { el.classList.remove("reveal-pending"); });
        revealObserver.disconnect();
      }
    });
  }
  var scene = document.querySelector(".geometry-scene");
  if (scene) {
    var hero = document.querySelector(".hero");
    var pause = document.createElement("button");
    pause.type = "button";
    pause.className = "motion-toggle";
    pause.setAttribute("aria-pressed", "false");
    function motionLabel() {
      var paused = hero.classList.contains("motion-paused");
      var names = { zh: ["暂停动画", "播放动画"], en: ["Pause motion", "Play motion"], ja: ["動きを停止", "動きを再生"] };
      pause.textContent = names[getLang()][paused ? 1 : 0];
      pause.setAttribute("aria-pressed", String(paused));
    }
    pause.addEventListener("click", function () { hero.classList.toggle("motion-paused"); motionLabel(); });
    document.addEventListener("site:language", motionLabel);
    motionLabel();
    hero.appendChild(pause);
    hero.addEventListener("pointermove", function (event) {
      if (reducedMotion.matches || hero.classList.contains("motion-paused") || event.pointerType !== "mouse") return;
      var bounds = scene.getBoundingClientRect();
      var x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      var y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      scene.style.setProperty("--scene-x", (-y * 8) + "deg");
      scene.style.setProperty("--scene-y", (x * 8) + "deg");
    });
    hero.addEventListener("pointerleave", function () {
      scene.style.setProperty("--scene-x", "0deg");
      scene.style.setProperty("--scene-y", "0deg");
    });
  }

  /* ---------- Copy email buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var lang = getLang();
      var el = btn.querySelector('[data-lang="' + lang + '"]') || btn;
      var original = el.textContent;
      function done() {
        el.textContent = btn.getAttribute("data-copied-" + lang) ||
          labels[lang].copied;
        setTimeout(function () { el.textContent = original; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () { fallbackCopy(value, done); });
      } else {
        fallbackCopy(value, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }
})();
