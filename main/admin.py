from django.contrib import admin
from .models import Product, ImageModel, Review

class ImageInline(admin.TabularInline):
    model = ImageModel

class ProductAdmin(admin.ModelAdmin):
    inlines = [ImageInline]
    
admin.site.register(Product, ProductAdmin)
admin.site.register(Review)