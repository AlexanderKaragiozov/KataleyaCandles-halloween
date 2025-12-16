# Meta Pixel Setup Summary

## Pixel ID: 1655223285852789

### ✅ Events Implemented

#### 1. **PageView** (Automatic)

- **Location**: `base_landing.html` - `<head>` section
- **Trigger**: Automatically fires on every page load
- **Purpose**: Tracks all page visits across the site

#### 2. **ViewContent**

- **Location**: `product_detail.html`
- **Trigger**: Fires when a user views a product detail page
- **Data Tracked**:
  - `content_name`: Product name
  - `content_ids`: Product slug
  - `content_type`: "product"
  - `value`: Product price in BGN
  - `currency`: "BGN"

#### 3. **AddToCart**

- **Location**: `cart.js` - `addToCart()` function
- **Trigger**: Fires when a user adds any item to cart (from product page, upsell modal, etc.)
- **Data Tracked**:
  - `content_name`: Product name
  - `content_ids`: Product slug
  - `content_type`: "product"
  - `value`: Total value (price × quantity) in BGN
  - `currency`: "BGN"

#### 4. **InitiateCheckout**

- **Location**: `checkout.js` - `openCheckout()` function
- **Trigger**: Fires when checkout modal opens (after upsell flow)
- **Data Tracked**:
  - `content_ids`: Array of all product slugs in cart
  - `contents`: Detailed array with id, quantity, and item_price for each product
  - `value`: Total cart value (after discounts) in BGN
  - `currency`: "BGN"
  - `num_items`: Total number of items in cart

#### 5. **Purchase**

- **Location**: `checkout.js` - Order form submission success handler
- **Trigger**: Fires when order is successfully placed
- **Data Tracked**:
  - `content_ids`: Array of all purchased product slugs
  - `contents`: Detailed array with id, quantity, and item_price for each product
  - `value`: Total order value (after discounts) in BGN
  - `currency`: "BGN"
  - `num_items`: Total number of items purchased

---

## Complete E-commerce Funnel Tracking

The implementation covers the entire customer journey:

```
PageView → ViewContent → AddToCart → InitiateCheckout → Purchase
```

### Usage in Facebook Ads Manager

With these events, you can:

1. **Create Custom Audiences** based on:
   - People who viewed products
   - People who added to cart but didn't purchase
   - People who initiated checkout but didn't complete
   - Recent purchasers

2. **Set up Conversion Campaigns** optimizing for:
   - Add to Cart
   - Initiate Checkout
   - Purchase

3. **Track ROI** with:
   - Purchase value tracking
   - Cost per purchase
   - Return on ad spend (ROAS)

4. **Create Lookalike Audiences** from:
   - Purchasers
   - Add to cart users
   - High-value customers

---

## Testing the Pixel

### Option 1: Facebook Pixel Helper (Chrome Extension)

1. Install "Facebook Pixel Helper" from Chrome Web Store
2. Visit your website
3. Click the extension icon to see which events fire

### Option 2: Events Manager

1. Go to Facebook Events Manager
2. Select your Pixel
3. Go to "Test Events" tab
4. Enter your website URL
5. Perform actions and watch events appear in real-time

---

## Next Steps (Optional Enhancements)

### Additional Events You Could Add

1. **Search** - Track product searches (if you add search functionality)
2. **AddToWishlist** - If you add a wishlist feature
3. **Lead** - For newsletter signups or contact forms
4. **CompleteRegistration** - If you add user accounts

### Advanced Features

1. **Advanced Matching** - Add hashed email/phone when available
2. **Custom Conversions** - Define specific conversion events
3. **Dynamic Ads** - Use product catalog for retargeting
4. **Server-Side Events** - Add backup tracking via API

---

## Important Notes

- **Currency**: All events use BGN (Bulgarian Lev) as currency
- **Safety**: All pixel calls check if `fbq` is defined before firing
- **Privacy**: Ensure GDPR compliance with cookie consent
- **Testing**: Always test in Facebook Events Manager before running ads

## Files Modified

1. ✅ `candles/templates/candles/base_landing.html` - Pixel base code
2. ✅ `candles/static/candles/js/cart.js` - AddToCart event
3. ✅ `candles/static/candles/js/checkout.js` - InitiateCheckout & Purchase events
4. ✅ `candles/templates/candles/product_detail.html` - ViewContent event
