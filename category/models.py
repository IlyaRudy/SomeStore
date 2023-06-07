from django.db import models
from django.urls import reverse
from django.utils.text import slugify




class Category(models.Model):
    title = models.CharField('Название категории', max_length=100)
    category_slug = models.SlugField(unique=True, blank=True, editable=False)
    category_icon = models.CharField('Класс иконки', max_length=50)
    category_image = models.ImageField('Главное изображение категории', upload_to='category/', default='category/category.png')

    def save(self, *args, **kwargs):
        self.category_slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("category:category", kwargs={"category_slug": self.category_slug})

class SubCategory(models.Model):
    title = models.CharField('Название подкатегории', max_length=100)
    main_category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory_slug = models.SlugField(unique=True, blank=True, editable=False)

    def save(self, *args, **kwargs):
        self.subcategory_slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse("category:subcategory", kwargs={"category_slug": self.main_category.category_slug, "subcategory_slug": self.subcategory_slug})
    
   