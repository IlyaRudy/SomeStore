from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_http_methods
from main.models import Product
from .favorite import Favorite
from django.http import JsonResponse

@require_POST
def favorite_add(request, product_id):
    favorite = Favorite(request)
    data = {
        'message': '',
        'favorite_length': '',
    }
    if not favorite.is_product_in_favorite(product_id):
        product = get_object_or_404(Product, id=product_id)
        favorite.add(product=product)
    else:
        data['message'] = 'product already added'
    favorite_length = favorite.__len__()
    data['favorite_length'] = favorite_length   
    return JsonResponse(data)

@require_http_methods(["DELETE"])
def favorite_remove(request, product_id):
    favorite = Favorite(request)
    data = {
        'message': 'Product has been successfully deleted.',
        'favorite_length': '',
    }
    product = get_object_or_404(Product, id=product_id)
    favorite.remove(product)
    favorite_length = favorite.__len__()
    data['favorite_length'] = favorite_length 
    return JsonResponse(data)


def favorite_detail(request):
    return render(request, 'favorite_detail.html')