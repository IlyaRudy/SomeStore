from django.db import models
from django.conf import settings
from django.urls import reverse
from category.models import SubCategory, Category
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser
# Create your models here.
def upload_to(instance, filename):
    return 'products/{0}/{1}/{2}/{3}'.format(instance.main_category, instance.main_subcategory, instance.title, filename)

def upload_to_images(instance, filename):
    return 'products/{0}/{1}/{2}/{3}'.format(instance.product.main_category, instance.product.main_subcategory, instance.product.title, filename)


class User(AbstractUser):
    pass


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

class Review(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True, related_name='review_product') 
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Автор отзыва', blank=True, null=True)
    five_star_rating =  models.BigIntegerField('пятизвездочный рейтинг')
    text = models.TextField('Текст отызва')
    created_date = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to=upload_to_images, blank=True)
    five_star_rating_procent = models.BigIntegerField(null=True, blank=True, editable=False)
    

    def __str__(self):
        return f'Review #{self.pk} {self.author}'
    
    def save(self, *args, **kwargs):
        if self.product.title:
            self.image.upload_to = upload_to_images(self, self.image.name)
            self.five_star_rating_procent = self.five_star_rating * 20
        super().save(*args, **kwargs)
