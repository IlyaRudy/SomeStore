from django import template

register = template.Library()

@register.simple_tag  
def product_quantity(cart, product_id):
    return cart.get_product_quantity(product_id)