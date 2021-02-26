from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True, blank=False)
    email    = models.EmailField('Email Address', unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
