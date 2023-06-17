from django.contrib import admin
from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static
from search.views import SearchView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('category/', include('category.urls')),
    path('account/', include('accounts.urls')),
    path('search/', SearchView.as_view(), name='search'),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
