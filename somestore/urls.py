from django.contrib import admin
from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static
from search.views import SearchView


urlpatterns = [
    path('category/', include('category.urls')),
    path('account/', include('accounts.urls')),
    path('cart/', include('cart.urls')),
    path('search/', SearchView.as_view(), name='search'),
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
