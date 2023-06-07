from django.db import models
from django.urls import reverse
from category.models import SubCategory, Category
from django.utils.text import slugify

# Create your models here.
def upload_to(instance, filename):
    return 'products/{0}/{1}/{2}/{3}'.format(instance.main_category, instance.main_subcategory, instance.title, filename)

def upload_to_images(instance, filename):
    return 'products/{0}/{1}/{2}/{3}'.format(instance.product.main_category, instance.product.main_subcategory, instance.product.title, filename)


class Product(models.Model):
    title = models.CharField('Название продукта', max_length=100)
    product_slug = models.SlugField(unique=True, blank=True, editable=False)
    card_title = models.CharField('Титульник карточки', max_length=100)
    price = models.IntegerField('Цена')
    brand_name = models.CharField('Название бренда', max_length=100 )
    main_subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, null=True, default='Subcategory') 
    main_category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, default='Main category')
    description = models.TextField('Описание')
    product_main_img = models.ImageField('Главное изображение продукта', upload_to=upload_to)

    def save(self, *args, **kwargs):
        self.product_slug = slugify(self.title)
        if self.title:
            self.product_main_img.upload_to = upload_to(self, self.product_main_img.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("main:product_detail", kwargs={"product_slug": self.product_slug})

class ImageModel(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='thumbnail_images')
    image = models.ImageField(upload_to=upload_to_images)

    def __str__(self):
        return self.image.name
    
    def save(self, *args, **kwargs):
        if self.product.title:
            self.image.upload_to = upload_to_images(self, self.image.name)
        super().save(*args, **kwargs)
    