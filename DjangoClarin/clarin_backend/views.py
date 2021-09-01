import os
from datetime import datetime

import requests
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.template.loader import get_template
from django.views import View
from rest_framework.exceptions import ValidationError
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .handlers import HandlerClass
from .send_email import EmailAlert
from django.contrib.sites.shortcuts import get_current_site
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer, SharedCollectionsSerializer, \
    OpenDocumentsSerializer, ButtonAnnotatorsSerializer, CoreferenceAnnotatorsSerializer, CollectionsSerializer, \
    DocumentsSerializer
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.contrib.sites.shortcuts import get_current_site
from .utils import account_activation_token, invitation_token, get_collection_handle
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from .models import Users, Collections, SharedCollections, OpenDocuments, Documents, ButtonAnnotators, \
    CoreferenceAnnotators
from .utils import db_handle, mongo_client

from bson.objectid import ObjectId
from django.forms.models import model_to_dict
import jwt
from django.db.models import Q


class ObtainTokenPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer







class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        # print('email:', request.data['email'], ", username:", request.data["username"],
        #       ', password:', request.data["password"])
        # return Response(request.data, status=status.HTTP_201_CREATED)
        ## TODO: protect on error!
        print(request.data)
        data = {"email": request.data['email'], "first_name": request.data["first_name"],"last_name": request.data["last_name"],
                "password": request.data["password"], "username": request.data["first_name"]+"_"+request.data["last_name"]}
        serializer = CustomUserSerializer(data=data)
        print(1)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                print(2)
                try:
                    ## Send an e-mail for activating the user!
                    json = serializer.data
                    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                    # id     = force_text(urlsafe_base64_decode(uidb64))
                   # domain = get_current_site(request).domain
                    token = account_activation_token.make_token(user)
                    link = reverse('user_activate', kwargs={'uidb64': uidb64, 'token': token})
                    activation_link = request.build_absolute_uri(link)
                   # print(request.build_absolute_uri('/static/images/EllogonLogo.svg'))
                    content = {"user": (user.first_name+" "+user.last_name), "link": activation_link,

                               "email": request.data['email'],
                               "baseurl": request.build_absolute_uri("/")[:-1],
                               "ellogon_logo": request.build_absolute_uri('/static/images/EllogonLogo.svg')}  # path?
                    activation_alert = EmailAlert(request.data['email'], (user.first_name+" "+user.last_name), content)
                    activation_alert.send_activation_email()
                    json = {"success": True, "message": "You were successfully registered"}
                    return Response(json, status=status.HTTP_200_OK)
                except Exception as e:
                    user.delete()
                    print(e)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        print(request.data)
        try:

            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# ?
class ActivationView(View):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, uidb64, token):
        id = force_text(urlsafe_base64_decode(uidb64))
        user = Users.objects.get(pk=id)
        if ((not account_activation_token.check_token(user, token)) or user.is_active):
            print(user.is_active)
            return HttpResponse('<h1>Your account has been already activated</h1>')  # return correct page?
        user.is_active = True
        user.save()
        return HttpResponse('<h1>Your account activated successfully</h1>')  # return correct page?


