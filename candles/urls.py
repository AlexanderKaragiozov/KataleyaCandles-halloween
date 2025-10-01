from django.urls import path

from candles import views

urlpatterns = [
    path('<slug:slug>/', views.index, name='index'),
    path('<slug:slug>/place-order/', views.place_order, name='place-order'),
    path('<slug:slug>/order-complete/', views.order_complete, name='order-complete')
]