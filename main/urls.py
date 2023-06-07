from django.urls import path

from .views import ProductDetailView, MainListView

app_name = "main"
urlpatterns = [
    path("", MainListView.as_view(), name="index"),
    path("<slug:product_slug>", ProductDetailView.as_view(), name="product_detail"),
]