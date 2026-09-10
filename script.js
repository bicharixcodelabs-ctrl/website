/* =========================================================
   Bicharix Code Labs — site script
   Theme toggle · mobile nav · testimonials paginator · footer year
   ========================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* -----------------------------------------------------
     Scroll-reveal animations for section heads, cards and
     the accounting / HR product illustrations. Works on any
     viewport size; falls back to "just show everything" for
     reduced-motion users or browsers without
     IntersectionObserver.
     ----------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add("in-view");
      });
    } else {
      const revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
      );
      revealTargets.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

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
        isDark ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    // Site defaults to dark mode regardless of system preference.
    return "dark";
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current =
        root.getAttribute("data-theme") === "dark" ? "dark" : "light";
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
            "<blockquote>&ldquo;" +
            t.quote +
            "&rdquo;</blockquote>" +
            '<div class="t-author">' +
            '<div class="t-avatar" aria-hidden="true">' +
            t.initials +
            "</div>" +
            "<div>" +
            '<p class="t-name">' +
            t.name +
            "</p>" +
            '<p class="t-role">' +
            t.role +
            "</p>" +
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
      let dots = dotsWrap.querySelectorAll(".pager-dot");

      if (dots.length !== pageCount) {
        dotsWrap.innerHTML = "";
        for (let i = 0; i < pageCount; i++) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "pager-dot";
          dot.setAttribute("aria-label", "Go to testimonials page " + (i + 1));
          dot.addEventListener("click", function () {
            page = i;
            renderPage();
          });
          dotsWrap.appendChild(dot);
        }
        dots = dotsWrap.querySelectorAll(".pager-dot");
      }

      dots.forEach(function (dot, index) {
        if (index === page) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
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

    /* -----------------------------------------------------
       Auto-scroll — advances a page automatically, pauses on
       hover/keyboard focus and while the tab isn't visible,
       and is skipped entirely for reduced-motion users.
       ----------------------------------------------------- */
    const AUTOPLAY_MS = 5000;
    let autoplayTimer = null;

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      if (prefersReducedMotion || pageCount <= 1) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () {
        page = (page + 1) % pageCount;
        renderPage();
      }, AUTOPLAY_MS);
    }

    const testimonialsSection = document.getElementById("testimonials");
    if (testimonialsSection) {
      testimonialsSection.addEventListener("mouseenter", stopAutoplay);
      testimonialsSection.addEventListener("mouseleave", startAutoplay);
      testimonialsSection.addEventListener("focusin", stopAutoplay);
      testimonialsSection.addEventListener("focusout", startAutoplay);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // restart the timer on manual navigation so it doesn't jump right
    // after someone has just clicked
    prevBtn.addEventListener("click", startAutoplay);
    nextBtn.addEventListener("click", startAutoplay);
    dotsWrap.addEventListener("click", startAutoplay);

    startAutoplay();
  }

  /* -----------------------------------------------------
     Footer year
     ----------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -----------------------------------------------------
     Hero code-card typewriter
     ----------------------------------------------------- */
  const heroCode = document.getElementById("heroCode");
  if (heroCode) {
    const finalHTML = heroCode.innerHTML;
    const fullText = heroCode.textContent;

    function showFinal() {
      heroCode.innerHTML = finalHTML;
    }

    if (prefersReducedMotion || !fullText) {
      showFinal();
    } else {
      heroCode.textContent = "";
      let i = 0;

      function typeNext() {
        i++;
        const cursor = document.createElement("span");
        cursor.className = "code-cursor";
        heroCode.textContent = fullText.slice(0, i);
        heroCode.appendChild(cursor);

        if (i < fullText.length) {
          setTimeout(typeNext, 16);
        } else {
          showFinal();
        }
      }

      const codeCard = heroCode.closest(".code-card");
      if ("IntersectionObserver" in window && codeCard) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                typeNext();
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 },
        );
        observer.observe(codeCard);
      } else {
        typeNext();
      }
    }
  }

  /* -----------------------------------------------------
     "LIVE" status dot 
     ----------------------------------------------------- */
  const liveDot = document.querySelector(".code-live-dot");
  if (liveDot && !prefersReducedMotion) {
    let liveOn = true;
    setInterval(function () {
      liveOn = !liveOn;
      liveDot.style.opacity = liveOn ? "1" : "0.25";
    }, 800);
  }

  /* -----------------------------------------------------
     Hero fact-list "live" pulse rings 
     ----------------------------------------------------- */
  const pulseRings = document.querySelectorAll(".hero-fact-ring");
  if (pulseRings.length && !prefersReducedMotion) {
    const DURATION = 2200; // ms per pulse cycle
    const DELAYS = [0, 500, 1000]; // stagger each dot like before
    const start = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tickPulse(now) {
      pulseRings.forEach(function (ring, index) {
        const delay = DELAYS[index % DELAYS.length];
        const elapsed = (now - start - delay) % DURATION;
        if (elapsed < 0) {
          ring.style.opacity = "0";
          return;
        }
        const t = elapsed / DURATION;
        const eased = easeOutCubic(t);
        const scale = 0.35 + eased * (1.9 - 0.35);
        const opacity = Math.max(0, 0.6 * (1 - eased));
        ring.style.transform = "scale(" + scale.toFixed(3) + ")";
        ring.style.opacity = opacity.toFixed(3);
      });
      requestAnimationFrame(tickPulse);
    }

    requestAnimationFrame(tickPulse);
  }
})();
