// Zara Home Clone - Main JavaScript

// DOM Elements
const countryModal = document.getElementById("countryModal");
const modalClose = document.getElementById("modalClose");
const continueBtn = document.getElementById("continueBtn");
const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const newsletterForm = document.getElementById("newsletterForm");

// Check if modal was already dismissed
const modalDismissed = localStorage.getItem("zarahome_modal_dismissed");

// Modal Functions
function closeModal() {
  if (countryModal) {
    countryModal.classList.add("hidden");
    localStorage.setItem("zarahome_modal_dismissed", "true");
    document.body.style.overflow = "";
  }
}

function showModal() {
  if (countryModal && !modalDismissed) {
    countryModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else if (countryModal) {
    countryModal.classList.add("hidden");
  }
}

// Initialize modal state
showModal();

// Modal event listeners
if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (continueBtn) {
  continueBtn.addEventListener("click", closeModal);
}

// Close modal on overlay click
if (countryModal) {
  countryModal.addEventListener("click", (e) => {
    if (e.target === countryModal) {
      closeModal();
    }
  });
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeMobileMenu();
  }
});

// Header scroll effect
let ticking = false;

function updateHeader() {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
});

// Mobile Menu Functions
function openMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (menuBtn) {
  menuBtn.addEventListener("click", openMobileMenu);
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMobileMenu);
}

// Newsletter Form
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector(".newsletter-input");
    if (input?.value) {
      // Simulate subscription
      const btn = newsletterForm.querySelector(".newsletter-btn");
      if (btn) {
        btn.textContent = "SUSCRITO";
        btn.style.background = "#2c8a3c";
        btn.style.borderColor = "#2c8a3c";
        input.value = "";

        setTimeout(() => {
          btn.textContent = "SUSCRIBIRSE";
          btn.style.background = "";
          btn.style.borderColor = "";
        }, 3000);
      }
    }
  });
}

// Hero Navigation Active State
const heroNavLinks = document.querySelectorAll(".hero-nav-link");
for (const link of heroNavLinks) {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    for (const l of heroNavLinks) {
      l.classList.remove("active");
    }
    e.currentTarget.classList.add("active");
  });
}

// Product Wishlist Toggle
const wishlistBtns = document.querySelectorAll(".product-wishlist");
for (const btn of wishlistBtns) {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const svg = btn.querySelector("svg path");
    if (svg) {
      const isFilled = svg.getAttribute("fill") !== "none";
      svg.setAttribute("fill", isFilled ? "none" : "currentColor");
    }
  });
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  }
}, observerOptions);

// Observe all sections and product cards
const elementsToObserve = document.querySelectorAll(
  "section, .product-card, .category-card",
);
for (const el of elementsToObserve) {
  el.classList.add("animate-on-scroll");
  observer.observe(el);
}

// Add CSS for scroll animations
const style = document.createElement("style");
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }

  section.animate-on-scroll {
    opacity: 1;
    transform: none;
  }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
for (const anchor of anchorLinks) {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
}

// Image loading animation
const images = document.querySelectorAll("img");
for (const img of images) {
  if (img.complete) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });
  }
}

// Add image loading styles
const imageStyle = document.createElement("style");
imageStyle.textContent = `
  img {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  img.loaded {
    opacity: 1;
  }
`;
document.head.appendChild(imageStyle);

// Cart counter animation (demo)
const cartCount = document.querySelector(".cart-count");
let cartItems = 0;

// Add to cart simulation (click on product cards)
const productCards = document.querySelectorAll(".product-card");
for (const card of productCards) {
  card.addEventListener("click", () => {
    cartItems++;
    if (cartCount) {
      cartCount.textContent = `(${cartItems})`;
      cartCount.animate(
        [{ transform: "scale(1.3)" }, { transform: "scale(1)" }],
        {
          duration: 300,
          easing: "ease-out",
        },
      );
    }
  });
}

// Preload hero images
const heroImages = document.querySelectorAll(".hero-image");
for (const img of heroImages) {
  const src = img.src;
  if (src) {
    const preload = new Image();
    preload.src = src;
  }
}

// Console welcome message
console.log(
  "%cZARA HOME",
  'font-family: "Cormorant Garamond", serif; font-size: 24px; font-weight: 300; letter-spacing: 0.2em; color: #1a1a1a;',
);
console.log(
  "%cClone by Same.new",
  "font-family: sans-serif; font-size: 12px; color: #888;",
);
