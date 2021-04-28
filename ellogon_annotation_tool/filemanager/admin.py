from django.contrib import admin

# Register your models here.
from django.contrib import admin

# Register your models here.
from .models import Project, Collection, Document, Handler

admin.site.register(Project)
admin.site.register(Collection)
admin.site.register(Document)
admin.site.register(Handler)