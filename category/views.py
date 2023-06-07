from django.shortcuts import get_object_or_404 
from django.views.generic import ListView
from .models import Category, SubCategory
from main.models import Product

class CategoryListView(ListView):
    template_name = "category.html"
    model = Category

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category = self.get_object()
        context['category'] = category
        subcategories = category.subcategory_set.all()
        context['subcategories'] = subcategories    
        return context
    
    def get_object(self, queryset=None):
        category_slug = self.kwargs.get('category_slug')
        return get_object_or_404(Category, category_slug=category_slug)
    
class SubCategoryListView(ListView):
    template_name = "subcategory.html"
    model = SubCategory

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['subcategory'] = self.get_object()

        category = self.get_objec_category()  
        subcategories = category.subcategory_set.all()
        context['subcategories'] = subcategories  

        return context

    def get_objec_category(self, queryset=None):
        category_slug = self.kwargs.get('category_slug')
        return get_object_or_404(Category, category_slug=category_slug)

    def get_object(self, queryset=None):
        subcategory_slug = self.kwargs.get('subcategory_slug')
        return get_object_or_404(SubCategory, subcategory_slug=subcategory_slug)
