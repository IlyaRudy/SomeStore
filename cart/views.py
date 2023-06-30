from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from main.models import Product
from .cart import Cart
from django.http import JsonResponse

@require_POST
def cart_add(request, product_id):
    cart = Cart(request)
    data = {'product_quantity': '',
            'cart_length': '',
            }
    product = get_object_or_404(Product, id=product_id)
    quantity = request.POST.get('quantity')
    if quantity:
        cart.add(product=product,
                quantity=int(quantity))
        data['product_quantity'] = cart.get_product_quantity(product_id)
    else:
        cart.add(product=product)
    cart_length = cart.__len__()
    data['cart_length'] = cart_length   
    return JsonResponse(data)


def cart_remove(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product)
    return redirect('cart:cart_detail')

@login_required
def cart_detail(request):
    return render(request, 'cart_detail.html')