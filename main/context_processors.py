from .models import Product


def product(request):
    all_products = Product.objects.all()
    return {'all_products': all_products}
