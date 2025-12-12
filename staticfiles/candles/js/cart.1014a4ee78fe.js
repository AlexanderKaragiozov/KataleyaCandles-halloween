/* Global Cart State */
let cart = {
    items: [],
    discountApplied: false
};

/* Constants */
const DISCOUNT_RULES = [
    { threshold: 4, percent: 0.27 },
    { threshold: 3, percent: 0.20 },
    { threshold: 2, percent: 0.13 }
];

const KNOWN_UPSELLS = ['santa-claus', 'frosty-snowman', 'festive-tree'];

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
});

function setupEventListeners() {
    // Open/Close Cart
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);

    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Checkout Button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            if (window.triggerUpsellFlow) {
                window.triggerUpsellFlow();
            } else {
                console.error("triggerUpsellFlow not found on window");
            }
        });
    }
}

/* Logic */

function loadCart() {
    const saved = localStorage.getItem('kataleya_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('kataleya_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(slug, quantity = 1) {
    // Find product data from global ALL_PRODUCTS or current usage
    // For specific candle page, we might adding current, or from upsell we add others.
    // Ensure CANDLE_PRODUCTS is available. If not, use CURRENT_PRODUCT if match.
    let product = CANDLE_PRODUCTS.find(p => p.slug === slug);
    if (!product && typeof CURRENT_PRODUCT !== 'undefined' && CURRENT_PRODUCT.slug === slug) {
        product = CURRENT_PRODUCT;
    }

    if (!product) {
        console.error("Product not found:", slug);
        return;
    }

    const existingItem = cart.items.find(item => item.slug === slug);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            is_upsell: product.is_upsell, // Store explicit flag
            quantity: quantity
        });
    }

    saveCart();
    openCart(); // Just open cart to show feedback
}

function removeFromCart(slug) {
    cart.items = cart.items.filter(item => item.slug !== slug);
    saveCart();
}

function updateQuantity(slug, change) {
    const item = cart.items.find(item => item.slug === slug);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(slug);
        } else {
            saveCart();
        }
    }
}

function calculateTotals() {
    // Separate calculation for regular items (qualify for discount) vs upsells (no discount)
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Only regular candles count towards the threshold and get the discount
    const qualifyingItems = cart.items.filter(item => {
        // 1. Check strict known upsell list
        if (KNOWN_UPSELLS.includes(item.slug)) return false;

        // 2. Check item property (legacy)
        if (item.is_upsell) return false;

        // 3. Fallback to global data lookup
        if (typeof CANDLE_PRODUCTS !== 'undefined') {
            const product = CANDLE_PRODUCTS.find(p => p.slug === item.slug);
            if (product && product.is_upsell) return false;
        }

        return true;
    });
    const qualifyingCount = qualifyingItems.reduce((sum, item) => sum + item.quantity, 0);
    const qualifyingSubtotal = qualifyingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let discountPercent = 0;
    for (const rule of DISCOUNT_RULES) {
        if (qualifyingCount >= rule.threshold) {
            discountPercent = rule.percent;
            break;
        }
    }

    // Discount applies ONLY to the qualifying subtotal
    const discountAmount = qualifyingSubtotal * discountPercent;

    return {
        subtotal,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0), // Total items for badge
        qualifyingCount, // Export for progress bar logic
        discountPercent: discountPercent * 100,
        discountAmount,
        total: subtotal - discountAmount
    };
}

/* UI Updates */

function updateCartUI() {
    // Badge
    const totals = calculateTotals();
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = totals.totalItems;
        if (totals.totalItems > 0) {
            badge.classList.remove('scale-0');
        } else {
            badge.classList.add('scale-0');
        }
    }

    // Items List
    const itemsContainer = document.getElementById('cart-items');
    if (itemsContainer) {
        itemsContainer.innerHTML = '';

        if (cart.items.length === 0) {
            itemsContainer.innerHTML = '<p class="text-center text-gray-500 mt-10">Количката е празна :(</p>';
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) checkoutBtn.disabled = false;

            cart.items.forEach(item => {
                itemsContainer.innerHTML += `
                    <div class="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm">
                        <img src="${item.image}" class="w-16 h-16 rounded object-cover">
                        <div class="flex-1">
                            <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                            <p class="text-gray-500 text-xs">${formatPrice(item.price)}</p>
                        </div>
                        <div class="flex items-center border rounded-lg">
                            <button onclick="updateQuantity('${item.slug}', -1)" class="px-2 py-1 hover:bg-gray-100 text-gray-600">-</button>
                            <span class="px-2 text-sm font-bold">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.slug}', 1)" class="px-2 py-1 hover:bg-gray-100 text-gray-600">+</button>
                        </div>
                    </div>
                `;
            });
        }
    }

    // Totals
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.innerHTML = formatPrice(totals.subtotal);

    const discountAmountEl = document.getElementById('discount-amount');
    if (discountAmountEl) discountAmountEl.innerHTML = formatPrice(totals.discountAmount);

    const discountPercentEl = document.getElementById('discount-percent');
    if (discountPercentEl) discountPercentEl.innerText = Math.round(totals.discountPercent);

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerHTML = formatPrice(totals.total);

    // Progress Bar Logic
    updateProgressBar(totals.qualifyingCount);
}

function updateProgressBar(count) {
    const progress = document.getElementById('upsell-progress');
    if (!progress) return;

    const bar = progress.querySelector('div');
    const msg = document.getElementById('upsell-text');

    progress.classList.remove('hidden');

    if (count === 0) {
        bar.style.width = '0%';
        msg.innerText = "Добави свещ за старт!";
    } else if (count === 1) {
        bar.style.width = '33%';
        msg.innerHTML = "Добави още <span class='font-bold text-christmas-red'>1 свещ</span> за 13% отстъпка!";
    } else if (count === 2) {
        bar.style.width = '66%';
        msg.innerHTML = "Добави още <span class='font-bold text-christmas-red'>1 свещ</span> за 20% отстъпка!";
    } else if (count === 3) {
        bar.style.width = '90%';
        msg.innerHTML = "Само още <span class='font-bold text-christmas-red'>1</span> до МАКСИМАЛНА отстъпка (27%)!";
    } else {
        bar.style.width = '100%';
        msg.innerHTML = "🎉 Поздравления! Имаш <span class='font-bold text-christmas-red'>-27%</span> отстъпка!";
    }
}

function openCart() {
    document.getElementById('cart-overlay').classList.remove('hidden');
    document.getElementById('cart-drawer').classList.remove('translate-x-full');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.add('translate-x-full');
    setTimeout(() => {
        document.getElementById('cart-overlay').classList.add('hidden');
    }, 300);
}

// Global scope expose for onclick handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.calculateTotals = calculateTotals;
window.cart = cart;
