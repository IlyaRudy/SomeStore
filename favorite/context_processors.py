from .favorite import Favorite


def favorite(request):
    favorite = Favorite(request)
    return {
        'favorite': favorite,
        }