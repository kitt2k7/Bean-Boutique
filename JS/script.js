/* Bean Boutique shared JavaScript */

const CART_KEY = "cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function updateCartCount() {
  const total = getCart().reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = total;
    element.setAttribute(
      "aria-label",
      `${total} ${total === 1 ? "item" : "items"} in cart`,
    );
  });
}

window.updateCartCount = updateCartCount;

/* ---------- Active navigation ---------- */
function setActiveNavigation() {
  const currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPage = (link.getAttribute("href") || "")
      .split("/")
      .pop()
      .split("#")[0]
      .toLowerCase();
    const isCurrent =
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html");

    link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* ---------- Mobile navigation ---------- */
function setupMobileNavigation() {
  const openButton = document.querySelector("#menu-open-button");
  const closeButton = document.querySelector("#menu-close-button");
  const menu = document.querySelector("#primary-menu");

  if (!openButton || !menu) return;

  const setMenu = (open) => {
    menu.classList.toggle("show", open);
    document.body.classList.toggle("show-mobile-menu", open);
    openButton.setAttribute("aria-expanded", String(open));
  };

  openButton.addEventListener("click", () => setMenu(true));
  closeButton?.addEventListener("click", () => {
    setMenu(false);
    openButton.focus();
  });

  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 900 || !menu.classList.contains("show")) return;
    if (!menu.contains(event.target) && !openButton.contains(event.target)) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
}

/* ---------- First-visit 10% popup ---------- */
function setupDiscountModal() {
  const modal = document.querySelector("#discountModal");
  if (!modal) return;

  const forceOpen = window.location.hash === "#discountModal";
  if (!forceOpen && localStorage.getItem("beanBoutiqueDiscountSeen")) return;

  const closeButton = document.querySelector("#closeModal");
  const form = document.querySelector("#discount-form");
  const email = document.querySelector("#discount-email");
  const message = document.querySelector("#form-message");

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    localStorage.setItem("beanBoutiqueDiscountSeen", "true");
  };

  const openDelay = forceOpen ? 0 : 1500;
  setTimeout(() => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    email?.focus();
  }, openDelay);

  closeButton?.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = email?.value.trim() || "";
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valid) {
      message.textContent = "Please enter a valid email address.";
      message.className = "form-message error";
      email?.focus();
      return;
    }

    const discountCode = "BEAN10";
    message.textContent = `Success! Your 10% discount code is ${discountCode}.`;
    message.className = "form-message success";
    localStorage.setItem("beanBoutiqueDiscountSeen", "true");
    localStorage.setItem("beanBoutiqueDiscountEmail", value);
    localStorage.setItem("beanBoutiqueDiscountCode", discountCode);

    setTimeout(() => {
      alert(
        `10% discount code sent!\\n\\nYour code is: ${discountCode}\\n\\nWe have sent the 10% discount code to ${value}.`
      );
      close();
    }, 250);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) close();
  });
}

/* ---------- Home slideshow ---------- */
function setupSlideshow() {
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".slide-dot")];
  const previous = document.querySelector("#prev-slide");
  const next = document.querySelector("#next-slide");
  const hero = document.querySelector(".hero-section");

  if (!slides.length) return;

  let current = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains("active")),
  );
  let timer = null;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) =>
      slide.classList.toggle("active", i === current),
    );
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (slides.length > 1) timer = setInterval(() => show(current + 1), 4500);
  };

  const restart = () => start();

  next?.addEventListener("click", () => {
    show(current + 1);
    restart();
  });
  previous?.addEventListener("click", () => {
    show(current - 1);
    restart();
  });
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => {
      show(index);
      restart();
    }),
  );

  hero?.addEventListener("mouseenter", stop);
  hero?.addEventListener("mouseleave", start);

  document.addEventListener("keydown", (event) => {
    if (!hero) return;
    if (event.key === "ArrowRight") {
      show(current + 1);
      restart();
    }
    if (event.key === "ArrowLeft") {
      show(current - 1);
      restart();
    }
  });

  show(current);
  start();
}

/* ---------- Home search ---------- */
function setupHomeSearch() {
  const form = document.querySelector("#site-search-form");
  const input = document.querySelector("#site-search");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }

    // Send every collection search to the Coffee page.
    // coffee.js performs the actual filtering there.
    window.location.href = `./coffee.html?search=${encodeURIComponent(query)}`;
  });
}

/* ---------- Animated search placeholder ---------- */
function setupSearchPlaceholders() {
  const inputs = [
    document.querySelector("#site-search"),
    document.querySelector("#search-input"),
  ].filter(Boolean);

  const words = ["espresso", "House Blend", "French Press", "workshops"];
  inputs.forEach((input) => {
    let index = 0;
    let timer;
    const rotate = () => {
      if (document.activeElement !== input && !input.value) {
        input.setAttribute("placeholder", `Try “${words[index]}”...`);
        index = (index + 1) % words.length;
      }
      timer = setTimeout(rotate, 2200);
    };
    rotate();
    input.addEventListener("focus", () => clearTimeout(timer));
    input.addEventListener("blur", rotate);
  });
}

/* ---------- Subscription plan confirmation ---------- */
function setupSubscriptionButtons() {
  document.querySelectorAll(".subscription-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const plan = button.textContent.trim().replace(/^Choose\s+/i, "");
      alert(`Subscription selected!\n\nYou selected the ${plan} plan.\nOur team will contact you with the next steps.`);
    });
  });
}

/* ---------- Shared initialisation ---------- */
updateCartCount();
setActiveNavigation();
setupMobileNavigation();
setupDiscountModal();
setupSlideshow();
setupHomeSearch();
setupSearchPlaceholders();
setupSubscriptionButtons();

window.addEventListener("storage", updateCartCount);
