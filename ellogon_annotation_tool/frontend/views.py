import os

from django.shortcuts import render, redirect

# Create your views here.
from django.shortcuts import render

# Create your views here.
from django.views import View


def index(request):
    return render(request, 'frontend/index.html', context=None)


