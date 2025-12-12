# Project: Kataleya Candles E-Commerce System

## Overview

Transform the existing single-product Christmas candle landing page into a multi-product e-commerce system while maintaining the festive landing page aesthetic for each candle. The system should maximize conversions through strategic upsells and cross-sells.

---

## Tech Stack

- **Backend:** Django (existing)
- **Frontend:** Tailwind CSS via CDN (existing)
- **Data Storage:** Google Sheets via Service Account
- **State Management:** localStorage for cart

---

## Core Features

### 1. Product Structure

Each candle gets its own landing page at `/candles/{slug}/` maintaining the current Christmas theme styling. Products to create:

```python
CANDLES = [
    {"slug": "christmas-magic", "name": "Коледна Магия", "scent": "канела, портокал", "price": 15},
    {"slug": "winter-forest", "name": "Зимна Гора", "scent": "кедър, бор", "price": 15},
    {"slug": "vanilla-dreams", "name": "Ванилови Мечти", "scent": "ванилия, карамел", "price": 15},
    {"slug": "cozy-evening", "name": "Уютна Вечер", "scent": "лавандула, мед", "price": 15},
]
```

Each landing page should:

- Use the same Christmas template structure
- Dynamically swap product name, description, scent notes, and images
- Keep countdown timer, benefits section, FAQ, and footer consistent
- Have unique hero image and product photos per candle

---

### 2. Shopping Cart System

**Cart stored in localStorage:**

```javascript
cart = {
    items: [
        {slug: "christmas-magic", name: "Коледна Магия", quantity: 2, price: 15},
        {slug: "winter-forest", name: "Зимна Гора", quantity: 1, price: 15}
    ],
    discountApplied: false
}
```

**Cart UI Components:**

- Floating cart icon (bottom-right) showing item count badge
- Slide-out cart drawer when clicked
- Show items, quantities (+/- buttons), subtotal
- Apply volume discounts automatically:
  - 2 items: 13% off
  - 3 items: 20% off
  - 4+ items: 27% off
- "Продължи към поръчка" button → opens checkout modal

---

### 3. Modal Upsell System

**Upsell Modal #1 - Triggered on "Add to Cart":**

```
┌─────────────────────────────────────────────┐
│  🎁 Добави още една свещ с 13% отстъпка!   │
│                                             │
│  [Image: Related Candle]                    │
│  "Зимна Гора" - кедър и бор                │
│  15лв → 13лв при 2+ свещи                  │
│                                             │
│  [ДА, ДОБАВИ]     [НЕ, БЛАГОДАРЯ]          │
└─────────────────────────────────────────────┘
```

**Logic:**

- Show a complementary candle (not the one just added)
- Highlight the volume discount they'll unlock
- If accepted → add to cart, show Upsell #2
- If declined → show cross-sell suggestion (see below)

**Upsell Modal #2 - After accepting Upsell #1:**

```
┌─────────────────────────────────────────────┐
│  🎄 Направи го комплект! 27% отстъпка!     │
│                                             │
│  Вече имаш 2 свещи в количката.            │
│  Добави още 2 за максимална отстъпка!      │
│                                             │
│  ☐ Ванилови Мечти (+15лв → 11лв)           │
│  ☐ Уютна Вечер (+15лв → 11лв)              │
│                                             │
│  [ДОБАВИ ИЗБРАНИТЕ]  [ПРОДЪЛЖИ КЪМ КАСА]   │
└─────────────────────────────────────────────┘
```

---

### 4. Cross-Sell After Cart Addition (if upsell declined)

Instead of a modal, show a toast/banner:

```
┌─────────────────────────────────────────────────────────┐
│ ✓ Добавено в количката!                                │
│                                                         │
│ 👀 Виж и другите ни аромати:                           │
│ [Зимна Гора] [Ванилови Мечти] [Уютна Вечер]           │
│                                               [✕ Затвори]│
└─────────────────────────────────────────────────────────┘
```

Links go to respective landing pages where user can explore and add more.

---

### 5. Checkout Flow

**Checkout Modal (triggered from cart):**

```
┌─────────────────────────────────────────────┐
│  🛒 Твоята Поръчка                         │
│  ─────────────────────────────────────────  │
│  2x Коледна Магия           30лв           │
│  1x Зимна Гора              15лв           │
│  ─────────────────────────────────────────  │
│  Междинна сума:             45лв           │
│  Отстъпка (20%):           -9лв            │
│  Доставка:                  безплатна      │
│  ─────────────────────────────────────────  │
│  ОБЩО:                      36лв           │
│                                             │
│  [Form Fields - same as current]            │
│  Име и фамилия*                             │
│  Телефон*                                   │
│  Адрес/офис за доставка*                   │
│                                             │
│  [🎁 ЗАВЪРШИ ПОРЪЧКАТА]                    │
└─────────────────────────────────────────────┘
```

---

### 6. Google Sheets Integration

**Service Account Setup:**

- Use provided service account credentials
- Store in Django settings/environment variables

**Sheet Structure:**

| Order ID | Date | Name | Phone | Address | Items | Quantity | Subtotal | Discount | Total | Status |
|----------|------|------|-------|---------|-------|----------|----------|----------|-------|--------|
| KAT-001 | 2024-12-15 | Иван Иванов | 0888123456 | София, Еконт офис Център | Коледна Магия (2), Зимна Гора (1) | 3 | 45 | 9 | 36 | Нова |

