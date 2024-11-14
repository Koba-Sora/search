from django.shortcuts import render, get_object_or_404, redirect
from .models import Product, Category, CartItem
from .forms import ProductForm, SearchForm
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required



@login_required
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('product_list')
    else:
        form = ProductForm()

        return render(request, 'product_form.html', {'form': form})

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'product_detail.html', {'product': product})


@login_required
def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if product.user != request.user:
        return redirect('product_list')  # 編集権限がない場合、商品一覧ページにリダイレクト
    

    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
            return redirect('product_detail', pk=product.pk)
    else:
        form = ProductForm(instance=product)

    # product オブジェクトをテンプレートに渡す
    return render(request, 'product_form.html', {'form': form, 'product': product})


@login_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if product.user != request.user:
        return redirect('product_list')  # 編集権限がない場合、商品一覧ページにリダイレクト
    
    if request.method == 'POST':
        product.delete()
        return redirect('product_list')
    return render(request, 'product_confirm_delete.html', {'product': product})

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
    paginator = Paginator(results, 10)
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

    return redirect('search_app:cart_detail')

@login_required
def cart_detail(request):
    name = request.user
    cart_items = CartItem.objects.filter(user=request.user)
    total_price = sum(item.total_price() for item in cart_items)
    return render(request, 'cart_detail.html', {'name':name,'cart_items': cart_items, 'total_price': total_price})