(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Sticky nav + depth meter ---------- */
  const nav = $("#nav");
  const depth = $(".depth");
  const depthFill = $("#depthFill");
  const depthVal = $("#depthVal");
  const MAX_DEPTH = 60; // metres shown at page bottom

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 20);
    if (y < 200) document.querySelectorAll(".nav__links a.is-active").forEach((a) => a.classList.remove("is-active"));

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, y / max) : 0;
    if (depth) {
      depth.classList.toggle("is-on", y > window.innerHeight * 0.5);
      depthFill.style.height = pct * 100 + "%";
      depthVal.textContent = Math.round(pct * MAX_DEPTH) + " m";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 960) setMenu(false); });

  /* ---------- Active nav link ---------- */
  const sectionLinks = $$('.nav__links a[href^="#"]:not(.btn)');
  const sections = sectionLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Bubbles ---------- */
  const bubbles = $("#bubbles");
  if (bubbles && !reduceMotion) {
    const count = window.innerWidth < 640 ? 14 : 28;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      const size = 4 + Math.random() * 14;
      b.className = "bubble";
      b.style.width = b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.animationDuration = 8 + Math.random() * 12 + "s";
      b.style.animationDelay = -Math.random() * 20 + "s";
      bubbles.appendChild(b);
    }
  }

  /* ---------- Gauge ticks ---------- */
  const ticks = $(".gauge__ticks");
  if (ticks) {
    const ns = "http://www.w3.org/2000/svg";
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const r1 = 76, r2 = i % 5 === 0 ? 70 : 73;
      const l = document.createElementNS(ns, "line");
      l.setAttribute("x1", 100 + Math.cos(a) * r1);
      l.setAttribute("y1", 100 + Math.sin(a) * r1);
      l.setAttribute("x2", 100 + Math.cos(a) * r2);
      l.setAttribute("y2", 100 + Math.sin(a) * r2);
      ticks.appendChild(l);
    }
  }

  /* ---------- Counters ---------- */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  const counters = $$("[data-count]");
  const gauge = $(".gauge");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // stagger siblings in grids
        const siblings = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [];
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(idx, 6) * 70 + "ms";
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));

    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        if (gauge && gauge.contains(entry.target)) gauge.classList.add("is-on");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => co.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    counters.forEach((el) => (el.textContent = el.dataset.count));
    if (gauge) gauge.classList.add("is-on");
  }

  /* ---------- Service filter ---------- */
  const tabs = $$(".tab");
  const cards = $$("#serviceCards .card");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const f = tab.dataset.filter;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      cards.forEach((c) => {
        const show = f === "all" || c.dataset.cat === f;
        c.classList.toggle("is-hidden", !show);
        if (show) c.classList.add("is-visible");
      });
    });
  });

  /* ---------- Card spotlight ---------- */
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------- FAQ: one open at a time ---------- */
  const details = $$(".accordion details");
  details.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) details.forEach((o) => { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Quote form ---------- */
  const form = $("#quoteForm");
  const note = $("#formNote");
  const PHONE = "923036504471";
  const EMAIL = "atlantic.divers@yahoo.com";
  let via = "email";

  $$('button[type="submit"]', form).forEach((btn) => {
    btn.addEventListener("click", () => { via = btn.dataset.via; });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;
    $$("[required]", form).forEach((field) => {
      const ok = field.value.trim().length > 0;
      field.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });
    const email = form.elements.email;
    if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
      email.classList.add("is-invalid");
      valid = false;
    }
    if (!valid) {
      note.textContent = "Please fill in your name, phone and project details.";
      note.className = "form__note is-error";
      return;
    }

    const lines = [
      "Quote request: Atlantic Divers",
      "",
      "Name: " + data.name,
      data.company ? "Organisation: " + data.company : null,
      "Phone: " + data.phone,
      data.email ? "Email: " + data.email : null,
      "Service: " + data.service,
      "",
      "Project details:",
      data.message,
    ].filter((l) => l !== null).join("\n");

    if (via === "whatsapp") {
      window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines), "_blank", "noopener");
      note.textContent = "Opening WhatsApp with your message…";
    } else {
      const subject = "Quote request: " + data.service + " (" + data.name + ")";
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines);
      note.textContent = "Opening your email app with your message…";
    }
    note.className = "form__note is-ok";
  });

  $$("input, textarea", form).forEach((f) => f.addEventListener("input", () => f.classList.remove("is-invalid")));
})();
