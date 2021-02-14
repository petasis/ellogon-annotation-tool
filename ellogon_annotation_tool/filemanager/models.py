from django.db import models
from django.conf import settings


class Project(models.Model):
    name          = models.CharField("Name", max_length=128)
    encoding      = models.CharField("Encoding", max_length=20, default="UTF-8")
    created       = models.DateTimeField("Date Created")
    updated       = models.DateTimeField("Date Updated")
    public        = models.BooleanField("Public", default=True)
    owner         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                      on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

class Collection(models.Model):
    name          = models.CharField("Name", max_length=128)
    encoding      = models.CharField("Encoding", max_length=20, default="UTF-8")
    handler       = models.CharField("Handler", max_length=128)
    created       = models.DateTimeField("Date Created")
    updated       = models.DateTimeField("Date Updated")
    public        = models.BooleanField("Public", default=False)
    owner         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                      on_delete=models.SET_NULL, null=True)
    project       = models.ForeignKey(Project,
                                      on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

class Document(models.Model):
    name          = models.CharField("Name", max_length=256)
    external_name = models.CharField("External Name", max_length=254)
    text          = models.TextField("text")
    encoding      = models.CharField("Encoding", max_length=20, default="UTF-8")
    handler       = models.CharField("Handler", max_length=128)
    length        = models.IntegerField("Length (chars)", default=0)
    created       = models.DateTimeField("Date Created")
    updated       = models.DateTimeField("Date Updated")
    updated_by    = models.ForeignKey(settings.AUTH_USER_MODEL,
                                      on_delete=models.SET_NULL,
                                      null=True,
                                      related_name="updated_by")
    public        = models.BooleanField("Public", default=False)
    owner         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                      on_delete=models.SET_NULL,
                                      null=True,
                                      related_name="owned_by")
    collection    = models.ForeignKey(Collection,
                                      on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name
