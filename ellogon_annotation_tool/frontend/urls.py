from django.conf.urls import url
from django.urls import path
from .views import index

urlpatterns = [
    url(r'^.*/$', index),  # for all other urls
    path('', index)        # for the empty url
]
