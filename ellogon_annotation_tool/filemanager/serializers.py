from datetime import datetime

from rest_framework import serializers
from .models import Project, Collection, Document, Handler
from authentication.models import CustomUser

class ProjectSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    encoding = serializers.CharField(max_length=20, default="UTF-8")
    created = serializers.DateTimeField(default=datetime.now)
    updated = serializers.DateTimeField(default=datetime.now)
    public = serializers.BooleanField(default=True)
    owner = serializers.PrimaryKeyRelatedField( read_only=False ,queryset=CustomUser.objects.all())

    class Meta:
        model = Project
        fields = '__all__'


    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        instance.save()
        return instance





class CollectionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    encoding = serializers.CharField(max_length=20, default="UTF-8")
    handler = serializers.CharField(max_length=128)
    created = serializers.DateTimeField(default=datetime.now)
    updated = serializers.DateTimeField(default=datetime.now)
    public = serializers.BooleanField(default=False)
    owner = serializers.PrimaryKeyRelatedField( read_only=False ,queryset=CustomUser.objects.all())
    project = serializers.PrimaryKeyRelatedField( read_only=False ,queryset=Project.objects.all())

    class Meta:
        model = Collection
        fields = '__all__'

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        instance.save()
        return instance

class DocumentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=256)
    external_name = serializers.CharField(max_length=254)
    text = serializers.CharField()
    encoding = serializers.CharField(max_length=20, default="UTF-8")
    handler = serializers.CharField(max_length=128)
    length = serializers.IntegerField(default=0)
    created = serializers.DateTimeField(default=datetime.now)
    updated = serializers.DateTimeField(default=datetime.now)
    public = serializers.BooleanField( default=False)
    updated_by = serializers.PrimaryKeyRelatedField( read_only=False ,queryset=CustomUser.objects.all())


    owner = serializers.PrimaryKeyRelatedField( read_only=False ,queryset=CustomUser.objects.all())
    collection = serializers.PrimaryKeyRelatedField( read_only=False ,queryset=Collection.objects.all())

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.length=len(instance.text) # as long as the fields are the same, we can just use this

        instance.save()
        return instance

    class Meta:
        model = Document
        fields = '__all__'

class HandlerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    function_name=serializers.CharField(max_length=128)
    class Meta:
        model = Handler
        fields = '__all__'