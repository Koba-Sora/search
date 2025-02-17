from django import forms
from .models import Profile 
from django.contrib.auth.forms import UserCreationForm

class UserRegisterForm(UserCreationForm):

    class Meta:
        model = Profile
        fields = ['username','email','password1', 'password2']
