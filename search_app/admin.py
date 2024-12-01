from django.contrib import admin
from .models import Category, Product ,CartItem , Likelist, PurchaseHistory


# モデルを管理画面に登録
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(Likelist)
admin.site.register(PurchaseHistory)

