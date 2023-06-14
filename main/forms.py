from django import forms

class ReviewForm(forms.Form):
    RATING_CHOICES = (
        (1, '1 gwiazdka'),
        (2, '2 gwiazdki'),
        (3, '3 gwiazdki'),
        (4, '4 gwiazdki'),
        (5, '5 gwiazdek'),
    )

    five_star_rating = forms.ChoiceField(choices=RATING_CHOICES, widget=forms.RadioSelect)
    comment = forms.CharField(widget=forms.Textarea)