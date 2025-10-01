from django.core.exceptions import PermissionDenied
from django.shortcuts import render, redirect
from .spreadsheet import append_to_sheet

# Create your views here.

def index(request,slug):
    if slug == 'halloween':
        return render(request, 'SpookyFun.html')
    else:
        raise PermissionDenied

def place_order(request , slug):

    pricing = {
        1:"12", # 1 candle
        2:"22", # 2 candles
        3:"30", # 3 candles
        4:"38", # 4 candles
    }
    if request.method == "POST":
        spreadsheet_row_data = []
        order_description : str

        full_name = request.POST['full_name']
        phone_number = request.POST['phone_number']
        delivery_address = request.POST['delivery_address']
        quantity = request.POST['quantity']
        if slug == 'halloween':
            order_description = f"Хелоуин тиква × {quantity}\nОбщо: {pricing[int(quantity)]} лв."
        price = pricing[int(quantity)]
        spreadsheet_row_data = [full_name, phone_number, delivery_address, order_description, "НЕ","НЕ"]
        append_to_sheet(spreadsheet_row_data)
        request.session["purchased"] = True
        return redirect("order-complete",slug="halloween")
def order_complete(request ,slug):
    if slug == 'halloween':
        if request.session.get("purchased"):
            return render(request, "order_placed.html")
        else:
            raise PermissionDenied
    else:
        raise PermissionDenied