class ChangePassword(APIView):

    def post(self, request):
        try:
            email = request.user
            user = Users.objects.get(email=email)
            data = {"email": email, "password": request.data['old_password']}
            r = requests.post(request.build_absolute_uri(reverse('auth_token_obtain')),
                              data=data)
            if (r.status_code == 200):
                user.set_password(request.data["new_password"])
                user.save()
                return Response(data={"success": True, "message": "Your password was successfully updated"},
                                status=status.HTTP_200_OK)
            else:
                return Response(data={"success": False, "message": "Your current password does not match"},
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(data={"success": False, "message": "Your current password does not match"},
                            status=status.HTTP_400_BAD_REQUEST)


class InitPasswords(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        users=Users.objects.all()
        for user in users:
            password = Users.objects.make_random_password()
            user.set_password(password)
            user.save()
            user_ref=user.first_name+" "+user.last_name
            content = {"user": user_ref, "password": password, "email": user.email,
                       "baseurl": request.build_absolute_uri("/")[:-1],
                       "ellogon_logo": request.build_absolute_uri('/static/frontend/images/EllogonLogo.svg')}
            reset_alert = EmailAlert(user.email, user.first_name, content)
            reset_alert.send_resetpassword_email()
        return Response(data={"success": True, "message": "All passwords reset"}, status=status.HTTP_200_OK)
        # except Exception as e:
        # print(e)
        # return Response(data={"success": False, "message": "no account with this email found"},
        #                 status=status.HTTP_200_OK)


class ResetPassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            email = request.data["email"]
            user = Users.objects.get(email=email)
            password = Users.objects.make_random_password()
            user.set_password(password)
            user.save()
            user_ref = user.first_name + " " + user.last_name
            content = {"user": user_ref, "password": password, "email": email,
                       "baseurl": request.build_absolute_uri("/")[:-1],
                       "ellogon_logo": request.build_absolute_uri('/static/frontend/images/EllogonLogo.svg')}
            reset_alert = EmailAlert(email,user_ref, content)
            reset_alert.send_resetpassword_email()
            return Response(data={"success": True, "message": "reset password success"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(data={"success": False, "message": "no account with this email found"},
                            status=status.HTTP_200_OK)


class ManageProfileView(APIView):
    def get(self, request):
        print(request.user)
        return Response(status=status.HTTP_200_OK)

class Me(APIView):

    def get(self, request):
        try:
            user = Users.objects.get(email=request.user)
            return Response(data={"success": True, "data": {"id":user.pk,"email":user.email,"permissions":user.permissions,"last_login":user.last_login,
                              "first_name":user.first_name,"last_name":user.last_name,"created_at":user.created_at,"updated_at":user.updated_at

                                                            }},
                            status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(data={"success": False, "message": "no account with this email found"},
                            status=status.HTTP_200_OK)

class ReturnStatistics(APIView):
    def get(self, request):
        annotations_counter = 0
        collections_counter=0
        documents_counter=0
        try:
            owner = Users.objects.get(email=request.user)
            collections = Collections.objects.filter(owner_id=owner)
            documents = Documents.objects.filter(owner_id=owner)
            annotation_col = get_collection_handle(db_handle, "annotations")
            annotations= annotation_col.find({"owner_id":owner.pk})
            annotations_counter = annotations.count(True)
            # for document in documents:
            #     annotations=annotation_col.find({"document_id":document.pk})
            #     for annotation in annotations:
            #             annotations_counter = annotations_counter + 1
            collections_counter = collections.count()
            documents_counter = documents.count()
        except Exception as ex:
            return Response(data={"success": True, "collections": collections_counter, "documents": documents_counter,
                                  "annotations": annotations_counter},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True, "collections": collections_counter, "documents": documents_counter,
                              "annotations": annotations_counter},
                        status=status.HTTP_200_OK)


# 2 & 3
class HandleCollection(APIView):
    # def patch():
    def delete(self, request, collection_id):   #delete shared with me collection??
        try:
            collection = Collections.objects.filter(id=collection_id)
            if not collection.exists():
                print("HandleCollection (delete): Wrong collection id")
                return Response(data={"success": False}, status=status.HTTP_400_BAD_REQUEST)
            annotations = get_collection_handle(db_handle, "annotations")
            annotations_temp = get_collection_handle(db_handle, "annotations_temp")
            documents = Documents.objects.filter(collection_id=collection.get())
        except Exception as ex:
            print("HandleCollection (delete):" + str(ex))
            return Response(data={"success": False}, status=status.HTTP_400_BAD_REQUEST)
        for document in documents:
            annotations.delete_many({"document_id":document.pk})
            annotations_temp.delete_many({"document_id":document.pk})
        collection.delete()
        return Response(data={"success": True}, status=status.HTTP_200_OK)

    def patch(self, request, collection_id):   #delete shared with me collection??
        try:
            collection = Collections.objects.filter(id=collection_id)
            if not collection.exists():
                #print("HandleCollection (delete): Wrong collection id")
                return Response(data={"success": False,"exists":False,"flash":"An error occured"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as ex:
            print("HandleCollection (delete):" + str(ex))
            return Response(data={"success": False,"exists":False,"flash":"An error occured"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            collection_queryset=Collections.objects.filter(name=request.data["name"])
            if(collection_queryset.exists()):
                return Response(data={"success": True, "exists": True,
                                      "flash": "The name you selected already exists. Please select a new name"},
                                status=status.HTTP_200_OK)


            serializer=CollectionsSerializer(collection.get(),data={"name":request.data["name"]},partial=True)
            if serializer.is_valid():
                project = serializer.save()
                return Response(data={"success": True,"exists":False}, status=status.HTTP_200_OK)
        except Exception as ex:
            print("HandleCollection (delete):" + str(ex))
            return Response(data={"success": True,"exists":True,"flash":"An error occured"}, status=status.HTTP_200_OK)




# 4 & 5
class HandleCollections(APIView):
    def get(self, request):
        collection_data = {}
        collections_lst=[]
        try:
            owner = Users.objects.get(email=request.user)
            collections = Collections.objects.filter(owner_id=owner)
            print(collections)
            print(1)
            myshared_collections = SharedCollections.objects.filter(fromfield=owner)
            print(2)
            shared_collections = SharedCollections.objects.filter(tofield=owner)
        except Exception as ex:
            print("HandleCollections (GET):" + str(ex))
            return Response(data={"success": False}, status=status.HTTP_400_BAD_REQUEST)
        for collection in collections:
            collection_data["id"] = collection.pk
            collection_data["name"] = collection.name
            collection_data["handler"] = collection.handler
            collection_data["encoding"] = collection.encoding
            collection_data["owner_id"] = (collection.owner_id).pk
            confirmed = None
            sc = myshared_collections.filter(collection_id=collection)
            if (sc.exists()):
                confirmed = (sc.get()).confirmed
            else:
                confirmed=None

            collection_data["confirmed"] =confirmed
            collection_data["is_owner"] = 1
            documents = Documents.objects.filter(collection_id=collection)
            collection_data["document_count"] = documents.count()
            #print(collection_data)
            print(collections_lst)
            print("\n")
            collections_lst.append(collection_data)
            collection_data={}
        for tsc in shared_collections:
                if(tsc.confirmed==0):
                    continue
                c1=Collections.objects.get(pk=tsc.collection_id.pk)
                collection_data["id"] = c1.pk
                collection_data["name"] = c1.name
                collection_data["handler"] = c1.handler
                collection_data["encoding"] = c1.encoding
                collection_data["owner_id"] = (c1.owner_id).pk
                collection_data["confirmed"] = 1
                collection_data["is_owner"] = 0
                documents = Documents.objects.filter(collection_id=c1)
                collection_data["document_count"] = documents.count()
                collections_lst.append(collection_data)
                collection_data = {}
        return Response(data={"success": True, "data": collections_lst}, status=status.HTTP_200_OK)

    def post(self, request):  # overwrite???
        new_data = {}
        try:
            data = request.data
            owner = Users.objects.get(email=request.user)
        except Exception as ex:
            print("HandleCollections (POST):" + str(ex))
            return Response(data={"success": False,"message":str(ex)}, status=status.HTTP_400_BAD_REQUEST)

        collection = Collections.objects.filter(owner_id=owner, name=data["name"])
        if(collection.exists() and data["overwrite"]==False):
            return Response(data={"success": True,"exists":True,"collection_id":collection.get().pk}, status=status.HTTP_200_OK)
        if (collection.exists() and data["overwrite"] == True):
            c1=collection.get()
            docs=Documents.objects.filter(collection_id=c1)
            for doc in docs:
                doc.delete()
            return Response(data={"success": True, "exists": True, "collection_id": collection.get().pk,"overwrite":True},
                            status=status.HTTP_200_OK)
        new_data["name"] = data["name"]
        new_data["encoding"] = data["encoding"]
        new_data["handler"] ="none"
        if (isinstance(data["handler"],str)==True):
            new_data["handler"]=data["handler"]
        else:
            if (isinstance(data["handler"], dict) == True and "value" in data["handler"].keys() ):

                    new_data["handler"] = data["handler"]["value"]
            else:
                new_data["handler"] =None

        if ("created_at" in data):
            new_data["created_at"]=transformdate(data["created_at"])
        if ("updated_at" in data):
            new_data["updated_at"]=transformdate(data["updated_at"])

        new_data["owner_id"] = owner.pk

        serializer = CollectionsSerializer(data=new_data)
        if serializer.is_valid():
            collection = serializer.save()
            return Response(data={"success": True, "collection_id": collection.pk,"exists":False})  # "exists":false sto output??

        return Response(data={"success": False}, status=status.HTTP_400_BAD_REQUEST)


class ExistCollection(APIView):
    def get(self,request,collection_name):
        try:
            owner = Users.objects.get(email=request.user)
            duplicateCollection = Collections.objects.filter(owner_id=owner, name=collection_name)
            if (duplicateCollection.exists()):
                duplicateCollectionInstance=duplicateCollection.get()
                return Response(data={"success": True, "exists": True, "flash":"The name you selected already exists. Please select a new name","data":{"name":duplicateCollectionInstance.name,"id":duplicateCollectionInstance.pk,
                                                 "encoding":duplicateCollectionInstance.encoding,"handler":duplicateCollectionInstance.handler,"created_at":duplicateCollectionInstance.created_at,
                                                 "updated_at":duplicateCollectionInstance.updated_at,"owner_id":duplicateCollectionInstance.owner_id.pk

                                                                                                                                                        }},
                                status=status.HTTP_200_OK)
            else:
                return Response(data={"success": True, "exists": False})
        except Exception as ex:
            return Response(data={"success": False,"message":str(ex)}, status=status.HTTP_200_OK)


# 6 & 7
class HandleDocuments(APIView):


    def get(self, request, collection_id):
        try:
            documents = Documents.objects.get(id=collection_id)
        except Exception as ex:
            return Response(data={"HandleDocuments :" + str(ex)}, status=status.HTTP_404_NOT_FOUND)
        return Response(data={"success": True, "data": documents}, status=status.HTTP_200_OK)

    def post(self, request,collection_id):
        new_data = {}
        try:
            data = request.data
            print(data)
            owner = Users.objects.get(email=request.user)
            new_data["name"] = data["name"]
            new_data["external_name"] = data["external_name"]
            new_data["type"] = None
            if ("type" in data):
                new_data["type"] = data["type"].lower()
            new_data["metadata"]=None
            if ("metadata" in data):
                new_data["metadata"] =data["metadata"]
            new_data["data_text"]=None
            if ("data_text" in data):
                new_data["data_text"] =data["data_text"]
            new_data["version"]=1
            if ("version" in data):
                new_data["version"] = data["version"]
            #new_data["data_binary"]=None
            #if ("data_binary" in data):
             #   new_data["data_binary"] = data["data_binary"]
            new_data["visualisation_options"]=None
            c=Collections.objects.get(pk=collection_id)
            d=Documents.objects.filter(name=new_data["name"],external_name=new_data["external_name"],collection_id=c)
            v=1
            name=new_data["name"]
            ext_name=data["external_name"]
            while(d.exists()):
                new_data["name"]=name+str(v)
                new_data["external_name"] = ext_name + str(v)
                d = Documents.objects.filter(name=new_data["name"], external_name=new_data["external_name"],
                                             collection_id=c)
                v=v+1


            new_data["text"] = data["text"]
            if (new_data["type"] == "tei xml"):
                if ("visualisation_options" in data):
                    new_data["visualisation_options"]=data["visualisation_options"]
                else:
                    handler = HandlerClass(new_data["text"],  new_data["type"])
                    new_data["visualisation_options"]=handler.apply()
            new_data["collection_id"] = collection_id

            new_data["encoding"] = data["encoding"]
            new_data["handler"] = "none"
            if("handler" in data):
                if (isinstance(data["handler"], str) == True):
                    new_data["handler"] = data["handler"]
                else:
                    if (isinstance(data["handler"], dict) == True and "value" in data["handler"].keys()):

                        new_data["handler"] = data["handler"]["value"]
                    else:
                        new_data["handler"] = None
            else:
                new_data["handler"] = None

            if ("created_at" in data):
                new_data["created_at"] = transformdate(data["created_at"])
            if ("updated_at" in data):
                new_data["updated_at"] = transformdate(data["updated_at"])
            new_data["owner_id"] = owner.pk

            if( "updated_by" in data):
                u=Users.objects.get(email=data["updated_by"])
                new_data["updated_by"] = u.pk
            else:
                new_data["updated_by"] = owner.pk

            #annotation args?





        except Exception as ex:
            print("HandleDocuments (POST):" + str(ex))
            return Response(data={"success": False}, status=status.HTTP_400_BAD_REQUEST)


        serializer = DocumentsSerializer(data=new_data)
        if serializer.is_valid():
            instancedoc=serializer.save()
            return Response(data={"success": True,"collection_id":collection_id,"document_id":instancedoc.pk})
        print(serializer.errors)
        return Response(data={"success": False}, status=status.HTTP_400_BAD_REQUEST)




# 8 & 9
class HandleDocument(APIView):


    def delete(self, request,collection_id,document_id):
        try:
            document = Documents.objects.filter(id=document_id)
            if not document.exists():
                print("HandleDocument (delete): Wrong document_id")
                return Response(data={"deleted": False}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            print("HandleDocument (delete):" + str(ex))
            return Response(data={"deleted": False}, status=status.HTTP_400_BAD_REQUEST)
        document.delete()
        return Response(data={"success": True}, status=status.HTTP_200_OK)

    def get(self, request,collection_id,document_id):
        try:
            #doc_record={}
            document = Documents.objects.get(id=document_id)
            doc_record=model_to_dict(document)



        except Exception as ex:
            return Response(data={"HandleDocument :" + str(ex)}, status=status.HTTP_404_NOT_FOUND)
        return Response(data={"success": True, "data": doc_record}, status=status.HTTP_200_OK)









class ShareCollectionView(APIView):
    def post(self, request, collection_id):
        try:
            data = request.data
            fromuser = Users.objects.get(email=request.user)
            touser = Users.objects.get(email=data["to"])
            collection = (Collections.objects.filter(pk=data["cid"], name=data["cname"])).get()
            sharecollection = SharedCollections.objects.filter(collection_id=collection,fromfield=fromuser,tofield=touser)
        except Exception as e:
            print(e)
            return Response(data={"success": False, "message": "An error occured.Invitation email has not been sent."},
                            status=status.HTTP_200_OK)
        if fromuser.pk == touser.pk:
            return Response(data={"success": False, "message": "You cannot share a collection with yourself."},
                            status=status.HTTP_200_OK)

        if sharecollection.exists():
            return Response(
                data={"success": False, "message": "You have already shared this collection to the user."},
                                 status=status.HTTP_200_OK)
        #     for sc in sharecollections:
        #         if sc.tofield == touser:
        #             return Response(
        #                 data={"success": False, "message": "You have already shared this collection to the user."},
        #                 status=status.HTTP_200_OK)
        uidb64 = urlsafe_base64_encode(force_bytes(fromuser.pk))
        usidb64 = urlsafe_base64_encode(force_bytes(touser.pk))
        upidb64 = urlsafe_base64_encode(force_bytes(collection_id))
        invitation_token.make_my_hash_value(touser.pk, collection_id)
        token = invitation_token.make_token(fromuser)
        link = reverse('api_collection_share_verify',
                       kwargs={'uidb64': uidb64, "usidb64": usidb64, "upidb64": upidb64,"collection_id":collection_id,'token': token})
        invitation_link = request.build_absolute_uri(link)
        # confirmation_code=str
        print(token)
        print(link)
        confirmation_code = uidb64 + "/" + usidb64 + "/" + upidb64 + "/" + token
        data = {"confirmed": 0, "confirmation_code": confirmation_code, "collection_id": collection.pk,
                "fromfield": fromuser.pk, "tofield": touser.pk}
        #
        serializer = SharedCollectionsSerializer(data=data)
        if serializer.is_valid():
            shared_collection = serializer.save()
            content = {"user": touser.first_name, "link": invitation_link, "owner": fromuser.first_name,
                       "collection": collection.name, "email": touser.email,
                       "baseurl": request.build_absolute_uri("/")[:-1],
                       "ellogon_logo": request.build_absolute_uri('/static/images/EllogonLogo.svg')}
            invitation_alert = EmailAlert(touser.email, touser.first_name, content)
            invitation_alert.send_sharecollection_email()
            return Response(data={"success": True}, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(data={"success": False, "message": "An error occured.Invitation email has not been sent."},
                        status=status.HTTP_200_OK)

    def get(self, request, collection_id):
        collection = Collections.objects.get(pk=collection_id)
        user=Users.objects.get(email=request.user)
        sharecollections = SharedCollections.objects.filter(collection_id=collection, fromfield=user)
        records = []
        for item in sharecollections:
            records.append(
                {"id": item.pk, "collection_id": (item.collection_id).pk, "to": (item.tofield).pk, "confirmed": item.confirmed})
        return Response(data={"success": True, "data": records}, status=status.HTTP_200_OK)


class SharedCollectionDelete(APIView):
    def delete(self, request, collection_id, share_id):
        sharecollection = SharedCollections.objects.get(pk=share_id)
        sharecollection.delete()
        return Response(data={"success": True}, status=status.HTTP_200_OK)


class AcceptCollectionView(View):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request,collection_id,uidb64, usidb64, upidb64, token):
        try:
            id = force_text(urlsafe_base64_decode(uidb64))
            ids = force_text(urlsafe_base64_decode(usidb64))
            idp = force_text(urlsafe_base64_decode(upidb64))
            owner = Users.objects.get(pk=id)
            shared_user = Users.objects.get(pk=ids)
            collection = Collections.objects.get(pk=idp)
            shared_collection = (
                SharedCollections.objects.filter(collection_id=collection, fromfield=owner, tofield=shared_user)).get()
        except Exception as e:
            return HttpResponse('<h1>The requested invitation does not exist!</h1>')  # return correct page?
        confirmed = shared_collection.confirmed
        if (confirmed == False):
            shared_collection.confirmed = True
            shared_collection.save()
            return HttpResponse(
                '<h1>You have successfully accepted the invitation! Start the annotation!</h1>')  # return correct page?

        return HttpResponse('<h1>The requested invitation has already been accepted!</h1>')  # return correct page?


class OpenDocumentView(APIView):
    def get(self, request):
        try:
            user = Users.objects.get(email=request.user)
            opendocuments=OpenDocuments.objects.all()
            records=[]
            for opendocument in opendocuments:
                collection=Collections.objects.get(pk=(opendocument.collection_id).pk)
                if(opendocument.user_id==user.pk):
                    opened=1
                else:
                    opened=0
                shared_collection_queryset=(SharedCollections.objects.filter(collection_id=collection))
                shared_count=0
                confirmed_lst=[]
                for shared_collection in shared_collection_queryset:
                        confirmed_lst.append(shared_collection.confirmed)
                        shared_count=shared_count+1
                if(shared_count==0):
                    shared_count=1
                    confirmed_lst.append(None)
                for j in range(shared_count):
                        records.append({"collection_id":(opendocument.collection_id).pk,
                            "document_id":(opendocument.document_id).pk,
                             "annotator_type":opendocument.annotator_type,
                                "db_interactions":opendocument.db_interactions,
                                "opened":opened,"confirmed":confirmed_lst[j]

                                })
        except Exception as e:
            return Response(data={"success": False, "data": []}, status=status.HTTP_200_OK)
        return Response(data={"success": True, "data": records}, status=status.HTTP_200_OK)




    def post(self, request):
        try:
            data = request.data
            collection = Collections.objects.get(pk=data["collection_id"])
            document = Documents.objects.get(pk=data["document_id"])
            user = Users.objects.get(email=request.user)
            opendocument = OpenDocuments.objects.filter(user_id=user.pk, collection_id=collection, document_id=document)
            data = {"annotator_type": request.data["annotator_type"], "user_id": user.pk,
                    "collection_id": collection.pk, "document_id": document.pk, "db_interactions": 0,
                    "updated_at": datetime.now()}
            if (not (opendocument.exists())):
                serializer = OpenDocumentsSerializer(data=data)
                if serializer.is_valid():
                    opendocument = serializer.save()
            else:
                 serializer = OpenDocumentsSerializer(opendocument.get(),data=data,partial=True)

            return Response(data={"success": True})

        except Exception as e:
            return Response(data={"success": False, "message": "An error occured."},
                            status=status.HTTP_200_OK)


class CollectionDataView(APIView):
    def get(self, request):
        try:
            user = Users.objects.get(email=request.user)
            collections = Collections.objects.filter(owner_id=user)
            shared_collections = SharedCollections.objects.filter(fromfield=user)
            doc_records = []
            confirmed = None
            for collection in collections:
                myshared_collection = shared_collections.filter(collection_id=collection)
                if (myshared_collection.exists()):
                    confirmed = (myshared_collection.get()).confirmed
                documents = Documents.objects.filter(collection_id=collection, owner_id=user)
                for document in documents:
                    doc_records.append({"id": document.pk, "name": document.name, "collection_id": collection.pk,
                                        "collection_name": collection.name,
                                        "owner_id": (document.owner_id).pk,
                                        "confirmed": confirmed, "is_owner": 1})
                confirmed = None
            shared_collections = SharedCollections.objects.filter(tofield=user, confirmed=1)
            #print(shared_collections)
            for shared_collection in shared_collections:
                collection = Collections.objects.get(pk=(shared_collection.collection_id).pk)
               # print(collection)
                documents = Documents.objects.filter(collection_id=collection)
                for document in documents:
                    doc_records.append({"id": document.pk, "name": document.name, "collection_id": collection.pk,
                                        "collection_name": collection.name,
                                        "owner_id": (document.owner_id).pk,
                                        "confirmed": 1, "is_owner": 0})
        except Exception as e:
            print(e)
            return Response(data={"success": False, "message": "An error occured."},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True, "data": doc_records}, status=status.HTTP_200_OK)
        # sharedcollections=SharedCollections.objects.filter()


class ButtonAnnotatorView(APIView):
    def get(self, request):

        try:
            user = Users.objects.get(email=request.user)
            button_annotator = (ButtonAnnotators.objects.filter(user_id=user)).get()
            btn_data = {"language": button_annotator.language, "annotation_type": button_annotator.annotation_type,
                        "attribute": button_annotator.attribute, "alternative": button_annotator.alternative}
        except Exception as e:
            return Response(data={"success": True, "data": None},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True, "data": btn_data}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            user = Users.objects.get(email=request.user)
            button_annotator = ButtonAnnotators.objects.filter(user_id=user)
            data = {"language": request.data["language"], "annotation_type": request.data["annotation_type"],
                    "attribute": request.data["attribute"], "alternative": request.data["alternative"],
                    "updated_at": datetime.now()}
            if (not (button_annotator.exists())):
                data["user_id"] = user.pk
                serializer = ButtonAnnotatorsSerializer(data=data)
                if serializer.is_valid():
                    btn_annotator = serializer.save()
            else:
                serializer = ButtonAnnotatorsSerializer(button_annotator.get(), data=data, partial=True)
                if serializer.is_valid():
                    btn_annotator = serializer.save()

            return Response(data={"success": True})

        except Exception as e:
            return Response(data={"success": False, "message": "An error occured."},
                            status=status.HTTP_200_OK)


class CoreferenceAnnotatorView(APIView):
    def get(self, request):

        try:
            user = Users.objects.get(email=request.user)
            coreference_annotator = (CoreferenceAnnotators.objects.filter(user_id=user)).get()
            coref_data = {"language": coreference_annotator.language,
                          "annotation_type": coreference_annotator.annotation_type,
                          "alternative": coreference_annotator.alternative}
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True, "data": coref_data}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            user = Users.objects.get(email=request.user)
            coreference_annotator = CoreferenceAnnotators.objects.filter(user_id=user)
            data = {"language": request.data["language"], "annotation_type": request.data["annotation_type"],
                    "alternative": request.data["alternative"],
                    "updated_at": datetime.now()}
            if not (coreference_annotator.exists()):
                data["user_id"] = user.pk
                serializer = CoreferenceAnnotatorsSerializer(data=data)
                if serializer.is_valid():
                    coref_annotator = serializer.save()
            else:
                serializer = CoreferenceAnnotatorsSerializer(coreference_annotator.get(), data=data, partial=True)
            return Response(data={"success": True})
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)



class SaveTempAnnotationView(APIView):
    def post(self, request, collection_id, document_id):
        try:
            collection = Collections.objects.get(pk=collection_id)
            document = Documents.objects.get(pk=document_id)
            user = Users.objects.get(email=request.user)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)}, status=status.HTTP_200_OK)

        annotations_temp = get_collection_handle(db_handle, "annotations_temp")
        if type(request.data) == list:
            annotations_temp.insert_many(request.data)
        if type(request.data) == dict:
            annotations_temp.insert_one(request.data)
            opendocument = (
                OpenDocuments.objects.filter(collection_id=collection, document_id=document, user_id=user.pk)).get()
            opendocument.db_interactions = opendocument.db_interactions + 1
            opendocument.save()
        return Response(data={"success": True})


class HandleTempAnnotationView(APIView):
    def delete(self, request, collection_id, document_id, param):
        try:
            collection = Collections.objects.get(pk=collection_id)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)}, status=status.HTTP_200_OK)
        try:
            document = Documents.objects.get(pk=document_id)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)}, status=status.HTTP_200_OK)
        try:
            annotations_temp = get_collection_handle(db_handle, "annotations_temp")
            annotations = get_collection_handle(db_handle, "annotations")
            annotations_temp.delete_one({"_id": param})
            r = annotations.find({"_id": param})
            if r.count() > 0:
                for r1 in r:
                    annotations.delete_one(r1)
            user = Users.objects.get(email=request.user)
            opendocument = (
                OpenDocuments.objects.filter(collection_id=collection, document_id=document, user_id=user.pk)).get()
            opendocument.db_interactions = opendocument.db_interactions + 1
            opendocument.save()
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True})

    def put(self, request, collection_id, document_id, param):
        try:
            collection = Collections.objects.get(pk=collection_id)
            document = Documents.objects.get(pk=document_id)
            user = Users.objects.get(email=request.user)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)}, status=status.HTTP_200_OK)
        try:
            annotations_temp = get_collection_handle(db_handle, "annotations_temp")
            filter = {"_id": param}
            newvalues = {"$set": request.data}
            annotations_temp.update_one(filter, newvalues)
            opendocument = (
                OpenDocuments.objects.filter(collection_id=collection, document_id=document, user_id=user.pk)).get()
            opendocument.db_interactions = opendocument.db_interactions + 1
            opendocument.save()
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True})

    def get(self, request, collection_id, document_id, param):
        records = []
        cid_int = int(collection_id)
        did_int = int(document_id)
        try:
            annotations_temp = get_collection_handle(db_handle, "annotations_temp")
            getfilter = {"collection_id": cid_int, "document_id": did_int, "annotator_id": param}
            print(getfilter)
            getquery = annotations_temp.find(getfilter)
            print(getquery.count())
            for item in getquery:
                records.append(item)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True, "data": records},
                        status=status.HTTP_200_OK)

