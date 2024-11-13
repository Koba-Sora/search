from django.shortcuts import render, redirect
from .forms import UserRegisterForm
from django.contrib import messages
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth.forms import AuthenticationForm

def signup_view(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'{username}さん、アカウントが作成されました！')
            return redirect('login')  # ログインページへリダイレクト
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
            # ログイン成功後のリダイレクト先
            return redirect('search_app:search_view')  # success_urlを指定
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html',{'form': form})

def logout_view(request):
    logout(request)
    return redirect('search_app:search_view') 