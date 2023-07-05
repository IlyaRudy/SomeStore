from decimal import Decimal
from django.conf import settings
from main.models import Product


class Cart(object):

    def __init__(self, request):
        """
        Initialize cart
        """
        self.session = request.session
        self.user = request.user if request.user.is_authenticated else "_AnonymousUser"
        if request.user.is_authenticated:
            self.cart = request.user.cart
        else:
            self.cart = request.session.get('cart', {})
            if 'cart' not in request.session:
                request.session['cart'] = self.cart

    def __iter__(self):
        """
        Go through the items in the cart and retrieve items from the database
        """
        product_ids = self.cart.keys()
        # Receive goods and add them to cart
        products = Product.objects.filter(id__in=product_ids)

        cart = self.cart.copy()
        for product in products:
            cart[str(product.id)]['product'] = product

        for item in cart.values():
            item['price'] = Decimal(item['price'])
            item['total_price'] = item['price'] * item['quantity']
            yield item
    
    def __len__(self):
        """
        Counting how many items in the cart
        """
        return sum(item['quantity'] for item in self.cart.values())

    def add(self, product, quantity=1):
        """
        Add an item to cart or update the quantity.
        """
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {'quantity': 0,
                                      'price': str(product.price)}
        self.cart[product_id]['quantity'] += quantity
        if self.cart[product_id]['quantity'] < 1:
            del self.cart[product_id]
                
        self.save_to_user(self.user)

    def remove(self, product):
        """
        Removing a product
        """
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save_to_user(self.user)

    def get_total_price(self):
        # get the total price
        return sum(Decimal(item['price']) * item['quantity'] for item in self.cart.values())
    
    def get_products_ids(self):
        return [product_id for product_id in self.cart.keys()]
    
    
    def get_product_quantity(self, product_id):
        product_id = str(product_id)
        if product_id in self.cart.keys():
            return self.cart[product_id]['quantity']
        return 0
    

    def clear(self):
        if self.cart_key != settings.CART_SESSION_ID:
            del self.session[self.cart_key]
            self.save_to_user(self.user)

    def save_to_user(self, user):
        if user == "_AnonymousUser":
            self.session.modified = True
        else:
            user.cart = self.cart
            user.save()

        
    
