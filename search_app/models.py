from django.db import models
from accounts.models import Profile 
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)# 1はカテゴリID
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="products")  # 外部キーを追加
    quantity = models.PositiveIntegerField(default=1)
    img1 = models.ImageField(default='images/default.jpeg')
    img2 = models.ImageField(blank=True,null=True)
    img3 = models.ImageField(blank=True,null=True)
    # sales_figures = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
    
    def images(self):
        imgs = [self.img1,self.img2,self.img3]
        return imgs
    
class CartItem(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(default=timezone.now)

    def total_price(self):
        return self.product.price * self.quantity
    
class Likelist(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(default=timezone.now)
    