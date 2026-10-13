/* ==========================================================================
   Zoha — UI/UX Designer Portfolio
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — edit contact details here.
   Leave a value as "" to hide that link on the page.
   -------------------------------------------------------------------------- */
const CONFIG = {
  email: "zoha32337@gmail.com",
  linkedin: "https://www.linkedin.com/in/your-profile",
  behance: "https://www.behance.net/your-profile",
  dribbble: "",                                     // empty = hidden
};

/* --------------------------------------------------------------------------
   PROJECTS — case study content shown in the modal.
   Keys match data-project / data-open attributes in index.html.
   -------------------------------------------------------------------------- */
const PROJECTS = {
  finora: {
    title: "Finora Dashboard",
    category: "Dashboard UI/UX Design",
    overview:
      "Finora is a design concept for a personal finance dashboard. The goal was to give people a calm, at-a-glance view of their money — balances, cash flow, and recent activity — without the visual noise common in financial tools.",
    challenge:
      "Financial data is dense and often stressful to read. The challenge was to present multiple accounts, trends, and transactions in a way that feels clear and reassuring, while still giving detail to those who want it.",
    approach:
      "I started by mapping the questions users most often ask of their finances, then prioritised the layout around them. A restrained palette, a strong typographic hierarchy, and a single accent colour guide attention to what matters most.",
    features: [
      "Summary cards for balance, income, and spending",
      "Income vs. spending chart with a simple time filter",
      "Recent transactions list with clear positive/negative cues",
      "Persistent sidebar navigation for core sections",
    ],
    ux: [
      "Most important figures placed top-left, following natural reading order",
      "Colour is never the only signal — labels and signs reinforce meaning",
      "Generous spacing to reduce cognitive load on dense screens",
      "Consistent components to make the interface quick to learn",
    ],
    caption: "Concept preview — desktop overview screen.",
  },
  bloom: {
    title: "Bloom Mobile App",
    category: "Mobile App Design",
    overview:
      "Bloom is a mobile app concept that helps people organise daily routines and build better habits through small, achievable steps and gentle visual feedback.",
    challenge:
      "Many habit apps feel demanding or guilt-inducing. The challenge was to design an experience that motivates without pressure, and stays simple enough to use every day in a few seconds.",
    approach:
      "I focused on a calm colour palette, a single daily progress indicator, and quick-to-scan task cards. Interactions were kept to one tap wherever possible, so checking off a habit feels effortless.",
    features: [
      "Daily progress ring showing completed habits at a glance",
      "Weekly streak view with today clearly highlighted",
      "Task cards with time or quantity context",
      "One-tap completion and a quick-add button",
    ],
    ux: [
      "Thumb-friendly layout with primary actions in easy reach",
      "Encouraging, non-judgmental microcopy",
      "Soft, calm colours to keep the experience low-stress",
      "Clear completed vs. pending states beyond colour alone",
    ],
    caption: "Concept preview — home and daily routine screens.",
  },
  studio: {
    title: "Studio Digital Website",
    category: "Website UI/UX Design",
    overview:
      "Studio Digital is a website concept for a creative studio. It explores how bold typography and an editorial layout can communicate a studio's personality while guiding visitors toward its work and contact.",
    challenge:
      "Studio websites often prioritise visuals over clarity, leaving visitors unsure where to go next. The challenge was to keep the site expressive while making the user journey obvious.",
    approach:
      "I built the page around a strong typographic statement, followed by a clear project grid and a single, consistent call to action. Minimal navigation keeps focus on the work itself.",
    features: [
      "Large typographic hero that sets the studio's tone",
      "Project grid organised by discipline",
      "Minimal navigation with a persistent contact action",
      "Dark, high-contrast theme with a single accent colour",
    ],
    ux: [
      "Clear path from first impression to work to contact",
      "Readable type sizes and strong contrast on a dark theme",
      "Layout that adapts gracefully from desktop to mobile",
      "Imagery framed consistently to keep the grid calm",
    ],
    caption: "Concept preview — landing page.",
  },
};

/* ========================================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setYear();
  initHeader();
  initMobileMenu();
  initActiveLinks();
  initReveal();
  initHeroParallax();
  initProjectModal();
  initContactForm();
  initToTop();
});

/* Contact links from CONFIG */
function applyConfig() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    const value = CONFIG[key];
    if (!value) {
      (el.closest("li") || el).remove();
      return;
    }
    el.href = key === "email" ? `mailto:${value}` : value;
    if (key !== "email") el.setAttribute("aria-label", `${el.textContent.trim()} profile (opens in a new tab)`);
  });
  document.querySelectorAll("[data-config-text]").forEach((el) => {
    const value = CONFIG[el.dataset.configText];
    if (value) el.textContent = value;
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* Sticky header background once the page is scrolled */
function initHeader() {
  const header = document.getElementById("site-header");
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Mobile menu: open/close, Escape, focus handling */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const header = document.getElementById("site-header");
  if (!toggle || !menu) return;

  let closeTimer;

  const open = () => {
    clearTimeout(closeTimer);
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("is-open")));
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    header.classList.add("menu-open");
    document.body.classList.add("is-locked");
  };

  const close = ({ returnFocus = false } = {}) => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    header.classList.remove("menu-open");
    document.body.classList.remove("is-locked");
    closeTimer = setTimeout(() => { menu.hidden = true; }, prefersReducedMotion ? 0 : 400);
    if (returnFocus) toggle.focus();
  };

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => close()));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close({ returnFocus: true });
  });

  // Close if the viewport grows past the mobile breakpoint
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
    if (e.matches && isOpen()) close();
  });
}