class OpenDocumentUpdate(APIView):
    def get(self,request,document_id,Button_Annotator_name):
            data=[]
            try:
                user = Users.objects.get(email=request.user)
                document=Documents.objects.get(pk=document_id)
                opendocument_queryset=OpenDocuments.objects.filter(user_id=user.pk,document_id=document)
                opendocument=opendocument_queryset.get()
                collection_id=(opendocument.collection_id).pk
                shared_collections=SharedCollections.objects.filter(collection_id=(opendocument.collection_id).pk)
                confirmed=None

                for shared_collection in shared_collections:
                    print(shared_collection.fromfield.pk)
                    print(shared_collection.confirmed)
                    print(user.pk)
                    if((shared_collection.fromfield).pk==user.pk):
                        confirmed=shared_collection.confirmed
                        break
                    if ((shared_collection.tofield).pk == user.pk):
                        #print(shared_collection.confirmed)
                        confirmed = shared_collection.confirmed
                        break
                #for opendocument in opendocument_queryset:




                data.append({"collection_id":collection_id,"document_id":int(document_id),"db_interactions":opendocument.db_interactions,
                                 "annotator_type":Button_Annotator_name,"confirmed":confirmed,"opened":1})
                opendocument.db_interactions=0
                opendocument.updated_at=datetime.now()
                opendocument.save()
            except Exception as e:
                print(e)
                return Response(data={"success": True, "data":data},
                                status=status.HTTP_200_OK)
            return Response(data={"success": True, "data": data},
                            status=status.HTTP_200_OK)

    # annotations_temp.delete_one

