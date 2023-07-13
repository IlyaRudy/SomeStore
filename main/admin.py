from django.contrib import admin
from .models import Product, ImageModel, Review, User
from django.utils.safestring import mark_safe
from django.contrib.auth.admin import UserAdmin

class ImageInline(admin.TabularInline):
    model = ImageModel

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ImageInline]
    list_display = ['title', 'image_show', 'price', 'brand_name', 'main_category', 'main_subcategory', 'available', 'created', 'uploaded']
    list_filter = ['main_category', 'main_subcategory', 'available', 'created', 'uploaded', 'brand_name']
    list_editable = ['price','available']
    
    def image_show(self, obj):
        if obj.product_main_img:
            return mark_safe(f"<img src ='{obj.product_main_img.url}' width='80' />")
        return "None"
    
    image_show.__name__ = 'Image'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'author', 'five_star_rating', 'text', 'created_date']
    list_filter = ['product', 'author', 'five_star_rating', 'created_date']
    list_editable = ['five_star_rating', 'text',]

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'cart', 'favorite', 'image')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('cart', 'favorite', 'image')}),
    )

admin.site.register(User, CustomUserAdmin)