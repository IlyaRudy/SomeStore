from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, ListView
from .models import Product 

class MainListView(ListView):
    model = Product
    template_name = "index.html"
    

class ProductDetailView(DetailView):
    model = Product
    template_name = "product-page.html"
    slug_url_kwarg = "product_slug"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['product'] = self.get_object()                    
        return context


    def get_object(self, queryset=None):
        product_slug = self.kwargs.get('product_slug')
        return get_object_or_404(Product, product_slug=product_slug)