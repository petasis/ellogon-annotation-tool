from datetime import datetime

from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import CustomUser
from .models import Project, Collection, Document
from .serializers import ProjectSerializer, CollectionSerializer, DocumentSerializer


class ProjectCreate(APIView):
    def post(self, request, format='json'):
        # print(request.data['email']+","+request.data["username"])
        # return Response(request.data, status=status.HTTP_201_CREATED)

        try:
             data=request.data
             owner=CustomUser.objects.get(email=data["owner"])
             data["owner"]=owner.pk
        except Exception as e:
            print(e)
            return Response({"created":"failed"}, status=status.HTTP_400_BAD_REQUEST)
        print(data)
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            project = serializer.save()
            if project:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectUpdate(GenericAPIView, UpdateModelMixin):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    update_fields=["name","public","encoding"]
    def put(self, request):
        try:
            owner = CustomUser.objects.get(email=request.data['email'])
            project = self.queryset.get(name=request.data["current_name"], owner=owner)
        except Exception as e:
            return Response(data={"create": False}, status=status.HTTP_400_BAD_REQUEST)

        data={}
        for field in self.update_fields:
                if field in request.data.keys():
                    data[field]=request.data[field]
        if not data:
            print(3)
            return Response(data={"updated": False}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data["updated"]=datetime.now()
            serializer = self.serializer_class(project, data=data, partial=True)
            if serializer.is_valid():
                project=serializer.save()
                if project:
                    #json = serializer.data
                    return Response(data={"updated": True}, status=status.HTTP_200_OK)
            return Response(data={"updated": False}, status=status.HTTP_400_BAD_REQUEST)


class ProjectDelete(APIView):
    def post(self, request):
        try:
            owner = CustomUser.objects.get(email=request.data['email'])
            project = Project.objects.filter(name=request.data["name"], owner=owner)
            if (not project.exists()):
                print(1)
                return Response(data={"deleted": False}, status=status.HTTP_200_OK)
        except Exception as e:
            print("e:"+str(e))
            return Response(data={"deleted": False}, status=status.HTTP_200_OK)

        project.delete()
        return Response(data={"deleted": True}, status=status.HTTP_200_OK)

class CollectionCreate(APIView):
    def post(self, request, format='json'):
        # print(request.data['email']+","+request.data["username"])
        # return Response(request.data, status=status.HTTP_201_CREATED)

        try:
             data=request.data
             owner=CustomUser.objects.get(email=data["owner"])
             data["owner"]=owner.pk
             project = Project.objects.filter(name=request.data["project"], owner=owner)
             data["project"]=(project.get()).pk
        except Exception as e:
             return Response(data={"create": False}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CollectionSerializer(data=data)
        if serializer.is_valid():
            collection = serializer.save()
            if collection:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CollectionUpdate(GenericAPIView, UpdateModelMixin):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    update_fields=["name","public","encoding","handler"]
    def put(self, request):
        try:
            owner = CustomUser.objects.get(email=request.data['email'])
            print(owner)
            project = (Project.objects.filter(name=request.data["project"], owner=owner)).get()
            print(project)
            collection = self.queryset.get(name=request.data["current_name"], owner=owner,project=project)
            print(collection)
        except Exception as e:
            print(e)
            return Response(data={"updated": False}, status=status.HTTP_404_NOT_FOUND)

        data={}
        for field in self.update_fields:
                if field in request.data.keys():
                    data[field]=request.data[field]
        if not data:
            #print(3)
            return Response(data={"updated": False}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data["updated"]=datetime.now()
            serializer = self.serializer_class(collection, data=data, partial=True)
            if serializer.is_valid():
                collection=serializer.save()
                if collection:
                    #json = serializer.data
                    return Response(data={"updated": True}, status=status.HTTP_200_OK)
            return Response(data={"updated": False}, status=status.HTTP_400_BAD_REQUEST)


class CollectionDelete(APIView):
    def post(self, request):
        try:
            owner = CustomUser.objects.get(email=request.data['email'])
            project = (Project.objects.filter(name=request.data["project"], owner=owner)).get()
            collection = Collection.objects.filter(name=request.data["name"], owner=owner, project=project)
            if (not collection.exists()):
                print(1)
                return Response(data={"deleted": False}, status=status.HTTP_200_OK)
        except Exception as e:
            print("e:"+str(e))
            return Response(data={"deleted": False}, status=status.HTTP_200_OK)

        collection.delete()
        return Response(data={"deleted": True}, status=status.HTTP_200_OK)

class DocumentUpload(APIView):
        def post(self, request, format='json'):
            # print(request.data['email']+","+request.data["username"])
            # return Response(request.data, status=status.HTTP_201_CREATED)

            try:
                data = request.data
                owner = CustomUser.objects.get(email=data["owner"])
                data["owner"] = owner.pk
                data["updated_by"]=owner.pk
                project = (Project.objects.filter(name=request.data["project"], owner=owner)).get()
                data['project']=project.pk
                collection = Collection.objects.filter(name=request.data["collection"], owner=owner,project=project)
                data["collection"] = (collection.get()).pk
            except Exception as e:
                print("xxx")
                return Response(data={"create": False}, status=status.HTTP_400_BAD_REQUEST)
            serializer = DocumentSerializer(data=data)
            if serializer.is_valid():
                document = serializer.save()
                if document:
                    json = serializer.data
                    return Response(json, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentUpdate(GenericAPIView, UpdateModelMixin):
        queryset = Document.objects.all()
        serializer_class = DocumentSerializer
        update_fields = ["name", "public", "encoding", "handler","updated_by"]

        def put(self, request):

            try:
                owner = CustomUser.objects.get(email=request.data['email'])
                print(owner)
                project = (Project.objects.filter(name=request.data["project"], owner=owner)).get()
                collection = (Collection.objects.filter(name=request.data["collection"], owner=owner, project=project)).get()
                document = self.queryset.get(name=request.data["current_name"],collection=collection,owner=owner,project=project)
               # print(document)
            except Exception as e:
                #print(e)
                return Response(data={"updated": False}, status=status.HTTP_404_NOT_FOUND)

            data = {}
            for field in self.update_fields:
                if field in request.data.keys():
                    if (field == "updated_by"):
                        data[field] = (CustomUser.objects.get(email=request.data['email'])).pk
                        continue
                    data[field] = request.data[field]

            if not data:

                return Response(data={"updated": False}, status=status.HTTP_400_BAD_REQUEST)
            else:
                data["updated"] = datetime.now()

                serializer = self.serializer_class(document, data=data, partial=True)
                if serializer.is_valid():

                    print(serializer.validated_data)
                    document = serializer.save()
                    if document:
                        # json = serializer.data
                        return Response(data={"updated": True}, status=status.HTTP_200_OK)
                print(serializer.errors)
                return Response(data={"updated": False}, status=status.HTTP_400_BAD_REQUEST)

class DocumentDelete(APIView):
        def post(self, request):
            try:
                owner = CustomUser.objects.get(email=request.data['email'])
                project = (Project.objects.filter(name=request.data["project"], owner=owner)).get()
                collection = (Collection.objects.filter(name=request.data["collection"], owner=owner, project=project)).get()
                document=Document.objects.filter(name=request.data["name"],owner=owner,collection=collection,project=project)
                if (not document.exists()):

                    return Response(data={"deleted": False}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response(data={"deleted": False}, status=status.HTTP_200_OK)

            document.delete()
            return Response(data={"deleted": True}, status=status.HTTP_200_OK)

class RetrieveUserData(APIView):
    def get(self,request,email):

        try:
            owner=CustomUser.objects.get(email=email)
            projects=Project.objects.filter(owner=owner)
            userdata=[]
            precord={}
            crecord={}
            for project in projects:
                precord['project']=project.name
                precord["collections"]=[]
                collections=Collection.objects.filter(owner=owner,project=project)
                for collection in collections:
                    crecord["collection"]=collection.name
                    crecord["documents"]=[]
                    documents=Document.objects.filter(owner=owner,project=project,collection=collection)
                    for document in documents:
                       # print(document.name)
                        crecord["documents"].append(document.name)
                    precord["collections"].append(crecord)
                    crecord={}
                userdata.append(precord)
                precord={}
        except Exception as ex:
         #   print(ex)
           return Response(data={"userdata": "not found"}, status=status.HTTP_404_NOT_FOUND)
        #print(userdata)
        return Response(data={"userdata": userdata}, status=status.HTTP_200_OK)










