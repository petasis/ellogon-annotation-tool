from django.conf.urls import url
from django.urls import path
from .views import index

urlpatterns = [
    url(r'^.*/$', index, name='all_other_urls'),  # for all other urls
    path('',      index, name='empty')            # for the empty url
]
