from django.urls import path
from . import views

app_name = 'favorite'   

urlpatterns = [
    path('', views.favorite_detail, name='favorite_detail'),
    path('add/<int:product_id>/',
         views.favorite_add,
         name='favorite_add'),
    path('remove/<int:product_id>/',
         views.favorite_remove,
         name='favorite_remove'),
]