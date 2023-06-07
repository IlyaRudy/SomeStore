from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate, login, logout
import json
from accounts.forms import UserRegistration
from django.contrib.auth.models import User


class signup_login_view(LoginView):
    template_name = "signup-login.html"


def login_user(request):
    logout(request)
    resp = {"status":'failed','msg':''}
    username = ''
    password = ''
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                resp['status']='success'
            else:
                resp['msg'] = "Incorrect username or password"
        else:
            resp['msg'] = "Incorrect username or password"
    return HttpResponse(json.dumps(resp),content_type='application/json')
 

def logoutuser(request):
    logout(request)
    return redirect('main:index')
 

def register_user(request):
    resp = {"status":'failed','msg':''}
    if request.method == "POST":
        data = request.POST
        form = UserRegistration(data)
        if form.is_valid():
            form.save()
            username = request.POST['username']
            password1 = request.POST['password1']
            user = authenticate(username=username, password=password1)
            login(request, user)
            resp['status']='success'
        else:
            resp['msg'] = list(form.errors.values())
    return HttpResponse(json.dumps(resp),content_type='application/json')
