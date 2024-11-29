from django import forms
from .models import Product

class SearchForm(forms.Form):
    query = forms.CharField(
        label='検索キーワード',
        label_suffix="",
        max_length=100, # CharField で max_length が有効です
        required=False,
        widget=forms.TextInput(attrs={'placeholder': '検索したいキーワ ードを入力','class': 'search-input'})
)
    
class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category','quantity','img1','img2','img3']

        labels = {
            'name': '商品名',
            'description': '商品説明',
            'price': '価格',
            'category': 'カテゴリ',
            'quantity': '数量',
            'img1': '画像1 (任意)',
            'img2': '画像2 (任意)',
            'img3': '画像3 (任意)',
        }
    