class DeleteSavedAnnotations(APIView):
    def delete(self, request, collection_id, document_id, Button_Annotator_name):
        records = []
        try:
            annotations_temp = get_collection_handle(db_handle, "annotations_temp")
            annotations = get_collection_handle(db_handle, "annotations")
            getfilter = {"collection_id": int(collection_id), "document_id": int(document_id),
                         "annotator_id": Button_Annotator_name}
            getquery = annotations_temp.find(getfilter)
            for item in getquery:
                record = annotations.find(item)
                for annotation in record:
                    annotations_temp.delete_one(annotation)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True})







class DocumenAnnotationView(APIView):
    def get(self, request, collection_id, document_id):

        records=[]
        try:
            annotations = get_collection_handle(db_handle, "annotations")
            collection=Collections.objects.get(pk=collection_id)
            document=Documents.objects.get(pk=document_id)
            user=Users.objects.get(email=request.user)
            opendocument=(OpenDocuments.objects.filter(collection_id=collection,document_id=document,user_id=user.pk)).get()
            annotator_id=opendocument.annotator_type
            print("here")
            print(type(collection_id))
            cid=int(collection_id)
            did=int(document_id)
            #print(document_id)
            getfilter = {"collection_id": cid, "document_id": did}
            getquery = annotations.find(getfilter)
            for item in getquery:
                item["_id"]=str(item["_id"])
                records.append(item)
        except Exception as e:
            print(e)
            return Response(data={"success": True, "data": records},

                            status=status.HTTP_200_OK)
        print(records)
        return Response(data={"success": True, "data": records},

                        status=status.HTTP_200_OK)

    def post(self, request, collection_id, document_id):


        # try:
        #     collection = Collections.objects.get(pk=collection_id)
        # except Exception as e:
        #     return Response(data={"success": False, "message": "An error occured." + str(e)}, status=status.HTTP_200_OK)
        # try:
        #     document = Documents.objects.get(pk=document_id)
        # except Exception as e:
        #     return Response(data={"success": False, "message": "An error occured." + str(e)}, status=status.HTTP_200_OK)
        try:
            annotations_temp = get_collection_handle(db_handle, "annotations_temp")
            annotations = get_collection_handle(db_handle, "annotations")
            data = request.data
            for item in data:
                record = annotations_temp.find({"_id": item["_id"]})
                for temp_annotation in record:
                    record2 = annotations.find({"_id": temp_annotation["_id"]})
                    for annotation in record2:
                        annotations.delete_one(annotation)
                    annotations.insert_one(temp_annotation)
        except Exception as e:
            return Response(data={"success": False, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True})

