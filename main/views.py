from datetime import timezone
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, ListView
from .models import Product, Review
from .forms import ReviewForm
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Avg

class MainListView(ListView):
    model = Product
    template_name = "index.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        #Getting products in the current subcategory for pagination
        context['product_list'] = Product.objects.all()
        paginator = Paginator(context['product_list'], 2)
        page = self.request.GET.get('page')
        try:
            context['product_list'] = paginator.page(page)
        except PageNotAnInteger:
            context['product_list'] = paginator.page(1)
        except EmptyPage:
            context['product_list'] = paginator.page(paginator.num_pages)    

        return context
    

class ProductDetailView(DetailView):
    model = Product
    template_name = "product-page.html"
    slug_url_kwarg = "product_slug"
    

    def post(self, request, product_slug):
        form = ReviewForm(request.POST)
        image_add = False
        if form.is_valid():
            five_star_rating = form.cleaned_data['five_star_rating']
            text = form.cleaned_data['comment']
            author = request.user
            product = get_object_or_404(Product, product_slug=product_slug) 

            review = Review(five_star_rating=int(five_star_rating), text=text, author=author, product=product)
            if 'image' in request.FILES:
                review.image = request.FILES['image']
                image_add = True
            
            review.save()
            response_data = {
                'message': 'Отзыв успешно добавлен.',
                'status': 'success',
                'review_data': {
                    'five_star_rating_procent': str(review.five_star_rating_procent),
                    'text': review.text,
                    'author': str(review.author),
                    'created_date': review.created_date,
                },
                'product_slug': product_slug,
            }
            if image_add:
                response_data['review_data']['review_image_url'] = review.image.url
            else:
                response_data['review_data']['review_image_url'] = ''
        else:
            for field_name, value in request.POST.items():
                print(f"{field_name}: {value}")
            response_data = {       
                'status': 'failed',
                'errors': form.errors,
                'product_slug': product_slug,
            }

        return JsonResponse(response_data)
    
    def get(self, request, product_slug):
        form_submitted = False
        author = request.user if request.user.is_authenticated else None
        product = get_object_or_404(Product, product_slug=product_slug) 
        if Review.objects.filter(product=product, author=author).exists():
            form_submitted = True
        self.form_submitted = form_submitted 
        return super().get(request)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.get_object() 
        context['product'] = product

        reviews = product.review_product.all().order_by('-created_date')
        if reviews:
            average_rating = reviews.aggregate(Avg('five_star_rating'))
            average_rating_value = average_rating['five_star_rating__avg']

            average_rating_procent = reviews.aggregate(Avg('five_star_rating_procent'))
            average_rating_procent_value = average_rating_procent['five_star_rating_procent__avg']
        else:
            average_rating_procent_value = 0
            average_rating_value = 0.0

        context['reviews'] = reviews
        context['reviews_average_rating_procent_value'] = average_rating_procent_value
        context['reviews_average_rating_value'] = average_rating_value

        form = ReviewForm()
        context['form'] = form
        context['form_submitted'] = self.form_submitted
        return context
    
    def get_object(self, queryset=None):
        product_slug = self.kwargs.get('product_slug')
        return get_object_or_404(Product, product_slug=product_slug)