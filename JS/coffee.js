/* Bean Boutique coffee catalogue */
document.addEventListener("DOMContentLoaded", () => {
  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const showCartMessage = (message) => {
    document.querySelector(".cart-message")?.remove();
    const notification = document.createElement("div");
    notification.className = "cart-message";
    notification.innerHTML = `
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>${message}</span>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 1800);
  };

  document.querySelectorAll(".coffee-card .add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".coffee-card");
      if (!card) return;

      const product = {
        name: card.dataset.name,
        price: Number(card.dataset.price),
        image: card.querySelector("img")?.getAttribute("src") || "",
        quantity: 1,
      };

      const cart = getCart();
      const existing = cart.find((item) => item.name === product.name);

      if (existing) {
        existing.quantity = Number(existing.quantity || 1) + 1;
      } else {
        cart.push(product);
      }

      saveCart(cart);
      window.updateCartCount?.();
      showCartMessage(`${product.name} added to your cart.`);

      const original = button.innerHTML;
      button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      button.disabled = true;
      setTimeout(() => {
        button.innerHTML = original;
        button.disabled = false;
      }, 1200);
    });
  });

  const form = document.querySelector("#coffee-search-form");
  const input = document.querySelector("#search-input");
  const cards = [...document.querySelectorAll(".coffee-card")];
  const noResults = document.querySelector("#no-results");

  const filterCoffee = () => {
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const searchable = [
        card.dataset.name,
        card.querySelector(".coffee-description")?.textContent,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const match = !query || searchable.includes(query);
      card.hidden = !match;
      if (match) visible++;
    });

    noResults?.classList.toggle("show", Boolean(query) && visible === 0);
  };

  input?.addEventListener("input", filterCoffee);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCoffee();
  });

  const search = new URLSearchParams(window.location.search).get("search");
  if (search && input) {
    input.value = search;
    filterCoffee();
  }
});
