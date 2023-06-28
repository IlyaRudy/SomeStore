from .models import Category, SubCategory

def category_subcategory(request):
    all_categories = Category.objects.all()
    all_subcategories = SubCategory.objects.all()
    return {
        'all_subcategories': all_subcategories,
        'all_categories': all_categories
    }
