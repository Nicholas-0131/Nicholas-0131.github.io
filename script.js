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
  function getLang() {
    return root.getAttribute("data-lang") === "en" ? "en" : "zh";
  }

  function applyLang(lang) {
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);
    var t = root.getAttribute("data-title-" + lang);
    if (t) document.title = t;
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  var langToggles = document.querySelectorAll(".lang-toggle");
  langToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(getLang() === "zh" ? "en" : "zh");
    });
  });

  // Ensure title is set correctly on first paint.
  applyLang(getLang());

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
          (lang === "en" ? "Copied" : "已复制");
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
