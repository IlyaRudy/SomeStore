from django.shortcuts import redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import json
from accounts.forms import UserRegistration
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.http import require_POST
from django.http import JsonResponse


class signup_login_view(LoginView):
    template_name = "signup-login.html"

class profile_view(LoginRequiredMixin, LoginView):
    template_name = "profile.html"

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

            if 'cart' in request.session:
                user.cart = request.session['cart']
                user.save()
                del request.session['cart']
                

            resp['status']='success'
        else:
            resp['msg'] = list(form.errors.values())
    return HttpResponse(json.dumps(resp),content_type='application/json')

@login_required
@require_POST
def update_profile(request):

    firstname = request.POST.get('firstname')
    lastname = request.POST.get('lastname')
    user = request.user

    user.first_name = firstname
    user.last_name = lastname
    user.save()

    return JsonResponse({'message': 'Профиль успешно обновлен.'}) 

@login_required
@require_POST
def update_avatar(request):

    image_file = request.FILES.get('image')
        
    if image_file:
        request.user.image = image_file
        request.user.save()
        
        return JsonResponse({'message': 'Картинка успешно обновлена'})   
