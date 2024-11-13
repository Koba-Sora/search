from django.urls import path
from . import views

app_name = 'search_app'

urlpatterns = [
  path('', views.product_list,name='top'),
  path('search/', views.search_view, name='search_view'),
  path('product/new/', views.product_create, name='product_create'),
  path('product/<int:pk>/', views.product_detail, name='product_detail'),
  path('product/<int:pk>/edit/', views.product_update, name='product_update'),
  path('product/<int:pk>/delete', views.product_delete, name='product_delete'),
  path('product/', views.product_list, name='product_list'),
  path('cart/', views.cart_detail, name='cart_detail'),
  path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
]