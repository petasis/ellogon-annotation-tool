from django.db import models
#import sys
#sys.path.insert(0, '../authentication/')
from authentication.models import CustomUser
#/home/alex/PycharmProjects/django_jwt_react/django_jwt_react/annotation_tool/annotation_tool/settings.py
from datetime import datetime
class Project(models.Model):
    name          = models.CharField("Name", max_length=128)
    encoding      = models.CharField("Encoding", max_length=20, default="UTF-8")
    created       = models.DateTimeField("Date Created",default=datetime.now)
    updated       = models.DateTimeField("Date Updated",default=datetime.now)
    public        = models.BooleanField("Public", default=True)
    owner         = models.ForeignKey(CustomUser,
                                      on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'owner',)


#data={"name":"project1","encoding":"ASCII","public":false,"owner":"anto2520293@gmail.com"}



class Collection(models.Model):
    name          = models.CharField("Name", max_length=128)
    encoding      = models.CharField("Encoding", max_length=20, default="UTF-8")
    handler       = models.CharField("Handler", max_length=128)
    created       = models.DateTimeField("Date Created",default=datetime.now)
    updated       = models.DateTimeField("Date Updated",default=datetime.now)
    public        = models.BooleanField("Public", default=False)
    owner         = models.ForeignKey(CustomUser,
                                      on_delete=models.SET_NULL, null=True)
    project       = models.ForeignKey(Project,
                                      on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'owner','project')


class Document(models.Model):
    name          = models.CharField("Name", max_length=256)
    external_name = models.CharField("External Name", max_length=254)
    text          = models.TextField("text")
    encoding      = models.CharField("Encoding", max_length=20, default="UTF-8")
    handler       = models.CharField("Handler", max_length=128)
    length        = models.IntegerField("Length (chars)", default=0)
    created       = models.DateTimeField("Date Created",default=datetime.now)
    updated       = models.DateTimeField("Date Updated",default=datetime.now)

    public = models.BooleanField("Public", default=False)
    updated_by    = models.ForeignKey(CustomUser,
                                      on_delete=models.SET_NULL,
                                      null=True,
                                      related_name="updated_by")
    #
    #name = models.CharField("Public", max_length=256)
    owner         = models.ForeignKey(CustomUser,
                                      on_delete=models.SET_NULL,
                                      null=True,
                                      related_name="owned_by")
    collection    = models.ForeignKey(Collection,on_delete=models.CASCADE, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'owner','collection','project')

class Handler(models.Model):
    auto_increment_id = models.AutoField(primary_key=True)
    name = models.CharField("Name", max_length=128,unique=True)
    function_name=models.CharField("FunctionName", max_length=128)