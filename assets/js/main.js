/* MirAI — Catálogo · interações leves (sem dependências) */
(function () {
  "use strict";

  /* Ano no rodapé */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* Navbar: estado "scrolled" */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  var close = document.getElementById("menuClose");
  function closeMenu() { if (menu) menu.classList.remove("open"); }
  if (toggle && menu) toggle.addEventListener("click", function () { menu.classList.add("open"); });
  if (close) close.addEventListener("click", closeMenu);
  if (menu) menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Contadores animados nos stats */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stats = document.querySelectorAll("[data-stat]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          var n = e.target.querySelector("[data-count]");
          if (n) animateCount(n);
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { sio.observe(s); });
  } else {
    stats.forEach(function (s) {
      s.classList.add("in");
      var n = s.querySelector("[data-count]");
      if (n) {
        var prefix = n.getAttribute("data-prefix") || "";
        var suffix = n.getAttribute("data-suffix") || "";
        n.textContent = prefix + (n.getAttribute("data-count") || "") + suffix;
      }
    });
  }
})();