**Django endpoint:** `POST /api/orders/`

```python
# Use gspread library
import gspread
from google.oauth2.service_account import Credentials

def submit_order(order_data):
    # Authenticate with service account
    # Append row to Google Sheet
    # Return order ID
    # Trigger Facebook Pixel Purchase event
```

---

### 7. Facebook Pixel Events

Track these events:

- `ViewContent` - on each landing page load (with product data)
- `AddToCart` - when item added
- `InitiateCheckout` - when checkout modal opens
- `Purchase` - on successful order submission

```javascript
fbq('track', 'AddToCart', {
    content_name: 'Коледна Магия',
    content_ids: ['christmas-magic'],
    content_type: 'product',
    value: 15,
    currency: 'BGN'
});
```

---

## URL Structure

```
/                           → Redirect to /candles/christmas-magic/
/candles/christmas-magic/   → Christmas Magic landing page
/candles/winter-forest/     → Winter Forest landing page
/candles/vanilla-dreams/    → Vanilla Dreams landing page
/candles/cozy-evening/      → Cozy Evening landing page
/api/orders/                → POST endpoint for order submission
```

---

## File Structure

```
candles/
├── templates/
│   └── candles/
│       ├── base_landing.html      # Shared Christmas template
│       ├── product_detail.html    # Extends base, shows specific candle
│       ├── components/
│       │   ├── cart_drawer.html
│       │   ├── upsell_modal.html
│       │   ├── checkout_modal.html
│       │   └── cross_sell_toast.html
├── static/
│   └── candles/
│       ├── js/
│       │   ├── cart.js            # Cart logic
│       │   ├── upsells.js         # Upsell modal logic
│       │   └── checkout.js        # Form submission
│       └── images/
│           ├── christmas-magic/
│           ├── winter-forest/
│           ├── vanilla-dreams/
│           └── cozy-evening/
├── models.py                       # Candle model (optional, can use dict)
├── views.py                        # Landing page views
├── urls.py
└── sheets_service.py               # Google Sheets integration
```

---

## UI/UX Requirements

### 1. Maintain Christmas Theme

- Keep snowfall animation
- Keep festive colors (red `#C41E3A`, green `#165B33`, gold `#FFD700`)
- Keep "Mountains of Christmas" font for headings
- Keep all animations and effects

### 2. Mobile-First Modals

- Full-screen on mobile
- Centered overlay on desktop
- Easy close (X button, click outside, ESC key)
- Smooth fade/slide animations

### 3. Cart Drawer

- Slide in from right
- Semi-transparent backdrop
- Sticky checkout button at bottom

### 4. Loading States

- Show spinner during order submission
- Disable button to prevent double-submit

### 5. Success State

- After order: show confirmation modal with order ID
- Clear cart
- Option to continue shopping or close

---

## Discount Logic (JavaScript)

```javascript
function calculateDiscount(itemCount) {
    if (itemCount >= 4) return 0.27;
    if (itemCount >= 3) return 0.20;
    if (itemCount >= 2) return 0.13;
    return 0;
}

function calculateTotal(cart) {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const discount = calculateDiscount(totalItems);
    const discountAmount = subtotal * discount;
    return {
        subtotal,
        totalItems,
        discountPercent: discount * 100,
        discountAmount,
        total: subtotal - discountAmount
    };
}
```

---

## Order Flow Summary

```
User lands on /candles/christmas-magic/
    ↓
Scrolls, reads benefits, sees countdown
    ↓
Clicks "Add to Cart" (quantity selector optional)
    ↓
[Upsell Modal #1] - "Add Winter Forest?"
    ↓ YES                          ↓ NO
[Upsell Modal #2]              [Cross-sell Toast]
"Complete the set!"            "Check other scents"
    ↓                              ↓
Cart drawer opens              User continues browsing
    ↓                              ↓
"Proceed to Checkout"          Adds more / Opens cart
    ↓
[Checkout Modal] - Form + Order Summary
    ↓
Submit → Google Sheets API
    ↓
[Success Modal] - "Order #KAT-XXX confirmed!"
    ↓
Cart cleared, user can continue shopping
```

---

## Notes for Developer

1. **Keep existing styles** - The CSS is well-organized with CSS variables. Extend, don't replace.

2. **Service Account** - I will provide the JSON credentials. Store securely in environment variables.

3. **No user accounts needed** - This is a simple checkout flow, no registration.

4. **Order ID format** - Use `KAT-{timestamp}-{random4digits}` for uniqueness.

5. **Shipping** - Always free, don't complicate with shipping calculations.

6. **Payment** - Cash on delivery (наложен платеж) only. No online payments.

7. **Validation** - Bulgarian phone format, required fields only.

8. **Language** - All UI text in Bulgarian. Keep the warm, festive tone.

---

## Appendix: Current Landing Page Template Reference

The existing template includes:

- Countdown timer section with Christmas deadline
- Hero banner image
- Benefits section with 6 key selling points
- "Why Choose" section with alternating image/text rows
- Order form with name, phone, address, quantity selector
- FAQ accordion section
- Footer with social links

All these sections should be preserved and made dynamic per product.