/* Highlight the nav link for the section in view */
function initActiveLinks() {
  const links = document.querySelectorAll(".nav-link");
  const map = new Map();
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) map.set(section, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
        const active = map.get(entry.target);
        active.classList.add("is-active");
        active.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  map.forEach((_, section) => observer.observe(section));
}

/* Fade-up on scroll, with a small stagger for siblings revealed together */
function initReveal() {
  const targets = document.querySelectorAll(".reveal, .steps");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      visible.forEach((entry, i) => {
        entry.target.style.setProperty("--stagger", `${Math.min(i, 5) * 0.08}s`);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}

/* Subtle pointer-driven depth on hero mockups (desktop pointers only) */
function initHeroParallax() {
  const canvas = document.querySelector("[data-parallax]");
  if (!canvas || prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const layers = canvas.querySelectorAll("[data-depth]");
  const hero = document.querySelector(".hero");
  let frame;

  hero.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth) * 14;
        layer.style.transform = `translate3d(${(-x * depth).toFixed(2)}px, ${(-y * depth).toFixed(2)}px, 0)`;
      });
    });
  });

  hero.addEventListener("pointerleave", () => {
    layers.forEach((layer) => { layer.style.transform = ""; });
  });
}

/* Case study modal (native <dialog> handles focus trapping and Escape) */
function initProjectModal() {
  const modal = document.getElementById("project-modal");
  const body = document.getElementById("modal-body");
  const titleEl = document.getElementById("modal-title");
  const categoryEl = document.getElementById("modal-category");
  if (!modal || typeof modal.showModal !== "function") return;

  let lastTrigger = null;

  const listItems = (items) => items.map((item) => `<li>${item}</li>`).join("");

  const openProject = (key, trigger) => {
    const data = PROJECTS[key];
    if (!data) return;
    lastTrigger = trigger;

    titleEl.textContent = data.title;
    categoryEl.textContent = data.category;
    body.innerHTML = `
      <p class="case-overview">${data.overview}</p>
      <div class="case-grid">
        <section class="case-block"><h3>Design challenge</h3><p>${data.challenge}</p></section>
        <section class="case-block"><h3>Design approach</h3><p>${data.approach}</p></section>
        <section class="case-block"><h3>Key features</h3><ul class="case-list">${listItems(data.features)}</ul></section>
        <section class="case-block"><h3>User experience considerations</h3><ul class="case-list">${listItems(data.ux)}</ul></section>
      </div>
      <section class="case-block case-preview">
        <h3>Final concept preview</h3>
        <div class="case-preview-slot"></div>
        <p class="case-caption">${data.caption}</p>
      </section>`;

    // Reuse the card's handcrafted preview so both views stay in sync
    const preview = document.querySelector(`[data-project="${key}"] .project-preview`);
    if (preview) body.querySelector(".case-preview-slot").appendChild(preview.cloneNode(true));

    modal.classList.remove("is-closing");
    modal.showModal();
    body.scrollTop = 0;
    document.body.classList.add("is-locked");
  };

  const closeModal = () => {
    if (!modal.open) return;
    if (prefersReducedMotion) {
      modal.close();
      return;
    }
    modal.classList.add("is-closing");
    setTimeout(() => {
      modal.classList.remove("is-closing");
      modal.close();
    }, 240);
  };

  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openProject(btn.dataset.open, btn));
  });

  modal.querySelector(".modal-close").addEventListener("click", closeModal);

  // Click on backdrop closes
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Intercept Escape to play the closing animation
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeModal();
  });

  modal.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    if (lastTrigger) lastTrigger.focus();
  });
}

/* Contact form — validates, then opens the visitor's email app.
   No message is sent from the site itself; connect a backend or a form
   service (e.g. Formspree) here if you want real submissions. */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please write a short message (at least 10 characters)."),
  };

  const validateField = (input) => {
    const message = rules[input.name](input.value);
    const field = input.closest(".field");
    field.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    field.querySelector(".field-error").textContent = message;
    return !message;
  };

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => { if (input.value) validateField(input); });
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("input, textarea")];
    const results = inputs.map(validateField);
    status.className = "form-status";

    if (results.includes(false)) {
      status.textContent = "Please fix the highlighted fields and try again.";
      status.classList.add("is-error");
      inputs[results.indexOf(false)].focus();
      return;
    }

    if (!CONFIG.email) {
      status.textContent = "Email isn't configured yet — please use one of the links on this page.";
      status.classList.add("is-error");
      return;
    }

    const { name, email, message } = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`Project enquiry from ${name.trim()}`);
    const bodyText = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()} (${email.trim()})`);
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${bodyText}`;

    status.textContent = "Your email app should open with this message ready to send. Nothing has been sent yet.";
    status.classList.add("is-success");
  });
}

/* Floating scroll-to-top button */
function initToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  const update = () => btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.9);
  update();
  window.addEventListener("scroll", update, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    document.querySelector(".wordmark").focus({ preventScroll: true });
  });
}
