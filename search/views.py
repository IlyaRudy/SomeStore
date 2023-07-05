from django.views.generic import ListView
from .documents import ProductDocument
from elasticsearch_dsl.query import MultiMatch


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