/* =========================================================
   Bicharix Code Labs — site script
   Theme toggle · mobile nav · scroll reveal · testimonials
   paginator · contact form · footer year
   ========================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------
     Theme toggle (persisted in localStorage)
     ----------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "bicharix-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* -----------------------------------------------------
     Mobile nav toggle
     ----------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -----------------------------------------------------
     Scroll reveal (AOS-style, via IntersectionObserver)
     ----------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -----------------------------------------------------
     Testimonials data + paginator
     ----------------------------------------------------- */
  const testimonials = [
    {
      quote:
        "Bicharix picked up our half-built admin panel and shipped it faster than the agency we'd been waiting on for months.",
      name: "Aarav Shrestha",
      role: "Founder, Retail SaaS startup",
      initials: "AS",
    },
    {
      quote:
        "They asked better questions about our workflow than anyone we'd talked to before, and it showed in the final product.",
      name: "Priya Karki",
      role: "Operations Lead, Logistics firm",
      initials: "PK",
    },
    {
      quote:
        "Our new site loads instantly and started ranking for terms we'd been stuck on for a year. Straightforward, no fluff.",
      name: "Diwas Rana",
      role: "Marketing Manager, D2C brand",
      initials: "DR",
    },
    {
      quote:
        "We needed extra hands on a tight deadline. They slotted into our sprint process on day one, no ramp-up time wasted.",
      name: "Sujata Gurung",
      role: "CTO, Fintech startup",
      initials: "SG",
    },
    {
      quote:
        "Transparent about scope and cost from the first call. No surprise invoices, no vanishing after launch.",
      name: "Nabin Thapa",
      role: "Director, Hospitality group",
      initials: "NT",
    },
    {
      quote:
        "Clean, maintainable code and clear documentation — our own team could pick up where they left off without friction.",
      name: "Anisha Maharjan",
      role: "Product Manager, EdTech platform",
      initials: "AM",
    },
  ];

  const track = document.getElementById("testimonialsTrack");
  const dotsWrap = document.getElementById("pagerDots");
  const prevBtn = document.getElementById("pagerPrev");
  const nextBtn = document.getElementById("pagerNext");

  if (track && dotsWrap && prevBtn && nextBtn) {
    let perPage = getPerPage();
    let page = 0;
    let pageCount = Math.ceil(testimonials.length / perPage);

    function getPerPage() {
      const w = window.innerWidth;
      if (w <= 760) return 1;
      if (w <= 980) return 2;
      return 3;
    }

    function starRow() {
      return '<span class="t-stars" aria-hidden="true">★★★★★</span>';
    }

    function renderPage() {
      pageCount = Math.ceil(testimonials.length / perPage);
      if (page > pageCount - 1) page = pageCount - 1;
      if (page < 0) page = 0;

      const start = page * perPage;
      const items = testimonials.slice(start, start + perPage);

      track.innerHTML = items
        .map(function (t) {
          return (
            '<article class="testimonial-card">' +
            starRow() +
            "<blockquote>&ldquo;" + t.quote + "&rdquo;</blockquote>" +
            '<div class="t-author">' +
            '<div class="t-avatar" aria-hidden="true">' + t.initials + "</div>" +
            "<div>" +
            '<p class="t-name">' + t.name + "</p>" +
            '<p class="t-role">' + t.role + "</p>" +
            "</div>" +
            "</div>" +
            "</article>"
          );
        })
        .join("");

      renderDots();
      prevBtn.disabled = page === 0;
      nextBtn.disabled = page === pageCount - 1;
    }

    function renderDots() {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "pager-dot" + (i === page ? " active" : "");
        dot.setAttribute("aria-label", "Go to testimonials page " + (i + 1));
        dot.addEventListener("click", function () {
          page = i;
          renderPage();
        });
        dotsWrap.appendChild(dot);
      }
    }

    prevBtn.addEventListener("click", function () {
      if (page > 0) {
        page -= 1;
        renderPage();
      }
    });

    nextBtn.addEventListener("click", function () {
      if (page < pageCount - 1) {
        page += 1;
        renderPage();
      }
    });

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        const next = getPerPage();
        if (next !== perPage) {
          perPage = next;
          page = 0;
          renderPage();
        }
      }, 150);
    });

    renderPage();
  }

  /* -----------------------------------------------------
     Contact form (client-side only — wire to a backend
     or a form service like Formspree when ready)
     ----------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const projectType = document.getElementById("projectType");
      const message = document.getElementById("message");

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !name.value.trim() ||
        !emailPattern.test(email.value.trim()) ||
        !projectType.value ||
        !message.value.trim()
      ) {
        formStatus.textContent =
          "Please fill in every field with a valid email before sending.";
        formStatus.className = "form-status error";
        return;
      }

      // Placeholder success state — replace this block with a real
      // submission (fetch to your API, Formspree, etc.) when ready.
      formStatus.textContent =
        "Thanks, " + name.value.trim().split(" ")[0] + "! We'll reply within one business day.";
      formStatus.className = "form-status success";
      contactForm.reset();
    });
  }

  /* -----------------------------------------------------
     Footer year
     ----------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -----------------------------------------------------
     Hero background circuit traces (decorative, generated)
     ----------------------------------------------------- */
  const heroTraces = document.getElementById("heroTraces");
  if (heroTraces) {
    heroTraces.style.setProperty("--traces-ready", "1");
  }
})();
