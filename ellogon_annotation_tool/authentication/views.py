import os
import requests
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.template.loader import get_template
from django.views import View
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .send_email import EmailAlert
from django.contrib.sites.shortcuts import get_current_site
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.contrib.sites.shortcuts import get_current_site
from .utils import account_activation_token
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from .models import CustomUser


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
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                try:
                  ## Send an e-mail for activating the user!
                  json    = serializer.data
                  uidb64  = urlsafe_base64_encode(force_bytes(user.pk))
                  #id     = force_text(urlsafe_base64_decode(uidb64))
                  domain  = get_current_site(request).domain
                  token   = account_activation_token.make_token(user)
                  link    = reverse('user_activate', kwargs={'uidb64': uidb64, 'token': token})
                  activation_link = request.build_absolute_uri(link)
                  #print(activation_link)
                  content = {"user": user.username, "link": activation_link,  "email":request.data['email'],
                             "baseurl":request.build_absolute_uri("/")[:-1],
                             "ellogon_logo": request.build_absolute_uri('/static/frontend/images/EllogonLogo.svg')}
                  activation_alert = EmailAlert(request.data['email'], request.data["username"], content)
                  activation_alert.send_activation_email()
                  return Response(json, status=status.HTTP_201_CREATED)
                except Exception as e:
                  user.delete()
                  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class ActivationView(View):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request, uidb64, token):
        id = force_text(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=id)
        if ((not account_activation_token.check_token(user, token)) or user.is_active):
            print(user.isactive)
            return redirect('/')
        user.is_active = True
        user.save()
        return render(request, 'frontend/index.html')


class ChangePassword(APIView):

    def post(self, request):
        try:
            email = request.data["email"]
            user  = CustomUser.objects.get(email=email)
            data  = {"email": email, "password": request.data['old_password']}
            r     = requests.post(request.build_absolute_uri(reverse('user_token_obtain')),
                                  data =data)
            if (r.status_code==200):
                user.set_password(request.data["new_password"])
                user.save()
                return Response(data={"code": 1}, status=status.HTTP_200_OK)
            else:
                return Response(data={"code": 0}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"code": 0}, status=status.HTTP_200_OK)


class ResetPassword(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self,request):
        try:
           email    = request.data["email"]
           user     = CustomUser.objects.get(email=email)
           password = CustomUser.objects.make_random_password()
           user.set_password(password)
           user.save()
           content = {"user": user.username, "password": password, "email":email,
                      "baseurl":request.build_absolute_uri("/")[:-1],
                      "ellogon_logo": request.build_absolute_uri('/static/frontend/images/EllogonLogo.svg')}
           reset_alert = EmailAlert(email, user.username, content)
           reset_alert.send_resetpassword_email()
           return Response(data={"code": 1}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={"code": 0}, status=status.HTTP_200_OK)


class ManageProfileView(APIView):
    def get(self, request):
        return Response(status=status.HTTP_200_OK)

##
##  The following views have t be defined! (TODO)
##
class LoginView(View):
    def get(self, request):
        pass
        #template_path=os.path.abspath(os.path.join(cwd, os.pardir))+"/annotation_tool/frontend/templates/frontend/index.html"
        #return redirect('/sign-in')


class MainView(APIView):
    def get(self, request):
        return Response(data={"hello": "world"}, status=status.HTTP_200_OK)

