from django.urls import path

from candles import views

urlpatterns = [
    path('',views.index,name='index'),
    path('cookies/', views.cookies, name='cookies'),
    path('privacy/', views.privacy, name='privacy'),
    path('tos/', views.tos, name='tos'),
    path('<slug:slug>/', views.halloween, name='halloween'),
    path('<slug:slug>/place-order/', views.place_order, name='place-order'),
    path('<slug:slug>/order-complete/', views.order_complete, name='order-complete'),





]