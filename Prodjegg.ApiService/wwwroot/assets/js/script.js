// ===== MODERN VIDEOGRAPHER LANDING PAGE JAVASCRIPT =====

document.addEventListener("DOMContentLoaded", function () {
  // ===== LOADING SCREEN =====
  const loadingScreen = document.getElementById("loading-screen");
  const loadingProgress = document.querySelector(".loading-progress");

  if (!loadingScreen || !loadingProgress) {
    // Fallback if elements don't exist
    initScrollAnimations();
    return;
  }

  // Simulate loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
          // Trigger entrance animations
          initScrollAnimations();
        }, 500);
      }, 500);
    }
    loadingProgress.style.width = progress + "%";
  }, 200);

  // Fallback timeout to ensure loading screen doesn't stay forever
  setTimeout(() => {
    if (loadingScreen.style.display !== "none") {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        initScrollAnimations();
      }, 500);
    }
  }, 5000);
  // ===== NAVIGATION =====
  const nav = document.querySelector(".glass-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Mobile menu toggle - add null checks
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("active")) {
          icon.classList.remove("bx-menu");
          icon.classList.add("bx-x");
        } else {
          icon.classList.remove("bx-x");
          icon.classList.add("bx-menu");
        }
      }
    });

    // Close mobile menu when clicking on links
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("bx-x");
          icon.classList.add("bx-menu");
        }
      }
    });
  }
  // Navbar scroll effect and active navigation combined
  if (nav) {
    const combinedScrollHandler = throttle(() => {
      // Navbar background effect
      if (window.scrollY > 100) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

      // Update active navigation
      updateActiveNavLink();
    }, 50);

    window.addEventListener("scroll", combinedScrollHandler);
  }
  // ===== ACTIVE NAVIGATION MENU =====
  const navLinksArray = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll("section[id], header");

  function updateActiveNavLink() {
    let currentSection = "";
    const scrollPosition = window.scrollY + 150; // Offset for header height

    // Check which section is currently in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        sectionId &&
        scrollPosition >= sectionTop - 200 &&
        scrollPosition < sectionTop + sectionHeight - 200
      ) {
        currentSection = sectionId;
      }
    });

    // Special case for hero section (when at the very top)
    if (window.scrollY < 150) {
      currentSection = "";
    }

    // Special case for the last section (CTA) - activate when near bottom
    const lastSection = document.querySelector("#cta");
    if (lastSection) {
      const lastSectionTop = lastSection.offsetTop;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // If we're in the last 20% of the page or in the CTA section
      if (
        scrollPosition >= lastSectionTop - 300 ||
        window.scrollY + windowHeight >= documentHeight - 100
      ) {
        currentSection = "cta";
      }
    }

    // Update active states
    navLinksArray.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (
        href === "#" + currentSection ||
        (currentSection === "" && href === "#")
      ) {
        link.classList.add("active");
      }
    });
  }
  // Initial call to set active link on page load
  updateActiveNavLink();

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== PORTFOLIO FILTER =====
  const filterLinks = document.querySelectorAll(".portfolio-filter a");
  const portfolioItems = document.querySelectorAll(".portfolio-gallery img");

  filterLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all filter links
      filterLinks.forEach((l) => l.classList.remove("active"));
      // Add active class to clicked link
      e.target.classList.add("active");

      const filter = e.target.textContent.trim();

      portfolioItems.forEach((item) => {
        const category = item.getAttribute("data-category");

        if (filter === "ALL" || category === filter) {
          item.style.display = "block";
          item.style.animation = "fadeInUp 0.6s ease-out";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // ===== STATS COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60 FPS
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current);
      }, 16);
    });

    statsAnimated = true;
  }

  // ===== SCROLL ANIMATIONS =====
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");

          // Trigger stats animation when stats section is visible
          if (entry.target.id === "stats") {
            animateStats();
          }
        }
      });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll("section").forEach((section) => {
      section.classList.add("scroll-reveal");
      observer.observe(section);
    });

    // Observe cards and other elements
    document
      .querySelectorAll(".card, .testimonial-card, .hero-image, .hero-text")
      .forEach((el) => {
        el.classList.add("scroll-reveal");
        observer.observe(el);
      });
  }

  // ===== SKILL BARS ANIMATION =====
  const skillBars = document.querySelectorAll(".progress");
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;

    skillBars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.width = width;
      }, 200);
    });

    skillsAnimated = true;
  }

  // Observe skills section
  const skillsSection = document.querySelector("#skills");
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillBars();
          }
        });
      },
      { threshold: 0.5 }
    );

    skillsObserver.observe(skillsSection);
  }

  // ===== PARALLAX EFFECT =====
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".hero-bg-shape");

    parallaxElements.forEach((element) => {
      const speed = 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // ===== HOVER EFFECTS =====
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // ===== PORTFOLIO LIGHTBOX EFFECT =====
  const portfolioImages = document.querySelectorAll(".portfolio-gallery img");

  portfolioImages.forEach((img) => {
    img.addEventListener("click", function () {
      // Create lightbox overlay
      const lightbox = document.createElement("div");
      lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;

      const lightboxImg = document.createElement("img");
      lightboxImg.src = this.src;
      lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
            `;

      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);

      // Add close functionality
      lightbox.addEventListener("click", function () {
        document.body.removeChild(lightbox);
      });

      // Add fade-in animation
      lightbox.style.opacity = "0";
      setTimeout(() => {
        lightbox.style.opacity = "1";
        lightbox.style.transition = "opacity 0.3s ease";
      }, 10);
    });
  });

  // ===== TYPEWRITER EFFECT FOR HERO TITLE =====
  function typewriterEffect() {
    const heroTitle = document.querySelector(".hero-text h1");
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    heroTitle.style.opacity = "1";

    let i = 0;
    const timer = setInterval(() => {
      heroTitle.textContent += text.charAt(i);
      i++;
      if (i > text.length - 1) {
        clearInterval(timer);
        // Start subtitle animation
        setTimeout(() => {
          const subtitle = document.querySelector(".hero-text h2");
          if (subtitle) {
            subtitle.style.opacity = "1";
            subtitle.style.transform = "translateY(0)";
          }
        }, 300);
      }
    }, 100);
  }

  // Start typewriter effect after loading
  setTimeout(typewriterEffect, 1000);

  // ===== FLOATING ANIMATION FOR HERO ELEMENTS =====
  const floatingElements = document.querySelectorAll(
    ".hero-social a, .intro-badge"
  );

  floatingElements.forEach((element, index) => {
    element.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
  });

  // ===== FORM HANDLING (if you add a contact form later) =====
  const contactForms = document.querySelectorAll("form");
  contactForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Add your form submission logic here
      console.log("Form submitted");
    });
  });

  // ===== THEME TOGGLE (Optional Feature) =====
  function createThemeToggle() {
    const themeToggle = document.createElement("button");
    themeToggle.innerHTML = '<i class="bx bx-moon"></i>';
    themeToggle.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--accent-gradient);
            border: none;
            color: var(--pure-black);
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            transition: var(--transition);
            z-index: 1000;
        `;

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-theme");
      const icon = this.querySelector("i");
      if (document.body.classList.contains("light-theme")) {
        icon.classList.remove("bx-moon");
        icon.classList.add("bx-sun");
      } else {
        icon.classList.remove("bx-sun");
        icon.classList.add("bx-moon");
      }
    });

    document.body.appendChild(themeToggle);
  }

  // Uncomment the line below if you want a theme toggle button
  // createThemeToggle();

  // ===== PERFORMANCE OPTIMIZATIONS =====

  // Lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src; // Trigger loading
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Scroll-dependent code here
    }, 10);
  });

  // ===== ACCESSIBILITY IMPROVEMENTS =====

  // Add focus indicators for keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-navigation");
  });

  // ===== CUSTOM CURSOR (Optional) =====
  function createCustomCursor() {
    const cursor = document.createElement("div");
    cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-yellow);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;

    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX - 10 + "px";
      cursor.style.top = e.clientY - 10 + "px";
    });

    // Scale cursor on hover over interactive elements
    document.querySelectorAll("a, button, .card").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(2)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
      });
    });
  }

  // Uncomment the line below if you want a custom cursor
  // createCustomCursor();

  console.log("🎬 Videographer Landing Page Loaded Successfully!");
});

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Smooth scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Debounce function for performance
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
