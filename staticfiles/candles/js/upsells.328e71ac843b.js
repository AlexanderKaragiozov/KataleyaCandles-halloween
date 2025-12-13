function triggerUpsellFlow() {
    hideCrossSell(); // Hide toast if active
    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    // If 1 item added, show Upsell 1
    if (totalItems === 1) {
        showUpsell1();
    }
    // For 2 or more items, ALWAYS show Upsell 2
    else {
        showUpsell2();
    }
}

/* Modal 1 Logic */
function showUpsell1() {
    // Find a product that is NOT in the cart to recommend
    const currentSlugs = cart.items.map(i => i.slug);

    // Prioritize upsells not in cart
    let recommendation = CANDLE_PRODUCTS.find(p => p.is_upsell && !currentSlugs.includes(p.slug));

    // Fallback to any product not in cart if no upsells available
    if (!recommendation) {
        recommendation = CANDLE_PRODUCTS.find(p => !currentSlugs.includes(p.slug));
    }

    // Absolute fallback
    if (!recommendation) {
        recommendation = CANDLE_PRODUCTS.find(p => p.is_upsell) || CANDLE_PRODUCTS[0];
    }

    // Inject content
    const container = document.getElementById('upsell-recommendation');
    if (!container) return; // Guard

    container.innerHTML = `
        <div class="flex items-center space-x-4">
            <img src="${recommendation.image}" 
                 onclick="openLightbox('${recommendation.image}')" 
                 onmouseenter="showHoverPreview(event, '${recommendation.image}')"
                 onmousemove="moveHoverPreview(event)"
                 onmouseleave="hideHoverPreview()"
                 class="w-32 h-32 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
            <div class="text-left">
                <h4 class="font-bold text-gray-800">${recommendation.name}</h4>
                <p class="text-xs text-gray-500">${recommendation.scent}</p>
                <div class="mt-1">
                    <span class="text-christmas-red font-bold">${formatPrice(recommendation.price)}</span>
                    <span class="text-xs text-gray-400 line-through">25.00 лв.</span>
                </div>
            </div>
        </div>
    `;

    // Bind events
    const acceptBtn = document.getElementById('accept-upsell-1');
    acceptBtn.onclick = () => {
        addToCart(recommendation.slug, 1); // Add
        closeModal('upsell-modal-1');
        setTimeout(showUpsell2, 300); // Chain to next upsell
    };

    const declineBtn = document.getElementById('decline-upsell-1');
    declineBtn.onclick = () => {
        closeModal('upsell-modal-1');
        openCheckout();
    };

    openModal('upsell-modal-1');
}

/* Modal 2 Logic */
function showUpsell2() {
    const form = document.getElementById('upsell-form-2');
    if (!form) return;

    form.innerHTML = '';

    const currentSlugs = cart.items.map(i => i.slug);
    // Suggest items not in cart, prioritizing upsells
    let suggestions = CANDLE_PRODUCTS.filter(p => p.is_upsell && !currentSlugs.includes(p.slug));

    // If ran out of upsells, suggest others
    if (suggestions.length === 0) {
        suggestions = CANDLE_PRODUCTS.filter(p => !currentSlugs.includes(p.slug));
    }

    // If they have everything, candidates might be empty, but that's rare given 9 products
    const candidates = suggestions.length > 0 ? suggestions : CANDLE_PRODUCTS;
    const limit = 3; // Show max 3 options

    candidates.slice(0, limit).forEach(p => {
        form.innerHTML += `
            <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-christmas-gold cursor-pointer transition-colors bg-white">
                <input type="checkbox" name="upsell_item" value="${p.slug}" class="form-checkbox h-5 w-5 text-christmas-red rounded focus:ring-christmas-gold">
                <div class="flex-1 flex items-center space-x-4">
                    <img src="${p.image}" 
                         onclick="openLightbox('${p.image}')" 
                         onmouseenter="showHoverPreview(event, '${p.image}')"
                         onmousemove="moveHoverPreview(event)"
                         onmouseleave="hideHoverPreview()"
                         class="w-20 h-20 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                    <div>
                        <p class="font-bold text-gray-800 text-sm">${p.name}</p>
                        <p class="text-xs text-christmas-red font-bold">+${formatPrice(p.price)}</p>
                    </div>
                </div>
            </label>
        `;
    });

    // Bind events
    const acceptBtn = document.getElementById('accept-upsell-2');
    acceptBtn.onclick = () => {
        const checkboxes = form.querySelectorAll('input[name="upsell_item"]:checked');
        checkboxes.forEach(cb => {
            addToCart(cb.value, 1);
        });
        closeModal('upsell-modal-2');
        openCheckout();
    };

    const declineBtn = document.getElementById('decline-upsell-2');
    declineBtn.onclick = () => {
        closeModal('upsell-modal-2');
        openCheckout();
    };

    openModal('upsell-modal-2');
}

/* Helpers */

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

function showCrossSellToast() {
    const toast = document.getElementById('cross-sell-toast');
    if (toast) {
        toast.classList.remove('translate-y-full');
        toast.classList.remove('pointer-events-none'); // Enable interaction
        setTimeout(() => {
            hideCrossSell();
        }, 8000); // Hide after 8 seconds
    }
}

function hideCrossSell() {
    const toast = document.getElementById('cross-sell-toast');
    if (toast) {
        toast.classList.add('translate-y-full');
        toast.classList.add('pointer-events-none'); // Disable interaction when hidden
    }
}


function openLightbox(url) {
    const lb = document.getElementById('image-lightbox');
    const img = document.getElementById('lightbox-image');
    if (lb && img) {
        img.src = url;
        lb.classList.remove('hidden');
    }
}

function closeLightbox() {
    const lb = document.getElementById('image-lightbox');
    if (lb) lb.classList.add('hidden');
}

/* Hover Preview Logic */
function showHoverPreview(e, url) {
    if (window.innerWidth < 1024) return; // Desktop only
    const preview = document.getElementById('hover-preview');
    const img = document.getElementById('hover-preview-img');
    if (preview && img) {
        img.src = url;
        preview.classList.remove('hidden');
        moveHoverPreview(e);
    }
}

function moveHoverPreview(e) {
    const preview = document.getElementById('hover-preview');
    if (preview && !preview.classList.contains('hidden')) {
        // Offset from cursor
        const x = e.clientX + 20;
        const y = e.clientY + 20;

        // Boundary check (optional, but good for UX)
        // For simplicity, just position it.
        preview.style.left = `${x}px`;
        preview.style.top = `${y}px`;
    }
}

function hideHoverPreview() {
    const preview = document.getElementById('hover-preview');
    if (preview) preview.classList.add('hidden');
}

window.triggerUpsellFlow = triggerUpsellFlow;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.showHoverPreview = showHoverPreview;
window.moveHoverPreview = moveHoverPreview;
window.hideHoverPreview = hideHoverPreview;
window.hideCrossSell = hideCrossSell;
