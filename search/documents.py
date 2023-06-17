from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from main.models import Product
from category.models import Category, SubCategory

@registry.register_document
class ProductDocument(Document):
    main_subcategory = fields.ObjectField(properties={
        'title': fields.TextField(),
    })
    main_category = fields.ObjectField(properties={
        'title': fields.TextField(),
    })

    class Index:
        name = 'products'

    class Django:
        model = Product
        fields = [
            'title',
            'price',
            'product_slug',
            'card_title',
            'brand_name',
            'description',
            'product_main_img',
        ]
        related_models = [SubCategory, Category]

    def get_queryset(self):
        return super(ProductDocument, self).get_queryset().select_related(
            'main_subcategory',
            'main_category',
        )

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, SubCategory):
            return related_instance.product_set.all()
        elif isinstance(related_instance, Category):
            return related_instance.product_set.all()
