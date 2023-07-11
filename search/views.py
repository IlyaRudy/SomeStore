from django.views.generic import ListView
from .documents import ProductDocument
from elasticsearch_dsl.query import MultiMatch
from django.http import JsonResponse
from main.models import Product
from django.views.decorators.http import require_GET


class SearchView(ListView):
    model = ProductDocument
    template_name = "search.html"
    context_object_name = "products"

    def get_queryset(self):
        query = self.request.GET.get('query', '')

        search_results = self.model.search().query(
            MultiMatch(
                query=query,
                fields=['title', 'card_title', 'brand_name', 'description', 'main_category.title', 'main_subcategory.title'],
                fuzziness='AUTO'
            )
        )

        return search_results
    
@require_GET
def text_input_prompts(request):
    query = request.GET.get('query', '')

    products = Product.objects.filter(title__icontains=query)
    results = [{'title': product.title} for product in products]
    results += [{'query': query}]

    return JsonResponse(results, safe=False)