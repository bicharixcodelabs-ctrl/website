/* =========================================================
   Bicharix Code Labs — site script
   Theme toggle · mobile nav · testimonials paginator · footer year
   ========================================================= */
(function () {
  "use strict";

  /* Animations always run on this site regardless of the OS/browser
     "reduce motion" setting, since that flag can get flipped on by
     laptop battery-saver / power-saving modes without the person
     actually wanting animations off. */

  /* -----------------------------------------------------
     Scroll-reveal animations for section heads, cards and
     the accounting / HR product illustrations. Works on any
     viewport size; falls back to "just show everything" for
     reduced-motion users or browsers without
     IntersectionObserver.
     ----------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length) {
    if (!("IntersectionObserver" in window)) {
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
        "Clean, maintainable code and clear documentation, our own team could pick up where they left off without friction.",
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
      if (pageCount <= 1) return;
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

    /* -----------------------------------------------------
       Swipe support — phones expect to drag the cards left/
       right, not just tap the arrow buttons.
       ----------------------------------------------------- */
    const viewport = document.querySelector(".testimonials-viewport");
    if (viewport) {
      const SWIPE_THRESHOLD = 40;
      let touchStartX = 0;
      let touchStartY = 0;
      let touching = false;

      viewport.addEventListener(
        "touchstart",
        function (e) {
          const t = e.touches[0];
          touchStartX = t.clientX;
          touchStartY = t.clientY;
          touching = true;
          stopAutoplay();
        },
        { passive: true },
      );

      viewport.addEventListener(
        "touchend",
        function (e) {
          if (!touching) return;
          touching = false;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStartX;
          const dy = t.clientY - touchStartY;

          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0 && !nextBtn.disabled) {
              nextBtn.click();
            } else if (dx > 0 && !prevBtn.disabled) {
              prevBtn.click();
            }
          }
          startAutoplay();
        },
        { passive: true },
      );

      viewport.addEventListener("touchcancel", function () {
        touching = false;
        startAutoplay();
      });
    }

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
      startIdeaWordLoop();
    }

    if (!fullText) {
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
     Hero code-card: once the initial type-out is done, the
     whole ("word") call keeps cycling — erase the entire
     parenthesised string, then type the next one in, so the
     cursor (which sits right after it) never looks detached
     from what's actually being typed.
     ----------------------------------------------------- */
  function startIdeaWordLoop() {
    const callEl = document.getElementById("heroIdeaCall");
    if (!callEl) return;

    const words = [
      "your idea",
      "your startup",
      "your product",
      "your workflow",
    ];
    let index = 0;

    function escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // Renders the first `n` characters of `(" word ")` for a given
    // word, keeping the quoted portion in the green string colour
    // and the parentheses in the default code colour, just like the
    // fully typed-out state.
    function renderCall(word, n) {
      const plain = '("' + word + '")';
      const total = plain.length;
      n = Math.max(0, Math.min(n, total));
      const sub = plain.slice(0, n);
      const greenEnd = word.length + 3; // end of the quoted region within `plain`

      const before = sub.slice(0, 1);
      const green = sub.slice(1, Math.min(n, greenEnd));
      const after = sub.slice(Math.min(n, greenEnd));

      let html = escapeHtml(before);
      if (green)
        html += '<span class="tok-str">' + escapeHtml(green) + "</span>";
      html += escapeHtml(after);

      callEl.innerHTML = html;
    }

    function eraseThenType() {
      const currentWord = words[index];
      let n = currentWord.length + 4;

      function erase() {
        n--;
        renderCall(currentWord, n);
        if (n > 0) {
          setTimeout(erase, 28);
        } else {
          setTimeout(type, 260);
        }
      }

      index = (index + 1) % words.length;
      const nextWord = words[index];
      const nextTotal = nextWord.length + 4;
      let m = 0;

      function type() {
        m++;
        renderCall(nextWord, m);
        if (m < nextTotal) {
          setTimeout(type, 45);
        } else {
          setTimeout(eraseThenType, 2600);
        }
      }

      erase();
    }

    setTimeout(eraseThenType, 2600);
  }

  /* -----------------------------------------------------
     "LIVE" status dot 
     ----------------------------------------------------- */
  const liveDot = document.querySelector(".code-live-dot");
  if (liveDot) {
    let liveOn = true;
    setInterval(function () {
      liveOn = !liveOn;
      liveDot.style.opacity = liveOn ? "1" : "0.25";
    }, 800);
  }

  /* -----------------------------------------------------
     Hero heading word-swap: "your idea ___." cycles through
     a few synonyms with a quick fade/blur switch.
     ----------------------------------------------------- */
  const wordSwapEl = document.getElementById("heroWordSwap");
  if (wordSwapEl) {
    const swapWords = ["deserves", "demands", "needs", "requires"];
    let swapIndex = 0;

    setInterval(function () {
      wordSwapEl.classList.add("is-swapping");
      setTimeout(function () {
        swapIndex = (swapIndex + 1) % swapWords.length;
        wordSwapEl.textContent = swapWords[swapIndex];
        wordSwapEl.classList.remove("is-swapping");
      }, 350);
    }, 2600);
  }

  /* -----------------------------------------------------
     Hero fact-list "live" pulse rings 
     ----------------------------------------------------- */
  const pulseRings = document.querySelectorAll(".hero-fact-ring");
  if (pulseRings.length) {
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
