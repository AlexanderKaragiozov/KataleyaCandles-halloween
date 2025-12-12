function openCheckout() {
    console.log("Opening Checkout Modal...");
    if (typeof closeCart === 'function') closeCart();

    updateCheckoutSummary();

    const modal = document.getElementById('checkout-modal');
    if (modal) {
        console.log("Modal found, showing...");
        modal.classList.remove('hidden');
    } else {
        console.error("CRITICAL: checkout-modal element NOT found in DOM");
        alert("Error: Checkout modal missing. Please refresh.");
    }
}

const closeCheckoutBtn = document.getElementById('close-checkout');
if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
        document.getElementById('checkout-modal').classList.add('hidden');
    });
}

function updateCheckoutSummary() {
    const totals = calculateTotals();
    const container = document.getElementById('checkout-items');
    if (container) {
        container.innerHTML = '';
        cart.items.forEach(item => {
            container.innerHTML += `
                <div class="flex justify-between">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
            `;
        });
    }

    const sub = document.getElementById('checkout-subtotal');
    if (sub) sub.innerHTML = formatPrice(totals.subtotal);

    const disc = document.getElementById('checkout-discount');
    if (disc) disc.innerHTML = '-' + formatPrice(totals.discountAmount);

    const tot = document.getElementById('checkout-total');
    if (tot) tot.innerHTML = formatPrice(totals.total);
}

/* Form Submission */
const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submit-order-btn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="animate-spin mr-2">⏳</span> Обработване...';

        const formData = new FormData(e.target);
        const totals = calculateTotals();

        const orderData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            items: cart.items,
            totalItems: totals.totalItems,
            subtotal: totals.subtotal,
            discount: totals.discountAmount,
            total: totals.total
        };

        try {
            const response = await fetch('/api/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || CSRF_TOKEN // Use constant from template or cookie
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                // Success
                document.getElementById('checkout-modal').classList.add('hidden');
                document.getElementById('success-order-id').innerText = result.order_id;
                document.getElementById('success-modal').classList.remove('hidden');

                // Clear cart
                cart = { items: [], discountApplied: false };
                saveCart();
            } else {
                alert('Възникна грешка при поръчката: ' + (result.error || 'Моля опитайте отново.'));
            }
        } catch (err) {
            console.error(err);
            alert('Възникна грешка с връзката. Моля проверете интернета си.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
