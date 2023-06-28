from django.db import models
from django.conf import settings
from django.urls import reverse
from category.models import SubCategory, Category
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser


def upload_to(instance, filename):
    return 'products/{0}/{1}/{2}/{3}'.format(instance.main_category, instance.main_subcategory, instance.title, filename)

def upload_to_images(instance, filename):
    return 'products/{0}/{1}/{2}/{3}'.format(instance.product.main_category, instance.product.main_subcategory, instance.product.title, filename)


class User(AbstractUser):
    pass


class Product(models.Model):
    title = models.CharField(max_length=100, db_index=True, verbose_name='Product title')
    product_slug = models.SlugField(unique=True, db_index=True, editable=False)
    card_title = models.CharField(max_length=100, blank=True, default='Card title', verbose_name='Card title')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Price')
    brand_name = models.CharField(max_length=100, blank=True, default='Brand name', verbose_name='Brand name')

    main_subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, null=True, default='Subcategory', verbose_name='SubCategory') 
    main_category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, default='Category', verbose_name='Category')

    description = models.TextField(max_length=1500, blank=True, default='Description', verbose_name='Description')
    product_main_img = models.ImageField(verbose_name='Product main image', upload_to=upload_to)
    available = models.BooleanField(default=True, verbose_name='Available')
    created = models.DateTimeField(auto_now_add=True, verbose_name='Created time')
    uploaded = models.DateTimeField(auto_now=True, verbose_name='Uploaded time')
    
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
    """ Review model for users review """
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
