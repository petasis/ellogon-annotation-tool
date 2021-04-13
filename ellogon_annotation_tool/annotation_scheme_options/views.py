from django.http import HttpResponse
from django.shortcuts import render
import html
# Create your views here.
import requests
from .response_parsers import *
# base paths
from django.views import View
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
base_url="https://www.ellogon.org/"
btn_annotator_path="clarin-ellogon-services/annotation_scheme.tcl"
coreference_annotator_path="clarin-ellogon-services/annotation_scheme_multi.tcl"

def selecttype(type):
    if (type == "button"):
        return base_url + btn_annotator_path
    else:
       return base_url + coreference_annotator_path




class GetLanguages(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self,request,type):
        url=selecttype(type)
        r = requests.get(url)

        return Response(data={"languages": r.json()}, status=status.HTTP_200_OK)

class GetAnnotationTypes(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self,request,type):
        data = request.GET.dict()
        url = selecttype(type)+"/"+data["lang"]
        r = requests.get(url)

        return Response(data={"types": r.json()}, status=status.HTTP_200_OK)
class GetAnnotationAttributes(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self,request,type):
        data = request.GET.dict()
        url =base_url + btn_annotator_path+"/"+data["lang"]+"/"+data["type"]
        r = requests.get(url)

        return Response(data={"attributes": r.json()}, status=status.HTTP_200_OK)

class GetAttributeAlternatives(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self,request,type):
        data = request.GET.dict()
        if (type == "button"):
            url = selecttype(type)+"/"+data["lang"]+"/"+data["type"]+"/"+data["attribute"]

        else:
            url = selecttype(type)+"/"+data["lang"]+"/"+data["type"]
        r = requests.get(url)
        return Response(data={"attribute_alternatives": r.json()}, status=status.HTTP_200_OK)




class GetValues(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self,request,type):
        data = request.GET.dict()
        url = base_url + btn_annotator_path + "/" + data["lang"] + "/" + data["type"]+"/"+data["attribute"]+"/"+data["attribute_alternative"]
        r = requests.get(url)
        return Response(data={"values": r.json()}, status=status.HTTP_200_OK)

class GetAttributes(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self,request,type):
        data = request.GET.dict()
        url = base_url + coreference_annotator_path + "/" + data["lang"] + "/" + data["type"]+"/"+data["attribute_alternative"]
        r = requests.get(url)
        return Response(data={"attributes": r.json()}, status=status.HTTP_200_OK)

#class GetSchema(View):
class GetSchema(APIView):
    permission_classes = (permissions.AllowAny, )
    authentication_classes = ()


    def get(self, request, type):
        data = request.GET.dict()
        response={}
        if (type == "button"):
            url = "https://www.ellogon.org/clarin-ellogon-services/annotation_scheme_ui.tcl"
            params={"language":data["lang"],"annotation":data["type"],"attribute":data["attribute"],"alternative":data["attribute_alternative"]}
            r = requests.get(url, params)
            if(data["lang"]=="neutral" and data["type"]=="argument" and data["attribute"]=="type" and data["attribute_alternative"]=="Generic"):
                response=parse_button_relation_response(r.text)
            else:
                response=parse_button_response(r.text)
        else:
            url ="https://www.ellogon.org/clarin-ellogon-services/annotation_scheme_multi_ui.tcl"
            params = {"language": data["lang"], "annotation": data["type"], "alternative": data["attribute_alternative"]}
            r = requests.get(url,params)
            response=parsecorefresponse(r.text,params)

        #print(r.content)
       # return HttpResponse(html.unescape(r.text))
        return Response(data={"ui_structure": response,"kind":type,"params":params}, status=status.HTTP_200_OK)



