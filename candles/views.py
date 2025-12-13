from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import datetime
import random
from .data import CANDLES, get_candle_by_slug
from .sheets_service import submit_order

# Create your views here.
def index(request):
    """Redirect root to the main Christmas candle."""
    return redirect('product_detail', slug='sweet-chocolate')

def product_detail(request, slug):
    """Render the landing page for a specific candle."""
    candle = get_candle_by_slug(slug)
    if not candle:
        # Fallback to main candle if slug not found, or 404
        return redirect('product_detail', slug='sweet-chocolate')
    
    context_candle = candle.copy()
    context_candle['price_eur'] = "{:.2f}".format(candle['price'] / 1.95583)
    context_candle['price_plain'] = "{:.2f}".format(candle['price']) # Safe for JS
    
    context_all_candles = []
    for c in CANDLES:
        c_copy = c.copy()
        c_copy['price_eur'] = "{:.2f}".format(c['price'] / 1.95583)
        c_copy['price_plain'] = "{:.2f}".format(c['price']) # Safe for JS
        context_all_candles.append(c_copy)

    context = {
        'candle': context_candle,
        'all_candles': context_all_candles, 
    }
    return render(request, 'candles/product_detail.html', context)

def secret_shop(request):
    """Hidden page for viewing only upsell items."""
    upsells = [c for c in CANDLES if c.get('is_upsell', False)]
    
    # Calculate EUR prices
    for c in upsells:
        c['price_eur'] = "{:.2f}".format(c['price'] / 1.95583)

    context_all_candles = []
    for c in CANDLES:
        c_copy = c.copy()
        c_copy['price_eur'] = "{:.2f}".format(c['price'] / 1.95583)
        c_copy['price_plain'] = "{:.2f}".format(c['price']) # Safe for JS
        context_all_candles.append(c_copy)

    context = {
        'candles': upsells,
        'all_candles': context_all_candles # Needed for cart drawer or other global components
    }
    return render(request, 'candles/secret_shop.html', context)

@csrf_exempt # For simplicity in this demo, though CSRF token is better
@require_POST
def submit_order_api(request):
    """Handle order submission via AJAX."""
    try:
        data = json.loads(request.body)
        
        # Generated Order ID
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M")
        rand_digits = random.randint(1000, 9999)
        order_id = f"KAT-{timestamp}-{rand_digits}"
        
        # Prepare data for Google Sheet
        # Expecting data format: 
        # {
        #   "name": "...", "phone": "...", "address": "...", 
        #   "items": [...], "totalItems": 3, "subtotal": 45, 
        #   "discount": 9, "total": 36
        # }
        
        # Format: Item × Qty (newline separated)
        items_str = "\n".join([f"{item['name']} × {item['quantity']}" for item in data.get('items', [])])
        
        # Add Total and ID at the bottom
        order_details = f"{items_str}\n\nОбщо: {data.get('total')} лв.\nID: {order_id}"

        sheet_row = [
            data.get('name'),         # ИМЕ
            data.get('phone'),        # ТЕЛЕФОН
            data.get('address'),      # АДРЕС
            order_details,            # ПОРЪЧКА
            "НЕ",                     # ПОТВЪРДЕНА (Default: No)
            "НЕ"                      # ИЗПЪЛНЕНА (Default: No)
        ]
        
        success = submit_order(sheet_row)
        
        if success:
            return JsonResponse({'success': True, 'order_id': order_id})
        else:
            return JsonResponse({'success': False, 'error': 'Failed to save to Google Sheets'}, status=500)

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

def cookies(request):
    return render(request, "cookies.html")

def tos(request):
    return render(request, "tos.html")
