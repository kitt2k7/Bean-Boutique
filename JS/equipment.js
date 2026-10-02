/* Bean Boutique equipment catalogue */
document.addEventListener("DOMContentLoaded", () => {
  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
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

  document
    .querySelectorAll(".equipment-card .add-to-cart")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const product = {
          name: button.dataset.name,
          price: Number(button.dataset.price),
          image: button.dataset.image,
          quantity: 1,
        };

        const cart = getCart();
        const existing = cart.find((item) => item.name === product.name);

        if (existing) {
          existing.quantity = Number(existing.quantity || 1) + 1;
        } else {
          cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
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
});