# class ImportCollectionView(APIView):
#     def post(self,request):
#         user = Users.objects.get(email=request.user)
#         return Response(data={"hello": "world"}, status=status.HTTP_200_OK)

class ImportAnnotationsView(APIView):
    def post(self,request,collection_id,document_id):
        annotations=request.data["data"]
        if (isinstance(annotations, list) == True):
            if (len(annotations)>0):
                col_annotations = get_collection_handle(db_handle, "annotations")
                exclude_keys = ['_id', 'collection_id', 'document_id']
                for item in annotations:
                    new_item={k: item[k] for k in set(list(item.keys())) - set(exclude_keys)}
                    new_item['collection_id']=int(collection_id)
                    new_item["document_id"]=int(document_id)
                    col_annotations.insert_one(new_item)
                return Response(data={"success": True},status=status.HTTP_200_OK)
                    #item["collection_id"]=collection_id
                    #item["document_id"]=document_id
        return Response(data={"success": False,"message":"Invalid Annotations"}, status=status.HTTP_200_OK)


class ExportCollectionView(APIView):
    def get(self, request, collection_id):
        data = {}
        try:
            collection = Collections.objects.get(pk=collection_id)
            annotations = get_collection_handle(db_handle, "annotations")
            # collection = model_to_dict(collection)
            for attr, value in collection.__dict__.items():
                if not attr == "_state":
                    # print("Record1 is " + str(attr) + " = " + str(value))
                    data[attr] = value
            documents = Documents.objects.filter(collection_id=collection)
            doc_records = []
            doc_record = {}
            document_annotations = []
            for document in documents:
                for attr, value in document.__dict__.items():
                    if not attr == "_state":
                        print(attr)
                        if (attr=="owner_id_id"):
                            attr="owner_id"
                        if(attr=="collection_id_id"):
                            attr="collection_id"
                        # print("Record2 is " + str(attr) + " = " + str(value))
                        doc_record[attr] = value
                annotation_cur = annotations.find({"document_id": document.pk})
                for annotation in annotation_cur:
                    annotation["_id"] = str(annotation["_id"])
                    document_annotations.append(annotation)
                doc_record["annotations"] = document_annotations
                doc_records.append(doc_record)
                document_annotations = []
                doc_record = {}
            data["documents"] = doc_records
        except Exception as e:
            return Response(data={"success": True, "message": "An error occured." + str(e)},
                            status=status.HTTP_200_OK)
        return Response(data={"success": True, "message": "ok", "data": data},
                        status=status.HTTP_200_OK)



