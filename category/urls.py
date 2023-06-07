from django.urls import path

from .views import CategoryListView, SubCategoryListView


app_name = "category"
urlpatterns = [
    path("<slug:category_slug>", CategoryListView.as_view(), name="category"),
    path("<slug:category_slug>/<slug:subcategory_slug>", SubCategoryListView.as_view(), name="subcategory"),
]