from django.shortcuts import render, get_object_or_404, redirect
from .models import Product, Category, CartItem, Likelist
from .forms import ProductForm, SearchForm
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json  

def index(request):
    form = SearchForm(request.GET or None)
    return render(request, 'index.html',{'form': form,})

@login_required
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.user = request.user  # ログイン中のユーザーを設定
            product.save()
            return redirect('search_app:search_view')  # リダイレクト先を適切に変更
    else:
        form = ProductForm()
        return render(request, 'product_form.html', {'form': form})

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    imgs = product.images()  # images()メソッドを呼び出して画像リストを取得

    if request.user.is_authenticated:
        like_list = Likelist.objects.filter(user=request.user)
        product_in_likes = like_list.filter(product=product).exists()
        # お気に入りリストから該当商品を取得
        like_item = like_list.filter(product=product).first()
    else:
        like_list = None
        product_in_likes = False
        like_item = None

    return render(request, 'product_detail.html', {
        'product': product,
        'imgs': imgs,
        'like_list': like_list,
        'product_in_likes': product_in_likes,  # Pass the boolean flag
        'like_item': like_item,  # 追加: like_item を渡す
    })

@login_required
def product_update(request, pk):
    # 更新するProductを取得
    product = get_object_or_404(Product, pk=pk)

    if request.method == 'POST':
        # request.FILESも渡してフォームを作成
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()  # フォームを保存してデータベースに反映
            return redirect('search_app:product_detail', pk=product.pk)  # 更新後に詳細ページへリダイレクト
    else:
        # GETリクエストの場合、編集用のフォームを作成
        form = ProductForm(instance=product)

    # フォームとproductオブジェクトをテンプレートに渡す
    return render(request, 'product_form.html', {'form': form, 'product': product})



@login_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    if request.method == 'POST':
        product.delete()
        return redirect('search_app:search_view') 
    
    return render(request, 'search.html', {'product': product})

def product_list(request):
    products = Product.objects.all()
    return render(request, 'product_list.html', {'products': products})

def search_view(request):
    form = SearchForm(request.GET or None)
    results = Product.objects.all() # クエリセットの初期化
    if form.is_valid():
        query = form.cleaned_data['query']
        if query:
            results = results.filter(name__icontains=query) # ここでの filter はクエリセットに適用

    # カテゴリフィルタリング
    category_name = request.GET.get('category')
    if category_name:
        try:
            # カテゴリ名に基づいてカテゴリ ID を取得
            category = Category.objects.get(name=category_name) 
            results = results.filter(category_id=category.id)
        except Category.DoesNotExist:
            results = results.none() # 存在しないカテゴリの場合、結果を空にする 
            category = None

    # 価格のフィルタリング(最低価格・最高価格) 
    min_price = request.GET.get('min_price') 
    max_price = request.GET.get('max_price')
    if min_price:
        results = results.filter(price__gte=min_price) 
    if max_price:
        results = results.filter(price__lte=max_price)

    # 並び替え処理
    sort_by = request.GET.get('sort', 'name') 
    if sort_by == 'price_asc':
        results = results.order_by('price') 
    elif sort_by == 'price_desc':
        results = results.order_by('-price')

    # クエリセットをリストに変換せず、直接 Paginator に渡す
    paginator = Paginator(results, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'search.html', {'form': form, 'page_obj': page_obj, 'request': request})

@login_required
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return redirect(request.META.get('HTTP_REFERER',))

@login_required
def cart_detail(request):
    name = request.user
    cart_items = CartItem.objects.filter(user=request.user)
    total_price = sum(item.total_price() for item in cart_items)
    return render(request, 'cart_detail.html', {'name':name,'cart_items': cart_items, 'total_price': total_price})


def cart_update_quantity(request, cart_item_id):
    try:
        cart_item = get_object_or_404(CartItem, id=cart_item_id)
        
        if request.method == 'POST':
            data = json.loads(request.body)
            action = data.get('action')

            # action に基づく処理
            if action == 'increase':
                cart_item.quantity += 1
            elif action == 'decrease' and cart_item.quantity > 1:
                cart_item.quantity -= 1
            
            cart_item.save()

            total_price = sum(item.total_price() for item in CartItem.objects.filter(user=request.user))

            total_price = int(total_price)

            return JsonResponse({
                'status': 'success',
                'quantity': cart_item.quantity,
                'total_price': total_price  # 数値型で返す
            })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@login_required
def cart_remove_item(request, cart_item_id):
    cart_item = get_object_or_404(CartItem, id=cart_item_id)
    
    # カートアイテムを削除
    cart_item.delete()

    return redirect(request.META.get('HTTP_REFERER',))

# お気に入り登録機能
@login_required
def like_detail(request):
    name = request.user
    like_list = Likelist.objects.filter(user=request.user)

    return render(request,'like_detail.html',{'likelist':like_list, 'name':name,})

@login_required
def add_likelist(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    Likelist.objects.get_or_create(user=request.user, product=product)
    # return redirect('search_app:like_detail')
    # return redirect(request.META.get('HTTP_REFERER',))
    return redirect(request.META.get('HTTP_REFERER', '/'))

@login_required
def like_remove_item(request, like_item_id):
    like_item = get_object_or_404(Likelist, id=like_item_id, user=request.user)
    like_item.delete()
    # return redirect('search_app:like_detail')
    return redirect(request.META.get('HTTP_REFERER',))