import os
import pandas as pd

def str2date(strdate):
    try:
            dt_tuple = tuple([int(x) for x in strdate[:10].split('-')]) + tuple([int(x) for x in strdate[11:].split(':')])
            #print(dt_tuple)
            datetimeobj = datetime(*dt_tuple)
    except Exception as e:
        datetimeobj = datetime.now()
    return datetimeobj

def transformdate(datetime_str):
        datetime_parts = datetime_str.split("T")
        # print(datetime_parts)
        date_segment = datetime_parts[0]
        time_segment=((datetime_parts[1][0:len(datetime_parts[1])-1]).split("."))[0]
        # print(date_segment)
        # print(time_segment)
        date_parts = date_segment.split("-")
        date_parts[0] = int(date_parts[0])
        for i in range(1, len(date_parts)):
            if (date_parts[i][0] == "0"):
                date_parts[i] = date_parts[i][1:]
            date_parts[i] = int(date_parts[i])

        time_parts = time_segment.split(":")
        for i in range(0, len(time_parts)):
            if (time_parts[i][0] == "0"):
                time_parts[i] = time_parts[i][1:]
            time_parts[i] = int(time_parts[i])
        # print(date_parts)
        # print(time_parts)
        output_datetime = datetime(date_parts[0], date_parts[1], date_parts[2], time_parts[0], time_parts[1],
                                            time_parts[2])
        return output_datetime
    #  cwd = os.getcwd()






