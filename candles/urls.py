from django.urls import path
from candles import views

urlpatterns = [
    path('', views.index, name='index'),
    path('cookies/', views.cookies, name='cookies'),
    path('tos/', views.tos, name='tos'),
    
    # API endpoints
    path('api/orders/', views.submit_order_api, name='submit-order'),
    
    # Product pages - Catch-all for slugs at the end
    path('secret-shop/', views.secret_shop, name='secret_shop'), # Before slug catch-all
    path('candles/<slug:slug>/', views.product_detail, name='product_detail'),
]