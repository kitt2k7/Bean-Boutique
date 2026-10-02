document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.querySelector("#checkout-button");
    const cartKey = "cart";

    const cartItemsContainer = document.querySelector("#cart-items");
    const cartEmpty = document.querySelector("#cart-empty");
    const cartSummary = document.querySelector("#cart-summary");
    const cartSubtotal = document.querySelector("#cart-subtotal");
    const cartTotal = document.querySelector("#cart-total");

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(cartKey)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function updateHeaderCartCount() {
        const cart = getCart();

        const totalItems = cart.reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
        );

        document.querySelectorAll(".cart-count").forEach((element) => {
            element.textContent = totalItems;
        });
    }

    function formatPrice(price) {
        return `$${Number(price).toFixed(2)}`;
    }

    function renderCart() {
        const cart = getCart();

        if (!cartItemsContainer) {
            return;
        }

        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            if (cartEmpty) {
                cartEmpty.style.display = "block";
            }

            if (cartSummary) {
                cartSummary.style.display = "none";
            }

            updateHeaderCartCount();
            return;
        }

        if (cartEmpty) {
            cartEmpty.style.display = "none";
        }

        if (cartSummary) {
            cartSummary.style.display = "block";
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = Number(item.price) * Number(item.quantity);

            subtotal += itemTotal;

            const cartItem = document.createElement("article");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img 
                        src="${item.image}" 
                        alt="${item.name}"
                    >
                </div>

                <div class="cart-item-info">
                    <h3>${item.name}</h3>

                    <p class="cart-item-price">
                        ${formatPrice(item.price)}
                    </p>

                    <div class="cart-item-actions">

                        <div class="quantity-control">
                            <button 
                                type="button"
                                class="quantity-btn decrease-btn"
                                data-index="${index}"
                                aria-label="Decrease quantity"
                            >
                                <i class="fa-solid fa-minus"></i>
                            </button>

                            <span class="quantity">
                                ${item.quantity}
                            </span>

                            <button 
                                type="button"
                                class="quantity-btn increase-btn"
                                data-index="${index}"
                                aria-label="Increase quantity"
                            >
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <button
                            type="button"
                            class="remove-item"
                            data-index="${index}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Remove
                        </button>

                    </div>
                </div>

                <div class="cart-item-total">
                    ${formatPrice(itemTotal)}
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        if (cartSubtotal) {
            cartSubtotal.textContent = formatPrice(subtotal);
        }

        if (cartTotal) {
            cartTotal.textContent = formatPrice(subtotal);
        }

        updateHeaderCartCount();
    }

    function changeQuantity(index, amount) {
        const cart = getCart();

        if (!cart[index]) {
            return;
        }

        cart[index].quantity = Number(cart[index].quantity || 1) + amount;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        saveCart(cart);
        renderCart();
    }

    function removeItem(index) {
        const cart = getCart();

        if (!cart[index]) {
            return;
        }

        cart.splice(index, 1);

        saveCart(cart);
        renderCart();
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (event) => {
            const increaseButton = event.target.closest(".increase-btn");
            const decreaseButton = event.target.closest(".decrease-btn");
            const removeButton = event.target.closest(".remove-item");

            if (increaseButton) {
                const index = Number(increaseButton.dataset.index);

                changeQuantity(index, 1);
            }

            if (decreaseButton) {
                const index = Number(decreaseButton.dataset.index);

                changeQuantity(index, -1);
            }

            if (removeButton) {
                const index = Number(removeButton.dataset.index);

                removeItem(index);
            }
        });
    }

    window.addEventListener("storage", () => {
        renderCart();
    });


    const checkoutModal = document.querySelector("#checkout-modal");
    const checkoutOk = document.querySelector("#checkout-ok");

    const closeCheckoutModal = () => {
        checkoutModal?.classList.remove("show");
        checkoutModal?.setAttribute("aria-hidden", "true");
    };

    checkoutButton?.addEventListener("click", () => {
        if (getCart().length === 0) return;

        // Complete the demo checkout: clear purchased products immediately.
        saveCart([]);
        renderCart();

        checkoutModal?.classList.add("show");
        checkoutModal?.setAttribute("aria-hidden", "false");
        checkoutOk?.focus();
    });

    checkoutOk?.addEventListener("click", closeCheckoutModal);
    checkoutModal?.addEventListener("click", (event) => {
        if (event.target === checkoutModal) closeCheckoutModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeCheckoutModal();
    });

    renderCart();
});