class MainView(APIView):







    def get(self, request):

        return Response(data={"hello": "world"}, status=status.HTTP_200_OK)
       #  cwd = os.getcwd()
       #  print(cwd)
       #  df = pd.read_csv('./clarin_backend/data/coreference_annotators.csv')
       #  file="coreference_annotators"
       #  if(file=="users"):
       #      for index, row in df.iterrows():
       #          print(row)
       #
       #
       #          # print(str2date(row["last_login"]))
       #          # print(str2date(row["created_at"]))
       #
       #          #print(type(row["id"]))
       #          user=Users(pk=row["id"],username=row["email"],email=row["email"],first_name=row["email"],last_name=None,permissions=None,last_login=str2date(row["last_login"]),created_at=str2date(row["created_at"]),
       #          updated_at= str2date(row["updated_at"]))
       #          user.set_password("12345678")
       #          # print(user.created_at)
       #          # print(user.username)
       #          user.save()
       #  if (file == "collections"):
       #      for index, row in df.iterrows():
       #          print(row)
       #          user=Users.objects.get(pk=row["owner_id"])
       #          collection=Collections(pk=row["id"],name=row["name"],owner_id=user,encoding=row["encoding"],handler=row["handler"],created_at=str2date(row["created_at"]),
       #          updated_at= str2date(row["updated_at"]))
       #          collection.save()
       #  if (file == "documents"):
       #              for index, row in df.iterrows():
       #                  user = Users.objects.get(pk=row["owner_id"])
       #                  collection=Collections.objects.get(pk=row["collection_id"])
       #                  if(row["type"]!="tei xml" and row["type"]!="tei xml"):
       #                      typeval=None
       #                      visualisation_options=None
       #                      handler=None
       #                      data_text=None
       #                  else:
       #                      typeval=row["type"]
       #                      visualisation_options = row["visualisation_options"]
       #                      handler = row["handler"]
       #                      data_text=row["data_text"]
       #
       #
       #
       #                  document=Documents(pk=row["id"],name=row["name"],text=row["text"],data_binary=None,version=row["version"],encoding=row["encoding"],updated_by=row["updated_by"],
       #                                     external_name=row["external_name"],metadata=None,created_at=str2date(row["created_at"]),owner_id=user,collection_id=collection,handler=handler,
       #          updated_at= str2date(row["updated_at"]),type=typeval,visualisation_options=visualisation_options,data_text=data_text
       #
       #                                     )
       #
       #
       #                  document.save()
       #                  #print(row)
       #
       #  if (file == "shared_collections"):
       #
       #      for index, row in df.iterrows():
       #          print(row)
       #          fuser = Users.objects.get(email=row["from"])
       #          tuser=Users.objects.get(email=row["to"])
       #          collection = Collections.objects.get(pk=row["collection_id"])
       #
       #          shared_collection=SharedCollections(pk=row["id"],collection_id=collection,fromfield=fuser,tofield=tuser,confirmation_code=row["confirmation_code"],
       #                                              confirmed=row["confirmed"],created_at=str2date(row["created_at"]),
       #          updated_at= str2date(row["updated_at"]))
       #          shared_collection.save()
       #  if (file == "open_documents"):
       #              for index, row in df.iterrows():
       #                 # print(row)
       #                  collection = Collections.objects.get(pk=row["collection_id"])
       #                  document = Documents.objects.get(pk=row["document_id"])
       #                  open_document=OpenDocuments(user_id=row["user_id"],collection_id=collection,document_id=document,annotator_type=row["annotator_type"],db_interactions=row["db_interactions"],created_at=str2date(row["created_at"]),
       #          updated_at= str2date(row["updated_at"]))
       #                  open_document.save()
       #  if(file=="button_annotators"):
       #      for index, row in df.iterrows():
       #
       #          # if(t=="nan"):
       #          #     print("yyy")
       #          #print(type(t))
       #          user = Users.objects.get(pk=row["user_id"])
       #          button_annotator=ButtonAnnotators(user_id=user,language=row["language"],annotation_type=row["annotation_type"],attribute=row["attribute"],alternative=row["alternative"],
       #                                            created_at=str2date(row["created_at"]),
       #                                            updated_at=str2date(row["updated_at"])
       #                                            )
       #          button_annotator.save()
       #  if (file == "coreference_annotators"):
       #              for index, row in df.iterrows():
       #                  user = Users.objects.get(pk=row["user_id"])
       #                  coreference_annotator = CoreferenceAnnotators(user_id=user, language=row["language"],
       #                                                       annotation_type=row["annotation_type"],
       #                                                       alternative=row["alternative"],
       #                                                       created_at=str2date(row["created_at"]),
       #                                                       updated_at=str2date(row["updated_at"])
       #                                                       )
       #                  coreference_annotator.save()
       #
       #
       #                  #print(row)
       #
       #          # print("\n")
       #  #if(file=="collections"):
       #
       #  # print(request.META.get('HTTP_AUTHORIZATION') )
       # # token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]



       # print(request.user)
        # print(token)
        # data = {'token': token}
        # try:
        #     valid_data = VerifyJSONWebTokenSerializer().validate(data)
        #     print(valid_data)
        #     #user = valid_data['user']
        #     #request.user = user
        # except ValidationError as v:
        #     print("validation error", v)

        #return Response(data={"hello": "world"}, status=status.HTTP_200_OK)