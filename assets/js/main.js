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

  /* ---------- Hero: animação de tecnologia/automação (rede de nós) -------- */
  (function heroFx() {
    var canvas = document.getElementById("heroFx");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var hero = canvas.parentElement;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], pulses = [], raf = null, visible = true;
    var GREEN = "132,232,14", EMERALD = "0,210,106";

    function size() {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(28, Math.min(64, Math.round((W * H) / 26000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.8
        });
      }
    }

    function spawnPulse() {
      if (nodes.length < 2) return;
      var a = (Math.random() * nodes.length) | 0, b = (Math.random() * nodes.length) | 0;
      if (a === b) return;
      pulses.push({ a: a, b: b, t: 0, sp: 0.012 + Math.random() * 0.02 });
    }

    var LINK = 140;
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, n, m, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      /* conexões */
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          m = nodes[j]; dx = n.x - m.x; dy = n.y - m.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = "rgba(" + GREEN + "," + (0.10 * (1 - d / LINK)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      /* nós */
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.fillStyle = "rgba(" + GREEN + ",0.55)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill();
      }
      /* pulsos de automação viajando pelas conexões */
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i]; p.t += p.sp;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        n = nodes[p.a]; m = nodes[p.b];
        if (!n || !m) { pulses.splice(i, 1); continue; }
        var px = n.x + (m.x - n.x) * p.t, py = n.y + (m.y - n.y) * p.t;
        ctx.fillStyle = "rgba(" + EMERALD + "," + (0.9 * (1 - Math.abs(0.5 - p.t) * 2)).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    var pulseTimer = setInterval(function () { if (visible && pulses.length < 6) spawnPulse(); }, 900);
    frame();

    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    /* pausa quando o hero sai da tela */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        if (visible && !raf) frame();
        else if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
      }, { threshold: 0 }).observe(hero);
    }
  })();

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
