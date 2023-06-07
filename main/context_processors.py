from .models import Product
from category.models import Category, SubCategory

def Category_Subcategory_Product(request):
    all_products = Product.objects.all()
    all_categories = Category.objects.all()
    all_subcategories = SubCategory.objects.all()

    return {
        'all_products': all_products,
        'all_subcategories': all_subcategories,
        'all_categories': all_categories,
    }
