from django.contrib import admin
from .models import Product ,CartItem # 登録したいモデルをインポート

# モデルを管理画面に登録
admin.site.register(Product)
admin.site.register(CartItem)