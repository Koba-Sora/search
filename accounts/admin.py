# accounts/admin.py
from django.contrib import admin
from .models import Profile

# @admin.register(Profile)
# class ProfileAdmin(admin.ModelAdmin):
#     list_display = ['username', 'email',]  # 表示したいフィールドを追加

admin.site.register(Profile)