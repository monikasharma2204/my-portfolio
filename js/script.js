/* ==========================================================================
   Monika Sharma — Portfolio
   Vanilla JS, no dependencies.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. EDIT HERE — project links and resume
   Leave a value as "" and its button shows as "soon" (disabled) instead of
   pointing at a broken link.
   -------------------------------------------------------------------------- */
const PROJECT_LINKS = {
  LIVE_PROJECT_1_URL: "https://eatwana.in/",
  GITHUB_PROJECT_1_URL: "https://github.com/monikasharma2204/eatwana",
  LIVE_PROJECT_2_URL: "https://fundlab-nine.vercel.app/",
  GITHUB_PROJECT_2_URL: "https://github.com/monikasharma2204/fundlab",
};

// Put your PDF in assets/resume/ and set the path, e.g.
// "assets/resume/Monika_Sharma_Resume.pdf"
const RESUME_URL = "assets/resume/Monika Sharma.pdf";

/* -------------------------------------------------------------------------- */

(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Loader + hero entrance ---------- */
  body.classList.add("is-loading");
  const loader = document.getElementById("loader");
  let started = false;

  function start() {
    if (started) return;
    started = true;
    if (loader) loader.classList.add("is-done");
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
  }
  window.addEventListener("load", () =>
    setTimeout(start, prefersReducedMotion ? 0 : 350),
  );
  setTimeout(start, 2500); // never hold the page hostage to a slow font/CDN

  /* ---------- Theme ---------- */
  const themeBtn = document.getElementById("theme-toggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, animate) {
    if (animate && !prefersReducedMotion) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 450);
    }
    root.setAttribute("data-theme", theme);
    if (metaTheme)
      metaTheme.setAttribute(
        "content",
        theme === "dark" ? "#0a0a0a" : "#ffffff",
      );
    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  applyTheme(
    root.getAttribute("data-theme") === "light" ? "light" : "dark",
    false,
  );

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next, true);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage blocked: theme still switches */
      }
    });
  }

  /* ---------- Project + resume links ---------- */
  function disableLink(el, reason) {
    el.removeAttribute("href");
    el.classList.add("is-disabled");
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("tabindex", "-1");
    el.setAttribute("title", reason);
  }

  document.querySelectorAll("[data-link]").forEach((el) => {
    const url = (PROJECT_LINKS[el.dataset.link] || "").trim();
    if (url) el.setAttribute("href", url);
    else disableLink(el, "Link coming soon");
  });

  document.querySelectorAll("[data-resume]").forEach((el) => {
    if (RESUME_URL.trim()) {
      el.setAttribute("href", RESUME_URL);
      el.setAttribute("download", "");
    } else {
      disableLink(el, "Resume coming soon");
    }
  });

  /* ---------- Project screenshot galleries ---------- */
  document.querySelectorAll(".project[data-shots]").forEach((project) => {
    const shots = project.dataset.shots
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!shots.length) return;

    const gallery = project.querySelector(".gallery");
    const mock = project.querySelector(".mock");
    const name =
      project.querySelector(".project__title")?.textContent.trim() || "Project";

    const main = document.createElement("img");
    main.className = "gallery__main";
    main.src = shots[0];
    main.alt = `${name} screenshot 1 of ${shots.length}`;
    main.loading = "lazy";
    gallery.appendChild(main);

    if (shots.length > 1) {
      const thumbs = document.createElement("div");
      thumbs.className = "gallery__thumbs";
      shots.forEach((src, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Show screenshot ${i + 1}`);
        if (i === 0) b.setAttribute("aria-current", "true");
        const t = document.createElement("img");
        t.src = src;
        t.alt = "";
        t.loading = "lazy";
        b.appendChild(t);
        b.addEventListener("click", () => {
          main.style.opacity = "0";
          setTimeout(() => {
            main.src = src;
            main.alt = `${name} screenshot ${i + 1} of ${shots.length}`;
            main.style.opacity = "1";
          }, 180);
          thumbs
            .querySelectorAll("button")
            .forEach((x) => x.removeAttribute("aria-current"));
          b.setAttribute("aria-current", "true");
        });
        thumbs.appendChild(b);
      });
      gallery.appendChild(thumbs);
    }

    // Only swap out the mockup once the first image actually loads.
    main.addEventListener(
      "load",
      () => {
        mock.hidden = true;
        gallery.hidden = false;
      },
      { once: true },
    );
  });

  /* ---------- Navbar: scrolled state + mobile menu ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const toTop = document.getElementById("to-top");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.style.overflow = open ? "hidden" : "";
  }
  navToggle.addEventListener("click", () =>
    setMenu(!nav.classList.contains("is-open")),
  );
  document
    .querySelectorAll("#nav-menu a")
    .forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  toTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  /* ---------- Active section highlight ---------- */
  const links = [...document.querySelectorAll(".nav__link")];
  const byId = new Map(links.map((l) => [l.getAttribute("href").slice(1), l]));
  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    links.forEach((l) => {
      const on = l === byId.get(id);
      l.classList.toggle("is-active", on);
      if (on) l.setAttribute("aria-current", "true");
      else l.removeAttribute("aria-current");
    });
  }

  // A thin band across the upper-middle of the viewport decides which section is "current".
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      }),
    { rootMargin: "-35% 0px -60% 0px" },
  );
  sections.forEach((s) => spy.observe(s));

  // The last section can be too short to reach the band — handle page bottom explicitly.
  window.addEventListener(
    "scroll",
    () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      )
        setActive("contact");
    },
    { passive: true },
  );

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  // Stagger siblings that reveal together (e.g. skill cards, stat cards).
  revealEls.forEach((el) => {
    const group = [...el.parentElement.children].filter((c) =>
      c.classList.contains("reveal"),
    );
    const i = group.indexOf(el);
    if (i > 0)
      el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 70}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealer = new IntersectionObserver(
      (entries, obs) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => revealer.observe(el));
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const counterObs = new IntersectionObserver(
      (entries, obs) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countUp(e.target);
          obs.unobserve(e.target);
        }),
      { threshold: 0.6 },
    );
    counters.forEach((c) => counterObs.observe(c));
  }

  /* ---------- Experience "View more" ---------- */
  document.querySelectorAll(".job__toggle").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    const label = btn.querySelector("span");
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      label.textContent = open ? "View more" : "View less";
    });
  });

  /* ---------- Copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied";
      } catch (e) {
        btn.textContent = "Press Ctrl+C";
        const a = btn.previousElementSibling;
        if (a) window.getSelection().selectAllChildren(a);
      }
      setTimeout(() => (btn.textContent = "Copy"), 1800);
    });
  });

  /* ---------- Contact form (frontend-only → mailto) ---------- */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const EMAIL_TO = "monika779803@gmail.com";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v.length < 2 ? "Please enter your name." : ""),
    email: (v) =>
      !v
        ? "Please enter your email."
        : !emailPattern.test(v)
          ? "That email doesn't look right."
          : "",
    message: (v) =>
      v.length < 10 ? "Please write a message (at least 10 characters)." : "",
  };

  function validateField(input) {
    const msg = rules[input.name](input.value.trim());
    const field = input.closest(".field");
    const err = field.querySelector(".field__error");
    field.classList.toggle("has-error", Boolean(msg));
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg;
    return !msg;
  }

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.value) validateField(input);
    });
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error"))
        validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("input, textarea")];
    const results = inputs.map(validateField);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      statusEl.textContent = "";
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const subject = `Portfolio enquiry from ${data.name.trim()}`;
    const bodyText = `${data.message.trim()}\n\n— ${data.name.trim()}\n${data.email.trim()}`;
    window.location.href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    statusEl.textContent =
      "Your email app should open with the message ready to send.";
  });

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Hero background: sparse drifting dots ---------- */
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  if (ctx && !prefersReducedMotion) {
    const hero = canvas.parentElement;
    let dots = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let rgb = "255,255,255";

    const readColor = () => {
      rgb =
        getComputedStyle(root)
          .getPropertyValue("--dot")
          .trim()
          .split(/\s+/)
          .join(",") || "255,255,255";
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 22000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.35 + 0.1,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -4) d.x = w + 4;
        else if (d.x > w + 4) d.x = -4;
        if (d.y < -4) d.y = h + 4;
        else if (d.y > h + 4) d.y = -4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${d.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    const play = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readColor();
    resize();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    new MutationObserver(readColor).observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Only animate while the hero is on screen and the tab is visible.
    let heroOnScreen = true;
    new IntersectionObserver(([e]) => {
      heroOnScreen = e.isIntersecting;
      heroOnScreen && !document.hidden ? play() : pause();
    }).observe(hero);
    document.addEventListener("visibilitychange", () =>
      document.hidden || !heroOnScreen ? pause() : play(),
    );
  }
})();
