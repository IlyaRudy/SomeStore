from decimal import Decimal
from django.conf import settings
from main.models import Product


class Favorite(object):

    def __init__(self, request):
        """
        Initialize favorite
        """
        self.session = request.session
        self.user = request.user if request.user.is_authenticated else "_AnonymousUser"
        if request.user.is_authenticated:
            self.favorite = request.user.favorite
        else:
            self.favorite = request.session.get('favorite', {})
            if 'favorite' not in request.session:
                request.session['favorite'] = self.favorite

    def __iter__(self):
        """
        Go through the items in the favorites and retrieve items from the database
        """
        product_ids = self.favorite.keys()
        # Receive goods and add them to favorite
        products = Product.objects.filter(id__in=product_ids)

        favorite = self.favorite.copy()
        for product in products:
            favorite[str(product.id)]['product'] = product

        for item in favorite.values():
            item['price'] = Decimal(item['price'])
            yield item
    
    def __len__(self):
        """
        Counting how many items in the favorite
        """
        return len(self.favorite.keys())

    def add(self, product):
        """
        Add an item to favorite
        """
        product_id = str(product.id)
        if product_id not in self.favorite:
            self.favorite[product_id] = {'price': str(product.price)}
                
        self.save_to_user(self.user)

    def remove(self, product):
        """
        Removing item from favorite
        """
        product_id = str(product.id)
        if product_id in self.favorite:
            del self.favorite[product_id]
            self.save_to_user(self.user)

    def get_products_ids(self):
        return [product_id for product_id in self.favorite.keys()]
    
    def is_product_in_favorite(self, product_id):
        return product_id in self.favorite.keys()
    
    def save_to_user(self, user):
        if user == "_AnonymousUser":
            self.session.modified = True
        else:
            user.favorite = self.favorite
            user.save()

        
    
