from django.shortcuts import render, redirect
from .forms import UserRegisterForm
from django.contrib import messages
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth.forms import AuthenticationForm
from django.utils.http import url_has_allowed_host_and_scheme

def signup_view(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'{username}さん、アカウントが作成されました！')
            return redirect('accounts_app:login')  # ログインページへリダイレクト
    else:
        form = UserRegisterForm()
    return render(request, 'accounts/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            # ユーザー認証
            user = form.get_user()
            login(request, user)
            # リダイレクト先を決定
            next_url = request.GET.get('next')  # 'next'パラメータを取得
            if next_url and  url_has_allowed_host_and_scheme(next_url, allowed_hosts=request.get_host()):
                return redirect(next_url)
            
            return redirect('search_app:search_view') 

    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html',{'form': form})

def logout_view(request):
    logout(request)
    next_url = request.META.get('HTTP_REFERER', '/')

    logout(request)  # ユーザーをログアウト
    return redirect(next_url)