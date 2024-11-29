from django.urls import path
from . import views

app_name = 'search_app'

urlpatterns = [
  # path('', views.product_list,name='top'),
  path('', views.index,name='home'),
  # path('', views.search_view,name='top'),
  path('search/', views.search_view, name='search_view'),
  path('product/new/', views.product_create, name='product_create'),
  path('product/<int:pk>/', views.product_detail, name='product_detail'),
  path('product/<int:pk>/edit/', views.product_update, name='product_update'),
  path('product/<int:pk>/delete', views.product_delete, name='product_delete'),
  path('product/', views.product_list, name='product_list'),
  path('cart/', views.cart_detail, name='cart_detail'),
  path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
  path('cart/update/<int:cart_item_id>/', views.cart_update_quantity, name='cart_update_quantity'),
  path('cart/remove/<int:cart_item_id>/', views.cart_remove_item, name='cart_remove_item'),
  path('like/', views.like_detail, name='like_detail'),
  path('like/add/<int:product_id>/', views.add_likelist, name='add_to_like'),
  path('like/remove/<int:like_item_id>/', views.like_remove_item, name='like_remove_item'),
  path('cart/update-quantity/<int:cart_item_id>/', views.cart_update_quantity, name='cart_update_quantity'),


]