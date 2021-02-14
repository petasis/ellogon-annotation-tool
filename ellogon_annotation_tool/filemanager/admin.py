from django.contrib import admin

from .models import Project, Collection, Document

admin.site.register(Project)
admin.site.register(Collection)
admin.site.register(Document)
