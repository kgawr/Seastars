/* ==========================================================================
   Seastars Education Centre — site script
   Handles: language switching (en/es/ca), mobile nav, mobile dropdown.
   Depends on TRANSLATIONS from js/translations.js
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "seastars-lang";
  const SUPPORTED = ["en", "es", "ca"];
  const DEFAULT_LANG = "es"; // L'Ampolla is in Spain — Spanish is the default

  /* ---------- language ---------- */

  function detectInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;

    const browserLang = (navigator.language || "es").slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browserLang)) return browserLang;

    return DEFAULT_LANG;
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    const dict = (window.TRANSLATIONS || {})[lang] || {};

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.innerHTML = dict[key];
      }
    });

    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
    applyLang(detectInitialLang());
  }

  /* ---------- mobile nav ---------- */

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu after tapping a link (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 800) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // On small screens, tapping "Programmes" opens the dropdown instead of
    // navigating straight away, since dropdowns aren't hover-driven there.
    const dropdownParent = nav.querySelector(".has-dropdown");
    if (dropdownParent) {
      const topLink = dropdownParent.querySelector(":scope > a");
      topLink.addEventListener("click", function (e) {
        if (window.innerWidth <= 800) {
          if (!dropdownParent.classList.contains("open")) {
            e.preventDefault();
            dropdownParent.classList.add("open");
          }
        }
      });
    }
  }

  /* ---------- header shadow on scroll ---------- */

  function initHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;
    let lastState = false;
    window.addEventListener("scroll", function () {
      const shouldShadow = window.scrollY > 8;
      if (shouldShadow !== lastState) {
        header.style.boxShadow = shouldShadow ? "0 8px 24px -18px rgba(11,61,66,0.5)" : "none";
        lastState = shouldShadow;
      }
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initMobileNav();
    initHeaderScroll();
  });
})();
