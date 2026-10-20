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
